package com.jireh.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class EventAttendanceMapperTest {

    private EventAttendanceMapper eventAttendanceMapper;

    @BeforeEach
    public void setUp() {
        eventAttendanceMapper = new EventAttendanceMapperImpl();
    }
}
