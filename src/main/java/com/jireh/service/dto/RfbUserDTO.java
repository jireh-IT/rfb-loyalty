package com.jireh.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.jireh.domain.RfbUser} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RfbUserDTO implements Serializable {

    private Long id;

    @NotNull
    private String username;

    private LocationDTO homeLocation;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocationDTO getHomeLocation() {
        return homeLocation;
    }

    public void setHomeLocation(LocationDTO homeLocation) {
        this.homeLocation = homeLocation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RfbUserDTO)) {
            return false;
        }

        RfbUserDTO rfbUserDTO = (RfbUserDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, rfbUserDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RfbUserDTO{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            ", homeLocation=" + getHomeLocation() +
            "}";
    }
}
