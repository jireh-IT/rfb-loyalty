package com.jireh.service;

import com.jireh.service.dto.RfbUserDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.jireh.domain.RfbUser}.
 */
public interface RfbUserService {
    /**
     * Save a rfbUser.
     *
     * @param rfbUserDTO the entity to save.
     * @return the persisted entity.
     */
    RfbUserDTO save(RfbUserDTO rfbUserDTO);

    /**
     * Updates a rfbUser.
     *
     * @param rfbUserDTO the entity to update.
     * @return the persisted entity.
     */
    RfbUserDTO update(RfbUserDTO rfbUserDTO);

    /**
     * Partially updates a rfbUser.
     *
     * @param rfbUserDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<RfbUserDTO> partialUpdate(RfbUserDTO rfbUserDTO);

    /**
     * Get all the rfbUsers.
     *
     * @return the list of entities.
     */
    List<RfbUserDTO> findAll();

    /**
     * Get all the RfbUserDTO where EventAttendance is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<RfbUserDTO> findAllWhereEventAttendanceIsNull();

    /**
     * Get the "id" rfbUser.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<RfbUserDTO> findOne(Long id);

    /**
     * Delete the "id" rfbUser.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
