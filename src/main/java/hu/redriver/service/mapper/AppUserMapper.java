package hu.redriver.service.mapper;


import hu.redriver.domain.*;
import hu.redriver.service.dto.AppUserDTO;

import hu.redriver.service.dto.UserDTO;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Mapper for the entity {@link AppUser} and its DTO {@link AppUserDTO}.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface AppUserMapper extends EntityMapper<AppUserDTO, AppUser> {

    @Mapping(source = "appUser.internalUser", target = "internalUserDTO")
    AppUserDTO toDto(AppUser appUser);

    @Mapping(source = "internalUserDTO", target = "internalUser")
    @Mapping(target = "events", ignore = true)
    @Mapping(target = "removeEvents", ignore = true)
    AppUser toEntity(AppUserDTO appUserDTO);

    default AppUser fromId(Long id) {
        if (id == null) {
            return null;
        }
        AppUser appUser = new AppUser();
        appUser.setId(id);
        return appUser;
    }
}
