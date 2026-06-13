import { Settings as SettingsIcon, Palette, Bot, Database } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { THEMES } from '@/lib/themes'

export function SettingsPage() {
  const { themeColor, setThemeColor, chatModel, setChatModel, user } = useAppStore()

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon size={24} className="text-trough-muted" />
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={null}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" value={user?.email || '—'} />
          <Field label="Name" value={user?.name || '—'} />
        </div>
      </Section>

      {/* Theme */}
      <Section title="Appearance" icon={<Palette size={16} className="text-trough-muted" />}>
        <p className="text-xs text-trough-muted mb-3">Accent color</p>
        <div className="flex gap-3">
          {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((color) => (
            <button
              key={color}
              onClick={() => setThemeColor(color)}
              className={`flex flex-col items-center gap-1.5 transition-all`}
            >
              <span
                className={`w-8 h-8 rounded-full transition-all ${themeColor === color ? 'scale-125 ring-2 ring-white/40' : 'opacity-60 hover:opacity-100'}`}
                style={{ backgroundColor: THEMES[color].primary }}
              />
              <span className={`text-xs ${themeColor === color ? 'text-trough-text' : 'text-trough-muted'}`}>
                {THEMES[color].label}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* AI */}
      <Section title="AI / TroughBot" icon={<Bot size={16} className="text-purple-400" />}>
        <div className="space-y-3">
          <Field label="Active Model" value={chatModel} />
          <div>
            <p className="text-xs text-trough-muted mb-1.5">Change model</p>
            <input
              value={chatModel}
              onChange={(e) => setChatModel(e.target.value)}
              className="bg-trough-surface border border-trough-border rounded-lg px-3 py-2 text-sm text-trough-text outline-none focus:border-purple-500/50 w-full max-w-xs font-mono"
            />
            <p className="text-xs text-trough-muted/60 mt-1">Must match an installed Ollama model name</p>
          </div>
        </div>
      </Section>

      {/* Data */}
      <Section title="Data & Storage" icon={<Database size={16} className="text-yellow-400" />}>
        <div className="space-y-2 text-sm text-trough-muted">
          <p>Raw data directory: <code className="font-mono bg-trough-card px-1 rounded text-trough-text">data/raw/</code></p>
          <p>Database directory: <code className="font-mono bg-trough-card px-1 rounded text-trough-text">data/db/</code></p>
          <p>Phase 2 will add DuckDB + ChromaDB integration.</p>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card-base p-5">
      <h3 className="text-sm font-semibold text-trough-text mb-4 flex items-center gap-2">
        {icon}{title}
      </h3>
      {children}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-trough-muted mb-1">{label}</p>
      <p className="text-sm text-trough-text font-mono">{value}</p>
    </div>
  )
}
