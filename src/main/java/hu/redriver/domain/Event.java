package hu.redriver.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import hu.redriver.domain.enumeration.LinkType;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "start", nullable = false)
    private ZonedDateTime start;

    @NotNull
    @Column(name = "jhi_end", nullable = false)
    private ZonedDateTime end;

    @Column(name = "jhi_limit")
    private Integer limit;

    @Column(name = "stream_link")
    private String streamLink;

    @Enumerated(EnumType.STRING)
    @Column(name = "stream_link_type")
    private LinkType streamLinkType;

    @Column(name = "comment")
    private String comment;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "events", allowSetters = true)
    private ApplicationUser organizer;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "events", allowSetters = true)
    private Activity activity;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(name = "event_participants",
               joinColumns = @JoinColumn(name = "event_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "participants_id", referencedColumnName = "id"))
    private Set<ApplicationUser> participants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Event name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ZonedDateTime getStart() {
        return start;
    }

    public Event start(ZonedDateTime start) {
        this.start = start;
        return this;
    }

    public void setStart(ZonedDateTime start) {
        this.start = start;
    }

    public ZonedDateTime getEnd() {
        return end;
    }

    public Event end(ZonedDateTime end) {
        this.end = end;
        return this;
    }

    public void setEnd(ZonedDateTime end) {
        this.end = end;
    }

    public Integer getLimit() {
        return limit;
    }

    public Event limit(Integer limit) {
        this.limit = limit;
        return this;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public String getStreamLink() {
        return streamLink;
    }

    public Event streamLink(String streamLink) {
        this.streamLink = streamLink;
        return this;
    }

    public void setStreamLink(String streamLink) {
        this.streamLink = streamLink;
    }

    public LinkType getStreamLinkType() {
        return streamLinkType;
    }

    public Event streamLinkType(LinkType streamLinkType) {
        this.streamLinkType = streamLinkType;
        return this;
    }

    public void setStreamLinkType(LinkType streamLinkType) {
        this.streamLinkType = streamLinkType;
    }

    public String getComment() {
        return comment;
    }

    public Event comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ApplicationUser getOrganizer() {
        return organizer;
    }

    public Event organizer(ApplicationUser applicationUser) {
        this.organizer = applicationUser;
        return this;
    }

    public void setOrganizer(ApplicationUser applicationUser) {
        this.organizer = applicationUser;
    }

    public Activity getActivity() {
        return activity;
    }

    public Event activity(Activity activity) {
        this.activity = activity;
        return this;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public Set<ApplicationUser> getParticipants() {
        return participants;
    }

    public Event participants(Set<ApplicationUser> applicationUsers) {
        this.participants = applicationUsers;
        return this;
    }

    public Event addParticipants(ApplicationUser applicationUser) {
        this.participants.add(applicationUser);
        applicationUser.getEvents().add(this);
        return this;
    }

    public Event removeParticipants(ApplicationUser applicationUser) {
        this.participants.remove(applicationUser);
        applicationUser.getEvents().remove(this);
        return this;
    }

    public void setParticipants(Set<ApplicationUser> applicationUsers) {
        this.participants = applicationUsers;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Event)) {
            return false;
        }
        return id != null && id.equals(((Event) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", start='" + getStart() + "'" +
            ", end='" + getEnd() + "'" +
            ", limit=" + getLimit() +
            ", streamLink='" + getStreamLink() + "'" +
            ", streamLinkType='" + getStreamLinkType() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
