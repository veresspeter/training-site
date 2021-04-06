package hu.redriver.service;

import hu.redriver.domain.Pass;
import hu.redriver.domain.PassType;
import hu.redriver.domain.enumeration.PaymentStatus;
import hu.redriver.repository.PassRepository;
import hu.redriver.repository.PassTypeRepository;
import hu.redriver.service.dto.AppUserDTO;
import hu.redriver.service.dto.PassDTO;
import hu.redriver.service.dto.PassTypeDTO;
import hu.redriver.service.dto.UserDTO;
import hu.redriver.service.mapper.AppUserMapper;
import hu.redriver.service.mapper.PassMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link Pass}.
 */
@Service
@Transactional
public class PassService {

    private final Logger log = LoggerFactory.getLogger(PassService.class);

    private final PassRepository passRepository;
    private final PassMapper passMapper;
    private final AppUserMapper appUserMapper;
    private final PassTypeService passTypeService;
    private final UserService userService;
    private final AppUserService appUserService;

    public PassService(PassRepository passRepository,
                       PassMapper passMapper,
                       AppUserMapper appUserMapper,
                       PassTypeService passTypeService,
                       UserService userService,
                       AppUserService appUserService) {
        this.passTypeService = passTypeService;
        this.userService = userService;
        this.appUserService = appUserService;
        this.passRepository = passRepository;
        this.passMapper = passMapper;
        this.appUserMapper = appUserMapper;
    }

    /**
     * Save a pass.
     *
     * @param passDTO the entity to save.
     * @return the persisted entity.
     */
    public PassDTO save(PassDTO passDTO) {
        log.debug("Request to save Pass : {}", passDTO);
        Pass pass = passMapper.toEntity(passDTO);
        pass = passRepository.save(pass);
        return passMapper.toDto(pass);
    }

    public PassDTO purchase(Long passTypeId) {
        log.debug("Request to purchase Pass by PassType: {}", passTypeId);

        final PassTypeDTO passTypeDTO = passTypeService.findOne(passTypeId)
            .orElseThrow(() -> new RuntimeException("Bérlet típus nem találtató"));
        final Long userId = appUserService.findOneByInternalUserId(
            userService.getUserWithAuthorities()
                .map(UserDTO::new)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található"))
                .getId())
            .orElseThrow(() -> new RuntimeException("Felhasználó nem található"))
            .getId();

        return createPass(passTypeId, passTypeDTO, userId);
    }

    private PassDTO createPass(Long passTypeId, PassTypeDTO passTypeDTO, Long userId) {
        PassDTO passDTO = new PassDTO();
        passDTO.setUsageNo(0);
        passDTO.setPassTypeId(passTypeId);
        passDTO.setUserId(userId);
        passDTO.setPaymentStatus(PaymentStatus.NEW);
        passDTO.setPurchased(ZonedDateTime.now());
        passDTO.setValidFrom(ZonedDateTime.now());
        if (passTypeDTO.getDurationDays() != null) {
            passDTO.setValidTo(passDTO.getValidFrom().plusDays(passTypeDTO.getDurationDays()));
        }

        return save(passDTO);
    }

    /**
     * Get all the passes.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<PassDTO> findAll() {
        log.debug("Request to get all Passes");
        return passRepository.findAll().stream()
            .map(passMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    @Transactional(readOnly = true)
    public Page<PassDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Passes");
        return passRepository.findAll(pageable).map(passMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<PassDTO> findAllByAppUser(AppUserDTO appUserDTO) {
        log.debug("Request to get all Passes by User: {}", appUserDTO);

        List<Pass> passes = passRepository.findAllByUser(appUserMapper.toEntity(appUserDTO));
        return passes.stream()
            .map(passMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one pass by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PassDTO> findOne(Long id) {
        log.debug("Request to get Pass : {}", id);
        return passRepository.findById(id)
            .map(passMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Optional<PassDTO> findOneByPaymentId(String paymentId) {
        log.debug("Request to get Pass by PaymentId : {}", paymentId);
        return passRepository.findByPaymentId(paymentId)
            .map(passMapper::toDto);
    }


    @Transactional(readOnly = true)
    public List<PassDTO> findOneByActivityTypeId(Long activityTypeId, Long userId, String status) {
        log.debug("Request to get all Pass by ActivityTypeId : {}", activityTypeId);
        List<PassType> passTypes = passTypeService.findAllByActivityTypeId(activityTypeId);
        return passRepository.findAllByUserIdAndPassTypeInAndPaymentStatus(userId, passTypes, status).stream()
            .map(passMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Delete the pass by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Pass : {}", id);
        passRepository.deleteById(id);
    }
}
