import { useState } from 'react'
import { Calendar, ChevronRight, Sparkles, CheckCircle2, Clock, X, Info } from 'lucide-react'
import { useAPQPStore, Milestone } from '@/lib/store'

interface PlanningGanttProps {
  projectId: number
}

const phaseColors = {
  1: 'bg-blue-600',
  2: 'bg-purple-600',
  3: 'bg-emerald-600',
  4: 'bg-amber-600',
  5: 'bg-rose-600',
}

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

export default function PlanningGantt({ projectId }: PlanningGanttProps) {
  const { projectData, setMilestones } = useAPQPStore()
  const milestones = projectData[projectId]?.milestones || []

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  const handleAIOptimize = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      const optimized: Milestone[] = [
        { id: 'M1', name: 'Phase 1 : Planification & VOC', startDate: '2024-01-10', endDate: '2024-03-01', duration: 2, phase: 1, status: 'completed' },
        { id: 'M2', name: 'Phase 2 : Conception Produit & DFMEA', startDate: '2024-03-01', endDate: '2024-06-15', duration: 3, phase: 2, status: 'completed' },
        { id: 'M3', name: 'Phase 3 : Conception Processus & PFMEA', startDate: '2024-06-15', endDate: '2024-09-30', duration: 3, phase: 3, status: 'in_progress' },
        { id: 'M4', name: 'Phase 4 : Validation & PPAP Run@Rate', startDate: '2024-10-01', endDate: '2024-12-15', duration: 2, phase: 4, status: 'pending' },
        { id: 'M5', name: 'Phase 5 : Ramp-up & Amélioration Continue', startDate: '2025-01-05', endDate: '2025-04-30', duration: 3, phase: 5, status: 'pending' },
      ]
      setMilestones(projectId, optimized)
      setIsOptimizing(false)
    }, 1000)
  }

  const totalDuration = milestones.reduce((sum, m) => sum + m.duration, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Planning Prévisionnel & Jalons APQP (Gantt)</h3>
          <p className="text-sm text-muted-foreground">
            Synchronisation des 5 phases du cycle APQP avec les jalons clés IATF 16949
          </p>
        </div>
        <button
          onClick={handleAIOptimize}
          disabled={isOptimizing}
          className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {isOptimizing ? 'Optimisation IA...' : 'Optimiser le rétro-planning'}
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="space-y-5">
          {/* Gantt Header */}
          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground border-b border-border pb-3">
            <span className="w-64">Jalon / Phase APQP</span>
            <div className="flex-1 grid grid-cols-12 text-center">
              {months.map((m) => (
                <span key={m} className="px-1 py-0.5 border-r border-border/40 last:border-0">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Gantt Bars */}
          {milestones.map((milestone, idx) => {
            // Calculate start month index 0 to 11
            const startMonth = parseInt(milestone.startDate.split('-')[1] || '1', 10) - 1
            const leftPercent = (startMonth / 12) * 100
            const widthPercent = (milestone.duration / 12) * 100

            const isSelected = selectedMilestone?.id === milestone.id
            const colorClass = phaseColors[milestone.phase as keyof typeof phaseColors] || 'bg-primary'

            return (
              <div
                key={milestone.id}
                onClick={() => setSelectedMilestone(milestone)}
                className={`flex items-center gap-4 group p-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? 'bg-muted' : 'hover:bg-muted/40'
                }`}
              >
                <div className="w-64 flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold ${colorClass}`}>
                    {milestone.phase}
                  </span>
                  <div>
                    <span className="text-sm font-medium text-foreground block">{milestone.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {milestone.startDate} → {milestone.endDate}
                    </span>
                  </div>
                </div>

                <div className="flex-1 relative h-9 bg-muted/40 rounded border border-border/60 overflow-hidden">
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 h-7 rounded shadow-sm ${colorClass} transition-all duration-300 flex items-center px-2`}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.min(100 - leftPercent, Math.max(10, widthPercent))}%`,
                    }}
                  >
                    <span className="text-xs font-semibold text-white truncate drop-shadow-sm">
                      {milestone.duration} mois
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Milestone Details Drawer */}
      {selectedMilestone && (
        <div className="p-4 bg-card border border-primary/30 rounded-lg shadow-sm flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded text-primary mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{selectedMilestone.name}</h4>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                  Phase {selectedMilestone.phase}
                </span>
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded capitalize">
                  Statut : {selectedMilestone.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Période planifiée : <strong>{selectedMilestone.startDate}</strong> au <strong>{selectedMilestone.endDate}</strong> ({selectedMilestone.duration} mois)
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedMilestone(null)}
            className="p-1 text-muted-foreground hover:text-foreground rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground">Durée totale projetée</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalDuration} mois</p>
          <p className="text-xs text-muted-foreground mt-1">Du kick-off au transfert série</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground">Date cible SOP</p>
          <p className="text-2xl font-bold text-primary mt-1">Septembre 2025</p>
          <p className="text-xs text-muted-foreground mt-1">Start of Production usine</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground">Jalons APQP validés</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">2 / 5 Phases</p>
          <p className="text-xs text-muted-foreground mt-1">Gate 1 & Gate 2 approuvés</p>
        </div>
      </div>
    </div>
  )
}
