package com.agritrack;

import com.agritrack.dto.ExpenseCategorySummary;
import com.agritrack.dto.ExpenseRequest;
import com.agritrack.dto.ExpenseResponse;
import com.agritrack.dto.ExpenseSummaryResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.ExpenseService;
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
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("ExpenseController Tests")
class ExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private ExpenseService expenseService;

    @MockitoBean
    private UserRepository userRepository;

    private String validToken;
    private ExpenseResponse sampleResponse;

    @BeforeEach
    void setUp() {
        User user = new User("Farmer Joe", "farmer@example.com", "9876543210", "pwd_hash", Role.FARMER);
        user.setId(10L);
        when(userRepository.findByEmail("farmer@example.com")).thenReturn(Optional.of(user));
        validToken = jwtUtil.generateToken(user);

        sampleResponse = new ExpenseResponse();
        sampleResponse.setId(1L);
        sampleResponse.setFarmId(100L);
        sampleResponse.setFarmName("Green Valley Farm");
        sampleResponse.setFieldId(500L);
        sampleResponse.setFieldName("North Field");
        sampleResponse.setCategory("Seeds");
        sampleResponse.setDescription("Certified wheat seed");
        sampleResponse.setAmount(new BigDecimal("5400.00"));
        sampleResponse.setExpenseDate(LocalDate.of(2026, 11, 2));
        sampleResponse.setPaymentMethod("UPI");
        sampleResponse.setPaymentStatus("PAID");
    }

    @Test
    @DisplayName("POST /expenses creates expense with 201 Created")
    void shouldCreateExpense() throws Exception {
        when(expenseService.createExpense(any(ExpenseRequest.class), eq("farmer@example.com")))
                .thenReturn(sampleResponse);

        String json = """
            {
                "farmId": 100,
                "fieldId": 500,
                "category": "Seeds",
                "description": "Certified wheat seed",
                "amount": 5400.00,
                "expenseDate": "2026-11-02",
                "paymentMethod": "UPI",
                "paymentStatus": "PAID"
            }
            """;

        mockMvc.perform(post("/expenses")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.category").value("Seeds"))
                .andExpect(jsonPath("$.data.amount").value(5400.00));
    }

    @Test
    @DisplayName("GET /expenses returns 200 with list of expenses")
    void shouldGetExpenses() throws Exception {
        when(expenseService.getFilteredExpenses(any(), any(), any(), any(), any(), any(), any(), eq("farmer@example.com")))
                .thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/expenses")
                        .header("Authorization", "Bearer " + validToken)
                        .param("category", "Seeds"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(1));
    }

    @Test
    @DisplayName("GET /expenses/{id} returns 200 with expense details")
    void shouldGetExpenseById() throws Exception {
        when(expenseService.getExpenseById(1L, "farmer@example.com")).thenReturn(sampleResponse);

        mockMvc.perform(get("/expenses/1")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("GET /expenses/{id} returns 404 when resource not found")
    void shouldReturn404WhenNotFound() throws Exception {
        when(expenseService.getExpenseById(999L, "farmer@example.com"))
                .thenThrow(new ResourceNotFoundException("Expense not found with id: 999"));

        mockMvc.perform(get("/expenses/999")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /expenses without token returns 401 Unauthorized")
    void shouldReturn401WithoutAuth() throws Exception {
        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /expenses with invalid body returns 400 Bad Request")
    void shouldReturn400OnInvalidBody() throws Exception {
        String invalidJson = """
            {
                "farmId": null,
                "amount": -50.00
            }
            """;

        mockMvc.perform(post("/expenses")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("PUT /expenses/{id} updates expense with 200 OK")
    void shouldUpdateExpense() throws Exception {
        when(expenseService.updateExpense(eq(1L), any(ExpenseRequest.class), eq("farmer@example.com")))
                .thenReturn(sampleResponse);

        String json = """
            {
                "farmId": 100,
                "category": "Seeds",
                "description": "Updated seeds",
                "amount": 5400.00,
                "expenseDate": "2026-11-02"
            }
            """;

        mockMvc.perform(put("/expenses/1")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("DELETE /expenses/{id} removes expense with 200 OK")
    void shouldDeleteExpense() throws Exception {
        doNothing().when(expenseService).deleteExpense(1L, "farmer@example.com");

        mockMvc.perform(delete("/expenses/1")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("GET /expenses/summary returns aggregate summary with 200 OK")
    void shouldGetExpenseSummary() throws Exception {
        ExpenseSummaryResponse summary = new ExpenseSummaryResponse(
                new BigDecimal("5400.00"), 1L,
                List.of(new ExpenseCategorySummary("Seeds", new BigDecimal("5400.00"), new BigDecimal("100.00"))),
                Map.of("PAID", new BigDecimal("5400.00"))
        );
        when(expenseService.getExpenseSummary(any(), any(), any(), any(), eq("farmer@example.com")))
                .thenReturn(summary);

        mockMvc.perform(get("/expenses/summary")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalExpenseAmount").value(5400.00))
                .andExpect(jsonPath("$.data.totalExpenseCount").value(1));
    }
}
