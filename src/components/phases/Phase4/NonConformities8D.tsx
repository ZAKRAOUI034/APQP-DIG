import { useState } from 'react'
import { AlertCircle, CheckCircle2, Users, ShieldAlert, Sparkles, ChevronRight, Plus, HelpCircle, Save, Check } from 'lucide-react'
import { useAPQPStore, Case8D } from '@/lib/store'

interface NonConformities8DProps {
  projectId: number
}

export default function NonConformities8D({ projectId }: NonConformities8DProps) {
  const { projectData, updateCase8D, setCases8D } = useAPQPStore()
  const cases = projectData[projectId]?.cases8D || []

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '')
  const [activeDStep, setActiveDStep] = useState<number>(4) // Default to D4 (Root Cause)
  const [isSaved, setIsSaved] = useState(false)

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0]

  const handleCreateNew8D = () => {
    const newCase: Case8D = {
      id: `8D-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, '0')}`,
      title: 'Déviation dimensionnelle constatée lors du Run@Rate',
      partNumber: 'SCS-2024-045',
      openedDate: new Date().toISOString().split('T')[0],
      status: 'Open',
      champion: 'Responsable Qualité Projet',
      d1Team: ['Ingénieur Qualité', 'Chef de Projet Méthodes', 'Régleur Presse'],
      d2Problem: 'Observation de variations de cote sur 12 pièces lors du lot pilote.',
      d3Containment: 'Tri 100% au poste de contrôle final et isolement du bac.',
      d4RootCause5Why: [
        '1. Pourquoi ? -> Dérive thermique moule.',
        '2. Pourquoi ? -> Débit d’eau de refroidissement ralenti.',
        '3. Pourquoi ? -> Encrassement du filtre du circuit d’eau.',
        '4. Pourquoi ? -> Maintenance préventive semestrielle non réalisée.',
        '5. Cause racine -> Absence d’alerte automatique de colmatage filtre.'
      ],
      d5CorrectiveActions: 'Installation d’un capteur de pression différentielle sur le circuit d’eau.',
      d6Verification: 'Essai continu sur 1000 pièces avec température régulée à ± 1°C.',
      d7PreventRecurrence: 'Standardisation de la vérification TPM dans la check-list hebdo.',
      d8Congratulate: 'Reconnaissance de l’équipe de maintenance pour l’intervention rapide.'
    }

    setCases8D(projectId, [...cases, newCase])
    setSelectedCaseId(newCase.id)
  }

  const handleUpdate = (partial: Partial<Case8D>) => {
    if (!activeCase) return
    updateCase8D(projectId, activeCase.id, partial)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  if (!activeCase) {
    return (
      <div className="text-center py-12 space-y-4 bg-card border border-border rounded-lg p-8">
        <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto" />
        <h4 className="font-semibold text-foreground text-lg">Aucun dossier 8D ouvert</h4>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Aucune non-conformité majeure n'a été déclarée sur ce projet. Vous pouvez ouvrir un dossier 8D en cas d'écart.
        </p>
        <button
          onClick={handleCreateNew8D}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          Ouvrir un Dossier 8D
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Résolution de Problème 8D (Eight Disciplines)</h3>
          <p className="text-sm text-muted-foreground">
            Méthodologie standard automobile pour le traitement des non-conformités et l'éradication des causes racines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNew8D}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-medium rounded border border-border transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouveau Dossier 8D
          </button>
          <button
            onClick={() => handleUpdate({})}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors text-sm shadow-sm"
          >
            {isSaved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Enregistré !' : 'Enregistrer 8D'}
          </button>
        </div>
      </div>

      {/* 8D Header Info Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-xs bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-2.5 py-1 rounded">
              {activeCase.id}
            </span>
            <h4 className="font-bold text-foreground text-base">{activeCase.title}</h4>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Statut : {activeCase.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block">Référence Pièce</span>
            <span className="font-mono font-bold text-foreground">{activeCase.partNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Date d'Ouverture</span>
            <span className="font-medium text-foreground">{activeCase.openedDate}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Pilote 8D (Champion)</span>
            <span className="font-medium text-foreground">{activeCase.champion}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Membres Équipe</span>
            <span className="font-medium text-foreground">{activeCase.d1Team.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* 8D Step Tabs D1 - D8 */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-muted/40 border border-border rounded-lg">
        {[
          { num: 1, name: 'D1 Équipe' },
          { num: 2, name: 'D2 Problème' },
          { num: 3, name: 'D3 Confinement' },
          { num: 4, name: 'D4 5-Pourquoi' },
          { num: 5, name: 'D5 Actions CAPA' },
          { num: 6, name: 'D6 Vérification' },
          { num: 7, name: 'D7 Prévention' },
          { num: 8, name: 'D8 Clôture' },
        ].map((step) => (
          <button
            key={step.num}
            onClick={() => setActiveDStep(step.num)}
            className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
              activeDStep === step.num
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {step.name}
          </button>
        ))}
      </div>

      {/* Step Content Area */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        {activeDStep === 1 && (
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-foreground">D1 : Constitution de l'Équipe Pluridisciplinaire</h5>
            <p className="text-xs text-muted-foreground">
              Désignez le pilote 8D et les experts impliqués (Qualité, Production, Méthodes, BE, Fournisseurs).
            </p>
            <textarea
              rows={4}
              value={activeCase.d1Team.join('\n')}
              onChange={(e) => handleUpdate({ d1Team: e.target.value.split('\n').filter(Boolean) })}
              className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
              placeholder="Un membre par ligne"
            />
          </div>
        )}

        {activeDStep === 2 && (
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-foreground">D2 : Description Précise du Problème (QQOQCCP)</h5>
            <p className="text-xs text-muted-foreground">
              Décrivez le symptôme, le lieu, la date, la fréquence et l'impact quantifié sur le produit.
            </p>
            <textarea
              rows={4}
              value={activeCase.d2Problem}
              onChange={(e) => handleUpdate({ d2Problem: e.target.value })}
              className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
            />
          </div>
        )}

        {activeDStep === 3 && (
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-foreground">D3 : Plan d'Actions Immédiates de Confinement (Sécurisation Client)</h5>
            <p className="text-xs text-muted-foreground">
              Isolement des stocks usine, tri en transit, mur qualité ou alerte client sous 24h.
            </p>
            <textarea
              rows={4}
              value={activeCase.d3Containment}
              onChange={(e) => handleUpdate({ d3Containment: e.target.value })}
              className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
            />
          </div>
        )}

        {activeDStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-sm text-foreground">D4 : Analyse des Causes Racines (Méthode des 5 Pourquoi & Ishikawa)</h5>
                <p className="text-xs text-muted-foreground">
                  Remontez à la cause racine fondamentale à l'origine du défaut d'occurrence et du défaut de détection.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {activeCase.d4RootCause5Why.map((why, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    W{index + 1}
                  </span>
                  <input
                    type="text"
                    value={why}
                    onChange={(e) => {
                      const updated = [...activeCase.d4RootCause5Why]
                      updated[index] = e.target.value
                      handleUpdate({ d4RootCause5Why: updated })
                    }}
                    className="flex-1 px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeDStep === 5 && (
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-foreground">D5 : Choix & Implémentation des Actions Correctives Permanentes (CAPA)</h5>
            <p className="text-xs text-muted-foreground">
              Actions physiques ou logicielles définitives pour éliminer la cause racine identifiée en D4.
            </p>
            <textarea
              rows={4}
              value={activeCase.d5CorrectiveActions}
              onChange={(e) => handleUpdate({ d5CorrectiveActions: e.target.value })}
              className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
            />
          </div>
        )}

        {activeDStep === 6 && (
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-foreground">D6 : Validation de l'Efficacité des Actions</h5>
            <p className="text-xs text-muted-foreground">
              Preuves chiffrées (SPC, suivi d'indicateurs rebuts sur 1000+ pièces) attestant de la disparition du problème.
            </p>
            <textarea
              rows={4}
              value={activeCase.d6Verification}
              onChange={(e) => handleUpdate({ d6Verification: e.target.value })}
              className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
            />
          </div>
        )}

        {activeDStep === 7 && (
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-foreground">D7 : Prévention de la Récurrence & Standardisation</h5>
            <p className="text-xs text-muted-foreground">
              Mise à jour des AMDEC (DFMEA/PFMEA), du Plan de Surveillance et des procédures de maintenance TPM.
            </p>
            <textarea
              rows={4}
              value={activeCase.d7PreventRecurrence}
              onChange={(e) => handleUpdate({ d7PreventRecurrence: e.target.value })}
              className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
            />
          </div>
        )}

        {activeDStep === 8 && (
          <div className="space-y-3">
            <h5 className="font-bold text-sm text-foreground">D8 : Clôture Formelle & Félicitations de l'Équipe</h5>
            <p className="text-xs text-muted-foreground">
              Reconnaissance des contributions et clôture définitive du dossier avec le client.
            </p>
            <textarea
              rows={4}
              value={activeCase.d8Congratulate}
              onChange={(e) => handleUpdate({ d8Congratulate: e.target.value })}
              className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
            />
          </div>
        )}
      </div>
    </div>
  )
}
