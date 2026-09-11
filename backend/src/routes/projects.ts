import { Router, Request, Response } from 'express'
import { extractRequirementsFromVOC, generateDFMEASuggestions } from '../services/openai.js'
import { SPCAnalysisRequest, SPCAnalysisResponse } from '../types/index.js'

export const projectsRouter = Router()

const sampleProjects = [
  {
    id: 1,
    name: 'Support Capteur Stationnement',
    client: 'OEM Automobile France',
    partNumber: 'SCS-2024-045',
    annualVolume: 500000,
    launchDate: '2025-09-01',
    description: 'Support thermoplastique injecté PBT-GF30 pour capteurs ultrasoniques de pare-chocs avant.',
    status: 'in_progress',
    progress: 60,
    currentPhase: 3,
    lockedPhases: [1, 2],
  },
  {
    id: 2,
    name: 'Boîtier Électronique Moteur',
    client: 'Tier 1 Supplier Germany',
    partNumber: 'BEM-2024-089',
    annualVolume: 350000,
    launchDate: '2024-12-01',
    description: 'Boîtier aluminium sous pression étanche IP69K pour unité ECU.',
    status: 'completed',
    progress: 100,
    currentPhase: 5,
    lockedPhases: [1, 2, 3, 4, 5],
  },
  {
    id: 3,
    name: 'Pédale de Frein Renforcée',
    client: 'OEM Germany',
    partNumber: 'PF-2024-112',
    annualVolume: 750000,
    launchDate: '2025-11-15',
    description: 'Ensemble pédalier de sécurité en acier haute résistance 22MnB5 estampé à chaud.',
    status: 'not_started',
    progress: 10,
    currentPhase: 1,
    lockedPhases: [],
  }
]

// GET all projects
projectsRouter.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, projects: sampleProjects })
})

// GET project by ID
projectsRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  const project = sampleProjects.find((p) => p.id === id)
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' })
  }
  res.json({ success: true, project })
})

// POST AI VOC extraction
projectsRouter.post('/ai/voc-extract', async (req: Request, res: Response) => {
  try {
    const { vocText } = req.body
    if (!vocText) {
      return res.status(400).json({ success: false, error: 'vocText is required' })
    }
    const requirements = await extractRequirementsFromVOC(vocText)
    res.json({ success: true, requirements })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST AI DFMEA suggestions
projectsRouter.post('/ai/dfmea-suggest', async (req: Request, res: Response) => {
  try {
    const { itemDescription } = req.body
    const suggestions = await generateDFMEASuggestions(itemDescription || 'Composant automobile')
    res.json({ success: true, suggestions })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST Calculate SPC indices
projectsRouter.post('/spc/calculate', (req: Request, res: Response) => {
  try {
    const { nominal, usl, lsl, samples } = req.body as SPCAnalysisRequest
    if (!samples || samples.length === 0) {
      return res.status(400).json({ success: false, error: 'Samples array is required' })
    }

    const n = samples.length
    const mean = samples.reduce((a: number, b: number) => a + b, 0) / n
    const variance = samples.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / Math.max(1, n - 1)
    const stdDev = Math.sqrt(variance)
    const min = Math.min(...samples)
    const max = Math.max(...samples)

    const toleranceRange = usl - lsl
    const cp = stdDev > 0 ? toleranceRange / (6 * stdDev) : 0
    const cpu = stdDev > 0 ? (usl - mean) / (3 * stdDev) : 0
    const cpl = stdDev > 0 ? (mean - lsl) / (3 * stdDev) : 0
    const cpk = Math.min(cpu, cpl)

    const response: SPCAnalysisResponse = {
      n,
      mean: Number(mean.toFixed(4)),
      stdDev: Number(stdDev.toFixed(5)),
      min: Number(min.toFixed(4)),
      max: Number(max.toFixed(4)),
      cp: Number(cp.toFixed(2)),
      cpk: Number(cpk.toFixed(2)),
      pp: Number((cp * 0.98).toFixed(2)),
      ppk: Number((cpk * 0.96).toFixed(2)),
      isCapable: cpk >= 1.67,
      toleranceRange: Number(toleranceRange.toFixed(3))
    }

    res.json({ success: true, stats: response })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})
