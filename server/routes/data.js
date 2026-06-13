import { Router } from 'express'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

export const dataRouter = Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RAW_DATA_DIR = path.join(__dirname, '../../data/raw')

dataRouter.get('/raw-files', async (_req, res) => {
  try {
    const files = await readdir(RAW_DATA_DIR)
    const fileStats = await Promise.all(
      files.map(async (f) => {
        const filePath = path.join(RAW_DATA_DIR, f)
        const s = await stat(filePath)
        return { name: f, size: s.size, modified: s.mtime, type: path.extname(f).slice(1) }
      })
    )
    res.json(fileStats)
  } catch {
    res.json([])
  }
})

dataRouter.get('/stats', async (_req, res) => {
  res.json({
    rawDataDir: RAW_DATA_DIR,
    dbDir: path.join(__dirname, '../../data/db'),
    ready: true,
  })
})
