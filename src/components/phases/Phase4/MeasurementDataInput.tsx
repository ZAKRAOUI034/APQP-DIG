import { useState } from 'react'
import { Check, FileSpreadsheet, BarChart2, AlertTriangle, Wrench, Upload } from 'lucide-react'
import { useAPQPStore, MeasurementData } from '@/lib/store'

interface MeasurementDataInputProps {
  projectId: number
  onNavigateToStats?: () => void
}

export default function MeasurementDataInput({ projectId, onNavigateToStats }: MeasurementDataInputProps) {
  const { projectData, setMeasurements } = useAPQPStore()
  const current = projectData[projectId]?.measurements || {
    nominal: 120.00,
    usl: 120.05,
    lsl: 119.95,
    unit: 'mm',
    samples: [120.01, 120.02, 119.99, 120.00, 120.03]
  }

  const [nominal, setNominal] = useState(current.nominal)
  const [usl, setUsl] = useState(current.usl)
  const [lsl, setLsl] = useState(current.lsl)
  const [unit, setUnit] = useState(current.unit || 'mm')
  const [rawText, setRawText] = useState(current.samples.join(', '))
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedSamples = rawText
      .split(/[\s,;\n]+/)
      .map((val) => parseFloat(val.trim()))
      .filter((n) => !isNaN(n))

    const updated: MeasurementData = {
      nominal: Number(nominal),
      usl: Number(usl),
      lsl: Number(lsl),
      unit,
      samples: parsedSamples.length > 0 ? parsedSamples : [Number(nominal)]
    }

    setMeasurements(projectId, updated)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const loadPresetRun = (type: 'nominal_stable' | 'slight_drift' | 'high_precision') => {
    let base = 120.00
    let u = 120.05
    let l = 119.95
    let un = 'mm'
    let arr: number[] = []

    if (type === 'nominal_stable') {
      base = 120.00
      u = 120.05
      l = 119.95
      arr = [
        120.012, 119.998, 120.005, 120.018, 120.002, 119.988, 120.014, 120.006, 120.021, 119.995,
        120.008, 120.015, 120.001, 119.992, 120.017, 120.004, 120.011, 119.989, 120.016, 120.003,
        120.007, 120.022, 119.997, 120.013, 120.005, 119.991, 120.019, 120.008, 120.002, 120.014,
        119.996, 120.010, 120.007, 120.016, 119.993, 120.005, 120.018, 120.001, 120.012, 119.999,
        120.009, 120.015, 119.994, 120.006, 120.020, 120.003, 119.987, 120.011, 120.004, 120.016
      ]
    } else if (type === 'slight_drift') {
      base = 120.00
      u = 120.05
      l = 119.95
      arr = [
        120.005, 120.010, 120.012, 120.015, 120.018, 120.022, 120.025, 120.028, 120.031, 120.035,
        120.038, 120.040, 120.042, 120.045, 120.041, 120.039, 120.036, 120.034, 120.032, 120.030,
        120.028, 120.025, 120.022, 120.019, 120.016, 120.014, 120.012, 120.015, 120.018, 120.021
      ]
    } else {
      base = 8.50
      u = 9.00
      l = 8.00
      un = 'Nm'
      arr = [8.52, 8.48, 8.55, 8.49, 8.51, 8.53, 8.47, 8.56, 8.50, 8.52, 8.49, 8.54, 8.51, 8.48, 8.53]
    }

    setNominal(base)
    setUsl(u)
    setLsl(l)
    setUnit(un)
    setRawText(arr.join(', '))

    const updated: MeasurementData = {
      nominal: base,
      usl: u,
      lsl: l,
      unit: un,
      samples: arr
    }
    setMeasurements(projectId, updated)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const sampleCount = rawText.split(/[\s,;\n]+/).filter(Boolean).length

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold">Saisie des Données de Mesures & Échantillonnage Run@Rate</h3>
          <p className="text-sm text-muted-foreground">
            Données de pré-série pour calculs d'aptitude statistique process (Cp, Cpk, Pp, Ppk)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors text-sm shadow-sm"
          >
            {isSaved ? <Check className="w-4 h-4 text-white" /> : null}
            {isSaved ? 'Données Actualisées !' : 'Enregistrer les Mesures'}
          </button>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/40 border border-border rounded-lg text-xs">
        <span className="font-semibold text-muted-foreground">Jeux d'essai métrologiques :</span>
        <button
          type="button"
          onClick={() => loadPresetRun('nominal_stable')}
          className="flex items-center gap-1.5 px-3 py-1 bg-card hover:bg-muted border border-border rounded font-medium text-foreground transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5 text-primary" /> Entraxe SCS (50 pcs - Stable Cpk 1.68)
        </button>
        <button
          type="button"
          onClick={() => loadPresetRun('slight_drift')}
          className="flex items-center gap-1.5 px-3 py-1 bg-card hover:bg-muted border border-border rounded font-medium text-foreground transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Dérive thermique (30 pcs - Règle Nelson)
        </button>
        <button
          type="button"
          onClick={() => loadPresetRun('high_precision')}
          className="flex items-center gap-1.5 px-3 py-1 bg-card hover:bg-muted border border-border rounded font-medium text-foreground transition-colors"
        >
          <Wrench className="w-3.5 h-3.5 text-blue-600" /> Couple de serrage (15 pcs - 8.5 ± 0.5 Nm)
        </button>
      </div>

      {/* Tolerance input controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Valeur Nominale Cible *</label>
          <input
            type="number"
            step="any"
            required
            value={nominal}
            onChange={(e) => setNominal(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono font-bold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-red-600 dark:text-red-400">Limite Supérieure (USL / LSS) *</label>
          <input
            type="number"
            step="any"
            required
            value={usl}
            onChange={(e) => setUsl(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono font-bold text-red-600 dark:text-red-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-blue-600 dark:text-blue-400">Limite Inférieure (LSL / LSI) *</label>
          <input
            type="number"
            step="any"
            required
            value={lsl}
            onChange={(e) => setLsl(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono font-bold text-blue-600 dark:text-blue-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Unité de mesure</label>
          <input
            type="text"
            required
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
            placeholder="mm, Nm, bar..."
          />
        </div>
      </div>

      {/* Raw Values textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Échantillons mesurés (séparés par virgule, espace ou saut de ligne) *
          </label>
          <span className="text-xs font-mono font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">
            {sampleCount} valeurs saisies
          </span>
        </div>
        <textarea
          rows={7}
          required
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full px-4 py-3 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs leading-relaxed"
          placeholder="Ex: 120.012, 119.998, 120.005, 120.018..."
        />
      </div>

      {/* CSV drop mockup */}
      <div className="border-2 border-dashed border-border rounded-lg p-5 text-center bg-muted/20 hover:border-primary/50 transition-colors">
        <FileSpreadsheet className="w-6 h-6 mx-auto text-muted-foreground mb-1.5" />
        <p className="text-xs font-medium text-foreground">
          Import direct de fichiers de métrologie CSV / Excel / CMM Zeiss
        </p>
        <p className="text-[11px] text-muted-foreground">
          Glissez-déposez votre export machine pour parser automatiquement les 50 à 300 points de mesure.
        </p>
      </div>

      {onNavigateToStats && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNavigateToStats}
            className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Visualiser l'Analyse Statistique SPC (Cp, Cpk) &rarr;
          </button>
        </div>
      )}
    </form>
  )
}
