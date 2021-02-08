package hu.redriver.service.mapper;


import hu.redriver.domain.*;
import hu.redriver.service.dto.ActivityTypeDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link ActivityType} and its DTO {@link ActivityTypeDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface ActivityTypeMapper extends EntityMapper<ActivityTypeDTO, ActivityType> {



    default ActivityType fromId(Long id) {
        if (id == null) {
            return null;
        }
        ActivityType activityType = new ActivityType();
        activityType.setId(id);
        return activityType;
    }
}
