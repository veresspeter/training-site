package hu.redriver.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "event_participant")
@IdClass(EventParticipantId.class)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EventParticipant implements Serializable {

    @Id
    @Column(name = "participant_id")
    private Long participantId;

    @Id
    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "pass_id")
    private Long passId;

    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getPassId() {
        return passId;
    }

    public void setPassId(Long passId) {
        this.passId = passId;
    }

    @Override
    public String toString() {
        return "EventParticipant{" +
            "participantId=" + participantId +
            ", eventId=" + eventId +
            ", passId=" + passId +
            '}';
    }
}
