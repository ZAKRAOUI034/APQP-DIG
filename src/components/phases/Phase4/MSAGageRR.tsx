import { useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Gauge, Save, RefreshCw, Check } from 'lucide-react'
import { useAPQPStore, GageRRData } from '@/lib/store'

interface MSAGageRRProps {
  projectId: number
}

export default function MSAGageRR({ projectId }: MSAGageRRProps) {
  const { projectData, setGageRR } = useAPQPStore()
  const current = projectData[projectId]?.gageRR || {
    appraisersCount: 3,
    partsCount: 10,
    trialsCount: 3,
    equipmentName: 'Machine à Mesurer Tridimensionnelle CMM Zeiss Prismo',
    parameter: 'Cote d’entraxe 120.00 ± 0.05 mm',
    evPercent: 5.2,
    avPercent: 4.8,
    grrPercent: 7.08,
    ndc: 14,
    status: 'Acceptable'
  }

  const [form, setForm] = useState<GageRRData>(current)
  const [isSaved, setIsSaved] = useState(false)

  const handleRecalculate = (ev: number, av: number) => {
    const grr = Math.sqrt(Math.pow(ev, 2) + Math.pow(av, 2))
    const ndc = Math.max(1, Math.round(1.41 * (100 / Math.max(1, grr))))
    let status: GageRRData['status'] = 'Acceptable'
    if (grr > 30 || ndc < 5) status = 'Unacceptable'
    else if (grr >= 10) status = 'Marginal'

    setForm({
      ...form,
      evPercent: Number(ev.toFixed(2)),
      avPercent: Number(av.toFixed(2)),
      grrPercent: Number(grr.toFixed(2)),
      ndc,
      status
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setGageRR(projectId, form)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold">Analyse du Système de Mesure (MSA) - Gage R&R Croisé (ANOVA)</h3>
          <p className="text-sm text-muted-foreground">
            Conformité AIAG MSA 4th Edition : Répétabilité (EV), Reproductibilité (AV) et Nombre de Catégories Distinctes (ndc)
          </p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors text-sm shadow-sm"
        >
          {isSaved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Rapport Enregistré !' : 'Enregistrer Étude MSA'}
        </button>
      </div>

      {/* Equipment Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border border-border">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Équipement de Mesure & Étalon *</label>
          <input
            type="text"
            required
            value={form.equipmentName}
            onChange={(e) => setForm({ ...form, equipmentName: e.target.value })}
            className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Caractéristique / Cote Contrôlée *</label>
          <input
            type="text"
            required
            value={form.parameter}
            onChange={(e) => setForm({ ...form, parameter: e.target.value })}
            className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
          />
        </div>
      </div>

      {/* MSA KPI Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase">% Répétabilité (%EV)</span>
          <p className="text-3xl font-black text-blue-600 mt-1 font-mono">{form.evPercent}%</p>
          <p className="text-[11px] text-muted-foreground mt-1">Variabilité due au moyen (Equipment)</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase">% Reproductibilité (%AV)</span>
          <p className="text-3xl font-black text-purple-600 mt-1 font-mono">{form.avPercent}%</p>
          <p className="text-[11px] text-muted-foreground mt-1">Variabilité due aux opérateurs (Appraiser)</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Total Gage R&R (%GRR)</span>
          <p className={`text-3xl font-black mt-1 font-mono ${form.grrPercent < 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {form.grrPercent}%
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Exigence AIAG : &lt; 10%</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Catégories Distinctes (ndc)</span>
          <p className="text-3xl font-black text-foreground mt-1 font-mono">{form.ndc}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Résolution requise : ndc &ge; 5</p>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4 shadow-sm">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Gauge className="w-4 h-4 text-primary" />
          Ajustement des Composantes de Variabilité (% de la Tolérance)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Variation Équipement (%EV)</span>
              <span className="font-mono font-bold text-blue-600">{form.evPercent}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.1"
              value={form.evPercent}
              onChange={(e) => handleRecalculate(parseFloat(e.target.value), form.avPercent)}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Variation Opérateurs (%AV)</span>
              <span className="font-mono font-bold text-purple-600">{form.avPercent}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.1"
              value={form.avPercent}
              onChange={(e) => handleRecalculate(form.evPercent, parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        </div>

        {/* Verdict Banner */}
        <div className={`p-4 rounded-lg border flex items-center gap-3 mt-4 ${
          form.status === 'Acceptable'
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-900 dark:text-emerald-300'
            : form.status === 'Marginal'
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/40 text-amber-900 dark:text-amber-300'
            : 'bg-red-50 dark:bg-red-950/30 border-red-500/40 text-red-900 dark:text-red-300'
        }`}>
          {form.status === 'Acceptable' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div className="text-xs">
            <p className="font-bold text-sm">
              Verdict AIAG MSA : Système de Mesure {form.status === 'Acceptable' ? 'Acceptable (%GRR < 10%)' : form.status === 'Marginal' ? 'Acceptable sous conditions (10% - 30%)' : 'Inacceptable (%GRR > 30%)'}
            </p>
            <p className="mt-0.5 opacity-90">
              L'étude Gage R&R valide la capabilité de l'équipement métrologique pour la surveillance des séries IATF 16949.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
