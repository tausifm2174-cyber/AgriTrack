package com.agritrack.service;

import com.agritrack.dto.SoilRecordRequest;
import com.agritrack.dto.SoilRecordResponse;
import com.agritrack.entity.Field;
import com.agritrack.entity.SoilRecord;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.FieldRepository;
import com.agritrack.repository.SoilRecordRepository;
import com.agritrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Soil Records with ownership verification traversing Field -> Farm -> User.
 */
@Service
public class SoilRecordService {

    private final SoilRecordRepository soilRecordRepository;
    private final FieldRepository fieldRepository;
    private final UserRepository userRepository;

    public SoilRecordService(SoilRecordRepository soilRecordRepository, FieldRepository fieldRepository, UserRepository userRepository) {
        this.soilRecordRepository = soilRecordRepository;
        this.fieldRepository = fieldRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
    }

    @Transactional
    public SoilRecordResponse createSoilRecord(Long fieldId, SoilRecordRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Field field = fieldRepository.findByIdAndFarmUserId(fieldId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Field not found with id: " + fieldId));

        SoilRecord record = new SoilRecord(
                field,
                request.getSoilType(),
                request.getPh(),
                request.getNitrogen(),
                request.getPhosphorus(),
                request.getPotassium(),
                request.getOrganicMatter(),
                request.getMoisture(),
                request.getRecordedAt(),
                request.getNotes()
        );
        SoilRecord saved = soilRecordRepository.save(record);
        return SoilRecordResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<SoilRecordResponse> getSoilRecordsByField(Long fieldId, String userEmail) {
        User user = getUserByEmail(userEmail);
        if (!fieldRepository.existsByIdAndFarmUserId(fieldId, user.getId())) {
            throw new ResourceNotFoundException("Field not found with id: " + fieldId);
        }
        return soilRecordRepository.findAllByFieldIdAndFieldFarmUserId(fieldId, user.getId())
                .stream()
                .map(SoilRecordResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SoilRecordResponse getSoilRecordById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        SoilRecord record = soilRecordRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Soil record not found with id: " + id));
        return SoilRecordResponse.fromEntity(record);
    }

    @Transactional
    public SoilRecordResponse updateSoilRecord(Long id, SoilRecordRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        SoilRecord record = soilRecordRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Soil record not found with id: " + id));

        record.setSoilType(request.getSoilType());
        record.setPh(request.getPh());
        record.setNitrogen(request.getNitrogen());
        record.setPhosphorus(request.getPhosphorus());
        record.setPotassium(request.getPotassium());
        record.setOrganicMatter(request.getOrganicMatter());
        record.setMoisture(request.getMoisture());
        record.setRecordedAt(request.getRecordedAt());
        record.setNotes(request.getNotes());

        SoilRecord updated = soilRecordRepository.save(record);
        return SoilRecordResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteSoilRecord(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        SoilRecord record = soilRecordRepository.findByIdAndFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Soil record not found with id: " + id));
        soilRecordRepository.delete(record);
    }
}

