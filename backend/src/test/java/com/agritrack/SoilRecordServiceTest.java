package com.agritrack;

import com.agritrack.dto.SoilRecordRequest;
import com.agritrack.dto.SoilRecordResponse;
import com.agritrack.entity.*;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.FieldRepository;
import com.agritrack.repository.SoilRecordRepository;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.SoilRecordService;
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
@DisplayName("SoilRecordService Unit Tests")
class SoilRecordServiceTest {

    @Mock
    private SoilRecordRepository soilRecordRepository;

    @Mock
    private FieldRepository fieldRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SoilRecordService soilRecordService;

    private User testUser;
    private Farm testFarm;
    private Field testField;
    private SoilRecord testRecord;

    @BeforeEach
    void setUp() {
        testUser = new User("Ramesh Kumar", "ramesh@example.com", "9876543210", "hashed", Role.FARMER);
        testUser.setId(10L);

        testFarm = new Farm(testUser, "Green Valley Farm", "Karnal, Haryana", new BigDecimal("45.50"), "Acres", "Main fertile plot", "Active");
        testFarm.setId(100L);

        testField = new Field(testFarm, "North Field - Sector A", new BigDecimal("12.50"), "Acres", "Alluvial Soil", "Drip", "Active", "Vegetative phase");
        testField.setId(500L);

        testRecord = new SoilRecord(testField, "Alluvial Loam", new BigDecimal("6.80"), new BigDecimal("285.00"), new BigDecimal("22.00"), new BigDecimal("290.00"), new BigDecimal("0.72"), new BigDecimal("42.00"), LocalDate.of(2026, 3, 28), "Optimal profile");
        testRecord.setId(1000L);
    }

    @Test
    @DisplayName("createSoilRecord successfully saves soil record under field")
    void shouldCreateSoilRecord() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));
        when(soilRecordRepository.save(any(SoilRecord.class))).thenReturn(testRecord);

        SoilRecordRequest request = new SoilRecordRequest("Alluvial Loam", new BigDecimal("6.80"), new BigDecimal("285.00"), new BigDecimal("22.00"), new BigDecimal("290.00"), new BigDecimal("0.72"), new BigDecimal("42.00"), LocalDate.of(2026, 3, 28), "Optimal profile");
        SoilRecordResponse response = soilRecordService.createSoilRecord(500L, request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1000L);
        assertThat(response.getFieldId()).isEqualTo(500L);
        assertThat(response.getPh()).isEqualTo(new BigDecimal("6.80"));
        verify(soilRecordRepository, times(1)).save(any(SoilRecord.class));
    }

    @Test
    @DisplayName("getSoilRecordsByField returns list of soil records")
    void shouldGetSoilRecordsByField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.existsByIdAndFarmUserId(500L, 10L)).thenReturn(true);
        when(soilRecordRepository.findAllByFieldIdAndFieldFarmUserId(500L, 10L)).thenReturn(List.of(testRecord));

        List<SoilRecordResponse> records = soilRecordService.getSoilRecordsByField(500L, "ramesh@example.com");

        assertThat(records).hasSize(1);
        assertThat(records.getFirst().getSoilType()).isEqualTo("Alluvial Loam");
    }

    @Test
    @DisplayName("getSoilRecordById throws ResourceNotFoundException if record not found or not owned")
    void shouldThrowWhenRecordNotFoundOrNotOwned() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(soilRecordRepository.findByIdAndFieldFarmUserId(999L, 10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> soilRecordService.getSoilRecordById(999L, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Soil record not found with id: 999");
    }

    @Test
    @DisplayName("deleteSoilRecord removes soil record when owned")
    void shouldDeleteSoilRecord() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(soilRecordRepository.findByIdAndFieldFarmUserId(1000L, 10L)).thenReturn(Optional.of(testRecord));

        soilRecordService.deleteSoilRecord(1000L, "ramesh@example.com");

        verify(soilRecordRepository, times(1)).delete(testRecord);
    }
}

