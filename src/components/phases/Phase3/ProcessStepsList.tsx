import { useState } from 'react'
import { Plus, Trash2, Edit, Cog, SearchCheck, Truck, Archive, X } from 'lucide-react'
import { useAPQPStore, ProcessStep } from '@/lib/store'

interface ProcessStepsListProps {
  projectId: number
}

export default function ProcessStepsList({ projectId }: ProcessStepsListProps) {
  const { projectData, setProcessSteps } = useAPQPStore()
  const steps = projectData[projectId]?.processSteps || []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null)
  const [form, setForm] = useState<ProcessStep>({
    id: '',
    stepNumber: '',
    operationName: '',
    workCenter: '',
    tooling: '',
    cycleTimeSec: 30,
    keyProductChar: '',
    keyProcessChar: '',
    type: 'operation',
  })

  const openAddModal = () => {
    setEditingStep(null)
    setForm({
      id: `OP-${Date.now()}`,
      stepNumber: `${(steps.length + 1) * 10}`,
      operationName: '',
      workCenter: '',
      tooling: '',
      cycleTimeSec: 25,
      keyProductChar: '',
      keyProcessChar: '',
      type: 'operation',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (step: ProcessStep) => {
    setEditingStep(step)
    setForm({ ...step })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingStep) {
      setProcessSteps(
        projectId,
        steps.map((s) => (s.id === editingStep.id ? form : s))
      )
    } else {
      setProcessSteps(projectId, [...steps, form])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setProcessSteps(projectId, steps.filter((s) => s.id !== id))
  }

  const getTypeIcon = (type: ProcessStep['type']) => {
    switch (type) {
      case 'inspection':
        return <SearchCheck className="w-4 h-4 text-blue-500" />
      case 'transport':
        return <Truck className="w-4 h-4 text-amber-500" />
      case 'storage':
        return <Archive className="w-4 h-4 text-purple-500" />
      default:
        return <Cog className="w-4 h-4 text-emerald-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Gamme de Fabrication & Étapes Process</h3>
          <p className="text-sm text-muted-foreground">
            Séquence chronologique des postes de fabrication, paramètres machines et caractéristiques process
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter Étape Process
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/80 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-4 py-3">Opération</th>
              <th className="px-4 py-3">Poste & Machine</th>
              <th className="px-4 py-3">Outillage Spécifique</th>
              <th className="px-4 py-3">Temps Cycle</th>
              <th className="px-4 py-3">Caractéristique Produit</th>
              <th className="px-4 py-3">Paramètre Process Clé</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {steps.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Aucune étape process définie. Cliquez sur "Ajouter Étape Process" pour configurer la ligne.
                </td>
              </tr>
            ) : (
              steps.map((step) => (
                <tr key={step.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-muted rounded border border-border">
                        {getTypeIcon(step.type)}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-primary">Op {step.stepNumber}</span>
                        <span className="font-medium text-foreground block text-xs">{step.operationName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground font-medium">{step.workCenter}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{step.tooling}</td>
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-foreground">
                    {step.cycleTimeSec >= 60 ? `${Math.round(step.cycleTimeSec / 60)} min` : `${step.cycleTimeSec} s`}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{step.keyProductChar}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{step.keyProcessChar}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(step)}
                        className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(step.id)}
                        className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
              <h4 className="font-semibold text-foreground">
                {editingStep ? "Modifier l'Étape Process" : "Ajouter une Étape Process"}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">N° Opération *</label>
                  <input
                    type="text"
                    required
                    value={form.stepNumber}
                    onChange={(e) => setForm({ ...form, stepNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                    placeholder="Ex: 20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Type d'opération</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as ProcessStep['type'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="operation">Fabrication / Usinage</option>
                    <option value="inspection">Contrôle / Inspection</option>
                    <option value="transport">Transfert / Convoyage</option>
                    <option value="storage">Stockage / Emballage</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Désignation de l'Opération *</label>
                <input
                  type="text"
                  required
                  value={form.operationName}
                  onChange={(e) => setForm({ ...form, operationName: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Moulage par injection thermoplastique"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Machine / Poste de Travail *</label>
                  <input
                    type="text"
                    required
                    value={form.workCenter}
                    onChange={(e) => setForm({ ...form, workCenter: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Presse Engel 200T"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Temps de Cycle (secondes) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.cycleTimeSec}
                    onChange={(e) => setForm({ ...form, cycleTimeSec: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Outillage / Moule / Gabarit</label>
                <input
                  type="text"
                  value={form.tooling}
                  onChange={(e) => setForm({ ...form, tooling: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Moule 2 empreintes à canaux chauds"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Caractéristique Produit Surveillée</label>
                <input
                  type="text"
                  value={form.keyProductChar}
                  onChange={(e) => setForm({ ...form, keyProductChar: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Poids pièce 42.5g, zéro bavure"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Paramètre Process Clé</label>
                <input
                  type="text"
                  value={form.keyProcessChar}
                  onChange={(e) => setForm({ ...form, keyProcessChar: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Pression maintien 720 bar, T° 275°C"
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
