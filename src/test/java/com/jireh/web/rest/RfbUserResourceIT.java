package com.jireh.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.jireh.IntegrationTest;
import com.jireh.domain.RfbUser;
import com.jireh.repository.RfbUserRepository;
import com.jireh.service.dto.RfbUserDTO;
import com.jireh.service.mapper.RfbUserMapper;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RfbUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RfbUserResourceIT {

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/rfb-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RfbUserRepository rfbUserRepository;

    @Autowired
    private RfbUserMapper rfbUserMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRfbUserMockMvc;

    private RfbUser rfbUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RfbUser createEntity(EntityManager em) {
        RfbUser rfbUser = new RfbUser().username(DEFAULT_USERNAME);
        return rfbUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RfbUser createUpdatedEntity(EntityManager em) {
        RfbUser rfbUser = new RfbUser().username(UPDATED_USERNAME);
        return rfbUser;
    }

    @BeforeEach
    public void initTest() {
        rfbUser = createEntity(em);
    }

    @Test
    @Transactional
    void createRfbUser() throws Exception {
        int databaseSizeBeforeCreate = rfbUserRepository.findAll().size();
        // Create the RfbUser
        RfbUserDTO rfbUserDTO = rfbUserMapper.toDto(rfbUser);
        restRfbUserMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rfbUserDTO))
            )
            .andExpect(status().isCreated());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeCreate + 1);
        RfbUser testRfbUser = rfbUserList.get(rfbUserList.size() - 1);
        assertThat(testRfbUser.getUsername()).isEqualTo(DEFAULT_USERNAME);
    }

    @Test
    @Transactional
    void createRfbUserWithExistingId() throws Exception {
        // Create the RfbUser with an existing ID
        rfbUser.setId(1L);
        RfbUserDTO rfbUserDTO = rfbUserMapper.toDto(rfbUser);

        int databaseSizeBeforeCreate = rfbUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRfbUserMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rfbUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUsernameIsRequired() throws Exception {
        int databaseSizeBeforeTest = rfbUserRepository.findAll().size();
        // set the field null
        rfbUser.setUsername(null);

        // Create the RfbUser, which fails.
        RfbUserDTO rfbUserDTO = rfbUserMapper.toDto(rfbUser);

        restRfbUserMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rfbUserDTO))
            )
            .andExpect(status().isBadRequest());

        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRfbUsers() throws Exception {
        // Initialize the database
        rfbUserRepository.saveAndFlush(rfbUser);

        // Get all the rfbUserList
        restRfbUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rfbUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)));
    }

    @Test
    @Transactional
    void getRfbUser() throws Exception {
        // Initialize the database
        rfbUserRepository.saveAndFlush(rfbUser);

        // Get the rfbUser
        restRfbUserMockMvc
            .perform(get(ENTITY_API_URL_ID, rfbUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rfbUser.getId().intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME));
    }

    @Test
    @Transactional
    void getNonExistingRfbUser() throws Exception {
        // Get the rfbUser
        restRfbUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRfbUser() throws Exception {
        // Initialize the database
        rfbUserRepository.saveAndFlush(rfbUser);

        int databaseSizeBeforeUpdate = rfbUserRepository.findAll().size();

        // Update the rfbUser
        RfbUser updatedRfbUser = rfbUserRepository.findById(rfbUser.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRfbUser are not directly saved in db
        em.detach(updatedRfbUser);
        updatedRfbUser.username(UPDATED_USERNAME);
        RfbUserDTO rfbUserDTO = rfbUserMapper.toDto(updatedRfbUser);

        restRfbUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rfbUserDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rfbUserDTO))
            )
            .andExpect(status().isOk());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeUpdate);
        RfbUser testRfbUser = rfbUserList.get(rfbUserList.size() - 1);
        assertThat(testRfbUser.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    void putNonExistingRfbUser() throws Exception {
        int databaseSizeBeforeUpdate = rfbUserRepository.findAll().size();
        rfbUser.setId(count.incrementAndGet());

        // Create the RfbUser
        RfbUserDTO rfbUserDTO = rfbUserMapper.toDto(rfbUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRfbUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rfbUserDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rfbUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRfbUser() throws Exception {
        int databaseSizeBeforeUpdate = rfbUserRepository.findAll().size();
        rfbUser.setId(count.incrementAndGet());

        // Create the RfbUser
        RfbUserDTO rfbUserDTO = rfbUserMapper.toDto(rfbUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRfbUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rfbUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRfbUser() throws Exception {
        int databaseSizeBeforeUpdate = rfbUserRepository.findAll().size();
        rfbUser.setId(count.incrementAndGet());

        // Create the RfbUser
        RfbUserDTO rfbUserDTO = rfbUserMapper.toDto(rfbUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRfbUserMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rfbUserDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRfbUserWithPatch() throws Exception {
        // Initialize the database
        rfbUserRepository.saveAndFlush(rfbUser);

        int databaseSizeBeforeUpdate = rfbUserRepository.findAll().size();

        // Update the rfbUser using partial update
        RfbUser partialUpdatedRfbUser = new RfbUser();
        partialUpdatedRfbUser.setId(rfbUser.getId());

        partialUpdatedRfbUser.username(UPDATED_USERNAME);

        restRfbUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRfbUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRfbUser))
            )
            .andExpect(status().isOk());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeUpdate);
        RfbUser testRfbUser = rfbUserList.get(rfbUserList.size() - 1);
        assertThat(testRfbUser.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    void fullUpdateRfbUserWithPatch() throws Exception {
        // Initialize the database
        rfbUserRepository.saveAndFlush(rfbUser);

        int databaseSizeBeforeUpdate = rfbUserRepository.findAll().size();

        // Update the rfbUser using partial update
        RfbUser partialUpdatedRfbUser = new RfbUser();
        partialUpdatedRfbUser.setId(rfbUser.getId());

        partialUpdatedRfbUser.username(UPDATED_USERNAME);

        restRfbUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRfbUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRfbUser))
            )
            .andExpect(status().isOk());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeUpdate);
        RfbUser testRfbUser = rfbUserList.get(rfbUserList.size() - 1);
        assertThat(testRfbUser.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    void patchNonExistingRfbUser() throws Exception {
        int databaseSizeBeforeUpdate = rfbUserRepository.findAll().size();
        rfbUser.setId(count.incrementAndGet());

        // Create the RfbUser
        RfbUserDTO rfbUserDTO = rfbUserMapper.toDto(rfbUser);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRfbUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rfbUserDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rfbUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRfbUser() throws Exception {
        int databaseSizeBeforeUpdate = rfbUserRepository.findAll().size();
        rfbUser.setId(count.incrementAndGet());

        // Create the RfbUser
        RfbUserDTO rfbUserDTO = rfbUserMapper.toDto(rfbUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRfbUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rfbUserDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRfbUser() throws Exception {
        int databaseSizeBeforeUpdate = rfbUserRepository.findAll().size();
        rfbUser.setId(count.incrementAndGet());

        // Create the RfbUser
        RfbUserDTO rfbUserDTO = rfbUserMapper.toDto(rfbUser);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRfbUserMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rfbUserDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RfbUser in the database
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRfbUser() throws Exception {
        // Initialize the database
        rfbUserRepository.saveAndFlush(rfbUser);

        int databaseSizeBeforeDelete = rfbUserRepository.findAll().size();

        // Delete the rfbUser
        restRfbUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, rfbUser.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RfbUser> rfbUserList = rfbUserRepository.findAll();
        assertThat(rfbUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
