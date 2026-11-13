package com.agritrack;

import com.agritrack.dto.FieldRequest;
import com.agritrack.dto.FieldResponse;
import com.agritrack.entity.Farm;
import com.agritrack.entity.Field;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.FarmRepository;
import com.agritrack.repository.FieldRepository;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.FieldService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("FieldService Unit Tests")
class FieldServiceTest {

    @Mock
    private FieldRepository fieldRepository;

    @Mock
    private FarmRepository farmRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FieldService fieldService;

    private User testUser;
    private Farm testFarm;
    private Field testField;

    @BeforeEach
    void setUp() {
        testUser = new User("Ramesh Kumar", "ramesh@example.com", "9876543210", "hashed", Role.FARMER);
        testUser.setId(10L);

        testFarm = new Farm(testUser, "Green Valley Farm", "Karnal, Haryana", new BigDecimal("45.50"), "Acres", "Main fertile plot", "Active");
        testFarm.setId(100L);

        testField = new Field(testFarm, "North Field - Sector A", new BigDecimal("12.50"), "Acres", "Alluvial Soil", "Drip", "Active", "Vegetative phase");
        testField.setId(500L);
    }

    @Test
    @DisplayName("createField successfully creates field under user's farm")
    void shouldCreateFieldUnderFarm() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(100L, 10L)).thenReturn(Optional.of(testFarm));
        when(fieldRepository.save(any(Field.class))).thenReturn(testField);

        FieldRequest request = new FieldRequest("North Field - Sector A", new BigDecimal("12.50"), "Acres", "Alluvial Soil", "Drip", "Active", "Vegetative phase");
        FieldResponse response = fieldService.createField(100L, request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(500L);
        assertThat(response.getFieldName()).isEqualTo("North Field - Sector A");
        assertThat(response.getFarmId()).isEqualTo(100L);
        verify(fieldRepository, times(1)).save(any(Field.class));
    }

    @Test
    @DisplayName("createField throws ResourceNotFoundException if farm does not belong to user")
    void shouldThrowIfFarmNotOwned() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(999L, 10L)).thenReturn(Optional.empty());

        FieldRequest request = new FieldRequest("Sector B", new BigDecimal("5.00"), "Acres", null, null, null, null);
        assertThatThrownBy(() -> fieldService.createField(999L, request, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Farm not found with id: 999");
    }

    @Test
    @DisplayName("getFieldsByFarm returns fields when farm is owned by user")
    void shouldGetFieldsByFarm() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.existsByIdAndUserId(100L, 10L)).thenReturn(true);
        when(fieldRepository.findAllByFarmIdAndFarmUserId(100L, 10L)).thenReturn(List.of(testField));

        List<FieldResponse> fields = fieldService.getFieldsByFarm(100L, "ramesh@example.com");

        assertThat(fields).hasSize(1);
        assertThat(fields.getFirst().getFieldName()).isEqualTo("North Field - Sector A");
    }

    @Test
    @DisplayName("getFieldById returns field when owned by user")
    void shouldGetFieldById() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));

        FieldResponse response = fieldService.getFieldById(500L, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(500L);
    }

    @Test
    @DisplayName("deleteField deletes field when owned by user")
    void shouldDeleteField() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(fieldRepository.findByIdAndFarmUserId(500L, 10L)).thenReturn(Optional.of(testField));

        fieldService.deleteField(500L, "ramesh@example.com");

        verify(fieldRepository, times(1)).delete(testField);
    }
}

