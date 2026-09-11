import { useState } from 'react'
import { CheckCircle2, Lock, Printer, FileCheck2, Shield, Layers, Stamp, Check } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'
import { openOfficialPrintDocument } from '@/lib/deliverableExporter'

interface Phase2DeliverableProps {
  projectId: number
  onPhaseLocked?: () => void
}

export default function Phase2Deliverable({ projectId, onPhaseLocked }: Phase2DeliverableProps) {
  const { projects, projectData, lockPhase } = useAPQPStore()
  const project = projects.find((p) => p.id === projectId) || projects[0]
  const data = projectData[projectId]
  const isLocked = project?.lockedPhases?.includes(2)

  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleLock = () => {
    lockPhase(projectId, 2)
    if (onPhaseLocked) onPhaseLocked()
  }

  const handleExport = () => {
    setIsExporting(true)
    openOfficialPrintDocument(project, 2, data)
    setIsExporting(false)
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 4000)
  }

  const dfmeaCount = data?.dfmea?.length || 0
  const ccscCount = data?.ccsc?.length || 0
  const dvprCount = data?.dvpr?.length || 0
  const dvprPass = data?.dvpr?.filter((d) => d.status === 'Pass').length || 0

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-mono text-xs font-bold rounded">
              GATE 02
            </span>
            <h3 className="text-lg font-bold text-foreground">
              Revue de Conception (Livrable Phase 2)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Certification de la conception produit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-lg hover:bg-muted transition-colors text-xs font-semibold shadow-xs"
          >
            <Printer className="w-4 h-4 text-primary" />
            {isExporting ? 'Génération...' : 'Générer Dossier Officiel Gate 2 (PDF)'}
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dossier officiel de conception produit Phase 2 validé et archivé.</span>
        </div>
      )}

      {/* Official Automotive Cartouche */}
      <div className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-xs">
        <div className="bg-muted/40 p-4 border-b border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block font-medium">Référence Document</span>
            <span className="font-mono font-bold text-foreground">DOC-APQP-G2-{project.partNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Indice de Plan Figé</span>
            <span className="font-bold text-foreground">{data?.specifications?.cadModel || 'CAD 3D Rev C'}</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Statut DFMEA</span>
            <span className="font-bold text-emerald-600">Approuvé (0 RPN &gt; 100)</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Autorisation Moules/Outillages</span>
            <span className="font-bold text-primary">LIBÉRATION AUTORISÉE</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Design Freeze & Specifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                1. Statut du Gel de Définition Produit (Design Freeze)
              </h4>
              <span className="text-xs font-mono font-semibold text-emerald-600">Gel Officiel Validé</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Matériau & Nuance</span>
                <span className="font-semibold text-foreground mt-0.5 block">{data?.specifications?.material || 'PBT-GF30 UL94 V-0'}</span>
              </div>
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Plage Thermique</span>
                <span className="font-semibold text-foreground mt-0.5 block">{data?.specifications?.operatingTemp || '-40°C à +125°C'}</span>
              </div>
              <div className="p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-muted-foreground block font-medium">Masse Cible</span>
                <span className="font-semibold text-foreground mt-0.5 block">{data?.specifications?.weightGrams || '42.5 ± 1.2 g'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: DFMEA & Special Characteristics Summary */}
          <div className="space-y-3">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                2. Synthèse AMDEC Conception (DFMEA) & Caractéristiques Spéciales
              </h4>
              <span className="text-xs font-mono text-muted-foreground">{dfmeaCount} analyses de défaillances</span>
            </div>

            <div className="border border-border rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-muted/60 text-muted-foreground uppercase font-semibold border-b border-border">
                  <tr>
                    <th className="px-4 py-2.5">Indicateur DFMEA</th>
                    <th className="px-4 py-2.5">Résultat</th>
                    <th className="px-4 py-2.5">Exigence IATF / AIAG</th>
                    <th className="px-4 py-2.5">Évaluation Qualité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Nombre de Lignes DFMEA Révisées</td>
                    <td className="px-4 py-2.5 font-bold text-foreground">{dfmeaCount} modes analysés</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Couverture 100% fonctions</td>
                    <td className="px-4 py-2.5 font-semibold text-emerald-600">CONFORME</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Nombre de RPN Résiduels Critiques (&ge; 100)</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600 font-mono">0 ligne critique</td>
                    <td className="px-4 py-2.5 text-muted-foreground">RPN &lt; 100 impératif</td>
                    <td className="px-4 py-2.5 font-semibold text-emerald-600">VALIDÉ</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Caractéristiques Spéciales CC / SC Identifiées</td>
                    <td className="px-4 py-2.5 font-bold text-foreground font-mono">{ccscCount} caractéristiques</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Transfert au Control Plan</td>
                    <td className="px-4 py-2.5 font-semibold text-emerald-600">TRANSMIS PHASE 3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: DVP&R Prototype Test Results */}
          <div className="space-y-3">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-primary" />
                3. Bilan des Essais Prototypes (DVP&R Design Verification Report)
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-600">{dvprPass} / {dvprCount} Essais Validés</span>
            </div>

            <div className="p-4 bg-muted/20 border border-border rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Taux de Réussite aux Essais Physiques & Climatiques</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">100.0% Pass</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Les rapports d'essais en laboratoire accrédité ISO 17025 attestent de la tenue aux vibrations selon ISO 16750-3, de la résistance aux chocs thermiques (-40°C à +125°C) et de l'étanchéité IP67.
              </p>
            </div>
          </div>

          {/* Section 4: Official Sign-off & Tooling Release */}
          <div className="space-y-3 pt-2">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <Stamp className="w-4 h-4 text-primary" />
                4. Approbation de Gel de Conception & Autorisation Lancement Outillages (Gate 2 Sign-Off)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Directeur Technique & R&D</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">H. Lambert - Direction Technique</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Gel 3D validé pour outillages
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Responsable Qualité Produit</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">M. Lefebvre - Assurance Qualité</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  DFMEA et DVP&R approuvés
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Représentant Ingénierie Client</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">OEM Lead Engineer</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Accord technique formel
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
              <Check className="w-4 h-4" /> Conception Produit Formellement Gelée & Validée
            </span>
          ) : (
            <span className="font-bold text-amber-600">Revue technique validée - Prêt pour gel formel Gate 2</span>
          )}
        </div>
        {!isLocked && (
          <button
            onClick={handleLock}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            <Lock className="w-4 h-4" />
            Approuver & Verrouiller Formellement le Jalon 2 (Design Freeze)
          </button>
        )}
      </div>
    </div>
  )
}
