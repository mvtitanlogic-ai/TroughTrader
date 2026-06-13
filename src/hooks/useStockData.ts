import { useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { fetchQuotes } from '@/services/stockService'
import type { StockQuote } from '@/types'

const REFRESH_INTERVAL = 30_000

export function useStockData(symbols: string[]) {
  const { setStockData, stockData } = useAppStore()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = useCallback(async () => {
    if (symbols.length === 0) return
    try {
      const results = await fetchQuotes(symbols)
      const update: Record<string, StockQuote> = {}
      results.forEach(({ symbol, data }) => {
        if (data) update[symbol] = data
      })
      setStockData({ ...stockData, ...update })
    } catch (e) {
      console.warn('Stock fetch error:', e)
    }
  }, [symbols, stockData, setStockData])

  useEffect(() => {
    refresh()
    timerRef.current = setInterval(refresh, REFRESH_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [symbols.join(',')])

  return { refresh }
}
