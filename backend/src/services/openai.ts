import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.OPENAI_API_KEY

const openai = apiKey ? new OpenAI({ apiKey }) : null

export async function extractRequirementsFromVOC(vocText: string) {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an automotive quality expert specialized in IATF 16949 and APQP. Parse the customer Voice of Customer (VOC) text into structured requirements JSON array with fields: id, source, characteristic, type (dimensionnelle|fonctionnelle|réglementaire|esthétique), specification, criticality (low|medium|high|critical), verification.'
          },
          {
            role: 'user',
            content: vocText
          }
        ],
        response_format: { type: 'json_object' }
      })

      const content = response.choices[0]?.message?.content
      if (content) {
        const parsed = JSON.parse(content)
        return parsed.requirements || parsed
      }
    } catch (err) {
      console.warn('OpenAI API call failed, using heuristic fallback:', err)
    }
  }

  // Heuristic Fallback
  const lines = vocText.split('\n').filter((l) => l.trim().length > 5)
  return lines.map((line, idx) => {
    const clean = line.replace(/^\d+[\.\-\)]\s*/, '').trim()
    let type = 'fonctionnelle'
    let criticality = 'high'
    let verification = 'Essai de validation'

    if (/température|thermique|chaleur/i.test(clean)) {
      type = 'fonctionnelle'
      criticality = 'high'
      verification = 'Essai en étuve climatique (ISO 16750-4)'
    } else if (/dimension|cote|mm|diamètre|couple/i.test(clean)) {
      type = 'dimensionnelle'
      criticality = 'critical'
      verification = 'Contrôle tridimensionnel CMM / Banc dynamométrique'
    } else if (/ip67|ip69|norme|réglement/i.test(clean)) {
      type = 'réglementaire'
      criticality = 'critical'
      verification = 'Certification laboratoire accrédité ISO 17025'
    }

    return {
      id: `REQ-${String(idx + 1).padStart(3, '0')}`,
      source: `VOC: ${clean.slice(0, 30)}...`,
      characteristic: clean.split(':')[0] || `Exigence ${idx + 1}`,
      type,
      specification: clean.split(':')[1]?.trim() || clean,
      criticality,
      verification
    }
  })
}

export async function generateDFMEASuggestions(itemDescription: string) {
  return [
    {
      id: 'DFM-GEN-01',
      item: itemDescription,
      functionName: 'Maintien et transmission des efforts',
      failureMode: 'Fissuration sous fatigue vibratoire',
      failureEffect: 'Perte de fonction du composant',
      severity: 8,
      specialChar: 'CC',
      cause: 'Concentration de contraintes au rayon de congé',
      preventionControl: 'Simulation éléments finis Ansys',
      occurrence: 3,
      detectionControl: 'Essai d’endurance sur banc vibrant',
      detection: 3,
      rpn: 72,
      recommendedAction: 'Augmenter les rayons de raccordement et optimiser les nervures',
      responsible: 'Bureau d’Études',
      targetDate: '2025-06-30',
      status: 'Open'
    }
  ]
}
