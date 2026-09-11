import { useState } from 'react'
import { Plus, Trash2, Edit, AlertTriangle, Sparkles, X, ShieldAlert, Check } from 'lucide-react'
import { useAPQPStore, DFMEARow } from '@/lib/store'
import DFMEAAIAssistant from './DFMEAAIAssistant'
import { DFMEASuggestion } from '@/services/ai'

interface DFMEATableProps {
  projectId: number
}

export default function DFMEATable({ projectId }: DFMEATableProps) {
  const { projectData, addDFMEARow, updateDFMEARow, deleteDFMEARow } = useAPQPStore()
  const rows = projectData[projectId]?.dfmea || []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<DFMEARow | null>(null)
  const [formData, setFormData] = useState<DFMEARow>({
    id: '',
    item: '',
    functionName: '',
    failureMode: '',
    failureEffect: '',
    severity: 7,
    specialChar: 'CC',
    cause: '',
    preventionControl: '',
    occurrence: 3,
    detectionControl: '',
    detection: 3,
    rpn: 63,
    recommendedAction: '',
    responsible: '',
    targetDate: '',
    status: 'Open'
  })

  const openAddModal = () => {
    setEditingRow(null)
    const initial: DFMEARow = {
      id: `DFM-0${rows.length + 1}`,
      item: 'Corps thermoplastique',
      functionName: 'Maintien rigide sous vibrations',
      failureMode: 'Fissuration du clip de fixation',
      failureEffect: 'Perte de positionnement capteur',
      severity: 7,
      specialChar: 'CC',
      cause: 'Concentration de contrainte au rayon de congé',
      preventionControl: 'Simulation éléments finis EF',
      occurrence: 3,
      detectionControl: 'Essai thermique et endurance vibratoire',
      detection: 3,
      rpn: 63,
      recommendedAction: 'Augmenter le rayon de congé à R=0.8mm',
      responsible: 'Bureau d’Études',
      targetDate: '2024-06-30',
      status: 'Open'
    }
    setFormData(initial)
    setIsModalOpen(true)
  }

  const openEditModal = (row: DFMEARow) => {
    setEditingRow(row)
    setFormData({ ...row })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const rpn = formData.severity * formData.occurrence * formData.detection
    const finalData = { ...formData, rpn }
    if (editingRow) {
      updateDFMEARow(projectId, editingRow.id, finalData)
    } else {
      addDFMEARow(projectId, finalData)
    }
    setIsModalOpen(false)
  }

  const handleAddAIItems = (items: DFMEASuggestion[]) => {
    items.forEach((item) => {
      const newRow: DFMEARow = {
        id: item.id,
        item: item.item,
        functionName: item.functionName,
        failureMode: item.failureMode,
        failureEffect: item.failureEffect,
        severity: item.severity,
        specialChar: item.specialChar,
        cause: item.cause,
        preventionControl: item.preventionControl,
        occurrence: item.occurrence,
        detectionControl: item.detectionControl,
        detection: item.detection,
        rpn: item.rpn,
        recommendedAction: item.recommendedAction,
        responsible: item.responsible,
        targetDate: item.targetDate,
        status: item.status as 'Open' | 'In Progress' | 'Closed'
      }
      addDFMEARow(projectId, newRow)
    })
  }

  const getRpnBadge = (rpn: number) => {
    if (rpn >= 100) {
      return <span className="px-2 py-0.5 rounded font-bold text-xs bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">RPN {rpn} (Critique)</span>
    }
    if (rpn >= 60) {
      return <span className="px-2 py-0.5 rounded font-semibold text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">RPN {rpn}</span>
    }
    return <span className="px-2 py-0.5 rounded font-medium text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">RPN {rpn}</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">AMDEC Conception Produit (DFMEA)</h3>
          <p className="text-sm text-muted-foreground">
            Analyse des risques et plans d'actions préventives
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DFMEAAIAssistant projectId={projectId} onAddItems={handleAddAIItems} />
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter Ligne DFMEA
          </button>
        </div>
      </div>

      {/* DFMEA Table */}
      <div className="border border-border rounded-lg overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-left text-xs min-w-[900px]">
          <thead className="bg-muted/80 text-muted-foreground uppercase border-b border-border font-semibold">
            <tr>
              <th className="px-3 py-3">Composant / Fonction</th>
              <th className="px-3 py-3">Mode de Défaillance</th>
              <th className="px-3 py-3">Effet & S</th>
              <th className="px-3 py-3">Caract.</th>
              <th className="px-3 py-3">Cause Potentielle</th>
              <th className="px-3 py-3">Prévention & O</th>
              <th className="px-3 py-3">Détection & D</th>
              <th className="px-3 py-3 text-center">RPN</th>
              <th className="px-3 py-3">Action Recommandée</th>
              <th className="px-3 py-3">Statut</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  Aucune entrée DFMEA enregistrée. Cliquez sur "Ajouter Ligne DFMEA" pour commencer.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-3">
                    <span className="font-semibold text-foreground block">{row.item}</span>
                    <span className="text-muted-foreground text-[11px]">{row.functionName}</span>
                  </td>
                  <td className="px-3 py-3 font-medium text-foreground max-w-xs">{row.failureMode}</td>
                  <td className="px-3 py-3">
                    <span className="text-muted-foreground block">{row.failureEffect}</span>
                    <span className="font-bold text-red-600 dark:text-red-400">S = {row.severity}</span>
                  </td>
                  <td className="px-3 py-3">
                    {row.specialChar ? (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded font-bold text-[10px]">
                        {row.specialChar}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{row.cause}</td>
                  <td className="px-3 py-3">
                    <span className="block text-muted-foreground">{row.preventionControl}</span>
                    <span className="font-semibold text-foreground">O = {row.occurrence}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block text-muted-foreground">{row.detectionControl}</span>
                    <span className="font-semibold text-foreground">D = {row.detection}</span>
                  </td>
                  <td className="px-3 py-3 text-center">{getRpnBadge(row.rpn)}</td>
                  <td className="px-3 py-3 max-w-xs">
                    <span className="text-foreground font-medium block">{row.recommendedAction}</span>
                    <span className="text-muted-foreground text-[10px]">{row.responsible} • {row.targetDate}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      row.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(row)}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDFMEARow(projectId, row.id)}
                        className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
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

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-semibold text-foreground">
                {editingRow ? "Modifier Ligne DFMEA" : "Nouvelle Ligne DFMEA"}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Composant / Système *</label>
                  <input
                    type="text"
                    required
                    value={formData.item}
                    onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Corps thermoplastique"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Fonction de conception *</label>
                  <input
                    type="text"
                    required
                    value={formData.functionName}
                    onChange={(e) => setFormData({ ...formData, functionName: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Maintien rigide du capteur"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Mode de Défaillance Potentiel *</label>
                  <input
                    type="text"
                    required
                    value={formData.failureMode}
                    onChange={(e) => setFormData({ ...formData, failureMode: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Fissuration du clip de maintien"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Effet Potentiel de la Défaillance *</label>
                  <input
                    type="text"
                    required
                    value={formData.failureEffect}
                    onChange={(e) => setFormData({ ...formData, failureEffect: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Perte de position du capteur"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 bg-muted/40 p-3 rounded-lg">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-red-600">Sévérité S (1-10) *</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 bg-card border border-input rounded font-bold text-center text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Caractéristique</label>
                  <select
                    value={formData.specialChar}
                    onChange={(e) => setFormData({ ...formData, specialChar: e.target.value })}
                    className="w-full px-2 py-1.5 bg-card border border-input rounded text-xs"
                  >
                    <option value="">Standard</option>
                    <option value="CC">CC (Safety / Sécurité)</option>
                    <option value="SC">SC (Fit / Fonction)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-amber-600">Occurrence O (1-10) *</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={formData.occurrence}
                    onChange={(e) => setFormData({ ...formData, occurrence: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 bg-card border border-input rounded font-bold text-center text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-blue-600">Détection D (1-10) *</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={formData.detection}
                    onChange={(e) => setFormData({ ...formData, detection: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 bg-card border border-input rounded font-bold text-center text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-muted/20 border border-border rounded flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">RPN calculé instantanément :</span>
                <span className="font-mono font-bold text-base text-primary">
                  {formData.severity * formData.occurrence * formData.detection}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Cause Potentielle *</label>
                  <input
                    type="text"
                    required
                    value={formData.cause}
                    onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Concentration de contraintes"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Contrôle Préventif de Conception</label>
                  <input
                    type="text"
                    value={formData.preventionControl}
                    onChange={(e) => setFormData({ ...formData, preventionControl: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Calcul EF Ansys"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Contrôle Détection Actuel (Essais / DVP&R)</label>
                <input
                  type="text"
                  value={formData.detectionControl}
                  onChange={(e) => setFormData({ ...formData, detectionControl: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Essai endurance vibratoire"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Action Corrective Recommandée *</label>
                <input
                  type="text"
                  required
                  value={formData.recommendedAction}
                  onChange={(e) => setFormData({ ...formData, recommendedAction: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Augmenter le rayon de congé à R=0.8mm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Responsable</label>
                  <input
                    type="text"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Date Cible</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as DFMEARow['status'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="Open">Open (Ouvert)</option>
                    <option value="In Progress">In Progress (En cours)</option>
                    <option value="Closed">Closed (Clôturé)</option>
                  </select>
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
