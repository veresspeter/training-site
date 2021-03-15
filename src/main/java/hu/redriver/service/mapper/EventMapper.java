package hu.redriver.service.mapper;


import hu.redriver.domain.*;
import hu.redriver.service.dto.EventDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link Event} and its DTO {@link EventDTO}.
 */
@Mapper(componentModel = "spring", uses = {AppUserMapper.class, ActivityMapper.class})
public interface EventMapper extends EntityMapper<EventDTO, Event> {

    @Mapping(source = "organizer", target = "organizer")
    @Mapping(source = "activity.id", target = "activityId")
    EventDTO toDto(Event event);

    @Mapping(source = "organizer", target = "organizer")
    @Mapping(source = "activityId", target = "activity")
    @Mapping(target = "removeParticipants", ignore = true)
    Event toEntity(EventDTO eventDTO);

    default Event fromId(Long id) {
        if (id == null) {
            return null;
        }
        Event event = new Event();
        event.setId(id);
        return event;
    }
}
