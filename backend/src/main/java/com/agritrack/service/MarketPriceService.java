package com.agritrack.service;

import com.agritrack.dto.MarketPriceRequest;
import com.agritrack.dto.MarketPriceResponse;
import com.agritrack.entity.MarketPrice;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.MarketPriceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing APMC commodity market benchmark prices.
 * Accessible for reading by all authenticated farmers;
 * administrative modifications are restricted to ADMIN users.
 */
@Service
public class MarketPriceService {

    private final MarketPriceRepository marketPriceRepository;

    public MarketPriceService(MarketPriceRepository marketPriceRepository) {
        this.marketPriceRepository = marketPriceRepository;
    }

    @Transactional(readOnly = true)
    public List<MarketPriceResponse> getMarketPrices(String crop,
                                                     String market,
                                                     String trend,
                                                     LocalDate date,
                                                     LocalDate dateFrom,
                                                     LocalDate dateTo) {
        String cleanCrop = (crop != null && !crop.isBlank()) ? crop.trim() : null;
        String cleanMarket = (market != null && !market.isBlank()) ? market.trim() : null;
        String cleanTrend = (trend != null && !trend.isBlank()) ? trend.trim() : null;

        List<MarketPrice> results;
        if (cleanCrop == null && cleanMarket == null && cleanTrend == null && date == null && dateFrom == null && dateTo == null) {
            results = marketPriceRepository.findAllByOrderByPriceDateDescCropNameAsc();
        } else {
            results = marketPriceRepository.findWithFilters(cleanCrop, cleanMarket, cleanTrend, date, dateFrom, dateTo);
        }

        return results.stream()
                .map(MarketPriceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MarketPriceResponse getMarketPriceById(Long id) {
        MarketPrice entity = marketPriceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Market price record not found with id: " + id));

        return MarketPriceResponse.fromEntity(entity);
    }

    @Transactional
    public MarketPriceResponse createMarketPrice(MarketPriceRequest request) {
        validateMarketPriceRequest(request);

        MarketPrice price = new MarketPrice();
        populateEntityFromRequest(price, request);

        MarketPrice saved = marketPriceRepository.save(price);
        return MarketPriceResponse.fromEntity(saved);
    }

    @Transactional
    public MarketPriceResponse updateMarketPrice(Long id, MarketPriceRequest request) {
        MarketPrice price = marketPriceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Market price record not found with id: " + id));

        validateMarketPriceRequest(request);
        populateEntityFromRequest(price, request);

        MarketPrice updated = marketPriceRepository.save(price);
        return MarketPriceResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteMarketPrice(Long id) {
        MarketPrice price = marketPriceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Market price record not found with id: " + id));

        marketPriceRepository.delete(price);
    }

    private void validateMarketPriceRequest(MarketPriceRequest request) {
        if (request.getPricePerQuintal() == null || request.getPricePerQuintal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price per quintal must be greater than zero");
        }

        if (request.getPricePerKg() != null && request.getPricePerKg().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Price per kg must be greater than zero");
        }

        if (request.getMinPrice() != null && request.getMaxPrice() != null) {
            if (request.getMaxPrice().compareTo(request.getMinPrice()) < 0) {
                throw new IllegalArgumentException("Maximum price (" + request.getMaxPrice() +
                        ") cannot be less than minimum price (" + request.getMinPrice() + ")");
            }
        }

        if (request.getArrivalVolumeQuintals() != null && request.getArrivalVolumeQuintals().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Arrival volume must be non-negative");
        }
    }

    private void populateEntityFromRequest(MarketPrice entity, MarketPriceRequest request) {
        entity.setCropName(request.getCropName().trim());
        entity.setVariety(request.getVariety().trim());
        entity.setMarketName(request.getMarketName().trim());
        entity.setLocation(request.getLocation().trim());

        BigDecimal perQuintal = request.getPricePerQuintal().setScale(2, RoundingMode.HALF_UP);
        entity.setPricePerQuintal(perQuintal);

        // Derive or validate price per kg (pricePerQuintal / 100)
        BigDecimal calculatedPerKg = perQuintal.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        if (request.getPricePerKg() != null) {
            entity.setPricePerKg(request.getPricePerKg().setScale(2, RoundingMode.HALF_UP));
        } else {
            entity.setPricePerKg(calculatedPerKg);
        }

        entity.setPreviousPrice(request.getPreviousPrice());

        // Derive priceChange, changePercent, and trend when previousPrice is supplied
        if (request.getPreviousPrice() != null && request.getPreviousPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = perQuintal.subtract(request.getPreviousPrice()).setScale(2, RoundingMode.HALF_UP);
            entity.setPriceChange(diff);

            BigDecimal pct = diff.divide(request.getPreviousPrice(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
            entity.setChangePercent(pct);

            if (request.getTrend() != null && !request.getTrend().isBlank()) {
                entity.setTrend(request.getTrend());
            } else {
                if (diff.compareTo(BigDecimal.ZERO) > 0) {
                    entity.setTrend("RISING");
                } else if (diff.compareTo(BigDecimal.ZERO) < 0) {
                    entity.setTrend("FALLING");
                } else {
                    entity.setTrend("STABLE");
                }
            }
        } else {
            entity.setPriceChange(request.getPriceChange() != null ? request.getPriceChange() : BigDecimal.ZERO);
            entity.setChangePercent(request.getChangePercent() != null ? request.getChangePercent() : BigDecimal.ZERO);
            entity.setTrend(request.getTrend() != null ? request.getTrend() : "STABLE");
        }

        entity.setQualityGrade(request.getQualityGrade() != null ? request.getQualityGrade() : "A");
        entity.setPriceDate(request.getPriceDate());
        entity.setSource(request.getSource() != null ? request.getSource() : "APMC Mandi");
        entity.setArrivalVolumeQuintals(request.getArrivalVolumeQuintals());
        entity.setMinPrice(request.getMinPrice());
        entity.setMaxPrice(request.getMaxPrice());
    }
}
