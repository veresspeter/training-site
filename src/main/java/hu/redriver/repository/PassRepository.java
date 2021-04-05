package hu.redriver.repository;

import hu.redriver.domain.AppUser;
import hu.redriver.domain.Pass;

import hu.redriver.domain.PassType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Pass entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PassRepository extends JpaRepository<Pass, Long> {
    Optional<Pass> findByPaymentId(String paymentId);

    List<Pass> findAllByUserIdAndPassTypeIn(Long user_id, List<PassType> passTypes);

    List<Pass> findAllByUser(AppUser appUser);
}
