import { app, BrowserWindow, shell, ipcMain } from 'electron'
import path from 'path'
import { spawn, ChildProcess } from 'child_process'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow: BrowserWindow | null = null
let apiServer: ChildProcess | null = null

function startApiServer() {
  const serverPath = isDev
    ? path.join(__dirname, '../../server/index.js')
    : path.join(process.resourcesPath, 'server/index.js')

  apiServer = spawn('node', [serverPath], {
    env: { ...process.env, PORT: '3001' },
    stdio: 'inherit',
  })

  apiServer.on('error', (err) => console.error('API server error:', err))
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#080810',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: !isDev,
    },
    icon: path.join(__dirname, '../../public/pig-icon.png'),
    show: false,
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  if (!isDev) startApiServer()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    apiServer?.kill()
    app.quit()
  }
})

app.on('before-quit', () => {
  apiServer?.kill()
})

ipcMain.handle('app:version', () => app.getVersion())
