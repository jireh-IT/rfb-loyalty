package com.jireh.service.mapper;

import com.jireh.domain.Event;
import com.jireh.domain.EventAttendance;
import com.jireh.domain.RfbUser;
import com.jireh.service.dto.EventAttendanceDTO;
import com.jireh.service.dto.EventDTO;
import com.jireh.service.dto.RfbUserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link EventAttendance} and its DTO {@link EventAttendanceDTO}.
 */
@Mapper(componentModel = "spring")
public interface EventAttendanceMapper extends EntityMapper<EventAttendanceDTO, EventAttendance> {
    @Mapping(target = "event", source = "event", qualifiedByName = "eventId")
    @Mapping(target = "rfbUser", source = "rfbUser", qualifiedByName = "rfbUserId")
    EventAttendanceDTO toDto(EventAttendance s);

    @Named("eventId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EventDTO toDtoEventId(Event event);

    @Named("rfbUserId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    RfbUserDTO toDtoRfbUserId(RfbUser rfbUser);
}
