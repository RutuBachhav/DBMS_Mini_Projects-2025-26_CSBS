/**
 * start.js — StockUp dev launcher (Windows-compatible, no shell required)
 * Spawns backend (nodemon) + frontend (vite) directly via Node.js spawn.
 * No cmd.exe, no PowerShell, no shell dependency whatsoever.
 */

const { spawn } = require('child_process');
const path = require('path');

const root = __dirname;
const nodeExe = process.execPath; // path to the current node.exe

// ─── Colors ────────────────────────────────────────────────────────────────
const MAGENTA = '\x1b[35m';
const CYAN    = '\x1b[36m';
const RESET   = '\x1b[0m';
const BOLD    = '\x1b[1m';
const RED     = '\x1b[31m';

function prefix(label, color) {
  return `${BOLD}${color}[${label}]${RESET} `;
}

function pipeOutput(proc, label, color) {
  proc.stdout.on('data', (data) => {
    data.toString().split('\n').forEach((line) => {
      if (line.trim()) process.stdout.write(prefix(label, color) + line + '\n');
    });
  });
  proc.stderr.on('data', (data) => {
    data.toString().split('\n').forEach((line) => {
      if (line.trim()) process.stderr.write(prefix(label, color) + line + '\n');
    });
  });
}

// ─── Spawn Backend (nodemon) ────────────────────────────────────────────────
const nodemonBin = path.join(root, 'backend', 'node_modules', 'nodemon', 'bin', 'nodemon.js');
const serverJs   = path.join(root, 'backend', 'server.js');

console.log(`${BOLD}${MAGENTA}[BACKEND]${RESET} Starting on http://localhost:5000 ...`);
const backend = spawn(nodeExe, [nodemonBin, serverJs], {
  cwd: path.join(root, 'backend'),
  shell: false,
  env: process.env,
});
pipeOutput(backend, 'BACKEND', MAGENTA);

// ─── Spawn Frontend (vite) ─────────────────────────────────────────────────
const viteBin = path.join(root, 'frontend', 'node_modules', 'vite', 'bin', 'vite.js');

console.log(`${BOLD}${CYAN}[FRONTEND]${RESET} Starting on http://localhost:5173 ...`);
const frontend = spawn(nodeExe, [viteBin, '--port', '5173', '--host'], {
  cwd: path.join(root, 'frontend'),
  shell: false,
  env: process.env,
});
pipeOutput(frontend, 'FRONTEND', CYAN);

// ─── Handle exits ──────────────────────────────────────────────────────────
function onExit(label, code) {
  if (code !== 0 && code !== null) {
    console.error(`\n${RED}[${label}] exited with code ${code}. Stopping all servers.${RESET}`);
    backend.kill();
    frontend.kill();
    process.exit(code);
  }
}

backend.on('close',  (code) => onExit('BACKEND',  code));
frontend.on('close', (code) => onExit('FRONTEND', code));

process.on('SIGINT', () => {
  console.log('\n\x1b[33m[StockUp] Shutting down...\x1b[0m');
  backend.kill();
  frontend.kill();
  process.exit(0);
});
