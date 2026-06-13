import { Trophy, TrendingDown, Award } from 'lucide-react'
import { motion } from 'framer-motion'

const BADGES = [
  { id: 'serial-bagholder', label: 'Serial Bagholder', icon: '🛄', desc: 'Held a stock down 50%+', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { id: 'trough-legend',    label: 'Trough Legend',    icon: '🐷', desc: 'Lost 3 days in a row', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { id: 'diamond-hands',    label: 'Diamond Hands',    icon: '💎', desc: 'Never sold during a crash', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { id: 'fomo-king',        label: 'FOMO King',         icon: '👑', desc: 'Bought the absolute top', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { id: 'cope-master',      label: 'Cope Master',       icon: '🧠', desc: 'Journaled 10+ losses', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
]

export function Leaderboard() {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Trophy size={24} className="text-yellow-400" />
        <div>
          <h2 className="text-lg font-semibold">Loss Leaderboard</h2>
          <p className="text-xs text-trough-muted">Your finest moments of financial destruction</p>
        </div>
      </div>

      {/* Coming soon banner */}
      <div className="card-base p-6 text-center border-dashed">
        <TrendingDown size={40} className="text-red-400/40 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-trough-text mb-1">Loss tracking coming in Phase 2</h3>
        <p className="text-sm text-trough-muted">Trade logging, P&L tracking, and auto-loss journaling on the roadmap.</p>
      </div>

      {/* Badges preview */}
      <div>
        <h3 className="text-sm font-semibold text-trough-text-dim mb-3 flex items-center gap-2">
          <Award size={16} className="text-yellow-400" /> Achievement Badges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`card-base p-4 border ${badge.bg} opacity-50`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className={`text-sm font-semibold ${badge.color}`}>{badge.label}</p>
                  <p className="text-xs text-trough-muted">{badge.desc}</p>
                </div>
              </div>
              <p className="text-xs text-trough-muted/60 mt-2 font-mono">🔒 Locked</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
