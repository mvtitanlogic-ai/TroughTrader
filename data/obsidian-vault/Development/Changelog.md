# TroughTrader Changelog

## v0.1.0 — 2026-06-13 — MVP Init

### Added
- Electron 28 desktop app (macOS, hiddenInset titlebar)
- React 18 + TypeScript + Vite frontend
- Animated splash screen with pig-in-mud SVG and Framer Motion
- Local auth (titan@titanlogic.ai / password)
- Dark theme with 5 accent color options (purple, green, cyan, orange, pink)
- Stock dashboard with Yahoo Finance (yahoo-finance2, no API key)
- Scrolling ticker bar for favorites
- TroughBot chat with Ollama (llama3.1-uncensored, dolphin-mixtral, qwen2.5)
- Watchlist with add/remove symbols
- Loss Leaderboard (badge system, Phase 2 for tracking)
- Data Manager (file listing from data/raw/, storage architecture display)
- Zustand state (persisted: favorites, theme, auth, model)
- Express API server (port 3001): stocks, chat, data routes
- Obsidian vault initialized at data/obsidian-vault/
- GitHub repo: https://github.com/mvtitanlogic-ai/TroughTrader
- GitHub Actions CI (lint + build)
- Git post-commit hook for automatic Obsidian changelog

### Architecture
- **Frontend**: React + Vite (port 5173) → proxies to Express (port 3001)
- **Stock data**: Yahoo Finance via yahoo-finance2 (30s refresh)
- **AI Chat**: Ollama local (localhost:11434) with streaming
- **Storage**: SQLite (config) → DuckDB planned (Phase 2), ChromaDB planned (Phase 2)
- **Raw data**: Drop PDFs/CSVs into data/raw/ for ingestion (Phase 2)
