package com.jireh.service;

import com.jireh.service.dto.EventAttendanceDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.jireh.domain.EventAttendance}.
 */
public interface EventAttendanceService {
    /**
     * Save a eventAttendance.
     *
     * @param eventAttendanceDTO the entity to save.
     * @return the persisted entity.
     */
    EventAttendanceDTO save(EventAttendanceDTO eventAttendanceDTO);

    /**
     * Updates a eventAttendance.
     *
     * @param eventAttendanceDTO the entity to update.
     * @return the persisted entity.
     */
    EventAttendanceDTO update(EventAttendanceDTO eventAttendanceDTO);

    /**
     * Partially updates a eventAttendance.
     *
     * @param eventAttendanceDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EventAttendanceDTO> partialUpdate(EventAttendanceDTO eventAttendanceDTO);

    /**
     * Get all the eventAttendances.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EventAttendanceDTO> findAll(Pageable pageable);

    /**
     * Get the "id" eventAttendance.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EventAttendanceDTO> findOne(Long id);

    /**
     * Delete the "id" eventAttendance.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
