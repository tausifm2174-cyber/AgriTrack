package com.agritrack.service;

import com.agritrack.dto.SaleRequest;
import com.agritrack.dto.SaleResponse;
import com.agritrack.entity.Harvest;
import com.agritrack.entity.Sale;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.HarvestRepository;
import com.agritrack.repository.SaleRepository;
import com.agritrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing commercial sales orders and inventory reconciliation.
 * Enforces ownership isolation (User -> Farm -> Field -> CropCycle -> Harvest -> Sale),
 * transactional inventory adjustments with pessimistic row locking, and authoritative financial calculations.
 */
@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final HarvestRepository harvestRepository;
    private final UserRepository userRepository;

    public SaleService(SaleRepository saleRepository,
                       HarvestRepository harvestRepository,
                       UserRepository userRepository) {
        this.saleRepository = saleRepository;
        this.harvestRepository = harvestRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    @Transactional
    public SaleResponse createSale(Long harvestId, SaleRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        // Lock harvest row to guarantee concurrency-safe inventory reconciliation
        Harvest harvest = harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(harvestId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Harvest not found with id: " + harvestId));

        validateSaleRequest(request);

        BigDecimal quantity = request.getQuantityKg();
        if (harvest.getAvailableQuantityKg().compareTo(quantity) < 0) {
            throw new IllegalArgumentException("Insufficient available stock. Available: " +
                    harvest.getAvailableQuantityKg() + " kg, requested: " + quantity + " kg");
        }

        // Authoritative financial calculations
        BigDecimal pricePerKg = request.getPricePerKg();
        BigDecimal pricePerQuintal = pricePerKg.multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = quantity.multiply(pricePerKg).setScale(2, RoundingMode.HALF_UP);
        BigDecimal paidAmount = request.getPaidAmount() != null ? request.getPaidAmount() : totalAmount;

        if (paidAmount.compareTo(totalAmount) > 0) {
            throw new IllegalArgumentException("Paid amount (" + paidAmount + ") cannot exceed total amount (" + totalAmount + ")");
        }

        // Transactional inventory reconciliation
        harvest.setAvailableQuantityKg(harvest.getAvailableQuantityKg().subtract(quantity));
        harvest.setSoldQuantityKg(harvest.getSoldQuantityKg().add(quantity));
        harvest.setStatus(determineHarvestStatus(harvest.getAvailableQuantityKg(), harvest.getSoldQuantityKg()));
        harvestRepository.save(harvest);

        BigDecimal balanceDue = totalAmount.subtract(paidAmount).setScale(2, RoundingMode.HALF_UP);
        String paymentStatus = derivePaymentStatus(paidAmount, totalAmount);

        Sale sale = new Sale();
        sale.setHarvest(harvest);
        sale.setBuyerName(request.getBuyerName().trim());
        sale.setSaleDate(request.getSaleDate());
        sale.setQuantityKg(quantity);
        sale.setPricePerKg(pricePerKg);
        sale.setPricePerQuintal(pricePerQuintal);
        sale.setTotalAmount(totalAmount);
        sale.setMarket(request.getMarket());
        sale.setStatus(request.getStatus() != null ? request.getStatus() : "COMPLETED");
        sale.setPaymentStatus(paymentStatus);
        sale.setPaidAmount(paidAmount);
        sale.setBalanceDue(balanceDue);
        sale.setPaymentMethod(request.getPaymentMethod());
        sale.setInvoiceNumber(request.getInvoiceNumber());
        sale.setReferenceMarketPricePerQ(request.getReferenceMarketPricePerQ());
        sale.setNotes(request.getNotes());

        Sale saved = saleRepository.save(sale);
        return SaleResponse.fromEntity(saved);
    }

    @Transactional
    public SaleResponse updateSale(Long id, SaleRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        Sale sale = saleRepository.findByIdAndHarvestCropCycleFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));

        Harvest harvest = harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(sale.getHarvest().getId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Associated harvest not found with id: " + sale.getHarvest().getId()));

        validateSaleRequest(request);

        BigDecimal oldQuantity = sale.getQuantityKg();
        BigDecimal newQuantity = request.getQuantityKg();
        BigDecimal delta = newQuantity.subtract(oldQuantity);

        if (delta.compareTo(BigDecimal.ZERO) > 0) {
            // Additional quantity required
            if (harvest.getAvailableQuantityKg().compareTo(delta) < 0) {
                throw new IllegalArgumentException("Insufficient available stock for quantity increase. Available: " +
                        harvest.getAvailableQuantityKg() + " kg, additional requested: " + delta + " kg");
            }
            harvest.setAvailableQuantityKg(harvest.getAvailableQuantityKg().subtract(delta));
            harvest.setSoldQuantityKg(harvest.getSoldQuantityKg().add(delta));
        } else if (delta.compareTo(BigDecimal.ZERO) < 0) {
            // Surplus quantity returned to available stock
            BigDecimal returnAmount = delta.abs();
            harvest.setAvailableQuantityKg(harvest.getAvailableQuantityKg().add(returnAmount));
            harvest.setSoldQuantityKg(harvest.getSoldQuantityKg().subtract(returnAmount));
        }

        harvest.setStatus(determineHarvestStatus(harvest.getAvailableQuantityKg(), harvest.getSoldQuantityKg()));
        harvestRepository.save(harvest);

        // Recalculate authoritative financials
        BigDecimal pricePerKg = request.getPricePerKg();
        BigDecimal pricePerQuintal = pricePerKg.multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = newQuantity.multiply(pricePerKg).setScale(2, RoundingMode.HALF_UP);
        BigDecimal paidAmount = request.getPaidAmount() != null ? request.getPaidAmount() : sale.getPaidAmount();

        if (paidAmount.compareTo(totalAmount) > 0) {
            throw new IllegalArgumentException("Paid amount (" + paidAmount + ") cannot exceed total amount (" + totalAmount + ")");
        }

        BigDecimal balanceDue = totalAmount.subtract(paidAmount).setScale(2, RoundingMode.HALF_UP);
        String paymentStatus = derivePaymentStatus(paidAmount, totalAmount);

        sale.setBuyerName(request.getBuyerName().trim());
        sale.setSaleDate(request.getSaleDate());
        sale.setQuantityKg(newQuantity);
        sale.setPricePerKg(pricePerKg);
        sale.setPricePerQuintal(pricePerQuintal);
        sale.setTotalAmount(totalAmount);
        sale.setMarket(request.getMarket());
        if (request.getStatus() != null) {
            sale.setStatus(request.getStatus());
        }
        sale.setPaymentStatus(paymentStatus);
        sale.setPaidAmount(paidAmount);
        sale.setBalanceDue(balanceDue);
        sale.setPaymentMethod(request.getPaymentMethod());
        sale.setInvoiceNumber(request.getInvoiceNumber());
        sale.setReferenceMarketPricePerQ(request.getReferenceMarketPricePerQ());
        sale.setNotes(request.getNotes());

        Sale updated = saleRepository.save(sale);
        return SaleResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteSale(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);

        Sale sale = saleRepository.findByIdAndHarvestCropCycleFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));

        Harvest harvest = harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(sale.getHarvest().getId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Associated harvest not found with id: " + sale.getHarvest().getId()));

        // Refund inventory back to harvest
        harvest.setAvailableQuantityKg(harvest.getAvailableQuantityKg().add(sale.getQuantityKg()));
        harvest.setSoldQuantityKg(harvest.getSoldQuantityKg().subtract(sale.getQuantityKg()));
        harvest.setStatus(determineHarvestStatus(harvest.getAvailableQuantityKg(), harvest.getSoldQuantityKg()));
        harvestRepository.save(harvest);

        saleRepository.delete(sale);
    }

    @Transactional(readOnly = true)
    public SaleResponse getSaleById(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);

        Sale sale = saleRepository.findByIdAndHarvestCropCycleFieldFarmUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));

        return SaleResponse.fromEntity(sale);
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> getAllSales(String userEmail) {
        User user = getUserByEmail(userEmail);
        return saleRepository.findAllByHarvestCropCycleFieldFarmUserId(user.getId())
                .stream()
                .map(SaleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> getSalesByHarvest(Long harvestId, String userEmail) {
        User user = getUserByEmail(userEmail);

        if (!harvestRepository.existsByIdAndCropCycleFieldFarmUserId(harvestId, user.getId())) {
            throw new ResourceNotFoundException("Harvest not found with id: " + harvestId);
        }

        return saleRepository.findAllByHarvestIdAndHarvestCropCycleFieldFarmUserId(harvestId, user.getId())
                .stream()
                .map(SaleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private void validateSaleRequest(SaleRequest request) {
        if (request.getQuantityKg() == null || request.getQuantityKg().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Sale quantity must be greater than zero");
        }
        if (request.getPricePerKg() == null || request.getPricePerKg().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price per kg must be greater than zero");
        }
        if (request.getPaidAmount() != null && request.getPaidAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Paid amount cannot be negative");
        }
    }

    private String derivePaymentStatus(BigDecimal paidAmount, BigDecimal totalAmount) {
        if (paidAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return "PENDING";
        } else if (paidAmount.compareTo(totalAmount) == 0) {
            return "PAID";
        } else {
            return "PARTIAL";
        }
    }

    private String determineHarvestStatus(BigDecimal available, BigDecimal sold) {
        if (available.compareTo(BigDecimal.ZERO) == 0 && sold.compareTo(BigDecimal.ZERO) > 0) {
            return "SOLD_OUT";
        } else if (sold.compareTo(BigDecimal.ZERO) > 0) {
            return "PARTIALLY_SOLD";
        }
        return "HARVESTED";
    }
}
