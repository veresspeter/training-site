package hu.redriver.service;

import hu.redriver.domain.Pass;
import hu.redriver.repository.PassRepository;
import hu.redriver.service.dto.PassDTO;
import hu.redriver.service.mapper.PassMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public PassService(PassRepository passRepository, PassMapper passMapper) {
        this.passRepository = passRepository;
        this.passMapper = passMapper;
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
