# TroughTrader Data Storage Architecture

## Decision: DuckDB as Primary Trading Data Store

**Why DuckDB over SQLite/PostgreSQL:**
- In-process OLAP — no server needed, embedded like SQLite
- 10-100x faster than SQLite for analytical queries on large datasets
- Native columnar storage — perfect for OHLCV time-series data
- Queries CSV/Parquet files directly without importing
- Standard SQL (PostgreSQL dialect)
- Free, open source

## Storage Layers

### Layer 1: SQLite (active — MVP)
- User preferences, favorites, auth tokens
- Small structured config data
- Library: `better-sqlite3`

### Layer 2: DuckDB (Phase 2)
- OHLCV price history (millions of rows)
- Trade journal entries
- P&L calculations
- Historical pattern queries
- Library: `duckdb` npm package

### Layer 3: ChromaDB (Phase 2 — RAG)
- Vector embeddings for Reddit posts, news articles, PDFs
- Semantic search for "find discussions about TSLA earnings"
- Powers TroughBot's knowledge retrieval
- Run as local HTTP service on port 8000

### Layer 4: File System (active — MVP)
- Raw ingest: PDFs, CSVs, JSON → drop in `data/raw/`
- DuckDB can query these directly (Phase 2)
- Obsidian vault notes

## Data Flow (Phase 2 Target)

```
Yahoo Finance → DuckDB (OHLCV)
Reddit/News  → ChromaDB (embeddings)
PDFs/CSVs    → data/raw/ → DuckDB (via COPY command)
Trades       → DuckDB (journal)
TroughBot    → DuckDB + ChromaDB (RAG context)
```
