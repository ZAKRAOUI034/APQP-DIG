import { supabase } from '@/lib/supabase'

export interface SupabaseProject {
  id: string
  user_id: string
  project_number: number
  name: string
  client: string
  part_number: string
  annual_volume: number
  launch_date: string
  description?: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  current_phase: number
  locked_phases: number[]
  created_at: string
  updated_at: string
}

export interface SupabasePhaseData {
  project_id: string
  requirements?: any
  specifications?: any
  dfmea?: any
  ccsc?: any
  dvpr?: any
  process_steps?: any
  pfmea?: any
  control_plan?: any
  work_instructions?: any
  measurements?: any
  msa_study?: any
  cases_8d?: any
  ppap_elements?: any
  kpis?: any
  drift_alerts?: any
  reverse_fmea_audits?: any
  capa_list?: any
  lessons_learned?: any
  updated_at?: string
}

// Projects
export async function fetchProjects(userId: string): Promise<SupabaseProject[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
  return data || []
}

export async function createProject(project: Partial<SupabaseProject>, userId: string): Promise<SupabaseProject> {
  // Get the next project number (max + 1) for this user
  const { data: maxData } = await supabase
    .from('projects')
    .select('project_number')
    .eq('user_id', userId)
    .order('project_number', { ascending: false })
    .limit(1)
    .single()
  
  const nextProjectNumber = maxData ? maxData.project_number + 1 : 1

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...project,
      user_id: userId,
      project_number: nextProjectNumber,
      progress: 0,
      current_phase: 1,
      locked_phases: [],
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    throw error
  }
  return data
}

export async function updateProject(id: string, project: Partial<SupabaseProject>): Promise<SupabaseProject> {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...project, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    throw error
  }
  return data
}

export async function deleteProject(id: string): Promise<void> {
  console.log('Deleting project with id:', id)
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('Error details:', error.details)
    console.error('Error hint:', error.hint)
    throw error
  }
  console.log('Project deleted successfully')
}

// Phase Data
export async function fetchPhaseData(projectId: string): Promise<SupabasePhaseData | null> {
  const { data, error } = await supabase
    .from('apqp_phase_data')
    .select('*')
    .eq('project_id', projectId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No data found for this project
      return null
    }
    console.error('Error fetching phase data:', error)
    throw error
  }
  return data
}

export async function upsertPhaseData(projectId: string, data: Partial<SupabasePhaseData>): Promise<SupabasePhaseData> {
  const { data: result, error } = await supabase
    .from('apqp_phase_data')
    .upsert({
      project_id: projectId,
      ...data,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error upserting phase data:', error)
    throw error
  }
  return result
}

// Helper to convert between store format and Supabase format
export function toSupabaseProject(project: any): Partial<SupabaseProject> {
  return {
    project_number: project.projectNumber,
    name: project.name,
    client: project.client,
    part_number: project.partNumber,
    annual_volume: project.annualVolume,
    launch_date: project.launchDate,
    description: project.description,
    status: project.status,
    progress: project.progress,
    current_phase: project.currentPhase,
    locked_phases: project.lockedPhases || [],
  }
}

export function fromSupabaseProject(project: SupabaseProject): any {
  return {
    id: parseInt(project.id),
    supabaseId: project.id,
    projectNumber: project.project_number,
    name: project.name,
    client: project.client,
    partNumber: project.part_number,
    annualVolume: project.annual_volume,
    launchDate: project.launch_date,
    description: project.description || '',
    status: project.status,
    progress: project.progress,
    currentPhase: project.current_phase,
    lockedPhases: project.locked_phases || [],
  }
}
