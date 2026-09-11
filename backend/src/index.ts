import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { projectsRouter } from './routes/projects.js'

dotenv.config()

const app = express()
const port = 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Mount API routes
app.use('/api/projects', projectsRouter)

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.listen(port, () => {
  console.log(`🚀 AI-APQP Backend Server running on http://localhost:${port}`)
})
