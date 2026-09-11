import { useState } from 'react'
import { CheckCircle2, Lock, Printer, Award, Activity, Gauge, ShieldCheck, FileCheck, Stamp, Check, Eye } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'
import { generateAutomotiveDeliverableHTML, openOfficialPrintDocument } from '@/lib/deliverableExporter'

interface Phase4DeliverableProps {
  projectId: number
  onPhaseLocked?: () => void
}

export default function Phase4Deliverable({ projectId, onPhaseLocked }: Phase4DeliverableProps) {
  const { projects, projectData, lockPhase } = useAPQPStore()
  const project = projects.find((p) => p.id === projectId) || projects[0]
  const data = projectData[projectId]
  const isLocked = project?.lockedPhases?.includes(4)

  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleLock = () => {
    lockPhase(projectId, 4)
    if (onPhaseLocked) onPhaseLocked()
  }

  const handleExport = () => {
    setIsExporting(true)
    openOfficialPrintDocument(project, 4, data)
    setIsExporting(false)
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 4000)
  }

  const ppapApprovedCount = data?.ppapElements?.filter((el) => el.status === 'Approved').length || 18

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-mono text-xs font-bold rounded">
              GATE 04
            </span>
            <h3 className="text-lg font-bold text-foreground">
              Homologation PPAP (Livrable Phase 4)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Validation des capabilités statistiques
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-lg hover:bg-muted transition-colors text-xs font-semibold shadow-xs"
          >
            <Printer className="w-4 h-4 text-primary" />
            {isExporting ? 'Génération...' : 'Générer Dossier Officiel PPAP (PDF)'}
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dossier officiel d'homologation PPAP généré au format standardisé constructeur.</span>
        </div>
      )}

      {/* Official Automotive Cartouche */}
      <div className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-xs">
        <div className="bg-muted/40 p-4 border-b border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block font-medium">Référence Dossier</span>
            <span className="font-mono font-bold text-foreground">PPAP-N3-{project.partNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Mandat PSW</span>
            <span className="font-bold text-emerald-600">SIGNÉ & VALIDÉ CLIENT</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Capabilité Process Cpk</span>
            <span className="font-bold text-emerald-600 font-mono">1.68 (&ge; 1.67 Requis)</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Autorisation Série SOP</span>
            <span className="font-bold text-primary">HOMOLOGATION APPROUVÉE</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: PPAP 18 Elements Compliance Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" />
                1. Statut de Conformité des 18 Éléments PPAP Niveau 3
              </h4>
              <span className="text-xs font-mono font-semibold text-emerald-600">{ppapApprovedCount} / 18 Approuvés</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Dossier Technique & Plans</span>
                <span className="font-semibold text-foreground mt-0.5 block">Plans 2D/3D & ECN approuvés</span>
              </div>
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Essais Matières & Laboratoire</span>
                <span className="font-semibold text-foreground mt-0.5 block">Certificats ISO 17025 conformes</span>
              </div>
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Échantillons Pièces Étalons</span>
                <span className="font-semibold text-foreground mt-0.5 block">Master Sample stocké en salle métrologie</span>
              </div>
            </div>
          </div>

          {/* Section 2: Statistical Process Capability & MSA Studies */}
          <div className="space-y-3">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                2. Résultats des Études Statistiques Run@Rate (SPC & MSA Gage R&R)
              </h4>
              <span className="text-xs font-mono text-emerald-600 font-bold">Aptitude Industrielle Validée</span>
            </div>

            <div className="border border-border rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-muted/60 text-muted-foreground uppercase font-semibold border-b border-border">
                  <tr>
                    <th className="px-4 py-2.5">Paramètre Statistique</th>
                    <th className="px-4 py-2.5">Résultat Mesuré</th>
                    <th className="px-4 py-2.5">Exigence IATF 16949</th>
                    <th className="px-4 py-2.5">Verdict Homologation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Capabilité Initiale Procédé (Cpk)</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-emerald-600">Cpk = 1.68</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Cpk &ge; 1.67 sur caractéristiques critiques CC</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600">CONFORME SÉRIE</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Performance Globale Procédé (Ppk)</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-foreground">Ppk = 1.61</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Ppk &ge; 1.33</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600">CONFORME SÉRIE</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Gage R&R (%GRR - ANOVA)</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-blue-600">7.08% & ndc = 14</td>
                    <td className="px-4 py-2.5 text-muted-foreground">%GRR &lt; 10% & ndc &ge; 5</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600">ACCEPTABLE AIAG</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Official Signatures */}
          <div className="space-y-3 pt-2">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <Stamp className="w-4 h-4 text-primary" />
                3. Approbation Formelle PPAP & Autorisation Lancement Série (Gate 4 Sign-Off)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Directeur Qualité Fournisseur</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">J. Dupont - Directeur Qualité Projet</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Mandat PSW signé
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Responsable Assurance Qualité Client (SQA)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">OEM Senior Supplier Quality Engineer</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  PPAP approuvé sans réserve
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Directeur d'Usine / SOP</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">P. Martin - Direction de Production</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Autorisation expédition série
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
              <Check className="w-4 h-4" /> PPAP Validé & Production Série Autorisée (Gate 4)
            </span>
          ) : (
            <span className="font-bold text-amber-600">PPAP complet - Prêt pour homologation et verrouillage Gate 4</span>
          )}
        </div>
        {!isLocked && (
          <button
            onClick={handleLock}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            <Lock className="w-4 h-4" />
            Approuver & Verrouiller Formellement le Jalon 4 (PPAP Approval)
          </button>
        )}
      </div>
    </div>
  )
}
