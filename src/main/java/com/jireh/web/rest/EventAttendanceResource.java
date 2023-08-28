package com.jireh.web.rest;

import com.jireh.repository.EventAttendanceRepository;
import com.jireh.service.EventAttendanceService;
import com.jireh.service.dto.EventAttendanceDTO;
import com.jireh.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.jireh.domain.EventAttendance}.
 */
@RestController
@RequestMapping("/api")
public class EventAttendanceResource {

    private final Logger log = LoggerFactory.getLogger(EventAttendanceResource.class);

    private static final String ENTITY_NAME = "eventAttendance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventAttendanceService eventAttendanceService;

    private final EventAttendanceRepository eventAttendanceRepository;

    public EventAttendanceResource(EventAttendanceService eventAttendanceService, EventAttendanceRepository eventAttendanceRepository) {
        this.eventAttendanceService = eventAttendanceService;
        this.eventAttendanceRepository = eventAttendanceRepository;
    }

    /**
     * {@code POST  /event-attendances} : Create a new eventAttendance.
     *
     * @param eventAttendanceDTO the eventAttendanceDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventAttendanceDTO, or with status {@code 400 (Bad Request)} if the eventAttendance has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-attendances")
    public ResponseEntity<EventAttendanceDTO> createEventAttendance(@RequestBody EventAttendanceDTO eventAttendanceDTO)
        throws URISyntaxException {
        log.debug("REST request to save EventAttendance : {}", eventAttendanceDTO);
        if (eventAttendanceDTO.getId() != null) {
            throw new BadRequestAlertException("A new eventAttendance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventAttendanceDTO result = eventAttendanceService.save(eventAttendanceDTO);
        return ResponseEntity
            .created(new URI("/api/event-attendances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-attendances/:id} : Updates an existing eventAttendance.
     *
     * @param id the id of the eventAttendanceDTO to save.
     * @param eventAttendanceDTO the eventAttendanceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventAttendanceDTO,
     * or with status {@code 400 (Bad Request)} if the eventAttendanceDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventAttendanceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-attendances/{id}")
    public ResponseEntity<EventAttendanceDTO> updateEventAttendance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventAttendanceDTO eventAttendanceDTO
    ) throws URISyntaxException {
        log.debug("REST request to update EventAttendance : {}, {}", id, eventAttendanceDTO);
        if (eventAttendanceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventAttendanceDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventAttendanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventAttendanceDTO result = eventAttendanceService.update(eventAttendanceDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventAttendanceDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-attendances/:id} : Partial updates given fields of an existing eventAttendance, field will ignore if it is null
     *
     * @param id the id of the eventAttendanceDTO to save.
     * @param eventAttendanceDTO the eventAttendanceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventAttendanceDTO,
     * or with status {@code 400 (Bad Request)} if the eventAttendanceDTO is not valid,
     * or with status {@code 404 (Not Found)} if the eventAttendanceDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventAttendanceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-attendances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventAttendanceDTO> partialUpdateEventAttendance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventAttendanceDTO eventAttendanceDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventAttendance partially : {}, {}", id, eventAttendanceDTO);
        if (eventAttendanceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventAttendanceDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventAttendanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventAttendanceDTO> result = eventAttendanceService.partialUpdate(eventAttendanceDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventAttendanceDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /event-attendances} : get all the eventAttendances.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventAttendances in body.
     */
    @GetMapping("/event-attendances")
    public ResponseEntity<List<EventAttendanceDTO>> getAllEventAttendances(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of EventAttendances");
        Page<EventAttendanceDTO> page = eventAttendanceService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-attendances/:id} : get the "id" eventAttendance.
     *
     * @param id the id of the eventAttendanceDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventAttendanceDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-attendances/{id}")
    public ResponseEntity<EventAttendanceDTO> getEventAttendance(@PathVariable Long id) {
        log.debug("REST request to get EventAttendance : {}", id);
        Optional<EventAttendanceDTO> eventAttendanceDTO = eventAttendanceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventAttendanceDTO);
    }

    /**
     * {@code DELETE  /event-attendances/:id} : delete the "id" eventAttendance.
     *
     * @param id the id of the eventAttendanceDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-attendances/{id}")
    public ResponseEntity<Void> deleteEventAttendance(@PathVariable Long id) {
        log.debug("REST request to delete EventAttendance : {}", id);
        eventAttendanceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
