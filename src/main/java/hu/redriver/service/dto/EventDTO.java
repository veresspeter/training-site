package hu.redriver.service.dto;

import java.time.ZonedDateTime;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import hu.redriver.domain.enumeration.LinkType;

/**
 * A DTO for the {@link hu.redriver.domain.Event} entity.
 */
public class EventDTO implements Serializable {
    
    private Long id;

    @NotNull
    private String name;

    @NotNull
    private ZonedDateTime start;

    @NotNull
    private ZonedDateTime end;

    private Integer limit;

    private String streamLink;

    private LinkType streamLinkType;

    private String comment;


    private Long organizerId;

    private Long activityId;
    private Set<ApplicationUserDTO> participants = new HashSet<>();
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ZonedDateTime getStart() {
        return start;
    }

    public void setStart(ZonedDateTime start) {
        this.start = start;
    }

    public ZonedDateTime getEnd() {
        return end;
    }

    public void setEnd(ZonedDateTime end) {
        this.end = end;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public String getStreamLink() {
        return streamLink;
    }

    public void setStreamLink(String streamLink) {
        this.streamLink = streamLink;
    }

    public LinkType getStreamLinkType() {
        return streamLinkType;
    }

    public void setStreamLinkType(LinkType streamLinkType) {
        this.streamLinkType = streamLinkType;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long applicationUserId) {
        this.organizerId = applicationUserId;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Set<ApplicationUserDTO> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<ApplicationUserDTO> applicationUsers) {
        this.participants = applicationUsers;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventDTO)) {
            return false;
        }

        return id != null && id.equals(((EventDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", start='" + getStart() + "'" +
            ", end='" + getEnd() + "'" +
            ", limit=" + getLimit() +
            ", streamLink='" + getStreamLink() + "'" +
            ", streamLinkType='" + getStreamLinkType() + "'" +
            ", comment='" + getComment() + "'" +
            ", organizerId=" + getOrganizerId() +
            ", activityId=" + getActivityId() +
            ", participants='" + getParticipants() + "'" +
            "}";
    }
}
