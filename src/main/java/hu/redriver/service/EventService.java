package hu.redriver.service;

import hu.redriver.domain.Event;
import hu.redriver.domain.enumeration.LinkType;
import hu.redriver.repository.EventRepository;
import hu.redriver.service.dto.ApplicationUserDTO;
import hu.redriver.service.dto.EventDTO;
import hu.redriver.service.mapper.EventMapper;
import io.undertow.util.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link Event}.
 */
@Service
@Transactional
public class EventService {

    private final Logger log = LoggerFactory.getLogger(EventService.class);

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final UserService userService;
    private final ApplicationUserService applicationUserService;
    private final ZoomAPIClientService zoomAPIClientService;

    public EventService(EventRepository eventRepository, EventMapper eventMapper, UserService userService, ApplicationUserService applicationUserService, ZoomAPIClientService zoomAPIClientService) {
        this.eventRepository = eventRepository;
        this.eventMapper = eventMapper;
        this.userService = userService;
        this.applicationUserService = applicationUserService;
        this.zoomAPIClientService = zoomAPIClientService;
    }

    /**
     * Save a event.
     *
     * @param eventDTO the entity to save.
     * @return the persisted entity.
     */
    public EventDTO save(EventDTO eventDTO) {
        log.debug("Request to save Event : {}", eventDTO);

        if (eventDTO.getStreamLinkType() == LinkType.ZOOM) {
            try {
                this.zoomAPIClientService.createMeeting(eventDTO);
            } catch (Exception e) {
                throw new RuntimeException(e.getMessage());
            }
        }

        Event event = eventMapper.toEntity(eventDTO);
        event = eventRepository.save(event);
        return eventMapper.toDto(event);
    }

    /**
     * Get all the events.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<EventDTO> findAll() {
        log.debug("Request to get all Events");
        return eventRepository.findAllWithEagerRelationships().stream()
            .map(eventMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get all the events with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<EventDTO> findAllWithEagerRelationships(Pageable pageable) {
        return eventRepository.findAllWithEagerRelationships(pageable).map(eventMapper::toDto);
    }

    /**
     * Get one event by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<EventDTO> findOne(Long id) {
        log.debug("Request to get Event : {}", id);
        return eventRepository.findOneWithEagerRelationships(id)
            .map(eventMapper::toDto);
    }

    /**
     * Delete the event by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Event : {}", id);
        eventRepository.deleteById(id);
    }

    public void join(Long id) throws BadRequestException {
        log.debug("Request to join Event : {}", id);
        EventDTO eventDTO = findOne(id).orElseThrow(getNotFoundException());

        if (eventDTO.getLimit() != null && eventDTO.getLimit().compareTo(eventDTO.getParticipants().size() + 1) < 0) {
            throw new BadRequestException();
        }

        eventDTO.getParticipants().add(getCurrentAppUser());
        save(eventDTO);
    }

    public void quit(Long id) {
        log.debug("Request to quit Event : {}", id);
        EventDTO eventDTO = findOne(id).orElseThrow(getNotFoundException());
        eventDTO.getParticipants().remove(getCurrentAppUser());
        save(eventDTO);
    }

    private ApplicationUserDTO getCurrentAppUser() {
        return applicationUserService.findOneByInternalUserId(
            userService.getUserWithAuthorities()
                .orElseThrow(getNotFoundException())
                .getId()
        ).orElseThrow(getNotFoundException());
    }

    private Supplier getNotFoundException() {
        return () -> {
            throw new EntityNotFoundException();
        };
    }
}
