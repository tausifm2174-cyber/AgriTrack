package com.agritrack.config;

import com.agritrack.entity.User;
import com.agritrack.exception.JwtAuthenticationException;
import com.agritrack.repository.UserRepository;
import com.agritrack.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

/**
 * Filter that intercepts incoming HTTP requests, extracts the JWT Bearer token,
 * verifies its signature and claims, and establishes the Spring Security authentication context.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = resolveToken(request);

        if (StringUtils.hasText(token)) {
            try {
                if (jwtUtil.validateToken(token)) {
                    String email = jwtUtil.extractEmail(token);

                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        Optional<User> userOptional = userRepository.findByEmail(email);

                        if (userOptional.isPresent()) {
                            User user = userOptional.get();

                            if (user.isActive()) {
                                UsernamePasswordAuthenticationToken authentication =
                                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                                SecurityContextHolder.getContext().setAuthentication(authentication);
                            } else {
                                logger.warn("Authentication failed: User account is deactivated: {}", email);
                            }
                        } else {
                            logger.warn("User from valid JWT not found in database: {}", email);
                        }
                    }
                }
            } catch (JwtAuthenticationException ex) {
                logger.warn("JWT authentication failed for URI {}: {}", request.getRequestURI(), ex.getMessage());
                // Do not throw; let unauthenticated request proceed to authentication entry point if protected
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extracts Bearer token from the HTTP Authorization header.
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7).trim();
        }
        return null;
    }
}

