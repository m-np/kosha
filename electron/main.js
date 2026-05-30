const { app, BrowserWindow, shell, Menu } = require('electron')
const path = require('path')
const fs = require('fs')
const net = require('net')

const isPacked = app.isPackaged

// ── paths ─────────────────────────────────────────────────────────────────────

const rootDir    = isPacked ? process.resourcesPath : path.join(__dirname, '..')
const publicPath = path.join(rootDir, 'public')
const defNotes   = path.join(rootDir, 'default-notes')
const defTmpls   = path.join(rootDir, 'templates')

// User-writable data lives in ~/.config/kosha (Linux), ~/Library/... (mac)
const userData      = app.getPath('userData')
const userNotes     = path.join(userData, 'notes')
const userTemplates = path.join(userData, 'templates')

// ── first-run setup ───────────────────────────────────────────────────────────

function initUserData() {
  // Ensure PARA folders exist
  for (const f of ['Projects', 'Areas', 'Resources', 'Archive']) {
    fs.mkdirSync(path.join(userNotes, f), { recursive: true })
  }

  // Copy bundled templates into userData (skip if already present)
  fs.mkdirSync(userTemplates, { recursive: true })
  if (fs.existsSync(defTmpls)) {
    for (const f of fs.readdirSync(defTmpls)) {
      const dst = path.join(userTemplates, f)
      if (!fs.existsSync(dst)) fs.copyFileSync(path.join(defTmpls, f), dst)
    }
  }

  // Seed sample notes on first launch only (Projects folder is empty)
  const projects = path.join(userNotes, 'Projects')
  if (fs.existsSync(defNotes) && fs.readdirSync(projects).length === 0) {
    for (const folder of ['Projects', 'Areas', 'Resources', 'Archive']) {
      const src = path.join(defNotes, folder)
      const dst = path.join(userNotes, folder)
      if (fs.existsSync(src)) {
        for (const f of fs.readdirSync(src)) {
          fs.copyFileSync(path.join(src, f), path.join(dst, f))
        }
      }
    }
  }
}

// ── port ──────────────────────────────────────────────────────────────────────

// Find a free TCP port starting from `from`, resolves with the port number.
function findFreePort(from = 3000) {
  return new Promise((resolve) => {
    const probe = net.createServer()
    probe.unref()
    probe.on('error', () => resolve(findFreePort(from + 1)))
    probe.listen(from, '127.0.0.1', () => {
      const { port } = probe.address()
      probe.close(() => resolve(port))
    })
  })
}

// ── server ────────────────────────────────────────────────────────────────────

function startServer(port) {
  process.env.KOSHA_PORT          = port
  process.env.KOSHA_NOTES_DIR     = userNotes
  process.env.KOSHA_TEMPLATES_DIR = userTemplates
  process.env.KOSHA_PUBLIC_DIR    = publicPath

  require('../server')
}

// Poll until the Express server is accepting connections on `port`.
function waitForPort(port, cb) {
  const attempt = () => {
    const sock = net.createConnection({ port, host: '127.0.0.1' })
    sock.on('connect', () => { sock.destroy(); cb() })
    sock.on('error', () => setTimeout(attempt, 80))
  }
  attempt()
}

// ── window ────────────────────────────────────────────────────────────────────

function createWindow(port) {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 860,
    minHeight: 560,
    title: 'Kosha',
    backgroundColor: '#0e0e0f',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  win.loadURL(`http://localhost:${port}`)

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.platform !== 'darwin') Menu.setApplicationMenu(null)
}

// ── lifecycle ─────────────────────────────────────────────────────────────────

app.whenReady().then(async () => {
  initUserData()
  const port = await findFreePort(3000)
  startServer(port)
  waitForPort(port, () => createWindow(port))
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const port = parseInt(process.env.KOSHA_PORT || '3000', 10)
    createWindow(port)
  }
})
