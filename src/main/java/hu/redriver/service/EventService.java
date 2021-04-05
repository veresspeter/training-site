package hu.redriver.service;

import hu.redriver.domain.AppUser;
import hu.redriver.domain.Event;
import hu.redriver.domain.EventParticipant;
import hu.redriver.repository.ActivityRepository;
import hu.redriver.repository.EventParticipantRepository;
import hu.redriver.repository.EventRepository;
import hu.redriver.service.dto.ActivityDTO;
import hu.redriver.service.dto.AppUserDTO;
import hu.redriver.service.dto.EventDTO;
import hu.redriver.service.dto.PassDTO;
import hu.redriver.service.mapper.ActivityMapper;
import hu.redriver.service.mapper.AppUserMapper;
import hu.redriver.service.mapper.EventMapper;
import io.undertow.util.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.*;
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
    private final EventParticipantRepository eventParticipantRepository;
    private final EventMapper eventMapper;
    private final AppUserMapper appUserMapper;
    private final ActivityMapper activityMapper;
    private final UserService userService;
    private final AppUserService appUserService;
    private final PassService passService;
    private final PassTypeService passTypeService;
    private final ActivityRepository activityRepository;

    public EventService(EventRepository eventRepository,
                        EventParticipantRepository eventParticipantRepository,
                        EventMapper eventMapper,
                        UserService userService,
                        AppUserService appUserService,
                        AppUserMapper appUserMapper,
                        PassService passService,
                        PassTypeService passTypeService,
                        ActivityRepository activityRepository,
                        ActivityMapper activityMapper) {
        this.eventRepository = eventRepository;
        this.eventParticipantRepository = eventParticipantRepository;
        this.eventMapper = eventMapper;
        this.appUserMapper = appUserMapper;
        this.userService = userService;
        this.appUserService = appUserService;
        this.passService = passService;
        this.passTypeService = passTypeService;
        this.activityRepository = activityRepository;
        this.activityMapper = activityMapper;
    }

    /**
     * Save a event.
     *
     * @param eventDTO the entity to save.
     * @return the persisted entity.
     */
    public EventDTO save(EventDTO eventDTO) {
        log.debug("Request to save Event : {}", eventDTO);
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

    @Transactional(readOnly = true)
    public List<EventDTO> findAllByParticipant(AppUserDTO appUserDTO) {
        log.debug("Request to get all Events by User: {}", appUserDTO);
        Set<AppUser> participantSet = new HashSet<AppUser>();
        participantSet.add(appUserMapper.toEntity(appUserDTO));
        return eventRepository.findAllByParticipantsIn(participantSet).stream()
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

    @Transactional
    public void join(Long id) throws BadRequestException {
        log.debug("Request to join Event : {}", id);
        EventDTO eventDTO = findOne(id).orElseThrow(getNotFoundException());

        if (eventDTO.getLimit() != null && eventDTO.getLimit().compareTo(eventDTO.getParticipants().size() + 1) < 0) {
            throw new BadRequestException("Az eseményre a helyek beteltek");
        }

        ActivityDTO activityDTO = activityRepository.findAll().stream()
            .filter(activity -> activity.getId().equals(eventDTO.getActivityId()))
            .findFirst()
            .map(activityMapper::toDto)
            .orElseThrow(() -> new BadRequestException("Foglalkozás nem található"));
        List<PassDTO> passDTOs = passService.findOneByActivityTypeId(activityDTO.getActivityTypeId(), getCurrentAppUser().getId())
            .stream()
            .filter(pass -> passTypeService.findOne(pass.getPassTypeId())
                .orElseThrow()
                .getOccasions() > pass.getTotalUsageNo())
            .filter(pass -> pass.getValidFrom() == null || pass.getValidFrom().isBefore(eventDTO.getStart()))
            .filter(pass -> pass.getValidTo() == null || pass.getValidTo().isAfter(eventDTO.getEnd()))
            .collect(Collectors.toList());
        PassDTO result;

        if (passDTOs.size() == 0) {
            throw new BadRequestException("Nem található aktív bérlet");
        }

        if (passDTOs.size() != 1) {
            Collections.sort(passDTOs);
        }
        result = passDTOs.get(0);

        EventParticipant eventParticipant = new EventParticipant();
        eventParticipant.setEventId(eventDTO.getId());
        eventParticipant.setParticipantId(getCurrentAppUser().getId());
        eventParticipant.setPassId(result.getId());

        eventParticipantRepository.save(eventParticipant);
    }

    public void quit(Long id) {
        log.debug("Request to quit Event : {}", id);
        EventDTO eventDTO = findOne(id).orElseThrow(getNotFoundException());
        eventDTO.getParticipants().remove(getCurrentAppUser());
        save(eventDTO);
    }

    private AppUserDTO getCurrentAppUser() {
        return appUserService.findOneByInternalUserId(
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
