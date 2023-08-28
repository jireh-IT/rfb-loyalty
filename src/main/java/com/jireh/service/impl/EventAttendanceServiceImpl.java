package com.jireh.service.impl;

import com.jireh.domain.EventAttendance;
import com.jireh.repository.EventAttendanceRepository;
import com.jireh.service.EventAttendanceService;
import com.jireh.service.dto.EventAttendanceDTO;
import com.jireh.service.mapper.EventAttendanceMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EventAttendance}.
 */
@Service
@Transactional
public class EventAttendanceServiceImpl implements EventAttendanceService {

    private final Logger log = LoggerFactory.getLogger(EventAttendanceServiceImpl.class);

    private final EventAttendanceRepository eventAttendanceRepository;

    private final EventAttendanceMapper eventAttendanceMapper;

    public EventAttendanceServiceImpl(EventAttendanceRepository eventAttendanceRepository, EventAttendanceMapper eventAttendanceMapper) {
        this.eventAttendanceRepository = eventAttendanceRepository;
        this.eventAttendanceMapper = eventAttendanceMapper;
    }

    @Override
    public EventAttendanceDTO save(EventAttendanceDTO eventAttendanceDTO) {
        log.debug("Request to save EventAttendance : {}", eventAttendanceDTO);
        EventAttendance eventAttendance = eventAttendanceMapper.toEntity(eventAttendanceDTO);
        eventAttendance = eventAttendanceRepository.save(eventAttendance);
        return eventAttendanceMapper.toDto(eventAttendance);
    }

    @Override
    public EventAttendanceDTO update(EventAttendanceDTO eventAttendanceDTO) {
        log.debug("Request to update EventAttendance : {}", eventAttendanceDTO);
        EventAttendance eventAttendance = eventAttendanceMapper.toEntity(eventAttendanceDTO);
        eventAttendance = eventAttendanceRepository.save(eventAttendance);
        return eventAttendanceMapper.toDto(eventAttendance);
    }

    @Override
    public Optional<EventAttendanceDTO> partialUpdate(EventAttendanceDTO eventAttendanceDTO) {
        log.debug("Request to partially update EventAttendance : {}", eventAttendanceDTO);

        return eventAttendanceRepository
            .findById(eventAttendanceDTO.getId())
            .map(existingEventAttendance -> {
                eventAttendanceMapper.partialUpdate(existingEventAttendance, eventAttendanceDTO);

                return existingEventAttendance;
            })
            .map(eventAttendanceRepository::save)
            .map(eventAttendanceMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventAttendanceDTO> findAll(Pageable pageable) {
        log.debug("Request to get all EventAttendances");
        return eventAttendanceRepository.findAll(pageable).map(eventAttendanceMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EventAttendanceDTO> findOne(Long id) {
        log.debug("Request to get EventAttendance : {}", id);
        return eventAttendanceRepository.findById(id).map(eventAttendanceMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EventAttendance : {}", id);
        eventAttendanceRepository.deleteById(id);
    }
}
