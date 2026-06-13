import { motion } from 'framer-motion'
import {
  LayoutDashboard, Star, MessageSquare, Database,
  Trophy, Settings, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { THEME_CLASSES } from '@/lib/themes'
import type { AppView } from '@/types'

const NAV_ITEMS: { view: AppView; icon: React.ReactNode; label: string }[] = [
  { view: 'dashboard',   icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { view: 'watchlist',   icon: <Star size={20} />,            label: 'Watchlist' },
  { view: 'chat',        icon: <MessageSquare size={20} />,   label: 'TroughBot' },
  { view: 'leaderboard', icon: <Trophy size={20} />,          label: 'Loss Board' },
  { view: 'data',        icon: <Database size={20} />,        label: 'Data' },
  { view: 'settings',    icon: <Settings size={20} />,        label: 'Settings' },
]

export function Sidebar() {
  const { currentView, setView, sidebarCollapsed, toggleSidebar, logout, user, themeColor } = useAppStore()
  const tc = THEME_CLASSES[themeColor]

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 60 : 220 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-trough-surface border-r border-trough-border shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-3 border-b border-trough-border min-h-[56px] overflow-hidden">
        {/* Pig avatar — crop to just the pig face from the hero image */}
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-yellow-600/30">
          <img
            src="/troughtrader.jpg"
            alt="TroughTrader"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 55%', transform: 'scale(1.8)' }}
          />
        </div>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden"
          >
            <p className="text-sm font-bold whitespace-nowrap" style={{ color: '#f5c842' }}>
              TroughTrader
            </p>
            <p className="text-xs whitespace-nowrap" style={{ color: 'rgba(148,163,184,0.4)' }}>
              v0.1.0
            </p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2">
        {NAV_ITEMS.map(({ view, icon, label }) => {
          const active = currentView === view
          return (
            <button
              key={view}
              onClick={() => setView(view)}
              title={sidebarCollapsed ? label : undefined}
              className={`
                w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${active
                  ? `${tc.accentBg} ${tc.accentText} ${tc.accentBorder} border`
                  : 'text-trough-muted hover:text-trough-text hover:bg-trough-card'
                }
              `}
            >
              <span className="shrink-0">{icon}</span>
              {!sidebarCollapsed && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="pb-3 px-2 space-y-1 border-t border-trough-border pt-3">
        {!sidebarCollapsed && user && (
          <div className="px-2 py-1.5 mb-1">
            <p className="text-xs text-trough-text-dim truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          title={sidebarCollapsed ? 'Sign out' : undefined}
          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm text-trough-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={20} className="shrink-0" />
          {!sidebarCollapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm text-trough-muted hover:text-trough-text hover:bg-trough-card transition-all"
        >
          <span className="shrink-0">
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </span>
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  )
}
