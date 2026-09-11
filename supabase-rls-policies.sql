-- Script pour configurer les politiques RLS (Row Level Security) pour Supabase
-- Exécutez ceci dans le SQL Editor de Supabase

-- Activer RLS sur la table projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre toutes les opérations sur projects
-- (pour le développement, vous pouvez restreindre cela plus tard)
DROP POLICY IF EXISTS "Enable all access for projects" ON projects;
CREATE POLICY "Enable all access for projects" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Activer RLS sur la table apqp_phase_data seulement si elle existe
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'apqp_phase_data'
    ) THEN
        ALTER TABLE apqp_phase_data ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Enable all access for apqp_phase_data" ON apqp_phase_data;
        CREATE POLICY "Enable all access for apqp_phase_data" ON apqp_phase_data
          FOR ALL
          USING (true)
          WITH CHECK (true);
    END IF;
END $$;

-- Vérifier les politiques existantes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('projects', 'apqp_phase_data')
ORDER BY tablename, policyname;
