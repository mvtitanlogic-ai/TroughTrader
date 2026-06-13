import { motion } from 'framer-motion'
import { Star, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { formatPrice, formatPercent, formatVolume, formatMarketCap } from '@/services/stockService'
import type { StockQuote } from '@/types'

interface StockCardProps {
  symbol: string
  quote: StockQuote
  index: number
}

export function StockCard({ symbol, quote, index }: StockCardProps) {
  const { favorites, toggleFavorite } = useAppStore()
  const isFav = favorites.includes(symbol)
  const change = quote.regularMarketChangePercent ?? 0
  const isGain = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2, scale: 1.005 }}
      className={`card-base p-4 cursor-pointer transition-all duration-200 hover:border-trough-muted/40 relative group
                  ${isGain ? 'hover:shadow-emerald-900/20' : 'hover:shadow-red-900/20'} hover:shadow-lg`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-trough-text">{symbol}</span>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(symbol) }}
              className={`transition-colors ${isFav ? 'text-yellow-400' : 'text-trough-border group-hover:text-trough-muted'}`}
            >
              <Star size={13} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="text-xs text-trough-muted truncate max-w-[140px] mt-0.5">
            {quote.shortName || quote.longName || symbol}
          </p>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-trough-muted hover:text-trough-text">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Price */}
      <div className="mb-3">
        <div className="text-xl font-mono font-bold text-trough-text">
          {formatPrice(quote.regularMarketPrice)}
        </div>
        <div className={`flex items-center gap-1.5 mt-0.5 ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
          {isGain ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span className="text-sm font-mono font-semibold">
            {formatPercent(change)}
          </span>
          <span className="text-xs font-mono opacity-70">
            ({isGain ? '+' : ''}{formatPrice(quote.regularMarketChange)})
          </span>
        </div>
      </div>

      {/* Color bar */}
      <div className={`h-0.5 rounded-full mb-3 ${isGain ? 'bg-emerald-500/40' : 'bg-red-500/40'}`} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <Stat label="Volume" value={formatVolume(quote.regularMarketVolume)} />
        <Stat label="Mkt Cap" value={formatMarketCap(quote.marketCap)} />
        <Stat label="Day High" value={formatPrice(quote.regularMarketDayHigh)} />
        <Stat label="Day Low" value={formatPrice(quote.regularMarketDayLow)} />
      </div>
    </motion.div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-trough-muted">{label}</p>
      <p className="text-xs font-mono text-trough-text-dim">{value}</p>
    </div>
  )
}
