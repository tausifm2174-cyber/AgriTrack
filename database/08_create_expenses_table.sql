-- ==============================================================================
-- AgriTrack: Smart Farm Management System
-- Phase 19: Expense Management & Financial / Profit & Loss Analytics Backend
-- Script: 08_create_expenses_table.sql
-- Description: Creates expenses table with referential integrity constraints,
--              positive amount check constraint, and performance indexes.
-- Compatible with: MySQL 8.0+
-- ==============================================================================

USE `agritrack_db`;

-- Create expenses table
-- Associated mandatorily with farms, and optionally with fields and crop_cycles.
CREATE TABLE IF NOT EXISTS `expenses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `farm_id` BIGINT NOT NULL,
    `field_id` BIGINT NULL,
    `crop_cycle_id` BIGINT NULL,
    `category` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `expense_date` DATE NOT NULL,
    `vendor_name` VARCHAR(150) NULL,
    `payment_method` VARCHAR(50) NULL,
    `payment_status` VARCHAR(30) NOT NULL DEFAULT 'PAID',
    `receipt_number` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_expenses_farm`
        FOREIGN KEY (`farm_id`)
        REFERENCES `farms` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_expenses_field`
        FOREIGN KEY (`field_id`)
        REFERENCES `fields` (`id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_expenses_crop_cycle`
        FOREIGN KEY (`crop_cycle_id`)
        REFERENCES `crop_cycles` (`id`)
        ON DELETE SET NULL,
    CONSTRAINT `chk_expenses_amount`
        CHECK (`amount` > 0.00),
    INDEX `idx_expenses_farm_id` (`farm_id`),
    INDEX `idx_expenses_field_id` (`field_id`),
    INDEX `idx_expenses_crop_cycle_id` (`crop_cycle_id`),
    INDEX `idx_expenses_category` (`category`),
    INDEX `idx_expenses_payment_status` (`payment_status`),
    INDEX `idx_expenses_expense_date` (`expense_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
