package com.agritrack;

import com.agritrack.dto.AuthResponse;
import com.agritrack.dto.LoginRequest;
import com.agritrack.dto.RegisterRequest;
import com.agritrack.dto.UserResponse;
import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.EmailAlreadyExistsException;
import com.agritrack.exception.InvalidCredentialsException;
import com.agritrack.exception.UserInactiveException;
import com.agritrack.repository.UserRepository;
import com.agritrack.service.AuthService;
import com.agritrack.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtUtil);
    }

    @Test
    @DisplayName("Should successfully register a new farmer user with hashed password")
    void shouldRegisterNewUserSuccessfully() {
        RegisterRequest request = new RegisterRequest("Suresh Patel", "suresh@example.com", "9876543210", "Password123");

        when(userRepository.existsByEmail("suresh@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("bcrypt_hash_abc");

        User savedUser = new User("Suresh Patel", "suresh@example.com", "9876543210", "bcrypt_hash_abc", Role.FARMER);
        savedUser.setId(1L);
        savedUser.setCreatedAt(LocalDateTime.now());
        savedUser.setUpdatedAt(LocalDateTime.now());

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Suresh Patel", response.getFullName());
        assertEquals("suresh@example.com", response.getEmail());
        assertEquals(Role.FARMER, response.getRole()); // Asserts FARMER role assigned by default
        assertTrue(response.isActive());

        verify(passwordEncoder).encode("Password123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw EmailAlreadyExistsException on duplicate email registration")
    void shouldThrowWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest("Duplicate User", "duplicate@example.com", "9876543210", "Password123");

        when(userRepository.existsByEmail("duplicate@example.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully login with valid credentials")
    void shouldLoginSuccessfully() {
        LoginRequest request = new LoginRequest("suresh@example.com", "Password123");

        User existingUser = new User("Suresh Patel", "suresh@example.com", "9876543210", "bcrypt_hash_abc", Role.FARMER);
        existingUser.setId(1L);

        when(userRepository.findByEmail("suresh@example.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("Password123", "bcrypt_hash_abc")).thenReturn(true);
        when(jwtUtil.generateToken(existingUser)).thenReturn("mock_jwt_token");
        when(jwtUtil.getJwtExpirationMs()).thenReturn(86400000L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getAccessToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(86400000L, response.getExpiresIn());
        assertEquals("suresh@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should throw InvalidCredentialsException on invalid password")
    void shouldThrowOnInvalidPassword() {
        LoginRequest request = new LoginRequest("suresh@example.com", "WrongPassword");

        User existingUser = new User("Suresh Patel", "suresh@example.com", "9876543210", "bcrypt_hash_abc", Role.FARMER);

        when(userRepository.findByEmail("suresh@example.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("WrongPassword", "bcrypt_hash_abc")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    @DisplayName("Should throw InvalidCredentialsException on non-existent email")
    void shouldThrowOnUnknownEmail() {
        LoginRequest request = new LoginRequest("unknown@example.com", "Password123");

        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    @DisplayName("Should throw UserInactiveException when account is deactivated")
    void shouldThrowWhenUserIsInactive() {
        LoginRequest request = new LoginRequest("inactive@example.com", "Password123");

        User inactiveUser = new User("Inactive Farmer", "inactive@example.com", "9876543210", "bcrypt_hash_abc", Role.FARMER);
        inactiveUser.setActive(false);

        when(userRepository.findByEmail("inactive@example.com")).thenReturn(Optional.of(inactiveUser));
        when(passwordEncoder.matches("Password123", "bcrypt_hash_abc")).thenReturn(true);

        assertThrows(UserInactiveException.class, () -> authService.login(request));
        verify(jwtUtil, never()).generateToken(any());
    }
}

