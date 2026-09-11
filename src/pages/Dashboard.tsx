import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, Clock, CheckCircle2, AlertCircle, Building2, Calendar, Hash, Package, X, ArrowRight, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAPQPStore, Project } from '@/lib/store'

const statusConfig = {
  in_progress: { icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40', label: 'En cours' },
  completed: { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40', label: 'Terminé' },
  not_started: { icon: AlertCircle, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800', label: 'Non démarré' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { projects, addProject, setActiveProject, loadProjectsFromSupabase, deleteProject } = useAPQPStore()

  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    client: '',
    partNumber: '',
    annualVolume: 250000,
    launchDate: '2025-10-01',
    description: '',
    status: 'not_started' as Project['status'],
  })

  // Load projects from Supabase on mount
  useEffect(() => {
    loadProjectsFromSupabase()
  }, [loadProjectsFromSupabase])

  const inProgressCount = projects.filter((p) => p.status === 'in_progress').length
  const completedCount = projects.filter((p) => p.status === 'completed').length
  const totalCount = projects.length

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const newId = await addProject({
        name: newProjectForm.name,
        client: newProjectForm.client,
        partNumber: newProjectForm.partNumber,
        annualVolume: Number(newProjectForm.annualVolume),
        launchDate: newProjectForm.launchDate,
        description: newProjectForm.description,
        status: 'in_progress'
      })
      setIsNewModalOpen(false)
      navigate(`/project/${newId}`)
    } catch (error: any) {
      console.error('Failed to create project:', error)
      const errorMessage = error?.message || error?.toString() || 'Erreur inconnue'
      alert(`Erreur lors de la création du projet:\n${errorMessage}\n\nVérifiez la console du navigateur pour plus de détails.`)
    } finally {
      setIsCreating(false)
    }
  }

  const handleSelectProject = (id: number) => {
    setActiveProject(id)
  }

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject(id)
      setDeleteConfirm(null)
    } catch (error: any) {
      console.error('Failed to delete project:', error)
      const errorMessage = error?.message || error?.toString() || 'Erreur inconnue'
      alert(`Erreur lors de la suppression du projet:\n${errorMessage}\n\nVérifiez la console du navigateur (F12) pour plus de détails.`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard des Projets APQP</h1>
          <p className="text-slate-600 mt-1">
            Gestion des projets APQP
          </p>
        </div>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-sm"
        >
          <Plus className="w-4 h-4" />
          Nouveau Projet
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Projets</span>
          </div>
          <p className="text-4xl font-bold text-slate-900">{totalCount}</p>
          <p className="text-sm text-slate-500 mt-1">Dossiers APQP actifs</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">En Qualification</span>
          </div>
          <p className="text-4xl font-bold text-amber-600">{inProgressCount}</p>
          <p className="text-sm text-slate-500 mt-1">Phases 1 à 4 en cours</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PPAP Homologués</span>
          </div>
          <p className="text-4xl font-bold text-emerald-600">{completedCount}</p>
          <p className="text-sm text-slate-500 mt-1">Production série validée</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-900">Portefeuille des Programmes APQP</h2>
          <span className="text-sm text-slate-500">{projects.length} projet{projects.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {projects.map((project) => {
            const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.not_started
            const StatusIcon = status.icon
            
            return (
              <div
                key={project.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 hover:bg-slate-50 transition-colors group"
              >
                <Link
                  to={`/project/${project.id}`}
                  onClick={() => handleSelectProject(project.id)}
                  className="flex items-center gap-4 min-w-0 flex-1"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={cn("p-3 rounded-xl shrink-0", status.color)}>
                      <StatusIcon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                          #{project.projectNumber || project.id}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors truncate">
                          {project.name}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 truncate">
                        <span className="font-semibold text-slate-900">{project.client}</span> • <span className="font-mono text-slate-600">{project.partNumber}</span> • SOP : {project.launchDate}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900 block">{status.label}</span>
                    <span className="text-xs text-slate-500">
                      Phase <strong className="text-blue-600 font-bold">{project.currentPhase}</strong> / 5
                    </span>
                  </div>

                  <div className="w-36">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-mono font-bold text-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(project.id)
                      }}
                      className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                      title="Supprimer le projet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/project/${project.id}`}
                      onClick={() => handleSelectProject(project.id)}
                      className="p-2 text-muted-foreground group-hover:text-primary transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="p-2 bg-red-100 dark:bg-red-950/50 rounded-lg text-red-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground">Confirmer la suppression</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible et supprimera toutes les données associées.
            </p>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-border rounded text-sm hover:bg-muted font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded text-sm hover:bg-red-700 shadow"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-bold text-foreground text-lg">Initialiser un Nouveau Projet APQP</h4>
              <button onClick={() => setIsNewModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nom du projet *</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={newProjectForm.name}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Actionneur Électromécanique Turbo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Client (Constructeur / Tier 1) *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={newProjectForm.client}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, client: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-card border border-input rounded text-sm"
                      placeholder="Ex: Stellantis / Renault"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Référence Pièce (Part Number) *</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={newProjectForm.partNumber}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, partNumber: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-card border border-input rounded text-sm font-mono"
                      placeholder="Ex: ACT-2025-001"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Volume Annuel (pièces/an) *</label>
                  <input
                    type="number"
                    required
                    value={newProjectForm.annualVolume}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, annualVolume: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Date de Lancement Série (SOP) *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="date"
                      required
                      value={newProjectForm.launchDate}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, launchDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-card border border-input rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Description et Objectifs Qualité</label>
                <textarea
                  rows={3}
                  value={newProjectForm.description}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm resize-none"
                  placeholder="Décrivez les exigences spécifiques, l'application et les objectifs PPM/Cpk..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 border border-border rounded text-sm hover:bg-muted font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded text-sm hover:bg-primary/90 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Création en cours...' : 'Créer et Lancer APQP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
