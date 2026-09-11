import { useState } from 'react'
import { ShieldCheck, AlertTriangle, Wrench, CheckCircle, Printer, Eye, Shield } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'

interface WorkInstructionsProps {
  projectId: number
}

export default function WorkInstructions({ projectId }: WorkInstructionsProps) {
  const { projectData } = useAPQPStore()
  const instructions = projectData[projectId]?.workInstructions || []
  const [selectedWiId, setSelectedWiId] = useState<string>(instructions[0]?.id || '')

  const currentWi = instructions.find((w) => w.id === selectedWiId) || instructions[0]

  const handlePrint = () => {
    window.print()
  }

  if (!currentWi) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Aucune instruction de travail enregistrée pour ce projet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Instructions de Travail & Standards au Poste (SOP)</h3>
          <p className="text-sm text-muted-foreground">
            Fiches opératoires standardisées conformes au Control Plan et affichables en atelier
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Workstation switcher */}
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg border border-border">
            {instructions.map((wi) => (
              <button
                key={wi.id}
                onClick={() => setSelectedWiId(wi.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  currentWi.id === wi.id
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                OP {wi.stepNumber}
              </button>
            ))}
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 text-sm border border-border bg-card text-foreground rounded-md hover:bg-muted transition-colors font-medium shadow-sm"
          >
            <Printer className="w-4 h-4 text-primary" />
            Imprimer Fiche Poste
          </button>
        </div>
      </div>

      {/* Industrial Work Instruction Board */}
      <div className="bg-card border-2 border-border rounded-xl shadow-sm overflow-hidden">
        {/* Card Header Banner */}
        <div className="bg-slate-900 text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-primary">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 bg-primary text-primary-foreground font-mono font-bold text-lg rounded-lg flex items-center justify-center shrink-0">
              OP {currentWi.stepNumber}
            </span>
            <div>
              <h4 className="text-lg font-bold">{currentWi.title}</h4>
              <p className="text-xs text-slate-300">
                Poste de travail : <span className="font-semibold text-white">{currentWi.workstation}</span> • {currentWi.revision}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-300">
            <span className="inline-block px-2.5 py-1 bg-emerald-600/30 text-emerald-300 rounded border border-emerald-500/40 font-medium">
              Standard IATF 16949 Validé
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* PPE (EPI) & Equipment Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg p-4">
              <h5 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Équipements de Protection Individuelle (EPI) Requis
              </h5>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentWi.ppeRequired.map((ppe, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 text-xs font-semibold rounded-md border border-blue-200 dark:border-blue-800"
                  >
                    <Shield className="w-3 h-3 text-blue-600" /> {ppe}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 border border-border rounded-lg p-4">
              <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                Outillages & Moyens de Contrôle Nécessaires
              </h5>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentWi.toolsRequired.map((tool, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-card text-foreground text-xs font-medium rounded-md border border-border shadow-2xs"
                  >
                    <Wrench className="w-3 h-3 text-slate-500" /> {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Operating Steps Sequence */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              Mode Opératoire Standard (Séquence des gestes)
            </h5>
            <div className="space-y-2">
              {currentWi.instructions.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Checks & Safety Alert */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 rounded-lg p-4">
              <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-600" />
                Points de Contrôle Qualité Clés (Auto-contrôle)
              </h5>
              <ul className="space-y-1.5 mt-2">
                {currentWi.criticalChecks.map((check, i) => (
                  <li key={i} className="text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/60 dark:bg-red-950/20 border border-red-300 dark:border-red-900/40 rounded-lg p-4">
              <h5 className="text-xs font-bold text-red-900 dark:text-red-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Avertissement de Sécurité & Ergonomie
              </h5>
              <p className="text-xs text-red-950 dark:text-red-200 mt-2 leading-relaxed font-medium">
                {currentWi.safetyWarning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
