import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { fetchQuotes, getDefaultWatchlist } from '@/services/stockService'
import { StockCard } from './StockCard'
import type { StockQuote } from '@/types'

const REFRESH_INTERVAL = 30_000

export function Dashboard() {
  const { stockData, setStockData, themeColor } = useAppStore()
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  async function loadWatchlist() {
    const list = await getDefaultWatchlist()
    setWatchlist(list)
    return list
  }

  async function refresh(symbols?: string[]) {
    const toFetch = symbols || watchlist
    if (toFetch.length === 0) return
    setRefreshing(true)
    setError(null)
    try {
      const results = await fetchQuotes(toFetch)
      const update: Record<string, StockQuote> = {}
      results.forEach(({ symbol, data }) => { if (data) update[symbol] = data })
      setStockData({ ...stockData, ...update })
      setLastUpdated(new Date())
    } catch (e) {
      setError('Failed to load market data. Is the server running?')
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWatchlist().then((list) => refresh(list))
    const timer = setInterval(() => refresh(), REFRESH_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  const quotes = watchlist.map((sym) => ({ symbol: sym, quote: stockData[sym] })).filter((q) => q.quote)
  const gainers = quotes.filter((q) => (q.quote.regularMarketChangePercent ?? 0) > 0).length
  const losers = quotes.filter((q) => (q.quote.regularMarketChangePercent ?? 0) < 0).length

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Stats bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-trough-border bg-trough-surface/30">
        <StatPill icon={<Activity size={14} />} label="Symbols" value={quotes.length.toString()} color="text-trough-text-dim" />
        <StatPill icon={<TrendingUp size={14} />} label="Gainers" value={gainers.toString()} color="text-emerald-400" />
        <StatPill icon={<TrendingDown size={14} />} label="Losers" value={losers.toString()} color="text-red-400" />
        <div className="ml-auto flex items-center gap-2 text-xs text-trough-muted">
          {refreshing && <RefreshCw size={12} className="animate-spin" />}
          {lastUpdated && <span>Updated {lastUpdated.toLocaleTimeString()}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <RefreshCw size={32} className="animate-spin text-trough-muted" />
            <p className="text-trough-muted text-sm">Fetching market data...</p>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
          >
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <div>
              <p className="text-sm text-red-400 font-medium">{error}</p>
              <p className="text-xs text-trough-muted mt-0.5">Run: <code className="font-mono bg-trough-card px-1 rounded">npm run dev:server</code></p>
            </div>
          </motion.div>
        )}

        {!loading && quotes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {quotes.map(({ symbol, quote }, i) => (
              <StockCard key={symbol} symbol={symbol} quote={quote} index={i} />
            ))}
          </div>
        )}

        {!loading && quotes.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <p className="text-trough-muted">No data yet.</p>
            <button onClick={() => refresh()} className="text-sm text-purple-400 hover:text-purple-300">
              Try refreshing
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatPill({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string; color: string
}) {
  return (
    <div className={`flex items-center gap-1.5 ${color}`}>
      {icon}
      <span className="text-xs font-mono font-semibold">{value}</span>
      <span className="text-xs text-trough-muted">{label}</span>
    </div>
  )
}
