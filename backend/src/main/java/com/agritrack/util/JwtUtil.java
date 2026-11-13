package com.agritrack.util;

import com.agritrack.entity.User;
import com.agritrack.exception.JwtAuthenticationException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

/**
 * Utility class for generating, signing, and validating JSON Web Tokens (JWT).
 * Uses HMAC-SHA256 with JJWT 0.12+ APIs.
 */
@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    // Minimum 256-bit default development secret key (for local development/testing only)
    private static final String DEFAULT_DEV_SECRET = "AgriTrackSecureDefaultJwtSecretKeyForLocalDevelopmentAndTesting2026!";

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}") // Default: 24 hours (86,400,000 ms)
    private long jwtExpirationMs;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        String secretToUse;
        if (jwtSecret != null && !jwtSecret.trim().isEmpty()) {
            secretToUse = jwtSecret.trim();
        } else {
            logger.warn("No JWT_SECRET provided via configuration. Using fallback development key. Do NOT use in production!");
            secretToUse = DEFAULT_DEV_SECRET;
        }

        byte[] keyBytes = secretToUse.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            // Pad if short for safety
            secretToUse = (secretToUse + DEFAULT_DEV_SECRET).substring(0, 32);
            keyBytes = secretToUse.getBytes(StandardCharsets.UTF_8);
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generates a signed JWT token for the given authenticated user.
     *
     * @param user The user entity.
     * @return Compact serialized JWT string.
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .claim("fullName", user.getFullName())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Extracts the email address (subject) from a JWT token.
     *
     * @param token The JWT token.
     * @return Email address.
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the role claim from a JWT token.
     *
     * @param token The JWT token.
     * @return Role name as String.
     */
    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    /**
     * Extracts the user ID claim from a JWT token.
     *
     * @param token The JWT token.
     * @return User ID as Long.
     */
    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        Object idVal = claims.get("userId");
        if (idVal instanceof Number) {
            return ((Number) idVal).longValue();
        }
        return null;
    }

    /**
     * Generic claim extractor helper.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Validates token format, signature, and expiration date.
     *
     * @param token The JWT token string.
     * @return true if valid, throws JwtAuthenticationException otherwise.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            logger.warn("Expired JWT token: {}", e.getMessage());
            throw new JwtAuthenticationException("JWT token has expired", e);
        } catch (JwtException | IllegalArgumentException e) {
            logger.warn("Invalid JWT token: {}", e.getMessage());
            throw new JwtAuthenticationException("Invalid or malformed JWT token: " + e.getMessage(), e);
        }
    }

    /**
     * Extracts all claims from a signed JWT token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getJwtExpirationMs() {
        return jwtExpirationMs;
    }

    // Setter for testing purposes
    public void setSigningKeyForTest(SecretKey key, long expirationMs) {
        this.signingKey = key;
        this.jwtExpirationMs = expirationMs;
    }
}
