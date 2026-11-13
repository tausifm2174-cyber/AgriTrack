-- ==============================================================================
-- AgriTrack: Smart Farm Management System
-- Phase 16: Crop Management & Lifecycle
-- Script: 04_create_crop_cycles_table.sql
-- Description: Creates crop_cycles table with foreign key to fields,
--              cascading delete, and performance indexes.
-- Compatible with: MySQL 8.0+
-- ==============================================================================

USE `agritrack_db`;

CREATE TABLE IF NOT EXISTS `crop_cycles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `field_id` BIGINT NOT NULL,
    `crop_name` VARCHAR(100) NOT NULL,
    `variety` VARCHAR(100) NOT NULL,
    `season` VARCHAR(30) NOT NULL,
    `sowing_date` DATE NOT NULL,
    `expected_harvest_date` DATE NOT NULL,
    `actual_harvest_date` DATE NULL,
    `current_stage` VARCHAR(50) NOT NULL DEFAULT 'Sowing',
    `current_stage_step` INT NOT NULL DEFAULT 1,
    `progress_percent` INT NOT NULL DEFAULT 0,
    `status` VARCHAR(30) NOT NULL DEFAULT 'Active',
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_crop_cycles_field`
        FOREIGN KEY (`field_id`)
        REFERENCES `fields` (`id`)
        ON DELETE CASCADE,
    INDEX `idx_crop_cycles_field_id` (`field_id`),
    INDEX `idx_crop_cycles_status` (`status`),
    INDEX `idx_crop_cycles_sowing_date` (`sowing_date`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

