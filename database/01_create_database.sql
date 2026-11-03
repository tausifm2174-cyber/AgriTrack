-- ==============================================================================
-- AgriTrack: Smart Farm Management System
-- Phase 13: Spring Boot Backend + MySQL Foundation
-- Script: 01_create_database.sql
-- Description: Safely creates the AgriTrack MySQL database and dedicated runtime user.
-- Compatible with: MySQL 8.0+
-- ==============================================================================

-- 1. Create the database if it does not already exist
CREATE DATABASE IF NOT EXISTS `agritrack_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Switch to the newly created database
USE `agritrack_db`;

-- 3. Dedicated Application Runtime User Setup (Least Privilege Principle)
-- For secure application execution, the runtime user should have ONLY permissions
-- required for normal data manipulation (DML): SELECT, INSERT, UPDATE, DELETE.
-- Do NOT grant administrative (SUPER, RELOAD, GRANT OPTION) or DDL permissions
-- (CREATE, ALTER, DROP) to the runtime user.
--
-- Replace 'YourSecurePasswordHere' with your chosen password before executing:

-- CREATE USER IF NOT EXISTS 'agritrack_user'@'localhost' IDENTIFIED BY 'YourSecurePasswordHere';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON `agritrack_db`.* TO 'agritrack_user'@'localhost';
-- FLUSH PRIVILEGES;

-- 4. Future Schema Migrations (Migration-User Approach)
-- When automated schema migrations (e.g. Flyway / Liquibase) or structural DDL updates
-- are introduced in future phases, use a separate administrative migration user
-- (or temporary elevated admin credentials) with DDL permissions (CREATE, ALTER, DROP, INDEX, REFERENCES):
--
-- Example for future migration user (deferred to later phases):
-- CREATE USER IF NOT EXISTS 'agritrack_migrator'@'localhost' IDENTIFIED BY 'MigratorPasswordHere';
-- GRANT ALL PRIVILEGES ON `agritrack_db`.* TO 'agritrack_migrator'@'localhost';
-- FLUSH PRIVILEGES;

-- ==============================================================================
-- Execution Instructions (Windows PowerShell):
--
-- Initialize database as root:
--   Get-Content .\database\01_create_database.sql | mysql -u root -p
-- ==============================================================================
