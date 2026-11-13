package com.agritrack.service;

import com.agritrack.dto.HarvestRequest;
import com.agritrack.dto.HarvestResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing harvest operations, yield tracking, and inventory distribution.
 * Enforces ownership isolation (User -> Farm -> Field -> CropCycle -> Harvest)
 * and inventory invariants.
 */
@Service
public class HarvestService {

    private final HarvestRepository harvestRepository;
    private final CropCycleRepository cropCycleRepository;
    private final FieldRepository fieldRepository;
    private final FarmRepository farmRepository;
    private final SaleRepository saleRepository;
    private final UserRepository userRepository;

    public HarvestService(HarvestRepository harvestRepository,
                          CropCycleRepository cropCycleRepository,
                          FieldRepository fieldRepository,
                          FarmRepository farmRepository,
                          SaleRepository saleRepository,
                          UserRepository userRepository) {
        this.harvestRepository = harvestRepository;
        this.cropCycleRepository = cropCycleRepository;
        this.fieldRepository = fieldRepository;
        this.farmRepository = farmRepository;
        this.saleRepository = saleRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    @Transactional
    public HarvestResponse createHarvest(Long cropCycleId, HarvestRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        CropCycle cropCycle = cropCycleRepository.findByIdAndFieldFarmUserId(cropCycleId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Crop cycle not found with id: " + cropCycleId));

        validateHarvestRequest(request);

        BigDecimal expected = request.getExpectedYieldKg() != null ? request.getExpectedYieldKg() : BigDecimal.ZERO;
        BigDecimal harvested = request.getHarvestedQuantityKg();
        BigDecimal available = request.getAvailableQuantityKg() != null ? request.getAvailableQuantityKg() : harvested;
        BigDecimal sold = request.getSoldQuantityKg() != null ? request.getSoldQuantityKg() : BigDecimal.ZERO;

        validateInventoryInvariant(harvested, available, sold);

        Harvest harvest = new Harvest();
        harvest.setCropCycle(cropCycle);
        harvest.setHarvestDate(request.getHarvestDate());
        harvest.setExpectedYieldKg(expected);
        harvest.setHarvestedQuantityKg(harvested);
        harvest.setAvailableQuantityKg(available);
        harvest.setSoldQuantityKg(sold);
        harvest.setQualityGrade(request.getQualityGrade() != null ? request.getQualityGrade() : "A");
        harvest.setQualityScore(request.getQualityScore() != null ? request.getQualityScore() : 85);
        harvest.setMoisturePercent(request.getMoisturePercent());

        String status = determineStatus(request.getStatus(), harvested, available, sold);
        harvest.setStatus(status);
        harvest.setStorageLocation(request.getStorageLocation());
        harvest.setNotes(request.getNotes());

        Harvest saved = harvestRepository.save(harvest);
        return HarvestResponse.fromEntity(saved);
    }

    @Transactional
    public HarvestResponse updateHarvest(Long id, HarvestRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        Harvest harvest = harvestRepository.findByIdAndCropCycleFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Harvest not found with id: " + id));

        validateHarvestRequest(request);

        BigDecimal harvested = request.getHarvestedQuantityKg();

        // Check if sales exist for this harvest
        List<Sale> existingSales = saleRepository.findAllByHarvestIdAndHarvestCropCycleFieldFarmUserId(harvest.getId(), user.getId());
        BigDecimal totalSoldFromSales = existingSales.stream()
                .map(Sale::getQuantityKg)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal sold;
        BigDecimal available;

        if (!existingSales.isEmpty()) {
            if (request.getSoldQuantityKg() != null && request.getSoldQuantityKg().compareTo(totalSoldFromSales) != 0) {
                throw new IllegalArgumentException("Cannot overwrite sold quantity when recorded sales exist. " +
                        "Sold quantity must match recorded sales (" + totalSoldFromSales + " kg)");
            }
            sold = totalSoldFromSales;
            available = request.getAvailableQuantityKg() != null
                    ? request.getAvailableQuantityKg()
                    : harvested.subtract(sold);
            if (available.compareTo(BigDecimal.ZERO) < 0) {
                available = BigDecimal.ZERO;
            }
        } else {
            sold = request.getSoldQuantityKg() != null ? request.getSoldQuantityKg() : harvest.getSoldQuantityKg();
            available = request.getAvailableQuantityKg() != null ? request.getAvailableQuantityKg() : harvested.subtract(sold);
        }

        validateInventoryInvariant(harvested, available, sold);

        harvest.setHarvestDate(request.getHarvestDate());
        if (request.getExpectedYieldKg() != null) {
            harvest.setExpectedYieldKg(request.getExpectedYieldKg());
        }
        harvest.setHarvestedQuantityKg(harvested);
        harvest.setAvailableQuantityKg(available);
        harvest.setSoldQuantityKg(sold);

        if (request.getQualityGrade() != null) {
            harvest.setQualityGrade(request.getQualityGrade());
        }
        if (request.getQualityScore() != null) {
            harvest.setQualityScore(request.getQualityScore());
        }
        harvest.setMoisturePercent(request.getMoisturePercent());

        String status = determineStatus(request.getStatus(), harvested, available, sold);
        harvest.setStatus(status);
        harvest.setStorageLocation(request.getStorageLocation());
        harvest.setNotes(request.getNotes());

        Harvest updated = harvestRepository.save(harvest);
        return HarvestResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteHarvest(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);

        Harvest harvest = harvestRepository.findByIdAndCropCycleFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Harvest not found with id: " + id));

        // Safeguard historical financial sales records
        if (saleRepository.existsByHarvestId(harvest.getId())) {
            throw new IllegalArgumentException("Cannot delete harvest with existing sales records. " +
                    "Sales records must be handled first to protect financial audit history.");
        }

        harvestRepository.delete(harvest);
    }

    @Transactional(readOnly = true)
    public HarvestResponse getHarvestById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);

        Harvest harvest = harvestRepository.findByIdAndCropCycleFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Harvest not found with id: " + id));

        return HarvestResponse.fromEntity(harvest);
    }

    @Transactional(readOnly = true)
    public List<HarvestResponse> getAllHarvests(String userEmail) {
        User user = getUserByEmail(userEmail);
        return harvestRepository.findAllByCropCycleFieldFarmUserId(user.getId())
                .stream()
                .map(HarvestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HarvestResponse> getHarvestsByCropCycle(Long cropCycleId, String userEmail) {
        User user = getUserByEmail(userEmail);

        if (!cropCycleRepository.existsByIdAndFieldFarmUserId(cropCycleId, user.getId())) {
            throw new ResourceNotFoundException("Crop cycle not found with id: " + cropCycleId);
        }

        return harvestRepository.findAllByCropCycleIdAndCropCycleFieldFarmUserId(cropCycleId, user.getId())
                .stream()
                .map(HarvestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HarvestResponse> getHarvestsByField(Long fieldId, String userEmail) {
        User user = getUserByEmail(userEmail);

        if (!fieldRepository.existsByIdAndFarmUserId(fieldId, user.getId())) {
            throw new ResourceNotFoundException("Field not found with id: " + fieldId);
        }

        return harvestRepository.findAllByCropCycleFieldIdAndCropCycleFieldFarmUserId(fieldId, user.getId())
                .stream()
                .map(HarvestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HarvestResponse> getHarvestsByFarm(Long farmId, String userEmail) {
        User user = getUserByEmail(userEmail);

        if (!farmRepository.existsByIdAndUserId(farmId, user.getId())) {
            throw new ResourceNotFoundException("Farm not found with id: " + farmId);
        }

        return harvestRepository.findAllByCropCycleFieldFarmIdAndCropCycleFieldFarmUserId(farmId, user.getId())
                .stream()
                .map(HarvestResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private void validateHarvestRequest(HarvestRequest request) {
        if (request.getQualityScore() != null && (request.getQualityScore() < 0 || request.getQualityScore() > 100)) {
            throw new IllegalArgumentException("Quality score must be between 0 and 100");
        }
        if (request.getMoisturePercent() != null) {
            if (request.getMoisturePercent().compareTo(BigDecimal.ZERO) < 0 ||
                    request.getMoisturePercent().compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new IllegalArgumentException("Moisture percent must be between 0 and 100");
            }
        }
    }

    private void validateInventoryInvariant(BigDecimal harvested, BigDecimal available, BigDecimal sold) {
        if (harvested.compareTo(BigDecimal.ZERO) < 0 || available.compareTo(BigDecimal.ZERO) < 0 || sold.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Inventory quantities cannot be negative");
        }
        BigDecimal distributed = available.add(sold);
        if (harvested.compareTo(distributed) < 0) {
            throw new IllegalArgumentException("Inventory invariant violated: harvested quantity (" +
                    harvested + " kg) cannot be less than available (" + available + " kg) + sold (" + sold + " kg) quantities");
        }
    }

    private String determineStatus(String requestedStatus, BigDecimal harvested, BigDecimal available, BigDecimal sold) {
        if ("PLANNED".equalsIgnoreCase(requestedStatus) && harvested.compareTo(BigDecimal.ZERO) > 0) {
            throw new IllegalArgumentException("Harvest status cannot be PLANNED when harvested quantity is greater than zero");
        }
        if (available.compareTo(BigDecimal.ZERO) == 0 && sold.compareTo(BigDecimal.ZERO) > 0) {
            return "SOLD_OUT";
        } else if (sold.compareTo(BigDecimal.ZERO) > 0) {
            return "PARTIALLY_SOLD";
        } else if (harvested.compareTo(BigDecimal.ZERO) == 0 && sold.compareTo(BigDecimal.ZERO) == 0) {
            return "PLANNED";
        } else if (requestedStatus != null && !requestedStatus.isBlank()) {
            return requestedStatus;
        }
        return "HARVESTED";
    }
}
