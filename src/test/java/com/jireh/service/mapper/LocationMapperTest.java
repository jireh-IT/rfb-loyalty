package com.jireh.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class LocationMapperTest {

    private LocationMapper locationMapper;

    @BeforeEach
    public void setUp() {
        locationMapper = new LocationMapperImpl();
    }
}
