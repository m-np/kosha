#!/usr/bin/env bash
# Kosha launcher — tries node → bun → deno → python3 in order.
set -e
cd "$(dirname "$0")"

if command -v node &>/dev/null; then
  echo "  using node"
  [ ! -d node_modules ] && npm install
  exec node server.js
elif command -v bun &>/dev/null; then
  echo "  using bun"
  exec bun server.js
elif command -v deno &>/dev/null; then
  echo "  using deno"
  exec deno run --allow-net --allow-read --allow-write server.js
elif command -v python3 &>/dev/null; then
  echo "  using python3"
  exec python3 server.py
else
  echo "Error: no supported runtime found."
  echo "Install Node.js (https://nodejs.org) or Python 3 and try again."
  exit 1
fi
