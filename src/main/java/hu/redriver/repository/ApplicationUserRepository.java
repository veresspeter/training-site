package hu.redriver.repository;

import hu.redriver.domain.ApplicationUser;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data  repository for the ApplicationUser entity.
 */
@Repository
public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
    Optional<ApplicationUser> findByInternalUserId(Long id);
}
