package com.agritrack.service;

import com.agritrack.dto.FieldRequest;
import com.agritrack.dto.FieldResponse;
import com.agritrack.entity.Farm;
import com.agritrack.entity.Field;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.FarmRepository;
import com.agritrack.repository.FieldRepository;
import com.agritrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Fields with ownership verification against the authenticated User.
 */
@Service
public class FieldService {

    private final FieldRepository fieldRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    public FieldService(FieldRepository fieldRepository, FarmRepository farmRepository, UserRepository userRepository) {
        this.fieldRepository = fieldRepository;
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
    }

    @Transactional
    public FieldResponse createField(Long farmId, FieldRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Farm farm = farmRepository.findByIdAndUserId(farmId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + farmId));

        Field field = new Field(
                farm,
                request.getFieldName().trim(),
                request.getArea(),
                request.getAreaUnit(),
                request.getSoilType(),
                request.getIrrigationType(),
                request.getStatus(),
                request.getDescription()
        );
        Field saved = fieldRepository.save(field);
        return FieldResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<FieldResponse> getFieldsByFarm(Long farmId, String userEmail) {
        User user = getUserByEmail(userEmail);
        // Verify farm ownership first
        if (!farmRepository.existsByIdAndUserId(farmId, user.getId())) {
            throw new ResourceNotFoundException("Farm not found with id: " + farmId);
        }
        return fieldRepository.findAllByFarmIdAndFarmUserId(farmId, user.getId())
                .stream()
                .map(FieldResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FieldResponse getFieldById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Field field = fieldRepository.findByIdAndFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + id));
        return FieldResponse.fromEntity(field);
    }

    @Transactional
    public FieldResponse updateField(Long id, FieldRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Field field = fieldRepository.findByIdAndFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + id));

        field.setFieldName(request.getFieldName().trim());
        field.setArea(request.getArea());
        if (request.getAreaUnit() != null) {
            field.setAreaUnit(request.getAreaUnit());
        }
        field.setSoilType(request.getSoilType());
        field.setIrrigationType(request.getIrrigationType());
        if (request.getStatus() != null) {
            field.setStatus(request.getStatus());
        }
        field.setDescription(request.getDescription());

        Field updated = fieldRepository.save(field);
        return FieldResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteField(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Field field = fieldRepository.findByIdAndFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + id));
        fieldRepository.delete(field);
    }
}

