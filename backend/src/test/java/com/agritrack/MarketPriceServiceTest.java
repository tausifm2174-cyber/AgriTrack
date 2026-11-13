package com.agritrack;

import com.agritrack.dto.MarketPriceRequest;
import com.agritrack.dto.MarketPriceResponse;
import com.agritrack.entity.MarketPrice;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.MarketPriceRepository;
import com.agritrack.service.MarketPriceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("MarketPriceService Unit Tests")
class MarketPriceServiceTest {

    @Mock
    private MarketPriceRepository marketPriceRepository;

    @InjectMocks
    private MarketPriceService marketPriceService;

    private MarketPrice testPrice;

    @BeforeEach
    void setUp() {
        testPrice = new MarketPrice();
        testPrice.setId(1L);
        testPrice.setCropName("Wheat");
        testPrice.setVariety("Sharbati");
        testPrice.setMarketName("APMC Nashik");
        testPrice.setLocation("Nashik, Maharashtra");
        testPrice.setPricePerQuintal(new BigDecimal("2450.00"));
        testPrice.setPricePerKg(new BigDecimal("24.50"));
        testPrice.setPreviousPrice(new BigDecimal("2400.00"));
        testPrice.setPriceChange(new BigDecimal("50.00"));
        testPrice.setChangePercent(new BigDecimal("2.08"));
        testPrice.setTrend("RISING");
        testPrice.setQualityGrade("A");
        testPrice.setPriceDate(LocalDate.of(2026, 10, 2));
        testPrice.setSource("APMC Mandi Daily Bulletin (Sample)");
        testPrice.setArrivalVolumeQuintals(new BigDecimal("1420.00"));
        testPrice.setMinPrice(new BigDecimal("2320.00"));
        testPrice.setMaxPrice(new BigDecimal("2520.00"));
    }

    @Test
    @DisplayName("getMarketPrices without filters returns all records sorted")
    void shouldReturnAllMarketPricesWhenNoFilters() {
        when(marketPriceRepository.findAllByOrderByPriceDateDescCropNameAsc())
                .thenReturn(List.of(testPrice));

        List<MarketPriceResponse> responses = marketPriceService.getMarketPrices(null, null, null, null, null, null);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getCropName()).isEqualTo("Wheat");
        assertThat(responses.get(0).getPricePerQuintal()).isEqualByComparingTo(new BigDecimal("2450.00"));
    }

    @Test
    @DisplayName("getMarketPrices with filters calls repository findWithFilters")
    void shouldCallFilterQueryWhenFiltersProvided() {
        when(marketPriceRepository.findWithFilters("Wheat", "Nashik", "RISING", null, null, null))
                .thenReturn(List.of(testPrice));

        List<MarketPriceResponse> responses = marketPriceService.getMarketPrices("Wheat", "Nashik", "RISING", null, null, null);

        assertThat(responses).hasSize(1);
        verify(marketPriceRepository, times(1)).findWithFilters("Wheat", "Nashik", "RISING", null, null, null);
    }

    @Test
    @DisplayName("getMarketPriceById returns market price record when found")
    void shouldGetMarketPriceById() {
        when(marketPriceRepository.findById(1L)).thenReturn(Optional.of(testPrice));

        MarketPriceResponse response = marketPriceService.getMarketPriceById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getMarketName()).isEqualTo("APMC Nashik");
    }

    @Test
    @DisplayName("getMarketPriceById throws ResourceNotFoundException when record not found")
    void shouldThrowNotFoundWhenMarketPriceMissing() {
        when(marketPriceRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> marketPriceService.getMarketPriceById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Market price record not found with id: 999");
    }

    @Test
    @DisplayName("createMarketPrice calculates pricePerKg, priceChange, changePercent, and trend automatically")
    void shouldCreateMarketPriceWithCalculatedFields() {
        MarketPriceRequest request = new MarketPriceRequest();
        request.setCropName("Maize");
        request.setVariety("Hybrid");
        request.setMarketName("Karnal Mandi");
        request.setLocation("Karnal, Haryana");
        request.setPricePerQuintal(new BigDecimal("1850.00"));
        request.setPreviousPrice(new BigDecimal("1880.00")); // -30.00 difference -> FALLING
        request.setPriceDate(LocalDate.of(2026, 10, 2));

        when(marketPriceRepository.save(any(MarketPrice.class))).thenAnswer(invocation -> {
            MarketPrice p = invocation.getArgument(0);
            p.setId(2L);
            return p;
        });

        MarketPriceResponse response = marketPriceService.createMarketPrice(request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(2L);
        assertThat(response.getPricePerKg()).isEqualByComparingTo(new BigDecimal("18.50"));
        assertThat(response.getPriceChange()).isEqualByComparingTo(new BigDecimal("-30.00"));
        assertThat(response.getTrend()).isEqualTo("FALLING");
        assertThat(response.getChangePercent()).isEqualByComparingTo(new BigDecimal("-1.60"));
    }

    @Test
    @DisplayName("createMarketPrice rejects when maxPrice < minPrice")
    void shouldRejectWhenMaxPriceLessThanMinPrice() {
        MarketPriceRequest request = new MarketPriceRequest();
        request.setCropName("Barley");
        request.setVariety("Standard");
        request.setMarketName("Kota Mandi");
        request.setLocation("Kota, Rajasthan");
        request.setPricePerQuintal(new BigDecimal("1500.00"));
        request.setPriceDate(LocalDate.of(2026, 10, 2));
        request.setMinPrice(new BigDecimal("1600.00"));
        request.setMaxPrice(new BigDecimal("1400.00")); // invalid: max < min

        assertThatThrownBy(() -> marketPriceService.createMarketPrice(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Maximum price");

        verify(marketPriceRepository, never()).save(any());
    }

    @Test
    @DisplayName("createMarketPrice rejects when pricePerQuintal is zero or negative")
    void shouldRejectWhenPricePerQuintalNonPositive() {
        MarketPriceRequest request = new MarketPriceRequest();
        request.setCropName("Barley");
        request.setVariety("Standard");
        request.setMarketName("Kota Mandi");
        request.setLocation("Kota, Rajasthan");
        request.setPricePerQuintal(BigDecimal.ZERO);
        request.setPriceDate(LocalDate.of(2026, 10, 2));

        assertThatThrownBy(() -> marketPriceService.createMarketPrice(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Price per quintal must be greater than zero");
    }

    @Test
    @DisplayName("updateMarketPrice updates existing price record")
    void shouldUpdateMarketPriceSuccessfully() {
        MarketPriceRequest request = new MarketPriceRequest();
        request.setCropName("Wheat");
        request.setVariety("Sharbati");
        request.setMarketName("APMC Nashik");
        request.setLocation("Nashik, Maharashtra");
        request.setPricePerQuintal(new BigDecimal("2500.00"));
        request.setPriceDate(LocalDate.of(2026, 10, 3));

        when(marketPriceRepository.findById(1L)).thenReturn(Optional.of(testPrice));
        when(marketPriceRepository.save(any(MarketPrice.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MarketPriceResponse response = marketPriceService.updateMarketPrice(1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getPricePerQuintal()).isEqualByComparingTo(new BigDecimal("2500.00"));
        assertThat(response.getPricePerKg()).isEqualByComparingTo(new BigDecimal("25.00"));
    }

    @Test
    @DisplayName("deleteMarketPrice removes record")
    void shouldDeleteMarketPrice() {
        when(marketPriceRepository.findById(1L)).thenReturn(Optional.of(testPrice));

        marketPriceService.deleteMarketPrice(1L);

        verify(marketPriceRepository, times(1)).delete(testPrice);
    }
}
