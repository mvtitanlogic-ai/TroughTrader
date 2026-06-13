import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppView, ThemeColor, User, ChatMessage, StockQuote } from '@/types'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  currentView: AppView
  themeColor: ThemeColor
  favorites: string[]
  stockData: Record<string, StockQuote>
  chatMessages: ChatMessage[]
  chatModel: string
  sidebarCollapsed: boolean
  chatOpen: boolean

  login: (user: User) => void
  logout: () => void
  setView: (view: AppView) => void
  setThemeColor: (color: ThemeColor) => void
  addFavorite: (symbol: string) => void
  removeFavorite: (symbol: string) => void
  toggleFavorite: (symbol: string) => void
  setStockData: (data: Record<string, StockQuote>) => void
  updateStockQuote: (symbol: string, quote: StockQuote) => void
  addChatMessage: (msg: ChatMessage) => void
  clearChat: () => void
  setChatModel: (model: string) => void
  toggleSidebar: () => void
  toggleChat: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      currentView: 'dashboard',
      themeColor: 'purple',
      favorites: ['AAPL', 'TSLA', 'NVDA', 'SPY', 'BTC-USD'],
      stockData: {},
      chatMessages: [],
      chatModel: 'llama3.1-uncensored',
      sidebarCollapsed: false,
      chatOpen: true,

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, chatMessages: [] }),
      setView: (view) => set({ currentView: view }),
      setThemeColor: (color) => set({ themeColor: color }),
      addFavorite: (symbol) =>
        set((s) => ({ favorites: s.favorites.includes(symbol) ? s.favorites : [...s.favorites, symbol] })),
      removeFavorite: (symbol) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f !== symbol) })),
      toggleFavorite: (symbol) =>
        set((s) => ({
          favorites: s.favorites.includes(symbol)
            ? s.favorites.filter((f) => f !== symbol)
            : [...s.favorites, symbol],
        })),
      setStockData: (data) => set({ stockData: data }),
      updateStockQuote: (symbol, quote) =>
        set((s) => ({ stockData: { ...s.stockData, [symbol]: quote } })),
      addChatMessage: (msg) =>
        set((s) => ({ chatMessages: [...s.chatMessages.slice(-99), msg] })),
      clearChat: () => set({ chatMessages: [] }),
      setChatModel: (model) => set({ chatModel: model }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
    }),
    {
      name: 'troughtrader-store',
      partialize: (s) => ({
        user: s.user,
        isAuthenticated: s.isAuthenticated,
        themeColor: s.themeColor,
        favorites: s.favorites,
        chatModel: s.chatModel,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    }
  )
)
