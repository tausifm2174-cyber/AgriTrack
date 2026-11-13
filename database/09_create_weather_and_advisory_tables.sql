-- ==============================================================================
-- AgriTrack: Smart Farm Management System
-- Phase 20: Weather Synchronization & Weather-Based Rule Advisory Backend
-- Script: 09_create_weather_and_advisory_tables.sql
-- Description: Creates weather_snapshots, weather_forecasts, and advisories tables
--              with referential integrity, domain constraints, and performance indexes.
-- Compatible with: MySQL 8.0+
-- ==============================================================================

USE `agritrack_db`;

-- 1. Create weather_snapshots table
-- Persists current meteorological observations per farm holding.
CREATE TABLE IF NOT EXISTS `weather_snapshots` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `farm_id` BIGINT NOT NULL,
    `temperature` DECIMAL(5, 2) NOT NULL,
    `feels_like` DECIMAL(5, 2) NOT NULL,
    `humidity` INT NOT NULL,
    `wind_speed_kmh` DECIMAL(5, 2) NOT NULL,
    `wind_direction` VARCHAR(20) NULL,
    `rainfall_mm` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    `pressure_hpa` DECIMAL(6, 2) NULL,
    `condition_text` VARCHAR(100) NOT NULL,
    `condition_code` VARCHAR(50) NOT NULL,
    `uv_index` DECIMAL(4, 1) NULL,
    `air_quality_index` INT NULL,
    `observed_at` TIMESTAMP NOT NULL,
    `provider` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_weather_snapshots_farm`
        FOREIGN KEY (`farm_id`)
        REFERENCES `farms` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `chk_weather_humidity`
        CHECK (`humidity` >= 0 AND `humidity` <= 100),
    CONSTRAINT `chk_weather_wind`
        CHECK (`wind_speed_kmh` >= 0.00),
    CONSTRAINT `chk_weather_rainfall`
        CHECK (`rainfall_mm` >= 0.00),
    INDEX `idx_weather_farm_observed` (`farm_id`, `observed_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create weather_forecasts table
-- Current 7-day meteorological forecast cache per farm. Unique per (farm_id, forecast_date).
CREATE TABLE IF NOT EXISTS `weather_forecasts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `farm_id` BIGINT NOT NULL,
    `forecast_date` DATE NOT NULL,
    `day_label` VARCHAR(20) NOT NULL,
    `min_temp` DECIMAL(5, 2) NOT NULL,
    `max_temp` DECIMAL(5, 2) NOT NULL,
    `humidity` INT NOT NULL,
    `rain_chance_percent` INT NOT NULL DEFAULT 0,
    `rain_mm` DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    `wind_speed_kmh` DECIMAL(5, 2) NOT NULL,
    `condition_text` VARCHAR(100) NOT NULL,
    `condition_code` VARCHAR(50) NOT NULL,
    `fetched_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_weather_forecasts_farm`
        FOREIGN KEY (`farm_id`)
        REFERENCES `farms` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `chk_forecast_humidity`
        CHECK (`humidity` >= 0 AND `humidity` <= 100),
    CONSTRAINT `chk_forecast_rain_chance`
        CHECK (`rain_chance_percent` >= 0 AND `rain_chance_percent` <= 100),
    CONSTRAINT `chk_forecast_rain_mm`
        CHECK (`rain_mm` >= 0.00),
    CONSTRAINT `chk_forecast_wind`
        CHECK (`wind_speed_kmh` >= 0.00),
    UNIQUE KEY `uk_farm_forecast_date` (`farm_id`, `forecast_date`),
    INDEX `idx_forecast_farm_date` (`farm_id`, `forecast_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create advisories table
-- Persists actionable agronomic hazard advisories derived from weather evaluations.
CREATE TABLE IF NOT EXISTS `advisories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `farm_id` BIGINT NOT NULL,
    `field_id` BIGINT NULL,
    `crop_cycle_id` BIGINT NULL,
    `rule_code` VARCHAR(50) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `advisory_type` VARCHAR(30) NOT NULL,
    `severity` VARCHAR(20) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `trigger_condition` VARCHAR(255) NOT NULL,
    `recommended_action` TEXT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `valid_until` TIMESTAMP NULL,
    `dedup_key` VARCHAR(100) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_advisories_farm`
        FOREIGN KEY (`farm_id`)
        REFERENCES `farms` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_advisories_field`
        FOREIGN KEY (`field_id`)
        REFERENCES `fields` (`id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_advisories_crop_cycle`
        FOREIGN KEY (`crop_cycle_id`)
        REFERENCES `crop_cycles` (`id`)
        ON DELETE SET NULL,
    UNIQUE KEY `uk_advisories_dedup` (`farm_id`, `dedup_key`),
    INDEX `idx_advisories_farm_status` (`farm_id`, `status`),
    INDEX `idx_advisories_severity` (`severity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

