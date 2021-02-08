package hu.redriver.web.rest;

import hu.redriver.MaxmoveApp;
import hu.redriver.domain.PassType;
import hu.redriver.domain.ActivityType;
import hu.redriver.repository.PassTypeRepository;
import hu.redriver.service.PassTypeService;
import hu.redriver.service.dto.PassTypeDTO;
import hu.redriver.service.mapper.PassTypeMapper;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link PassTypeResource} REST controller.
 */
@SpringBootTest(classes = MaxmoveApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class PassTypeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_DURATION_DAYS = 1;
    private static final Integer UPDATED_DURATION_DAYS = 2;

    private static final String DEFAULT_PRICE = "AAAAAAAAAA";
    private static final String UPDATED_PRICE = "BBBBBBBBBB";

    private static final Integer DEFAULT_OCCASIONS = 1;
    private static final Integer UPDATED_OCCASIONS = 2;

    @Autowired
    private PassTypeRepository passTypeRepository;

    @Autowired
    private PassTypeMapper passTypeMapper;

    @Autowired
    private PassTypeService passTypeService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPassTypeMockMvc;

    private PassType passType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PassType createEntity(EntityManager em) {
        PassType passType = new PassType()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .durationDays(DEFAULT_DURATION_DAYS)
            .price(DEFAULT_PRICE)
            .occasions(DEFAULT_OCCASIONS);
        // Add required entity
        ActivityType activityType;
        if (TestUtil.findAll(em, ActivityType.class).isEmpty()) {
            activityType = ActivityTypeResourceIT.createEntity(em);
            em.persist(activityType);
            em.flush();
        } else {
            activityType = TestUtil.findAll(em, ActivityType.class).get(0);
        }
        passType.setAvailableForType(activityType);
        return passType;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PassType createUpdatedEntity(EntityManager em) {
        PassType passType = new PassType()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .durationDays(UPDATED_DURATION_DAYS)
            .price(UPDATED_PRICE)
            .occasions(UPDATED_OCCASIONS);
        // Add required entity
        ActivityType activityType;
        if (TestUtil.findAll(em, ActivityType.class).isEmpty()) {
            activityType = ActivityTypeResourceIT.createUpdatedEntity(em);
            em.persist(activityType);
            em.flush();
        } else {
            activityType = TestUtil.findAll(em, ActivityType.class).get(0);
        }
        passType.setAvailableForType(activityType);
        return passType;
    }

    @BeforeEach
    public void initTest() {
        passType = createEntity(em);
    }

    @Test
    @Transactional
    public void createPassType() throws Exception {
        int databaseSizeBeforeCreate = passTypeRepository.findAll().size();
        // Create the PassType
        PassTypeDTO passTypeDTO = passTypeMapper.toDto(passType);
        restPassTypeMockMvc.perform(post("/api/pass-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passTypeDTO)))
            .andExpect(status().isCreated());

        // Validate the PassType in the database
        List<PassType> passTypeList = passTypeRepository.findAll();
        assertThat(passTypeList).hasSize(databaseSizeBeforeCreate + 1);
        PassType testPassType = passTypeList.get(passTypeList.size() - 1);
        assertThat(testPassType.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPassType.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPassType.getDurationDays()).isEqualTo(DEFAULT_DURATION_DAYS);
        assertThat(testPassType.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testPassType.getOccasions()).isEqualTo(DEFAULT_OCCASIONS);
    }

    @Test
    @Transactional
    public void createPassTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = passTypeRepository.findAll().size();

        // Create the PassType with an existing ID
        passType.setId(1L);
        PassTypeDTO passTypeDTO = passTypeMapper.toDto(passType);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPassTypeMockMvc.perform(post("/api/pass-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passTypeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PassType in the database
        List<PassType> passTypeList = passTypeRepository.findAll();
        assertThat(passTypeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = passTypeRepository.findAll().size();
        // set the field null
        passType.setName(null);

        // Create the PassType, which fails.
        PassTypeDTO passTypeDTO = passTypeMapper.toDto(passType);


        restPassTypeMockMvc.perform(post("/api/pass-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passTypeDTO)))
            .andExpect(status().isBadRequest());

        List<PassType> passTypeList = passTypeRepository.findAll();
        assertThat(passTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = passTypeRepository.findAll().size();
        // set the field null
        passType.setPrice(null);

        // Create the PassType, which fails.
        PassTypeDTO passTypeDTO = passTypeMapper.toDto(passType);


        restPassTypeMockMvc.perform(post("/api/pass-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passTypeDTO)))
            .andExpect(status().isBadRequest());

        List<PassType> passTypeList = passTypeRepository.findAll();
        assertThat(passTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkOccasionsIsRequired() throws Exception {
        int databaseSizeBeforeTest = passTypeRepository.findAll().size();
        // set the field null
        passType.setOccasions(null);

        // Create the PassType, which fails.
        PassTypeDTO passTypeDTO = passTypeMapper.toDto(passType);


        restPassTypeMockMvc.perform(post("/api/pass-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passTypeDTO)))
            .andExpect(status().isBadRequest());

        List<PassType> passTypeList = passTypeRepository.findAll();
        assertThat(passTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPassTypes() throws Exception {
        // Initialize the database
        passTypeRepository.saveAndFlush(passType);

        // Get all the passTypeList
        restPassTypeMockMvc.perform(get("/api/pass-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(passType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].durationDays").value(hasItem(DEFAULT_DURATION_DAYS)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.[*].occasions").value(hasItem(DEFAULT_OCCASIONS)));
    }
    
    @Test
    @Transactional
    public void getPassType() throws Exception {
        // Initialize the database
        passTypeRepository.saveAndFlush(passType);

        // Get the passType
        restPassTypeMockMvc.perform(get("/api/pass-types/{id}", passType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(passType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.durationDays").value(DEFAULT_DURATION_DAYS))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE))
            .andExpect(jsonPath("$.occasions").value(DEFAULT_OCCASIONS));
    }
    @Test
    @Transactional
    public void getNonExistingPassType() throws Exception {
        // Get the passType
        restPassTypeMockMvc.perform(get("/api/pass-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePassType() throws Exception {
        // Initialize the database
        passTypeRepository.saveAndFlush(passType);

        int databaseSizeBeforeUpdate = passTypeRepository.findAll().size();

        // Update the passType
        PassType updatedPassType = passTypeRepository.findById(passType.getId()).get();
        // Disconnect from session so that the updates on updatedPassType are not directly saved in db
        em.detach(updatedPassType);
        updatedPassType
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .durationDays(UPDATED_DURATION_DAYS)
            .price(UPDATED_PRICE)
            .occasions(UPDATED_OCCASIONS);
        PassTypeDTO passTypeDTO = passTypeMapper.toDto(updatedPassType);

        restPassTypeMockMvc.perform(put("/api/pass-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passTypeDTO)))
            .andExpect(status().isOk());

        // Validate the PassType in the database
        List<PassType> passTypeList = passTypeRepository.findAll();
        assertThat(passTypeList).hasSize(databaseSizeBeforeUpdate);
        PassType testPassType = passTypeList.get(passTypeList.size() - 1);
        assertThat(testPassType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPassType.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPassType.getDurationDays()).isEqualTo(UPDATED_DURATION_DAYS);
        assertThat(testPassType.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testPassType.getOccasions()).isEqualTo(UPDATED_OCCASIONS);
    }

    @Test
    @Transactional
    public void updateNonExistingPassType() throws Exception {
        int databaseSizeBeforeUpdate = passTypeRepository.findAll().size();

        // Create the PassType
        PassTypeDTO passTypeDTO = passTypeMapper.toDto(passType);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPassTypeMockMvc.perform(put("/api/pass-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(passTypeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PassType in the database
        List<PassType> passTypeList = passTypeRepository.findAll();
        assertThat(passTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePassType() throws Exception {
        // Initialize the database
        passTypeRepository.saveAndFlush(passType);

        int databaseSizeBeforeDelete = passTypeRepository.findAll().size();

        // Delete the passType
        restPassTypeMockMvc.perform(delete("/api/pass-types/{id}", passType.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PassType> passTypeList = passTypeRepository.findAll();
        assertThat(passTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
