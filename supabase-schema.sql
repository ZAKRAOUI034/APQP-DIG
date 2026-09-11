-- ==========================================================
-- SCRIPT SQL D'INITIALISATION DE LA BASE DE DONNÉES SUPABASE
-- AI-APQP CO-PILOT (IATF 16949 & AIAG APQP PLATFORM)
-- ==========================================================

-- 1. Table des Projets APQP
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  part_number TEXT NOT NULL UNIQUE,
  annual_volume BIGINT DEFAULT 100000,
  launch_date DATE NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'in_progress',
  progress INTEGER DEFAULT 0,
  current_phase INTEGER DEFAULT 1,
  locked_phases JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des Données Techniques & Livrables par Phase
CREATE TABLE IF NOT EXISTS apqp_phase_data (
  project_id BIGINT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  requirements JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  dfmea JSONB DEFAULT '[]'::jsonb,
  ccsc JSONB DEFAULT '[]'::jsonb,
  dvpr JSONB DEFAULT '[]'::jsonb,
  process_steps JSONB DEFAULT '[]'::jsonb,
  pfmea JSONB DEFAULT '[]'::jsonb,
  control_plan JSONB DEFAULT '[]'::jsonb,
  work_instructions JSONB DEFAULT '[]'::jsonb,
  measurements JSONB DEFAULT '{}'::jsonb,
  msa_study JSONB DEFAULT '{}'::jsonb,
  cases_8d JSONB DEFAULT '[]'::jsonb,
  ppap_elements JSONB DEFAULT '[]'::jsonb,
  kpis JSONB DEFAULT '{}'::jsonb,
  drift_alerts JSONB DEFAULT '[]'::jsonb,
  reverse_fmea_audits JSONB DEFAULT '[]'::jsonb,
  capa_list JSONB DEFAULT '[]'::jsonb,
  lessons_learned JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security (RLS) avec accès public pour l'application
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE apqp_phase_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all access to apqp_phase_data" ON apqp_phase_data FOR ALL USING (true);

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
