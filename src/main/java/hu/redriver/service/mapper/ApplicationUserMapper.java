package hu.redriver.service.mapper;


import hu.redriver.domain.*;
import hu.redriver.service.dto.ApplicationUserDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link ApplicationUser} and its DTO {@link ApplicationUserDTO}.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ApplicationUserMapper extends EntityMapper<ApplicationUserDTO, ApplicationUser> {

    @Mapping(source = "internalUser.id", target = "internalUserId")
    ApplicationUserDTO toDto(ApplicationUser applicationUser);

    @Mapping(source = "internalUserId", target = "internalUser")
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "removeEvents", ignore = true)
    ApplicationUser toEntity(ApplicationUserDTO applicationUserDTO);

    default ApplicationUser fromId(Long id) {
        if (id == null) {
            return null;
        }
        ApplicationUser applicationUser = new ApplicationUser();
        applicationUser.setId(id);
        return applicationUser;
    }
}
