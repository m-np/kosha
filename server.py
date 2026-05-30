#!/usr/bin/env python3
"""Kosha — second brain server (pure Python stdlib, no dependencies)."""

import http.server
import json
import mimetypes
import os
import pathlib
import re
import shutil
import urllib.parse
from datetime import datetime, timezone

PORT = int(os.environ.get("KOSHA_PORT", 3000))
BASE   = pathlib.Path(__file__).parent.resolve()
NOTES  = BASE / "notes"
TMPL   = BASE / "templates"
PUBLIC = BASE / "public"
PARA   = ["Projects", "Areas", "Resources", "Archive"]

# ── helpers ───────────────────────────────────────────────────────────────────

def ok(handler, data, status=200):
    body = json.dumps(data, default=str).encode()
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Content-Length", len(body))
    handler.end_headers()
    handler.wfile.write(body)

def err(handler, msg, status=400):
    ok(handler, {"error": msg}, status)

def sanitize(name: str) -> str:
    return re.sub(r"[^a-zA-Z0-9 _\-().]", "", name).strip()

def note_path(folder: str, name: str) -> pathlib.Path | None:
    if folder not in PARA:
        return None
    safe = sanitize(name)
    if not safe:
        return None
    fname = safe if safe.endswith(".md") else safe + ".md"
    p = (NOTES / folder / fname).resolve()
    if not str(p).startswith(str(NOTES.resolve())):
        return None
    return p

def all_notes():
    notes = []
    for folder in PARA:
        d = NOTES / folder
        d.mkdir(parents=True, exist_ok=True)
        for f in sorted(d.glob("*.md")):
            stat = f.stat()
            mtime = datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).isoformat()
            notes.append({"name": f.stem, "folder": folder, "path": f, "modified": mtime})
    return notes

def parse_wikilinks(content: str) -> list[str]:
    return re.findall(r"\[\[([^\]]+)\]\]", content)

# ── request handler ───────────────────────────────────────────────────────────

class KoshaHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {self.command} {self.path}")

    # ── routing ───────────────────────────────────────────────────────────────

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path   = parsed.path.rstrip("/")
        qs     = urllib.parse.parse_qs(parsed.query)

        if path == "/api/notes":
            return self.api_list()
        if path.startswith("/api/notes/"):
            parts = path[len("/api/notes/"):].split("/", 1)
            if len(parts) == 2:
                return self.api_get(parts[0], urllib.parse.unquote(parts[1]))
        if path == "/api/search":
            return self.api_search(qs.get("q", [""])[0])
        if path == "/api/graph":
            return self.api_graph()
        if path == "/api/templates":
            return self.api_templates()
        # static files
        self.serve_static(path)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path   = parsed.path.rstrip("/")
        body   = self.read_body()

        if path.startswith("/api/notes/"):
            parts = path[len("/api/notes/"):].split("/", 1)
            if len(parts) == 2:
                return self.api_save(parts[0], urllib.parse.unquote(parts[1]), body)
        if path == "/api/move":
            return self.api_move(body)
        err(self, "Not found", 404)

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path   = parsed.path.rstrip("/")
        if path.startswith("/api/notes/"):
            parts = path[len("/api/notes/"):].split("/", 1)
            if len(parts) == 2:
                return self.api_delete(parts[0], urllib.parse.unquote(parts[1]))
        err(self, "Not found", 404)

    # ── API handlers ──────────────────────────────────────────────────────────

    def api_list(self):
        grouped = {f: [] for f in PARA}
        for n in all_notes():
            grouped[n["folder"]].append({"name": n["name"], "modified": n["modified"]})
        ok(self, grouped)

    def api_get(self, folder, name):
        p = note_path(folder, name)
        if not p:
            return err(self, "Invalid path")
        if not p.exists():
            return err(self, "Not found", 404)
        content = p.read_text(encoding="utf-8")
        mtime   = datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc).isoformat()
        ok(self, {"content": content, "modified": mtime})

    def api_save(self, folder, name, body):
        p = note_path(folder, name)
        if not p:
            return err(self, "Invalid path")
        content = body.get("content")
        if not isinstance(content, str):
            return err(self, "content required")
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8")
        mtime = datetime.fromtimestamp(p.stat().st_mtime, tz=timezone.utc).isoformat()
        ok(self, {"ok": True, "modified": mtime})

    def api_delete(self, folder, name):
        p = note_path(folder, name)
        if not p:
            return err(self, "Invalid path")
        if not p.exists():
            return err(self, "Not found", 404)
        p.unlink()
        ok(self, {"ok": True})

    def api_move(self, body):
        name        = body.get("name", "")
        from_folder = body.get("fromFolder", "")
        to_folder   = body.get("toFolder", "")
        if not (name and from_folder and to_folder):
            return err(self, "name, fromFolder, toFolder required")
        src = note_path(from_folder, name)
        dst = note_path(to_folder, name)
        if not src or not dst:
            return err(self, "Invalid path")
        if not src.exists():
            return err(self, "Source not found", 404)
        if dst.exists():
            return err(self, "Destination already exists", 409)
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
        ok(self, {"ok": True})

    def api_search(self, q):
        q = q.lower().strip()
        if not q:
            return ok(self, [])
        results = []
        for n in all_notes():
            content = n["path"].read_text(encoding="utf-8")
            name_match = q in n["name"].lower()
            preview = ""
            for line in content.splitlines():
                if q in line.lower():
                    preview = line.strip()[:120]
                    break
            if name_match or preview:
                results.append({
                    "name": n["name"],
                    "folder": n["folder"],
                    "preview": preview or n["name"],
                })
        ok(self, results)

    def api_graph(self):
        notes    = all_notes()
        node_map = {n["name"]: {"id": n["name"], "folder": n["folder"], "links": 0} for n in notes}
        links    = []
        for n in notes:
            content    = n["path"].read_text(encoding="utf-8")
            wikilinks  = parse_wikilinks(content)
            for target in wikilinks:
                if target in node_map and target != n["name"]:
                    links.append({"source": n["name"], "target": target})
                    node_map[n["name"]]["links"] += 1
                    node_map[target]["links"]    += 1
        ok(self, {"nodes": list(node_map.values()), "links": links})

    def api_templates(self):
        TMPL.mkdir(parents=True, exist_ok=True)
        templates = []
        for f in sorted(TMPL.glob("*.md")):
            templates.append({"name": f.stem, "content": f.read_text(encoding="utf-8")})
        ok(self, templates)

    # ── static file serving ───────────────────────────────────────────────────

    def serve_static(self, path):
        if path in ("", "/"):
            path = "/index.html"
        file_path = PUBLIC / path.lstrip("/")
        file_path = file_path.resolve()
        if not str(file_path).startswith(str(PUBLIC.resolve())):
            return err(self, "Forbidden", 403)
        if not file_path.exists() or not file_path.is_file():
            return err(self, "Not found", 404)
        mime, _ = mimetypes.guess_type(str(file_path))
        mime = mime or "application/octet-stream"
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    # ── body parser ───────────────────────────────────────────────────────────

    def read_body(self) -> dict:
        length = int(self.headers.get("Content-Length", 0))
        if not length:
            return {}
        try:
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return {}


# ── main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import socket
    import socketserver

    def find_free_port(start: int) -> int:
        port = start
        while True:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    s.bind(("127.0.0.1", port))
                    return port
                except OSError:
                    port += 1

    port = find_free_port(PORT)
    if port != PORT:
        print(f"  Port {PORT} in use — using {port} instead.")

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), KoshaHandler) as srv:
        print(f"\n  Kosha — second brain")
        print(f"  http://localhost:{port}\n")
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            print("\n  Stopped.")
