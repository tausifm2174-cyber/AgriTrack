package com.agritrack;

import com.agritrack.dto.ActivityRequest;
import com.agritrack.dto.ActivityResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.ActivityRepository;
import com.agritrack.repository.CropCycleRepository;
import com.agritrack.repository.FieldRepository;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.ActivityService;
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
@DisplayName("ActivityService Unit Tests")
class ActivityServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private FieldRepository fieldRepository;

    @Mock
    private CropCycleRepository cropCycleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ActivityService activityService;

    private User testUser;
    private Farm testFarm;
    private Field testField;
    private Field otherField;
    private CropCycle testCycle;
    private Activity testActivity;

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

        testActivity = new Activity(testField, testCycle, "Fertilizing", "Organic NPK Top-Dressing", "Planned", "Medium", LocalDate.of(2026, 11, 20), "07:00 AM", new BigDecimal("2.5"), "Operator Joe", new BigDecimal("50.0"), "kg", "Description", "Notes");
        testActivity.setId(3000L);
    }

    @Test
    @DisplayName("Create activity under owned field without crop cycle succeeds")
    void shouldCreateActivityWithoutCropCycle() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));
        when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

        ActivityRequest request = new ActivityRequest("Organic NPK Top-Dressing", "Fertilizing", "Planned", "Medium", LocalDate.of(2026, 11, 20), "07:00 AM", new BigDecimal("2.5"), "Operator Joe", new BigDecimal("50.0"), "kg", "Description", "Notes", null);

        ActivityResponse response = activityService.createActivity(500L, request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(3000L);
        assertThat(response.getTitle()).isEqualTo("Organic NPK Top-Dressing");
        verify(activityRepository).save(any(Activity.class));
    }

    @Test
    @DisplayName("Create activity with valid owned crop cycle association succeeds")
    void shouldCreateActivityWithValidCropCycle() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(2000L, 10L)).thenReturn(Optional.of(testCycle));
        when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

        ActivityRequest request = new ActivityRequest("Organic NPK Top-Dressing", "Fertilizing", "Planned", "Medium", LocalDate.of(2026, 11, 20), "07:00 AM", new BigDecimal("2.5"), "Operator Joe", new BigDecimal("50.0"), "kg", "Description", "Notes", 2000L);

        ActivityResponse response = activityService.createActivity(500L, request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getCropCycleId()).isEqualTo(2000L);
    }

    @Test
    @DisplayName("Reject activity creation under unowned field (404)")
    void shouldRejectActivityUnderUnownedField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(999L, 10L)).thenReturn(Optional.empty());

        ActivityRequest request = new ActivityRequest("Weeding", "Weeding", "Planned", "Medium", LocalDate.of(2026, 11, 20), null, null, null, null, null, null, null, null);

        assertThatThrownBy(() -> activityService.createActivity(999L, request, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Field not found with id: 999");
    }

    @Test
    @DisplayName("Reject activity when crop cycle belongs to another field")
    void shouldRejectWhenCropCycleBelongsToDifferentField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(600L, 10L)).thenReturn(Optional.of(otherField));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(2000L, 10L)).thenReturn(Optional.of(testCycle)); // testCycle is on field 500L

        ActivityRequest request = new ActivityRequest("Weeding", "Weeding", "Planned", "Medium", LocalDate.of(2026, 11, 20), null, null, null, null, null, null, null, 2000L);

        assertThatThrownBy(() -> activityService.createActivity(600L, request, "ramesh@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not belong to field 600");
    }

    @Test
    @DisplayName("Reject activity when crop cycle is not found or not owned")
    void shouldRejectWhenCropCycleNotOwned() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));
        when(cropCycleRepository.findByIdAndFieldFarmUserId(9999L, 10L)).thenReturn(Optional.empty());

        ActivityRequest request = new ActivityRequest("Weeding", "Weeding", "Planned", "Medium", LocalDate.of(2026, 11, 20), null, null, null, null, null, null, null, 9999L);

        assertThatThrownBy(() -> activityService.createActivity(500L, request, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Crop cycle not found with id: 9999");
    }

    @Test
    @DisplayName("List activities for owned field")
    void shouldListActivitiesForField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.existsByIdAndFarmUserId(500L, 10L)).thenReturn(true);
        when(activityRepository.findAllByFieldIdAndFieldFarmUserId(500L, 10L)).thenReturn(List.of(testActivity));

        List<ActivityResponse> list = activityService.getActivitiesByField(500L, "ramesh@example.com");

        assertThat(list).hasSize(1);
        assertThat(list.getFirst().getTitle()).isEqualTo("Organic NPK Top-Dressing");
    }

    @Test
    @DisplayName("Reject listing activities for unowned field")
    void shouldRejectListingUnownedField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.existsByIdAndFarmUserId(999L, 10L)).thenReturn(false);

        assertThatThrownBy(() -> activityService.getActivitiesByField(999L, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Field not found with id: 999");
    }

    @Test
    @DisplayName("List all activities for user")
    void shouldListAllActivitiesForUser() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(activityRepository.findAllByFieldFarmUserId(10L)).thenReturn(List.of(testActivity));

        List<ActivityResponse> list = activityService.getAllActivitiesForUser("ramesh@example.com");

        assertThat(list).hasSize(1);
    }

    @Test
    @DisplayName("Get owned activity by ID")
    void shouldGetOwnedActivity() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(activityRepository.findByIdAndFieldFarmUserId(3000L, 10L)).thenReturn(Optional.of(testActivity));

        ActivityResponse response = activityService.getActivityById(3000L, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(3000L);
    }

    @Test
    @DisplayName("Reject retrieval of unowned activity (404)")
    void shouldRejectRetrievalOfUnownedActivity() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(activityRepository.findByIdAndFieldFarmUserId(999L, 10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> activityService.getActivityById(999L, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Activity not found with id: 999");
    }

    @Test
    @DisplayName("Update owned activity")
    void shouldUpdateOwnedActivity() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(activityRepository.findByIdAndFieldFarmUserId(3000L, 10L)).thenReturn(Optional.of(testActivity));
        when(activityRepository.save(any(Activity.class))).thenReturn(testActivity);

        ActivityRequest request = new ActivityRequest("Updated Title", "Weeding", "Completed", "High", LocalDate.of(2026, 11, 21), "09:00 AM", new BigDecimal("3.0"), "Operator Bob", null, null, null, null, null);

        ActivityResponse response = activityService.updateActivity(3000L, request, "ramesh@example.com");

        assertThat(response).isNotNull();
        verify(activityRepository).save(testActivity);
    }

    @Test
    @DisplayName("Delete owned activity")
    void shouldDeleteOwnedActivity() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(activityRepository.findByIdAndFieldFarmUserId(3000L, 10L)).thenReturn(Optional.of(testActivity));

        activityService.deleteActivity(3000L, "ramesh@example.com");

        verify(activityRepository).delete(testActivity);
    }
}

