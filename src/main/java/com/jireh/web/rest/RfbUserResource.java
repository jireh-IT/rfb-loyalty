package com.jireh.web.rest;

import com.jireh.repository.RfbUserRepository;
import com.jireh.service.RfbUserService;
import com.jireh.service.dto.RfbUserDTO;
import com.jireh.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.jireh.domain.RfbUser}.
 */
@RestController
@RequestMapping("/api")
public class RfbUserResource {

    private final Logger log = LoggerFactory.getLogger(RfbUserResource.class);

    private static final String ENTITY_NAME = "rfbUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RfbUserService rfbUserService;

    private final RfbUserRepository rfbUserRepository;

    public RfbUserResource(RfbUserService rfbUserService, RfbUserRepository rfbUserRepository) {
        this.rfbUserService = rfbUserService;
        this.rfbUserRepository = rfbUserRepository;
    }

    /**
     * {@code POST  /rfb-users} : Create a new rfbUser.
     *
     * @param rfbUserDTO the rfbUserDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rfbUserDTO, or with status {@code 400 (Bad Request)} if the rfbUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rfb-users")
    public ResponseEntity<RfbUserDTO> createRfbUser(@Valid @RequestBody RfbUserDTO rfbUserDTO) throws URISyntaxException {
        log.debug("REST request to save RfbUser : {}", rfbUserDTO);
        if (rfbUserDTO.getId() != null) {
            throw new BadRequestAlertException("A new rfbUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RfbUserDTO result = rfbUserService.save(rfbUserDTO);
        return ResponseEntity
            .created(new URI("/api/rfb-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rfb-users/:id} : Updates an existing rfbUser.
     *
     * @param id the id of the rfbUserDTO to save.
     * @param rfbUserDTO the rfbUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rfbUserDTO,
     * or with status {@code 400 (Bad Request)} if the rfbUserDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rfbUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rfb-users/{id}")
    public ResponseEntity<RfbUserDTO> updateRfbUser(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RfbUserDTO rfbUserDTO
    ) throws URISyntaxException {
        log.debug("REST request to update RfbUser : {}, {}", id, rfbUserDTO);
        if (rfbUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rfbUserDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rfbUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RfbUserDTO result = rfbUserService.update(rfbUserDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, rfbUserDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rfb-users/:id} : Partial updates given fields of an existing rfbUser, field will ignore if it is null
     *
     * @param id the id of the rfbUserDTO to save.
     * @param rfbUserDTO the rfbUserDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rfbUserDTO,
     * or with status {@code 400 (Bad Request)} if the rfbUserDTO is not valid,
     * or with status {@code 404 (Not Found)} if the rfbUserDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the rfbUserDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rfb-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RfbUserDTO> partialUpdateRfbUser(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RfbUserDTO rfbUserDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update RfbUser partially : {}, {}", id, rfbUserDTO);
        if (rfbUserDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rfbUserDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rfbUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RfbUserDTO> result = rfbUserService.partialUpdate(rfbUserDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, rfbUserDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /rfb-users} : get all the rfbUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rfbUsers in body.
     */
    @GetMapping("/rfb-users")
    public List<RfbUserDTO> getAllRfbUsers() {
        log.debug("REST request to get all RfbUsers");
        return rfbUserService.findAll();
    }

    /**
     * {@code GET  /rfb-users/:id} : get the "id" rfbUser.
     *
     * @param id the id of the rfbUserDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rfbUserDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rfb-users/{id}")
    public ResponseEntity<RfbUserDTO> getRfbUser(@PathVariable Long id) {
        log.debug("REST request to get RfbUser : {}", id);
        Optional<RfbUserDTO> rfbUserDTO = rfbUserService.findOne(id);
        return ResponseUtil.wrapOrNotFound(rfbUserDTO);
    }

    /**
     * {@code DELETE  /rfb-users/:id} : delete the "id" rfbUser.
     *
     * @param id the id of the rfbUserDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rfb-users/{id}")
    public ResponseEntity<Void> deleteRfbUser(@PathVariable Long id) {
        log.debug("REST request to delete RfbUser : {}", id);
        rfbUserService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
