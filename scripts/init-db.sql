-- =============================================================================
-- MedFlow OPD — Database Initialization Script
-- Runs automatically on first PostgreSQL container start
-- =============================================================================

-- Create extensions used by the application
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Set timezone
SET timezone = 'UTC';
