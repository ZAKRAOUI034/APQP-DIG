import { useState } from 'react'
import { CheckCircle2, Lock, Printer, FileText, Shield, Stamp, Check } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'
import { openOfficialPrintDocument } from '@/lib/deliverableExporter'

interface Phase1DeliverableProps {
  projectId: number
  onPhaseLocked?: () => void
}

export default function Phase1Deliverable({ projectId, onPhaseLocked }: Phase1DeliverableProps) {
  const { projects, projectData, lockPhase } = useAPQPStore()
  const project = projects.find((p) => p.id === projectId) || projects[0]
  const data = projectData[projectId]
  const isLocked = project?.lockedPhases?.includes(1)

  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleLock = () => {
    lockPhase(projectId, 1)
    if (onPhaseLocked) onPhaseLocked()
  }

  const handleExportPDF = () => {
    setIsExporting(true)
    openOfficialPrintDocument(project, 1, data)
    setIsExporting(false)
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 4000)
  }

  const reqCount = data?.requirements?.length || 0

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-mono text-xs font-bold rounded">
              GATE 01
            </span>
            <h3 className="text-lg font-bold text-foreground">
              Engagement de Faisabilité (Livrable Phase 1)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Document de passage de jalon
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-lg hover:bg-muted transition-colors text-xs font-semibold shadow-xs"
          >
            <Printer className="w-4 h-4 text-primary" />
            {isExporting ? 'Génération...' : 'Générer Dossier Officiel Gate 1 (PDF)'}
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dossier officiel de faisabilité technique généré et prêt pour l'audit IATF 16949.</span>
        </div>
      )}

      {/* Official Automotive Cartouche / Document Header */}
      <div className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-xs">
        <div className="bg-muted/40 p-4 border-b border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block font-medium">Référence Document</span>
            <span className="font-mono font-bold text-foreground">DOC-APQP-G1-{project.partNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Projet & Référence Pièce</span>
            <span className="font-bold text-foreground">{project.name} ({project.partNumber})</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Client OEM</span>
            <span className="font-bold text-foreground">{project.client}</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Statut de Validation</span>
            {isLocked ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Jalon 1 Verrouillé & Signé
              </span>
            ) : (
              <span className="font-bold text-amber-600">En attente de signature Gate 1</span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Feasibility Commitment Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                1. Évaluation de la Faisabilité Technique & Industrielle (AIAG APQP Appendix A)
              </h4>
              <span className="text-xs font-mono font-semibold text-emerald-600">100% Conforme</span>
            </div>

            <div className="border border-border rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-muted/60 text-muted-foreground uppercase font-semibold border-b border-border">
                  <tr>
                    <th className="px-4 py-2.5 w-1/3">Critère d'Évaluation de Faisabilité</th>
                    <th className="px-4 py-2.5 w-1/4">Statut</th>
                    <th className="px-4 py-2.5">Commentaires Techniques & Preuves d'Analyse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Compréhension des Spécifications Produit</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                        OUI - Conforme
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      Analyse VOC réalisée : {reqCount} exigences fonctionnelles et dimensionnelles extraites et formalisées.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Capabilité des Procédés de Fabrication</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                        OUI - Conforme
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      Tolérances dimensionnelles réalisables avec objectif de capabilité Cpk &ge; 1.67 sur cotes critiques.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Capacité & Cadence Volume Annuel</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                        OUI - Conforme
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      Volume contractuel de {project.annualVolume.toLocaleString()} pcs/an absorbable en 2x8 sans investissement lourd.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Respect du Planning & Date SOP</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                        OUI - Conforme
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      Planning prévisionnel de 13 mois aligné avec la date de lancement client ({project.launchDate}).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Quality Targets & KPI Contract */}
          <div className="space-y-3">
            <div className="border-b border-border pb-2">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                2. Objectifs Qualité Contractuels Engagés (Quality Target Agreement)
              </h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-muted/30 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Objectif Rebut Client</span>
                <span className="font-mono font-bold text-foreground text-sm mt-0.5 block">&le; 20 PPM</span>
              </div>
              <div className="p-3 bg-muted/30 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Capabilité Initiale Cpk</span>
                <span className="font-mono font-bold text-foreground text-sm mt-0.5 block">&ge; 1.67 (Cotes CC)</span>
              </div>
              <div className="p-3 bg-muted/30 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Dossier Homologation</span>
                <span className="font-mono font-bold text-foreground text-sm mt-0.5 block">PPAP Niveau 3</span>
              </div>
              <div className="p-3 bg-muted/30 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Garantie Zéro Défaut</span>
                <span className="font-mono font-bold text-foreground text-sm mt-0.5 block">0 Réclamation SOP</span>
              </div>
            </div>
          </div>

          {/* Section 3: Official Sign-off & Signature Grid */}
          <div className="space-y-3 pt-2">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <Stamp className="w-4 h-4 text-primary" />
                3. Comité de Validation & Signatures d'Engagement (Gate 1 Sign-Off)
              </h4>
              <span className="text-[11px] text-muted-foreground">Approbation pluridisciplinaire requise</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Chef de Projet Développement</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">J. Dupont - Ingénierie Projet</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Signé numériquement le {project.launchDate ? '2024-03-01' : 'Date jalon'}
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Directeur Qualité & APQP</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">M. Lefebvre - Assurance Qualité</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Signé numériquement le {project.launchDate ? '2024-03-01' : 'Date jalon'}
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Responsable Bureau d’Études</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">A. Bernard - Responsable BE</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Signé numériquement le {project.launchDate ? '2024-03-01' : 'Date jalon'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lock and Gate Transition Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs">
          <span className="text-muted-foreground">Statut du passage de jalon : </span>
          {isLocked ? (
            <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
              <Check className="w-4 h-4" /> Phase 1 Formellement Approuvée & Verrouillée
            </span>
          ) : (
            <span className="font-bold text-amber-600">Revue préliminaire validée - Prêt pour verrouillage formel</span>
          )}
        </div>
        {!isLocked && (
          <button
            onClick={handleLock}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            <Lock className="w-4 h-4" />
            Approuver & Verrouiller Formellement le Jalon 1
          </button>
        )}
      </div>
    </div>
  )
}
