import { Router } from 'express'
import yahooFinance from 'yahoo-finance2'

export const stocksRouter = Router()

const DEFAULT_WATCHLIST = [
  'AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AMD',
  'PLTR', 'GME', 'AMC', 'SPY', 'QQQ', 'SOFI', 'RIVN', 'HOOD',
  'BTC-USD', 'ETH-USD',
]

stocksRouter.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    const quote = await yahooFinance.quote(symbol, {
      fields: ['regularMarketPrice', 'regularMarketChange', 'regularMarketChangePercent',
               'regularMarketVolume', 'marketCap', 'regularMarketOpen', 'regularMarketDayHigh',
               'regularMarketDayLow', 'fiftyTwoWeekHigh', 'fiftyTwoWeekLow',
               'shortName', 'longName', 'symbol'],
    })
    res.json(quote)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

stocksRouter.post('/quotes', async (req, res) => {
  try {
    const symbols = req.body.symbols || DEFAULT_WATCHLIST
    const quotes = await Promise.allSettled(
      symbols.map(s => yahooFinance.quote(s))
    )
    const result = quotes.map((r, i) => ({
      symbol: symbols[i],
      data: r.status === 'fulfilled' ? r.value : null,
      error: r.status === 'rejected' ? r.reason?.message : null,
    }))
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

stocksRouter.get('/chart/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    const { period = '1d', interval = '5m' } = req.query
    const chart = await yahooFinance.chart(symbol, {
      period1: getPeriod1(period),
      interval: interval,
    })
    res.json(chart)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

stocksRouter.get('/search/:query', async (req, res) => {
  try {
    const results = await yahooFinance.search(req.params.query)
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

stocksRouter.get('/news/:symbol', async (req, res) => {
  try {
    const results = await yahooFinance.search(req.params.symbol, { newsCount: 10 })
    res.json(results.news || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

stocksRouter.get('/default-watchlist', (_req, res) => {
  res.json(DEFAULT_WATCHLIST)
})

function getPeriod1(period) {
  const now = new Date()
  const map = {
    '1d': new Date(now - 86400000),
    '5d': new Date(now - 5 * 86400000),
    '1mo': new Date(now - 30 * 86400000),
    '3mo': new Date(now - 90 * 86400000),
    '1y': new Date(now - 365 * 86400000),
  }
  return map[period] || map['1d']
}
