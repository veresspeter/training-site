package hu.redriver.service.mapper;


import hu.redriver.domain.*;
import hu.redriver.service.dto.PassDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Pass} and its DTO {@link PassDTO}.
 */
@Mapper(componentModel = "spring", uses = {PassTypeMapper.class, AppUserMapper.class})
public interface PassMapper extends EntityMapper<PassDTO, Pass> {

    @Mapping(source = "passType.id", target = "passTypeId")
    @Mapping(source = "user.id", target = "userId")
    PassDTO toDto(Pass pass);

    @Mapping(source = "passTypeId", target = "passType")
    @Mapping(source = "userId", target = "user")
    Pass toEntity(PassDTO passDTO);

    default Pass fromId(Long id) {
        if (id == null) {
            return null;
        }
        Pass pass = new Pass();
        pass.setId(id);
        return pass;
    }
}
