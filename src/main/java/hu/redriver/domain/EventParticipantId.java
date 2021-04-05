package hu.redriver.domain;

import java.io.Serializable;

public class EventParticipantId implements Serializable {
    private Long participantId;
    private Long eventId;

    public EventParticipantId() {
    }

    public EventParticipantId(Long participantId, Long eventId) {
        this.participantId = participantId;
        this.eventId = eventId;
    }
}
