package com.agritrack.service;

import com.agritrack.dto.MarketPriceHistoryResponse;
import com.agritrack.dto.MarketPriceRequest;
import com.agritrack.dto.MarketPriceResponse;
import com.agritrack.entity.MarketPrice;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.MarketPriceRepository;
import com.agritrack.service.mandi.MandiApiClient;
import com.agritrack.service.mandi.MandiMarketDto;
import com.agritrack.service.mandi.MandiPriceDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service managing APMC commodity market benchmark prices.
 * Accessible for reading by all authenticated farmers via the live Mandi provider;
 * administrative modifications are restricted to ADMIN users.
 */
@Service
public class MarketPriceService {

    private static final Logger log = LoggerFactory.getLogger(MarketPriceService.class);

    private final MarketPriceRepository marketPriceRepository;
    private final MandiApiClient mandiApiClient;

    public MarketPriceService(MarketPriceRepository marketPriceRepository, MandiApiClient mandiApiClient) {
        this.marketPriceRepository = marketPriceRepository;
        this.mandiApiClient = mandiApiClient;
    }

    /**
     * Retrieves available APMC markets for a specific state from the live Mandi provider.
     *
     * @param state State name (e.g. Karnataka)
     * @return List of markets and their districts
     */
    @Transactional(readOnly = true)
    public List<MandiMarketDto> getMarkets(String state) {
        if (state == null || state.isBlank()) {
            throw new IllegalArgumentException("State is required");
        }
        return mandiApiClient.getMarkets(state.trim());
    }

    /**
     * Overloaded getter for backward compatibility with database-backed calls and tests.
     */
    @Transactional(readOnly = true)
    public List<MarketPriceResponse> getMarketPrices(String crop,
                                                     String market,
                                                     String trend,
                                                     LocalDate date,
                                                     LocalDate dateFrom,
                                                     LocalDate dateTo) {
        return getMarketPrices(null, null, crop, market, trend, date, dateFrom, dateTo);
    }

    /**
     * Retrieves APMC commodity market benchmark prices.
     * When state is provided, queries the authoritative live Mandi provider with exact APMC isolation.
     * When state is null/blank, falls back to the database-backed repository for ADMIN/legacy queries.
     */
    @Transactional(readOnly = true)
    public List<MarketPriceResponse> getMarketPrices(String state,
                                                     String district,
                                                     String crop,
                                                     String market,
                                                     String trend,
                                                     LocalDate date,
                                                     LocalDate dateFrom,
                                                     LocalDate dateTo) {
        String cleanState = (state != null && !state.isBlank()) ? state.trim() : null;
        String cleanCrop = (crop != null && !crop.isBlank()) ? crop.trim() : null;
        String cleanMarket = (market != null && !market.isBlank()) ? market.trim() : null;
        String cleanTrend = (trend != null && !trend.isBlank()) ? trend.trim() : null;

        // Authoritative live Mandi provider path when state is supplied
        if (cleanState != null) {
            // When district is provided without a market, or crop is missing, return empty list (no fabricated market selection)
            if (cleanMarket == null || cleanCrop == null) {
                return Collections.emptyList();
            }

            List<MandiPriceDto> providerPrices = mandiApiClient.getPrices(cleanState, cleanCrop, cleanMarket, date);
            if (providerPrices == null || providerPrices.isEmpty()) {
                return Collections.emptyList();
            }

            // Mandatory defensive APMC isolation: strictly isolate records matching requested market
            List<MandiPriceDto> isolated = providerPrices.stream()
                    .filter(dto -> dto.getMarket() != null && dto.getMarket().trim().equalsIgnoreCase(cleanMarket))
                    .toList();

            if (isolated.isEmpty()) {
                return Collections.emptyList();
            }

            return isolated.stream()
                    .map(dto -> mapToLiveResponse(dto, cleanState, cleanMarket))
                    .collect(Collectors.toList());
        }

        // Database-backed CRUD fallback when state is not supplied
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

    /**
     * Retrieves historical price series for an APMC commodity from the live Mandi provider.
     */
    @Transactional(readOnly = true)
    public List<MarketPriceHistoryResponse> getPriceHistory(String state,
                                                            String crop,
                                                            String market,
                                                            LocalDate from,
                                                            LocalDate to) {
        if (state == null || state.isBlank()) {
            throw new IllegalArgumentException("State is required");
        }
        if (crop == null || crop.isBlank()) {
            throw new IllegalArgumentException("Crop is required");
        }
        if (market == null || market.isBlank()) {
            throw new IllegalArgumentException("Market is required");
        }
        if (from == null) {
            throw new IllegalArgumentException("From date is required");
        }
        if (to == null) {
            throw new IllegalArgumentException("To date is required");
        }
        if (from.isAfter(to)) {
            throw new IllegalArgumentException("From date (" + from + ") cannot be after to date (" + to + ")");
        }

        String cleanState = state.trim();
        String cleanCrop = crop.trim();
        String cleanMarket = market.trim();

        List<MandiPriceDto> dtos = mandiApiClient.getPriceHistory(cleanState, cleanCrop, cleanMarket, from, to);
        if (dtos == null || dtos.isEmpty()) {
            return Collections.emptyList();
        }

        // Defensive APMC isolation and chronologically sorted output
        return dtos.stream()
                .filter(dto -> dto.getMarket() != null && dto.getMarket().trim().equalsIgnoreCase(cleanMarket))
                .filter(dto -> dto.getArrivalDate() != null)
                .map(dto -> new MarketPriceHistoryResponse(
                        dto.getArrivalDate(),
                        dto.getModalPrice() != null ? dto.getModalPrice().setScale(2, RoundingMode.HALF_UP) : null,
                        dto.getMinPrice() != null ? dto.getMinPrice().setScale(2, RoundingMode.HALF_UP) : null,
                        dto.getMaxPrice() != null ? dto.getMaxPrice().setScale(2, RoundingMode.HALF_UP) : null
                ))
                .sorted(Comparator.comparing(MarketPriceHistoryResponse::getDate))
                .collect(Collectors.toList());
    }

    private MarketPriceResponse mapToLiveResponse(MandiPriceDto dto, String cleanState, String cleanMarket) {
        MarketPriceResponse response = new MarketPriceResponse();
        response.setId(dto.getId());
        response.setCropName(dto.getCommodity());
        response.setVariety(dto.getVariety());
        response.setMarketName(dto.getMarket());

        String district = (dto.getDistrict() != null && !dto.getDistrict().isBlank()) ? dto.getDistrict().trim() : null;
        if (district != null) {
            response.setLocation(district + ", " + cleanState);
        } else {
            response.setLocation(cleanState);
        }

        BigDecimal modalPrice = dto.getModalPrice() != null ? dto.getModalPrice().setScale(2, RoundingMode.HALF_UP) : null;
        response.setPricePerQuintal(modalPrice);

        if (modalPrice != null) {
            response.setPricePerKg(modalPrice.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        } else {
            response.setPricePerKg(null);
        }

        response.setMinPrice(dto.getMinPrice() != null ? dto.getMinPrice().setScale(2, RoundingMode.HALF_UP) : null);
        response.setMaxPrice(dto.getMaxPrice() != null ? dto.getMaxPrice().setScale(2, RoundingMode.HALF_UP) : null);
        response.setQualityGrade(dto.getGrade());
        response.setPriceDate(dto.getArrivalDate());
        response.setSource("Ministry of Agriculture (data.gov.in / Agmarknet)");
        response.setArrivalVolumeQuintals(null);

        if (dto.getFetchedAt() != null) {
            response.setCreatedAt(dto.getFetchedAt().toLocalDateTime());
            response.setUpdatedAt(dto.getFetchedAt().toLocalDateTime());
        }

        // Calculate previous trading-day benchmark price and trend
        populatePreviousPriceAndTrend(response, dto, cleanState, cleanMarket, modalPrice);

        return response;
    }

    private void populatePreviousPriceAndTrend(MarketPriceResponse response,
                                               MandiPriceDto dto,
                                               String cleanState,
                                               String cleanMarket,
                                               BigDecimal currentPrice) {
        if (currentPrice == null || dto.getArrivalDate() == null || dto.getCommodity() == null) {
            response.setPreviousPrice(null);
            response.setPriceChange(null);
            response.setChangePercent(null);
            response.setTrend("STABLE");
            return;
        }

        LocalDate arrivalDate = dto.getArrivalDate();
        LocalDate from = arrivalDate.minusDays(14);
        LocalDate to = arrivalDate.minusDays(1);

        try {
            List<MandiPriceDto> history = mandiApiClient.getPriceHistory(cleanState, dto.getCommodity(), cleanMarket, from, to);
            if (history != null && !history.isEmpty()) {
                Optional<MandiPriceDto> prevOpt = history.stream()
                        .filter(h -> h.getMarket() != null && h.getMarket().trim().equalsIgnoreCase(cleanMarket))
                        .filter(h -> h.getArrivalDate() != null && h.getArrivalDate().isBefore(arrivalDate))
                        .filter(h -> h.getModalPrice() != null && h.getModalPrice().compareTo(BigDecimal.ZERO) > 0)
                        .max(Comparator.comparing(MandiPriceDto::getArrivalDate));

                if (prevOpt.isPresent()) {
                    BigDecimal prev = prevOpt.get().getModalPrice().setScale(2, RoundingMode.HALF_UP);
                    response.setPreviousPrice(prev);

                    BigDecimal diff = currentPrice.subtract(prev).setScale(2, RoundingMode.HALF_UP);
                    response.setPriceChange(diff);

                    if (prev.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal pct = diff.divide(prev, 4, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(100))
                                .setScale(2, RoundingMode.HALF_UP);
                        response.setChangePercent(pct);
                    } else {
                        response.setChangePercent(null);
                    }

                    if (diff.compareTo(BigDecimal.ZERO) > 0) {
                        response.setTrend("RISING");
                    } else if (diff.compareTo(BigDecimal.ZERO) < 0) {
                        response.setTrend("FALLING");
                    } else {
                        response.setTrend("STABLE");
                    }
                    return;
                }
            }
        } catch (Exception e) {
            log.debug("Previous price lookup skipped/failed for {} at {}: {}", dto.getCommodity(), cleanMarket, e.getMessage());
        }

        response.setPreviousPrice(null);
        response.setPriceChange(null);
        response.setChangePercent(null);
        response.setTrend("STABLE");
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
