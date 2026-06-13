import { useState } from 'react'
import { Star, Plus, X, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { StockCard } from '@/components/Dashboard/StockCard'
import { searchSymbols } from '@/services/stockService'

export function Watchlist() {
  const { favorites, addFavorite, removeFavorite, stockData } = useAppStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Array<{ symbol: string; shortname?: string }>>([])

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.length < 1) { setResults([]); return }
    const r = await searchSymbols(q)
    setResults(r.slice(0, 8))
  }

  const favoriteQuotes = favorites
    .map((sym) => ({ symbol: sym, quote: stockData[sym] }))
    .filter((q) => q.quote)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-trough-border">
        <div className="flex items-center gap-3 mb-4">
          <Star size={20} className="text-yellow-400" />
          <h2 className="text-lg font-semibold">My Watchlist</h2>
          <span className="text-xs bg-trough-card border border-trough-border rounded-full px-2 py-0.5 text-trough-muted">
            {favorites.length} symbols
          </span>
        </div>

        {/* Add symbol */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-trough-muted" />
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Add symbol..."
            className="w-full bg-trough-card border border-trough-border rounded-lg pl-9 pr-4 py-2 text-sm
                       text-trough-text placeholder-trough-muted outline-none
                       focus:border-purple-500/50 transition-all"
          />
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-trough-card border border-trough-border rounded-lg shadow-xl z-50">
              {results.map((r) => (
                <button
                  key={r.symbol}
                  onClick={() => { addFavorite(r.symbol); setQuery(''); setResults([]) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-trough-surface text-left transition-colors"
                >
                  <Plus size={14} className="text-emerald-400" />
                  <span className="text-sm font-mono font-semibold">{r.symbol}</span>
                  {r.shortname && <span className="text-xs text-trough-muted truncate">{r.shortname}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          <AnimatePresence>
            {favorites.map((sym) => (
              <motion.span
                key={sym}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 bg-trough-card border border-trough-border rounded-full px-3 py-1 text-xs font-mono"
              >
                {sym}
                <button onClick={() => removeFavorite(sym)} className="text-trough-muted hover:text-red-400 transition-colors">
                  <X size={10} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {favoriteQuotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteQuotes.map(({ symbol, quote }, i) => (
              <StockCard key={symbol} symbol={symbol} quote={quote} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Star size={32} className="text-trough-border mb-3" />
            <p className="text-trough-muted text-sm">No data loaded yet.</p>
            <p className="text-trough-muted/60 text-xs mt-1">Make sure the server is running and refresh.</p>
          </div>
        )}
      </div>
    </div>
  )
}
