package com.jireh.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Location.
 */
@Entity
@Table(name = "location")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Location implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "location_name")
    private String locationName;

    @Column(name = "run_day_of_week")
    private Integer runDayOfWeek;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "location")
    @JsonIgnoreProperties(value = { "eventAttendances", "location" }, allowSetters = true)
    private Set<Event> events = new HashSet<>();

    @JsonIgnoreProperties(value = { "homeLocation", "eventAttendances" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "homeLocation")
    private RfbUser rfbUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Location id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocationName() {
        return this.locationName;
    }

    public Location locationName(String locationName) {
        this.setLocationName(locationName);
        return this;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Integer getRunDayOfWeek() {
        return this.runDayOfWeek;
    }

    public Location runDayOfWeek(Integer runDayOfWeek) {
        this.setRunDayOfWeek(runDayOfWeek);
        return this;
    }

    public void setRunDayOfWeek(Integer runDayOfWeek) {
        this.runDayOfWeek = runDayOfWeek;
    }

    public Set<Event> getEvents() {
        return this.events;
    }

    public void setEvents(Set<Event> events) {
        if (this.events != null) {
            this.events.forEach(i -> i.setLocation(null));
        }
        if (events != null) {
            events.forEach(i -> i.setLocation(this));
        }
        this.events = events;
    }

    public Location events(Set<Event> events) {
        this.setEvents(events);
        return this;
    }

    public Location addEvent(Event event) {
        this.events.add(event);
        event.setLocation(this);
        return this;
    }

    public Location removeEvent(Event event) {
        this.events.remove(event);
        event.setLocation(null);
        return this;
    }

    public RfbUser getRfbUser() {
        return this.rfbUser;
    }

    public void setRfbUser(RfbUser rfbUser) {
        if (this.rfbUser != null) {
            this.rfbUser.setHomeLocation(null);
        }
        if (rfbUser != null) {
            rfbUser.setHomeLocation(this);
        }
        this.rfbUser = rfbUser;
    }

    public Location rfbUser(RfbUser rfbUser) {
        this.setRfbUser(rfbUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Location)) {
            return false;
        }
        return id != null && id.equals(((Location) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Location{" +
            "id=" + getId() +
            ", locationName='" + getLocationName() + "'" +
            ", runDayOfWeek=" + getRunDayOfWeek() +
            "}";
    }
}
