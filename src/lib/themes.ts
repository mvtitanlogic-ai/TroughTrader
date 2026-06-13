import type { AppTheme, ThemeColor } from '@/types'

export const THEMES: Record<ThemeColor, AppTheme> = {
  purple: { color: 'purple', label: 'Violet', primary: '#7c3aed', glow: 'shadow-purple-500/20' },
  green:  { color: 'green',  label: 'Matrix', primary: '#10b981', glow: 'shadow-emerald-500/20' },
  cyan:   { color: 'cyan',   label: 'Glacier',primary: '#06b6d4', glow: 'shadow-cyan-500/20' },
  orange: { color: 'orange', label: 'Ember',  primary: '#f97316', glow: 'shadow-orange-500/20' },
  pink:   { color: 'pink',   label: 'Cherry', primary: '#ec4899', glow: 'shadow-pink-500/20' },
}

export const THEME_CLASSES: Record<ThemeColor, { accent: string; accentBg: string; accentBorder: string; accentText: string }> = {
  purple: { accent: 'bg-purple-600 hover:bg-purple-500', accentBg: 'bg-purple-600/10', accentBorder: 'border-purple-600/30', accentText: 'text-purple-400' },
  green:  { accent: 'bg-emerald-600 hover:bg-emerald-500', accentBg: 'bg-emerald-600/10', accentBorder: 'border-emerald-600/30', accentText: 'text-emerald-400' },
  cyan:   { accent: 'bg-cyan-600 hover:bg-cyan-500', accentBg: 'bg-cyan-600/10', accentBorder: 'border-cyan-600/30', accentText: 'text-cyan-400' },
  orange: { accent: 'bg-orange-600 hover:bg-orange-500', accentBg: 'bg-orange-600/10', accentBorder: 'border-orange-600/30', accentText: 'text-orange-400' },
  pink:   { accent: 'bg-pink-600 hover:bg-pink-500', accentBg: 'bg-pink-600/10', accentBorder: 'border-pink-600/30', accentText: 'text-pink-400' },
}
