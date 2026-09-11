import { useState } from 'react'
import { Plus, Trash2, ShieldAlert, Star, ShieldCheck, X } from 'lucide-react'
import { useAPQPStore, CCSCItem } from '@/lib/store'

interface CCSCMatrixProps {
  projectId: number
}

export default function CCSCMatrix({ projectId }: CCSCMatrixProps) {
  const { projectData, setCCSC } = useAPQPStore()
  const items = projectData[projectId]?.ccsc || []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<CCSCItem>({
    id: '',
    charNumber: '',
    description: '',
    classification: 'CC',
    productSpec: '',
    processParameter: '',
    inspectionMethod: '',
    fmeaRef: '',
  })

  const openAddModal = () => {
    setForm({
      id: `CCSC-${Date.now()}`,
      charNumber: `CC-${items.length + 1}`,
      description: '',
      classification: 'CC',
      productSpec: '',
      processParameter: '',
      inspectionMethod: 'Contrôle tridimensionnel CMM',
      fmeaRef: 'DFM-01',
    })
    setIsModalOpen(true)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setCCSC(projectId, [...items, form])
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setCCSC(projectId, items.filter((i) => i.id !== id))
  }

  const getBadge = (classification: CCSCItem['classification']) => {
    switch (classification) {
      case 'CC':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            CC (Sécurité / Safety ∇)
          </span>
        )
      case 'SC':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Star className="w-3.5 h-3.5 text-amber-600" />
            SC (Fit / Fonction)
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            HQC (Qualité Clé)
          </span>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Matrice des Caractéristiques Spéciales (CC / SC)</h3>
          <p className="text-sm text-muted-foreground">
            Caractéristiques critiques et fonctionnelles
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter Caractéristique Spéciale
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/80 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-4 py-3">Symbole & Réf</th>
              <th className="px-4 py-3">Désignation Caractéristique</th>
              <th className="px-4 py-3">Spécification Produit</th>
              <th className="px-4 py-3">Paramètre Process Clé</th>
              <th className="px-4 py-3">Méthode de Contrôle</th>
              <th className="px-4 py-3">Lien DFMEA</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Aucune caractéristique spéciale répertoriée.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">{getBadge(item.classification)}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{item.description}</td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground bg-muted/20">
                    {item.productSpec}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{item.processParameter}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{item.inspectionMethod}</td>
                  <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">{item.fmeaRef}</td>
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
              <h4 className="font-semibold text-foreground">Ajouter une Caractéristique Spéciale</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Classification *</label>
                  <select
                    value={form.classification}
                    onChange={(e) => setForm({ ...form, classification: e.target.value as CCSCItem['classification'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="CC">CC (Critique Sécurité ∇)</option>
                    <option value="SC">SC (Significative Fonctionnelle)</option>
                    <option value="HQC">HQC (High Quality Characteristic)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Réf DFMEA</label>
                  <input
                    type="text"
                    value={form.fmeaRef}
                    onChange={(e) => setForm({ ...form, fmeaRef: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                    placeholder="Ex: DFM-02"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Description Caractéristique *</label>
                <input
                  type="text"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Couple de serrage vis M6 sans rupture"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Spécification Produit *</label>
                <input
                  type="text"
                  required
                  value={form.productSpec}
                  onChange={(e) => setForm({ ...form, productSpec: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                  placeholder="Ex: Couple ≥ 12.0 Nm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Paramètre Process Associé</label>
                <input
                  type="text"
                  value={form.processParameter}
                  onChange={(e) => setForm({ ...form, processParameter: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Température de fusion matière 280°C"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Méthode de Contrôle</label>
                <input
                  type="text"
                  value={form.inspectionMethod}
                  onChange={(e) => setForm({ ...form, inspectionMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Clé dynamométrique étalonnée"
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
