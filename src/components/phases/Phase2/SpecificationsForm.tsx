import { useState, useEffect } from 'react'
import { Check, Layers, Cpu, Compass, Scale, ShieldCheck, Thermometer } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'

interface SpecificationsFormProps {
  projectId: number
}

export default function SpecificationsForm({ projectId }: SpecificationsFormProps) {
  const { projectData, setSpecifications } = useAPQPStore()
  const currentSpecs = projectData[projectId]?.specifications || {
    dimensions: '',
    material: '',
    cadModel: '',
    operatingTemp: '',
    weightGrams: '',
    complianceNorms: '',
    tolerances: ''
  }

  const [form, setForm] = useState(currentSpecs)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (projectData[projectId]?.specifications) {
      setForm(projectData[projectId].specifications)
    }
  }, [projectId, projectData])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSpecifications(projectId, form)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold">Spécifications Techniques de Conception (Design Specs)</h3>
          <p className="text-sm text-muted-foreground">
            Définition des caractéristiques matière, géométrie CAD, contraintes d'environnement et normes IATF
          </p>
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          {isSaved ? <Check className="w-4 h-4 text-white" /> : null}
          {isSaved ? 'Enregistré !' : 'Enregistrer Spécifications'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            Dimensions d'encombrement & Tolérances générales *
          </label>
          <input
            type="text"
            required
            value={form.dimensions}
            onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
            placeholder="Ex: 145.2 x 62.4 x 38.0 mm (ISO 2768-mK)"
            className="w-full px-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Spécification Matière & Nuance *
          </label>
          <input
            type="text"
            required
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
            placeholder="Ex: PBT-GF30 UL94 V-0 ou Alliage AlSi9Cu3"
            className="w-full px-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            Référence Maquette Numérique 3D (CAD) *
          </label>
          <input
            type="text"
            required
            value={form.cadModel}
            onChange={(e) => setForm({ ...form, cadModel: e.target.value })}
            placeholder="Ex: CATIA V5 - 3D_SCS_2024_REV_C.stp"
            className="w-full px-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            Plage de Température de Service *
          </label>
          <input
            type="text"
            required
            value={form.operatingTemp}
            onChange={(e) => setForm({ ...form, operatingTemp: e.target.value })}
            placeholder="Ex: -40°C à +125°C (Pic 140°C)"
            className="w-full px-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            Masse nominale cible & tolérance (g) *
          </label>
          <input
            type="text"
            required
            value={form.weightGrams}
            onChange={(e) => setForm({ ...form, weightGrams: e.target.value })}
            placeholder="Ex: 42.5 ± 1.2 g"
            className="w-full px-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Normes de Conformité & Réglementations *
          </label>
          <input
            type="text"
            required
            value={form.complianceNorms}
            onChange={(e) => setForm({ ...form, complianceNorms: e.target.value })}
            placeholder="Ex: IATF 16949, ISO 16750, RoHS / REACH, FMVSS 302"
            className="w-full px-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Contraintes Géométriques Particulières (GD&T / Références d'Appui)</label>
        <textarea
          value={form.tolerances}
          onChange={(e) => setForm({ ...form, tolerances: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none text-sm"
          placeholder="Ex: Entraxe des inserts M6 : ± 0.05 mm | Planéité portée joint : 0.08 mm par rapport aux références A-B-C..."
        />
      </div>
    </form>
  )
}
