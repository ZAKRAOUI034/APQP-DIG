import { useState } from 'react'
import { Plus, Trash2, Edit, AlertTriangle, Sparkles, X, ShieldAlert, Check } from 'lucide-react'
import { useAPQPStore, PFMEARow } from '@/lib/store'

interface PFMEATableProps {
  projectId: number
}

export default function PFMEATable({ projectId }: PFMEATableProps) {
  const { projectData, addPFMEARow, updatePFMEARow, deletePFMEARow } = useAPQPStore()
  const rows = projectData[projectId]?.pfmea || []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<PFMEARow | null>(null)
  const [formData, setFormData] = useState<PFMEARow>({
    id: '',
    stepNumber: '20',
    processFunction: '',
    failureMode: '',
    failureEffect: '',
    severity: 7,
    specialChar: 'CC',
    cause: '',
    preventionControl: '',
    occurrence: 3,
    detectionControl: '',
    detection: 2,
    rpn: 42,
    correctiveAction: '',
    responsible: '',
    status: 'Open'
  })

  const openAddModal = () => {
    setEditingRow(null)
    const initial: PFMEARow = {
      id: `PFM-0${rows.length + 1}`,
      stepNumber: '20',
      processFunction: 'Injection thermoplastique sous pression',
      failureMode: 'Retassure ou bavure sur plan de joint',
      failureEffect: 'Défaut d’étanchéité ou non-conformité d’aspect',
      severity: 7,
      specialChar: 'CC',
      cause: 'Instabilité de la pression de maintien ou dérive thermique',
      preventionControl: 'Régulation en boucle fermée courbe de pression',
      occurrence: 3,
      detectionControl: 'Capteur de pression cavité Kistler & tri automatique',
      detection: 2,
      rpn: 42,
      correctiveAction: 'Intégration d’un volet pneumatique de rejet automatique',
      responsible: 'Responsable Méthodes',
      status: 'Open'
    }
    setFormData(initial)
    setIsModalOpen(true)
  }

  const openEditModal = (row: PFMEARow) => {
    setEditingRow(row)
    setFormData({ ...row })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const rpn = formData.severity * formData.occurrence * formData.detection
    const finalData = { ...formData, rpn }
    if (editingRow) {
      updatePFMEARow(projectId, editingRow.id, finalData)
    } else {
      addPFMEARow(projectId, finalData)
    }
    setIsModalOpen(false)
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
          <h3 className="text-lg font-semibold">AMDEC Processus de Fabrication (PFMEA) - AIAG 4th Ed.</h3>
          <p className="text-sm text-muted-foreground">
            Analyse des risques de non-qualité process, maîtrise des causes racines et détrompeurs Poka-Yoké
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter Ligne PFMEA
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-left text-xs min-w-[950px]">
          <thead className="bg-muted/80 text-muted-foreground uppercase border-b border-border font-semibold">
            <tr>
              <th className="px-3 py-3">Opération & Fonction</th>
              <th className="px-3 py-3">Mode de Défaillance Process</th>
              <th className="px-3 py-3">Effet & S</th>
              <th className="px-3 py-3">Caract.</th>
              <th className="px-3 py-3">Cause Process</th>
              <th className="px-3 py-3">Prévention & O</th>
              <th className="px-3 py-3">Détection & D</th>
              <th className="px-3 py-3 text-center">RPN</th>
              <th className="px-3 py-3">Action Corrective / Poka-Yoké</th>
              <th className="px-3 py-3">Statut</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  Aucune ligne PFMEA enregistrée. Cliquez sur "Ajouter Ligne PFMEA" pour démarrer l'analyse des risques.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs font-bold text-primary block">OP {row.stepNumber}</span>
                    <span className="text-muted-foreground text-[11px] font-medium">{row.processFunction}</span>
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
                    <span className="text-foreground font-medium block">{row.correctiveAction}</span>
                    <span className="text-muted-foreground text-[10px]">{row.responsible}</span>
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
                        onClick={() => deletePFMEARow(projectId, row.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-semibold text-foreground">
                {editingRow ? "Modifier Ligne PFMEA" : "Nouvelle Ligne PFMEA"}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">N° Opération *</label>
                  <input
                    type="text"
                    required
                    value={formData.stepNumber}
                    onChange={(e) => setFormData({ ...formData, stepNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                    placeholder="Ex: 20"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-medium">Fonction de l'Opération *</label>
                  <input
                    type="text"
                    required
                    value={formData.processFunction}
                    onChange={(e) => setFormData({ ...formData, processFunction: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Moulage injection thermoplastique"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Mode de Défaillance Process *</label>
                  <input
                    type="text"
                    required
                    value={formData.failureMode}
                    onChange={(e) => setFormData({ ...formData, failureMode: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Retassure ou manque matière"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Effet sur le Produit / Client *</label>
                  <input
                    type="text"
                    required
                    value={formData.failureEffect}
                    onChange={(e) => setFormData({ ...formData, failureEffect: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Risque de fuite ou rejet assemblage"
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
                    <option value="CC">CC (Sécurité)</option>
                    <option value="SC">SC (Fonction)</option>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Cause Racine Process *</label>
                  <input
                    type="text"
                    required
                    value={formData.cause}
                    onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Baisse de pression de maintien"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Contrôle Prévention Process</label>
                  <input
                    type="text"
                    value={formData.preventionControl}
                    onChange={(e) => setFormData({ ...formData, preventionControl: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: Régulation automatique PID"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Moyen de Détection Actuel</label>
                <input
                  type="text"
                  value={formData.detectionControl}
                  onChange={(e) => setFormData({ ...formData, detectionControl: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Capteur Kistler avec rejet automatique"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Action Corrective / Poka-Yoké Recommandé *</label>
                <input
                  type="text"
                  required
                  value={formData.correctiveAction}
                  onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Volet pneumatique de mise au rebut avec alarme sonore"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-xs font-medium">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PFMEARow['status'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
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
