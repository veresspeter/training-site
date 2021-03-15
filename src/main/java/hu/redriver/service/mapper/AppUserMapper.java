package hu.redriver.service.mapper;


import hu.redriver.domain.*;
import hu.redriver.service.dto.AppUserDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link AppUser} and its DTO {@link AppUserDTO}.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface AppUserMapper extends EntityMapper<AppUserDTO, AppUser> {

    @Mapping(source = "internalUser.id", target = "internalUserId")
    @Mapping(expression = "java(getFullName(appUser.getInternalUser()))", target = "fullName")
    AppUserDTO toDto(AppUser appUser);

    @Mapping(source = "internalUserId", target = "internalUser")
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

    default String getFullName(User user) {
        if ( user.getLastName() != null && user.getFirstName() != null) {
            return user.getLastName() + " " + user.getFirstName();
        } else {
            return null;
        }
    }
}
