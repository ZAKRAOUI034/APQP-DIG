import { useState } from 'react'
import { ArrowRight, Cog, SearchCheck, Truck, Archive, ShieldCheck, MapPin, Clock, Target } from 'lucide-react'
import { useAPQPStore, ProcessStep } from '@/lib/store'

interface PFDDiagramProps {
  projectId: number
}

export default function PFDDiagram({ projectId }: PFDDiagramProps) {
  const { projectData } = useAPQPStore()
  const steps = projectData[projectId]?.processSteps || []
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null)

  const getStepIcon = (type: ProcessStep['type']) => {
    switch (type) {
      case 'inspection':
        return <SearchCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'transport':
        return <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      case 'storage':
        return <Archive className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      default:
        return <Cog className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    }
  }

  const getBadgeColor = (type: ProcessStep['type']) => {
    switch (type) {
      case 'inspection':
        return 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700'
      case 'transport':
        return 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700'
      case 'storage':
        return 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700'
      default:
        return 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Synoptique de Fabrication (Process Flow Diagram - PFD)</h3>
          <p className="text-sm text-muted-foreground">
            Représentation graphique du flux matière conforme aux standards AIAG APQP / IATF 16949
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Opération</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Contrôle</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Conditionnement</span>
        </div>
      </div>

      {/* Visual Flow Pipeline */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-x-auto">
        <div className="flex items-stretch gap-3 min-w-[850px] pb-4">
          {steps.map((step, index) => {
            const isSelected = selectedStep?.id === step.id
            return (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  onClick={() => setSelectedStep(step)}
                  className={`w-52 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-sm flex flex-col justify-between ${
                    getBadgeColor(step.type)
                  } ${isSelected ? 'ring-2 ring-primary scale-105 shadow-md' : 'hover:scale-[1.02]'}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-background/80 shadow-xs">
                        OP {step.stepNumber}
                      </span>
                      {getStepIcon(step.type)}
                    </div>
                    <h4 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                      {step.operationName}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 text-[11px] space-y-1 text-muted-foreground">
                    <p className="truncate font-medium text-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" /> {step.workCenter}
                    </p>
                    <p className="truncate flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" /> {step.cycleTimeSec}s / cycle
                    </p>
                    <p className="truncate flex items-center gap-1">
                      <Target className="w-3 h-3 text-muted-foreground" /> {step.tooling}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex items-center text-muted-foreground/60 shrink-0">
                    <ArrowRight className="w-5 h-5 animate-pulse" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Step Details */}
      {selectedStep && (
        <div className="bg-muted/30 border border-primary/30 rounded-lg p-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-primary text-primary-foreground font-mono font-bold text-xs rounded">
                OP {selectedStep.stepNumber}
              </span>
              <h4 className="font-semibold text-foreground text-base">{selectedStep.operationName}</h4>
            </div>
            <span className="text-xs text-muted-foreground capitalize font-medium">Type : {selectedStep.type}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-card p-3 rounded border border-border">
              <span className="text-muted-foreground block font-medium">Poste & Machine</span>
              <span className="font-semibold text-foreground text-sm mt-1 block">{selectedStep.workCenter}</span>
            </div>
            <div className="bg-card p-3 rounded border border-border">
              <span className="text-muted-foreground block font-medium">Outillage / Empreintes</span>
              <span className="font-semibold text-foreground text-sm mt-1 block">{selectedStep.tooling}</span>
            </div>
            <div className="bg-card p-3 rounded border border-border">
              <span className="text-muted-foreground block font-medium">Temps de cycle</span>
              <span className="font-semibold text-foreground text-sm mt-1 block font-mono">{selectedStep.cycleTimeSec} secondes</span>
            </div>
            <div className="bg-card p-3 rounded border border-border">
              <span className="text-muted-foreground block font-medium">Caractéristique Clé</span>
              <span className="font-semibold text-foreground text-sm mt-1 block">{selectedStep.keyProductChar}</span>
            </div>
          </div>
        </div>
      )}

      {/* Traceability & Compliance Notice */}
      <div className="p-4 bg-muted/40 border border-border rounded-lg flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Synchronisation automatique garantie : PFD &rarr; PFMEA &rarr; Control Plan &rarr; Work Instructions</span>
        </div>
        <span className="font-mono">{steps.length} Opérations industrielles</span>
      </div>
    </div>
  )
}
