import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Lock, CheckCircle2, ChevronRight, Download, Award } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'

// Phase 1 Components
import ProjectInfoForm from '@/components/phases/Phase1/ProjectInfoForm'
import VOCInput from '@/components/phases/Phase1/VOCInput'
import RequirementsMatrix from '@/components/phases/Phase1/RequirementsMatrix'
import PlanningGantt from '@/components/phases/Phase1/PlanningGantt'
import Phase1Deliverable from '@/components/phases/Phase1/Phase1Deliverable'

// Phase 2 Components
import SpecificationsForm from '@/components/phases/Phase2/SpecificationsForm'
import DFMEATable from '@/components/phases/Phase2/DFMEATable'
import CCSCMatrix from '@/components/phases/Phase2/CCSCMatrix'
import DVPRTable from '@/components/phases/Phase2/DVPRTable'
import Phase2Deliverable from '@/components/phases/Phase2/Phase2Deliverable'

// Phase 3 Components
import ProcessStepsList from '@/components/phases/Phase3/ProcessStepsList'
import PFDDiagram from '@/components/phases/Phase3/PFDDiagram'
import PFMEATable from '@/components/phases/Phase3/PFMEATable'
import ControlPlanTable from '@/components/phases/Phase3/ControlPlanTable'
import WorkInstructions from '@/components/phases/Phase3/WorkInstructions'
import Phase3Deliverable from '@/components/phases/Phase3/Phase3Deliverable'

// Phase 4 Components
import MeasurementDataInput from '@/components/phases/Phase4/MeasurementDataInput'
import StatisticalAnalysis from '@/components/phases/Phase4/StatisticalAnalysis'
import MSAGageRR from '@/components/phases/Phase4/MSAGageRR'
import NonConformities8D from '@/components/phases/Phase4/NonConformities8D'
import PPAPLevel3Checklist from '@/components/phases/Phase4/PPAPLevel3Checklist'
import Phase4Deliverable from '@/components/phases/Phase4/Phase4Deliverable'

// Phase 5 Components
import KPIsDashboard from '@/components/phases/Phase5/KPIsDashboard'
import ProcessDriftAlerts from '@/components/phases/Phase5/ProcessDriftAlerts'
import ReverseFMEATool from '@/components/phases/Phase5/ReverseFMEATool'
import CAPAActionPlan from '@/components/phases/Phase5/CAPAActionPlan'
import LessonsLearnedLog from '@/components/phases/Phase5/LessonsLearnedLog'
import Phase5Deliverable from '@/components/phases/Phase5/Phase5Deliverable'

const phaseConfig = [
  { 
    id: 1, 
    name: '1. Planification & Définition', 
    tabs: ['Informations', 'VOC', 'Matrice Exigences', 'Planning', 'Livrable Gate 1'] 
  },
  { 
    id: 2, 
    name: '2. Conception Produit', 
    tabs: ['Spécifications', 'DFMEA', 'Matrice CC/SC', 'DVP&R', 'Livrable Gate 2'] 
  },
  { 
    id: 3, 
    name: '3. Conception Processus', 
    tabs: ['Étapes Process', 'PFD', 'PFMEA', 'Control Plan', 'Work Instructions', 'Livrable Gate 3'] 
  },
  { 
    id: 4, 
    name: '4. Validation Produit & Processus', 
    tabs: ['Mesures', 'Statistiques SPC', 'Gage R&R (MSA)', 'Non-Conformités 8D', 'PPAP Niveau 3', 'Livrable Gate 4'] 
  },
  { 
    id: 5, 
    name: '5. Feedback & Amélioration Continue', 
    tabs: ['Dashboard KPIs', 'Alertes Dérive', 'Reverse FMEA', 'Actions CAPA', 'Leçons Apprises', 'Bilan Clôture'] 
  },
]

export default function ProjectView() {
  const { id, phaseId, tabId } = useParams<{ id: string; phaseId?: string; tabId?: string }>()
  const navigate = useNavigate()
  const { projects, activeProjectId, setActiveProject, lockPhase } = useAPQPStore()

  const projectId = parseInt(id || `${activeProjectId}`, 10) || 1
  const project = projects.find((p) => p.id === projectId) || projects[0]

  const [currentPhase, setCurrentPhase] = useState<number>(parseInt(phaseId || '1', 10) || 1)
  const [activeTab, setActiveTab] = useState<number>(parseInt(tabId || '0', 10) || 0)

  useEffect(() => {
    if (projectId && projectId !== activeProjectId) {
      setActiveProject(projectId)
    }
  }, [projectId, activeProjectId, setActiveProject])

  useEffect(() => {
    if (phaseId) {
      const p = parseInt(phaseId, 10)
      if (p >= 1 && p <= 5) setCurrentPhase(p)
    }
    if (tabId) {
      const t = parseInt(tabId, 10)
      if (t >= 0) setActiveTab(t)
    }
  }, [phaseId, tabId])

  const handlePhaseChange = (phase: number) => {
    setCurrentPhase(phase)
    setActiveTab(0)
    navigate(`/project/${projectId}/phase/${phase}`)
  }

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    navigate(`/project/${projectId}/phase/${currentPhase}/tab/${index}`)
  }

  const isCurrentPhaseLocked = project?.lockedPhases?.includes(currentPhase)

  const renderComponent = () => {
    switch (currentPhase) {
      case 1:
        if (activeTab === 0) return <ProjectInfoForm projectId={projectId} />
        if (activeTab === 1) return <VOCInput projectId={projectId} onNavigateToMatrix={() => handleTabChange(2)} />
        if (activeTab === 2) return <RequirementsMatrix projectId={projectId} />
        if (activeTab === 3) return <PlanningGantt projectId={projectId} />
        if (activeTab === 4) return <Phase1Deliverable projectId={projectId} onPhaseLocked={() => handlePhaseChange(2)} />
        break

      case 2:
        if (activeTab === 0) return <SpecificationsForm projectId={projectId} />
        if (activeTab === 1) return <DFMEATable projectId={projectId} />
        if (activeTab === 2) return <CCSCMatrix projectId={projectId} />
        if (activeTab === 3) return <DVPRTable projectId={projectId} />
        if (activeTab === 4) return <Phase2Deliverable projectId={projectId} onPhaseLocked={() => handlePhaseChange(3)} />
        break

      case 3:
        if (activeTab === 0) return <ProcessStepsList projectId={projectId} />
        if (activeTab === 1) return <PFDDiagram projectId={projectId} />
        if (activeTab === 2) return <PFMEATable projectId={projectId} />
        if (activeTab === 3) return <ControlPlanTable projectId={projectId} />
        if (activeTab === 4) return <WorkInstructions projectId={projectId} />
        if (activeTab === 5) return <Phase3Deliverable projectId={projectId} onPhaseLocked={() => handlePhaseChange(4)} />
        break

      case 4:
        if (activeTab === 0) return <MeasurementDataInput projectId={projectId} onNavigateToStats={() => handleTabChange(1)} />
        if (activeTab === 1) return <StatisticalAnalysis projectId={projectId} />
        if (activeTab === 2) return <MSAGageRR projectId={projectId} />
        if (activeTab === 3) return <NonConformities8D projectId={projectId} />
        if (activeTab === 4) return <PPAPLevel3Checklist projectId={projectId} />
        if (activeTab === 5) return <Phase4Deliverable projectId={projectId} onPhaseLocked={() => handlePhaseChange(5)} />
        break

      case 5:
        if (activeTab === 0) return <KPIsDashboard projectId={projectId} />
        if (activeTab === 1) return <ProcessDriftAlerts projectId={projectId} />
        if (activeTab === 2) return <ReverseFMEATool projectId={projectId} />
        if (activeTab === 3) return <CAPAActionPlan projectId={projectId} />
        if (activeTab === 4) return <LessonsLearnedLog projectId={projectId} />
        if (activeTab === 5) return <Phase5Deliverable projectId={projectId} />
        break

      default:
        return <ProjectInfoForm projectId={projectId} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Project Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 hover:bg-muted rounded-lg transition-colors border border-border bg-card">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{project?.name || 'Projet APQP'}</h1>
              {isCurrentPhaseLocked && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Jalon Validé
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="font-semibold text-foreground">{project?.client}</span> • <span className="font-mono">{project?.partNumber}</span> • Progression : <strong className="text-primary">{project?.progress}%</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isCurrentPhaseLocked && (
            <button
              onClick={() => lockPhase(projectId, currentPhase)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              Verrouiller Phase {currentPhase}
            </button>
          )}
        </div>
      </div>

      {/* Main APQP Workflow Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Phase Selector Bar */}
        <div className="border-b border-border bg-muted/20">
          <nav className="flex overflow-x-auto divide-x divide-border">
            {phaseConfig.map((phase) => {
              const isActive = phase.id === currentPhase
              const isLocked = project?.lockedPhases?.includes(phase.id)

              return (
                <button
                  key={phase.id}
                  onClick={() => handlePhaseChange(phase.id)}
                  className={`flex-1 min-w-[170px] px-4 py-3.5 text-xs font-bold transition-all text-left flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-card text-primary border-b-2 border-b-primary shadow-xs'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isLocked
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isLocked ? '✓' : phase.id}
                  </span>
                  <span className="truncate">{phase.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sub-Tabs Bar */}
        <div className="border-b border-border bg-muted/40 px-4">
          <nav className="flex overflow-x-auto gap-1 py-1.5">
            {phaseConfig[currentPhase - 1]?.tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => handleTabChange(index)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  index === activeTab
                    ? 'bg-card text-primary shadow-xs border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content Rendering Container */}
        <div className="p-6">
          {renderComponent()}
        </div>
      </div>
    </div>
  )
}
