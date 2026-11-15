-- ==============================================================================
-- AgriTrack: Smart Farm Management System
-- Phase 21: Notification & Alert Management Backend APIs
-- Script: 10_create_notifications_table.sql
-- Description: Creates notifications table with foreign keys, domain constraints,
--              deduplication key, and performance composite indexes.
-- Compatible with: MySQL 8.0+
-- ==============================================================================

USE `agritrack_db`;

CREATE TABLE IF NOT EXISTS `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `farm_id` BIGINT NULL,
    `field_id` BIGINT NULL,
    `crop_cycle_id` BIGINT NULL,
    `advisory_id` BIGINT NULL,
    `type` VARCHAR(30) NOT NULL,
    `severity` VARCHAR(20) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `related_route` VARCHAR(255) NULL,
    `action_label` VARCHAR(100) NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
    `read_at` TIMESTAMP NULL,
    `dedup_key` VARCHAR(120) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notifications_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_notifications_farm`
        FOREIGN KEY (`farm_id`)
        REFERENCES `farms` (`id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_notifications_field`
        FOREIGN KEY (`field_id`)
        REFERENCES `fields` (`id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_notifications_crop_cycle`
        FOREIGN KEY (`crop_cycle_id`)
        REFERENCES `crop_cycles` (`id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_notifications_advisory`
        FOREIGN KEY (`advisory_id`)
        REFERENCES `advisories` (`id`)
        ON DELETE SET NULL,
    CONSTRAINT `chk_notification_type`
        CHECK (`type` IN ('WEATHER', 'IRRIGATION', 'CROP', 'HARVEST', 'SALES', 'PAYMENT', 'SYSTEM', 'ADVISORY')),
    CONSTRAINT `chk_notification_severity`
        CHECK (`severity` IN ('INFO', 'SUCCESS', 'WARNING', 'CRITICAL')),
    UNIQUE KEY `uk_notifications_dedup` (`user_id`, `dedup_key`),
    INDEX `idx_notifications_user_unread` (`user_id`, `is_read`, `created_at` DESC),
    INDEX `idx_notifications_user_type` (`user_id`, `type`, `created_at` DESC),
    INDEX `idx_notifications_user_severity` (`user_id`, `severity`, `created_at` DESC),
    INDEX `idx_notifications_advisory` (`advisory_id`),
    INDEX `idx_notifications_farm` (`farm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ensure runtime least-privilege user has DML access on all agritrack_db tables
GRANT SELECT, INSERT, UPDATE, DELETE ON `agritrack_db`.* TO 'agritrack_user'@'localhost';
FLUSH PRIVILEGES;
