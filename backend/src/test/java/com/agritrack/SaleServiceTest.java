package com.agritrack;

import com.agritrack.dto.SaleRequest;
import com.agritrack.dto.SaleResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.HarvestRepository;
import com.agritrack.repository.SaleRepository;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.SaleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SaleService Unit Tests")
class SaleServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private HarvestRepository harvestRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SaleService saleService;

    private User testUser;
    private Farm testFarm;
    private Field testField;
    private CropCycle testCycle;
    private Harvest testHarvest;
    private Sale testSale;

    @BeforeEach
    void setUp() {
        testUser = new User("Ramesh Kumar", "ramesh@example.com", "9876543210", "pwd_hash", Role.FARMER);
        testUser.setId(10L);

        testFarm = new Farm(testUser, "Green Valley Farm", "Karnal", new BigDecimal("45.50"), "Acres", "Main plot", "Active");
        testFarm.setId(100L);

        testField = new Field(testFarm, "North Field - Sector A", new BigDecimal("12.50"), "Acres", "Alluvial", "Drip", "Active", "Vegetative phase");
        testField.setId(500L);

        testCycle = new CropCycle(testField, "Wheat", "Sharbati", "Rabi", LocalDate.of(2026, 11, 15), LocalDate.of(2027, 3, 15), null, "Sowing", 1, 10, "Active", "Optimal");
        testCycle.setId(2000L);

        testHarvest = new Harvest();
        testHarvest.setId(3000L);
        testHarvest.setCropCycle(testCycle);
        testHarvest.setHarvestDate(LocalDate.of(2027, 3, 20));
        testHarvest.setExpectedYieldKg(new BigDecimal("5000.00"));
        testHarvest.setHarvestedQuantityKg(new BigDecimal("5000.00"));
        testHarvest.setAvailableQuantityKg(new BigDecimal("5000.00"));
        testHarvest.setSoldQuantityKg(BigDecimal.ZERO);
        testHarvest.setStatus("HARVESTED");

        testSale = new Sale();
        testSale.setId(4000L);
        testSale.setHarvest(testHarvest);
        testSale.setBuyerName("Agro Trading Co");
        testSale.setSaleDate(LocalDate.of(2027, 3, 25));
        testSale.setQuantityKg(new BigDecimal("1000.00"));
        testSale.setPricePerKg(new BigDecimal("25.00"));
        testSale.setPricePerQuintal(new BigDecimal("2500.00"));
        testSale.setTotalAmount(new BigDecimal("25000.00"));
        testSale.setPaidAmount(new BigDecimal("25000.00"));
        testSale.setBalanceDue(BigDecimal.ZERO);
        testSale.setPaymentStatus("PAID");
        testSale.setStatus("COMPLETED");
    }

    @Test
    @DisplayName("createSale creates sale, decrements inventory, and derives financial calculations")
    void shouldCreateSaleSuccessfully() {
        SaleRequest request = new SaleRequest();
        request.setBuyerName("Agro Trading Co");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("1000.00"));
        request.setPricePerKg(new BigDecimal("25.00"));
        request.setPaidAmount(new BigDecimal("20000.00")); // Partial payment

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> {
            Sale s = invocation.getArgument(0);
            s.setId(4000L);
            return s;
        });

        SaleResponse response = saleService.createSale(testHarvest.getId(), request, testUser.getEmail());

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(4000L);
        assertThat(response.getTotalAmount()).isEqualByComparingTo(new BigDecimal("25000.00"));
        assertThat(response.getPricePerQuintal()).isEqualByComparingTo(new BigDecimal("2500.00"));
        assertThat(response.getPaidAmount()).isEqualByComparingTo(new BigDecimal("20000.00"));
        assertThat(response.getBalanceDue()).isEqualByComparingTo(new BigDecimal("5000.00"));
        assertThat(response.getPaymentStatus()).isEqualTo("PARTIAL");

        // Verify inventory decrement
        assertThat(testHarvest.getAvailableQuantityKg()).isEqualByComparingTo(new BigDecimal("4000.00"));
        assertThat(testHarvest.getSoldQuantityKg()).isEqualByComparingTo(new BigDecimal("1000.00"));
        assertThat(testHarvest.getStatus()).isEqualTo("PARTIALLY_SOLD");
        verify(harvestRepository, times(1)).save(testHarvest);
    }

    @Test
    @DisplayName("createSale marks harvest as SOLD_OUT when all inventory is purchased")
    void shouldMarkHarvestSoldOutWhenStockDepleted() {
        SaleRequest request = new SaleRequest();
        request.setBuyerName("Mega Foods");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("5000.00")); // Total available
        request.setPricePerKg(new BigDecimal("24.00"));

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SaleResponse response = saleService.createSale(testHarvest.getId(), request, testUser.getEmail());

        assertThat(testHarvest.getAvailableQuantityKg()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(testHarvest.getSoldQuantityKg()).isEqualByComparingTo(new BigDecimal("5000.00"));
        assertThat(testHarvest.getStatus()).isEqualTo("SOLD_OUT");
        assertThat(response.getPaymentStatus()).isEqualTo("PAID"); // Default paidAmount = totalAmount
    }

    @Test
    @DisplayName("createSale rejects when requested quantity exceeds available stock")
    void shouldRejectWhenInsufficientStock() {
        SaleRequest request = new SaleRequest();
        request.setBuyerName("Agro Trading Co");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("6000.00")); // exceeds 5000.00
        request.setPricePerKg(new BigDecimal("25.00"));

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));

        assertThatThrownBy(() -> saleService.createSale(testHarvest.getId(), request, testUser.getEmail()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Insufficient available stock");

        verify(saleRepository, never()).save(any());
    }

    @Test
    @DisplayName("createSale throws ResourceNotFoundException when harvest is unowned")
    void shouldThrowNotFoundWhenHarvestUnowned() {
        SaleRequest request = new SaleRequest();
        request.setBuyerName("Agro Trading Co");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("500.00"));
        request.setPricePerKg(new BigDecimal("25.00"));

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(9999L, testUser.getId()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> saleService.createSale(9999L, request, testUser.getEmail()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Harvest not found with id: 9999");
    }

    @Test
    @DisplayName("deleteSale refunds stock back to harvest inventory")
    void shouldRefundStockOnSaleDeletion() {
        // Prepare harvest state reflecting the existing sale of 1000 kg
        testHarvest.setAvailableQuantityKg(new BigDecimal("4000.00"));
        testHarvest.setSoldQuantityKg(new BigDecimal("1000.00"));
        testHarvest.setStatus("PARTIALLY_SOLD");

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(saleRepository.findByIdAndHarvestCropCycleFieldFarmUserId(testSale.getId(), testUser.getId()))
                .thenReturn(Optional.of(testSale));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));

        saleService.deleteSale(testSale.getId(), testUser.getEmail());

        assertThat(testHarvest.getAvailableQuantityKg()).isEqualByComparingTo(new BigDecimal("5000.00"));
        assertThat(testHarvest.getSoldQuantityKg()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(testHarvest.getStatus()).isEqualTo("HARVESTED");
        verify(saleRepository, times(1)).delete(testSale);
        verify(harvestRepository, times(1)).save(testHarvest);
    }

    @Test
    @DisplayName("updateSale with increased quantity consumes additional stock")
    void shouldConsumeAdditionalStockOnSaleQuantityIncrease() {
        testHarvest.setAvailableQuantityKg(new BigDecimal("4000.00"));
        testHarvest.setSoldQuantityKg(new BigDecimal("1000.00"));

        SaleRequest request = new SaleRequest();
        request.setBuyerName("Agro Trading Co");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("1500.00")); // increase by 500 kg
        request.setPricePerKg(new BigDecimal("25.00"));

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(saleRepository.findByIdAndHarvestCropCycleFieldFarmUserId(testSale.getId(), testUser.getId()))
                .thenReturn(Optional.of(testSale));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SaleResponse response = saleService.updateSale(testSale.getId(), request, testUser.getEmail());

        assertThat(testHarvest.getAvailableQuantityKg()).isEqualByComparingTo(new BigDecimal("3500.00"));
        assertThat(testHarvest.getSoldQuantityKg()).isEqualByComparingTo(new BigDecimal("1500.00"));
        assertThat(response.getTotalAmount()).isEqualByComparingTo(new BigDecimal("37500.00"));
    }

    @Test
    @DisplayName("updateSale with decreased quantity returns surplus to available inventory")
    void shouldReturnSurplusStockOnSaleQuantityDecrease() {
        testHarvest.setAvailableQuantityKg(new BigDecimal("4000.00"));
        testHarvest.setSoldQuantityKg(new BigDecimal("1000.00"));

        SaleRequest request = new SaleRequest();
        request.setBuyerName("Agro Trading Co");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("600.00")); // decrease by 400 kg
        request.setPricePerKg(new BigDecimal("25.00"));
        request.setPaidAmount(new BigDecimal("15000.00"));

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(saleRepository.findByIdAndHarvestCropCycleFieldFarmUserId(testSale.getId(), testUser.getId()))
                .thenReturn(Optional.of(testSale));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> invocation.getArgument(0));

        saleService.updateSale(testSale.getId(), request, testUser.getEmail());

        assertThat(testHarvest.getAvailableQuantityKg()).isEqualByComparingTo(new BigDecimal("4400.00"));
        assertThat(testHarvest.getSoldQuantityKg()).isEqualByComparingTo(new BigDecimal("600.00"));
    }

    @Test
    @DisplayName("updateSale with unchanged quantity makes no inventory change")
    void shouldNotChangeInventoryWhenSaleQuantityUnchanged() {
        testHarvest.setAvailableQuantityKg(new BigDecimal("4000.00"));
        testHarvest.setSoldQuantityKg(new BigDecimal("1000.00"));

        SaleRequest request = new SaleRequest();
        request.setBuyerName("New Buyer Name");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("1000.00")); // unchanged
        request.setPricePerKg(new BigDecimal("25.00"));

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(saleRepository.findByIdAndHarvestCropCycleFieldFarmUserId(testSale.getId(), testUser.getId()))
                .thenReturn(Optional.of(testSale));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> invocation.getArgument(0));

        saleService.updateSale(testSale.getId(), request, testUser.getEmail());

        assertThat(testHarvest.getAvailableQuantityKg()).isEqualByComparingTo(new BigDecimal("4000.00"));
        assertThat(testHarvest.getSoldQuantityKg()).isEqualByComparingTo(new BigDecimal("1000.00"));
    }

    @Test
    @DisplayName("getSaleById throws ResourceNotFoundException for unowned sale")
    void shouldThrowNotFoundForUnownedSale() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(saleRepository.findByIdAndHarvestCropCycleFieldFarmUserId(9999L, testUser.getId()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> saleService.getSaleById(9999L, testUser.getEmail()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Sale not found with id: 9999");
    }

    @Test
    @DisplayName("createSale correctly derives PENDING payment status when paidAmount is zero")
    void shouldDerivePendingPaymentStatusWhenPaidAmountZero() {
        SaleRequest request = new SaleRequest();
        request.setBuyerName("Credit Buyer");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("100.00"));
        request.setPricePerKg(new BigDecimal("20.00"));
        request.setPaidAmount(BigDecimal.ZERO);

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SaleResponse response = saleService.createSale(testHarvest.getId(), request, testUser.getEmail());

        assertThat(response.getPaymentStatus()).isEqualTo("PENDING");
        assertThat(response.getBalanceDue()).isEqualByComparingTo(new BigDecimal("2000.00"));
    }

    @Test
    @DisplayName("createSale rejects request when paidAmount exceeds totalAmount (overpayment)")
    void shouldRejectOverpaymentWhenPaidAmountExceedsTotal() {
        SaleRequest request = new SaleRequest();
        request.setBuyerName("Overpaying Buyer");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("100.00"));
        request.setPricePerKg(new BigDecimal("20.00")); // total = 2000.00
        request.setPaidAmount(new BigDecimal("2500.00")); // overpayment

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));

        assertThatThrownBy(() -> saleService.createSale(testHarvest.getId(), request, testUser.getEmail()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot exceed total amount");

        verify(saleRepository, never()).save(any());
    }

    @Test
    @DisplayName("createSale derives PAID payment status when paidAmount exactly equals totalAmount")
    void shouldDerivePaidStatusWhenPaidAmountEqualsTotal() {
        SaleRequest request = new SaleRequest();
        request.setBuyerName("Cash Buyer");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("100.00"));
        request.setPricePerKg(new BigDecimal("20.00")); // total = 2000.00
        request.setPaidAmount(new BigDecimal("2000.00")); // exact payment

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SaleResponse response = saleService.createSale(testHarvest.getId(), request, testUser.getEmail());

        assertThat(response.getPaymentStatus()).isEqualTo("PAID");
        assertThat(response.getBalanceDue()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("updateSale rejects request when paidAmount exceeds recalculated totalAmount")
    void shouldRejectOverpaymentOnSaleUpdate() {
        SaleRequest request = new SaleRequest();
        request.setBuyerName("Agro Trading Co");
        request.setSaleDate(LocalDate.of(2027, 3, 25));
        request.setQuantityKg(new BigDecimal("100.00"));
        request.setPricePerKg(new BigDecimal("20.00")); // total = 2000.00
        request.setPaidAmount(new BigDecimal("2500.00")); // overpayment

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(saleRepository.findByIdAndHarvestCropCycleFieldFarmUserId(testSale.getId(), testUser.getId()))
                .thenReturn(Optional.of(testSale));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserIdWithLock(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));

        assertThatThrownBy(() -> saleService.updateSale(testSale.getId(), request, testUser.getEmail()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot exceed total amount");
    }
}
