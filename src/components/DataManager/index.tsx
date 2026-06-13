import { useEffect, useState } from 'react'
import { Database, Upload, FileText, FolderOpen } from 'lucide-react'

interface RawFile { name: string; size: number; type: string; modified: string }

export function DataManager() {
  const [rawFiles, setRawFiles] = useState<RawFile[]>([])
  const [stats, setStats] = useState<{ rawDataDir?: string; dbDir?: string } | null>(null)

  useEffect(() => {
    fetch('/api/data/raw-files').then(r => r.json()).then(setRawFiles).catch(() => {})
    fetch('/api/data/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database size={24} className="text-purple-400" />
        <div>
          <h2 className="text-lg font-semibold">Data Manager</h2>
          <p className="text-xs text-trough-muted">Manage raw data, CSVs, PDFs, and database files</p>
        </div>
      </div>

      {/* Data paths */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard icon={<FolderOpen size={18} className="text-yellow-400" />} label="Raw Data Directory" value={stats.rawDataDir || '—'} />
          <InfoCard icon={<Database size={18} className="text-purple-400" />} label="Database Directory" value={stats.dbDir || '—'} />
        </div>
      )}

      {/* Raw files */}
      <div className="card-base p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-trough-text flex items-center gap-2">
            <FileText size={16} className="text-trough-muted" /> Raw Data Files
          </h3>
          <button className="flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors">
            <Upload size={12} /> Drop files into data/raw/
          </button>
        </div>

        {rawFiles.length === 0 ? (
          <div className="text-center py-8 text-trough-muted">
            <Upload size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No files yet. Drop PDFs, CSVs, or JSONs into <code className="font-mono bg-trough-surface px-1 rounded">data/raw/</code></p>
          </div>
        ) : (
          <div className="space-y-2">
            {rawFiles.map((f) => (
              <div key={f.name} className="flex items-center justify-between py-2 px-3 bg-trough-surface rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-trough-card border border-trough-border px-1.5 py-0.5 rounded uppercase text-trough-muted">{f.type}</span>
                  <span className="text-sm text-trough-text">{f.name}</span>
                </div>
                <span className="text-xs text-trough-muted">{(f.size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storage architecture */}
      <div className="card-base p-4">
        <h3 className="text-sm font-semibold text-trough-text mb-3">Storage Architecture</h3>
        <div className="space-y-2 text-xs font-mono">
          {[
            { tech: 'DuckDB', desc: 'OHLCV price data, analytical queries (Phase 2)', color: 'text-yellow-400' },
            { tech: 'ChromaDB', desc: 'Vector embeddings for Reddit/news/PDF RAG (Phase 2)', color: 'text-purple-400' },
            { tech: 'SQLite', desc: 'App config, favorites, user data (active)', color: 'text-emerald-400' },
            { tech: 'File System', desc: 'Raw CSVs, PDFs, JSON in data/raw/ (active)', color: 'text-cyan-400' },
          ].map((r) => (
            <div key={r.tech} className="flex gap-3 py-1.5 border-b border-trough-border/40 last:border-0">
              <span className={`${r.color} w-20 shrink-0`}>{r.tech}</span>
              <span className="text-trough-muted">{r.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-base p-4 flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-trough-muted">{label}</p>
        <p className="text-xs font-mono text-trough-text mt-0.5 break-all">{value}</p>
      </div>
    </div>
  )
}
