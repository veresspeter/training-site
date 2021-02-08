package hu.redriver.repository;

import hu.redriver.domain.PassType;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the PassType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PassTypeRepository extends JpaRepository<PassType, Long> {
}
