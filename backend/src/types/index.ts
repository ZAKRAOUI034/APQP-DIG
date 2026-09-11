export interface Project {
  id: number
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

export interface SPCAnalysisRequest {
  nominal: number
  usl: number
  lsl: number
  samples: number[]
}

export interface SPCAnalysisResponse {
  n: number
  mean: number
  stdDev: number
  min: number
  max: number
  cp: number
  cpk: number
  pp: number
  ppk: number
  isCapable: boolean
  toleranceRange: number
}
