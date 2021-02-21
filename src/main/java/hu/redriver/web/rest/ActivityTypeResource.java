package hu.redriver.web.rest;

import hu.redriver.service.ActivityTypeService;
import hu.redriver.web.rest.errors.BadRequestAlertException;
import hu.redriver.service.dto.ActivityTypeDTO;

import hu.redriver.web.utils.CustomHeaderUtil;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
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
 * REST controller for managing {@link hu.redriver.domain.ActivityType}.
 */
@RestController
@RequestMapping("/api")
public class ActivityTypeResource {

    private final Logger log = LoggerFactory.getLogger(ActivityTypeResource.class);

    private static final String ENTITY_NAME = "foglalkozas";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivityTypeService activityTypeService;

    public ActivityTypeResource(ActivityTypeService activityTypeService) {
        this.activityTypeService = activityTypeService;
    }

    /**
     * {@code POST  /activity-types} : Create a new activityType.
     *
     * @param activityTypeDTO the activityTypeDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activityTypeDTO, or with status {@code 400 (Bad Request)} if the activityType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activity-types")
    public ResponseEntity<ActivityTypeDTO> createActivityType(@Valid @RequestBody ActivityTypeDTO activityTypeDTO) throws URISyntaxException {
        log.debug("REST request to save ActivityType : {}", activityTypeDTO);
        if (activityTypeDTO.getId() != null) {
            throw new BadRequestAlertException("A new activityType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActivityTypeDTO result = activityTypeService.save(activityTypeDTO);
        return ResponseEntity.created(new URI("/api/activity-types/" + result.getId()))
            .headers(CustomHeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString(), activityTypeDTO.getName()))
            .body(result);
    }

    /**
     * {@code PUT  /activity-types} : Updates an existing activityType.
     *
     * @param activityTypeDTO the activityTypeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityTypeDTO,
     * or with status {@code 400 (Bad Request)} if the activityTypeDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the activityTypeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activity-types")
    public ResponseEntity<ActivityTypeDTO> updateActivityType(@Valid @RequestBody ActivityTypeDTO activityTypeDTO) throws URISyntaxException {
        log.debug("REST request to update ActivityType : {}", activityTypeDTO);
        if (activityTypeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ActivityTypeDTO result = activityTypeService.save(activityTypeDTO);
        return ResponseEntity.ok()
            .headers(CustomHeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activityTypeDTO.getId().toString(), activityTypeDTO.getName()))
            .body(result);
    }

    /**
     * {@code GET  /activity-types} : get all the activityTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activityTypes in body.
     */
    @GetMapping("/activity-types")
    public List<ActivityTypeDTO> getAllActivityTypes() {
        log.debug("REST request to get all ActivityTypes");
        return activityTypeService.findAll();
    }

    /**
     * {@code GET  /activity-types/:id} : get the "id" activityType.
     *
     * @param id the id of the activityTypeDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the activityTypeDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activity-types/{id}")
    public ResponseEntity<ActivityTypeDTO> getActivityType(@PathVariable Long id) {
        log.debug("REST request to get ActivityType : {}", id);
        Optional<ActivityTypeDTO> activityTypeDTO = activityTypeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(activityTypeDTO);
    }

    /**
     * {@code DELETE  /activity-types/:id} : delete the "id" activityType.
     *
     * @param id the id of the activityTypeDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activity-types/{id}")
    public ResponseEntity<Void> deleteActivityType(@PathVariable Long id) {
        log.debug("REST request to delete ActivityType : {}", id);
        activityTypeService.delete(id);
        return ResponseEntity.noContent().headers(CustomHeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
