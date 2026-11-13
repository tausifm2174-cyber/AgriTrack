package com.agritrack.service;

import com.agritrack.dto.CropCycleRequest;
import com.agritrack.dto.CropCycleResponse;
import com.agritrack.entity.CropCycle;
import com.agritrack.entity.Field;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.CropCycleRepository;
import com.agritrack.repository.FieldRepository;
import com.agritrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Crop Cycles with strict user ownership verification
 * navigating through CropCycle -> Field -> Farm -> User.
 */
@Service
public class CropCycleService {

    private final CropCycleRepository cropCycleRepository;
    private final FieldRepository fieldRepository;
    private final UserRepository userRepository;

    public CropCycleService(CropCycleRepository cropCycleRepository,
                            FieldRepository fieldRepository,
                            UserRepository userRepository) {
        this.cropCycleRepository = cropCycleRepository;
        this.fieldRepository = fieldRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
    }

    private void validateDates(CropCycleRequest request) {
        if (request.getExpectedHarvestDate() != null && request.getSowingDate() != null) {
            if (request.getExpectedHarvestDate().isBefore(request.getSowingDate())) {
                throw new IllegalArgumentException("Expected harvest date cannot be before sowing date");
            }
        }
        if (request.getActualHarvestDate() != null && request.getSowingDate() != null) {
            if (request.getActualHarvestDate().isBefore(request.getSowingDate())) {
                throw new IllegalArgumentException("Actual harvest date cannot be before sowing date");
            }
        }
    }

    @Transactional
    public CropCycleResponse createCropCycle(Long fieldId, CropCycleRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Field field = fieldRepository.findByIdAndFarmUserId(fieldId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + fieldId));

        validateDates(request);

        CropCycle cropCycle = new CropCycle(
                field,
                request.getCropName().trim(),
                request.getVariety().trim(),
                request.getSeason().trim(),
                request.getSowingDate(),
                request.getExpectedHarvestDate(),
                request.getActualHarvestDate(),
                request.getCurrentStage(),
                request.getCurrentStageStep(),
                request.getProgressPercent(),
                request.getStatus(),
                request.getNotes()
        );

        CropCycle saved = cropCycleRepository.save(cropCycle);
        return CropCycleResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<CropCycleResponse> getCropCyclesByField(Long fieldId, String userEmail) {
        User user = getUserByEmail(userEmail);
        if (!fieldRepository.existsByIdAndFarmUserId(fieldId, user.getId())) {
            throw new ResourceNotFoundException("Field not found with id: " + fieldId);
        }
        return cropCycleRepository.findAllByFieldIdAndFieldFarmUserId(fieldId, user.getId())
                .stream()
                .map(CropCycleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CropCycleResponse> getAllCropCyclesForUser(String userEmail) {
        User user = getUserByEmail(userEmail);
        return cropCycleRepository.findAllByFieldFarmUserId(user.getId())
                .stream()
                .map(CropCycleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CropCycleResponse getCropCycleById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        CropCycle cycle = cropCycleRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Crop cycle not found with id: " + id));
        return CropCycleResponse.fromEntity(cycle);
    }

    @Transactional
    public CropCycleResponse updateCropCycle(Long id, CropCycleRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        CropCycle cycle = cropCycleRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Crop cycle not found with id: " + id));

        validateDates(request);

        cycle.setCropName(request.getCropName().trim());
        cycle.setVariety(request.getVariety().trim());
        cycle.setSeason(request.getSeason().trim());
        cycle.setSowingDate(request.getSowingDate());
        cycle.setExpectedHarvestDate(request.getExpectedHarvestDate());
        cycle.setActualHarvestDate(request.getActualHarvestDate());
        if (request.getCurrentStage() != null && !request.getCurrentStage().isBlank()) {
            cycle.setCurrentStage(request.getCurrentStage());
        }
        if (request.getCurrentStageStep() != null) {
            cycle.setCurrentStageStep(request.getCurrentStageStep());
        }
        if (request.getProgressPercent() != null) {
            cycle.setProgressPercent(request.getProgressPercent());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            cycle.setStatus(request.getStatus());
        }
        cycle.setNotes(request.getNotes());

        CropCycle updated = cropCycleRepository.save(cycle);
        return CropCycleResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteCropCycle(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        CropCycle cycle = cropCycleRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Crop cycle not found with id: " + id));
        cropCycleRepository.delete(cycle);
    }
}

