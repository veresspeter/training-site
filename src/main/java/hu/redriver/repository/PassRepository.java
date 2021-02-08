package hu.redriver.repository;

import hu.redriver.domain.Pass;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Pass entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PassRepository extends JpaRepository<Pass, Long> {
}
