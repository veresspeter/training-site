package hu.redriver.repository;

import hu.redriver.domain.ActivityType;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data  repository for the ActivityType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActivityTypeRepository extends JpaRepository<ActivityType, Long> {
}
