const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = parseInt(process.env.KOSHA_PORT || '3000', 10);
const NOTES_DIR     = path.resolve(process.env.KOSHA_NOTES_DIR     || path.join(__dirname, 'notes'));
const TEMPLATES_DIR = path.resolve(process.env.KOSHA_TEMPLATES_DIR || path.join(__dirname, 'templates'));
const PUBLIC_DIR    = path.resolve(process.env.KOSHA_PUBLIC_DIR    || path.join(__dirname, 'public'));
const PARA_FOLDERS  = ['Projects', 'Areas', 'Resources', 'Archive'];

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9 _\-().]/g, '').trim();
}

function safeNotePath(folder, name) {
  if (!PARA_FOLDERS.includes(folder)) return null;
  const safeName = sanitizeName(name);
  if (!safeName) return null;
  const notePath = path.join(NOTES_DIR, folder, safeName.endsWith('.md') ? safeName : safeName + '.md');
  const resolved = path.resolve(notePath);
  if (!resolved.startsWith(path.resolve(NOTES_DIR))) return null;
  return resolved;
}

function parseWikilinks(content) {
  const matches = [];
  const re = /\[\[([^\]]+)\]\]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    matches.push(m[1]);
  }
  return matches;
}

function getAllNotes() {
  const notes = [];
  for (const folder of PARA_FOLDERS) {
    const dir = path.join(NOTES_DIR, folder);
    ensureDir(dir);
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      notes.push({
        name: file.replace(/\.md$/, ''),
        folder,
        filePath,
        modified: stat.mtime,
      });
    }
  }
  return notes;
}

// GET /api/notes — list all notes grouped by folder
app.get('/api/notes', (req, res) => {
  try {
    const grouped = {};
    for (const folder of PARA_FOLDERS) grouped[folder] = [];
    const notes = getAllNotes();
    for (const n of notes) {
      grouped[n.folder].push({ name: n.name, modified: n.modified });
    }
    res.json(grouped);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/notes/:folder/:name — get note content
app.get('/api/notes/:folder/:name', (req, res) => {
  const notePath = safeNotePath(req.params.folder, req.params.name);
  if (!notePath) return res.status(400).json({ error: 'Invalid path' });
  if (!fs.existsSync(notePath)) return res.status(404).json({ error: 'Not found' });
  try {
    const content = fs.readFileSync(notePath, 'utf8');
    const stat = fs.statSync(notePath);
    res.json({ content, modified: stat.mtime });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/notes/:folder/:name — save note
app.post('/api/notes/:folder/:name', (req, res) => {
  const notePath = safeNotePath(req.params.folder, req.params.name);
  if (!notePath) return res.status(400).json({ error: 'Invalid path' });
  const { content } = req.body;
  if (typeof content !== 'string') return res.status(400).json({ error: 'content required' });
  try {
    ensureDir(path.dirname(notePath));
    fs.writeFileSync(notePath, content, 'utf8');
    res.json({ ok: true, modified: fs.statSync(notePath).mtime });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/notes/:folder/:name — delete note
app.delete('/api/notes/:folder/:name', (req, res) => {
  const notePath = safeNotePath(req.params.folder, req.params.name);
  if (!notePath) return res.status(400).json({ error: 'Invalid path' });
  if (!fs.existsSync(notePath)) return res.status(404).json({ error: 'Not found' });
  try {
    fs.unlinkSync(notePath);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/move — move note between folders
app.post('/api/move', (req, res) => {
  const { name, fromFolder, toFolder } = req.body;
  if (!name || !fromFolder || !toFolder) return res.status(400).json({ error: 'name, fromFolder, toFolder required' });
  const src = safeNotePath(fromFolder, name);
  const dst = safeNotePath(toFolder, name);
  if (!src || !dst) return res.status(400).json({ error: 'Invalid path' });
  if (!fs.existsSync(src)) return res.status(404).json({ error: 'Source not found' });
  if (fs.existsSync(dst)) return res.status(409).json({ error: 'Destination already exists' });
  try {
    ensureDir(path.dirname(dst));
    fs.renameSync(src, dst);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/search?q= — full-text search
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) return res.json([]);
  try {
    const results = [];
    const notes = getAllNotes();
    for (const n of notes) {
      const content = fs.readFileSync(n.filePath, 'utf8');
      const lines = content.split('\n');
      const nameMatch = n.name.toLowerCase().includes(q);
      let preview = '';
      for (const line of lines) {
        if (line.toLowerCase().includes(q)) {
          preview = line.trim().slice(0, 120);
          break;
        }
      }
      if (nameMatch || preview) {
        results.push({ name: n.name, folder: n.folder, preview: preview || n.name });
      }
    }
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/graph — wikilink graph
app.get('/api/graph', (req, res) => {
  try {
    const notes = getAllNotes();
    const nodeMap = {};
    for (const n of notes) {
      nodeMap[n.name] = { id: n.name, folder: n.folder, links: 0 };
    }

    const links = [];
    for (const n of notes) {
      const content = fs.readFileSync(n.filePath, 'utf8');
      const wikilinks = parseWikilinks(content);
      for (const target of wikilinks) {
        if (nodeMap[target] && target !== n.name) {
          links.push({ source: n.name, target });
          nodeMap[n.name].links++;
          nodeMap[target].links++;
        }
      }
    }

    res.json({ nodes: Object.values(nodeMap), links });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/templates — list templates with content
app.get('/api/templates', (req, res) => {
  try {
    ensureDir(TEMPLATES_DIR);
    const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md'));
    const templates = files.map(f => ({
      name: f.replace(/\.md$/, ''),
      content: fs.readFileSync(path.join(TEMPLATES_DIR, f), 'utf8'),
    }));
    res.json(templates);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`\n  Kosha — second brain\n  http://localhost:${PORT}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  Error: port ${PORT} is already in use.`);
    console.error(`  Kill the existing process with:  lsof -ti:${PORT} | xargs kill\n`);
    process.exit(1);
  }
  throw err;
});
