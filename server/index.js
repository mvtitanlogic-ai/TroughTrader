import express from 'express'
import cors from 'cors'
import { stocksRouter } from './routes/stocks.js'
import { chatRouter } from './routes/chat.js'
import { dataRouter } from './routes/data.js'

const app = express()
const PORT = process.env.PORT || 6001

app.use(cors({ origin: ['http://localhost:5173', 'file://*'] }))
app.use(express.json({ limit: '10mb' }))

app.use('/api/stocks', stocksRouter)
app.use('/api/chat', chatRouter)
app.use('/api/data', dataRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '0.1.0', timestamp: Date.now() })
})

app.listen(PORT, () => {
  console.log(`TroughTrader API server running on http://localhost:${PORT}`)
})
