export interface StockQuote {
  symbol: string
  shortName?: string
  longName?: string
  regularMarketPrice?: number
  regularMarketChange?: number
  regularMarketChangePercent?: number
  regularMarketVolume?: number
  regularMarketOpen?: number
  regularMarketDayHigh?: number
  regularMarketDayLow?: number
  marketCap?: number
  fiftyTwoWeekHigh?: number
  fiftyTwoWeekLow?: number
}

export interface StockQuoteResult {
  symbol: string
  data: StockQuote | null
  error: string | null
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export type ThemeColor = 'purple' | 'green' | 'cyan' | 'orange' | 'pink'

export interface AppTheme {
  color: ThemeColor
  label: string
  primary: string
  glow: string
}

export interface User {
  email: string
  name: string
}

export type AppView = 'dashboard' | 'watchlist' | 'chat' | 'data' | 'leaderboard' | 'settings'
