package com.jireh.service.mapper;

import com.jireh.domain.Event;
import com.jireh.domain.Location;
import com.jireh.service.dto.EventDTO;
import com.jireh.service.dto.LocationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Event} and its DTO {@link EventDTO}.
 */
@Mapper(componentModel = "spring")
public interface EventMapper extends EntityMapper<EventDTO, Event> {
    @Mapping(target = "location", source = "location", qualifiedByName = "locationId")
    EventDTO toDto(Event s);

    @Named("locationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    LocationDTO toDtoLocationId(Location location);
}
