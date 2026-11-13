-- ==============================================================================
-- AgriTrack: Smart Farm Management System
-- Phase 18: APMC Market Prices Controlled Seed Dataset
-- Script: 07_seed_market_prices.sql
-- Description: Seeds initial APMC commodity market benchmark prices
--              aligned with frontend demo reference cases (Wheat, Maize,
--              Mustard, Soybean, Potato).
-- Compatible with: MySQL 8.0+
-- ==============================================================================

USE `agritrack_db`;

INSERT INTO `market_prices` (
    `crop_name`, `variety`, `market_name`, `location`,
    `price_per_quintal`, `price_per_kg`, `previous_price`, `price_change`,
    `change_percent`, `trend`, `quality_grade`, `price_date`,
    `source`, `arrival_volume_quintals`, `min_price`, `max_price`
) VALUES
(
    'Wheat', 'Sharbati', 'APMC Nashik', 'Nashik, Maharashtra',
    2450.00, 24.50, 2400.00, 50.00,
    2.08, 'RISING', 'A', '2026-10-02',
    'APMC Mandi Daily Bulletin (Sample)', 1420.00, 2320.00, 2520.00
),
(
    'Maize', 'Hybrid', 'Karnal Mandi', 'Karnal, Haryana',
    1850.00, 18.50, 1880.00, -30.00,
    -1.60, 'FALLING', 'A', '2026-10-02',
    'Karnal Agricultural Marketing Board (Sample)', 2850.00, 1750.00, 1910.00
),
(
    'Mustard', 'Pusa Bold', 'Khanna Punjab', 'Khanna, Ludhiana, Punjab',
    5400.00, 54.00, 5350.00, 50.00,
    0.93, 'RISING', 'B', '2026-10-02',
    'Khanna Grain Market Committee (Sample)', 850.00, 5200.00, 5500.00
),
(
    'Soybean', 'JS 335', 'Vashi Mumbai', 'Navi Mumbai, Maharashtra',
    4600.00, 46.00, 4600.00, 0.00,
    0.00, 'STABLE', 'A', '2026-10-02',
    'APMC Vashi Wholesale Yard (Sample)', 1980.00, 4450.00, 4720.00
),
(
    'Potato', 'Kufri Jyoti', 'Vashi Mumbai', 'Navi Mumbai, Maharashtra',
    1650.00, 16.50, 1620.00, 30.00,
    1.85, 'RISING', 'A', '2026-10-02',
    'APMC Vashi Produce Terminal (Sample)', 4200.00, 1500.00, 1750.00
);
