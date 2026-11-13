package com.agritrack.service;

import com.agritrack.dto.IrrigationRequest;
import com.agritrack.dto.IrrigationResponse;
import com.agritrack.entity.CropCycle;
import com.agritrack.entity.Field;
import com.agritrack.entity.IrrigationSchedule;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.CropCycleRepository;
import com.agritrack.repository.FieldRepository;
import com.agritrack.repository.IrrigationScheduleRepository;
import com.agritrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Irrigation Schedules with strict ownership verification
 * navigating through Field -> Farm -> User and validating optional CropCycle associations.
 */
@Service
public class IrrigationService {

    private final IrrigationScheduleRepository irrigationRepository;
    private final FieldRepository fieldRepository;
    private final CropCycleRepository cropCycleRepository;
    private final UserRepository userRepository;

    public IrrigationService(IrrigationScheduleRepository irrigationRepository,
                             FieldRepository fieldRepository,
                             CropCycleRepository cropCycleRepository,
                             UserRepository userRepository) {
        this.irrigationRepository = irrigationRepository;
        this.fieldRepository = fieldRepository;
        this.cropCycleRepository = cropCycleRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
    }

    private CropCycle validateAndResolveCropCycle(Long cropCycleId, Long fieldId, Long userId) {
        if (cropCycleId == null) {
            return null;
        }
        CropCycle cropCycle = cropCycleRepository.findByIdAndFieldFarmUserId(cropCycleId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop cycle not found with id: " + cropCycleId));

        if (!cropCycle.getField().getId().equals(fieldId)) {
            throw new IllegalArgumentException("Crop cycle with id " + cropCycleId + " does not belong to field " + fieldId);
        }
        return cropCycle;
    }

    @Transactional
    public IrrigationResponse createIrrigation(Long fieldId, IrrigationRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Field field = fieldRepository.findByIdAndFarmUserId(fieldId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + fieldId));

        CropCycle cropCycle = validateAndResolveCropCycle(request.getCropCycleId(), fieldId, user.getId());

        IrrigationSchedule schedule = new IrrigationSchedule(
                field,
                cropCycle,
                request.getTitle().trim(),
                request.getIrrigationMethod(),
                request.getStatus(),
                request.getPriority(),
                request.getScheduledDate(),
                request.getScheduledTime(),
                request.getDurationMinutes(),
                request.getWaterVolumeLitres(),
                request.getSoilMoisture(),
                request.getWeatherCondition(),
                request.getRainfallExpected(),
                request.getCompletedAt(),
                request.getNotes()
        );

        IrrigationSchedule saved = irrigationRepository.save(schedule);
        return IrrigationResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<IrrigationResponse> getIrrigationsByField(Long fieldId, String userEmail) {
        User user = getUserByEmail(userEmail);
        if (!fieldRepository.existsByIdAndFarmUserId(fieldId, user.getId())) {
            throw new ResourceNotFoundException("Field not found with id: " + fieldId);
        }
        return irrigationRepository.findAllByFieldIdAndFieldFarmUserId(fieldId, user.getId())
                .stream()
                .map(IrrigationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IrrigationResponse> getAllIrrigationsForUser(String userEmail) {
        User user = getUserByEmail(userEmail);
        return irrigationRepository.findAllByFieldFarmUserId(user.getId())
                .stream()
                .map(IrrigationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IrrigationResponse getIrrigationById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        IrrigationSchedule schedule = irrigationRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Irrigation schedule not found with id: " + id));
        return IrrigationResponse.fromEntity(schedule);
    }

    @Transactional
    public IrrigationResponse updateIrrigation(Long id, IrrigationRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        IrrigationSchedule schedule = irrigationRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Irrigation schedule not found with id: " + id));

        CropCycle cropCycle = validateAndResolveCropCycle(request.getCropCycleId(), schedule.getField().getId(), user.getId());

        schedule.setTitle(request.getTitle().trim());
        if (request.getIrrigationMethod() != null && !request.getIrrigationMethod().isBlank()) {
            schedule.setIrrigationMethod(request.getIrrigationMethod());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            schedule.setStatus(request.getStatus());
        }
        if (request.getPriority() != null && !request.getPriority().isBlank()) {
            schedule.setPriority(request.getPriority());
        }
        schedule.setScheduledDate(request.getScheduledDate());
        schedule.setScheduledTime(request.getScheduledTime());
        schedule.setDurationMinutes(request.getDurationMinutes());
        schedule.setWaterVolumeLitres(request.getWaterVolumeLitres());
        schedule.setSoilMoisture(request.getSoilMoisture());
        schedule.setWeatherCondition(request.getWeatherCondition());
        schedule.setRainfallExpected(request.getRainfallExpected());
        schedule.setCompletedAt(request.getCompletedAt());
        schedule.setNotes(request.getNotes());
        schedule.setCropCycle(cropCycle);

        IrrigationSchedule updated = irrigationRepository.save(schedule);
        return IrrigationResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteIrrigation(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        IrrigationSchedule schedule = irrigationRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Irrigation schedule not found with id: " + id));
        irrigationRepository.delete(schedule);
    }
}

