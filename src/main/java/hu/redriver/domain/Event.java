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

    @Column(name = "zoom_room_no")
    private String zoomRoomNo;

    @Column(name = "zoom_room_psw")
    private String zoomRoomPsw;

    @Column(name = "zoom_start_link")
    private String zoomStartLink;

    @Column(name = "comment")
    private String comment;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "events", allowSetters = true)
    private AppUser organizer;

    @NotNull
    private Long activityId;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(name = "event_participant",
               joinColumns = @JoinColumn(name = "event_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "participant_id", referencedColumnName = "id"))
    private Set<AppUser> participants = new HashSet<>();

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

    public String getZoomRoomNo() {
        return zoomRoomNo;
    }

    public Event zoomRoomNo(String zoomRoomNo) {
        this.zoomRoomNo = zoomRoomNo;
        return this;
    }

    public void setZoomRoomNo(String zoomRoomNo) {
        this.zoomRoomNo = zoomRoomNo;
    }

    public String getZoomRoomPsw() {
        return zoomRoomPsw;
    }

    public Event zoomRoomPsw(String zoomRoomPsw) {
        this.zoomRoomPsw = zoomRoomPsw;
        return this;
    }

    public void setZoomRoomPsw(String zoomRoomPsw) {
        this.zoomRoomPsw = zoomRoomPsw;
    }

    public String getZoomStartLink() {
        return zoomStartLink;
    }

    public Event zoomStartLink(String zoomStartLink) {
        this.zoomStartLink = zoomStartLink;
        return this;
    }

    public void setZoomStartLink(String zoomStartLink) {
        this.zoomStartLink = zoomStartLink;
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

    public AppUser getOrganizer() {
        return organizer;
    }

    public Event organizer(AppUser appUser) {
        this.organizer = appUser;
        return this;
    }

    public void setOrganizer(AppUser appUser) {
        this.organizer = appUser;
    }

    public Long getActivityId() {
        return activityId;
    }

    public Event activityId(Long activityId) {
        this.activityId = activityId;
        return this;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Set<AppUser> getParticipants() {
        return participants;
    }

    public Event participants(Set<AppUser> appUsers) {
        this.participants = appUsers;
        return this;
    }

    public Event addParticipants(AppUser appUser) {
        this.participants.add(appUser);
        appUser.getEvents().add(this);
        return this;
    }

    public Event removeParticipants(AppUser appUser) {
        this.participants.remove(appUser);
        appUser.getEvents().remove(this);
        return this;
    }

    public void setParticipants(Set<AppUser> appUsers) {
        this.participants = appUsers;
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
            ", zoomRoomNo='" + getZoomRoomNo() + "'" +
            ", zoomRoomPsw='" + getZoomRoomPsw() + "'" +
            ", zoomStartLink='" + getZoomStartLink() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
