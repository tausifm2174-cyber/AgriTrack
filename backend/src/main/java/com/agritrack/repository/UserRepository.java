package com.agritrack.repository;

import com.agritrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository for the User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user account by their unique email address.
     *
     * @param email The user email.
     * @return Optional containing the User if found.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if a user already exists with the given email address.
     *
     * @param email The email to check.
     * @return True if a user exists with this email, false otherwise.
     */
    boolean existsByEmail(String email);
}

