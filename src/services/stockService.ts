import type { StockQuote, StockQuoteResult } from '@/types'

const API = '/api/stocks'

export async function fetchQuotes(symbols: string[]): Promise<StockQuoteResult[]> {
  const res = await fetch(`${API}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbols }),
  })
  if (!res.ok) throw new Error('Failed to fetch quotes')
  return res.json()
}

export async function fetchQuote(symbol: string): Promise<StockQuote> {
  const res = await fetch(`${API}/quote/${encodeURIComponent(symbol)}`)
  if (!res.ok) throw new Error(`Failed to fetch ${symbol}`)
  return res.json()
}

export async function fetchChart(symbol: string, period = '1d', interval = '5m') {
  const res = await fetch(`${API}/chart/${encodeURIComponent(symbol)}?period=${period}&interval=${interval}`)
  if (!res.ok) throw new Error(`Failed to fetch chart for ${symbol}`)
  return res.json()
}

export async function searchSymbols(query: string) {
  const res = await fetch(`${API}/search/${encodeURIComponent(query)}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.quotes || []
}

export async function fetchNews(symbol: string) {
  const res = await fetch(`${API}/news/${encodeURIComponent(symbol)}`)
  if (!res.ok) return []
  return res.json()
}

export async function getDefaultWatchlist(): Promise<string[]> {
  const res = await fetch(`${API}/default-watchlist`)
  if (!res.ok) return []
  return res.json()
}

export function formatPrice(price?: number): string {
  if (price == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(price)
}

export function formatPercent(pct?: number): string {
  if (pct == null) return '—'
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(2)}%`
}

export function formatVolume(vol?: number): string {
  if (vol == null) return '—'
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(1)}B`
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`
  return vol.toString()
}

export function formatMarketCap(mc?: number): string {
  if (mc == null) return '—'
  if (mc >= 1e12) return `$${(mc / 1e12).toFixed(2)}T`
  if (mc >= 1e9) return `$${(mc / 1e9).toFixed(1)}B`
  if (mc >= 1e6) return `$${(mc / 1e6).toFixed(1)}M`
  return `$${mc}`
}
