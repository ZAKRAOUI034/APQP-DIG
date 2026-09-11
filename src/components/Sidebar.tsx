import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Cpu,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAPQPStore } from '@/lib/store'

const phases = [
  { id: 1, name: '1. Planification & VOC', icon: LayoutDashboard },
  { id: 2, name: '2. Conception Produit', icon: Cpu },
  { id: 3, name: '3. Conception Process', icon: Settings },
  { id: 4, name: '4. Validation & PPAP', icon: CheckCircle2 },
  { id: 5, name: '5. Amélioration Continue', icon: Layers },
]

export default function Sidebar() {
  const location = useLocation()
  const { projects, activeProjectId } = useAPQPStore()
  
  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0]
  const progress = currentProject?.progress || 0

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0 select-none">
      <div className="p-5 border-b border-border">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform">
            Q
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-none">AI-APQP Co-pilot</h1>
            <p className="text-[11px] text-muted-foreground mt-1">IATF 16949 Digital Platform</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        <div>
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Vue Globale
          </h3>
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
              location.pathname === '/' 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Projets</span>
          </Link>
        </div>

        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Phases APQP
            </h3>
            {currentProject && (
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                P{currentProject.id}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {phases.map((phase) => {
              const path = `/project/${activeProjectId}/phase/${phase.id}`
              const isActive = location.pathname.includes(`/phase/${phase.id}`)
              const isLocked = currentProject?.lockedPhases?.includes(phase.id)

              return (
                <Link
                  key={phase.id}
                  to={path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors group",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <phase.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{phase.name}</span>
                  {isLocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Active Project Footer Badge */}
      {currentProject && (
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="text-xs">
            <p className="font-semibold text-foreground truncate" title={currentProject.name}>
              {currentProject.name}
            </p>
            <p className="text-[11px] text-muted-foreground font-mono truncate">
              {currentProject.partNumber}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Progression
            </span>
            <span className="font-mono font-bold text-foreground">{progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </aside>
  )
}
