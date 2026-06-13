import { Router } from 'express'
import { execFile } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

export const stocksRouter = Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const QUOTES_PY = path.join(__dirname, '../py/quotes.py')

const DEFAULT_WATCHLIST = [
  'AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD',
  'PLTR', 'GME', 'AMC', 'SPY', 'QQQ', 'SOFI', 'RIVN', 'HOOD',
  'BTC-USD', 'ETH-USD',
]

const SYMBOL_LIST = [
  { symbol: 'AAPL',  shortname: 'Apple Inc.' },
  { symbol: 'TSLA',  shortname: 'Tesla Inc.' },
  { symbol: 'NVDA',  shortname: 'NVIDIA Corp.' },
  { symbol: 'MSFT',  shortname: 'Microsoft Corp.' },
  { symbol: 'GOOGL', shortname: 'Alphabet Inc.' },
  { symbol: 'AMZN',  shortname: 'Amazon.com Inc.' },
  { symbol: 'META',  shortname: 'Meta Platforms Inc.' },
  { symbol: 'AMD',   shortname: 'Advanced Micro Devices' },
  { symbol: 'PLTR',  shortname: 'Palantir Technologies' },
  { symbol: 'GME',   shortname: 'GameStop Corp.' },
  { symbol: 'AMC',   shortname: 'AMC Entertainment' },
  { symbol: 'SPY',   shortname: 'SPDR S&P 500 ETF' },
  { symbol: 'QQQ',   shortname: 'Invesco QQQ Trust' },
  { symbol: 'SOFI',  shortname: 'SoFi Technologies' },
  { symbol: 'RIVN',  shortname: 'Rivian Automotive' },
  { symbol: 'HOOD',  shortname: 'Robinhood Markets' },
  { symbol: 'BTC-USD', shortname: 'Bitcoin USD' },
  { symbol: 'ETH-USD', shortname: 'Ethereum USD' },
  { symbol: 'COIN',  shortname: 'Coinbase Global' },
  { symbol: 'MSTR',  shortname: 'MicroStrategy Inc.' },
  { symbol: 'NFLX',  shortname: 'Netflix Inc.' },
  { symbol: 'DIS',   shortname: 'Walt Disney Co.' },
  { symbol: 'BA',    shortname: 'Boeing Co.' },
  { symbol: 'F',     shortname: 'Ford Motor Co.' },
  { symbol: 'INTC',  shortname: 'Intel Corp.' },
  { symbol: 'SNAP',  shortname: 'Snap Inc.' },
  { symbol: 'UBER',  shortname: 'Uber Technologies' },
]

function runPythonQuotes(symbols) {
  return new Promise((resolve, reject) => {
    execFile('python3', [QUOTES_PY, ...symbols], { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message))
      try { resolve(JSON.parse(stdout)) }
      catch (e) { reject(new Error('Failed to parse python output')) }
    })
  })
}

stocksRouter.get('/quote/:symbol', async (req, res) => {
  try {
    const results = await runPythonQuotes([req.params.symbol])
    if (!results.length || results[0].error) {
      return res.status(404).json({ error: results[0]?.error || 'Not found' })
    }
    res.json(results[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

stocksRouter.post('/quotes', async (req, res) => {
  try {
    const symbols = req.body.symbols || DEFAULT_WATCHLIST
    const results = await runPythonQuotes(symbols)
    res.json(results.map(r => ({
      symbol: r.symbol,
      data: r.error ? null : r,
      error: r.error || null,
    })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

stocksRouter.get('/search/:query', (req, res) => {
  const q = req.params.query.toUpperCase()
  const results = SYMBOL_LIST.filter(
    s => s.symbol.includes(q) || s.shortname.toUpperCase().includes(q)
  ).slice(0, 8)
  res.json({ quotes: results })
})

stocksRouter.get('/chart/:symbol', (req, res) => {
  res.json({ quotes: [], meta: { symbol: req.params.symbol } })
})

stocksRouter.get('/news/:symbol', (req, res) => res.json([]))

stocksRouter.get('/default-watchlist', (_req, res) => res.json(DEFAULT_WATCHLIST))
