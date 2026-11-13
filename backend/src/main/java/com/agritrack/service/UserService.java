package com.agritrack.service;

import com.agritrack.dto.UserResponse;
import com.agritrack.entity.User;
import com.agritrack.exception.ResourceNotFoundException;
import com.agritrack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service managing user profile retrieval and account operations.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves the profile of the currently authenticated user by email.
     *
     * @param email The authenticated user's email.
     * @return UserResponse safe profile details.
     */
    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserResponse.fromEntity(user);
    }

    /**
     * Retrieves a user by their primary key ID.
     *
     * @param id The user ID.
     * @return UserResponse safe profile details.
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return UserResponse.fromEntity(user);
    }
}

