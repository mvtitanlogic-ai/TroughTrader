import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { SplashScreen } from '@/components/SplashScreen'
import { LoginPage } from '@/components/LoginPage'
import { Sidebar } from '@/components/Layout/Sidebar'
import { Header } from '@/components/Layout/Header'
import { Ticker } from '@/components/Layout/Ticker'
import { Dashboard } from '@/components/Dashboard'
import { Watchlist } from '@/components/Watchlist'
import { ChatPanel } from '@/components/Chat'
import { Leaderboard } from '@/components/Leaderboard'
import { DataManager } from '@/components/DataManager'
import { SettingsPage } from '@/components/Settings'
import { fetchQuotes } from '@/services/stockService'
import type { StockQuote } from '@/types'

export default function App() {
  const { isAuthenticated, currentView, favorites, setStockData, stockData, chatOpen } = useAppStore()
  const [showSplash, setShowSplash] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const allSymbols = [...new Set([...favorites, 'AAPL', 'TSLA', 'NVDA', 'MSFT', 'GME', 'SPY'])]
      const results = await fetchQuotes(allSymbols)
      const update: Record<string, StockQuote> = {}
      results.forEach(({ symbol, data }) => { if (data) update[symbol] = data })
      setStockData({ ...stockData, ...update })
    } catch {}
    setRefreshing(false)
  }, [favorites, stockData, setStockData])

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const VIEW_MAP = {
    dashboard:   <Dashboard />,
    watchlist:   <Watchlist />,
    chat:        <ChatPanel />,
    leaderboard: <Leaderboard />,
    data:        <DataManager />,
    settings:    <SettingsPage />,
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-trough-bg">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        {/* macOS drag region */}
        <div className="h-8 drag-region bg-trough-bg" />

        <Ticker />
        <Header onRefresh={handleRefresh} refreshing={refreshing} />

        <div className="flex flex-1 min-h-0">
          {/* Main content */}
          <main className="flex-1 min-w-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {VIEW_MAP[currentView]}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Chat side panel (always visible when open, except when on chat view) */}
          {chatOpen && currentView !== 'chat' && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-trough-border bg-trough-surface shrink-0 flex flex-col overflow-hidden"
            >
              <ChatPanel />
            </motion.aside>
          )}
        </div>
      </div>
    </div>
  )
}
