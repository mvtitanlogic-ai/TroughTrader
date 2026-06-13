import { Bell, RefreshCw, Search } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { searchSymbols } from '@/services/stockService'
import { THEMES } from '@/lib/themes'

interface HeaderProps {
  onRefresh: () => void
  refreshing: boolean
}

export function Header({ onRefresh, refreshing }: HeaderProps) {
  const { themeColor, setThemeColor, currentView } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; shortname?: string }>>([])
  const [searching, setSearching] = useState(false)

  const VIEW_LABELS: Record<string, string> = {
    dashboard: 'Market Dashboard',
    watchlist: 'My Watchlist',
    chat: 'TroughBot AI',
    leaderboard: 'Loss Leaderboard',
    data: 'Data Manager',
    settings: 'Settings',
  }

  async function handleSearch(q: string) {
    setSearchQuery(q)
    if (q.length < 2) { setSearchResults([]); return }
    setSearching(true)
    try {
      const results = await searchSymbols(q)
      setSearchResults(results.slice(0, 6))
    } catch {}
    setSearching(false)
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-trough-border bg-trough-surface/50 glass">
      {/* Page title */}
      <h2 className="text-sm font-semibold text-trough-text">
        {VIEW_LABELS[currentView] || currentView}
      </h2>

      {/* Search */}
      <div className="relative flex-1 max-w-sm mx-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-trough-muted" />
        <input
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search stocks, crypto..."
          className="w-full bg-trough-card border border-trough-border rounded-lg pl-9 pr-4 py-1.5 text-sm
                     text-trough-text placeholder-trough-muted outline-none
                     focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-trough-card border border-trough-border rounded-lg shadow-xl z-50 overflow-hidden">
            {searchResults.map((r) => (
              <button
                key={r.symbol}
                onClick={() => { setSearchQuery(''); setSearchResults([]) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-trough-surface text-left transition-colors"
              >
                <span className="text-sm font-mono font-semibold text-trough-text">{r.symbol}</span>
                {r.shortname && <span className="text-xs text-trough-muted truncate">{r.shortname}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Theme switcher */}
        <div className="flex items-center gap-1 mr-2">
          {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((color) => (
            <button
              key={color}
              onClick={() => setThemeColor(color)}
              title={THEMES[color].label}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${themeColor === color ? 'scale-125 ring-2 ring-white/30' : 'opacity-50 hover:opacity-100'}`}
              style={{ backgroundColor: THEMES[color].primary }}
            />
          ))}
        </div>

        <button
          onClick={onRefresh}
          className="p-2 text-trough-muted hover:text-trough-text rounded-lg hover:bg-trough-card transition-all"
          title="Refresh data"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        </button>

        <button className="p-2 text-trough-muted hover:text-trough-text rounded-lg hover:bg-trough-card transition-all relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
