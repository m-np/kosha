# Kosha — Self-Hosted Second Brain

A local-first, plain-file second brain. Notes live as `.md` files on your disk. No database, no lock-in, no cloud required.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20macOS%20%7C%20Windows-blue)](#install)
[![GitHub release](https://img.shields.io/github/v/release/m-np/kosha)](https://github.com/m-np/kosha/releases/latest)

---

## Install

Download the latest installer for your platform from the [Releases page](https://github.com/m-np/kosha/releases/latest).

### Linux

**Option A — `.deb` (Ubuntu, Debian, Pop!_OS)**

```bash
# Install
sudo dpkg -i kosha_1.0.0_amd64.deb

# Launch from your app menu (search "Kosha"), or run:
kosha
```

**Option B — AppImage (any Linux distro)**

```bash
# AppImage needs libfuse2 on Ubuntu 22.04+
sudo apt install libfuse2

# Make executable and run — no installation needed
chmod +x Kosha-1.0.0.AppImage
./Kosha-1.0.0.AppImage
```

### macOS

```bash
# Mount the dmg, drag Kosha to Applications
open Kosha-1.0.0.dmg
```

Then launch **Kosha** from Spotlight or `/Applications/Kosha.app`.

### Windows

Run `Kosha-Setup-1.0.0.exe`, follow the installer wizard. Kosha appears in the Start menu and adds an optional desktop shortcut.

---

## Update

### Linux `.deb`

Download the new `.deb` from [Releases](https://github.com/m-np/kosha/releases/latest) and run:

```bash
sudo dpkg -i kosha_<new-version>_amd64.deb
```

`dpkg` replaces the previous install in-place. Your notes are stored in `~/.config/Kosha/notes/` and are **never touched** during an update.

### Linux AppImage

Download the new `.AppImage`, make it executable, and replace the old file:

```bash
chmod +x Kosha-<new-version>.AppImage
mv Kosha-<new-version>.AppImage ~/Applications/Kosha.AppImage   # or wherever you keep it
```

### macOS

Download the new `.dmg`, open it, and drag **Kosha** to Applications — macOS replaces the existing app automatically.

### Windows

Run the new `Kosha-Setup-<new-version>.exe`. The installer detects the existing install and upgrades it without touching your notes.

---

## Uninstall

Your notes (`~/.config/Kosha/notes/`) are **separate from the app** and must be deleted manually if you want them gone — this is intentional so a botched uninstall never destroys your knowledge base.

### Linux `.deb`

```bash
sudo dpkg -r kosha
```

To also remove your notes and settings:

```bash
rm -rf ~/.config/Kosha
```

### Linux AppImage

AppImage leaves nothing on your system — just delete the `.AppImage` file.

To remove notes and settings:

```bash
rm -rf ~/.config/Kosha
```

### macOS

```bash
rm -rf /Applications/Kosha.app

# Optional: remove notes and settings
rm -rf ~/Library/Application\ Support/Kosha
```

### Windows

**Settings → Apps → Kosha → Uninstall**, or run the uninstaller from `C:\Program Files\Kosha\`.

To remove notes:

```
%APPDATA%\Kosha\   ← delete this folder
```

---

## Where your notes live

| Platform | Path |
|----------|------|
| Linux    | `~/.config/Kosha/notes/` |
| macOS    | `~/Library/Application Support/Kosha/notes/` |
| Windows  | `%APPDATA%\Kosha\notes\` |

Notes are plain `.md` files. Back them up with `cp`, `rsync`, or git. They survive every update and uninstall unless you explicitly delete them.

---

## Run from source

Requires **Node.js 18+** (or Python 3.8+ for the Python server).

```bash
git clone https://github.com/m-np/kosha.git
cd kosha
npm install

# Web server mode — open http://localhost:3000 in your browser
npm start

# Desktop app mode
npm run dev

# Python server (no Node required)
python3 server.py
```

### Build your own installer

```bash
npm run dist          # Linux: AppImage + .deb
npm run dist:mac      # macOS: .dmg
npm run dist:win      # Windows: .exe installer
```

Output lands in `dist/`.

---

## Features

- **PARA organization** — Projects, Areas, Resources, Archive
- **Plain Markdown** — notes stored as `.md` files, readable anywhere
- **[[Wikilinks]]** — link notes together, visualized in graph view
- **Graph view** — D3.js force-directed graph of all wikilink connections
- **Split preview** — write and preview Markdown side by side
- **Full-text search** — instant search across all notes
- **Templates** — daily note, project, meeting; supports `{{title}}` and `{{date}}`
- **Autosave** — 1.2 s after last keystroke, with save indicator
- **Auto port selection** — never crashes on "port in use"; finds the next free port
- **Zero frontend dependencies** — vanilla HTML/CSS/JS, no build step
- **Dark theme** — easy on the eyes for long writing sessions

---

## PARA

| Category  | Purpose                                | Color  |
|-----------|----------------------------------------|--------|
| Projects  | Active goals with a deadline           | Gold   |
| Areas     | Ongoing responsibilities               | Green  |
| Resources | Reference material, topics of interest | Blue   |
| Archive   | Completed / inactive items             | Purple |

---

## Keyboard Shortcuts

| Shortcut             | Action                     |
|----------------------|----------------------------|
| `⌘/Ctrl + N`         | New note                   |
| `⌘/Ctrl + K`         | Focus search               |
| `⌘/Ctrl + S`         | Save note                  |
| `⌘/Ctrl + Shift + P` | Toggle split preview       |
| `Escape`             | Close modal / clear search |

---

## Philosophy

**Plain files.** Your notes are `.md` files. Open them in any editor, sync with any tool, version-control them with git. Kosha is a UI, not a prison.

**Local first.** Everything runs on your machine. No accounts, no servers, no subscriptions. Your data never leaves unless you choose to send it somewhere.

**Open source.** Read the code, change it, share it. MIT licensed.

---

## Roadmap

- [ ] AI ask-your-notes (local LLM integration via Ollama)
- [ ] Auto-suggest wikilinks as you type
- [ ] Weekly digest email / summary
- [ ] Git auto-backup on save
- [ ] Tag system with tag cloud view
- [ ] Mobile-friendly layout
