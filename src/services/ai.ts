const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface DFMEASuggestion {
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
  status: string
}

export async function generateDFMEASuggestions(
  itemDescription: string,
  partInfo?: { partNumber: string; material?: string; process?: string }
): Promise<DFMEASuggestion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/ai/dfmea-suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemDescription,
        partNumber: partInfo?.partNumber,
        material: partInfo?.material,
        process: partInfo?.process,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.suggestions || []
  } catch (error) {
    console.error('Error generating DFMEA suggestions:', error)
    throw error
  }
}
