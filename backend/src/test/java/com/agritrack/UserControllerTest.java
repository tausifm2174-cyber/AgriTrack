package com.agritrack;

import com.agritrack.dto.UserResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.UserService;
import com.agritrack.util.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("UserController Protected Endpoint Tests")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    @DisplayName("GET /users/me without token returns HTTP 401 Unauthorized")
    void shouldRejectUnauthenticatedRequest() throws Exception {
        mockMvc.perform(get("/users/me")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /users/me with invalid token returns HTTP 401 Unauthorized")
    void shouldRejectInvalidTokenRequest() throws Exception {
        mockMvc.perform(get("/users/me")
                        .header("Authorization", "Bearer invalid.corrupted.token")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /users/me with valid Bearer token returns HTTP 200 and Profile")
    void shouldReturnProfileWithValidToken() throws Exception {
        User user = new User("Anita Roy", "anita@example.com", "9876543210", "pwd_hash", Role.FARMER);
        user.setId(5L);

        when(userRepository.findByEmail("anita@example.com")).thenReturn(Optional.of(user));

        UserResponse userResponse = new UserResponse(
                5L,
                "Anita Roy",
                "anita@example.com",
                "9876543210",
                Role.FARMER,
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
        when(userService.getCurrentUserProfile("anita@example.com")).thenReturn(userResponse);

        String validToken = jwtUtil.generateToken(user);

        mockMvc.perform(get("/users/me")
                        .header("Authorization", "Bearer " + validToken)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User profile retrieved successfully"))
                .andExpect(jsonPath("$.data.id").value(5))
                .andExpect(jsonPath("$.data.fullName").value("Anita Roy"))
                .andExpect(jsonPath("$.data.email").value("anita@example.com"))
                .andExpect(jsonPath("$.data.role").value("FARMER"))
                .andExpect(jsonPath("$.data.password").doesNotExist())
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist());
    }
}

