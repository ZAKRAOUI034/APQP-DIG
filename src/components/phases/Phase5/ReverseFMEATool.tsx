import { useState } from 'react'
import { Plus, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, X, Eye } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'

interface ReverseFMEAToolProps {
  projectId: number
}

export default function ReverseFMEATool({ projectId }: ReverseFMEAToolProps) {
  const { projectData, addReverseFmeaAudit } = useAPQPStore()
  const audits = projectData[projectId]?.reverseFmeaAudits || []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    station: '',
    observedIssue: '',
    detectionMethod: 'Audit de poste Gemba Walk',
    actionRequired: '',
    auditor: 'Auditeur Qualité UAP',
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addReverseFmeaAudit(projectId, {
      id: `RFM-0${audits.length + 1}`,
      ...form,
      date: new Date().toISOString().split('T')[0],
    })
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Reverse FMEA (Audit Terrain & Boucle Rétroactive PFMEA)</h3>
          <p className="text-sm text-muted-foreground">
            Confrontation directe de l'AMDEC Process avec les réalités de l'atelier pour ajuster les occurrences et détections réelles
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Enregistrer Constat Reverse FMEA
        </button>
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-xl flex items-start gap-3 text-xs text-purple-900 dark:text-purple-300">
        <Eye className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm">Le principe du Reverse FMEA selon IATF 16949</p>
          <p className="mt-0.5 leading-relaxed opacity-90">
            Une équipe pluridisciplinaire audite physiquement chaque poste de fabrication en observant le geste opérateur et teste les détrompeurs (Poka-Yoké). Tout écart constaté met à jour rétroactivement le PFMEA et le Control Plan.
          </p>
        </div>
      </div>

      {/* Audit Findings Cards */}
      <div className="space-y-3">
        {audits.length === 0 ? (
          <div className="p-8 text-center bg-card border border-border rounded-xl text-muted-foreground text-sm">
            Aucun constat d'audit Reverse FMEA enregistré.
          </div>
        ) : (
          audits.map((audit) => (
            <div key={audit.id} className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 font-mono font-bold text-xs bg-primary/10 text-primary rounded">
                    {audit.id}
                  </span>
                  <h4 className="font-bold text-foreground text-sm">{audit.station}</h4>
                </div>
                <span className="text-xs text-muted-foreground">{audit.date} • {audit.auditor}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-amber-600 block">Observation Terrain / Écart Constaté</span>
                  <p className="text-foreground bg-muted/30 p-2.5 rounded border border-border">{audit.observedIssue}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-emerald-600 block">Action Corrective & Impact sur PFMEA</span>
                  <p className="text-foreground bg-muted/30 p-2.5 rounded border border-border">{audit.actionRequired}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-semibold text-foreground">Nouvel Audit Reverse FMEA</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-medium">Poste / Machine Audité *</label>
                <input
                  type="text"
                  required
                  value={form.station}
                  onChange={(e) => setForm({ ...form, station: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Poste 30 - Insertion Ultrasons"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Observation Terrain / Mode Défaillance Non Prévu *</label>
                <textarea
                  required
                  rows={3}
                  value={form.observedIssue}
                  onChange={(e) => setForm({ ...form, observedIssue: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm resize-none"
                  placeholder="Ex: Risque de positionnement inversé si l'opérateur alimente trop vite le rail"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Action Corrective pour Mise à Jour PFMEA *</label>
                <textarea
                  required
                  rows={2}
                  value={form.actionRequired}
                  onChange={(e) => setForm({ ...form, actionRequired: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm resize-none"
                  placeholder="Ex: Ajouter une cellule optique de détrompage d'orientation (Poka-Yoké)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Auditeur</label>
                <input
                  type="text"
                  value={form.auditor}
                  onChange={(e) => setForm({ ...form, auditor: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded text-sm hover:bg-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded text-sm hover:bg-primary/90 shadow"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
