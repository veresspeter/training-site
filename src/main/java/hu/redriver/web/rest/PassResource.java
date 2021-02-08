package hu.redriver.web.rest;

import hu.redriver.service.PassService;
import hu.redriver.web.rest.errors.BadRequestAlertException;
import hu.redriver.service.dto.PassDTO;

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
 * REST controller for managing {@link hu.redriver.domain.Pass}.
 */
@RestController
@RequestMapping("/api")
public class PassResource {

    private final Logger log = LoggerFactory.getLogger(PassResource.class);

    private static final String ENTITY_NAME = "pass";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PassService passService;

    public PassResource(PassService passService) {
        this.passService = passService;
    }

    /**
     * {@code POST  /passes} : Create a new pass.
     *
     * @param passDTO the passDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new passDTO, or with status {@code 400 (Bad Request)} if the pass has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/passes")
    public ResponseEntity<PassDTO> createPass(@Valid @RequestBody PassDTO passDTO) throws URISyntaxException {
        log.debug("REST request to save Pass : {}", passDTO);
        if (passDTO.getId() != null) {
            throw new BadRequestAlertException("A new pass cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PassDTO result = passService.save(passDTO);
        return ResponseEntity.created(new URI("/api/passes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /passes} : Updates an existing pass.
     *
     * @param passDTO the passDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated passDTO,
     * or with status {@code 400 (Bad Request)} if the passDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the passDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/passes")
    public ResponseEntity<PassDTO> updatePass(@Valid @RequestBody PassDTO passDTO) throws URISyntaxException {
        log.debug("REST request to update Pass : {}", passDTO);
        if (passDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PassDTO result = passService.save(passDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, passDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /passes} : get all the passes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of passes in body.
     */
    @GetMapping("/passes")
    public List<PassDTO> getAllPasses() {
        log.debug("REST request to get all Passes");
        return passService.findAll();
    }

    /**
     * {@code GET  /passes/:id} : get the "id" pass.
     *
     * @param id the id of the passDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the passDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/passes/{id}")
    public ResponseEntity<PassDTO> getPass(@PathVariable Long id) {
        log.debug("REST request to get Pass : {}", id);
        Optional<PassDTO> passDTO = passService.findOne(id);
        return ResponseUtil.wrapOrNotFound(passDTO);
    }

    /**
     * {@code DELETE  /passes/:id} : delete the "id" pass.
     *
     * @param id the id of the passDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/passes/{id}")
    public ResponseEntity<Void> deletePass(@PathVariable Long id) {
        log.debug("REST request to delete Pass : {}", id);
        passService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
