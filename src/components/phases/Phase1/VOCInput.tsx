import { useState } from 'react'
import { Upload, Sparkles, CheckCircle2, FileText, Zap, RefreshCw } from 'lucide-react'
import { useAPQPStore, Requirement } from '@/lib/store'

interface VOCInputProps {
  projectId: number
  onNavigateToMatrix?: () => void
}

export default function VOCInput({ projectId, onNavigateToMatrix }: VOCInputProps) {
  const { projectData, setVOCText, setRequirements } = useAPQPStore()
  const currentData = projectData[projectId]
  const [vocTextLocal, setVocTextLocal] = useState(currentData?.vocText || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCount, setGeneratedCount] = useState<number | null>(null)

  const handleGenerateRequirements = () => {
    setIsGenerating(true)
    setVOCText(projectId, vocTextLocal)

    setTimeout(() => {
      // Parse structured requirements intelligently from the text lines
      const lines = vocTextLocal
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 5)

      const extracted: Requirement[] = lines.map((line, idx) => {
        const cleanLine = line.replace(/^\d+[\.\-\)]\s*/, '')
        let type: Requirement['type'] = 'fonctionnelle'
        let criticality: Requirement['criticality'] = 'high'
        let verification = 'Essai de validation'

        if (/température|thermique|chaleur|froid/i.test(cleanLine)) {
          type = 'fonctionnelle'
          criticality = 'high'
          verification = 'Essai en étuve climatique (ISO 16750-4)'
        } else if (/dimension|cote|mm|diamètre|épaisseur|planéité|entraxe|couple/i.test(cleanLine)) {
          type = 'dimensionnelle'
          criticality = 'critical'
          verification = 'Contrôle tridimensionnel CMM / Banc dynamométrique'
        } else if (/ip67|ip69|norme|réglement|sécurité|asil|cispr|ce/i.test(cleanLine)) {
          type = 'réglementaire'
          criticality = 'critical'
          verification = 'Certification laboratoire accrédité ISO 17025'
        } else if (/aspect|bavure|couleur|classe|retassure|grain/i.test(cleanLine)) {
          type = 'esthétique'
          criticality = 'medium'
          verification = 'Contrôle visuel sous éclairage D65 & profilomètre'
        }

        return {
          id: `REQ-00${idx + 1}`,
          source: `VOC: ${cleanLine.slice(0, 30)}...`,
          characteristic: cleanLine.split(':')[0] || `Exigence ${idx + 1}`,
          type,
          specification: cleanLine.split(':')[1]?.trim() || cleanLine,
          criticality,
          verification
        }
      })

      if (extracted.length === 0) {
        // Fallback default
        extracted.push({
          id: 'REQ-001',
          source: 'VOC Analyse',
          characteristic: 'Spécification globale',
          type: 'fonctionnelle',
          specification: vocTextLocal.slice(0, 60),
          criticality: 'high',
          verification: 'Banc d’essais'
        })
      }

      setRequirements(projectId, extracted)
      setIsGenerating(false)
      setGeneratedCount(extracted.length)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Voice of Customer (VOC) & Cahier des Charges</h3>
        <p className="text-sm text-muted-foreground">
          Saisissez les exigences brutes du client ou chargez une spécification technique
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center justify-between">
          <span>Texte des exigences client (VOC) *</span>
          <span className="text-xs text-muted-foreground font-normal">
            Détection automatique des exigences
          </span>
        </label>
        <textarea
          value={vocTextLocal}
          onChange={(e) => {
            setVocTextLocal(e.target.value)
            setVOCText(projectId, e.target.value)
          }}
          rows={7}
          className="w-full px-4 py-3 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono text-sm leading-relaxed"
          placeholder="Ex: Le support doit résister aux vibrations moteur, température -40°C à +125°C, fixation M6 avec couple 8.5 Nm, étanchéité IP67, aspect classe B sans bavure > 0.05 mm, Cpk ≥ 1.67..."
        />
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-muted/20">
        <Upload className="w-7 h-7 mx-auto text-primary mb-2 opacity-80" />
        <p className="text-sm font-medium text-foreground">
          Glissez-déposez le cahier des charges client
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, DOCX, TXT
        </p>
      </div>

      {generatedCount !== null && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                Extraction IA terminée avec succès !
              </p>
              <p className="text-xs text-green-800/80 dark:text-green-300">
                {generatedCount} exigences structurées ont été extraites et injectées dans la Matrice des Exigences.
              </p>
            </div>
          </div>
          {onNavigateToMatrix && (
            <button
              onClick={onNavigateToMatrix}
              className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Consulter la matrice →
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-muted/60 border border-border rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Assistant IA Génératif APQP</p>
            <p className="text-xs text-muted-foreground">
              Analyse et classification des exigences
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerateRequirements}
          disabled={!vocTextLocal.trim() || isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Extraction & Structuration...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Générer Matrice Exigences
            </>
          )}
        </button>
      </div>
    </div>
  )
}
