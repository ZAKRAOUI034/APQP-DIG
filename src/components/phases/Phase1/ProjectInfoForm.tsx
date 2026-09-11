import { useState, useEffect } from 'react'
import { Calendar, Building2, Package, Check, Hash, FileText } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'

interface ProjectInfoFormProps {
  projectId: number
}

export default function ProjectInfoForm({ projectId }: ProjectInfoFormProps) {
  const { projects, updateProject } = useAPQPStore()
  const project = projects.find((p) => p.id === projectId) || projects[0]

  const [formData, setFormData] = useState({
    name: project?.name || '',
    client: project?.client || '',
    partNumber: project?.partNumber || '',
    annualVolume: project?.annualVolume?.toString() || '0',
    launchDate: project?.launchDate || '',
    description: project?.description || '',
  })

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        client: project.client,
        partNumber: project.partNumber,
        annualVolume: project.annualVolume?.toString() || '0',
        launchDate: project.launchDate,
        description: project.description,
      })
    }
  }, [project])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProject(projectId, {
      name: formData.name,
      client: formData.client,
      partNumber: formData.partNumber,
      annualVolume: parseInt(formData.annualVolume) || 0,
      launchDate: formData.launchDate,
      description: formData.description,
    })
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold">Informations Générales du Projet</h3>
          <p className="text-sm text-muted-foreground">
            Cadre contractuel, données de référence et contexte APQP
          </p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          {isSaved ? <Check className="w-4 h-4 text-white" /> : null}
          {isSaved ? 'Enregistré !' : 'Enregistrer les modifications'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nom du projet *</label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="Ex: Support Capteur Stationnement"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Client OEM / Tier 1 *</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              required
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="Ex: OEM Automobile France"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Référence pièce (Part Number) *</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              required
              value={formData.partNumber}
              onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
              placeholder="Ex: SCS-2024-045"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Volume annuel prévisionnel (pcs/an) *</label>
          <input
            type="number"
            required
            value={formData.annualVolume}
            onChange={(e) => setFormData({ ...formData, annualVolume: e.target.value })}
            className="w-full px-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
            placeholder="Ex: 500000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date cible de lancement série (SOP) *</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              required
              value={formData.launchDate}
              onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Statut APQP Actuel</label>
          <div className="px-4 py-2 bg-muted rounded-md text-sm font-medium flex items-center justify-between">
            <span className="capitalize">{project?.status?.replace('_', ' ')}</span>
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
              Phase {project?.currentPhase} / 5
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Description et contexte fonctionnel
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
          placeholder="Décrivez l'application automobile, l'architecture véhicule, les contraintes d'implantation et les objectifs qualité..."
        />
      </div>
    </form>
  )
}
