# Kosha — Self-Hosted Second Brain

> Your notes. Your machine. Your rules.

Kosha is a **local-first, plain-file second brain** built on the [PARA method](https://fortelabs.com/blog/para/). Every note is a `.md` file sitting on your disk — readable in any editor, syncable with any tool, version-controllable with git. There is no database, no cloud account, no subscription.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows-blue)](#install)
[![GitHub release](https://img.shields.io/github/v/release/m-np/kosha)](https://github.com/m-np/kosha/releases/latest)

---

## Contents

- [What is Kosha?](#what-is-kosha)
- [User Guide](#user-guide)
- [Install](#install)
- [Update](#update)
- [Uninstall](#uninstall)
- [Where your notes live](#where-your-notes-live)
- [Features](#features)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [For Developers](#for-developers)
  - [Architecture](#architecture)
  - [Folder Structure](#folder-structure)
  - [REST API Reference](#rest-api-reference)
  - [Run from Source](#run-from-source)
  - [Build Installers](#build-installers)
  - [Contributing](#contributing)
- [Philosophy](#philosophy)
- [Roadmap](#roadmap)

---

## What is Kosha?

Kosha is a desktop app (and optionally a local web app) for capturing, organising, and connecting your knowledge. It organises everything into four folders — **Projects, Areas, Resources, Archive** — following the PARA method pioneered by Tiago Forte.

**What makes it different:**

| | Kosha | Notion / Obsidian cloud | Roam |
|---|---|---|---|
| Notes format | Plain `.md` files | Proprietary / cloud | Cloud |
| Data location | Your disk | Their servers | Their servers |
| Works offline | Always | Partially | No |
| Cost | Free forever | Freemium | $15/mo |
| Open source | Yes | No | No |

Kosha ships as a native desktop app powered by Electron. The backend is a small Express server; the frontend is a single HTML file with no build step. Everything runs on `localhost` — the browser window is just a UI wrapper.

---

## User Guide

New to Kosha or the PARA method? The full usage guide walks you through:

- How to use the four PARA folders
- Daily capture and weekly review workflows
- Writing with `[[wikilinks]]` and building a knowledge graph
- Using templates (daily note, project, meeting)
- Search, split preview, and keyboard shortcuts
- Common mistakes and how to avoid them

**→ [Read the User Guide](GUIDE.md)**

---

## Install

Download the latest installer for your platform from the **[Releases page](https://github.com/m-np/kosha/releases/latest)**.

### Linux

**Option A — `.deb` (Ubuntu, Debian, Pop!\_OS)**

```bash
# Install
sudo dpkg -i kosha_1.0.0_amd64.deb

# Launch from your app menu (search "Kosha"), or:
kosha
```

**Option B — AppImage (any Linux distro)**

```bash
# Ubuntu 22.04+ needs libfuse2 for AppImage support
sudo apt install libfuse2

# Make executable and run — no installation needed
chmod +x Kosha-1.0.0.AppImage
./Kosha-1.0.0.AppImage
```

### macOS

```bash
open Kosha-1.0.0.dmg
# Drag Kosha to Applications, then launch from Spotlight
```

### Windows

Run `Kosha-Setup-1.0.0.exe` and follow the installer wizard. Kosha appears in the Start menu with an optional desktop shortcut.

---

## Update

Your notes are **never touched** during an update — they live in your user data directory, separate from the app binary.

### Linux `.deb`

```bash
sudo dpkg -i kosha_<new-version>_amd64.deb
```

`dpkg` replaces the previous install in-place.

### Linux AppImage

```bash
chmod +x Kosha-<new-version>.AppImage
mv Kosha-<new-version>.AppImage ~/Applications/Kosha.AppImage
```

### macOS

Open the new `.dmg` and drag **Kosha** to Applications — macOS replaces the app automatically.

### Windows

Run the new `Kosha-Setup-<new-version>.exe`. The NSIS installer detects and upgrades the existing install.

---

## Uninstall

> **Your notes survive uninstall.** They are stored separately from the app and must be deleted manually — this is intentional so a botched uninstall can never destroy your knowledge base.

### Linux `.deb`

```bash
sudo dpkg -r kosha

# To also delete notes and settings:
rm -rf ~/.config/Kosha
```

### Linux AppImage

Delete the `.AppImage` file — it leaves nothing on your system.

```bash
# To delete notes and settings:
rm -rf ~/.config/Kosha
```

### macOS

```bash
rm -rf /Applications/Kosha.app

# To delete notes and settings:
rm -rf ~/Library/Application\ Support/Kosha
```

### Windows

**Settings → Apps → Kosha → Uninstall**

To delete notes: remove `%APPDATA%\Kosha\`

---

## Where your notes live

| Platform | Notes path |
|----------|-----------|
| Linux    | `~/.config/Kosha/notes/` |
| macOS    | `~/Library/Application Support/Kosha/notes/` |
| Windows  | `%APPDATA%\Kosha\notes\` |

Notes are plain `.md` files — back them up with `cp`, `rsync`, or git. They survive every update and uninstall unless you explicitly delete them.

---

## Features

- **PARA organisation** — Projects, Areas, Resources, Archive
- **Plain Markdown** — every note is a `.md` file, readable in any editor
- **`[[Wikilinks]]`** — link notes together by name; parsed into a live graph
- **Graph view** — D3.js force-directed graph of all wikilink connections; click any node to open that note
- **Split preview** — write Markdown on the left, see the rendered result on the right in real time
- **Full-text search** — searches note names and content across all folders including Archive
- **Templates** — daily note, project, meeting; `{{title}}` and `{{date}}` placeholders auto-filled
- **Autosave** — saves 1.2 s after the last keystroke; indicator shows `saving…` → `saved ✓`
- **Auto port selection** — Electron finds a free port automatically; never crashes on "port already in use"
- **Zero frontend dependencies** — vanilla HTML/CSS/JS, no React, no build step
- **Dark theme** — colour-coded by PARA folder (gold / green / blue / purple)

---

## Keyboard Shortcuts

| Shortcut             | Action                     |
|----------------------|----------------------------|
| `⌘/Ctrl + N`         | New note                   |
| `⌘/Ctrl + K`         | Focus search               |
| `⌘/Ctrl + S`         | Save note now              |
| `⌘/Ctrl + Shift + P` | Toggle split preview       |
| `Escape`             | Close modal / clear search |

---

## For Developers

### Architecture

```
┌─────────────────────────────────────────────┐
│  Electron shell  (electron/main.js)          │
│  • Finds a free port (3000+)                 │
│  • Seeds notes + templates on first launch   │
│  • Opens a BrowserWindow → localhost:PORT    │
└────────────────────┬────────────────────────┘
                     │ require('../server')
┌────────────────────▼────────────────────────┐
│  Express server  (server.js)                 │
│  • REST API  /api/*                          │
│  • Static files  /public/index.html          │
│  • Reads/writes .md files on disk            │
└────────────────────┬────────────────────────┘
                     │ HTTP + JSON
┌────────────────────▼────────────────────────┐
│  Frontend  (public/index.html)               │
│  • Vanilla HTML / CSS / JS — no build step   │
│  • D3.js for graph view (CDN)                │
│  • Google Fonts (CDN)                        │
└─────────────────────────────────────────────┘
```

**Alternative server:** `server.py` is a pure Python 3 stdlib rewrite of the same API — zero pip installs. Used by `start.sh` when Node.js is not available.

### Folder Structure

```
kosha/
├── electron/
│   └── main.js          # Electron entry point — port discovery, window, first-run setup
├── public/
│   └── index.html       # Entire frontend: HTML + CSS + JS, all inline
├── notes/               # Default sample notes (seeded into userData on first launch)
│   ├── Projects/
│   ├── Areas/
│   ├── Resources/
│   └── Archive/
├── templates/           # Markdown templates with {{title}} / {{date}} placeholders
│   ├── daily-note.md
│   ├── project.md
│   └── meeting.md
├── dist/                # Built installers (gitignored)
├── server.js            # Node.js / Express backend
├── server.py            # Python 3 stdlib backend (no dependencies)
├── start.sh             # Runtime auto-detector: node → bun → deno → python3
├── package.json         # npm scripts + electron-builder config
├── GUIDE.md             # End-user usage guide (PARA workflow, wikilinks, etc.)
└── README.md            # This file
```

### REST API Reference

All endpoints accept and return `application/json`. Note names in URL segments are URL-encoded.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes` | List all notes grouped by PARA folder. Returns `{ Projects: [{name, modified}], … }` |
| `GET` | `/api/notes/:folder/:name` | Get note content. Returns `{ content, modified }` |
| `POST` | `/api/notes/:folder/:name` | Create or overwrite a note. Body: `{ content }` |
| `DELETE` | `/api/notes/:folder/:name` | Delete a note permanently |
| `POST` | `/api/move` | Move a note between folders. Body: `{ name, fromFolder, toFolder }` |
| `GET` | `/api/search?q=` | Full-text search across all notes. Returns `[{ name, folder, preview }]` |
| `GET` | `/api/graph` | Wikilink graph. Returns `{ nodes: [{id, folder, links}], links: [{source, target}] }` |
| `GET` | `/api/templates` | List all templates with content. Returns `[{ name, content }]` |

**Folder values** must be one of: `Projects`, `Areas`, `Resources`, `Archive`.  
**Note names** must contain only `a-z A-Z 0-9 space _ - ( ) .` — all other characters are stripped server-side.

### Run from Source

Requires **Node.js 18+** (or Python 3.8+ for the Python server).

```bash
git clone https://github.com/m-np/kosha.git
cd kosha
npm install

# Web server — open http://localhost:3000 in your browser
npm start

# Desktop app (Electron window)
npm run dev

# Python server — no Node.js required
python3 server.py

# Auto-detect available runtime
./start.sh
```

**Environment variables** (all optional):

| Variable | Default | Description |
|----------|---------|-------------|
| `KOSHA_PORT` | `3000` | Port to listen on (Electron sets this automatically) |
| `KOSHA_NOTES_DIR` | `./notes` | Directory where `.md` notes are stored |
| `KOSHA_TEMPLATES_DIR` | `./templates` | Directory where template `.md` files are stored |
| `KOSHA_PUBLIC_DIR` | `./public` | Directory for static frontend files |

### Build Installers

```bash
npm run dist        # Linux: AppImage + .deb (x64)
npm run dist:mac    # macOS: .dmg (x64 + arm64)
npm run dist:win    # Windows: NSIS .exe installer (x64)
```

Output lands in `dist/`. Requires the target platform's build tools (electron-builder handles downloading them).

### Contributing

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. The entire frontend is `public/index.html` — no build step needed, just edit and refresh
3. The backend is `server.js` — restart with `npm start` to pick up changes
4. For the Electron shell, run `npm run dev` — it hot-loads the frontend on refresh
5. Keep the zero-dependency philosophy: no new npm packages in `dependencies` without discussion
6. Open a pull request against `main`

---

## Philosophy

**Plain files.** Your notes are `.md` files. Open them in Obsidian, VS Code, iA Writer, or `vim`. Sync them with Dropbox, Syncthing, or `rsync`. Kosha is a UI layer, not a lock-in mechanism.

**Local first.** Everything runs on your machine. No accounts, no servers, no subscriptions, no telemetry. Your data never leaves unless you choose to send it somewhere.

**Open source.** MIT licensed. Read the code, change it, fork it, ship it.

---

## Roadmap

- [ ] AI ask-your-notes (local LLM via Ollama)
- [ ] Auto-suggest `[[wikilinks]]` as you type
- [ ] Weekly digest / summary export
- [ ] Git auto-backup on save
- [ ] Tag system with tag cloud view
- [ ] Mobile-friendly layout
