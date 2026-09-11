import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { projectsRouter } from './routes/projects.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 3001

const allowedOrigins = [
  'http://localhost:5173',
  'https://apqp-dig.vercel.app',
  'https://www.apqp-dig.vercel.app'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))

// Mount API routes
app.use('/api/projects', projectsRouter)

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.listen(port, () => {
  console.log(`🚀 AI-APQP Backend Server running on port ${port}`)
})
