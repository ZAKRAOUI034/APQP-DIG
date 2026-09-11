import { useState, useEffect } from 'react'
import { Database, CheckCircle2, AlertTriangle, RefreshCw, Copy, Check, X, Shield, Server, ExternalLink } from 'lucide-react'
import { 
  getSupabaseCredentials, 
  updateSupabaseCredentials, 
  testSupabaseConnection, 
  SUPABASE_SQL_SCHEMA 
} from '@/lib/supabase'
import { useAPQPStore } from '@/lib/store'

interface DatabaseSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DatabaseSettingsModal({ isOpen, onClose }: DatabaseSettingsModalProps) {
  const credentials = getSupabaseCredentials()
  const { projects, projectData } = useAPQPStore()

  const [url, setUrl] = useState(credentials.url)
  const [key, setKey] = useState(credentials.key)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)
  const [copiedSql, setCopiedSql] = useState(false)
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config')

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials()
      setUrl(creds.url)
      setKey(creds.key)
      setTestResult(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)
    updateSupabaseCredentials(url, key)
    const result = await testSupabaseConnection()
    setIsTesting(false)
    setTestResult(result)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    updateSupabaseCredentials(url, key)
    await handleTest()
  }

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl text-primary border border-primary/30">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold">Connexion Base de Données Supabase</h3>
              <p className="text-xs text-slate-400">Configuration de la persistance cloud IATF 16949 & APQP</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="border-b border-border bg-muted/40 px-6 pt-2 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Paramètres API Supabase
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Script SQL des Tables
          </button>
        </div>

        {/* Tab 1: Configuration */}
        {activeTab === 'config' && (
          <form onSubmit={handleSave} className="p-6 space-y-5 text-sm">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Project URL (Supabase URL) *</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2 bg-card border border-input rounded-lg text-xs font-mono focus:ring-2 focus:ring-primary"
                />
                <span className="text-[11px] text-muted-foreground">Trouvé dans : Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; Project URL</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Anon Public API Key (Clé API Anonyme) *</label>
                <input
                  type="password"
                  required
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2 bg-card border border-input rounded-lg text-xs font-mono focus:ring-2 focus:ring-primary"
                />
                <span className="text-[11px] text-muted-foreground">Trouvé dans : Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; Project API keys (anon public)</span>
              </div>
            </div>

            {/* Test result box */}
            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  testResult.ok
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-red-50/70 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{testResult.ok ? 'Connexion Réussie' : 'Échec de Connexion'}</p>
                  <p className="mt-0.5 opacity-90">{testResult.message}</p>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting || !url || !key}
                className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-lg hover:bg-muted text-xs font-semibold disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                {isTesting ? 'Test de connexion en cours...' : 'Tester la Connexion'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-border rounded-lg text-xs font-medium hover:bg-muted"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={isTesting}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 shadow"
                >
                  Enregistrer et Connecter
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: SQL Script */}
        {activeTab === 'sql' && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Exécutez ce script dans l'éditeur SQL de votre console Supabase (<a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-primary underline">Supabase SQL Editor</a>) pour créer les tables requises :
              </p>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 shadow-xs"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Script Copié !' : 'Copier le Script SQL'}
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed max-h-72 border border-slate-800">
              {SUPABASE_SQL_SCHEMA}
            </pre>

            <div className="p-3 bg-muted/40 border border-border rounded-lg text-muted-foreground text-[11px]">
              <strong>Astuce :</strong> Le système sauvegarde automatiquement toutes les modifications localement et les synchronise en arrière-plan dès que Supabase est connecté.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
