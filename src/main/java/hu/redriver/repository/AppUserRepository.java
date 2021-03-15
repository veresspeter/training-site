package hu.redriver.repository;

import hu.redriver.domain.AppUser;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the ApplicationUser entity.
 */
@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByInternalUserId(Long id);

    List<AppUser> findByIsTrainerTrue();
}
