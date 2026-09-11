import { useState } from 'react'
import { Plus, Trash2, ShieldAlert, CheckCircle2, ShieldCheck, X } from 'lucide-react'
import { useAPQPStore, ControlPlanRow } from '@/lib/store'

interface ControlPlanTableProps {
  projectId: number
}

export default function ControlPlanTable({ projectId }: ControlPlanTableProps) {
  const { projectData, setControlPlan } = useAPQPStore()
  const rows = projectData[projectId]?.controlPlan || []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<ControlPlanRow>({
    id: '',
    stepNumber: '20',
    operation: 'Injection plastique 200T',
    machine: 'Engel 200T',
    charNumber: '2.1',
    productChar: 'Poids pièce / Aspect',
    processChar: 'Pression maintien 720 bar',
    specialCharType: 'CC',
    specification: '42.5 ± 1.2 g',
    evalTechnique: 'Balance de précision 0.01g',
    sampleSize: '5 pièces',
    sampleFreq: 'Début, milieu et fin de poste',
    controlMethod: 'Carte SPC X-bar/R',
    reactionPlan: 'Ajuster maintien, isoler le lot 50 pcs',
  })

  const openAddModal = () => {
    setForm({
      id: `CP-${Date.now()}`,
      stepNumber: '30',
      operation: 'Insertion ultrasonique',
      machine: 'Branson 20kHz',
      charNumber: '3.1',
      productChar: 'Hauteur affleurement insert',
      processChar: 'Énergie de soudage 350 J',
      specialCharType: 'CC',
      specification: '0.00 / -0.10 mm',
      evalTechnique: 'Palpeur numérique LVDT',
      sampleSize: '100%',
      sampleFreq: 'Chaque pièce',
      controlMethod: 'Poka-yoké tri automatique',
      reactionPlan: 'Rejet au bac rouge verrouillé',
    })
    setIsModalOpen(true)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setControlPlan(projectId, [...rows, form])
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setControlPlan(projectId, rows.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Plan de Surveillance (Control Plan) - IATF 16949 / AIAG</h3>
          <p className="text-sm text-muted-foreground">
            Spécifications, méthodes de mesure, fréquences d'échantillonnage et plans de réaction en cas de dérive
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter Ligne Control Plan
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-left text-xs min-w-[1000px]">
          <thead className="bg-muted/80 text-muted-foreground uppercase border-b border-border font-semibold">
            <tr>
              <th className="px-3 py-3">Opération & Machine</th>
              <th className="px-3 py-3">Caractéristique Produit</th>
              <th className="px-3 py-3">Paramètre Process</th>
              <th className="px-3 py-3">Classe</th>
              <th className="px-3 py-3">Spécification & Tolérance</th>
              <th className="px-3 py-3">Moyen de Contrôle</th>
              <th className="px-3 py-3">Échantillonnage</th>
              <th className="px-3 py-3">Méthode de Maîtrise</th>
              <th className="px-3 py-3">Plan de Réaction</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  Aucun plan de surveillance défini. Cliquez sur "Ajouter Ligne Control Plan".
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs font-bold text-primary block">OP {row.stepNumber} - {row.operation}</span>
                    <span className="text-muted-foreground text-[11px]">{row.machine}</span>
                  </td>
                  <td className="px-3 py-3 font-medium text-foreground">{row.productChar}</td>
                  <td className="px-3 py-3 text-muted-foreground">{row.processChar}</td>
                  <td className="px-3 py-3">
                    {row.specialCharType ? (
                      <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                        {row.specialCharType}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-3 py-3 font-mono font-semibold text-foreground bg-muted/20">
                    {row.specification}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{row.evalTechnique}</td>
                  <td className="px-3 py-3">
                    <span className="text-foreground font-medium block">{row.sampleSize}</span>
                    <span className="text-muted-foreground text-[10px]">{row.sampleFreq}</span>
                  </td>
                  <td className="px-3 py-3 font-medium text-blue-600 dark:text-blue-400">{row.controlMethod}</td>
                  <td className="px-3 py-3 text-red-600 dark:text-red-400 font-medium max-w-xs">{row.reactionPlan}</td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-semibold text-foreground">Ajouter une Ligne au Plan de Surveillance</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-4">
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
                  <label className="text-xs font-medium">Nom Opération *</label>
                  <input
                    type="text"
                    required
                    value={form.operation}
                    onChange={(e) => setForm({ ...form, operation: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Machine</label>
                  <input
                    type="text"
                    value={form.machine}
                    onChange={(e) => setForm({ ...form, machine: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Caractéristique Produit *</label>
                  <input
                    type="text"
                    required
                    value={form.productChar}
                    onChange={(e) => setForm({ ...form, productChar: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Paramètre Process Clé</label>
                  <input
                    type="text"
                    value={form.processChar}
                    onChange={(e) => setForm({ ...form, processChar: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Spécification & Tolérance *</label>
                  <input
                    type="text"
                    required
                    value={form.specification}
                    onChange={(e) => setForm({ ...form, specification: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Caractéristique Spéciale</label>
                  <select
                    value={form.specialCharType}
                    onChange={(e) => setForm({ ...form, specialCharType: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="">Standard</option>
                    <option value="CC">CC (Sécurité)</option>
                    <option value="SC">SC (Fonction)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Moyen de Contrôle *</label>
                  <input
                    type="text"
                    required
                    value={form.evalTechnique}
                    onChange={(e) => setForm({ ...form, evalTechnique: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Taille Échantillon</label>
                  <input
                    type="text"
                    value={form.sampleSize}
                    onChange={(e) => setForm({ ...form, sampleSize: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Fréquence</label>
                  <input
                    type="text"
                    value={form.sampleFreq}
                    onChange={(e) => setForm({ ...form, sampleFreq: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Méthode de Maîtrise *</label>
                <input
                  type="text"
                  required
                  value={form.controlMethod}
                  onChange={(e) => setForm({ ...form, controlMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Carte de contrôle SPC X-bar/R ou Poka-yoké"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Plan de Réaction (en cas de hors-tolérance) *</label>
                <input
                  type="text"
                  required
                  value={form.reactionPlan}
                  onChange={(e) => setForm({ ...form, reactionPlan: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Isoler le lot, alerter régleur, stopper la ligne"
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
