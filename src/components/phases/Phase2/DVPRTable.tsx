import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, XCircle, Clock, AlertCircle, X } from 'lucide-react'
import { useAPQPStore, DVPRRow } from '@/lib/store'

interface DVPRTableProps {
  projectId: number
}

export default function DVPRTable({ projectId }: DVPRTableProps) {
  const { projectData, setDVPR } = useAPQPStore()
  const rows = projectData[projectId]?.dvpr || []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<DVPRRow>({
    id: '',
    testName: '',
    specRef: '',
    sampleSize: 10,
    acceptanceCriteria: '',
    facility: '',
    startDate: '',
    endDate: '',
    status: 'In Progress',
    resultSummary: '',
  })

  const openAddModal = () => {
    setForm({
      id: `DVP-0${rows.length + 1}`,
      testName: '',
      specRef: 'ISO 16750',
      sampleSize: 10,
      acceptanceCriteria: '',
      facility: 'Laboratoire Central Essais',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'In Progress',
      resultSummary: 'Essai en cours',
    })
    setIsModalOpen(true)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setDVPR(projectId, [...rows, form])
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setDVPR(projectId, rows.filter((r) => r.id !== id))
  }

  const getStatusBadge = (status: DVPRRow['status']) => {
    switch (status) {
      case 'Pass':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Pass (Conforme)
          </span>
        )
      case 'Fail':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Fail (Non Conforme)
          </span>
        )
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            En cours
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            <AlertCircle className="w-3.5 h-3.5" />
            Planifié
          </span>
        )
    }
  }

  const passCount = rows.filter((r) => r.status === 'Pass').length

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Plan de Validation et Rapport de Conception (DVP&R)</h3>
          <p className="text-sm text-muted-foreground">
            Design Verification Plan and Report - Suivi des essais physiques, thermiques, vibratoires et d'endurance
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter Essai DVP&R
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/80 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-4 py-3">ID & Intitulé de l'Essai</th>
              <th className="px-4 py-3">Norme / Spécification</th>
              <th className="px-4 py-3">Échantillons</th>
              <th className="px-4 py-3">Critères d'Acceptation</th>
              <th className="px-4 py-3">Laboratoire / Période</th>
              <th className="px-4 py-3">Statut & Résultats</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Aucun essai DVP&R enregistré.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-foreground block">{row.testName}</span>
                    <span className="text-xs font-mono text-primary">{row.id}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{row.specRef}</td>
                  <td className="px-4 py-3 font-semibold text-foreground text-xs">{row.sampleSize} pcs</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs">{row.acceptanceCriteria}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <span className="block font-medium text-foreground">{row.facility}</span>
                    <span>{row.startDate} → {row.endDate || 'En cours'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {getStatusBadge(row.status)}
                      <p className="text-[11px] text-muted-foreground">{row.resultSummary}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(row.id)}
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

      <div className="p-4 bg-muted/30 border border-border rounded-lg flex items-center justify-between">
        <span className="text-sm font-medium">
          Taux de validation DVP&R : <strong>{passCount} / {rows.length}</strong> essais validés avec succès
        </span>
        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${rows.length > 0 ? (passCount / rows.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-semibold text-foreground">Ajouter un Essai DVP&R</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-medium">Intitulé de l'Essai *</label>
                <input
                  type="text"
                  required
                  value={form.testName}
                  onChange={(e) => setForm({ ...form, testName: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Endurance Thermique -40°C / +125°C"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Norme / Spécification *</label>
                  <input
                    type="text"
                    required
                    value={form.specRef}
                    onChange={(e) => setForm({ ...form, specRef: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Ex: ISO 16750-4"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Taille d'Échantillon *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.sampleSize}
                    onChange={(e) => setForm({ ...form, sampleSize: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Critères d'Acceptation *</label>
                <textarea
                  required
                  rows={2}
                  value={form.acceptanceCriteria}
                  onChange={(e) => setForm({ ...form, acceptanceCriteria: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm resize-none"
                  placeholder="Ex: Aucune fissure, variation dimensionnelle < 0.1%"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Laboratoire d'Essais</label>
                  <input
                    type="text"
                    value={form.facility}
                    onChange={(e) => setForm({ ...form, facility: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Statut</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as DVPRRow['status'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="In Progress">In Progress (En cours)</option>
                    <option value="Pass">Pass (Conforme)</option>
                    <option value="Fail">Fail (Non conforme)</option>
                    <option value="Pending">Pending (En attente)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Synthèse des Résultats</label>
                <input
                  type="text"
                  value={form.resultSummary}
                  onChange={(e) => setForm({ ...form, resultSummary: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: 500 cycles thermiques validés sans anomalie"
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
