package hu.redriver.service;

import hu.redriver.domain.ActivityType;
import hu.redriver.repository.ActivityTypeRepository;
import hu.redriver.service.dto.ActivityTypeDTO;
import hu.redriver.service.mapper.ActivityTypeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link ActivityType}.
 */
@Service
@Transactional
public class ActivityTypeService {

    private final Logger log = LoggerFactory.getLogger(ActivityTypeService.class);

    private final ActivityTypeRepository activityTypeRepository;

    private final ActivityTypeMapper activityTypeMapper;

    public ActivityTypeService(ActivityTypeRepository activityTypeRepository, ActivityTypeMapper activityTypeMapper) {
        this.activityTypeRepository = activityTypeRepository;
        this.activityTypeMapper = activityTypeMapper;
    }

    /**
     * Save a activityType.
     *
     * @param activityTypeDTO the entity to save.
     * @return the persisted entity.
     */
    public ActivityTypeDTO save(ActivityTypeDTO activityTypeDTO) {
        log.debug("Request to save ActivityType : {}", activityTypeDTO);
        ActivityType activityType = activityTypeMapper.toEntity(activityTypeDTO);
        activityType = activityTypeRepository.save(activityType);
        return activityTypeMapper.toDto(activityType);
    }

    /**
     * Get all the activityTypes.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ActivityTypeDTO> findAll() {
        log.debug("Request to get all ActivityTypes");
        return activityTypeRepository.findAll().stream()
            .map(activityTypeMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one activityType by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ActivityTypeDTO> findOne(Long id) {
        log.debug("Request to get ActivityType : {}", id);
        return activityTypeRepository.findById(id)
            .map(activityTypeMapper::toDto);
    }

    /**
     * Delete the activityType by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ActivityType : {}", id);
        activityTypeRepository.deleteById(id);
    }
}
