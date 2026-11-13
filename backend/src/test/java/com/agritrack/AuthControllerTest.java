package com.agritrack;

import com.agritrack.dto.AuthResponse;
import com.agritrack.dto.UserResponse;
import com.agritrack.entity.Role;
import com.agritrack.exception.EmailAlreadyExistsException;
import com.agritrack.exception.InvalidCredentialsException;
import com.agritrack.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("AuthController Integration Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @Test
    @DisplayName("POST /auth/register with valid payload returns HTTP 201 and UserResponse")
    void shouldRegisterUserSuccessfully() throws Exception {
        UserResponse response = new UserResponse(
                1L,
                "Kavita Sharma",
                "kavita@example.com",
                "9876543210",
                Role.FARMER,
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        when(authService.register(any())).thenReturn(response);

        String payload = """
                {
                  "fullName": "Kavita Sharma",
                  "email": "kavita@example.com",
                  "phone": "9876543210",
                  "password": "Password123"
                }
                """;

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.fullName").value("Kavita Sharma"))
                .andExpect(jsonPath("$.data.email").value("kavita@example.com"))
                .andExpect(jsonPath("$.data.role").value("FARMER"))
                .andExpect(jsonPath("$.data.password").doesNotExist())
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("POST /auth/register with invalid email returns HTTP 400")
    void shouldRejectInvalidEmailOnRegistration() throws Exception {
        String invalidPayload = """
                {
                  "fullName": "Invalid User",
                  "email": "not-an-email",
                  "password": "Password123"
                }
                """;

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed for input data"));
    }

    @Test
    @DisplayName("POST /auth/register with short password returns HTTP 400")
    void shouldRejectShortPasswordOnRegistration() throws Exception {
        String invalidPayload = """
                {
                  "fullName": "Short Pwd",
                  "email": "short@example.com",
                  "password": "123"
                }
                """;

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /auth/register with duplicate email returns HTTP 409")
    void shouldReturnConflictOnDuplicateEmail() throws Exception {
        when(authService.register(any())).thenThrow(new EmailAlreadyExistsException("Email is already registered: dup@example.com"));

        String payload = """
                {
                  "fullName": "Duplicate User",
                  "email": "dup@example.com",
                  "password": "Password123"
                }
                """;

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email is already registered: dup@example.com"));
    }

    @Test
    @DisplayName("POST /auth/login with valid credentials returns HTTP 200 and JWT")
    void shouldLoginSuccessfully() throws Exception {
        UserResponse user = new UserResponse(1L, "Kavita Sharma", "kavita@example.com", "9876543210", Role.FARMER, true, LocalDateTime.now(), LocalDateTime.now());
        AuthResponse authResponse = new AuthResponse("mock_access_token", "Bearer", 86400000L, user);

        when(authService.login(any())).thenReturn(authResponse);

        String payload = """
                {
                  "email": "kavita@example.com",
                  "password": "Password123"
                }
                """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.accessToken").value("mock_access_token"))
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.data.user.email").value("kavita@example.com"));
    }

    @Test
    @DisplayName("POST /auth/login with invalid credentials returns HTTP 401")
    void shouldRejectInvalidCredentials() throws Exception {
        when(authService.login(any())).thenThrow(new InvalidCredentialsException("Invalid email or password"));

        String payload = """
                {
                  "email": "wrong@example.com",
                  "password": "WrongPassword"
                }
                """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
}

