package hu.redriver.service.mapper;


import hu.redriver.domain.*;
import hu.redriver.service.dto.PassTypeDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link PassType} and its DTO {@link PassTypeDTO}.
 */
@Mapper(componentModel = "spring", uses = {ActivityTypeMapper.class, ActivityMapper.class})
public interface PassTypeMapper extends EntityMapper<PassTypeDTO, PassType> {

    @Mapping(source = "availableForType.id", target = "availableForTypeId")
    @Mapping(source = "availableForActivity.id", target = "availableForActivityId")
    PassTypeDTO toDto(PassType passType);

    @Mapping(source = "availableForTypeId", target = "availableForType")
    @Mapping(source = "availableForActivityId", target = "availableForActivity")
    PassType toEntity(PassTypeDTO passTypeDTO);

    default PassType fromId(Long id) {
        if (id == null) {
            return null;
        }
        PassType passType = new PassType();
        passType.setId(id);
        return passType;
    }
}
