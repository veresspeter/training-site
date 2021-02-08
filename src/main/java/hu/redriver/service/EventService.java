package hu.redriver.service;

import hu.redriver.domain.Event;
import hu.redriver.repository.EventRepository;
import hu.redriver.service.dto.EventDTO;
import hu.redriver.service.mapper.EventMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
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

    public EventService(EventRepository eventRepository, EventMapper eventMapper) {
        this.eventRepository = eventRepository;
        this.eventMapper = eventMapper;
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
}
