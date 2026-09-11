import { useState } from 'react'
import { CheckCircle2, Lock, Printer, Award, ShieldCheck, Stamp, Check, Activity, FileSpreadsheet } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'
import { openOfficialPrintDocument } from '@/lib/deliverableExporter'

interface Phase5DeliverableProps {
  projectId: number
  onPhaseLocked?: () => void
}

export default function Phase5Deliverable({ projectId, onPhaseLocked }: Phase5DeliverableProps) {
  const { projects, projectData, lockPhase } = useAPQPStore()
  const project = projects.find((p) => p.id === projectId) || projects[0]
  const data = projectData[projectId]
  const isLocked = project?.lockedPhases?.includes(5)

  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleLock = () => {
    lockPhase(projectId, 5)
    if (onPhaseLocked) onPhaseLocked()
  }

  const handleExport = () => {
    setIsExporting(true)
    openOfficialPrintDocument(project, 5, data)
    setIsExporting(false)
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 4000)
  }

  const kpis = data?.kpis || { ppm: 18, oee: 89.4, scrapRate: 0.65, firstPassYield: 99.35, customerComplaints: 0 }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-mono text-xs font-bold rounded">
              GATE 05
            </span>
            <h3 className="text-lg font-bold text-foreground">
              Clôture APQP (Livrable Phase 5)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Revue finale et transfert série
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-lg hover:bg-muted transition-colors text-xs font-semibold shadow-xs"
          >
            <Printer className="w-4 h-4 text-primary" />
            {isExporting ? 'Génération...' : 'Générer Certificat de Clôture APQP (PDF)'}
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Certificat officiel de clôture APQP et bilan de transfert série générés avec succès.</span>
        </div>
      )}

      {/* Official Automotive Cartouche */}
      <div className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-xs">
        <div className="bg-muted/40 p-4 border-b border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block font-medium">Référence Document</span>
            <span className="font-mono font-bold text-foreground">CERT-APQP-G5-{project.partNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Programme & Pièce</span>
            <span className="font-bold text-foreground">{project.name} ({project.partNumber})</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Bilan Safe Launch (90 jours)</span>
            <span className="font-bold text-emerald-600 font-mono">0 Réclamation Client</span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Statut APQP Global</span>
            <span className="font-bold text-primary">PROJET 100% HOMOLOGUÉ SÉRIE</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: 5 Gates Lifecycle Completion Audit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                1. Bilan d'Achèvement des 5 Jalons APQP (Stage-Gate Review)
              </h4>
              <span className="text-xs font-mono font-semibold text-emerald-600">5 / 5 Jalons Validés</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
              {[
                { gate: 'Gate 1', title: 'Planification & VOC', desc: 'Faisabilité validée' },
                { gate: 'Gate 2', title: 'Conception Produit', desc: 'DFMEA & DVP&R OK' },
                { gate: 'Gate 3', title: 'Conception Process', desc: 'OTOP & Control Plan' },
                { gate: 'Gate 4', title: 'Validation & PPAP', desc: 'PSW signé client' },
                { gate: 'Gate 5', title: 'Série & Amélioration', desc: 'Safe launch clôturé' },
              ].map((g) => (
                <div key={g.gate} className="p-3 bg-muted/20 border border-border rounded-lg text-center">
                  <span className="font-mono font-bold text-primary block text-[11px]">{g.gate}</span>
                  <span className="font-semibold text-foreground block mt-0.5">{g.title}</span>
                  <span className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {g.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Serial Production Performance Reconciliation */}
          <div className="space-y-3">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                2. Réconciliation des Indicateurs de Performance Série (KPIs IATF 16949)
              </h4>
            </div>

            <div className="border border-border rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-muted/60 text-muted-foreground uppercase font-semibold border-b border-border">
                  <tr>
                    <th className="px-4 py-2.5">Indicateur Industriel</th>
                    <th className="px-4 py-2.5">Résultat Réalisé</th>
                    <th className="px-4 py-2.5">Objectif Contractuel</th>
                    <th className="px-4 py-2.5">Évaluation Qualité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Taux de Rebut Client (PPM)</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-emerald-600">{kpis.ppm} PPM</td>
                    <td className="px-4 py-2.5 text-muted-foreground">&le; 25 PPM</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600">OBJECTIF DÉPASSÉ</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">Taux de Rendement Synthétique (TRS / OEE)</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-foreground">{kpis.oee}%</td>
                    <td className="px-4 py-2.5 text-muted-foreground">&ge; 85.0%</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600">CONFORME SÉRIE</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-foreground">First Pass Yield (FPY)</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-foreground">{kpis.firstPassYield}%</td>
                    <td className="px-4 py-2.5 text-muted-foreground">&ge; 98.0%</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-600">CONFORME SÉRIE</td>
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
                3. Comité de Clôture APQP & Transfert Officiel à l'Exploitation Série (Gate 5 Sign-Off)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Directeur de Programme APQP</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">J. Dupont - Responsable Projet</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Cycle APQP clôturé avec succès
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Directeur Qualité Groupe</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">M. Lefebvre - Direction Qualité</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Conformité IATF 16949 certifiée
                </div>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Directeur d'Usine / Production Série</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-muted-foreground text-[11px]">P. Martin - Direction Usine</p>
                <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                  Transfert série accepté
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs">
          <span className="text-muted-foreground">Statut du projet : </span>
          {isLocked ? (
            <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
              <Award className="w-4 h-4" /> Projet APQP 100% Clôturé & Homologué Série
            </span>
          ) : (
            <span className="font-bold text-amber-600">Revue finale terminée - Prêt pour clôture définitive Gate 5</span>
          )}
        </div>
        {!isLocked && (
          <button
            onClick={handleLock}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            <Award className="w-4 h-4" />
            Valider et Clôturer Définitivement le Projet APQP (Gate 5)
          </button>
        )}
      </div>
    </div>
  )
}
