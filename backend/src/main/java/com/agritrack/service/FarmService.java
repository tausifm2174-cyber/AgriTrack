package com.agritrack.service;

import com.agritrack.dto.FarmRequest;
import com.agritrack.dto.FarmResponse;
import com.agritrack.entity.Farm;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.FarmRepository;
import com.agritrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing Farms with strict user ownership isolation.
 */
@Service
public class FarmService {

    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    public FarmService(FarmRepository farmRepository, UserRepository userRepository) {
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
    }

    @Transactional
    public FarmResponse createFarm(FarmRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Farm farm = new Farm(
                user,
                request.getFarmName().trim(),
                request.getLocation().trim(),
                request.getTotalArea(),
                request.getAreaUnit(),
                request.getDescription(),
                request.getStatus()
        );
        Farm saved = farmRepository.save(farm);
        return FarmResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<FarmResponse> getAllFarmsForUser(String userEmail) {
        User user = getUserByEmail(userEmail);
        return farmRepository.findAllByUserId(user.getId())
                .stream()
                .map(FarmResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FarmResponse getFarmById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Farm farm = farmRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + id));
        return FarmResponse.fromEntity(farm);
    }

    @Transactional
    public FarmResponse updateFarm(Long id, FarmRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Farm farm = farmRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + id));

        farm.setFarmName(request.getFarmName().trim());
        farm.setLocation(request.getLocation().trim());
        farm.setTotalArea(request.getTotalArea());
        if (request.getAreaUnit() != null) {
            farm.setAreaUnit(request.getAreaUnit());
        }
        farm.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            farm.setStatus(request.getStatus());
        }

        Farm updated = farmRepository.save(farm);
        return FarmResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteFarm(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Farm farm = farmRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + id));
        farmRepository.delete(farm);
    }
}

