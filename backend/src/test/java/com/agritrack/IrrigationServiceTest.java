package com.agritrack;

import com.agritrack.dto.IrrigationRequest;
import com.agritrack.dto.IrrigationResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.CropCycleRepository;
import com.agritrack.repository.FieldRepository;
import com.agritrack.repository.IrrigationScheduleRepository;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.IrrigationService;
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
@DisplayName("IrrigationService Unit Tests")
class IrrigationServiceTest {

    @Mock
    private IrrigationScheduleRepository irrigationRepository;

    @Mock
    private FieldRepository fieldRepository;

    @Mock
    private CropCycleRepository cropCycleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private IrrigationService irrigationService;

    private User testUser;
    private Farm testFarm;
    private Field testField;
    private Field otherField;
    private CropCycle testCycle;
    private IrrigationSchedule testSchedule;

    @BeforeEach
    void setUp() {
        testUser = new User("Ramesh Kumar", "ramesh@example.com", "9876543210", "pwd_hash", Role.FARMER);
        testUser.setId(10L);

        testFarm = new Farm(testUser, "Green Valley Farm", "Karnal", new BigDecimal("45.50"), "Acres", "Main plot", "Active");
        testFarm.setId(100L);

        testField = new Field(testFarm, "North Field - Sector A", new BigDecimal("12.50"), "Acres", "Alluvial", "Drip", "Active", "Vegetative phase");
        testField.setId(500L);

        otherField = new Field(testFarm, "South Field - Sector B", new BigDecimal("8.00"), "Acres", "Loam", "Sprinkler", "Active", "Preparation");
        otherField.setId(600L);

        testCycle = new CropCycle(testField, "Wheat", "Sharbati", "Rabi", LocalDate.of(2026, 11, 15), LocalDate.of(2027, 3, 15), null, "Sowing", 1, 10, "Active", "Optimal");
        testCycle.setId(2000L);

        testSchedule = new IrrigationSchedule(testField, testCycle, "Field 1A Morning Drip Run", "Drip", "Scheduled", "High", LocalDate.of(2026, 11, 20), "06:30 AM", 60, new BigDecimal("18000.00"), new BigDecimal("38.00"), "Sunny", BigDecimal.ZERO, null, "Notes");
        testSchedule.setId(4000L);
    }

    @Test
    @DisplayName("Create irrigation schedule without crop cycle succeeds")
    void shouldCreateIrrigationWithoutCropCycle() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));
        when(irrigationRepository.save(any(IrrigationSchedule.class))).thenReturn(testSchedule);

        IrrigationRequest request = new IrrigationRequest("Field 1A Morning Drip Run", "Drip", "Scheduled", "High", LocalDate.of(2026, 11, 20), "06:30 AM", 60, new BigDecimal("18000.00"), new BigDecimal("38.00"), "Sunny", BigDecimal.ZERO, null, "Notes", null);

        IrrigationResponse response = irrigationService.createIrrigation(500L, request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(4000L);
        assertThat(response.getTitle()).isEqualTo("Field 1A Morning Drip Run");
        verify(irrigationRepository).save(any(IrrigationSchedule.class));
    }

    @Test
    @DisplayName("Create irrigation schedule with valid crop cycle succeeds")
    void shouldCreateIrrigationWithValidCropCycle() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(2000L, 10L)).thenReturn(Optional.of(testCycle));
        when(irrigationRepository.save(any(IrrigationSchedule.class))).thenReturn(testSchedule);

        IrrigationRequest request = new IrrigationRequest("Field 1A Morning Drip Run", "Drip", "Scheduled", "High", LocalDate.of(2026, 11, 20), "06:30 AM", 60, new BigDecimal("18000.00"), new BigDecimal("38.00"), "Sunny", BigDecimal.ZERO, null, "Notes", 2000L);

        IrrigationResponse response = irrigationService.createIrrigation(500L, request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getCropCycleId()).isEqualTo(2000L);
    }

    @Test
    @DisplayName("Reject irrigation schedule when crop cycle belongs to another field")
    void shouldRejectWhenCropCycleBelongsToDifferentField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(600L, 10L)).thenReturn(Optional.of(otherField));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(2000L, 10L)).thenReturn(Optional.of(testCycle)); // testCycle is on field 500L

        IrrigationRequest request = new IrrigationRequest("Sprinkler Run", "Sprinkler", "Scheduled", "High", LocalDate.of(2026, 11, 20), null, 45, null, null, null, null, null, null, 2000L);

        assertThatThrownBy(() -> irrigationService.createIrrigation(600L, request, "ramesh@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not belong to field 600");
    }

    @Test
    @DisplayName("Reject irrigation creation under unowned field (404)")
    void shouldRejectIrrigationUnderUnownedField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(999L, 10L)).thenReturn(Optional.empty());

        IrrigationRequest request = new IrrigationRequest("Sprinkler Run", "Sprinkler", "Scheduled", "High", LocalDate.of(2026, 11, 20), null, 45, null, null, null, null, null, null, null);

        assertThatThrownBy(() -> irrigationService.createIrrigation(999L, request, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Field not found with id: 999");
    }

    @Test
    @DisplayName("List irrigation schedules for field")
    void shouldListIrrigationForField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.existsByIdAndFarmUserId(500L, 10L)).thenReturn(true);
        when(irrigationRepository.findAllByFieldIdAndFieldFarmUserId(500L, 10L)).thenReturn(List.of(testSchedule));

        List<IrrigationResponse> list = irrigationService.getIrrigationsByField(500L, "ramesh@example.com");

        assertThat(list).hasSize(1);
        assertThat(list.getFirst().getTitle()).isEqualTo("Field 1A Morning Drip Run");
    }

    @Test
    @DisplayName("List all irrigation schedules for user")
    void shouldListAllIrrigationForUser() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(irrigationRepository.findAllByFieldFarmUserId(10L)).thenReturn(List.of(testSchedule));

        List<IrrigationResponse> list = irrigationService.getAllIrrigationsForUser("ramesh@example.com");

        assertThat(list).hasSize(1);
    }

    @Test
    @DisplayName("Get owned irrigation schedule by ID")
    void shouldGetOwnedIrrigation() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(irrigationRepository.findByIdAndFieldFarmUserId(4000L, 10L)).thenReturn(Optional.of(testSchedule));

        IrrigationResponse response = irrigationService.getIrrigationById(4000L, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(4000L);
    }

    @Test
    @DisplayName("Delete owned irrigation schedule")
    void shouldDeleteOwnedIrrigation() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(irrigationRepository.findByIdAndFieldFarmUserId(4000L, 10L)).thenReturn(Optional.of(testSchedule));

        irrigationService.deleteIrrigation(4000L, "ramesh@example.com");

        verify(irrigationRepository).delete(testSchedule);
    }
}

