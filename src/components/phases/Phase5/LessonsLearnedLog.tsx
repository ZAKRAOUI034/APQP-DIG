import { useState } from 'react'
import { Plus, BookOpen, Lightbulb, Search, Trash2, X, Tag } from 'lucide-react'
import { useAPQPStore, LessonLearned } from '@/lib/store'

interface LessonsLearnedLogProps {
  projectId: number
}

export default function LessonsLearnedLog({ projectId }: LessonsLearnedLogProps) {
  const { projectData, addLessonLearned, setLessonsLearned } = useAPQPStore()
  const items = projectData[projectId]?.lessonsLearned || []

  const [searchTerm, setSearchTerm] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<Omit<LessonLearned, 'id' | 'date'>>({
    category: 'Design',
    phase: 2,
    problemSummary: '',
    rootCause: '',
    recommendation: '',
    projectOrigin: 'Projet SCS-2024',
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addLessonLearned(projectId, {
      id: `LL-${Date.now()}`,
      ...form,
      date: new Date().toISOString().split('T')[0]
    })
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setLessonsLearned(projectId, items.filter((i) => i.id !== id))
  }

  const filtered = items.filter((item) => {
    if (filterCat !== 'all' && item.category !== filterCat) return false
    if (searchTerm) {
      const match = `${item.problemSummary} ${item.rootCause} ${item.recommendation}`.toLowerCase()
      return match.includes(searchTerm.toLowerCase())
    }
    return true
  })

  const getCategoryColor = (cat: LessonLearned['category']) => {
    switch (cat) {
      case 'Design':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
      case 'Process':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
      case 'Tooling':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Base de Connaissances & Leçons Apprises (LLKB)</h3>
          <p className="text-sm text-muted-foreground">
            Capitalisation des retours d'expérience et bonnes pratiques pour les futurs projets APQP (IATF §7.1.6)
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-sm bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Enregistrer une Leçon Apprise
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/40 border border-border rounded-lg text-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par mot-clé, cause racine ou recommandation..."
            className="w-full pl-9 pr-3 py-1.5 bg-card border border-input rounded text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-1.5 bg-card border border-input rounded text-sm"
        >
          <option value="all">Toutes les catégories</option>
          <option value="Design">Design / Conception</option>
          <option value="Process">Processus / Fabrication</option>
          <option value="Tooling">Outillages & Moules</option>
          <option value="Quality">Qualité & Métrologie</option>
        </select>
      </div>

      {/* Lessons Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-card border border-border rounded-xl text-muted-foreground text-sm">
            Aucune leçon apprise trouvée correspondant à la recherche.
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">Phase {item.phase}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-bold text-foreground text-sm">{item.problemSummary}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong>Cause identifiée :</strong> {item.rootCause}
                </p>

                <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Règle de Standardisation Recommandée :
                  </span>
                  <p className="text-xs text-foreground mt-1 leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Origine : {item.projectOrigin}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-semibold text-foreground">Nouvelle Leçon Apprise</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Catégorie *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as LessonLearned['category'] })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  >
                    <option value="Design">Design / Conception</option>
                    <option value="Process">Processus / Fabrication</option>
                    <option value="Tooling">Outillages & Moules</option>
                    <option value="Supplier">Fournisseur</option>
                    <option value="Quality">Qualité</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Phase APQP concernée</label>
                  <select
                    value={form.phase}
                    onChange={(e) => setForm({ ...form, phase: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                  >
                    <option value={1}>Phase 1 - Planification</option>
                    <option value={2}>Phase 2 - Conception Produit</option>
                    <option value={3}>Phase 3 - Conception Processus</option>
                    <option value={4}>Phase 4 - Validation & PPAP</option>
                    <option value={5}>Phase 5 - Production Série</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Problème ou Risque Rencontré *</label>
                <input
                  type="text"
                  required
                  value={form.problemSummary}
                  onChange={(e) => setForm({ ...form, problemSummary: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  placeholder="Ex: Rayon de congé trop faible causant fragilité au grand froid"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Cause Racine Identifiée *</label>
                <textarea
                  required
                  rows={2}
                  value={form.rootCause}
                  onChange={(e) => setForm({ ...form, rootCause: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm resize-none"
                  placeholder="Ex: Absence de prise en compte des chocs thermiques dynamiques à -40°C"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Recommandation & Règle Métier pour les futurs projets *</label>
                <textarea
                  required
                  rows={3}
                  value={form.recommendation}
                  onChange={(e) => setForm({ ...form, recommendation: e.target.value })}
                  className="w-full px-3 py-2 bg-card border border-input rounded text-sm resize-none"
                  placeholder="Ex: Toujours imposer un rayon de congé minimum R ≥ 0.8 mm sur les clips flexibles"
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
