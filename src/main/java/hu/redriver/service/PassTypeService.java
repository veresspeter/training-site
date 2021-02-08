package hu.redriver.service;

import hu.redriver.domain.PassType;
import hu.redriver.repository.PassTypeRepository;
import hu.redriver.service.dto.PassTypeDTO;
import hu.redriver.service.mapper.PassTypeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link PassType}.
 */
@Service
@Transactional
public class PassTypeService {

    private final Logger log = LoggerFactory.getLogger(PassTypeService.class);

    private final PassTypeRepository passTypeRepository;

    private final PassTypeMapper passTypeMapper;

    public PassTypeService(PassTypeRepository passTypeRepository, PassTypeMapper passTypeMapper) {
        this.passTypeRepository = passTypeRepository;
        this.passTypeMapper = passTypeMapper;
    }

    /**
     * Save a passType.
     *
     * @param passTypeDTO the entity to save.
     * @return the persisted entity.
     */
    public PassTypeDTO save(PassTypeDTO passTypeDTO) {
        log.debug("Request to save PassType : {}", passTypeDTO);
        PassType passType = passTypeMapper.toEntity(passTypeDTO);
        passType = passTypeRepository.save(passType);
        return passTypeMapper.toDto(passType);
    }

    /**
     * Get all the passTypes.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<PassTypeDTO> findAll() {
        log.debug("Request to get all PassTypes");
        return passTypeRepository.findAll().stream()
            .map(passTypeMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one passType by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PassTypeDTO> findOne(Long id) {
        log.debug("Request to get PassType : {}", id);
        return passTypeRepository.findById(id)
            .map(passTypeMapper::toDto);
    }

    /**
     * Delete the passType by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete PassType : {}", id);
        passTypeRepository.deleteById(id);
    }
}
