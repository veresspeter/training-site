package hu.redriver.web.rest;

import hu.redriver.service.PassTypeService;
import hu.redriver.web.rest.errors.BadRequestAlertException;
import hu.redriver.service.dto.PassTypeDTO;

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
 * REST controller for managing {@link hu.redriver.domain.PassType}.
 */
@RestController
@RequestMapping("/api")
public class PassTypeResource {

    private final Logger log = LoggerFactory.getLogger(PassTypeResource.class);

    private static final String ENTITY_NAME = "passType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PassTypeService passTypeService;

    public PassTypeResource(PassTypeService passTypeService) {
        this.passTypeService = passTypeService;
    }

    /**
     * {@code POST  /pass-types} : Create a new passType.
     *
     * @param passTypeDTO the passTypeDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new passTypeDTO, or with status {@code 400 (Bad Request)} if the passType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pass-types")
    public ResponseEntity<PassTypeDTO> createPassType(@Valid @RequestBody PassTypeDTO passTypeDTO) throws URISyntaxException {
        log.debug("REST request to save PassType : {}", passTypeDTO);
        if (passTypeDTO.getId() != null) {
            throw new BadRequestAlertException("A new passType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PassTypeDTO result = passTypeService.save(passTypeDTO);
        return ResponseEntity.created(new URI("/api/pass-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pass-types} : Updates an existing passType.
     *
     * @param passTypeDTO the passTypeDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated passTypeDTO,
     * or with status {@code 400 (Bad Request)} if the passTypeDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the passTypeDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pass-types")
    public ResponseEntity<PassTypeDTO> updatePassType(@Valid @RequestBody PassTypeDTO passTypeDTO) throws URISyntaxException {
        log.debug("REST request to update PassType : {}", passTypeDTO);
        if (passTypeDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PassTypeDTO result = passTypeService.save(passTypeDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, passTypeDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /pass-types} : get all the passTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of passTypes in body.
     */
    @GetMapping("/pass-types")
    public List<PassTypeDTO> getAllPassTypes() {
        log.debug("REST request to get all PassTypes");
        return passTypeService.findAll();
    }

    /**
     * {@code GET  /pass-types/:id} : get the "id" passType.
     *
     * @param id the id of the passTypeDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the passTypeDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pass-types/{id}")
    public ResponseEntity<PassTypeDTO> getPassType(@PathVariable Long id) {
        log.debug("REST request to get PassType : {}", id);
        Optional<PassTypeDTO> passTypeDTO = passTypeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(passTypeDTO);
    }

    /**
     * {@code DELETE  /pass-types/:id} : delete the "id" passType.
     *
     * @param id the id of the passTypeDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pass-types/{id}")
    public ResponseEntity<Void> deletePassType(@PathVariable Long id) {
        log.debug("REST request to delete PassType : {}", id);
        passTypeService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
