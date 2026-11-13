-- ==============================================================================
-- AgriTrack: Smart Farm Management System
-- Phase 17: Activity & Irrigation Management
-- Script: 05_create_activities_and_irrigation_tables.sql
-- Description: Creates activities and irrigation_schedules tables with
--              cascading foreign keys to fields and SET NULL on crop_cycles.
-- Compatible with: MySQL 8.0+
-- ==============================================================================

USE `agritrack_db`;

-- 1. Create activities table
CREATE TABLE IF NOT EXISTS `activities` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `field_id` BIGINT NOT NULL,
    `crop_cycle_id` BIGINT NULL,
    `activity_type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Planned',
    `priority` VARCHAR(20) NOT NULL DEFAULT 'Medium',
    `activity_date` DATE NOT NULL,
    `activity_time` VARCHAR(20) NULL,
    `duration_hours` DECIMAL(5, 2) NULL,
    `operator` VARCHAR(100) NULL,
    `quantity` DECIMAL(10, 2) NULL,
    `quantity_unit` VARCHAR(30) NULL,
    `description` TEXT NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_activities_field`
        FOREIGN KEY (`field_id`)
        REFERENCES `fields` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_activities_crop_cycle`
        FOREIGN KEY (`crop_cycle_id`)
        REFERENCES `crop_cycles` (`id`)
        ON DELETE SET NULL,
    INDEX `idx_activities_field_id` (`field_id`),
    INDEX `idx_activities_crop_cycle_id` (`crop_cycle_id`),
    INDEX `idx_activities_status` (`status`),
    INDEX `idx_activities_date` (`activity_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create irrigation_schedules table
CREATE TABLE IF NOT EXISTS `irrigation_schedules` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `field_id` BIGINT NOT NULL,
    `crop_cycle_id` BIGINT NULL,
    `title` VARCHAR(150) NOT NULL,
    `irrigation_method` VARCHAR(50) NOT NULL DEFAULT 'Drip',
    `status` VARCHAR(30) NOT NULL DEFAULT 'Scheduled',
    `priority` VARCHAR(20) NOT NULL DEFAULT 'Medium',
    `scheduled_date` DATE NOT NULL,
    `scheduled_time` VARCHAR(20) NULL,
    `duration_minutes` INT NOT NULL DEFAULT 45,
    `water_volume_litres` DECIMAL(12, 2) NULL,
    `soil_moisture` DECIMAL(5, 2) NULL,
    `weather_condition` VARCHAR(100) NULL,
    `rainfall_expected` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `completed_at` TIMESTAMP NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_irrigation_field`
        FOREIGN KEY (`field_id`)
        REFERENCES `fields` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_irrigation_crop_cycle`
        FOREIGN KEY (`crop_cycle_id`)
        REFERENCES `crop_cycles` (`id`)
        ON DELETE SET NULL,
    INDEX `idx_irrigation_field_id` (`field_id`),
    INDEX `idx_irrigation_crop_cycle_id` (`crop_cycle_id`),
    INDEX `idx_irrigation_status` (`status`),
    INDEX `idx_irrigation_scheduled_date` (`scheduled_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

