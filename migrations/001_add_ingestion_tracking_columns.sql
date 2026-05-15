-- Migration: 001_add_ingestion_tracking_columns.sql
-- Change: cbhe-fuel-dash-historical-data
-- Phase 1: Schema Updates

-- 1.1 Add tracking columns to fuel_prices_global
ALTER TABLE fuel_prices_global ADD COLUMN IF NOT EXISTS data_source VARCHAR(100);
ALTER TABLE fuel_prices_global ADD COLUMN IF NOT EXISTS quality_score NUMERIC(3,2) DEFAULT 1.0;
ALTER TABLE fuel_prices_global ADD COLUMN IF NOT EXISTS last_fetched_at TIMESTAMP WITH TIME ZONE;

-- 1.2 Add tracking columns to fuel_prices_regional
ALTER TABLE fuel_prices_regional ADD COLUMN IF NOT EXISTS data_source VARCHAR(100);
ALTER TABLE fuel_prices_regional ADD COLUMN IF NOT EXISTS quality_score NUMERIC(3,2) DEFAULT 1.0;
ALTER TABLE fuel_prices_regional ADD COLUMN IF NOT EXISTS last_fetched_at TIMESTAMP WITH TIME ZONE;

-- 1.3 Update existing mock records (if any)
UPDATE fuel_prices_global SET data_source = 'MOCK', quality_score = 0.5, last_fetched_at = NOW() WHERE data_source IS NULL;
UPDATE fuel_prices_regional SET data_source = 'MOCK', quality_score = 0.5, last_fetched_at = NOW() WHERE data_source IS NULL;

-- 1.4 Create ingestion_log table
CREATE TABLE IF NOT EXISTS ingestion_log (
  id SERIAL PRIMARY KEY,
  source VARCHAR(100) NOT NULL,
  run_type VARCHAR(20) NOT NULL,
  start_date DATE,
  end_date DATE,
  records_fetched INTEGER DEFAULT 0,
  records_inserted INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_rejected INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  errors JSONB,
  duration_seconds INTEGER,
  quality_score NUMERIC(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.5 Create indexes
CREATE INDEX IF NOT EXISTS idx_fuel_global_fecha_tipo ON fuel_prices_global(fecha, tipo);
CREATE INDEX IF NOT EXISTS idx_fuel_regional_fecha_pais_producto ON fuel_prices_regional(fecha, pais, producto);
CREATE INDEX IF NOT EXISTS idx_ingestion_log_source_created ON ingestion_log(source, created_at);
