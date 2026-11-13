package com.agritrack.service;

import com.agritrack.dto.AdvisoryResponse;
import com.agritrack.dto.AdvisoryStatusUpdateRequest;
import com.agritrack.entity.Advisory;
import com.agritrack.entity.Farm;
import com.agritrack.entity.User;
import com.agritrack.entity.WeatherForecast;
import com.agritrack.entity.WeatherSnapshot;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.AdvisoryRepository;
import com.agritrack.repository.FarmRepository;
import com.agritrack.repository.UserRepository;
import com.agritrack.repository.WeatherForecastRepository;
import com.agritrack.repository.WeatherSnapshotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdvisoryService {

    private final AdvisoryRepository advisoryRepository;
    private final FarmRepository farmRepository;
    private final UserRepository userRepository;
    private final WeatherSnapshotRepository weatherSnapshotRepository;
    private final WeatherForecastRepository weatherForecastRepository;
    private final AdvisoryRuleEngineService advisoryRuleEngineService;

    public AdvisoryService(
            AdvisoryRepository advisoryRepository,
            FarmRepository farmRepository,
            UserRepository userRepository,
            WeatherSnapshotRepository weatherSnapshotRepository,
            WeatherForecastRepository weatherForecastRepository,
            AdvisoryRuleEngineService advisoryRuleEngineService) {
        this.advisoryRepository = advisoryRepository;
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
        this.weatherSnapshotRepository = weatherSnapshotRepository;
        this.weatherForecastRepository = weatherForecastRepository;
        this.advisoryRuleEngineService = advisoryRuleEngineService;
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
    }

    @Transactional(readOnly = true)
    public List<AdvisoryResponse> getAdvisoriesForFarm(Long farmId, String status, String userEmail) {
        User user = getUserByEmail(userEmail);
        if (!farmRepository.existsByIdAndUserId(farmId, user.getId())) {
            throw new ResourceNotFoundException("Farm not found with id: " + farmId);
        }

        List<Advisory> list;
        if (status != null && !status.trim().isEmpty()) {
            list = advisoryRepository.findByFarmIdAndFarmUserIdAndStatusOrderByCreatedAtDesc(
                    farmId, user.getId(), status.trim().toUpperCase());
        } else {
            list = advisoryRepository.findByFarmIdAndFarmUserIdOrderByCreatedAtDesc(farmId, user.getId());
        }

        return list.stream().map(AdvisoryResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<AdvisoryResponse> getAllAdvisoriesForUser(String status, String userEmail) {
        User user = getUserByEmail(userEmail);

        List<Advisory> list;
        if (status != null && !status.trim().isEmpty()) {
            list = advisoryRepository.findByFarmUserIdAndStatusOrderByCreatedAtDesc(
                    user.getId(), status.trim().toUpperCase());
        } else {
            list = advisoryRepository.findByFarmUserIdOrderByCreatedAtDesc(user.getId());
        }

        return list.stream().map(AdvisoryResponse::fromEntity).toList();
    }

    @Transactional
    public AdvisoryResponse updateAdvisoryStatus(Long id, AdvisoryStatusUpdateRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Advisory advisory = advisoryRepository.findByIdAndFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Advisory not found with id: " + id));

        advisory.setStatus(request.getStatus().trim().toUpperCase());
        Advisory saved = advisoryRepository.save(advisory);
        return AdvisoryResponse.fromEntity(saved);
    }

    @Transactional
    public List<AdvisoryResponse> evaluateFarmAdvisories(Long farmId, String userEmail) {
        User user = getUserByEmail(userEmail);
        Farm farm = farmRepository.findByIdAndUserId(farmId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + farmId));

        WeatherSnapshot snapshot = weatherSnapshotRepository
                .findFirstByFarmIdAndFarmUserIdOrderByObservedAtDesc(farmId, user.getId())
                .orElse(null);

        List<WeatherForecast> forecasts = weatherForecastRepository
                .findByFarmIdAndFarmUserIdOrderByForecastDateAsc(farmId, user.getId());

        if (snapshot == null) {
            return List.of();
        }

        List<Advisory> generated = advisoryRuleEngineService.evaluateAndGenerateAdvisories(farm, snapshot, forecasts);
        return generated.stream().map(AdvisoryResponse::fromEntity).toList();
    }
}

