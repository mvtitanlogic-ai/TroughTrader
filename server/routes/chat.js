import { Router } from 'express'

export const chatRouter = Router()

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'llama3.1-uncensored'

const SYSTEM_PROMPT = `You are TroughBot, a brutally honest trading assistant for TroughTrader — the app for traders who are always in the trough.
You're knowledgeable about stocks, options, crypto, and market dynamics. You give real talk, no fluff.
You acknowledge losses without judgment but push for learning. You have a dark sense of humor about trading.
You have access to live market data — when asked about prices or analysis, the user's frontend will supply current data.
Keep responses concise and actionable. Use trading terminology naturally.`

chatRouter.post('/message', async (req, res) => {
  const { messages, model = DEFAULT_MODEL, stream = false } = req.body

  const payload = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    stream,
    options: {
      temperature: 0.7,
      num_ctx: 4096,
    },
  }

  try {
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      response.body.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(Boolean)
        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            res.write(`data: ${JSON.stringify(data)}\n\n`)
            if (data.done) res.end()
          } catch {}
        }
      })
      response.body.on('end', () => res.end())
      response.body.on('error', () => res.end())
    } else {
      const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      res.json(data)
    }
  } catch (err) {
    res.status(500).json({ error: `Ollama error: ${err.message}. Is Ollama running?` })
  }
})

chatRouter.get('/models', async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`)
    const data = await response.json()
    res.json(data.models || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

chatRouter.get('/health', async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`)
    res.json({ ollama: response.ok, model: DEFAULT_MODEL })
  } catch {
    res.json({ ollama: false, model: DEFAULT_MODEL })
  }
})
