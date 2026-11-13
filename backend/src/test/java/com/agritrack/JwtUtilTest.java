package com.agritrack;

import com.agritrack.entity.Role;
import com.agritrack.entity.User;
import com.agritrack.exception.JwtAuthenticationException;
import com.agritrack.util.JwtUtil;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("JwtUtil Unit Tests")
class JwtUtilTest {

    private JwtUtil jwtUtil;
    private User testUser;
    private final String secret = "TestSecretKeyForAgriTrackJwtUnitTestsMustBeAtLeast32BytesLong!";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        jwtUtil.setSigningKeyForTest(key, 3600000); // 1 hour

        testUser = new User("Ramesh Kumar", "ramesh@example.com", "9876543210", "hashed_pwd", Role.FARMER);
        testUser.setId(101L);
    }

    @Test
    @DisplayName("Should generate valid token with correct claims")
    void shouldGenerateValidToken() {
        String token = jwtUtil.generateToken(testUser);

        assertNotNull(token);
        assertTrue(token.length() > 20);
        assertTrue(jwtUtil.validateToken(token));
        assertEquals("ramesh@example.com", jwtUtil.extractEmail(token));
        assertEquals("FARMER", jwtUtil.extractRole(token));
        assertEquals(101L, jwtUtil.extractUserId(token));
    }

    @Test
    @DisplayName("Should reject tampered or invalid token")
    void shouldRejectInvalidToken() {
        String token = jwtUtil.generateToken(testUser);
        String tamperedToken = token + "corrupted";

        assertThrows(JwtAuthenticationException.class, () -> jwtUtil.validateToken(tamperedToken));
    }

    @Test
    @DisplayName("Should reject expired token")
    void shouldRejectExpiredToken() {
        // Setup JwtUtil with negative expiration time to create expired token
        JwtUtil expiredJwtUtil = new JwtUtil();
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        expiredJwtUtil.setSigningKeyForTest(key, -1000); // Already expired

        String expiredToken = expiredJwtUtil.generateToken(testUser);

        assertThrows(JwtAuthenticationException.class, () -> jwtUtil.validateToken(expiredToken));
    }

    @Test
    @DisplayName("Should reject null or empty token")
    void shouldRejectNullOrEmptyToken() {
        assertThrows(JwtAuthenticationException.class, () -> jwtUtil.validateToken(""));
    }
}

