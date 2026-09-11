import { useState } from 'react'
import { CheckCircle2, Lock, Printer, Cog, ShieldCheck, FileSpreadsheet, Stamp, Check } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'
import { openOfficialPrintDocument } from '@/lib/deliverableExporter'

interface Phase3DeliverableProps {
  projectId: number
  onPhaseLocked?: () => void
}

export default function Phase3Deliverable({ projectId, onPhaseLocked }: Phase3DeliverableProps) {
  const { projects, projectData, lockPhase } = useAPQPStore()
  const project = projects.find((p) => p.id === projectId) || projects[0]
  
  if (!project) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Projet non trouvé. Veuillez sélectionner un projet valide.
      </div>
    )
  }
  
  const data = projectData[projectId]
  const isLocked = project?.lockedPhases?.includes(3)

  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleLock = () => {
    lockPhase(projectId, 3)
    if (onPhaseLocked) onPhaseLocked()
  }

  const handleExport = () => {
    setIsExporting(true)
    openOfficialPrintDocument(project, 3, data)
    setIsExporting(false)
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 4000)
  }

  const stepsCount = data?.processSteps?.length || 0
  const pfmeaCount = data?.pfmea?.length || 0
  const controlPlanCount = data?.controlPlan?.length || 0

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-mono text-xs font-bold rounded">
              GATE 03
            </span>
            <h3 className="text-lg font-bold text-foreground">
              Qualification Process (Livrable Phase 3)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Certification des moyens de production
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-lg hover:bg-muted transition-colors text-xs font-semibold shadow-xs"
          >
            <Printer className="w-4 h-4 text-primary" />
            {isExporting ? 'Génération...' : 'Générer Dossier Officiel Gate 3 (PDF)'}
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dossier officiel de qualification process Phase 3 validé et archivé.</span>
        </div>
      )}

      {/* Official Automotive Cartouche */}
      <div className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-xs">
        <div className="bg-muted/40 p-4 border-b border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block font-medium">Référence Document</span>
            <span className="font-mono font-bold text-foreground">DOC-APQP-G3-{project.partNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Ligne de Fabrication</span>
            <span className="font-bold text-foreground">Ilot Injection Plastique & Assemblage 02</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Statut OTOP (Off-Tool Off-Process)</span>
            <span className="font-bold text-emerald-600">QUALIFIÉ SÉRIE</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Autorisation Pré-Série PPAP</span>
            <span className="font-bold text-primary">RUN@RATE AUTORISÉ</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Process Flow & Equipment Qualification */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <Cog className="w-4 h-4 text-primary" />
                1. Synoptique de Fabrication (PFD) & Qualification des Outillages
              </h4>
              <span className="text-xs font-mono font-semibold text-emerald-600">{stepsCount} Postes Qualifiés</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Gamme de Fabrication</span>
                <span className="font-semibold text-foreground mt-0.5 block">Op 10 à Op 60 validées sans goulot</span>
              </div>
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Temps de Cycle Total</span>
                <span className="font-semibold text-foreground mt-0.5 block">32 s / pièce (Cadence nominale tenue)</span>
              </div>
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Moule & Outillages de Série</span>
                <span className="font-semibold text-foreground mt-0.5 block">Réception technique & métrologie OK</span>
              </div>
            </div>
          </div>

          {/* Section 2: PFMEA & Error-Proofing Verification */}
          <div className="space-y-3">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                2. AMDEC Processus (PFMEA) & Dispositifs Détrompeurs Poka-Yoké
              </h4>
              <span className="text-xs font-mono text-muted-foreground">{pfmeaCount} modes de défaillance maîtrisés</span>
            </div>

            <div className="border border-border rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-muted/60 text-muted-foreground uppercase font-semibold border-b border-border">
                  <tr>
                    <th className="px-4 py-2.5">Poste / Opération</th>
                    <th className="px-4 py-2.5">Risque Process Analysé</th>
                    <th className="px-4 py-2.5">Dispositif de Maîtrise / Poka-Yoké</th>
                    <th className="px-4 py-2.5">RPN Résiduel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">OP 10 - Séchage PBT</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Humidité résiduelle trop élevée</td>
                    <td className="px-4 py-2.5 text-foreground">Point de rosée auto -40°C avec verrouillage presse</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600 font-mono">RPN 32</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">OP 20 - Injection 200T</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Retassure ou manque matière</td>
                    <td className="px-4 py-2.5 text-foreground">Capteur pression cavité Kistler & volet de tri auto</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600 font-mono">RPN 42</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">OP 30 - Ultrasons M6</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Insert mal enfoncé / biaisé</td>
                    <td className="px-4 py-2.5 text-foreground">Palpeur laser de course LVDT en fin de cycle</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600 font-mono">RPN 48</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Control Plan & SOP Deployment */}
          <div className="space-y-3">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                3. Plan de Surveillance (Control Plan) & Standards de Travail Atelier
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-600">{controlPlanCount} Lignes Control Plan</span>
            </div>

            <div className="p-4 bg-muted/20 border border-border rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Déploiement des Fiches d'Instructions au Poste (SOP)</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">100% Déployé & Opérateurs Formés</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Le plan de surveillance couvre 100% des caractéristiques critiques CC/SC avec fréquence d'échantillonnage, cartes de contrôle SPC X-bar/R et plans de réaction documentés.
              </p>
            </div>
          </div>

          {/* Section 4: Official Committee Signatures */}
          <div className="space-y-3 pt-2">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <Stamp className="w-4 h-4 text-primary" />
                4. Approbation de Qualification Process & Autorisation Pré-Série (Gate 3 Sign-Off)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Responsable Méthodes & Industrialisation</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">T. Vasseur - Responsable Méthodes</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Moyens industriels réceptionnés
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Directeur d'Usine / Production</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">P. Martin - Direction Usine</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Capacité atelier validée
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Responsable Qualité Usine</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">M. Lefebvre - Assurance Qualité</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Control Plan & PFMEA validés
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs">
          <span className="text-muted-foreground">Statut du passage de jalon : </span>
          {isLocked ? (
            <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
              <Check className="w-4 h-4" /> Processus Industriel Qualifié & Prêt pour Pré-série PPAP
            </span>
          ) : (
            <span className="font-bold text-amber-600">Revue process validée - Prêt pour autorisation Gate 3</span>
          )}
        </div>
        {!isLocked && (
          <button
            onClick={handleLock}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            <Lock className="w-4 h-4" />
            Approuver & Verrouiller Formellement le Jalon 3 (Process Readiness)
          </button>
        )}
      </div>
    </div>
  )
}
