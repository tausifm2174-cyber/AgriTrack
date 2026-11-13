-- ==============================================================================
-- AgriTrack: Smart Farm Management System
-- Phase 15: Farm, Field & Soil Management
-- Script: 03_create_farms_fields_soil_tables.sql
-- Description: Creates farms, fields, and soil_records tables with
--              cascading foreign keys and performance indexes.
-- Compatible with: MySQL 8.0+
-- ==============================================================================

USE `agritrack_db`;

-- 1. Create farms table
CREATE TABLE IF NOT EXISTS `farms` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `farm_name` VARCHAR(150) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `total_area` DECIMAL(10, 2) NOT NULL,
    `area_unit` VARCHAR(20) NOT NULL DEFAULT 'Acres',
    `description` TEXT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_farms_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_farms_user_id` (`user_id`),
    INDEX `idx_farms_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create fields table
CREATE TABLE IF NOT EXISTS `fields` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `farm_id` BIGINT NOT NULL,
    `field_name` VARCHAR(150) NOT NULL,
    `area` DECIMAL(10, 2) NOT NULL,
    `area_unit` VARCHAR(20) NOT NULL DEFAULT 'Acres',
    `soil_type` VARCHAR(100) NULL,
    `irrigation_type` VARCHAR(100) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Active',
    `description` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_fields_farm` FOREIGN KEY (`farm_id`) 
        REFERENCES `farms` (`id`) ON DELETE CASCADE,
    INDEX `idx_fields_farm_id` (`farm_id`),
    INDEX `idx_fields_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create soil_records table
CREATE TABLE IF NOT EXISTS `soil_records` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `field_id` BIGINT NOT NULL,
    `soil_type` VARCHAR(100) NULL,
    `ph` DECIMAL(4, 2) NULL,
    `nitrogen` DECIMAL(8, 2) NULL,
    `phosphorus` DECIMAL(8, 2) NULL,
    `potassium` DECIMAL(8, 2) NULL,
    `organic_matter` DECIMAL(5, 2) NULL,
    `moisture` DECIMAL(5, 2) NULL,
    `recorded_at` DATE NOT NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_soil_records_field` FOREIGN KEY (`field_id`) 
        REFERENCES `fields` (`id`) ON DELETE CASCADE,
    INDEX `idx_soil_records_field_id` (`field_id`),
    INDEX `idx_soil_records_recorded_at` (`recorded_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

