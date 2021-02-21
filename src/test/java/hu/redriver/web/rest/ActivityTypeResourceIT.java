package hu.redriver.web.rest;

import hu.redriver.MaxmoveApp;
import hu.redriver.domain.ActivityType;
import hu.redriver.repository.ActivityTypeRepository;
import hu.redriver.service.ActivityTypeService;
import hu.redriver.service.dto.ActivityTypeDTO;
import hu.redriver.service.mapper.ActivityTypeMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ActivityTypeResource} REST controller.
 */
@SpringBootTest(classes = MaxmoveApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ActivityTypeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    @Autowired
    private ActivityTypeRepository activityTypeRepository;

    @Autowired
    private ActivityTypeMapper activityTypeMapper;

    @Autowired
    private ActivityTypeService activityTypeService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActivityTypeMockMvc;

    private ActivityType activityType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityType createEntity(EntityManager em) {
        ActivityType activityType = new ActivityType()
            .name(DEFAULT_NAME)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return activityType;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityType createUpdatedEntity(EntityManager em) {
        ActivityType activityType = new ActivityType()
            .name(UPDATED_NAME)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);
        return activityType;
    }

    @BeforeEach
    public void initTest() {
        activityType = createEntity(em);
    }

    @Test
    @Transactional
    public void createActivityType() throws Exception {
        int databaseSizeBeforeCreate = activityTypeRepository.findAll().size();
        // Create the ActivityType
        ActivityTypeDTO activityTypeDTO = activityTypeMapper.toDto(activityType);
        restActivityTypeMockMvc.perform(post("/api/activity-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(activityTypeDTO)))
            .andExpect(status().isCreated());

        // Validate the ActivityType in the database
        List<ActivityType> activityTypeList = activityTypeRepository.findAll();
        assertThat(activityTypeList).hasSize(databaseSizeBeforeCreate + 1);
        ActivityType testActivityType = activityTypeList.get(activityTypeList.size() - 1);
        assertThat(testActivityType.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testActivityType.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testActivityType.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createActivityTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = activityTypeRepository.findAll().size();

        // Create the ActivityType with an existing ID
        activityType.setId(1L);
        ActivityTypeDTO activityTypeDTO = activityTypeMapper.toDto(activityType);

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivityTypeMockMvc.perform(post("/api/activity-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(activityTypeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ActivityType in the database
        List<ActivityType> activityTypeList = activityTypeRepository.findAll();
        assertThat(activityTypeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = activityTypeRepository.findAll().size();
        // set the field null
        activityType.setName(null);

        // Create the ActivityType, which fails.
        ActivityTypeDTO activityTypeDTO = activityTypeMapper.toDto(activityType);


        restActivityTypeMockMvc.perform(post("/api/activity-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(activityTypeDTO)))
            .andExpect(status().isBadRequest());

        List<ActivityType> activityTypeList = activityTypeRepository.findAll();
        assertThat(activityTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllActivityTypes() throws Exception {
        // Initialize the database
        activityTypeRepository.saveAndFlush(activityType);

        // Get all the activityTypeList
        restActivityTypeMockMvc.perform(get("/api/activity-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activityType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }
    
    @Test
    @Transactional
    public void getActivityType() throws Exception {
        // Initialize the database
        activityTypeRepository.saveAndFlush(activityType);

        // Get the activityType
        restActivityTypeMockMvc.perform(get("/api/activity-types/{id}", activityType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(activityType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }
    @Test
    @Transactional
    public void getNonExistingActivityType() throws Exception {
        // Get the activityType
        restActivityTypeMockMvc.perform(get("/api/activity-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateActivityType() throws Exception {
        // Initialize the database
        activityTypeRepository.saveAndFlush(activityType);

        int databaseSizeBeforeUpdate = activityTypeRepository.findAll().size();

        // Update the activityType
        ActivityType updatedActivityType = activityTypeRepository.findById(activityType.getId()).get();
        // Disconnect from session so that the updates on updatedActivityType are not directly saved in db
        em.detach(updatedActivityType);
        updatedActivityType
            .name(UPDATED_NAME)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);
        ActivityTypeDTO activityTypeDTO = activityTypeMapper.toDto(updatedActivityType);

        restActivityTypeMockMvc.perform(put("/api/activity-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(activityTypeDTO)))
            .andExpect(status().isOk());

        // Validate the ActivityType in the database
        List<ActivityType> activityTypeList = activityTypeRepository.findAll();
        assertThat(activityTypeList).hasSize(databaseSizeBeforeUpdate);
        ActivityType testActivityType = activityTypeList.get(activityTypeList.size() - 1);
        assertThat(testActivityType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivityType.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testActivityType.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingActivityType() throws Exception {
        int databaseSizeBeforeUpdate = activityTypeRepository.findAll().size();

        // Create the ActivityType
        ActivityTypeDTO activityTypeDTO = activityTypeMapper.toDto(activityType);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityTypeMockMvc.perform(put("/api/activity-types").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(activityTypeDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ActivityType in the database
        List<ActivityType> activityTypeList = activityTypeRepository.findAll();
        assertThat(activityTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteActivityType() throws Exception {
        // Initialize the database
        activityTypeRepository.saveAndFlush(activityType);

        int databaseSizeBeforeDelete = activityTypeRepository.findAll().size();

        // Delete the activityType
        restActivityTypeMockMvc.perform(delete("/api/activity-types/{id}", activityType.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActivityType> activityTypeList = activityTypeRepository.findAll();
        assertThat(activityTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
