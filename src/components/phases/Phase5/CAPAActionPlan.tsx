import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Clock, AlertCircle, X, ShieldAlert } from 'lucide-react'
import { useAPQPStore, CAPAItem } from '@/lib/store'

interface CAPAActionPlanProps {
  projectId: number
}

export default function CAPAActionPlan({ projectId }: CAPAActionPlanProps) {
  const { projectData, addCAPAItem, updateCAPAItem, setCAPAList } = useAPQPStore()
  const items = projectData[projectId]?.capaList || []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<CAPAItem>({
    id: '',
    title: '',
    source: 'Internal FMEA',
    priority: 'High',
    stage: 'Plan',
    owner: '',
    dueDate: '',
    status: 'In Progress'
  })

  const openAddModal = () => {
    setForm({
      id: `CAPA-${items.length + 101}`,
      title: '',
      source: 'Internal FMEA',
      priority: 'High',
      stage: 'Plan',
      owner: 'Ingénieur Qualité',
      dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'In Progress'
    })
    setIsModalOpen(true)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addCAPAItem(projectId, form)
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setCAPAList(projectId, items.filter((i) => i.id !== id))
  }

  const getPriorityBadge = (p: CAPAItem['priority']) => {
    switch (p) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">Critique</span>
      case 'High':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800">Haute</span>
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Moyenne</span>
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">Faible</span>
    }
  }

  const getStageBadge = (stage: CAPAItem['stage']) => {
    const colors = {
      Plan: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      Do: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      Check: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      Act: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    }
    return <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${colors[stage]}`}>PDCA: {stage}</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Plan d'Actions Correctives & Préventives (CAPA - PDCA)</h3>
          <p className="text-sm text-muted-foreground">
            Pilotage des actions d'amélioration continue selon la roue de Deming (Plan-Do-Check-Act)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter Action CAPA
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/80 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-4 py-3">Réf</th>
              <th className="px-4 py-3">Action d'Amélioration</th>
              <th className="px-4 py-3">Origine / Source</th>
              <th className="px-4 py-3">Priorité</th>
              <th className="px-4 py-3">Cycle PDCA</th>
              <th className="px-4 py-3">Pilote & Échéance</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  Aucune action CAPA en cours.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-xs text-primary">{item.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{item.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{item.source}</td>
                  <td className="px-4 py-3">{getPriorityBadge(item.priority)}</td>
                  <td className="px-4 py-3">{getStageBadge(item.stage)}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="font-semibold text-foreground block">{item.owner}</span>
                    <span className="text-muted-foreground">{item.dueDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-semibold text-foreground">Ajouter une Action CAPA</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-medium">Intitulé de l'Action *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Automatisation du transfert des cotes SPC vers l'ERP"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Source / Origine</label>
                  <select
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value as CAPAItem['source'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="Audit">Audit Interne / IATF</option>
                    <option value="Customer Complaint">Réclamation Client</option>
                    <option value="Internal FMEA">Revue AMDEC / Reverse FMEA</option>
                    <option value="SPC Drift">Dérive Statistique SPC</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Priorité</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as CAPAItem['priority'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="Critical">Critique</option>
                    <option value="High">Haute</option>
                    <option value="Medium">Moyenne</option>
                    <option value="Low">Faible</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Étape Cycle PDCA</label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value as CAPAItem['stage'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="Plan">Plan (Planification)</option>
                    <option value="Do">Do (Mise en œuvre)</option>
                    <option value="Check">Check (Vérification efficacité)</option>
                    <option value="Act">Act (Standardisation)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Statut</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as CAPAItem['status'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Pilote (Owner) *</label>
                  <input
                    type="text"
                    required
                    value={form.owner}
                    onChange={(e) => setForm({ ...form, owner: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Date Limite (Due Date) *</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
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
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
