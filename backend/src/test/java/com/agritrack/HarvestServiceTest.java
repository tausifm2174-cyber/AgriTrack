package com.agritrack;

import com.agritrack.dto.HarvestRequest;
import com.agritrack.dto.HarvestResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.*;
import com.agritrack.service.HarvestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("HarvestService Unit Tests")
class HarvestServiceTest {

    @Mock
    private HarvestRepository harvestRepository;

    @Mock
    private CropCycleRepository cropCycleRepository;

    @Mock
    private FieldRepository fieldRepository;

    @Mock
    private FarmRepository farmRepository;

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private HarvestService harvestService;

    private User testUser;
    private Farm testFarm;
    private Field testField;
    private CropCycle testCycle;
    private Harvest testHarvest;

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
        testHarvest.setHarvestedQuantityKg(new BigDecimal("5200.00"));
        testHarvest.setAvailableQuantityKg(new BigDecimal("5200.00"));
        testHarvest.setSoldQuantityKg(BigDecimal.ZERO);
        testHarvest.setQualityGrade("A");
        testHarvest.setQualityScore(90);
        testHarvest.setMoisturePercent(new BigDecimal("12.50"));
        testHarvest.setStatus("HARVESTED");
        testHarvest.setStorageLocation("Silo A");
    }

    @Test
    @DisplayName("createHarvest creates harvest successfully with valid invariant")
    void shouldCreateHarvestSuccessfully() {
        HarvestRequest request = new HarvestRequest();
        request.setHarvestDate(LocalDate.of(2027, 3, 20));
        request.setExpectedYieldKg(new BigDecimal("5000.00"));
        request.setHarvestedQuantityKg(new BigDecimal("5200.00"));
        request.setQualityGrade("A");
        request.setQualityScore(90);
        request.setMoisturePercent(new BigDecimal("12.50"));
        request.setStorageLocation("Silo A");

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(testCycle.getId(), testUser.getId()))
                .thenReturn(Optional.of(testCycle));
        when(harvestRepository.save(any(Harvest.class))).thenAnswer(invocation -> {
            Harvest h = invocation.getArgument(0);
            h.setId(3000L);
            return h;
        });

        HarvestResponse response = harvestService.createHarvest(testCycle.getId(), request, testUser.getEmail());

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(3000L);
        assertThat(response.getHarvestedQuantityKg()).isEqualByComparingTo(new BigDecimal("5200.00"));
        assertThat(response.getAvailableQuantityKg()).isEqualByComparingTo(new BigDecimal("5200.00"));
        assertThat(response.getSoldQuantityKg()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.getStatus()).isEqualTo("HARVESTED");
        assertThat(response.getCropCycleId()).isEqualTo(testCycle.getId());
        assertThat(response.getCropName()).isEqualTo("Wheat");
    }

    @Test
    @DisplayName("createHarvest throws ResourceNotFoundException when crop cycle belongs to another user")
    void shouldThrowNotFoundWhenCropCycleUnowned() {
        HarvestRequest request = new HarvestRequest();
        request.setHarvestDate(LocalDate.of(2027, 3, 20));
        request.setHarvestedQuantityKg(new BigDecimal("5000.00"));

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(9999L, testUser.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> harvestService.createHarvest(9999L, request, testUser.getEmail()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Crop cycle not found with id: 9999");
    }

    @Test
    @DisplayName("createHarvest throws IllegalArgumentException when inventory invariant is violated")
    void shouldThrowWhenInventoryInvariantViolatedOnCreate() {
        HarvestRequest request = new HarvestRequest();
        request.setHarvestDate(LocalDate.of(2027, 3, 20));
        request.setHarvestedQuantityKg(new BigDecimal("1000.00"));
        request.setAvailableQuantityKg(new BigDecimal("800.00"));
        request.setSoldQuantityKg(new BigDecimal("300.00")); // 800 + 300 = 1100 > 1000

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(testCycle.getId(), testUser.getId()))
                .thenReturn(Optional.of(testCycle));

        assertThatThrownBy(() -> harvestService.createHarvest(testCycle.getId(), request, testUser.getEmail()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Inventory invariant violated");
    }

    @Test
    @DisplayName("createHarvest throws IllegalArgumentException when quality score is out of range")
    void shouldThrowWhenQualityScoreInvalid() {
        HarvestRequest request = new HarvestRequest();
        request.setHarvestDate(LocalDate.of(2027, 3, 20));
        request.setHarvestedQuantityKg(new BigDecimal("1000.00"));
        request.setQualityScore(150);

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(testCycle.getId(), testUser.getId()))
                .thenReturn(Optional.of(testCycle));

        assertThatThrownBy(() -> harvestService.createHarvest(testCycle.getId(), request, testUser.getEmail()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Quality score must be between 0 and 100");
    }

    @Test
    @DisplayName("createHarvest throws IllegalArgumentException when moisture percent is out of range")
    void shouldThrowWhenMoisturePercentInvalid() {
        HarvestRequest request = new HarvestRequest();
        request.setHarvestDate(LocalDate.of(2027, 3, 20));
        request.setHarvestedQuantityKg(new BigDecimal("1000.00"));
        request.setMoisturePercent(new BigDecimal("-5.00"));

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(testCycle.getId(), testUser.getId()))
                .thenReturn(Optional.of(testCycle));

        assertThatThrownBy(() -> harvestService.createHarvest(testCycle.getId(), request, testUser.getEmail()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Moisture percent must be between 0 and 100");
    }

    @Test
    @DisplayName("updateHarvest updates harvest details and preserves inventory consistency")
    void shouldUpdateHarvestSuccessfully() {
        HarvestRequest request = new HarvestRequest();
        request.setHarvestDate(LocalDate.of(2027, 3, 22));
        request.setExpectedYieldKg(new BigDecimal("5000.00"));
        request.setHarvestedQuantityKg(new BigDecimal("5500.00"));
        request.setAvailableQuantityKg(new BigDecimal("5500.00"));
        request.setQualityGrade("A");
        request.setQualityScore(92);

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserId(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.findAllByHarvestIdAndHarvestCropCycleFieldFarmUserId(testHarvest.getId(), testUser.getId()))
                .thenReturn(Collections.emptyList());
        when(harvestRepository.save(any(Harvest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        HarvestResponse response = harvestService.updateHarvest(testHarvest.getId(), request, testUser.getEmail());

        assertThat(response).isNotNull();
        assertThat(response.getHarvestedQuantityKg()).isEqualByComparingTo(new BigDecimal("5500.00"));
        assertThat(response.getQualityScore()).isEqualTo(92);
    }

    @Test
    @DisplayName("updateHarvest rejects overwriting sold quantity when recorded sales exist")
    void shouldRejectOverwritingSoldQuantityWhenSalesExist() {
        HarvestRequest request = new HarvestRequest();
        request.setHarvestDate(LocalDate.of(2027, 3, 22));
        request.setHarvestedQuantityKg(new BigDecimal("5000.00"));
        request.setSoldQuantityKg(new BigDecimal("500.00")); // Client tries to supply 500 when sales total 1000

        Sale sale = new Sale();
        sale.setId(700L);
        sale.setQuantityKg(new BigDecimal("1000.00"));

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserId(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.findAllByHarvestIdAndHarvestCropCycleFieldFarmUserId(testHarvest.getId(), testUser.getId()))
                .thenReturn(List.of(sale));

        assertThatThrownBy(() -> harvestService.updateHarvest(testHarvest.getId(), request, testUser.getEmail()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cannot overwrite sold quantity when recorded sales exist");
    }

    @Test
    @DisplayName("deleteHarvest blocks deletion when sales exist to safeguard financial records")
    void shouldBlockHarvestDeletionWhenSalesExist() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserId(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.existsByHarvestId(testHarvest.getId())).thenReturn(true);

        assertThatThrownBy(() -> harvestService.deleteHarvest(testHarvest.getId(), testUser.getEmail()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cannot delete harvest with existing sales records");

        verify(harvestRepository, never()).delete(any());
    }

    @Test
    @DisplayName("deleteHarvest succeeds when no sales exist")
    void shouldDeleteHarvestWhenNoSalesExist() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserId(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));
        when(saleRepository.existsByHarvestId(testHarvest.getId())).thenReturn(false);

        harvestService.deleteHarvest(testHarvest.getId(), testUser.getEmail());

        verify(harvestRepository, times(1)).delete(testHarvest);
    }

    @Test
    @DisplayName("getHarvestById returns harvest details for owned resource")
    void shouldGetHarvestById() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserId(testHarvest.getId(), testUser.getId()))
                .thenReturn(Optional.of(testHarvest));

        HarvestResponse response = harvestService.getHarvestById(testHarvest.getId(), testUser.getEmail());

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(testHarvest.getId());
    }

    @Test
    @DisplayName("getHarvestById throws ResourceNotFoundException for unowned harvest")
    void shouldThrowNotFoundForUnownedHarvest() {
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(harvestRepository.findByIdAndCropCycleFieldFarmUserId(9999L, testUser.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> harvestService.getHarvestById(9999L, testUser.getEmail()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Harvest not found with id: 9999");
    }

    @Test
    @DisplayName("createHarvest sets status to PLANNED when harvested quantity is zero")
    void shouldSetPlannedStatusWhenHarvestedQuantityZero() {
        HarvestRequest request = new HarvestRequest();
        request.setHarvestDate(LocalDate.of(2027, 4, 15));
        request.setExpectedYieldKg(new BigDecimal("1500.00"));
        request.setHarvestedQuantityKg(BigDecimal.ZERO);
        request.setAvailableQuantityKg(BigDecimal.ZERO);
        request.setSoldQuantityKg(BigDecimal.ZERO);
        request.setStatus("PLANNED");

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(testCycle.getId(), testUser.getId()))
                .thenReturn(Optional.of(testCycle));
        when(harvestRepository.save(any(Harvest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        HarvestResponse response = harvestService.createHarvest(testCycle.getId(), request, testUser.getEmail());

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo("PLANNED");
        assertThat(response.getHarvestedQuantityKg()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("createHarvest rejects PLANNED status when harvested quantity is greater than zero")
    void shouldRejectPlannedStatusWhenHarvestedQuantityPositive() {
        HarvestRequest request = new HarvestRequest();
        request.setHarvestDate(LocalDate.of(2027, 3, 20));
        request.setHarvestedQuantityKg(new BigDecimal("1000.00"));
        request.setStatus("PLANNED");

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(testCycle.getId(), testUser.getId()))
                .thenReturn(Optional.of(testCycle));

        assertThatThrownBy(() -> harvestService.createHarvest(testCycle.getId(), request, testUser.getEmail()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Harvest status cannot be PLANNED when harvested quantity is greater than zero");
    }
}
