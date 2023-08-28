package com.jireh.service.mapper;

import com.jireh.domain.Location;
import com.jireh.domain.RfbUser;
import com.jireh.service.dto.LocationDTO;
import com.jireh.service.dto.RfbUserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link RfbUser} and its DTO {@link RfbUserDTO}.
 */
@Mapper(componentModel = "spring")
public interface RfbUserMapper extends EntityMapper<RfbUserDTO, RfbUser> {
    @Mapping(target = "homeLocation", source = "homeLocation", qualifiedByName = "locationId")
    RfbUserDTO toDto(RfbUser s);

    @Named("locationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    LocationDTO toDtoLocationId(Location location);
}
