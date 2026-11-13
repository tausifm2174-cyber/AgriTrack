package com.agritrack;

import com.agritrack.dto.SaleRequest;
import com.agritrack.dto.SaleResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.SaleService;
import com.agritrack.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("SaleController Tests")
class SaleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private SaleService saleService;

    @MockitoBean
    private UserRepository userRepository;

    private String validToken;

    @BeforeEach
    void setUp() {
        User user = new User("Farmer Joe", "farmer@example.com", "9876543210", "pwd_hash", Role.FARMER);
        user.setId(10L);
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        validToken = jwtUtil.generateToken(user);
    }

    @Test
    @DisplayName("GET /sales without authentication returns HTTP 401")
    void shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/sales"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /harvests/{harvestId}/sales creates sale and returns HTTP 201")
    void shouldCreateSale() throws Exception {
        SaleResponse response = new SaleResponse();
        response.setId(400L);
        response.setHarvestId(100L);
        response.setBuyerName("Agro Trading Co");
        response.setSaleDate(LocalDate.of(2027, 3, 25));
        response.setQuantityKg(new BigDecimal("1000.00"));
        response.setPricePerKg(new BigDecimal("25.00"));
        response.setTotalAmount(new BigDecimal("25000.00"));
        response.setPaymentStatus("PAID");

        when(saleService.createSale(eq(100L), any(SaleRequest.class), eq("farmer@example.com")))
                .thenReturn(response);

        String json = """
                {
                    "buyerName": "Agro Trading Co",
                    "saleDate": "2027-03-25",
                    "quantityKg": 1000.00,
                    "pricePerKg": 25.00
                }
                """;

        mockMvc.perform(post("/harvests/100/sales")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(400L))
                .andExpect(jsonPath("$.data.totalAmount").value(25000.00));
    }

    @Test
    @DisplayName("POST /harvests/{harvestId}/sales with negative quantity returns HTTP 400")
    void shouldReturn400WhenNegativeQuantity() throws Exception {
        String json = """
                {
                    "buyerName": "Agro Trading Co",
                    "saleDate": "2027-03-25",
                    "quantityKg": -10.00,
                    "pricePerKg": 25.00
                }
                """;

        mockMvc.perform(post("/harvests/100/sales")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /sales returns all sales with HTTP 200")
    void shouldReturnAllSales() throws Exception {
        SaleResponse response = new SaleResponse();
        response.setId(400L);
        response.setBuyerName("Agro Trading Co");

        when(saleService.getAllSales("farmer@example.com")).thenReturn(List.of(response));

        mockMvc.perform(get("/sales")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(400L));
    }

    @Test
    @DisplayName("GET /sales/{id} returns sale when found")
    void shouldReturnSaleById() throws Exception {
        SaleResponse response = new SaleResponse();
        response.setId(400L);
        response.setBuyerName("Agro Trading Co");

        when(saleService.getSaleById(400L, "farmer@example.com")).thenReturn(response);

        mockMvc.perform(get("/sales/400")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(400L));
    }

    @Test
    @DisplayName("GET /sales/{id} returns HTTP 404 when unowned or not found")
    void shouldReturn404WhenSaleNotFound() throws Exception {
        when(saleService.getSaleById(999L, "farmer@example.com"))
                .thenThrow(new ResourceNotFoundException("Sale not found with id: 999"));

        mockMvc.perform(get("/sales/999")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("DELETE /sales/{id} returns HTTP 204 on success")
    void shouldDeleteSale() throws Exception {
        doNothing().when(saleService).deleteSale(400L, "farmer@example.com");

        mockMvc.perform(delete("/sales/400")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNoContent());
    }
}
