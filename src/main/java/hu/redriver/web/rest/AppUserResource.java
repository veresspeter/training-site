package hu.redriver.web.rest;

import hu.redriver.domain.AppUser;
import hu.redriver.domain.User;
import hu.redriver.repository.UserRepository;
import hu.redriver.service.AppUserService;
import hu.redriver.service.UserService;
import hu.redriver.web.rest.errors.BadRequestAlertException;
import hu.redriver.service.dto.AppUserDTO;

import hu.redriver.web.rest.errors.EmailAlreadyUsedException;
import hu.redriver.web.rest.errors.LoginAlreadyUsedException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.undertow.util.BadRequestException;
import javassist.tools.web.BadHttpRequest;
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
 * REST controller for managing {@link AppUser}.
 */
@RestController
@RequestMapping("/api")
public class AppUserResource {

    private final Logger log = LoggerFactory.getLogger(AppUserResource.class);

    private static final String ENTITY_NAME = "appUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserRepository userRepository;
    private final AppUserService appUserService;
    private final UserService userService;

    public AppUserResource(UserRepository userRepository, AppUserService appUserService, UserService userService) {
        this.userRepository = userRepository;
        this.appUserService = appUserService;
        this.userService = userService;
    }

    /**
     * {@code POST  /application-users} : Create a new applicationUser.
     *
     * @param appUserDTO the applicationUserDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new applicationUserDTO, or with status {@code 400 (Bad Request)} if the applicationUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/application-users")
    public ResponseEntity<AppUserDTO> createApplicationUser(@Valid @RequestBody AppUserDTO appUserDTO) throws URISyntaxException {
        log.debug("REST request to save AppUser : {}", appUserDTO);
        if (appUserDTO.getId() != null) {
            throw new BadRequestAlertException("A new appUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AppUserDTO result = appUserService.save(appUserDTO);
        return ResponseEntity.created(new URI("/api/application-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /application-users} : Updates an existing applicationUser.
     *
     * @param appUserDTO the applicationUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated applicationUserDTO,
     * or with status {@code 400 (Bad Request)} if the applicationUserDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the applicationUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/application-users")
    public ResponseEntity<AppUserDTO> updateApplicationUser(@Valid @RequestBody AppUserDTO appUserDTO) throws URISyntaxException {
        log.debug("REST request to update ApplicationUser : {}", appUserDTO);
        if (appUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        Optional<User> checkUser = userRepository.findById(appUserDTO.getInternalUserDTO().getId());
        if (checkUser.isEmpty() || !checkUser.get().getId().equals(appUserDTO.getInternalUserDTO().getId())) {
            throw new IllegalArgumentException("Belső azonosító nem változtatható meg");
        }

        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(appUserDTO.getInternalUserDTO().getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(appUserDTO.getInternalUserDTO().getId()))) {
            throw new EmailAlreadyUsedException();
        }
        existingUser = userRepository.findOneByLogin(appUserDTO.getInternalUserDTO().getLogin().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(appUserDTO.getInternalUserDTO().getId()))) {
            throw new LoginAlreadyUsedException();
        }

        userService.updateUser(appUserDTO.getInternalUserDTO());
        AppUserDTO result = appUserService.save(appUserDTO);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, appUserDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /application-users} : get all the applicationUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of applicationUsers in body.
     */
    @GetMapping("/application-users")
    public List<AppUserDTO> getAllApplicationUsers() {
        log.debug("REST request to get all ApplicationUsers");
        return appUserService.findAll();
    }

    @GetMapping("/trainers")
    public List<AppUserDTO> getAllTrainers() {
        log.debug("REST request to get all Trainers");
        return appUserService.findAllTrainer();
    }

    /**
     * {@code GET  /application-users/:id} : get the "id" applicationUser.
     *
     * @param id the id of the applicationUserDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the applicationUserDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/application-users/{id}")
    public ResponseEntity<AppUserDTO> getApplicationUser(@PathVariable Long id) {
        log.debug("REST request to get ApplicationUser : {}", id);
        Optional<AppUserDTO> applicationUserDTO = appUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(applicationUserDTO);
    }

    /**
     * {@code GET  /application-users/:id} : get the "id" applicationUser.
     *
     * @param id the id of the applicationUserDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the applicationUserDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/application-users/internal-id/{id}")
    public ResponseEntity<AppUserDTO> getApplicationUserByInternalId(@PathVariable Long id) {
        log.debug("REST request to get ApplicationUser by InternalUserId : {}", id);
        Optional<AppUserDTO> applicationUserDTO = appUserService.findOneByInternalUserId(id);
        return ResponseUtil.wrapOrNotFound(applicationUserDTO);
    }

    /**
     * {@code DELETE  /application-users/:id} : delete the "id" applicationUser.
     *
     * @param id the id of the applicationUserDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/application-users/{id}")
    public ResponseEntity<Void> deleteApplicationUser(@PathVariable Long id) {
        log.debug("REST request to delete ApplicationUser : {}", id);
        appUserService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
