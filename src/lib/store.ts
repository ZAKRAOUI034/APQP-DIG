import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { fetchProjects, createProject as createProjectSupabase, updateProject as updateProjectSupabase, deleteProject as deleteProjectSupabase, toSupabaseProject, fromSupabaseProject } from '@/services/supabaseService'

export interface Project {
  id: number
  supabaseId: string
  projectNumber: number
  name: string
  client: string
  partNumber: string
  annualVolume: number
  launchDate: string
  description: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  currentPhase: number
  lockedPhases: number[]
}

export interface Requirement {
  id: string
  source: string
  characteristic: string
  type: 'dimensionnelle' | 'fonctionnelle' | 'réglementaire' | 'esthétique'
  specification: string
  criticality: 'low' | 'medium' | 'high' | 'critical'
  verification: string
}

export interface Milestone {
  id: string
  name: string
  startDate: string
  endDate: string
  duration: number
  phase: number
  status: 'pending' | 'in_progress' | 'completed'
}

export interface DFMEARow {
  id: string
  item: string
  functionName: string
  failureMode: string
  failureEffect: string
  severity: number
  specialChar: string
  cause: string
  preventionControl: string
  occurrence: number
  detectionControl: string
  detection: number
  rpn: number
  recommendedAction: string
  responsible: string
  targetDate: string
  status: 'Open' | 'In Progress' | 'Closed'
}

export interface CCSCItem {
  id: string
  charNumber: string
  description: string
  classification: 'CC' | 'SC' | 'HQC'
  productSpec: string
  processParameter: string
  inspectionMethod: string
  fmeaRef: string
}

export interface DVPRRow {
  id: string
  testName: string
  specRef: string
  sampleSize: number
  acceptanceCriteria: string
  facility: string
  startDate: string
  endDate: string
  status: 'Pass' | 'Fail' | 'In Progress' | 'Pending'
  resultSummary: string
}

export interface ProcessStep {
  id: string
  stepNumber: string
  operationName: string
  workCenter: string
  tooling: string
  cycleTimeSec: number
  keyProductChar: string
  keyProcessChar: string
  type: 'operation' | 'inspection' | 'transport' | 'storage'
}

export interface PFMEARow {
  id: string
  stepNumber: string
  processFunction: string
  failureMode: string
  failureEffect: string
  severity: number
  specialChar: string
  cause: string
  preventionControl: string
  occurrence: number
  detectionControl: string
  detection: number
  rpn: number
  correctiveAction: string
  responsible: string
  status: 'Open' | 'In Progress' | 'Closed'
}

export interface ControlPlanRow {
  id: string
  stepNumber: string
  operation: string
  machine: string
  charNumber: string
  productChar: string
  processChar: string
  specialCharType: string
  specification: string
  evalTechnique: string
  sampleSize: string
  sampleFreq: string
  controlMethod: string
  reactionPlan: string
}

export interface WorkInstruction {
  id: string
  stepNumber: string
  title: string
  workstation: string
  ppeRequired: string[]
  toolsRequired: string[]
  instructions: string[]
  criticalChecks: string[]
  safetyWarning: string
  revision: string
}

export interface MeasurementData {
  nominal: number
  usl: number
  lsl: number
  unit: string
  samples: number[]
}

export interface GageRRData {
  appraisersCount: number
  partsCount: number
  trialsCount: number
  equipmentName: string
  parameter: string
  evPercent: number
  avPercent: number
  grrPercent: number
  ndc: number
  status: 'Acceptable' | 'Marginal' | 'Unacceptable'
}

export interface Case8D {
  id: string
  title: string
  partNumber: string
  openedDate: string
  status: 'Open' | 'Under Investigation' | 'Containment Active' | 'Closed'
  champion: string
  d1Team: string[]
  d2Problem: string
  d3Containment: string
  d4RootCause5Why: string[]
  d5CorrectiveActions: string
  d6Verification: string
  d7PreventRecurrence: string
  d8Congratulate: string
}

export interface PPAPElement {
  id: number
  name: string
  nameEn: string
  status: 'Approved' | 'Submitted' | 'In Review' | 'Not Started'
  requiredForLevel3: boolean
  comments: string
  documentRef?: string
}

export interface CAPAItem {
  id: string
  title: string
  source: 'Audit' | 'Customer Complaint' | 'Internal FMEA' | 'SPC Drift'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  stage: 'Plan' | 'Do' | 'Check' | 'Act'
  owner: string
  dueDate: string
  status: 'Pending' | 'In Progress' | 'Completed'
}

export interface LessonLearned {
  id: string
  category: 'Design' | 'Process' | 'Tooling' | 'Supplier' | 'Quality'
  phase: number
  problemSummary: string
  rootCause: string
  recommendation: string
  projectOrigin: string
  date: string
}

export interface DriftAlert {
  id: string
  title: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: string
  ruleTriggered: string
  resolved: boolean
}

export interface ReverseFmeaAudit {
  id: string
  station: string
  observedIssue: string
  detectionMethod: string
  actionRequired: string
  auditor: string
  date: string
}

export interface ProjectPhaseData {
  vocText?: string
  requirements?: Requirement[]
  milestones?: Milestone[]
  specifications?: {
    dimensions: string
    material: string
    cadModel: string
    operatingTemp: string
    weightGrams: string
    complianceNorms: string
    tolerances: string
  }
  dfmea?: DFMEARow[]
  ccsc?: CCSCItem[]
  dvpr?: DVPRRow[]
  processSteps?: ProcessStep[]
  pfmea?: PFMEARow[]
  controlPlan?: ControlPlanRow[]
  workInstructions?: WorkInstruction[]
  measurements?: MeasurementData
  gageRR?: GageRRData
  cases8D?: Case8D[]
  ppapElements?: PPAPElement[]
  pswSignoff?: {
    partName: string
    partNumber: string
    drawingRevision: string
    supplierName: string
    supplierLocation: string
    submissionLevel: number
    warrantSignedBy: string
    warrantDate: string
    isApproved: boolean
  }
  kpis?: {
    ppm: number
    oee: number
    scrapRate: number
    firstPassYield: number
    customerComplaints: number
  }
  driftAlerts?: DriftAlert[]
  reverseFmeaAudits?: ReverseFmeaAudit[]
  capaList?: CAPAItem[]
  lessonsLearned?: LessonLearned[]
}

interface APQPState {
  projects: Project[]
  activeProjectId: number
  
  // Data keyed by projectId
  projectData: {
    [projectId: number]: ProjectPhaseData
  }

  // Actions
  setActiveProject: (id: number) => void
  loadProjectsFromSupabase: () => Promise<void>
  addProject: (project: Omit<Project, 'id' | 'supabaseId' | 'projectNumber' | 'progress' | 'currentPhase' | 'lockedPhases'>) => Promise<number>
  updateProject: (id: number, project: Partial<Project>) => Promise<void>
  deleteProject: (id: number) => Promise<void>
  lockPhase: (projectId: number, phase: number) => void
  
  // Phase 1 Actions
  setVOCText: (projectId: number, text: string) => void
  setRequirements: (projectId: number, reqs: Requirement[]) => void
  addRequirement: (projectId: number, req: Requirement) => void
  updateRequirement: (projectId: number, id: string, req: Partial<Requirement>) => void
  deleteRequirement: (projectId: number, id: string) => void
  setMilestones: (projectId: number, milestones: Milestone[]) => void
  updateMilestone: (projectId: number, id: string, milestone: Partial<Milestone>) => void

  // Phase 2 Actions
  setSpecifications: (projectId: number, specs: APQPState['projectData'][number]['specifications']) => void
  setDFMEA: (projectId: number, dfmea: DFMEARow[]) => void
  addDFMEARow: (projectId: number, row: DFMEARow) => void
  updateDFMEARow: (projectId: number, id: string, row: Partial<DFMEARow>) => void
  deleteDFMEARow: (projectId: number, id: string) => void
  setCCSC: (projectId: number, ccsc: CCSCItem[]) => void
  addCCSCItem: (projectId: number, item: CCSCItem) => void
  setDVPR: (projectId: number, dvpr: DVPRRow[]) => void
  addDVPRRow: (projectId: number, row: DVPRRow) => void
  updateDVPRRow: (projectId: number, id: string, row: Partial<DVPRRow>) => void

  // Phase 3 Actions
  setProcessSteps: (projectId: number, steps: ProcessStep[]) => void
  addProcessStep: (projectId: number, step: ProcessStep) => void
  updateProcessStep: (projectId: number, id: string, step: Partial<ProcessStep>) => void
  setPFMEA: (projectId: number, pfmea: PFMEARow[]) => void
  addPFMEARow: (projectId: number, row: PFMEARow) => void
  updatePFMEARow: (projectId: number, id: string, row: Partial<PFMEARow>) => void
  deletePFMEARow: (projectId: number, id: string) => void
  setControlPlan: (projectId: number, plan: ControlPlanRow[]) => void
  addControlPlanRow: (projectId: number, row: ControlPlanRow) => void
  updateControlPlanRow: (projectId: number, id: string, row: Partial<ControlPlanRow>) => void
  setWorkInstructions: (projectId: number, instructions: WorkInstruction[]) => void
  addWorkInstruction: (projectId: number, wi: WorkInstruction) => void

  // Phase 4 Actions
  setMeasurements: (projectId: number, data: MeasurementData) => void
  setGageRR: (projectId: number, data: GageRRData) => void
  setCases8D: (projectId: number, list: Case8D[]) => void
  updateCase8D: (projectId: number, id: string, item: Partial<Case8D>) => void
  setPPAPElements: (projectId: number, elements: PPAPElement[]) => void
  updatePPAPElement: (projectId: number, id: number, status: PPAPElement['status'], comments?: string) => void
  setPSWSignoff: (projectId: number, psw: APQPState['projectData'][number]['pswSignoff']) => void

  // Phase 5 Actions
  setCAPAList: (projectId: number, items: CAPAItem[]) => void
  addCAPAItem: (projectId: number, item: CAPAItem) => void
  updateCAPAItem: (projectId: number, id: string, item: Partial<CAPAItem>) => void
  setLessonsLearned: (projectId: number, items: LessonLearned[]) => void
  addLessonLearned: (projectId: number, item: LessonLearned) => void
  resolveDriftAlert: (projectId: number, id: string) => void
  addReverseFmeaAudit: (projectId: number, audit: ReverseFmeaAudit) => void
}

const initialProjects: Project[] = [
  {
    id: 1,
    supabaseId: '00000000-0000-0000-0000-000000000001',
    projectNumber: 1,
    name: 'Support Capteur Stationnement',
    client: 'OEM Automobile France',
    partNumber: 'SCS-2024-045',
    annualVolume: 500000,
    launchDate: '2025-09-01',
    description: "Support thermoplastique injecté PBT-GF30 pour capteurs ultrasoniques de pare-chocs avant avec joint d'étanchéité surmoulé.",
    status: 'in_progress',
    progress: 60,
    currentPhase: 3,
    lockedPhases: [1, 2],
  },
  {
    id: 2,
    supabaseId: '00000000-0000-0000-0000-000000000002',
    projectNumber: 2,
    name: 'Boîtier Électronique Moteur',
    client: 'Tier 1 Supplier Germany',
    partNumber: 'BEM-2024-089',
    annualVolume: 350000,
    launchDate: '2024-12-01',
    description: 'Boîtier aluminium sous pression étanche IP69K avec connecteur 48 broches pour unité de contrôle moteur ECU.',
    status: 'completed',
    progress: 100,
    currentPhase: 5,
    lockedPhases: [1, 2, 3, 4, 5],
  },
  {
    id: 3,
    supabaseId: '00000000-0000-0000-0000-000000000003',
    projectNumber: 3,
    name: 'Pédale de Frein Renforcée',
    client: 'OEM Germany',
    partNumber: 'PF-2024-112',
    annualVolume: 750000,
    launchDate: '2025-11-15',
    description: 'Ensemble pédalier de sécurité en acier haute résistance 22MnB5 estampé à chaud avec capteur de position sans contact.',
    status: 'not_started',
    progress: 10,
    currentPhase: 1,
    lockedPhases: [],
  },
]

const defaultPPAPElements: PPAPElement[] = [
  { id: 1, name: "Dossier de Conception", nameEn: "Design Records", status: "Approved", requiredForLevel3: true, comments: "Modèles 3D CAD & plans 2D validés" },
  { id: 2, name: "Documents de Modification Technique", nameEn: "Engineering Change Documents", status: "Approved", requiredForLevel3: true, comments: "ECN-2024-88 approuvé" },
  { id: 3, name: "Approbation Ingénierie Client", nameEn: "Customer Engineering Approval", status: "Approved", requiredForLevel3: true, comments: "Accord technique OEM signé" },
  { id: 4, name: "DFMEA (AMDEC Conception)", nameEn: "Design FMEA", status: "Approved", requiredForLevel3: true, comments: "Rev 3 - Aucun RPN > 100" },
  { id: 5, name: "Synoptique de Fabrication (PFD)", nameEn: "Process Flow Diagram", status: "Approved", requiredForLevel3: true, comments: "Flux matière validé Op 10 à 60" },
  { id: 6, name: "PFMEA (AMDEC Process)", nameEn: "Process FMEA", status: "Approved", requiredForLevel3: true, comments: "Rev 2 - Poka-yoké intégrés" },
  { id: 7, name: "Plan de Surveillance (Control Plan)", nameEn: "Control Plan", status: "Approved", requiredForLevel3: true, comments: "Plan de surveillance pré-série & série" },
  { id: 8, name: "Études MSA (R&R)", nameEn: "Measurement System Analysis", status: "Approved", requiredForLevel3: true, comments: "%GRR = 7.4% (Acceptable < 10%)" },
  { id: 9, name: "Résultats Dimensionnels", nameEn: "Dimensional Results", status: "Submitted", requiredForLevel3: true, comments: "Rapport CMM 30 pièces conforme" },
  { id: 10, name: "Essais Matière / Performance", nameEn: "Material & Performance Tests", status: "Approved", requiredForLevel3: true, comments: "Tenue thermique et brouillard salin OK" },
  { id: 11, name: "Études Statistiques Process (Cp/Cpk)", nameEn: "Initial Process Studies", status: "Approved", requiredForLevel3: true, comments: "Cpk = 1.68 (> 1.67 requis)" },
  { id: 12, name: "Documentation Laboratoire Accrédité", nameEn: "Qualified Laboratory Docs", status: "Approved", requiredForLevel3: true, comments: "Certificats ISO/IEC 17025 fournis" },
  { id: 13, name: "Rapport d'Apparence (AAR)", nameEn: "Appearance Approval Report", status: "Approved", requiredForLevel3: false, comments: "Aspect classe B validé sans retassure" },
  { id: 14, name: "Échantillons Pièces de Production", nameEn: "Sample Production Parts", status: "Approved", requiredForLevel3: true, comments: "6 pièces étalons expédiées au client" },
  { id: 15, name: "Échantillon Maître (Master Sample)", nameEn: "Master Sample", status: "Approved", requiredForLevel3: true, comments: "Stocké en salle métrologie sécurisée" },
  { id: 16, name: "Moyens de Contrôle Spécifiques", nameEn: "Checking Aids", status: "Approved", requiredForLevel3: true, comments: "Gabarit GO/NO-GO certifié" },
  { id: 17, name: "Exigences Spécifiques Client (CSR)", nameEn: "Customer-Specific Requirements", status: "Approved", requiredForLevel3: true, comments: "Conformité grille d'audit OEM" },
  { id: 18, name: "Mandat de Présentation (PSW)", nameEn: "Part Submission Warrant", status: "Submitted", requiredForLevel3: true, comments: "Prêt pour signature finale" },
]

export const useAPQPStore = create<APQPState>()(
  persist(
    (set, get) => ({
      projects: initialProjects,
      activeProjectId: 1,

      projectData: {
        1: {
          vocText: `1. Le support capteur doit être conforme aux dimensions géométriques selon plan OEM-SCS-045 Rev C.
2. Matériau requis : PBT-GF30 résistant aux températures de -40°C à +125°C sans déformation.
3. Fixation par vis M6 avec couple de serrage garanti à 8.5 ± 0.5 Nm.
4. Étanchéité IP67 minimale face aux projections d'eau et de boue en pare-chocs.
5. Résistance chimique : pas d'altération sous contact huile moteur, liquide de frein DOT4 et lave-glace.
6. Aspect visible : classe B selon norme DBL 5400, sans retassure ni bavure > 0.05 mm.
7. Capacité process requise : Cpk ≥ 1.67 sur les cotes critiques (CC).`,
          requirements: [
            { id: 'REQ-001', source: 'VOC: Résistance thermique', characteristic: 'Résistance thermique continue', type: 'fonctionnelle', specification: '-40°C à +125°C', criticality: 'high', verification: 'Essai en étuve climatique (ISO 16750-4)' },
            { id: 'REQ-002', source: 'VOC: Fixation M6', characteristic: 'Diamètre alésage fixation M6', type: 'dimensionnelle', specification: 'Ø 6.20 ± 0.08 mm', criticality: 'critical', verification: 'Contrôle tridimensionnel CMM' },
            { id: 'REQ-003', source: 'VOC: Couple serrage', characteristic: 'Couple de rupture insert taraudé', type: 'fonctionnelle', specification: 'Couple ≥ 12.0 Nm (visage nominal 8.5 Nm)', criticality: 'critical', verification: 'Banc dynamométrique de vissage' },
            { id: 'REQ-004', source: 'VOC: Étanchéité', characteristic: 'Indice de protection boîtier', type: 'réglementaire', specification: 'IP67 selon CEI 60529', criticality: 'high', verification: 'Test sous immersion 1m / 30min' },
            { id: 'REQ-005', source: 'VOC: Aspect', characteristic: 'Bavures de plan de joint', type: 'esthétique', specification: '< 0.05 mm max', criticality: 'medium', verification: 'Loupe binoculaire & profilomètre optique' },
            { id: 'REQ-006', source: 'VOC: Capacité Cpk', characteristic: 'Cpk diamètre d’encliquetage', type: 'dimensionnelle', specification: 'Cpk ≥ 1.67 (40 pcs pilote)', criticality: 'critical', verification: 'Analyse SPC Minitab / Moteur APQP' }
          ],
          milestones: [
            { id: 'M1', name: 'Phase 1 : Planification & VOC', startDate: '2024-01-10', endDate: '2024-03-01', duration: 2, phase: 1, status: 'completed' },
            { id: 'M2', name: 'Phase 2 : Conception Produit & DFMEA', startDate: '2024-03-01', endDate: '2024-06-15', duration: 3, phase: 2, status: 'completed' },
            { id: 'M3', name: 'Phase 3 : Conception Processus & PFMEA', startDate: '2024-06-15', endDate: '2024-09-30', duration: 3, phase: 3, status: 'in_progress' },
            { id: 'M4', name: 'Phase 4 : Validation & PPAP Run@Rate', startDate: '2024-10-01', endDate: '2024-12-15', duration: 2, phase: 4, status: 'pending' },
            { id: 'M5', name: 'Phase 5 : Ramp-up & Amélioration Continue', startDate: '2025-01-05', endDate: '2025-04-30', duration: 3, phase: 5, status: 'pending' },
          ],
          specifications: {
            dimensions: '145.2 x 62.4 x 38.0 mm (Tolérance générale ISO 2768-mK)',
            material: 'PBT-GF30 (Polybutylène téréphtalate 30% fibres de verre) UL94 V-0',
            cadModel: 'CATIA V5 - 3D_SCS_2024_REV_C.stp',
            operatingTemp: '-40°C à +125°C (Pic 140°C pendant 30 min)',
            weightGrams: '42.5 ± 1.2 g',
            complianceNorms: 'IATF 16949, ISO 16750, RoHS / REACH, FMVSS 302',
            tolerances: 'Position des inserts M6 : ± 0.05 mm | Planéité portée joint : 0.08 mm'
          },
          dfmea: [
            {
              id: 'DFM-01',
              item: 'Corps thermoplastique',
              functionName: 'Maintien rigide du capteur radar sous vibrations',
              failureMode: 'Fissuration du clip de maintien après cyclage thermique',
              failureEffect: 'Perte de position du capteur, fausse alerte obstacle',
              severity: 7,
              specialChar: 'CC',
              cause: 'Concentration de contrainte au rayon de congé R=0.3mm',
              preventionControl: 'Simulation rhéologique et EF (Ansys)',
              occurrence: 4,
              detectionControl: 'Essai endurance vibration + choc thermique',
              detection: 3,
              rpn: 84,
              recommendedAction: 'Augmenter le rayon de congé à R=0.8mm et nervurer la patte',
              responsible: 'M. Dubois (BE)',
              targetDate: '2024-05-15',
              status: 'Closed'
            },
            {
              id: 'DFM-02',
              item: 'Insert métallique M6',
              functionName: 'Transmission de l’effort de fixation au châssis',
              failureMode: 'Déchaussement de l’insert lors du serrage à 8.5 Nm',
              failureEffect: 'Fixation lâche, risque de détachement du composant',
              severity: 8,
              specialChar: 'CC',
              cause: 'Sous-dimensionnement des moletages hélicoïdaux',
              preventionControl: 'Calcul résistance arrachement VDI 2230',
              occurrence: 3,
              detectionControl: 'Essai de traction statique en labo',
              detection: 3,
              rpn: 72,
              recommendedAction: 'Adopter insert moleté croisé double cône spécifique',
              responsible: 'E. Mercier (Calculs)',
              targetDate: '2024-05-20',
              status: 'Closed'
            },
            {
              id: 'DFM-03',
              item: 'Joint d’étanchéité EPDM',
              functionName: 'Garantir indice IP67 face à l’intrusion d’eau',
              failureMode: 'Pénétration d’eau sous jet haute pression',
              failureEffect: 'Court-circuit ou oxydation des broches du connecteur',
              severity: 8,
              specialChar: 'SC',
              cause: 'Taux de compression du joint insuffisant (< 20%)',
              preventionControl: 'Dimensionnement gorge de joint selon DIN 3771',
              occurrence: 3,
              detectionControl: 'Test d’immersion IP67 et jet 100 bar IP69K',
              detection: 4,
              rpn: 96,
              recommendedAction: 'Optimiser la lèvre d’étanchéité surmoulée TPE',
              responsible: 'A. Bernard (Design)',
              targetDate: '2024-06-01',
              status: 'Closed'
            }
          ],
          ccsc: [
            { id: 'CC-01', charNumber: 'CC-1', description: 'Entraxe de fixation des inserts M6 (120 ± 0.05 mm)', classification: 'CC', productSpec: '120.00 ± 0.05 mm', processParameter: 'Refroidissement moule injection', inspectionMethod: 'Machine à mesurer tridimensionnelle (CMM)', fmeaRef: 'DFM-02' },
            { id: 'CC-02', charNumber: 'CC-2', description: 'Couple de serrage vis M6 sans rupture', classification: 'CC', productSpec: 'Couple ≥ 12.0 Nm', processParameter: 'Température matière injection 280°C', inspectionMethod: 'Clé dynamométrique étalonnée', fmeaRef: 'DFM-02' },
            { id: 'SC-01', charNumber: 'SC-1', description: 'Planéité plan de joint', classification: 'SC', productSpec: 'Planéité ≤ 0.08 mm', processParameter: 'Pression de maintien 750 bar', inspectionMethod: 'Marbre et comparateur numérique', fmeaRef: 'DFM-03' },
            { id: 'SC-02', charNumber: 'SC-2', description: 'Force d’encliquetage du capteur', classification: 'SC', productSpec: '35 N ≤ F ≤ 65 N', processParameter: 'Temps de cycle et éjection', inspectionMethod: 'Dynamomètre d’insertion en bout de ligne', fmeaRef: 'DFM-01' }
          ],
          dvpr: [
            { id: 'DVP-01', testName: 'Endurance Thermique (-40°C / +125°C)', specRef: 'ISO 16750-4 §5.1', sampleSize: 12, acceptanceCriteria: 'Aucune fissure, variation dimensionnelle < 0.1%', facility: 'Laboratoire Central Fiabilité', startDate: '2024-04-10', endDate: '2024-05-02', status: 'Pass', resultSummary: 'Conforme : 500 cycles validés sans dégradation' },
            { id: 'DVP-02', testName: 'Vibrations aléatoires 3 axes + Chocs 50g', specRef: 'ISO 16750-3 §4.1', sampleSize: 8, acceptanceCriteria: 'Maintien capteur sans desserrage ni casse', facility: 'Banc Vibrant Shaker Lab', startDate: '2024-05-05', endDate: '2024-05-18', status: 'Pass', resultSummary: 'Conforme : 32h par axe sans anomalie' },
            { id: 'DVP-03', testName: 'Étanchéité IP67 & Jet d’eau haute pression', specRef: 'CEI 60529', sampleSize: 10, acceptanceCriteria: 'Zéro goutte d’eau détectée dans le logement', facility: 'Chambre d’essai étanchéité', startDate: '2024-05-20', endDate: '2024-05-28', status: 'Pass', resultSummary: 'Conforme : Test 1m d’eau validé' },
            { id: 'DVP-04', testName: 'Tenue chimique (DOT4, Huile synthétique)', specRef: 'DBL 5400 §7', sampleSize: 6, acceptanceCriteria: 'Pas de ramollissement ni gonflement > 2%', facility: 'Labo Chimie Matériaux', startDate: '2024-06-01', endDate: '2024-06-10', status: 'Pass', resultSummary: 'Conforme : Éprouvettes intactes après 96h' }
          ],
          processSteps: [
            { id: 'OP-10', stepNumber: '10', operationName: 'Séchage matière PBT-GF30 & Alimentation', workCenter: 'Dessiccateur Piovan', tooling: 'Trémie sous vide', cycleTimeSec: 14400, keyProductChar: 'Humidité résiduelle < 0.02%', keyProcessChar: 'Température séchage 120°C, 4h', type: 'operation' },
            { id: 'OP-20', stepNumber: '20', operationName: 'Moulage par injection thermoplastique', workCenter: 'Presse Engel 200T', tooling: 'Moule 2 empreintes avec canaux chauds', cycleTimeSec: 32, keyProductChar: 'Cotes critiques SCS, poids pièce', keyProcessChar: 'T° fusion 275°C, Pression maintien 720 bar', type: 'operation' },
            { id: 'OP-30', stepNumber: '30', operationName: 'Pose automatique des inserts laiton M6', workCenter: 'Poste Ultrasons Branson', tooling: 'Sonotrode titanée double tête', cycleTimeSec: 8, keyProductChar: 'Enfoncement insert 0.0/-0.1 mm', keyProcessChar: 'Fréquence 20 kHz, Force 450 N', type: 'operation' },
            { id: 'OP-40', stepNumber: '40', operationName: 'Surmoulage / Assemblage joint TPE', workCenter: 'Poste dépose robotisé ABB', tooling: 'Buse de dépose glue & joint', cycleTimeSec: 14, keyProductChar: 'Continuité cordon joint 100%', keyProcessChar: 'Débit colle 1.2 g/s, T° 190°C', type: 'operation' },
            { id: 'OP-50', stepNumber: '50', operationName: 'Contrôle automatique par vision & CMM', workCenter: 'Cellule Cognex 3D', tooling: 'Caméras haute résolution 4K', cycleTimeSec: 6, keyProductChar: 'Présence insert, cote Ø 6.2 mm, zéro bavure', keyProcessChar: 'Seuil détection IA 99.9%', type: 'inspection' },
            { id: 'OP-60', stepNumber: '60', operationName: 'Conditionnement & Étiquetage code GALIA', workCenter: 'Poste Emballage Manuel/Auto', tooling: 'Bac ESD + Intercalaires thermoformés', cycleTimeSec: 18, keyProductChar: 'Quantité 120 pcs/bac, Étiquette 2D Datamatrix', keyProcessChar: 'Traçabilité lot lot-par-lot', type: 'storage' }
          ],
          pfmea: [
            {
              id: 'PFM-01',
              stepNumber: '10',
              processFunction: 'Déshydratation des granulés PBT',
              failureMode: 'Humidité matière trop élevée (> 0.05%)',
              failureEffect: 'Dégradation polymère, perte de résistance mécanique',
              severity: 8,
              specialChar: 'CC',
              cause: 'Panne résistance dessiccateur ou temps de séchage écourté',
              preventionControl: 'Enregistreur automatique point de rosée (-40°C)',
              occurrence: 2,
              detectionControl: 'Mesure d’humidité Karl Fischer avant démarrage',
              detection: 2,
              rpn: 32,
              correctiveAction: 'Verrouillage automatique de la presse si rosée > -35°C',
              responsible: 'J. Fabre (Maintenance)',
              status: 'Closed'
            },
            {
              id: 'PFM-02',
              stepNumber: '20',
              processFunction: 'Injection matière dans empreintes',
              failureMode: 'Retassure ou manque matière sur patte de fixation',
              failureEffect: 'Fragilité mécanique, jeu d’assemblage sur véhicule',
              severity: 7,
              specialChar: 'SC',
              cause: 'Baisse de pression de maintien ou bouchage buse',
              preventionControl: 'Régulation en boucle fermée courbe pression cavité',
              occurrence: 3,
              detectionControl: 'Capteur de pression Kistler avec tri pièce auto',
              detection: 2,
              rpn: 42,
              correctiveAction: 'Alarme sonore et volet de rejet pneumatique actif',
              responsible: 'T. Vasseur (Méthodes)',
              status: 'Closed'
            },
            {
              id: 'PFM-03',
              stepNumber: '30',
              processFunction: 'Insertion ultrasonique insert M6',
              failureMode: 'Insert incliné ou mal enfoncé (> +0.15 mm)',
              failureEffect: 'Défaut de planéité au vissage, rupture clip OEM',
              severity: 8,
              specialChar: 'CC',
              cause: 'Usure sonotrode ou mauvais positionnement robot',
              preventionControl: 'Gabarit de centrage trempé avec capteur de présence',
              occurrence: 3,
              detectionControl: 'Mesure de course laser LVDT en fin de cycle',
              detection: 2,
              rpn: 48,
              correctiveAction: 'Poka-yoké arrêt machine si cote hors plage',
              responsible: 'L. Gomez (Projets)',
              status: 'Closed'
            }
          ],
          controlPlan: [
            { id: 'CP-01', stepNumber: '10', operation: 'Séchage granulés', machine: 'Dessiccateur Piovan', charNumber: '1.1', productChar: 'Humidité granulés', processChar: 'Point de rosée / T°', specialCharType: 'SC', specification: '< 0.02% | T°: 120 ± 5°C', evalTechnique: 'Capteur hygrométrique en ligne', sampleSize: 'Continu', sampleFreq: '100% temps réel', controlMethod: 'Arrêt alerte si rosée > -35°C', reactionPlan: 'Bloquer trémie, re-sécher 2h' },
            { id: 'CP-02', stepNumber: '20', operation: 'Injection presse 200T', machine: 'Engel 200T', charNumber: '2.1', productChar: 'Poids pièce / Aspect', processChar: 'Pression de maintien 720 bar', specialCharType: 'CC', specification: '42.5 ± 1.2 g | Sans bavure', evalTechnique: 'Balance de précision 0.01g + Visuel', sampleSize: '5 pièces', sampleFreq: 'Début, milieu et fin de poste', controlMethod: 'Carte de contrôle SPC X-bar/R', reactionPlan: 'Ajuster maintien, isoler lot 50 pcs' },
            { id: 'CP-03', stepNumber: '30', operation: 'Insertion ultrasons M6', machine: 'Branson 20kHz', charNumber: '3.1', productChar: 'Hauteur d’affleurement', processChar: 'Énergie de soudage 350 J', specialCharType: 'CC', specification: '0.00 / -0.10 mm', evalTechnique: 'Palpeur numérique LVDT', sampleSize: '100%', sampleFreq: 'Chaque pièce', controlMethod: 'Poka-yoké tri automatique', reactionPlan: 'Rejet au bac rouge verrouillé' },
            { id: 'CP-04', stepNumber: '50', operation: 'Contrôle Vision 3D', machine: 'Cellule Cognex', charNumber: '5.1', productChar: 'Entraxe & Présence joint', processChar: 'Éclairage dôme LED', specialCharType: 'CC', specification: '120.00 ± 0.05 mm', evalTechnique: 'Caméra industrielle 4K', sampleSize: '100%', sampleFreq: 'Chaque pièce', controlMethod: 'Enregistrement SQL & Rejet auto', reactionPlan: 'Arrêt ligne si 3 rejets consécutifs' }
          ],
          workInstructions: [
            {
              id: 'WI-01',
              stepNumber: '20',
              title: 'Démarrage et surveillance presse injection Engel 200T',
              workstation: 'Ilot Injection Plastique 02',
              ppeRequired: ['Lunettes de sécurité', 'Gants anti-chaleur 300°C', 'Chaussures de sécurité', 'Bouchons d’oreille'],
              toolsRequired: ['Pince coupante affleurante', 'Pied à coulisse numérique étalonné', 'Balance de précision Mettler'],
              instructions: [
                '1. Vérifier la conformité de la fiche paramètres matière PBT-GF30 affichée au pupitre.',
                '2. Purger le cylindre d’injection (3 injections à vide dans le bac de purge dédié).',
                '3. Lancer les 5 premières pièces d’amorçage et les rebuter systématiquement.',
                '4. Contrôler les pièces n°6 et 7 : pesée, contrôle visuel des plans de joint sous lampe d’inspection.',
                '5. Enregistrer les mesures sur la tablette SPC atelier et signer le démarrage de série.'
              ],
              criticalChecks: [
                'Zéro retassure sur les zones des clips de fixation capteur.',
                'Absence totale de bavure > 0.05 mm sur la gorge de réception du joint.',
                'Masse de la pièce comprise impérativement entre 41.3 g et 43.7 g.'
              ],
              safetyWarning: 'Zone chaude et risque de pincement : ne jamais neutraliser les barrières immatérielles de la presse.',
              revision: 'Rev 2.1 (Validé Qualité / Production)'
            },
            {
              id: 'WI-02',
              stepNumber: '30',
              title: 'Opération d’insertion des inserts métalliques M6 par ultrasons',
              workstation: 'Poste Ultrasons Branson',
              ppeRequired: ['Lunettes de sécurité', 'Gants anti-coupure niveau 3', 'Chaussures de sécurité'],
              toolsRequired: ['Gabarit GO / NO-GO hauteur insert', 'Clé dynamométrique de test 8.5 Nm'],
              instructions: [
                '1. Placer le corps plastique dans le nid de maintien indexé en vérifiant le détrompeur.',
                '2. Alimenter les deux inserts laiton M6 dans les rails de guidage automatiques.',
                '3. Actionner la commande bi-manuelle pour déclencher le cycle de soudage.',
                '4. Après remontée de la sonotrode, vérifier le voyant vert "Cycle Validé".',
                '5. Contrôler l’affleurement avec le gabarit étalon 1 pièce toutes les heures.'
              ],
              criticalChecks: [
                'L’insert ne doit dépasser sous aucun prétexte au-dessus de la surface plastique.',
                'Contrôle destructif de couple d’arrachement sur 1 pièce au démarrage de poste (≥ 12 Nm).'
              ],
              safetyWarning: 'Commande bi-manuelle obligatoire pour éviter tout risque d’écrasement des doigts.',
              revision: 'Rev 1.4'
            }
          ],
          measurements: {
            nominal: 120.00,
            usl: 120.05,
            lsl: 119.95,
            unit: 'mm',
            samples: [
              120.012, 119.998, 120.005, 120.018, 120.002, 119.988, 120.014, 120.006, 120.021, 119.995,
              120.008, 120.015, 120.001, 119.992, 120.017, 120.004, 120.011, 119.989, 120.016, 120.003,
              120.007, 120.022, 119.997, 120.013, 120.005, 119.991, 120.019, 120.008, 120.002, 120.014,
              119.996, 120.010, 120.007, 120.016, 119.993, 120.005, 120.018, 120.001, 120.012, 119.999,
              120.009, 120.015, 119.994, 120.006, 120.020, 120.003, 119.987, 120.011, 120.004, 120.016
            ]
          },
          gageRR: {
            appraisersCount: 3,
            partsCount: 10,
            trialsCount: 3,
            equipmentName: 'Machine CMM Zeiss Prismo / Sonde VAST XT Gold',
            parameter: 'Cote d’entraxe 120 ± 0.05 mm',
            evPercent: 5.2,
            avPercent: 4.8,
            grrPercent: 7.08,
            ndc: 14,
            status: 'Acceptable'
          },
          cases8D: [
            {
              id: '8D-2024-001',
              title: 'Léger bavurage en bord de joint lors des essais présérie Run@Rate',
              partNumber: 'SCS-2024-045',
              openedDate: '2024-07-12',
              status: 'Closed',
              champion: 'M. Lefebvre (Responsable Qualité UAP)',
              d1Team: ['M. Lefebvre (Qualité)', 'T. Vasseur (Méthodes)', 'J. Fabre (Maintenance)', 'A. Bernard (BE)'],
              d2Problem: 'Observation de bavures plastiques de 0.08 mm sur 14 pièces issues de l’empreinte n°2 lors du run de 500 pièces.',
              d3Containment: 'Tri 100% visuel mis en place en sortie de presse avec loupe binoculaire. 14 pièces non conformes isolées et détruites.',
              d4RootCause5Why: [
                '1. Pourquoi la bavure apparaît-elle ? -> Matière infiltrée dans le plan de joint du moule.',
                '2. Pourquoi s’infiltre-t-elle ? -> Pression de verrouillage du plateau inférieure au seuil optimal sur l’empreinte 2.',
                '3. Pourquoi la pression est-elle insuffisante ? -> Léger décalage angulaire de 0.03 mm de la colonne de guidage droite.',
                '4. Pourquoi ce décalage ? -> Couple de serrage insuffisant de la bague de centrage lors du remontage maintenance.',
                '5. Cause racine -> Absence de clé dynamométrique obligatoire dans la gamme de remontage outillage.'
              ],
              d5CorrectiveActions: 'Révision de la gamme de maintenance moule : serrage au couple des 4 colonnes avec clé étalonnée + contrôle au comparateur.',
              d6Verification: 'Essai de validation sur 2000 pièces : zéro bavure observée, profilométrie max 0.02 mm (< 0.05 mm toléré).',
              d7PreventRecurrence: 'Mise à jour standard maintenance TPM niveau 2 et affichage du tableau des couples de serrage moule.',
              d8Congratulate: 'Félicitations à l’équipe Méthodes/Maintenance pour la réactivité (clôture sous 72h sans retard client).'
            }
          ],
          ppapElements: defaultPPAPElements,
          pswSignoff: {
            partName: 'Support Capteur Stationnement Avant',
            partNumber: 'SCS-2024-045',
            drawingRevision: 'Rev C',
            supplierName: 'Automotive Precision Polymers SAS',
            supplierLocation: 'Site de Production Douai, France',
            submissionLevel: 3,
            warrantSignedBy: 'Jean Dupont - Directeur Qualité Projet',
            warrantDate: '2024-09-20',
            isApproved: true
          },
          kpis: {
            ppm: 18,
            oee: 89.4,
            scrapRate: 0.65,
            firstPassYield: 99.35,
            customerComplaints: 0
          },
          driftAlerts: [
            {
              id: 'ALT-01',
              title: 'Dérive de moyenne détectée sur l’entraxe (Presse 200T)',
              ruleTriggered: 'Règle Nelson 2 : 9 points consécutifs au-dessus de la ligne centrale (120.000 mm)',
              severity: 'warning',
              timestamp: 'Aujourd’hui 10:45',
              resolved: false
            }
          ],
          reverseFmeaAudits: [
            {
              id: 'RFM-01',
              station: 'Poste 30 - Insertion Ultrasons',
              observedIssue: 'Opérateur risquant de positionner l’insert à l’envers si le rail vibreur est secoué',
              detectionMethod: 'Audit de poste 5S / Gemba Walk',
              actionRequired: 'Ajouter une cellule optique de détrompage d’orientation sur le rail d’alimentation',
              auditor: 'P. Morel (Auditeur Interne IATF)',
              date: '2024-08-14'
            }
          ],
          capaList: [
            { id: 'CAPA-101', title: 'Intégration capteur optique détrompeur insert M6', source: 'Internal FMEA', priority: 'High', stage: 'Do', owner: 'T. Vasseur', dueDate: '2024-09-30', status: 'In Progress' },
            { id: 'CAPA-102', title: 'Automatisation du transfert SPC vers ERP SAP', source: 'Audit', priority: 'Medium', stage: 'Act', owner: 'J. Dupont', dueDate: '2024-10-15', status: 'Pending' },
            { id: 'CAPA-103', title: 'Étalonnage semestriel comparateurs LVDT Branson', source: 'Internal FMEA', priority: 'Medium', stage: 'Check', owner: 'Metrology Lab', dueDate: '2024-11-01', status: 'In Progress' }
          ],
          lessonsLearned: [
            { id: 'LL-01', category: 'Design', phase: 2, problemSummary: 'Rayon de congé trop faible sur clips thermoplastiques causant amorce de rupture.', rootCause: 'Manque de prise en compte des contraintes dynamiques d’encliquetage sous grand froid (-40°C).', recommendation: 'Toujours imposer un rayon de congé minimum R ≥ 0.8 mm sur les clips flexibles en PBT chargé verre.', projectOrigin: 'Projet SCS-2024', date: '2024-05-20' },
            { id: 'LL-02', category: 'Process', phase: 3, problemSummary: 'Sensibilité au point de rosée lors du redémarrage du lundi matin.', rootCause: 'Trémie laissée sous tension sans brassage d’air pendant le week-end.', recommendation: 'Procédure automatique de vidange trémie le vendredi soir et cycle de préchauffage 2h avant poste.', projectOrigin: 'Projet SCS-2024', date: '2024-07-05' }
          ]
        },
        2: {
          vocText: 'Boîtier aluminium ECU moteur étanche IP69K résistant aux hautes températures sous capot (150°C).',
          requirements: [
            { id: 'REQ-201', source: 'VOC Client', characteristic: 'Étanchéité boîtier', type: 'réglementaire', specification: 'IP69K', criticality: 'critical', verification: 'Jet 100 bar 80°C' }
          ],
          milestones: [
            { id: 'M1', name: 'Phase 1 à 5 Terminé', startDate: '2024-01-01', endDate: '2024-12-01', duration: 12, phase: 5, status: 'completed' }
          ],
          specifications: {
            dimensions: '220 x 180 x 45 mm',
            material: 'Aluminium coulé sous pression AlSi9Cu3',
            cadModel: 'ECU_ALU_REV_E.stp',
            operatingTemp: '-40°C à +150°C',
            weightGrams: '680 g',
            complianceNorms: 'IATF 16949, ISO 26262 ASIL-D',
            tolerances: 'Planéité joint : 0.05 mm'
          },
          dfmea: [],
          ccsc: [],
          dvpr: [],
          processSteps: [],
          pfmea: [],
          controlPlan: [],
          workInstructions: [],
          measurements: {
            nominal: 50.00,
            usl: 50.03,
            lsl: 49.97,
            unit: 'mm',
            samples: [50.005, 50.002, 50.008, 49.998, 50.001, 50.004, 50.006, 49.999, 50.002, 50.005]
          },
          gageRR: {
            appraisersCount: 3,
            partsCount: 10,
            trialsCount: 3,
            equipmentName: 'Marbre CMM Zeiss',
            parameter: 'Planéité',
            evPercent: 4.1,
            avPercent: 3.8,
            grrPercent: 5.6,
            ndc: 18,
            status: 'Acceptable'
          },
          cases8D: [],
          ppapElements: defaultPPAPElements,
          pswSignoff: {
            partName: 'Boîtier Électronique Moteur',
            partNumber: 'BEM-2024-089',
            drawingRevision: 'Rev E',
            supplierName: 'Automotive Precision Castings',
            supplierLocation: 'Metz, France',
            submissionLevel: 3,
            warrantSignedBy: 'Directeur Qualité',
            warrantDate: '2024-12-01',
            isApproved: true
          },
          kpis: { ppm: 4, oee: 93.2, scrapRate: 0.3, firstPassYield: 99.7, customerComplaints: 0 },
          driftAlerts: [],
          reverseFmeaAudits: [],
          capaList: [],
          lessonsLearned: []
        },
        3: {
          vocText: 'Pédale de frein renforcée résistant à un effort de panique de 2500 N sans déformation permanente.',
          requirements: [
            { id: 'REQ-301', source: 'Norme Sécurité Freinage', characteristic: 'Résistance charge ultime', type: 'fonctionnelle', specification: 'F ≥ 2500 N', criticality: 'critical', verification: 'Essai quasi-statique de flexion' }
          ],
          milestones: [
            { id: 'M1', name: 'Phase 1 : Lancement APQP', startDate: '2024-11-01', endDate: '2025-01-15', duration: 2, phase: 1, status: 'in_progress' }
          ],
          specifications: {
            dimensions: '320 x 85 x 50 mm',
            material: 'Acier 22MnB5 estampé à chaud',
            cadModel: 'BRAKE_PEDAL_2024.stp',
            operatingTemp: '-40°C à +90°C',
            weightGrams: '1150 g',
            complianceNorms: 'ECE R13-H, FMVSS 105',
            tolerances: 'Alignement patin : ± 0.5 mm'
          },
          dfmea: [],
          ccsc: [],
          dvpr: [],
          processSteps: [],
          pfmea: [],
          controlPlan: [],
          workInstructions: [],
          measurements: {
            nominal: 15.00,
            usl: 15.10,
            lsl: 14.90,
            unit: 'mm',
            samples: [15.02, 14.98, 15.01, 15.04, 14.99]
          },
          gageRR: {
            appraisersCount: 3,
            partsCount: 10,
            trialsCount: 3,
            equipmentName: 'Bras de mesure Faro',
            parameter: 'Épaisseur',
            evPercent: 6.5,
            avPercent: 5.0,
            grrPercent: 8.2,
            ndc: 12,
            status: 'Acceptable'
          },
          cases8D: [],
          ppapElements: defaultPPAPElements,
          pswSignoff: {
            partName: 'Pédale de Frein Renforcée',
            partNumber: 'PF-2024-112',
            drawingRevision: 'Rev A',
            supplierName: 'Safety Brake Systems',
            supplierLocation: 'Strasbourg, France',
            submissionLevel: 3,
            warrantSignedBy: 'Qualité Projets',
            warrantDate: '2025-03-01',
            isApproved: false
          },
          kpis: { ppm: 0, oee: 0, scrapRate: 0, firstPassYield: 100, customerComplaints: 0 },
          driftAlerts: [],
          reverseFmeaAudits: [],
          capaList: [],
          lessonsLearned: []
        }
      },

      setActiveProject: (id) => set({ activeProjectId: id }),

      loadProjectsFromSupabase: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            console.warn('No authenticated user found')
            return
          }
          const userId = user.id

          const supabaseProjects = await fetchProjects(userId)
          const projects = supabaseProjects.map(fromSupabaseProject)
          
          // Always replace projects with Supabase data to ensure supabaseId is present
          set((state) => ({
            projects: projects,
            projectData: projects.reduce((acc, project) => {
              if (!acc[project.id]) {
                acc[project.id] = {
                  vocText: '',
                  requirements: [],
                  milestones: [
                    { id: '1', name: 'Gate 0: Initialisation', date: '', completed: true },
                    { id: '2', name: 'Gate 1: Planification', date: '', completed: false },
                    { id: '3', name: 'Gate 2: Conception', date: '', completed: false },
                    { id: '4', name: 'Gate 3: Validation', date: '', completed: false },
                    { id: '5', name: 'Gate 4: Production', date: '', completed: false }
                  ],
                  dfmea: {
                    header: { partName: project.name, partNumber: project.partNumber, revision: 'A', date: '', teamLeader: '' },
                    items: []
                  },
                  pfmea: {
                    header: { processName: 'Initial', revision: 'A', date: '', teamLeader: '' },
                    items: []
                  },
                  controlPlan: {
                    header: { partName: project.name, partNumber: project.partNumber, revision: 'A', date: '', approvedBy: '' },
                    stations: []
                  },
                  spc: {
                    parameter: { name: 'Cote principale', nominal: 100, usl: 100.1, lsl: 99.9, unit: 'mm' },
                    measurements: []
                  },
                  gageRR: {
                    appraisersCount: 3,
                    partsCount: 10,
                    trialsCount: 3,
                    equipmentName: 'CMM',
                    parameter: 'Cote principale',
                    evPercent: 6,
                    avPercent: 4,
                    grrPercent: 7.2,
                    ndc: 14,
                    status: 'Acceptable' as const
                  },
                  cases8D: [],
                  ppapElements: [],
                  pswSignoff: {
                    partName: project.name,
                    partNumber: project.partNumber,
                    revision: 'A',
                    date: '',
                    supplierName: project.client,
                    supplierSignature: '',
                    customerSignature: ''
                  },
                  driftAlerts: [],
                  reverseFmeaAudits: [],
                  capaList: [],
                  lessonsLearned: []
                }
              }
              return acc
            }, state.projectData as any)
          }))
          
          console.log('Loaded projects from Supabase:', projects.length)
        } catch (error) {
          console.error('Failed to load projects from Supabase:', error)
        }
      },

      addProject: async (project) => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            throw new Error('No authenticated user found')
          }
          const userId = user.id

          const supabaseProject = await createProjectSupabase(toSupabaseProject(project), userId)
          const newProject = fromSupabaseProject(supabaseProject)
          const newId = newProject.id

          const newProjectData: ProjectPhaseData = {
            vocText: '',
            requirements: [],
            milestones: [
              { id: 'M1', name: 'Phase 1 : Lancement APQP', startDate: new Date().toISOString().split('T')[0], endDate: '', duration: 2, phase: 1, status: 'in_progress' as const },
              { id: 'M2', name: 'Phase 2 : Conception Produit', startDate: '', endDate: '', duration: 3, phase: 2, status: 'pending' as const },
              { id: 'M3', name: 'Phase 3 : Conception Processus', startDate: '', endDate: '', duration: 3, phase: 3, status: 'pending' as const },
              { id: 'M4', name: 'Phase 4 : Validation & PPAP', startDate: '', endDate: '', duration: 2, phase: 4, status: 'pending' as const },
              { id: 'M5', name: 'Phase 5 : Production & Amélioration', startDate: '', endDate: '', duration: 3, phase: 5, status: 'pending' as const },
            ],
            specifications: {
              dimensions: '',
              material: '',
              cadModel: '',
              operatingTemp: '',
              weightGrams: '',
              complianceNorms: 'IATF 16949',
              tolerances: ''
            },
            dfmea: [],
            ccsc: [],
            dvpr: [],
            processSteps: [],
            pfmea: [],
            controlPlan: [],
            workInstructions: [],
            measurements: {
              nominal: 100.0,
              usl: 100.1,
              lsl: 99.9,
              unit: 'mm',
              samples: [100.01, 99.99, 100.03, 100.00, 99.98]
            },
            gageRR: {
              appraisersCount: 3,
              partsCount: 10,
              trialsCount: 3,
              equipmentName: 'CMM',
              parameter: 'Cote principale',
              evPercent: 6,
              avPercent: 4,
              grrPercent: 7.2,
              ndc: 14,
              status: 'Acceptable' as const
            },
            cases8D: [],
            ppapElements: defaultPPAPElements,
            pswSignoff: {
              partName: newProject.name,
              partNumber: newProject.partNumber,
              drawingRevision: 'Rev 01',
              supplierName: 'Automotive Quality Systems',
              supplierLocation: 'France',
              submissionLevel: 3,
              warrantSignedBy: '',
              warrantDate: new Date().toISOString().split('T')[0],
              isApproved: false
            },
            kpis: { ppm: 0, oee: 85, scrapRate: 1.0, firstPassYield: 98.0, customerComplaints: 0 },
            driftAlerts: [],
            reverseFmeaAudits: [],
            capaList: [],
            lessonsLearned: []
          }

          set((state) => ({
            projects: [...state.projects, newProject],
            activeProjectId: newId,
            projectData: {
              ...state.projectData,
              [newId]: newProjectData
            }
          }))

          return newId
        } catch (error) {
          console.error('Failed to create project in Supabase:', error)
          throw error
        }
      },

      updateProject: async (id, partial) => {
        try {
          const project = get().projects.find((p) => p.id === id)
          if (!project) throw new Error('Project not found')

          await updateProjectSupabase(project.supabaseId, toSupabaseProject({ ...project, ...partial }))
          set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? { ...p, ...partial } : p))
          }))
        } catch (error) {
          console.error('Failed to update project in Supabase:', error)
          throw error
        }
      },

      deleteProject: async (id) => {
        try {
          const project = get().projects.find((p) => p.id === id)
          if (!project) throw new Error('Project not found')

          await deleteProjectSupabase(project.supabaseId)
          set((state) => {
            const newActiveProjectId = state.activeProjectId === id 
              ? (state.projects.length > 1 ? state.projects.find((p: Project) => p.id !== id)?.id || 0 : 0)
              : state.activeProjectId
            
            return {
              projects: state.projects.filter((p: Project) => p.id !== id),
              projectData: Object.fromEntries(
                Object.entries(state.projectData).filter(([projectId]) => parseInt(projectId) !== id)
              ),
              activeProjectId: newActiveProjectId
            }
          })
        } catch (error) {
          console.error('Failed to delete project from Supabase:', error)
          throw error
        }
      },

      lockPhase: (projectId, phaseId) => {
        set((state) => {
          const project = state.projects.find((p) => p.id === projectId)
          if (!project) return state

          const locked = new Set(project.lockedPhases)
          locked.add(phaseId)
          const newLockedPhases = Array.from(locked).sort()
          const progress = Math.min(100, newLockedPhases.length * 20)
          const nextPhase = Math.min(5, phaseId + 1)
          const status = progress === 100 ? 'completed' : 'in_progress'

          return {
            projects: state.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    lockedPhases: newLockedPhases,
                    progress,
                    currentPhase: nextPhase,
                    status
                  }
                : p
            )
          }
        })
      },

      // Phase 1
      setVOCText: (projectId, text) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              vocText: text
            }
          }
        }))
      },

      setRequirements: (projectId, reqs) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              requirements: reqs
            }
          }
        }))
      },

      addRequirement: (projectId, req) => {
        set((state) => {
          const current = state.projectData[projectId]?.requirements || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                requirements: [...current, req]
              }
            }
          }
        })
      },

      updateRequirement: (projectId, id, req) => {
        set((state) => {
          const current = state.projectData[projectId]?.requirements || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                requirements: current.map((r) => (r.id === id ? { ...r, ...req } : r))
              }
            }
          }
        })
      },

      deleteRequirement: (projectId, id) => {
        set((state) => {
          const current = state.projectData[projectId]?.requirements || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                requirements: current.filter((r) => r.id !== id)
              }
            }
          }
        })
      },

      setMilestones: (projectId, milestones) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              milestones
            }
          }
        }))
      },

      updateMilestone: (projectId, id, milestone) => {
        set((state) => {
          const current = state.projectData[projectId]?.milestones || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                milestones: current.map((m) => (m.id === id ? { ...m, ...milestone } : m))
              }
            }
          }
        })
      },

      // Phase 2
      setSpecifications: (projectId, specs) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              specifications: specs
            }
          }
        }))
      },

      setDFMEA: (projectId, rows) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              dfmea: rows
            }
          }
        }))
      },

      addDFMEARow: (projectId, row) => {
        set((state) => {
          const current = state.projectData[projectId]?.dfmea || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                dfmea: [...current, row]
              }
            }
          }
        })
      },

      updateDFMEARow: (projectId, id, row) => {
        set((state) => {
          const current = state.projectData[projectId]?.dfmea || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                dfmea: current.map((r) => (r.id === id ? { ...r, ...row } : r))
              }
            }
          }
        })
      },

      deleteDFMEARow: (projectId: number, id: string) => {
        set((state) => {
          const current = state.projectData[projectId]?.dfmea || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                dfmea: current.filter((r) => r.id !== id)
              }
            }
          }
        })
      },

      setCCSC: (projectId, items) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              ccsc: items
            }
          }
        }))
      },

      addCCSCItem: (projectId, item) => {
        set((state) => {
          const current = state.projectData[projectId]?.ccsc || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                ccsc: [...current, item]
              }
            }
          }
        })
      },

      setDVPR: (projectId, items) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              dvpr: items
            }
          }
        }))
      },

      addDVPRRow: (projectId, row) => {
        set((state) => {
          const current = state.projectData[projectId]?.dvpr || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                dvpr: [...current, row]
              }
            }
          }
        })
      },

      updateDVPRRow: (projectId, id, row) => {
        set((state) => {
          const current = state.projectData[projectId]?.dvpr || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                dvpr: current.map((r) => (r.id === id ? { ...r, ...row } : r))
              }
            }
          }
        })
      },

      // Phase 3
      setProcessSteps: (projectId, steps) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              processSteps: steps
            }
          }
        }))
      },

      addProcessStep: (projectId, step) => {
        set((state) => {
          const current = state.projectData[projectId]?.processSteps || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                processSteps: [...current, step]
              }
            }
          }
        })
      },

      updateProcessStep: (projectId, id, step) => {
        set((state) => {
          const current = state.projectData[projectId]?.processSteps || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                processSteps: current.map((s) => (s.id === id ? { ...s, ...step } : s))
              }
            }
          }
        })
      },

      setPFMEA: (projectId, rows) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              pfmea: rows
            }
          }
        }))
      },

      addPFMEARow: (projectId, row) => {
        set((state) => {
          const current = state.projectData[projectId]?.pfmea || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                pfmea: [...current, row]
              }
            }
          }
        })
      },

      updatePFMEARow: (projectId, id, row) => {
        set((state) => {
          const current = state.projectData[projectId]?.pfmea || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                pfmea: current.map((r) => (r.id === id ? { ...r, ...row } : r))
              }
            }
          }
        })
      },

      deletePFMEARow: (projectId: number, id: string) => {
        set((state) => {
          const current = state.projectData[projectId]?.pfmea || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                pfmea: current.filter((r) => r.id !== id)
              }
            }
          }
        })
      },

      setControlPlan: (projectId, rows) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              controlPlan: rows
            }
          }
        }))
      },

      addControlPlanRow: (projectId, row) => {
        set((state) => {
          const current = state.projectData[projectId]?.controlPlan || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                controlPlan: [...current, row]
              }
            }
          }
        })
      },

      updateControlPlanRow: (projectId, id, row) => {
        set((state) => {
          const current = state.projectData[projectId]?.controlPlan || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                controlPlan: current.map((r) => (r.id === id ? { ...r, ...row } : r))
              }
            }
          }
        })
      },

      setWorkInstructions: (projectId, list) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              workInstructions: list
            }
          }
        }))
      },

      addWorkInstruction: (projectId, wi) => {
        set((state) => {
          const current = state.projectData[projectId]?.workInstructions || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                workInstructions: [...current, wi]
              }
            }
          }
        })
      },

      // Phase 4
      setMeasurements: (projectId, data) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              measurements: data
            }
          }
        }))
      },

      setGageRR: (projectId, data) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              gageRR: data
            }
          }
        }))
      },

      setCases8D: (projectId, list) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              cases8D: list
            }
          }
        }))
      },

      updateCase8D: (projectId, id, item) => {
        set((state) => {
          const current = state.projectData[projectId]?.cases8D || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                cases8D: current.map((c) => (c.id === id ? { ...c, ...item } : c))
              }
            }
          }
        })
      },

      setPPAPElements: (projectId, elements) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              ppapElements: elements
            }
          }
        }))
      },

      updatePPAPElement: (projectId, id, status, comments) => {
        set((state) => {
          const current = state.projectData[projectId]?.ppapElements || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                ppapElements: current.map((el) =>
                  el.id === id ? { ...el, status, ...(comments ? { comments } : {}) } : el
                )
              }
            }
          }
        })
      },

      setPSWSignoff: (projectId, psw) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              pswSignoff: psw
            }
          }
        }))
      },

      // Phase 5
      setCAPAList: (projectId, items) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              capaList: items
            }
          }
        }))
      },

      addCAPAItem: (projectId, item) => {
        set((state) => {
          const current = state.projectData[projectId]?.capaList || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                capaList: [...current, item]
              }
            }
          }
        })
      },

      updateCAPAItem: (projectId, id, item) => {
        set((state) => {
          const current = state.projectData[projectId]?.capaList || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                capaList: current.map((c) => (c.id === id ? { ...c, ...item } : c))
              }
            }
          }
        })
      },

      setLessonsLearned: (projectId, items) => {
        set((state) => ({
          projectData: {
            ...state.projectData,
            [projectId]: {
              ...(state.projectData[projectId] || {}),
              lessonsLearned: items
            }
          }
        }))
      },

      addLessonLearned: (projectId, item) => {
        set((state) => {
          const current = state.projectData[projectId]?.lessonsLearned || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                lessonsLearned: [...current, item]
              }
            }
          }
        })
      },

      resolveDriftAlert: (projectId, id) => {
        set((state) => {
          const current = state.projectData[projectId]?.driftAlerts || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                driftAlerts: current.map((a) => (a.id === id ? { ...a, resolved: true } : a))
              }
            }
          }
        })
      },

      addReverseFmeaAudit: (projectId, audit) => {
        set((state) => {
          const current = state.projectData[projectId]?.reverseFmeaAudits || []
          return {
            projectData: {
              ...state.projectData,
              [projectId]: {
                ...(state.projectData[projectId] || {}),
                reverseFmeaAudits: [...current, audit]
              }
            }
          }
        })
      }
    }),
    {
      name: 'ai-apqp-storage',
      partialize: (state) => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId,
        projectData: state.projectData
      })
    }
  )
)
