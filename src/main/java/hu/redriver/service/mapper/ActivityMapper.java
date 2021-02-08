package hu.redriver.service.mapper;


import hu.redriver.domain.*;
import hu.redriver.service.dto.ActivityDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Activity} and its DTO {@link ActivityDTO}.
 */
@Mapper(componentModel = "spring", uses = {ActivityTypeMapper.class})
public interface ActivityMapper extends EntityMapper<ActivityDTO, Activity> {

    @Mapping(source = "activityType.id", target = "activityTypeId")
    ActivityDTO toDto(Activity activity);

    @Mapping(source = "activityTypeId", target = "activityType")
    Activity toEntity(ActivityDTO activityDTO);

    default Activity fromId(Long id) {
        if (id == null) {
            return null;
        }
        Activity activity = new Activity();
        activity.setId(id);
        return activity;
    }
}
