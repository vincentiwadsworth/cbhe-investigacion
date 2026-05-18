-- ============================================================
-- Migration: 002_restructure_upstream.sql
-- Change: db-restructure-upstream-separation
-- Phase 1: Create new domain-entity tables, migrate data,
--          add RLS policies, and set up indexes.
-- Old tables (upstream_annual, fuel_prices_global, ingestion_log)
-- are NOT dropped — kept for 7-day rollback window (Phase 5).
-- ============================================================

-- ============================================================
-- Part 1: DDL — Create 5 new tables
-- ============================================================

-- 1a. reserves_annual (split from upstream_annual)
CREATE TABLE reserves_annual (
    id BIGINT PRIMARY KEY,
    pais TEXT NOT NULL,
    codigo_pais TEXT NOT NULL,
    anio INTEGER NOT NULL,
    reservas_petroleo_bbl NUMERIC,
    reservas_gas_tcf NUMERIC,
    fuente TEXT,
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 1b. production_annual (split from upstream_annual)
CREATE TABLE production_annual (
    id BIGINT PRIMARY KEY,
    pais TEXT NOT NULL,
    codigo_pais TEXT NOT NULL,
    anio INTEGER NOT NULL,
    produccion_petroleo_kbbld NUMERIC,
    produccion_gas_bcm NUMERIC,
    fuente TEXT,
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 1c. drilling_activity (split from upstream_annual)
-- Includes future columns (pozos_*) per design — nullable until populated
CREATE TABLE drilling_activity (
    id BIGINT PRIMARY KEY,
    pais TEXT NOT NULL,
    codigo_pais TEXT NOT NULL,
    anio INTEGER NOT NULL,
    rigs_activos_prom NUMERIC,
    pozos_exploratorios INTEGER,
    pozos_desarrollo INTEGER,
    pozos_estratigraficos INTEGER,
    fuente TEXT,
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 1d. crude_benchmarks (renamed from fuel_prices_global)
CREATE TABLE crude_benchmarks (
    id INTEGER PRIMARY KEY,
    fecha DATE NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    precio_usd NUMERIC NOT NULL,
    fuente VARCHAR(50) NOT NULL DEFAULT 'OilPriceAPI'::VARCHAR,
    created_at TIMESTAMP DEFAULT now(),
    data_source VARCHAR(100),
    quality_score NUMERIC DEFAULT 1.0,
    last_fetched_at TIMESTAMPTZ
);

-- 1e. _etl_runs (renamed from ingestion_log, infrastructure table)
CREATE TABLE _etl_runs (
    id INTEGER PRIMARY KEY,
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
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Part 2: Data Migration — INSERT INTO new tables FROM old
-- ============================================================

-- 2a. Migrate reserves data
INSERT INTO reserves_annual (id, pais, codigo_pais, anio, reservas_petroleo_bbl, reservas_gas_tcf, fuente, notas, created_at)
SELECT id, pais, codigo_pais, anio, reservas_petroleo_bbl, reservas_gas_tcf, fuente, notas, created_at
FROM upstream_annual
WHERE reservas_petroleo_bbl IS NOT NULL OR reservas_gas_tcf IS NOT NULL;

-- 2b. Migrate production data
INSERT INTO production_annual (id, pais, codigo_pais, anio, produccion_petroleo_kbbld, produccion_gas_bcm, fuente, notas, created_at)
SELECT id, pais, codigo_pais, anio, produccion_petroleo_kbbld, produccion_gas_bcm, fuente, notas, created_at
FROM upstream_annual
WHERE produccion_petroleo_kbbld IS NOT NULL OR produccion_gas_bcm IS NOT NULL;

-- 2c. Migrate drilling data
INSERT INTO drilling_activity (id, pais, codigo_pais, anio, rigs_activos_prom, fuente, notas, created_at)
SELECT id, pais, codigo_pais, anio, rigs_activos_prom, fuente, notas, created_at
FROM upstream_annual
WHERE rigs_activos_prom IS NOT NULL;

-- 2d. Migrate crude benchmarks (all rows from fuel_prices_global)
INSERT INTO crude_benchmarks (id, fecha, tipo, precio_usd, fuente, created_at, data_source, quality_score, last_fetched_at)
SELECT id, fecha, tipo, precio_usd, fuente, created_at, data_source, quality_score, last_fetched_at
FROM fuel_prices_global;

-- 2e. Migrate ETL runs (all rows from ingestion_log)
INSERT INTO _etl_runs (id, source, run_type, start_date, end_date, records_fetched, records_inserted, records_updated, records_rejected, error_count, errors, duration_seconds, quality_score, created_at)
SELECT id, source, run_type, start_date, end_date, records_fetched, records_inserted, records_updated, records_rejected, error_count, errors, duration_seconds, quality_score, created_at
FROM ingestion_log;

-- ============================================================
-- Part 3: Indexes
-- ============================================================

-- reserves_annual
CREATE UNIQUE INDEX reserves_annual_pais_anio_key ON reserves_annual (pais, anio);

-- production_annual
CREATE UNIQUE INDEX production_annual_pais_anio_key ON production_annual (pais, anio);

-- drilling_activity
CREATE UNIQUE INDEX drilling_activity_pais_anio_key ON drilling_activity (pais, anio);

-- crude_benchmarks
CREATE UNIQUE INDEX crude_benchmarks_fecha_tipo_key ON crude_benchmarks (fecha, tipo);
CREATE INDEX idx_crude_benchmarks_fecha ON crude_benchmarks (fecha);
CREATE INDEX idx_crude_benchmarks_tipo ON crude_benchmarks (tipo);

-- _etl_runs
CREATE INDEX idx_etl_runs_source_created ON _etl_runs (source, created_at);

-- ============================================================
-- Part 4: Sequences — reset after explicit ID inserts
-- ============================================================

-- For BIGINT (identity) tables, create sequences and set to max+1
CREATE SEQUENCE reserves_annual_id_seq OWNED BY reserves_annual.id;
ALTER TABLE reserves_annual ALTER COLUMN id SET DEFAULT nextval('reserves_annual_id_seq');
SELECT setval('reserves_annual_id_seq', COALESCE((SELECT MAX(id) FROM reserves_annual), 0) + 1, false);

CREATE SEQUENCE production_annual_id_seq OWNED BY production_annual.id;
ALTER TABLE production_annual ALTER COLUMN id SET DEFAULT nextval('production_annual_id_seq');
SELECT setval('production_annual_id_seq', COALESCE((SELECT MAX(id) FROM production_annual), 0) + 1, false);

CREATE SEQUENCE drilling_activity_id_seq OWNED BY drilling_activity.id;
ALTER TABLE drilling_activity ALTER COLUMN id SET DEFAULT nextval('drilling_activity_id_seq');
SELECT setval('drilling_activity_id_seq', COALESCE((SELECT MAX(id) FROM drilling_activity), 0) + 1, false);

-- For INTEGER tables (crude_benchmarks, _etl_runs) — reuse source sequences or create new
CREATE SEQUENCE crude_benchmarks_id_seq OWNED BY crude_benchmarks.id;
ALTER TABLE crude_benchmarks ALTER COLUMN id SET DEFAULT nextval('crude_benchmarks_id_seq');
SELECT setval('crude_benchmarks_id_seq', COALESCE((SELECT MAX(id) FROM crude_benchmarks), 0) + 1, false);

CREATE SEQUENCE _etl_runs_id_seq OWNED BY _etl_runs.id;
ALTER TABLE _etl_runs ALTER COLUMN id SET DEFAULT nextval('_etl_runs_id_seq');
SELECT setval('_etl_runs_id_seq', COALESCE((SELECT MAX(id) FROM _etl_runs), 0) + 1, false);

-- ============================================================
-- Part 5: RLS Policies
-- ============================================================

-- 5a. reserves_annual — public read, admin all
ALTER TABLE reserves_annual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_admin_all_reserves"
ON reserves_annual FOR ALL
TO project_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "public_read_reserves"
ON reserves_annual FOR SELECT
TO public
USING (true);

-- 5b. production_annual — public read, admin all
ALTER TABLE production_annual ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_admin_all_production"
ON production_annual FOR ALL
TO project_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "public_read_production"
ON production_annual FOR SELECT
TO public
USING (true);

-- 5c. drilling_activity — public read, admin all
ALTER TABLE drilling_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_admin_all_drilling"
ON drilling_activity FOR ALL
TO project_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "public_read_drilling"
ON drilling_activity FOR SELECT
TO public
USING (true);

-- 5d. crude_benchmarks — public read, admin all
ALTER TABLE crude_benchmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_admin_all_crude"
ON crude_benchmarks FOR ALL
TO project_admin
USING (true)
WITH CHECK (true);

CREATE POLICY "public_read_crude_benchmarks"
ON crude_benchmarks FOR SELECT
TO public
USING (true);

-- 5e. _etl_runs — admin ONLY (no public read, no public write)
ALTER TABLE _etl_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_admin_all_etl"
ON _etl_runs FOR ALL
TO project_admin
USING (true)
WITH CHECK (true);

-- NOTE: No public policy on _etl_runs — anon key queries return 0 rows
