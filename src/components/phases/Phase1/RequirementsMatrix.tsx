import { useState } from 'react'
import { Plus, Trash2, Edit, Filter, Check, X, ShieldAlert, Sparkles } from 'lucide-react'
import { useAPQPStore, Requirement } from '@/lib/store'

interface RequirementsMatrixProps {
  projectId: number
}

const criticalityConfig = {
  low: { color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', label: 'Faible' },
  medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300', label: 'Moyenne' },
  high: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300', label: 'Haute' },
  critical: { color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 font-semibold', label: 'Critique' },
}

export default function RequirementsMatrix({ projectId }: RequirementsMatrixProps) {
  const { projectData, addRequirement, updateRequirement, deleteRequirement } = useAPQPStore()
  const requirements = projectData[projectId]?.requirements || []

  const [filterCriticality, setFilterCriticality] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReq, setEditingReq] = useState<Requirement | null>(null)
  const [formData, setFormData] = useState<Requirement>({
    id: '',
    source: '',
    characteristic: '',
    type: 'fonctionnelle',
    specification: '',
    criticality: 'high',
    verification: '',
  })

  const openAddModal = () => {
    setEditingReq(null)
    setFormData({
      id: `REQ-${String(requirements.length + 1).padStart(3, '0')}`,
      source: 'Cahier des charges OEM',
      characteristic: '',
      type: 'fonctionnelle',
      specification: '',
      criticality: 'high',
      verification: '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (req: Requirement) => {
    setEditingReq(req)
    setFormData({ ...req })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingReq) {
      updateRequirement(projectId, editingReq.id, formData)
    } else {
      addRequirement(projectId, formData)
    }
    setIsModalOpen(false)
  }

  const filtered = requirements.filter((req) => {
    if (filterCriticality !== 'all' && req.criticality !== filterCriticality) return false
    if (filterType !== 'all' && req.type !== filterType) return false
    return true
  })

  const criticalCount = requirements.filter((r) => r.criticality === 'critical').length
  const highCount = requirements.filter((r) => r.criticality === 'high').length
  const mediumCount = requirements.filter((r) => r.criticality === 'medium').length
  const lowCount = requirements.filter((r) => r.criticality === 'low').length

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Matrice des Exigences Client & Spécifications Produit</h3>
          <p className="text-sm text-muted-foreground">
            Traçabilité des exigences du cahier des charges vers le DFMEA et le DVP&R
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter Exigence
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/40 border border-border rounded-lg text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filtres :</span>
        </div>
        <select
          value={filterCriticality}
          onChange={(e) => setFilterCriticality(e.target.value)}
          className="px-2.5 py-1 bg-card border border-input rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">Toutes les criticités</option>
          <option value="critical">Critique</option>
          <option value="high">Haute</option>
          <option value="medium">Moyenne</option>
          <option value="low">Faible</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-2.5 py-1 bg-card border border-input rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">Tous les types</option>
          <option value="dimensionnelle">Dimensionnelle</option>
          <option value="fonctionnelle">Fonctionnelle</option>
          <option value="réglementaire">Réglementaire</option>
          <option value="esthétique">Esthétique</option>
        </select>
        
        <span className="text-xs text-muted-foreground ml-auto">
          Affichage de {filtered.length} sur {requirements.length} exigences
        </span>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted/70 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Source VOC</th>
              <th className="px-4 py-3">Caractéristique</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Spécification & Tolérance</th>
              <th className="px-4 py-3">Criticité</th>
              <th className="px-4 py-3">Méthode de Vérification</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  Aucune exigence trouvée pour ces critères de filtre.
                </td>
              </tr>
            ) : (
              filtered.map((req) => {
                const config = criticalityConfig[req.criticality]
                return (
                  <tr key={req.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-xs text-primary">{req.id}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs truncate" title={req.source}>
                      {req.source}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{req.characteristic}</td>
                    <td className="px-4 py-3 capitalize text-muted-foreground text-xs">{req.type}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground bg-muted/20">
                      {req.specification}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${config.color}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{req.verification}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(req)}
                          title="Modifier"
                          className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteRequirement(projectId, req.id)}
                          title="Supprimer"
                          className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary KPI Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-muted/30 border border-border rounded-lg gap-3">
        <p className="text-sm font-medium">
          Total : <span className="font-bold text-foreground">{requirements.length}</span> exigences identifiées
        </p>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <strong className="text-foreground">{criticalCount}</strong> Critiques
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <strong className="text-foreground">{highCount}</strong> Hautes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <strong className="text-foreground">{mediumCount}</strong> Moyennes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <strong className="text-foreground">{lowCount}</strong> Faibles
          </span>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h4 className="font-semibold text-foreground">
                {editingReq ? "Modifier l'exigence" : "Ajouter une exigence"}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-muted rounded text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Identifiant *</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/40 border border-input rounded text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Type d'exigence</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Requirement['type'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="dimensionnelle">Dimensionnelle</option>
                    <option value="fonctionnelle">Fonctionnelle</option>
                    <option value="réglementaire">Réglementaire</option>
                    <option value="esthétique">Esthétique</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Caractéristique / Intitulé *</label>
                <input
                  type="text"
                  required
                  value={formData.characteristic}
                  onChange={(e) => setFormData({ ...formData, characteristic: e.target.value })}
                  placeholder="Ex: Diamètre alésage fixation M6"
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Spécification & Tolérance *</label>
                <input
                  type="text"
                  required
                  value={formData.specification}
                  onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                  placeholder="Ex: Ø 6.20 ± 0.08 mm ou -40°C à +125°C"
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Criticité</label>
                  <select
                    value={formData.criticality}
                    onChange={(e) => setFormData({ ...formData, criticality: e.target.value as Requirement['criticality'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="critical">Critique (Safety/Key)</option>
                    <option value="high">Haute</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Faible</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Source VOC</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="Ex: RFQ §3.2"
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Moyen de Vérification / Contrôle *</label>
                <input
                  type="text"
                  required
                  value={formData.verification}
                  onChange={(e) => setFormData({ ...formData, verification: e.target.value })}
                  placeholder="Ex: Contrôle tridimensionnel CMM / Essai étuve"
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded text-sm hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded text-sm hover:bg-primary/90 transition-colors shadow"
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
