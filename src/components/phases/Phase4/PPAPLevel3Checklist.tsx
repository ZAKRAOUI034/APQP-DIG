import { useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, FileCheck, Award, Printer, X, Download } from 'lucide-react'
import { useAPQPStore, PPAPElement } from '@/lib/store'

interface PPAPLevel3ChecklistProps {
  projectId: number
}

export default function PPAPLevel3Checklist({ projectId }: PPAPLevel3ChecklistProps) {
  const { projectData, updatePPAPElement, setPSWSignoff, projects } = useAPQPStore()
  const elements = projectData[projectId]?.ppapElements || []
  const psw = projectData[projectId]?.pswSignoff || {
    partName: 'Support Capteur Stationnement',
    partNumber: 'SCS-2024-045',
    drawingRevision: 'Rev C',
    supplierName: 'Automotive Precision Polymers SAS',
    supplierLocation: 'Douai, France',
    submissionLevel: 3,
    warrantSignedBy: 'Jean Dupont',
    warrantDate: '2024-09-20',
    isApproved: true
  }

  const [isPSWModalOpen, setIsPSWModalOpen] = useState(false)
  const [pswForm, setPswForm] = useState(psw)

  const handleStatusChange = (id: number, status: PPAPElement['status']) => {
    updatePPAPElement(projectId, id, status)
  }

  const handleSavePSW = (e: React.FormEvent) => {
    e.preventDefault()
    setPSWSignoff(projectId, pswForm)
    setIsPSWModalOpen(false)
  }

  const approvedCount = elements.filter((el) => el.status === 'Approved').length
  const totalCount = elements.length
  const percentApproved = Math.round((approvedCount / totalCount) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Dossier PPAP Niveau 3 (Production Part Approval Process)</h3>
          <p className="text-sm text-muted-foreground">
            Grille de conformité des 18 éléments requis selon le manuel AIAG PPAP 4th Edition
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPSWModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors text-sm shadow-sm"
          >
            <Award className="w-4 h-4" />
            Mandat de Présentation (PSW)
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">
            Avancement Global du Dossier PPAP Niveau 3
          </span>
          <span className="text-sm font-bold text-primary font-mono">{percentApproved}% ({approvedCount} / {totalCount} Validés)</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${percentApproved}%` }}
          />
        </div>
      </div>

      {/* 18 Elements Checklist Table */}
      <div className="border border-border rounded-lg overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/80 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Élément PPAP (AIAG 4th Edition)</th>
              <th className="px-4 py-3">Exigence Niveau 3</th>
              <th className="px-4 py-3">Commentaires & Références</th>
              <th className="px-4 py-3">Statut de Conformité</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {elements.map((el) => (
              <tr key={el.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-xs text-primary">{el.id}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-foreground block">{el.name}</span>
                  <span className="text-muted-foreground text-xs">{el.nameEn}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Requis Soumission (S)
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{el.comments}</td>
                <td className="px-4 py-3">
                  <select
                    value={el.status}
                    onChange={(e) => handleStatusChange(el.id, e.target.value as PPAPElement['status'])}
                    className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                      el.status === 'Approved'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : el.status === 'Submitted'
                        ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : el.status === 'In Review'
                        ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    <option value="Approved">Approuvé (Approved)</option>
                    <option value="Submitted">Soumis (Submitted)</option>
                    <option value="In Review">En Revue (In Review)</option>
                    <option value="Not Started">Non Démarré</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PSW Modal */}
      {isPSWModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground text-lg">Part Submission Warrant (PSW) - AIAG</h4>
              </div>
              <button onClick={() => setIsPSWModalOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePSW} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Désignation Pièce *</label>
                  <input
                    type="text"
                    required
                    value={pswForm.partName}
                    onChange={(e) => setPswForm({ ...pswForm, partName: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Référence Pièce (Part Number) *</label>
                  <input
                    type="text"
                    required
                    value={pswForm.partNumber}
                    onChange={(e) => setPswForm({ ...pswForm, partNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Indice de Plan *</label>
                  <input
                    type="text"
                    required
                    value={pswForm.drawingRevision}
                    onChange={(e) => setPswForm({ ...pswForm, drawingRevision: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Fournisseur</label>
                  <input
                    type="text"
                    value={pswForm.supplierName}
                    onChange={(e) => setPswForm({ ...pswForm, supplierName: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Niveau Soumission</label>
                  <input
                    type="number"
                    value={pswForm.submissionLevel}
                    disabled
                    className="w-full px-3 py-2 bg-muted border border-input rounded text-sm font-bold text-center"
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/40 rounded-lg border border-border space-y-2">
                <h5 className="font-bold text-xs uppercase text-foreground">Déclaration de Conformité du Fournisseur</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Je certifie que les échantillons de pièces soumis sont représentatifs de notre production série normale, ont été fabriqués avec les outillages de série aux cadences nominales et respectent l'intégralité des spécifications techniques contractuelles.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Signataire Autorisé *</label>
                  <input
                    type="text"
                    required
                    value={pswForm.warrantSignedBy}
                    onChange={(e) => setPswForm({ ...pswForm, warrantSignedBy: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                    placeholder="Nom et Titre du Directeur Qualité"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Date de Signature *</label>
                  <input
                    type="date"
                    required
                    value={pswForm.warrantDate}
                    onChange={(e) => setPswForm({ ...pswForm, warrantDate: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-2 border border-border rounded text-xs font-medium hover:bg-muted"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimer PSW
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPSWModalOpen(false)}
                    className="px-4 py-2 border border-border rounded text-sm hover:bg-muted"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded text-sm hover:bg-primary/90 shadow"
                  >
                    Valider le Mandat PSW
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
