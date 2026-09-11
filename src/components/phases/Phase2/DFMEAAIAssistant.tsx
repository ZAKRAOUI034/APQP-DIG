import { useState } from 'react'
import { Sparkles, Loader2, Plus, X, AlertCircle } from 'lucide-react'
import { generateDFMEASuggestions, DFMEASuggestion } from '@/services/ai'
import { useAPQPStore } from '@/lib/store'

interface DFMEAAIAssistantProps {
  projectId: number
  onAddItems?: (items: DFMEASuggestion[]) => void
}

export default function DFMEAAIAssistant({ projectId, onAddItems }: DFMEAAIAssistantProps) {
  const { projects } = useAPQPStore()
  const project = projects.find((p) => p.id === projectId)
  
  const [isOpen, setIsOpen] = useState(false)
  const [itemDescription, setItemDescription] = useState('')
  const [material, setMaterial] = useState('')
  const [process, setProcess] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<DFMEASuggestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const handleGenerate = async () => {
    if (!itemDescription.trim()) {
      setError('Veuillez décrire le composant')
      return
    }

    setIsGenerating(true)
    setError(null)
    setSuggestions([])
    setSelectedItems(new Set())

    try {
      const results = await generateDFMEASuggestions(itemDescription, project?.partNumber ? {
        partNumber: project.partNumber,
        material: material || undefined,
        process: process || undefined,
      } : undefined)
      setSuggestions(results)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération des suggestions')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleToggleItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const handleAddSelected = () => {
    const itemsToAdd = suggestions.filter((item) => selectedItems.has(item.id))
    if (itemsToAdd.length > 0 && onAddItems) {
      onAddItems(itemsToAdd)
      setIsOpen(false)
      setItemDescription('')
      setMaterial('')
      setProcess('')
      setSuggestions([])
      setSelectedItems(new Set())
    }
  }

  const getRPNCColor = (rpn: number) => {
    if (rpn >= 100) return 'text-red-600 bg-red-50 dark:bg-red-950/20'
    if (rpn >= 50) return 'text-amber-600 bg-amber-50 dark:bg-amber-950/20'
    return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-600'
    if (severity >= 5) return 'text-amber-600'
    return 'text-emerald-600'
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
      >
        <Sparkles className="w-4 h-4" />
        Générer DFMEA avec IA
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Assistant IA DFMEA</h3>
              <p className="text-xs text-muted-foreground">Génération assistée par intelligence artificielle</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description du composant *
              </label>
              <textarea
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Ex: Support thermoplastique injecté pour capteur ultrasonique..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Matériau
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Ex: PBT-GF30"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Procédé
                </label>
                <input
                  type="text"
                  value={process}
                  onChange={(e) => setProcess(e.target.value)}
                  placeholder="Ex: Injection plastique"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Générer les suggestions DFMEA
                </>
              )}
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground">
                  Suggestions ({suggestions.length})
                </h4>
                <span className="text-xs text-muted-foreground">
                  {selectedItems.size} sélectionné(s)
                </span>
              </div>

              <div className="space-y-3">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedItems.has(item.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleToggleItem(item.id)}
                        className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground">{item.item}</h5>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.functionName}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${getRPNCColor(item.rpn)}`}>
                            RPN: {item.rpn}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Mode de défaillance:</span>
                            <p className="text-foreground">{item.failureMode}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Effet:</span>
                            <p className="text-foreground">{item.failureEffect}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cause:</span>
                            <p className="text-foreground">{item.cause}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Action recommandée:</span>
                            <p className="text-foreground">{item.recommendedAction}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">S:</span>
                            <span className={`font-bold ${getSeverityColor(item.severity)}`}>
                              {item.severity}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">O:</span>
                            <span className="font-bold text-foreground">{item.occurrence}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">D:</span>
                            <span className="font-bold text-foreground">{item.detection}</span>
                          </div>
                          {item.specialChar && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/30 text-red-600 rounded text-xs font-bold">
                              {item.specialChar}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {suggestions.length > 0 && (
          <div className="p-6 border-t border-border flex items-center justify-end gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleAddSelected}
              disabled={selectedItems.size === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Ajouter {selectedItems.size} élément(s)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
