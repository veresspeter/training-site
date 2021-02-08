package hu.redriver.web.rest;

import hu.redriver.MaxmoveApp;
import hu.redriver.domain.Pass;
import hu.redriver.domain.PassType;
import hu.redriver.domain.ApplicationUser;
import hu.redriver.repository.PassRepository;
import hu.redriver.service.PassService;
import hu.redriver.service.dto.PassDTO;
import hu.redriver.service.mapper.PassMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link PassResource} REST controller.
 */
@SpringBootTest(classes = MaxmoveApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class PassResourceIT {

    private static final LocalDate DEFAULT_PURCHASED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_PURCHASED = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_USAGE_NO = 1;
    private static final Integer UPDATED_USAGE_NO = 2;

    private static final LocalDate DEFAULT_VALID_FROM = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_VALID_FROM = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_VALID_TO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_VALID_TO = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private PassRepository passRepository;

    @Autowired
    private PassMapper passMapper;

    @Autowired
    private PassService passService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPassMockMvc;

    private Pass pass;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pass createEntity(EntityManager em) {
        Pass pass = new Pass()
            .purchased(DEFAULT_PURCHASED)
            .usageNo(DEFAULT_USAGE_NO)
            .validFrom(DEFAULT_VALID_FROM)
            .validTo(DEFAULT_VALID_TO);
        // Add required entity
        PassType passType;
        if (TestUtil.findAll(em, PassType.class).isEmpty()) {
            passType = PassTypeResourceIT.createEntity(em);
            em.persist(passType);
            em.flush();
        } else {
            passType = TestUtil.findAll(em, PassType.class).get(0);
        }
        pass.setPassType(passType);
        // Add required entity
        ApplicationUser applicationUser;
        if (TestUtil.findAll(em, ApplicationUser.class).isEmpty()) {
            applicationUser = ApplicationUserResourceIT.createEntity(em);
            em.persist(applicationUser);
            em.flush();
        } else {
            applicationUser = TestUtil.findAll(em, ApplicationUser.class).get(0);
        }
        pass.setUser(applicationUser);
        return pass;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pass createUpdatedEntity(EntityManager em) {
        Pass pass = new Pass()
            .purchased(UPDATED_PURCHASED)
            .usageNo(UPDATED_USAGE_NO)
            .validFrom(UPDATED_VALID_FROM)
            .validTo(UPDATED_VALID_TO);
        // Add required entity
        PassType passType;
        if (TestUtil.findAll(em, PassType.class).isEmpty()) {
            passType = PassTypeResourceIT.createUpdatedEntity(em);
            em.persist(passType);
            em.flush();
        } else {
            passType = TestUtil.findAll(em, PassType.class).get(0);
        }
        pass.setPassType(passType);
        // Add required entity
        ApplicationUser applicationUser;
        if (TestUtil.findAll(em, ApplicationUser.class).isEmpty()) {
            applicationUser = ApplicationUserResourceIT.createUpdatedEntity(em);
            em.persist(applicationUser);
            em.flush();
        } else {
            applicationUser = TestUtil.findAll(em, ApplicationUser.class).get(0);
        }
        pass.setUser(applicationUser);
        return pass;
    }

    @BeforeEach
    public void initTest() {
        pass = createEntity(em);
    }

    @Test
    @Transactional
    public void createPass() throws Exception {
        int databaseSizeBeforeCreate = passRepository.findAll().size();
        // Create the Pass
        PassDTO passDTO = passMapper.toDto(pass);
        restPassMockMvc.perform(post("/api/passes").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passDTO)))
            .andExpect(status().isCreated());

        // Validate the Pass in the database
        List<Pass> passList = passRepository.findAll();
        assertThat(passList).hasSize(databaseSizeBeforeCreate + 1);
        Pass testPass = passList.get(passList.size() - 1);
        assertThat(testPass.getPurchased()).isEqualTo(DEFAULT_PURCHASED);
        assertThat(testPass.getUsageNo()).isEqualTo(DEFAULT_USAGE_NO);
        assertThat(testPass.getValidFrom()).isEqualTo(DEFAULT_VALID_FROM);
        assertThat(testPass.getValidTo()).isEqualTo(DEFAULT_VALID_TO);
    }

    @Test
    @Transactional
    public void createPassWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = passRepository.findAll().size();

        // Create the Pass with an existing ID
        pass.setId(1L);
        PassDTO passDTO = passMapper.toDto(pass);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPassMockMvc.perform(post("/api/passes").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Pass in the database
        List<Pass> passList = passRepository.findAll();
        assertThat(passList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkPurchasedIsRequired() throws Exception {
        int databaseSizeBeforeTest = passRepository.findAll().size();
        // set the field null
        pass.setPurchased(null);

        // Create the Pass, which fails.
        PassDTO passDTO = passMapper.toDto(pass);


        restPassMockMvc.perform(post("/api/passes").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passDTO)))
            .andExpect(status().isBadRequest());

        List<Pass> passList = passRepository.findAll();
        assertThat(passList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkUsageNoIsRequired() throws Exception {
        int databaseSizeBeforeTest = passRepository.findAll().size();
        // set the field null
        pass.setUsageNo(null);

        // Create the Pass, which fails.
        PassDTO passDTO = passMapper.toDto(pass);


        restPassMockMvc.perform(post("/api/passes").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passDTO)))
            .andExpect(status().isBadRequest());

        List<Pass> passList = passRepository.findAll();
        assertThat(passList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPasses() throws Exception {
        // Initialize the database
        passRepository.saveAndFlush(pass);

        // Get all the passList
        restPassMockMvc.perform(get("/api/passes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pass.getId().intValue())))
            .andExpect(jsonPath("$.[*].purchased").value(hasItem(DEFAULT_PURCHASED.toString())))
            .andExpect(jsonPath("$.[*].usageNo").value(hasItem(DEFAULT_USAGE_NO)))
            .andExpect(jsonPath("$.[*].validFrom").value(hasItem(DEFAULT_VALID_FROM.toString())))
            .andExpect(jsonPath("$.[*].validTo").value(hasItem(DEFAULT_VALID_TO.toString())));
    }
    
    @Test
    @Transactional
    public void getPass() throws Exception {
        // Initialize the database
        passRepository.saveAndFlush(pass);

        // Get the pass
        restPassMockMvc.perform(get("/api/passes/{id}", pass.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pass.getId().intValue()))
            .andExpect(jsonPath("$.purchased").value(DEFAULT_PURCHASED.toString()))
            .andExpect(jsonPath("$.usageNo").value(DEFAULT_USAGE_NO))
            .andExpect(jsonPath("$.validFrom").value(DEFAULT_VALID_FROM.toString()))
            .andExpect(jsonPath("$.validTo").value(DEFAULT_VALID_TO.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingPass() throws Exception {
        // Get the pass
        restPassMockMvc.perform(get("/api/passes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePass() throws Exception {
        // Initialize the database
        passRepository.saveAndFlush(pass);

        int databaseSizeBeforeUpdate = passRepository.findAll().size();

        // Update the pass
        Pass updatedPass = passRepository.findById(pass.getId()).get();
        // Disconnect from session so that the updates on updatedPass are not directly saved in db
        em.detach(updatedPass);
        updatedPass
            .purchased(UPDATED_PURCHASED)
            .usageNo(UPDATED_USAGE_NO)
            .validFrom(UPDATED_VALID_FROM)
            .validTo(UPDATED_VALID_TO);
        PassDTO passDTO = passMapper.toDto(updatedPass);

        restPassMockMvc.perform(put("/api/passes").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passDTO)))
            .andExpect(status().isOk());

        // Validate the Pass in the database
        List<Pass> passList = passRepository.findAll();
        assertThat(passList).hasSize(databaseSizeBeforeUpdate);
        Pass testPass = passList.get(passList.size() - 1);
        assertThat(testPass.getPurchased()).isEqualTo(UPDATED_PURCHASED);
        assertThat(testPass.getUsageNo()).isEqualTo(UPDATED_USAGE_NO);
        assertThat(testPass.getValidFrom()).isEqualTo(UPDATED_VALID_FROM);
        assertThat(testPass.getValidTo()).isEqualTo(UPDATED_VALID_TO);
    }

    @Test
    @Transactional
    public void updateNonExistingPass() throws Exception {
        int databaseSizeBeforeUpdate = passRepository.findAll().size();

        // Create the Pass
        PassDTO passDTO = passMapper.toDto(pass);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPassMockMvc.perform(put("/api/passes").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Pass in the database
        List<Pass> passList = passRepository.findAll();
        assertThat(passList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePass() throws Exception {
        // Initialize the database
        passRepository.saveAndFlush(pass);

        int databaseSizeBeforeDelete = passRepository.findAll().size();

        // Delete the pass
        restPassMockMvc.perform(delete("/api/passes/{id}", pass.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pass> passList = passRepository.findAll();
        assertThat(passList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
