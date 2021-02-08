package hu.redriver.web.rest;

import hu.redriver.MaxmoveApp;
import hu.redriver.domain.Event;
import hu.redriver.domain.ApplicationUser;
import hu.redriver.domain.Activity;
import hu.redriver.repository.EventRepository;
import hu.redriver.service.EventService;
import hu.redriver.service.dto.EventDTO;
import hu.redriver.service.mapper.EventMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import hu.redriver.domain.enumeration.LinkType;
/**
 * Integration tests for the {@link EventResource} REST controller.
 */
@SpringBootTest(classes = MaxmoveApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class EventResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_LIMIT = 1;
    private static final Integer UPDATED_LIMIT = 2;

    private static final String DEFAULT_STREAM_LINK = "AAAAAAAAAA";
    private static final String UPDATED_STREAM_LINK = "BBBBBBBBBB";

    private static final LinkType DEFAULT_STREAM_LINK_TYPE = LinkType.ZOOM;
    private static final LinkType UPDATED_STREAM_LINK_TYPE = LinkType.SKYPE;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    @Autowired
    private EventRepository eventRepository;

    @Mock
    private EventRepository eventRepositoryMock;

    @Autowired
    private EventMapper eventMapper;

    @Mock
    private EventService eventServiceMock;

    @Autowired
    private EventService eventService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventMockMvc;

    private Event event;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Event createEntity(EntityManager em) {
        Event event = new Event()
            .name(DEFAULT_NAME)
            .start(DEFAULT_START)
            .end(DEFAULT_END)
            .limit(DEFAULT_LIMIT)
            .streamLink(DEFAULT_STREAM_LINK)
            .streamLinkType(DEFAULT_STREAM_LINK_TYPE)
            .comment(DEFAULT_COMMENT);
        // Add required entity
        ApplicationUser applicationUser;
        if (TestUtil.findAll(em, ApplicationUser.class).isEmpty()) {
            applicationUser = ApplicationUserResourceIT.createEntity(em);
            em.persist(applicationUser);
            em.flush();
        } else {
            applicationUser = TestUtil.findAll(em, ApplicationUser.class).get(0);
        }
        event.setOrganizer(applicationUser);
        // Add required entity
        Activity activity;
        if (TestUtil.findAll(em, Activity.class).isEmpty()) {
            activity = ActivityResourceIT.createEntity(em);
            em.persist(activity);
            em.flush();
        } else {
            activity = TestUtil.findAll(em, Activity.class).get(0);
        }
        event.setActivity(activity);
        return event;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Event createUpdatedEntity(EntityManager em) {
        Event event = new Event()
            .name(UPDATED_NAME)
            .start(UPDATED_START)
            .end(UPDATED_END)
            .limit(UPDATED_LIMIT)
            .streamLink(UPDATED_STREAM_LINK)
            .streamLinkType(UPDATED_STREAM_LINK_TYPE)
            .comment(UPDATED_COMMENT);
        // Add required entity
        ApplicationUser applicationUser;
        if (TestUtil.findAll(em, ApplicationUser.class).isEmpty()) {
            applicationUser = ApplicationUserResourceIT.createUpdatedEntity(em);
            em.persist(applicationUser);
            em.flush();
        } else {
            applicationUser = TestUtil.findAll(em, ApplicationUser.class).get(0);
        }
        event.setOrganizer(applicationUser);
        // Add required entity
        Activity activity;
        if (TestUtil.findAll(em, Activity.class).isEmpty()) {
            activity = ActivityResourceIT.createUpdatedEntity(em);
            em.persist(activity);
            em.flush();
        } else {
            activity = TestUtil.findAll(em, Activity.class).get(0);
        }
        event.setActivity(activity);
        return event;
    }

    @BeforeEach
    public void initTest() {
        event = createEntity(em);
    }

    @Test
    @Transactional
    public void createEvent() throws Exception {
        int databaseSizeBeforeCreate = eventRepository.findAll().size();
        // Create the Event
        EventDTO eventDTO = eventMapper.toDto(event);
        restEventMockMvc.perform(post("/api/events").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(eventDTO)))
            .andExpect(status().isCreated());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeCreate + 1);
        Event testEvent = eventList.get(eventList.size() - 1);
        assertThat(testEvent.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEvent.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testEvent.getEnd()).isEqualTo(DEFAULT_END);
        assertThat(testEvent.getLimit()).isEqualTo(DEFAULT_LIMIT);
        assertThat(testEvent.getStreamLink()).isEqualTo(DEFAULT_STREAM_LINK);
        assertThat(testEvent.getStreamLinkType()).isEqualTo(DEFAULT_STREAM_LINK_TYPE);
        assertThat(testEvent.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    public void createEventWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventRepository.findAll().size();

        // Create the Event with an existing ID
        event.setId(1L);
        EventDTO eventDTO = eventMapper.toDto(event);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventMockMvc.perform(post("/api/events").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(eventDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setName(null);

        // Create the Event, which fails.
        EventDTO eventDTO = eventMapper.toDto(event);


        restEventMockMvc.perform(post("/api/events").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(eventDTO)))
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStartIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setStart(null);

        // Create the Event, which fails.
        EventDTO eventDTO = eventMapper.toDto(event);


        restEventMockMvc.perform(post("/api/events").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(eventDTO)))
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEndIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setEnd(null);

        // Create the Event, which fails.
        EventDTO eventDTO = eventMapper.toDto(event);


        restEventMockMvc.perform(post("/api/events").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(eventDTO)))
            .andExpect(status().isBadRequest());

        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEvents() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get all the eventList
        restEventMockMvc.perform(get("/api/events?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(event.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
            .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())))
            .andExpect(jsonPath("$.[*].limit").value(hasItem(DEFAULT_LIMIT)))
            .andExpect(jsonPath("$.[*].streamLink").value(hasItem(DEFAULT_STREAM_LINK)))
            .andExpect(jsonPath("$.[*].streamLinkType").value(hasItem(DEFAULT_STREAM_LINK_TYPE.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllEventsWithEagerRelationshipsIsEnabled() throws Exception {
        when(eventServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEventMockMvc.perform(get("/api/events?eagerload=true"))
            .andExpect(status().isOk());

        verify(eventServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllEventsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(eventServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEventMockMvc.perform(get("/api/events?eagerload=true"))
            .andExpect(status().isOk());

        verify(eventServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get the event
        restEventMockMvc.perform(get("/api/events/{id}", event.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(event.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.toString()))
            .andExpect(jsonPath("$.limit").value(DEFAULT_LIMIT))
            .andExpect(jsonPath("$.streamLink").value(DEFAULT_STREAM_LINK))
            .andExpect(jsonPath("$.streamLinkType").value(DEFAULT_STREAM_LINK_TYPE.toString()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }
    @Test
    @Transactional
    public void getNonExistingEvent() throws Exception {
        // Get the event
        restEventMockMvc.perform(get("/api/events/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // Update the event
        Event updatedEvent = eventRepository.findById(event.getId()).get();
        // Disconnect from session so that the updates on updatedEvent are not directly saved in db
        em.detach(updatedEvent);
        updatedEvent
            .name(UPDATED_NAME)
            .start(UPDATED_START)
            .end(UPDATED_END)
            .limit(UPDATED_LIMIT)
            .streamLink(UPDATED_STREAM_LINK)
            .streamLinkType(UPDATED_STREAM_LINK_TYPE)
            .comment(UPDATED_COMMENT);
        EventDTO eventDTO = eventMapper.toDto(updatedEvent);

        restEventMockMvc.perform(put("/api/events").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(eventDTO)))
            .andExpect(status().isOk());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
        Event testEvent = eventList.get(eventList.size() - 1);
        assertThat(testEvent.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEvent.getStart()).isEqualTo(UPDATED_START);
        assertThat(testEvent.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testEvent.getLimit()).isEqualTo(UPDATED_LIMIT);
        assertThat(testEvent.getStreamLink()).isEqualTo(UPDATED_STREAM_LINK);
        assertThat(testEvent.getStreamLinkType()).isEqualTo(UPDATED_STREAM_LINK_TYPE);
        assertThat(testEvent.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    public void updateNonExistingEvent() throws Exception {
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // Create the Event
        EventDTO eventDTO = eventMapper.toDto(event);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventMockMvc.perform(put("/api/events").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(eventDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Event in the database
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        int databaseSizeBeforeDelete = eventRepository.findAll().size();

        // Delete the event
        restEventMockMvc.perform(delete("/api/events/{id}", event.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Event> eventList = eventRepository.findAll();
        assertThat(eventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
