package hu.redriver.web.rest;

import hu.redriver.MaxmoveApp;
import hu.redriver.domain.AppUser;
import hu.redriver.domain.User;
import hu.redriver.repository.AppUserRepository;
import hu.redriver.service.AppUserService;
import hu.redriver.service.dto.AppUserDTO;
import hu.redriver.service.mapper.AppUserMapper;

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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import hu.redriver.domain.enumeration.Sex;
/**
 * Integration tests for the {@link AppUserResource} REST controller.
 */
@SpringBootTest(classes = MaxmoveApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class AppUserResourceIT {

    private static final Sex DEFAULT_SEX = Sex.MAN;
    private static final Sex UPDATED_SEX = Sex.WOMAN;

    private static final LocalDate DEFAULT_BIRTH_DAY = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BIRTH_DAY = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_GOOGLE_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_GOOGLE_TOKEN = "BBBBBBBBBB";

    private static final String DEFAULT_FACEBOOK_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_FACEBOOK_TOKEN = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_INTRODUCTION = "AAAAAAAAAA";
    private static final String UPDATED_INTRODUCTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_TRAINER = false;
    private static final Boolean UPDATED_IS_TRAINER = true;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private AppUserMapper appUserMapper;

    @Autowired
    private AppUserService appUserService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restApplicationUserMockMvc;

    private AppUser appUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppUser createEntity(EntityManager em) {
        AppUser appUser = new AppUser()
            .sex(DEFAULT_SEX)
            .birthDay(DEFAULT_BIRTH_DAY)
            .googleToken(DEFAULT_GOOGLE_TOKEN)
            .facebookToken(DEFAULT_FACEBOOK_TOKEN)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .introduction(DEFAULT_INTRODUCTION)
            .isTrainer(DEFAULT_IS_TRAINER);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        appUser.setInternalUser(user);
        return appUser;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppUser createUpdatedEntity(EntityManager em) {
        AppUser appUser = new AppUser()
            .sex(UPDATED_SEX)
            .birthDay(UPDATED_BIRTH_DAY)
            .googleToken(UPDATED_GOOGLE_TOKEN)
            .facebookToken(UPDATED_FACEBOOK_TOKEN)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .introduction(UPDATED_INTRODUCTION)
            .isTrainer(UPDATED_IS_TRAINER);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        appUser.setInternalUser(user);
        return appUser;
    }

    @BeforeEach
    public void initTest() {
        appUser = createEntity(em);
    }

    @Test
    @Transactional
    public void createApplicationUser() throws Exception {
        int databaseSizeBeforeCreate = appUserRepository.findAll().size();
        // Create the ApplicationUser
        AppUserDTO appUserDTO = appUserMapper.toDto(appUser);
        restApplicationUserMockMvc.perform(post("/api/application-users").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(appUserDTO)))
            .andExpect(status().isCreated());

        // Validate the ApplicationUser in the database
        List<AppUser> appUserList = appUserRepository.findAll();
        assertThat(appUserList).hasSize(databaseSizeBeforeCreate + 1);
        AppUser testAppUser = appUserList.get(appUserList.size() - 1);
        assertThat(testAppUser.getSex()).isEqualTo(DEFAULT_SEX);
        assertThat(testAppUser.getBirthDay()).isEqualTo(DEFAULT_BIRTH_DAY);
        assertThat(testAppUser.getGoogleToken()).isEqualTo(DEFAULT_GOOGLE_TOKEN);
        assertThat(testAppUser.getFacebookToken()).isEqualTo(DEFAULT_FACEBOOK_TOKEN);
        assertThat(testAppUser.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testAppUser.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testAppUser.getIntroduction()).isEqualTo(DEFAULT_INTRODUCTION);
        assertThat(testAppUser.isIsTrainer()).isEqualTo(DEFAULT_IS_TRAINER);
    }

    @Test
    @Transactional
    public void createApplicationUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = appUserRepository.findAll().size();

        // Create the ApplicationUser with an existing ID
        appUser.setId(1L);
        AppUserDTO appUserDTO = appUserMapper.toDto(appUser);

        // An entity with an existing ID cannot be created, so this API call must fail
        restApplicationUserMockMvc.perform(post("/api/application-users").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(appUserDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ApplicationUser in the database
        List<AppUser> appUserList = appUserRepository.findAll();
        assertThat(appUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkIsTrainerIsRequired() throws Exception {
        int databaseSizeBeforeTest = appUserRepository.findAll().size();
        // set the field null
        appUser.setIsTrainer(null);

        // Create the ApplicationUser, which fails.
        AppUserDTO appUserDTO = appUserMapper.toDto(appUser);


        restApplicationUserMockMvc.perform(post("/api/application-users").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(appUserDTO)))
            .andExpect(status().isBadRequest());

        List<AppUser> appUserList = appUserRepository.findAll();
        assertThat(appUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllApplicationUsers() throws Exception {
        // Initialize the database
        appUserRepository.saveAndFlush(appUser);

        // Get all the applicationUserList
        restApplicationUserMockMvc.perform(get("/api/application-users?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].sex").value(hasItem(DEFAULT_SEX.toString())))
            .andExpect(jsonPath("$.[*].birthDay").value(hasItem(DEFAULT_BIRTH_DAY.toString())))
            .andExpect(jsonPath("$.[*].googleToken").value(hasItem(DEFAULT_GOOGLE_TOKEN)))
            .andExpect(jsonPath("$.[*].facebookToken").value(hasItem(DEFAULT_FACEBOOK_TOKEN)))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].introduction").value(hasItem(DEFAULT_INTRODUCTION)))
            .andExpect(jsonPath("$.[*].isTrainer").value(hasItem(DEFAULT_IS_TRAINER.booleanValue())));
    }

    @Test
    @Transactional
    public void getApplicationUser() throws Exception {
        // Initialize the database
        appUserRepository.saveAndFlush(appUser);

        // Get the applicationUser
        restApplicationUserMockMvc.perform(get("/api/application-users/{id}", appUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(appUser.getId().intValue()))
            .andExpect(jsonPath("$.sex").value(DEFAULT_SEX.toString()))
            .andExpect(jsonPath("$.birthDay").value(DEFAULT_BIRTH_DAY.toString()))
            .andExpect(jsonPath("$.googleToken").value(DEFAULT_GOOGLE_TOKEN))
            .andExpect(jsonPath("$.facebookToken").value(DEFAULT_FACEBOOK_TOKEN))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.introduction").value(DEFAULT_INTRODUCTION))
            .andExpect(jsonPath("$.isTrainer").value(DEFAULT_IS_TRAINER.booleanValue()));
    }
    @Test
    @Transactional
    public void getNonExistingApplicationUser() throws Exception {
        // Get the applicationUser
        restApplicationUserMockMvc.perform(get("/api/application-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateApplicationUser() throws Exception {
        // Initialize the database
        appUserRepository.saveAndFlush(appUser);

        int databaseSizeBeforeUpdate = appUserRepository.findAll().size();

        // Update the applicationUser
        AppUser updatedAppUser = appUserRepository.findById(appUser.getId()).get();
        // Disconnect from session so that the updates on updatedApplicationUser are not directly saved in db
        em.detach(updatedAppUser);
        updatedAppUser
            .sex(UPDATED_SEX)
            .birthDay(UPDATED_BIRTH_DAY)
            .googleToken(UPDATED_GOOGLE_TOKEN)
            .facebookToken(UPDATED_FACEBOOK_TOKEN)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .introduction(UPDATED_INTRODUCTION)
            .isTrainer(UPDATED_IS_TRAINER);
        AppUserDTO appUserDTO = appUserMapper.toDto(updatedAppUser);

        restApplicationUserMockMvc.perform(put("/api/application-users").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(appUserDTO)))
            .andExpect(status().isOk());

        // Validate the ApplicationUser in the database
        List<AppUser> appUserList = appUserRepository.findAll();
        assertThat(appUserList).hasSize(databaseSizeBeforeUpdate);
        AppUser testAppUser = appUserList.get(appUserList.size() - 1);
        assertThat(testAppUser.getSex()).isEqualTo(UPDATED_SEX);
        assertThat(testAppUser.getBirthDay()).isEqualTo(UPDATED_BIRTH_DAY);
        assertThat(testAppUser.getGoogleToken()).isEqualTo(UPDATED_GOOGLE_TOKEN);
        assertThat(testAppUser.getFacebookToken()).isEqualTo(UPDATED_FACEBOOK_TOKEN);
        assertThat(testAppUser.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testAppUser.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testAppUser.getIntroduction()).isEqualTo(UPDATED_INTRODUCTION);
        assertThat(testAppUser.isIsTrainer()).isEqualTo(UPDATED_IS_TRAINER);
    }

    @Test
    @Transactional
    public void updateNonExistingApplicationUser() throws Exception {
        int databaseSizeBeforeUpdate = appUserRepository.findAll().size();

        // Create the ApplicationUser
        AppUserDTO appUserDTO = appUserMapper.toDto(appUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApplicationUserMockMvc.perform(put("/api/application-users").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(appUserDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ApplicationUser in the database
        List<AppUser> appUserList = appUserRepository.findAll();
        assertThat(appUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteApplicationUser() throws Exception {
        // Initialize the database
        appUserRepository.saveAndFlush(appUser);

        int databaseSizeBeforeDelete = appUserRepository.findAll().size();

        // Delete the applicationUser
        restApplicationUserMockMvc.perform(delete("/api/application-users/{id}", appUser.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AppUser> appUserList = appUserRepository.findAll();
        assertThat(appUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
