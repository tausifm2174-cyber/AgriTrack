-- ==============================================================================
-- AgriTrack: Smart Farm Management System
-- Phase 18: Harvest, Sales & APMC Market Price Management
-- Script: 06_create_harvest_sales_market_tables.sql
-- Description: Creates harvests, sales, and market_prices tables with
--              referential integrity constraints (ON DELETE RESTRICT to protect
--              financial audit history) and performance indexes.
-- Compatible with: MySQL 8.0+
-- ==============================================================================

USE `agritrack_db`;

-- 1. Create harvests table
-- Associated with crop_cycles. Referential integrity uses ON DELETE RESTRICT
-- to prevent accidental deletion of crop cycles that have recorded harvest history.
CREATE TABLE IF NOT EXISTS `harvests` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `crop_cycle_id` BIGINT NOT NULL,
    `harvest_date` DATE NOT NULL,
    `expected_yield_kg` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `harvested_quantity_kg` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `available_quantity_kg` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `sold_quantity_kg` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `quality_grade` VARCHAR(10) NOT NULL DEFAULT 'A',
    `quality_score` INT NOT NULL DEFAULT 85,
    `moisture_percent` DECIMAL(5, 2) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'HARVESTED',
    `storage_location` VARCHAR(150) NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_harvests_crop_cycle`
        FOREIGN KEY (`crop_cycle_id`)
        REFERENCES `crop_cycles` (`id`)
        ON DELETE RESTRICT,
    INDEX `idx_harvests_crop_cycle_id` (`crop_cycle_id`),
    INDEX `idx_harvests_status` (`status`),
    INDEX `idx_harvests_harvest_date` (`harvest_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create sales table
-- Associated with harvests. Referential integrity uses ON DELETE RESTRICT
-- to prevent accidental deletion of harvests that have recorded financial sales transactions.
CREATE TABLE IF NOT EXISTS `sales` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `harvest_id` BIGINT NOT NULL,
    `buyer_name` VARCHAR(150) NOT NULL,
    `sale_date` DATE NOT NULL,
    `quantity_kg` DECIMAL(12, 2) NOT NULL,
    `price_per_kg` DECIMAL(10, 2) NOT NULL,
    `price_per_quintal` DECIMAL(12, 2) NOT NULL,
    `total_amount` DECIMAL(14, 2) NOT NULL,
    `market` VARCHAR(150) NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    `payment_status` VARCHAR(30) NOT NULL DEFAULT 'PAID',
    `paid_amount` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `balance_due` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    `payment_method` VARCHAR(50) NULL,
    `invoice_number` VARCHAR(50) NULL,
    `reference_market_price_per_q` DECIMAL(12, 2) NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sales_harvest`
        FOREIGN KEY (`harvest_id`)
        REFERENCES `harvests` (`id`)
        ON DELETE RESTRICT,
    INDEX `idx_sales_harvest_id` (`harvest_id`),
    INDEX `idx_sales_sale_date` (`sale_date`),
    INDEX `idx_sales_status` (`status`),
    INDEX `idx_sales_payment_status` (`payment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create market_prices table
-- Global shared reference data for APMC Mandi commodity benchmark prices.
-- Accessible to all authenticated farmers for reading; managed by ADMIN.
CREATE TABLE IF NOT EXISTS `market_prices` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `crop_name` VARCHAR(100) NOT NULL,
    `variety` VARCHAR(100) NOT NULL,
    `market_name` VARCHAR(150) NOT NULL,
    `location` VARCHAR(150) NOT NULL,
    `price_per_quintal` DECIMAL(12, 2) NOT NULL,
    `price_per_kg` DECIMAL(10, 2) NOT NULL,
    `previous_price` DECIMAL(12, 2) NULL,
    `price_change` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `change_percent` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    `trend` VARCHAR(20) NOT NULL DEFAULT 'STABLE',
    `quality_grade` VARCHAR(10) NOT NULL DEFAULT 'A',
    `price_date` DATE NOT NULL,
    `source` VARCHAR(100) NOT NULL DEFAULT 'APMC Mandi',
    `arrival_volume_quintals` DECIMAL(12, 2) NULL,
    `min_price` DECIMAL(12, 2) NULL,
    `max_price` DECIMAL(12, 2) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_market_prices_crop` (`crop_name`),
    INDEX `idx_market_prices_market` (`market_name`),
    INDEX `idx_market_prices_trend` (`trend`),
    INDEX `idx_market_prices_date` (`price_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
