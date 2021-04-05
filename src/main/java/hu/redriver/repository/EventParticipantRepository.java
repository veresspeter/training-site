package hu.redriver.repository;

import hu.redriver.domain.EventParticipant;
import hu.redriver.domain.EventParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, EventParticipantId> {
}
