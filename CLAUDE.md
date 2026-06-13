# TroughTrader — Claude Code Context

## App
Trading app for retail traders. Tagline: "For traders who are always in the trough. Cheap trades. Deep lessons. Zero judgment."

## Dev Commands
- `npm run dev:web` — Start React (port 5173) + Express API (port 3001) — browser mode, NO Electron
- `npm run dev` — Full stack: React + Express + Electron desktop
- `npm run build` — TypeScript check + Vite production build
- `npm run build:electron` — Full desktop build → release/

## Architecture
- **Frontend**: React 18 + TypeScript + Vite → `src/`
- **Backend**: Express.js API server → `server/` (port 3001)
- **Desktop**: Electron 28 → `electron/`
- **State**: Zustand (persisted to localStorage)
- **Theme**: Tailwind CSS dark mode, 5 accent colors

## Key Files
- `src/App.tsx` — Root component, routing between views
- `src/stores/useAppStore.ts` — All global state
- `src/services/stockService.ts` — Yahoo Finance API calls
- `src/services/ollamaService.ts` — Ollama/LLM streaming
- `server/routes/stocks.js` — Yahoo Finance proxy
- `server/routes/chat.js` — Ollama proxy with system prompt

## Auth (local only)
- Email: titan@titanlogic.ai / Password: password

## Ollama
- URL: http://localhost:11434
- Available models: llama3.1-uncensored, dolphin-mixtral:8x7b, qwen2.5:32b
- Default: llama3.1-uncensored

## Data
- Raw files: `data/raw/` (PDFs, CSVs for Phase 2 ingest)
- DB: `data/db/` (DuckDB Phase 2, SQLite already used)
- Obsidian vault: `data/obsidian-vault/` — open in Obsidian app

## Git
- Every commit auto-updates `data/obsidian-vault/Development/Daily Notes/YYYY-MM-DD.md`
- GitHub: https://github.com/mvtitanlogic-ai/TroughTrader
- Branch strategy: `main` (prod), `develop` (active), `feature/*` (features)

## Phase 2 Roadmap
- DuckDB integration for OHLCV storage
- ChromaDB vector store for RAG (Reddit, news, PDFs)
- Loss Leaderboard with trade tracking
- Auto-loss journaling on every losing trade
- Paper trading simulator with real slippage
- Reddit/news ingest (snoowrap)
- Raw data ingestion pipeline (PDF, CSV → DuckDB)
