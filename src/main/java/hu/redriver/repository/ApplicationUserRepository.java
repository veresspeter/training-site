package hu.redriver.repository;

import hu.redriver.domain.ApplicationUser;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ApplicationUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
}
