package hu.redriver.web.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import hu.redriver.service.*;
import hu.redriver.service.dto.BarionCallBackRequestDTO;
import hu.redriver.web.rest.errors.BadRequestAlertException;
import hu.redriver.service.dto.PassDTO;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.io.IOException;
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
    private final BarionService barionService;
    private final ObjectMapper objectMapper;

    public PassResource(PassService passService, BarionService barionService) {
        this.passService = passService;
        this.barionService = barionService;
        this.objectMapper = new ObjectMapper();
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

    @PostMapping("/passes/purchase")
    public ResponseEntity<String> purchasePass(@RequestBody Long passTypeId) throws IOException {
        log.debug("REST request to purchase Pass with PassType : {}", passTypeId);

        final PassDTO passDTO = passService.purchase(passTypeId);
        final String result = barionService.startPayment(passDTO);

        return ResponseEntity.ok()
            .body(objectMapper.writeValueAsString(result));
    }

    @PostMapping("/passes/payment-callback")
    public ResponseEntity<Void> paymentCallback(@RequestBody BarionCallBackRequestDTO requestDTO) throws IOException, URISyntaxException {
        log.debug("REST request to update Payment for Pass");
        barionService.checkPayment(requestDTO.getPaymentId());
        return ResponseEntity.ok()
            .build();
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
    public ResponseEntity<List<PassDTO>> getAllPasses(Pageable pageable) {
        log.debug("REST request to get all Passes");

        final Page<PassDTO> page = passService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
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
