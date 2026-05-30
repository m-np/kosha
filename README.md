# Kosha — Self-Hosted Second Brain

A local-first, plain-file second brain. Notes live as `.md` files on your disk. No database, no lock-in, no cloud required.

---

## Quick Start

```bash
git clone <this-repo> kosha
cd kosha
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

---

## Features

- **PARA organization** — Projects, Areas, Resources, Archive
- **Plain Markdown** — notes stored as `.md` files, readable anywhere
- **[[Wikilinks]]** — link notes together, visualized in graph view
- **Graph view** — D3.js force-directed graph of all wikilink connections
- **Split preview** — write and preview Markdown side by side
- **Full-text search** — instant search across all notes
- **Templates** — daily note, project, meeting; supports `{{title}}` and `{{date}}`
- **Autosave** — 1.2 s after last keystroke
- **Zero dependencies on the frontend** — vanilla HTML/CSS/JS, no build step
- **Dark theme** — easy on the eyes for long writing sessions

---

## PARA

| Category   | Purpose                              | Color  |
|------------|--------------------------------------|--------|
| Projects   | Active goals with a deadline         | Gold   |
| Areas      | Ongoing responsibilities             | Green  |
| Resources  | Reference material, topics of interest | Blue |
| Archive    | Completed / inactive items           | Purple |

---

## Keyboard Shortcuts

| Shortcut           | Action                  |
|--------------------|-------------------------|
| `⌘/Ctrl + N`       | New note                |
| `⌘/Ctrl + K`       | Focus search            |
| `⌘/Ctrl + S`       | Save note               |
| `⌘/Ctrl + Shift+P` | Toggle split preview    |
| `Escape`           | Close modal / clear search |

---

## Philosophy

**Plain files.** Your notes are `.md` files. Open them in any editor, sync with any tool, version-control them with git. Kosha is a UI, not a prison.

**Local first.** Everything runs on your machine. No accounts, no servers, no subscriptions. Your data never leaves unless you choose to send it somewhere.

**Open source.** Read the code, change it, share it.

---

## Roadmap

- [ ] AI ask-your-notes (local LLM integration via Ollama)
- [ ] Auto-suggest wikilinks as you type
- [ ] Weekly digest email / summary
- [ ] Git auto-backup on save
- [ ] Tag system with tag cloud view
- [ ] Mobile-friendly layout
