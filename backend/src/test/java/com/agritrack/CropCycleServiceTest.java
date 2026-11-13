package com.agritrack;

import com.agritrack.dto.CropCycleRequest;
import com.agritrack.dto.CropCycleResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.CropCycleRepository;
import com.agritrack.repository.FieldRepository;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.CropCycleService;
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
@DisplayName("CropCycleService Unit Tests")
class CropCycleServiceTest {

    @Mock
    private CropCycleRepository cropCycleRepository;

    @Mock
    private FieldRepository fieldRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CropCycleService cropCycleService;

    private User testUser;
    private Farm testFarm;
    private Field testField;
    private CropCycle testCycle;

    @BeforeEach
    void setUp() {
        testUser = new User("Ramesh Kumar", "ramesh@example.com", "9876543210", "hashed", Role.FARMER);
        testUser.setId(10L);

        testFarm = new Farm(testUser, "Green Valley Farm", "Karnal, Haryana", new BigDecimal("45.50"), "Acres", "Main fertile plot", "Active");
        testFarm.setId(100L);

        testField = new Field(testFarm, "North Field - Sector A", new BigDecimal("12.50"), "Acres", "Alluvial Soil", "Drip", "Active", "Vegetative phase");
        testField.setId(500L);

        testCycle = new CropCycle(
                testField,
                "Wheat",
                "Sharbati",
                "Rabi",
                LocalDate.of(2026, 11, 15),
                LocalDate.of(2027, 3, 15),
                null,
                "Vegetative Growth",
                2,
                45,
                "Active",
                "Optimal growth"
        );
        testCycle.setId(2000L);
    }

    @Test
    @DisplayName("1. createCropCycle under owned field succeeds")
    void shouldCreateCropCycleUnderOwnedField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));
        when(cropCycleRepository.save(any(CropCycle.class))).thenReturn(testCycle);

        CropCycleRequest request = new CropCycleRequest("Wheat", "Sharbati", "Rabi",
                LocalDate.of(2026, 11, 15), LocalDate.of(2027, 3, 15), null,
                "Vegetative Growth", 2, 45, "Active", "Optimal growth");

        CropCycleResponse response = cropCycleService.createCropCycle(500L, request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(2000L);
        assertThat(response.getCropName()).isEqualTo("Wheat");
        assertThat(response.getVariety()).isEqualTo("Sharbati");
        assertThat(response.getFieldId()).isEqualTo(500L);
        assertThat(response.getFarmId()).isEqualTo(100L);
        assertThat(response.getFarmName()).isEqualTo("Green Valley Farm");
        verify(cropCycleRepository, times(1)).save(any(CropCycle.class));
    }

    @Test
    @DisplayName("2. reject creation under another user's field")
    void shouldRejectCreationUnderUnownedField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(999L, 10L)).thenReturn(Optional.empty());

        CropCycleRequest request = new CropCycleRequest("Wheat", "Sharbati", "Rabi",
                LocalDate.of(2026, 11, 15), LocalDate.of(2027, 3, 15), null,
                "Vegetative Growth", 2, 45, "Active", "Optimal growth");

        assertThatThrownBy(() -> cropCycleService.createCropCycle(999L, request, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Field not found with id: 999");
    }

    @Test
    @DisplayName("3. list crop cycles for owned field")
    void shouldListCropCyclesForOwnedField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.existsByIdAndFarmUserId(500L, 10L)).thenReturn(true);
        when(cropCycleRepository.findAllByFieldIdAndFieldFarmUserId(500L, 10L)).thenReturn(List.of(testCycle));

        List<CropCycleResponse> list = cropCycleService.getCropCyclesByField(500L, "ramesh@example.com");

        assertThat(list).hasSize(1);
        assertThat(list.getFirst().getCropName()).isEqualTo("Wheat");
    }

    @Test
    @DisplayName("4. reject listing another user's field")
    void shouldRejectListingUnownedField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.existsByIdAndFarmUserId(999L, 10L)).thenReturn(false);

        assertThatThrownBy(() -> cropCycleService.getCropCyclesByField(999L, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Field not found with id: 999");
    }

    @Test
    @DisplayName("5. list all crop cycles for authenticated user")
    void shouldListAllCropCyclesForUser() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findAllByFieldFarmUserId(10L)).thenReturn(List.of(testCycle));

        List<CropCycleResponse> list = cropCycleService.getAllCropCyclesForUser("ramesh@example.com");

        assertThat(list).hasSize(1);
        assertThat(list.getFirst().getCropName()).isEqualTo("Wheat");
    }

    @Test
    @DisplayName("6. retrieve owned crop cycle")
    void shouldRetrieveOwnedCropCycle() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(2000L, 10L)).thenReturn(Optional.of(testCycle));

        CropCycleResponse response = cropCycleService.getCropCycleById(2000L, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(2000L);
    }

    @Test
    @DisplayName("7. reject retrieval of another user's crop cycle")
    void shouldRejectRetrievalOfUnownedCropCycle() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(999L, 10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cropCycleService.getCropCycleById(999L, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Crop cycle not found with id: 999");
    }

    @Test
    @DisplayName("8. update owned crop cycle")
    void shouldUpdateOwnedCropCycle() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(2000L, 10L)).thenReturn(Optional.of(testCycle));
        when(cropCycleRepository.save(any(CropCycle.class))).thenReturn(testCycle);

        CropCycleRequest updateRequest = new CropCycleRequest("Wheat", "Sharbati", "Rabi",
                LocalDate.of(2026, 11, 15), LocalDate.of(2027, 3, 20), null,
                "Flowering", 3, 65, "Active", "Flowering phase");

        CropCycleResponse response = cropCycleService.updateCropCycle(2000L, updateRequest, "ramesh@example.com");

        assertThat(response).isNotNull();
        verify(cropCycleRepository).save(testCycle);
    }

    @Test
    @DisplayName("9. reject update of another user's crop cycle")
    void shouldRejectUpdateOfUnownedCropCycle() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(999L, 10L)).thenReturn(Optional.empty());

        CropCycleRequest updateRequest = new CropCycleRequest("Wheat", "Sharbati", "Rabi",
                LocalDate.of(2026, 11, 15), LocalDate.of(2027, 3, 20), null,
                "Flowering", 3, 65, "Active", "Flowering phase");

        assertThatThrownBy(() -> cropCycleService.updateCropCycle(999L, updateRequest, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Crop cycle not found with id: 999");
    }

    @Test
    @DisplayName("10. delete owned crop cycle")
    void shouldDeleteOwnedCropCycle() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(2000L, 10L)).thenReturn(Optional.of(testCycle));

        cropCycleService.deleteCropCycle(2000L, "ramesh@example.com");

        verify(cropCycleRepository, times(1)).delete(testCycle);
    }

    @Test
    @DisplayName("11. reject deletion of another user's crop cycle")
    void shouldRejectDeletionOfUnownedCropCycle() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(999L, 10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cropCycleService.deleteCropCycle(999L, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Crop cycle not found with id: 999");
    }

    @Test
    @DisplayName("12. reject expected harvest date before sowing date")
    void shouldRejectExpectedHarvestDateBeforeSowingDate() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));

        CropCycleRequest request = new CropCycleRequest("Wheat", "Sharbati", "Rabi",
                LocalDate.of(2026, 11, 15), LocalDate.of(2026, 10, 15), null,
                "Sowing", 1, 0, "Active", "Invalid dates");

        assertThatThrownBy(() -> cropCycleService.createCropCycle(500L, request, "ramesh@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Expected harvest date cannot be before sowing date");
    }

    @Test
    @DisplayName("13. reject actual harvest date before sowing date when supplied")
    void shouldRejectActualHarvestDateBeforeSowingDate() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));

        CropCycleRequest request = new CropCycleRequest("Wheat", "Sharbati", "Rabi",
                LocalDate.of(2026, 11, 15), LocalDate.of(2027, 3, 15), LocalDate.of(2026, 10, 1),
                "Sowing", 1, 0, "Active", "Invalid dates");

        assertThatThrownBy(() -> cropCycleService.createCropCycle(500L, request, "ramesh@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Actual harvest date cannot be before sowing date");
    }
}

