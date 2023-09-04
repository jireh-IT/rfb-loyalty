package com.jireh.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A RfbUser.
 */
@Entity
@Table(name = "rfb_user")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RfbUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "username", nullable = false)
    private String username;

    @JsonIgnoreProperties(value = { "events", "rfbUser" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Location homeLocation;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "rfbUser")
    @JsonIgnoreProperties(value = { "event", "rfbUser" }, allowSetters = true)
    private Set<EventAttendance> eventAttendances = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RfbUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public RfbUser username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Location getHomeLocation() {
        return this.homeLocation;
    }

    public void setHomeLocation(Location location) {
        this.homeLocation = location;
    }

    public RfbUser homeLocation(Location location) {
        this.setHomeLocation(location);
        return this;
    }

    public Set<EventAttendance> getEventAttendances() {
        return this.eventAttendances;
    }

    public void setEventAttendances(Set<EventAttendance> eventAttendances) {
        if (this.eventAttendances != null) {
            this.eventAttendances.forEach(i -> i.setRfbUser(null));
        }
        if (eventAttendances != null) {
            eventAttendances.forEach(i -> i.setRfbUser(this));
        }
        this.eventAttendances = eventAttendances;
    }

    public RfbUser eventAttendances(Set<EventAttendance> eventAttendances) {
        this.setEventAttendances(eventAttendances);
        return this;
    }

    public RfbUser addEventAttendance(EventAttendance eventAttendance) {
        this.eventAttendances.add(eventAttendance);
        eventAttendance.setRfbUser(this);
        return this;
    }

    public RfbUser removeEventAttendance(EventAttendance eventAttendance) {
        this.eventAttendances.remove(eventAttendance);
        eventAttendance.setRfbUser(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RfbUser)) {
            return false;
        }
        return id != null && id.equals(((RfbUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RfbUser{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            "}";
    }
}
