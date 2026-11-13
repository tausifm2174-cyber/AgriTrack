package com.agritrack;

import com.agritrack.dto.FarmRequest;
import com.agritrack.dto.FarmResponse;
import com.agritrack.entity.Farm;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.FarmRepository;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.FarmService;
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
@DisplayName("FarmService Unit Tests")
class FarmServiceTest {

    @Mock
    private FarmRepository farmRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FarmService farmService;

    private User testUser;
    private Farm testFarm;

    @BeforeEach
    void setUp() {
        testUser = new User("Ramesh Kumar", "ramesh@example.com", "9876543210", "hashed", Role.FARMER);
        testUser.setId(10L);

        testFarm = new Farm(testUser, "Green Valley Farm", "Karnal, Haryana", new BigDecimal("45.50"), "Acres", "Main fertile plot", "Active");
        testFarm.setId(100L);
    }

    @Test
    @DisplayName("createFarm creates and returns FarmResponse for authenticated user")
    void shouldCreateFarm() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.save(any(Farm.class))).thenReturn(testFarm);

        FarmRequest request = new FarmRequest("Green Valley Farm", "Karnal, Haryana", new BigDecimal("45.50"), "Acres", "Main fertile plot", "Active");
        FarmResponse response = farmService.createFarm(request, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(100L);
        assertThat(response.getFarmName()).isEqualTo("Green Valley Farm");
        assertThat(response.getUserId()).isEqualTo(10L);
        verify(farmRepository, times(1)).save(any(Farm.class));
    }

    @Test
    @DisplayName("getAllFarmsForUser returns all farms owned by user")
    void shouldGetAllFarmsForUser() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findAllByUserId(10L)).thenReturn(List.of(testFarm));

        List<FarmResponse> farms = farmService.getAllFarmsForUser("ramesh@example.com");

        assertThat(farms).hasSize(1);
        assertThat(farms.getFirst().getFarmName()).isEqualTo("Green Valley Farm");
    }

    @Test
    @DisplayName("getFarmById returns FarmResponse when farm belongs to user")
    void shouldGetFarmById() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(100L, 10L)).thenReturn(Optional.of(testFarm));

        FarmResponse response = farmService.getFarmById(100L, "ramesh@example.com");

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("getFarmById throws ResourceNotFoundException when farm belongs to another user")
    void shouldThrowWhenFarmBelongsToOtherUser() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(999L, 10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> farmService.getFarmById(999L, "ramesh@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Farm not found with id: 999");
    }

    @Test
    @DisplayName("updateFarm successfully modifies existing farm")
    void shouldUpdateFarm() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(100L, 10L)).thenReturn(Optional.of(testFarm));
        when(farmRepository.save(any(Farm.class))).thenReturn(testFarm);

        FarmRequest updateRequest = new FarmRequest("Updated Green Valley", "Rohtak, Haryana", new BigDecimal("50.00"), "Acres", "Expanded", "Active");
        FarmResponse response = farmService.updateFarm(100L, updateRequest, "ramesh@example.com");

        assertThat(response).isNotNull();
        verify(farmRepository).save(testFarm);
    }

    @Test
    @DisplayName("deleteFarm deletes farm when owned by user")
    void shouldDeleteFarm() {
        when(userRepository.findByEmail("ramesh@example.com")).thenReturn(Optional.of(testUser));
        when(farmRepository.findByIdAndUserId(100L, 10L)).thenReturn(Optional.of(testFarm));

        farmService.deleteFarm(100L, "ramesh@example.com");

        verify(farmRepository, times(1)).delete(testFarm);
    }
}

