package com.agritrack.service;

import com.agritrack.dto.ActivityRequest;
import com.agritrack.dto.ActivityResponse;
import com.agritrack.entity.Activity;
import com.agritrack.entity.CropCycle;
import com.agritrack.entity.Field;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.ActivityRepository;
import com.agritrack.repository.CropCycleRepository;
import com.agritrack.repository.FieldRepository;
import com.agritrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Activities with strict ownership verification
 * navigating through Field -> Farm -> User and validating optional CropCycle associations.
 */
@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final FieldRepository fieldRepository;
    private final CropCycleRepository cropCycleRepository;
    private final UserRepository userRepository;

    public ActivityService(ActivityRepository activityRepository,
                           FieldRepository fieldRepository,
                           CropCycleRepository cropCycleRepository,
                           UserRepository userRepository) {
        this.activityRepository = activityRepository;
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
    public ActivityResponse createActivity(Long fieldId, ActivityRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Field field = fieldRepository.findByIdAndFarmUserId(fieldId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + fieldId));

        CropCycle cropCycle = validateAndResolveCropCycle(request.getCropCycleId(), fieldId, user.getId());

        Activity activity = new Activity(
                field,
                cropCycle,
                request.getActivityType().trim(),
                request.getTitle().trim(),
                request.getStatus(),
                request.getPriority(),
                request.getActivityDate(),
                request.getActivityTime(),
                request.getDurationHours(),
                request.getOperator(),
                request.getQuantity(),
                request.getQuantityUnit(),
                request.getDescription(),
                request.getNotes()
        );

        Activity saved = activityRepository.save(activity);
        return ActivityResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getActivitiesByField(Long fieldId, String userEmail) {
        User user = getUserByEmail(userEmail);
        if (!fieldRepository.existsByIdAndFarmUserId(fieldId, user.getId())) {
            throw new ResourceNotFoundException("Field not found with id: " + fieldId);
        }
        return activityRepository.findAllByFieldIdAndFieldFarmUserId(fieldId, user.getId())
                .stream()
                .map(ActivityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getAllActivitiesForUser(String userEmail) {
        User user = getUserByEmail(userEmail);
        return activityRepository.findAllByFieldFarmUserId(user.getId())
                .stream()
                .map(ActivityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ActivityResponse getActivityById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Activity activity = activityRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
        return ActivityResponse.fromEntity(activity);
    }

    @Transactional
    public ActivityResponse updateActivity(Long id, ActivityRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Activity activity = activityRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));

        CropCycle cropCycle = validateAndResolveCropCycle(request.getCropCycleId(), activity.getField().getId(), user.getId());

        activity.setTitle(request.getTitle().trim());
        activity.setActivityType(request.getActivityType().trim());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            activity.setStatus(request.getStatus());
        }
        if (request.getPriority() != null && !request.getPriority().isBlank()) {
            activity.setPriority(request.getPriority());
        }
        activity.setActivityDate(request.getActivityDate());
        activity.setActivityTime(request.getActivityTime());
        activity.setDurationHours(request.getDurationHours());
        activity.setOperator(request.getOperator());
        activity.setQuantity(request.getQuantity());
        activity.setQuantityUnit(request.getQuantityUnit());
        activity.setDescription(request.getDescription());
        activity.setNotes(request.getNotes());
        activity.setCropCycle(cropCycle);

        Activity updated = activityRepository.save(activity);
        return ActivityResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteActivity(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Activity activity = activityRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
        activityRepository.delete(activity);
    }
}

