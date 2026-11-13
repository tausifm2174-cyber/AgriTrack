package com.agritrack.service;

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
import com.agritrack.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service managing user registration and authentication workflows.
 */
@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Registers a new user account with default FARMER role and hashed password.
     *
     * @param request The registration details.
     * @return UserResponse representing the registered user.
     */
    @Transactional
    public UserResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            logger.warn("Registration rejected: duplicate email {}", normalizedEmail);
            throw new EmailAlreadyExistsException("Email is already registered: " + normalizedEmail);
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());

        // Default role is always FARMER for public registration
        User user = new User(
                request.getFullName().trim(),
                normalizedEmail,
                request.getPhone() != null ? request.getPhone().trim() : null,
                passwordHash,
                Role.FARMER
        );

        User savedUser = userRepository.save(user);
        logger.info("Successfully registered new user with ID: {} and role: {}", savedUser.getId(), savedUser.getRole());

        return UserResponse.fromEntity(savedUser);
    }

    /**
     * Authenticates an existing user and returns a signed JWT access token.
     *
     * @param request Login credentials (email & password).
     * @return AuthResponse containing token and user details.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> {
                    logger.warn("Login failed: email not found {}", normalizedEmail);
                    return new InvalidCredentialsException("Invalid email or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            logger.warn("Login failed: password mismatch for user {}", normalizedEmail);
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            logger.warn("Login rejected: user account is deactivated {}", normalizedEmail);
            throw new UserInactiveException("User account is inactive. Please contact the administrator.");
        }

        String token = jwtUtil.generateToken(user);
        logger.info("User {} successfully authenticated", normalizedEmail);

        return new AuthResponse(
                token,
                "Bearer",
                jwtUtil.getJwtExpirationMs(),
                UserResponse.fromEntity(user)
        );
    }
}

