-- ==============================================================================
-- AgriTrack: Smart Farm Management System
-- Phase 14: Authentication & User Management
-- Script: 02_create_users_table.sql
-- Description: Creates the users table with appropriate indexes and constraints.
-- Compatible with: MySQL 8.0+
-- ==============================================================================

USE `agritrack_db`;

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `phone` VARCHAR(20) NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'FARMER',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- Execution Instructions (Windows PowerShell):
--
-- Execute as MySQL root:
--   Get-Content .\database\02_create_users_table.sql | mysql -u root -p
-- ==============================================================================

