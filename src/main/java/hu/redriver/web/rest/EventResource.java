package hu.redriver.web.rest;

import hu.redriver.service.EventService;
import hu.redriver.web.rest.errors.BadRequestAlertException;
import hu.redriver.service.dto.EventDTO;

import hu.redriver.web.utils.CustomHeaderUtil;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.undertow.util.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link hu.redriver.domain.Event}.
 */
@RestController
@RequestMapping("/api")
public class EventResource {

    private final Logger log = LoggerFactory.getLogger(EventResource.class);

    private static final String ENTITY_NAME = "event";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventService eventService;

    public EventResource(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * {@code POST  /events} : Create a new event.
     *
     * @param eventDTO the eventDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventDTO, or with status {@code 400 (Bad Request)} if the event has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/events")
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody EventDTO eventDTO) throws URISyntaxException {
        log.debug("REST request to save Event : {}", eventDTO);
        if (eventDTO.getId() != null) {
            throw new BadRequestAlertException("A new event cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventDTO result = eventService.save(eventDTO);
        return ResponseEntity.created(new URI("/api/events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /events} : Updates an existing event.
     *
     * @param eventDTO the eventDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventDTO,
     * or with status {@code 400 (Bad Request)} if the eventDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/events")
    public ResponseEntity<EventDTO> updateEvent(@Valid @RequestBody EventDTO eventDTO) throws URISyntaxException {
        log.debug("REST request to update Event : {}", eventDTO);
        if (eventDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        EventDTO result = eventService.save(eventDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /events} : get all the events.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of events in body.
     */
    @GetMapping("/events")
    public List<EventDTO> getAllEvents(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Events");
        return eventService.findAll();
    }

    /**
     * {@code GET  /events/:id} : get the "id" event.
     *
     * @param id the id of the eventDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/events/{id}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable Long id) {
        log.debug("REST request to get Event : {}", id);
        Optional<EventDTO> eventDTO = eventService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventDTO);
    }

    /**
     * {@code DELETE  /events/:id} : delete the "id" event.
     *
     * @param id the id of the eventDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        log.debug("REST request to delete Event : {}", id);
        eventService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    @PutMapping("/events/{id}/join")
    public ResponseEntity<Void> joinEvent(@PathVariable Long id) {
        log.debug("REST request to join Event : {}", id);
        try {
            eventService.join(id);
            return ResponseEntity.ok().build();
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().headers(CustomHeaderUtil.createCustomFailureAlert(applicationName, ENTITY_NAME, "Az eseményre a helyek beteltek")).build();
        }
    }

    @PutMapping("/events/{id}/quit")
    public ResponseEntity<Void> quitEvent(@PathVariable Long id) {
        log.debug("REST request to quit Event : {}", id);
        eventService.quit(id);
        return ResponseEntity.ok().build();
    }
}
