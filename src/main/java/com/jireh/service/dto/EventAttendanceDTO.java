package com.jireh.service.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A DTO for the {@link com.jireh.domain.EventAttendance} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EventAttendanceDTO implements Serializable {

    private Long id;

    private LocalDate attendanceDate;

    private EventDTO event;

    private RfbUserDTO rfbUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public EventDTO getEvent() {
        return event;
    }

    public void setEvent(EventDTO event) {
        this.event = event;
    }

    public RfbUserDTO getRfbUser() {
        return rfbUser;
    }

    public void setRfbUser(RfbUserDTO rfbUser) {
        this.rfbUser = rfbUser;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventAttendanceDTO)) {
            return false;
        }

        EventAttendanceDTO eventAttendanceDTO = (EventAttendanceDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, eventAttendanceDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventAttendanceDTO{" +
            "id=" + getId() +
            ", attendanceDate='" + getAttendanceDate() + "'" +
            ", event=" + getEvent() +
            ", rfbUser=" + getRfbUser() +
            "}";
    }
}
