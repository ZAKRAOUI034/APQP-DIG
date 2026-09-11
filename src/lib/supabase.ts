import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Try reading from Vite environment variables first, then fallback to localStorage configuration
function getStoredUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('APQP_SUPABASE_URL')
    if (saved && saved.trim().length > 0) return saved.trim()
  }
  return import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
}

function getStoredKey(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('APQP_SUPABASE_ANON_KEY')
    if (saved && saved.trim().length > 0) return saved.trim()
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'
}

let currentUrl = getStoredUrl()
let currentKey = getStoredKey()

export let supabase: SupabaseClient = createClient(currentUrl, currentKey)

export function updateSupabaseCredentials(url: string, key: string): { success: boolean; client: SupabaseClient } {
  currentUrl = url.trim()
  currentKey = key.trim()
  if (typeof window !== 'undefined') {
    localStorage.setItem('APQP_SUPABASE_URL', currentUrl)
    localStorage.setItem('APQP_SUPABASE_ANON_KEY', currentKey)
  }
  supabase = createClient(currentUrl, currentKey)
  return { success: true, client: supabase }
}

export function getSupabaseCredentials() {
  return {
    url: currentUrl,
    key: currentKey,
    isConfigured: currentUrl.includes('supabase.co') && !currentUrl.includes('placeholder') && currentKey !== 'placeholder-anon-key'
  }
}

export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string; tablesFound?: string[] }> {
  const { isConfigured, url } = getSupabaseCredentials()
  if (!isConfigured) {
    return {
      ok: false,
      message: 'Les identifiants Supabase (URL / Clé anonyme) ne sont pas encore configurés.'
    }
  }

  try {
    // Try pinging a standard table
    const { data, error } = await supabase.from('projects').select('id').limit(1)
    
    if (error) {
      // If table doesn't exist yet, but authentication reached Supabase
      if (error.code === '42P01' || error.message.includes('relation "projects" does not exist')) {
        return {
          ok: true,
          message: 'Connexion Supabase établie avec succès ! (Note : La table "projects" doit être initialisée via le script SQL ci-dessous).',
          tablesFound: []
        }
      }
      return {
        ok: false,
        message: `Erreur Supabase : ${error.message} (Code: ${error.code})`
      }
    }

    return {
      ok: true,
      message: 'Connexion Supabase active et table "projects" accessible !',
      tablesFound: ['projects']
    }
  } catch (err: any) {
    return {
      ok: false,
      message: `Impossible de contacter Supabase (${err.message || err}). Vérifiez l'URL du projet.`
    }
  }
}

export const SUPABASE_SQL_SCHEMA = `-- ==========================================================
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
`
