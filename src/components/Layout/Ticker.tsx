import { useAppStore } from '@/stores/useAppStore'
import { formatPrice, formatPercent } from '@/services/stockService'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function Ticker() {
  const { favorites, stockData } = useAppStore()

  const items = favorites
    .map((sym) => ({ symbol: sym, quote: stockData[sym] }))
    .filter((i) => i.quote)

  if (items.length === 0) {
    return (
      <div className="h-9 bg-trough-surface/50 border-b border-trough-border flex items-center px-4">
        <span className="text-xs text-trough-muted font-mono">Loading market data...</span>
      </div>
    )
  }

  const doubled = [...items, ...items]

  return (
    <div className="h-9 bg-trough-surface/80 border-b border-trough-border overflow-hidden relative ticker-container">
      <div
        className="flex items-center h-full gap-0 animate-[ticker-scroll_40s_linear_infinite] whitespace-nowrap"
        style={{ width: 'max-content' }}
      >
        {doubled.map((item, i) => {
          const pct = item.quote?.regularMarketChangePercent
          const isGain = (pct ?? 0) >= 0
          return (
            <div key={`${item.symbol}-${i}`} className="flex items-center gap-1.5 px-4 border-r border-trough-border/40 h-full">
              <span className="text-xs font-mono font-semibold text-trough-text-dim">{item.symbol}</span>
              <span className="text-xs font-mono text-trough-text">{formatPrice(item.quote?.regularMarketPrice)}</span>
              <span className={`text-xs font-mono flex items-center gap-0.5 ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                {isGain ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {formatPercent(pct)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
