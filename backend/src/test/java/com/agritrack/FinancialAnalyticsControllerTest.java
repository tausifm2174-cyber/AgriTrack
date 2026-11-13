package com.agritrack;

import com.agritrack.dto.*;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.FinancialAnalyticsService;
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
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("FinancialAnalyticsController Tests")
class FinancialAnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private FinancialAnalyticsService analyticsService;

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
    @DisplayName("GET /financials/profit-loss returns 200 OK with P&L summary")
    void shouldGetProfitLossSummary() throws Exception {
        ProfitLossSummaryResponse response = new ProfitLossSummaryResponse(
                new BigDecimal("150000.00"),
                new BigDecimal("90000.00"),
                new BigDecimal("60000.00"),
                new BigDecimal("40.00"),
                List.of(new CropFinancialSummary(900L, "Wheat", "HD-2967", "Rabi",
                        new BigDecimal("150000.00"), new BigDecimal("90000.00"), new BigDecimal("60000.00"),
                        new BigDecimal("40.00"), new BigDecimal("5000.00"), new BigDecimal("1800.00"))),
                List.of(new FarmFinancialSummary(100L, "Green Valley Farm",
                        new BigDecimal("150000.00"), new BigDecimal("90000.00"), new BigDecimal("60000.00"), new BigDecimal("40.00"))),
                List.of(new ExpenseCategorySummary("Seeds", new BigDecimal("30000.00"), new BigDecimal("33.33"))),
                List.of(new MonthlyFinancialSummary(2026, 11, "2026-11",
                        new BigDecimal("150000.00"), new BigDecimal("90000.00"), new BigDecimal("60000.00")))
        );

        when(analyticsService.getProfitLossSummary(any(), any(), any(), any(), eq("farmer@example.com")))
                .thenReturn(response);

        mockMvc.perform(get("/financials/profit-loss")
                        .header("Authorization", "Bearer " + validToken)
                        .param("farmId", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalRevenue").value(150000.00))
                .andExpect(jsonPath("$.data.totalExpenses").value(90000.00))
                .andExpect(jsonPath("$.data.netProfit").value(60000.00))
                .andExpect(jsonPath("$.data.profitMarginPercent").value(40.00))
                .andExpect(jsonPath("$.data.cropSummaries[0].cropName").value("Wheat"))
                .andExpect(jsonPath("$.data.cropSummaries[0].costPerQuintal").value(1800.00));
    }

    @Test
    @DisplayName("GET /financials/monthly-trend returns 200 OK with monthly trend list")
    void shouldGetMonthlyTrend() throws Exception {
        MonthlyFinancialSummary trend = new MonthlyFinancialSummary(
                2026, 11, "2026-11",
                new BigDecimal("150000.00"), new BigDecimal("90000.00"), new BigDecimal("60000.00")
        );
        when(analyticsService.getMonthlyTrend(any(), any(), any(), any(), eq("farmer@example.com")))
                .thenReturn(List.of(trend));

        mockMvc.perform(get("/financials/monthly-trend")
                        .header("Authorization", "Bearer " + validToken)
                        .param("year", "2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].monthLabel").value("2026-11"))
                .andExpect(jsonPath("$.data[0].netProfit").value(60000.00));
    }

    @Test
    @DisplayName("GET /financials/profit-loss without token returns 401 Unauthorized")
    void shouldReturn401WithoutAuth() throws Exception {
        mockMvc.perform(get("/financials/profit-loss"))
                .andExpect(status().isUnauthorized());
    }
}
