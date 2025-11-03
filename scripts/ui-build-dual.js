#!/usr/bin/env node
/*
  Dual-build UI: root and classic subpath
  - Builds proofofcombat-ui twice and collates outputs into out-dual/
  - Root build goes to out-dual/
  - Classic build goes to out-dual/classic/

  Usage:
    node scripts/ui-build-dual.js

  Notes:
  - Expects Next 12 static export.
  - Honors existing UI env but overrides base/path for the classic build.
*/
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, args, cwd, env = {}) {
  const mergedEnv = { ...process.env, ...env };
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd, env: mergedEnv });
  if (r.status !== 0) {
    process.exit(r.status || 1);
  }
}

function rimraf(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function main() {
  const uiDir = path.join(process.cwd(), 'proofofcombat-ui');
  const outDual = path.join(process.cwd(), 'out-dual');

  // Clean outputs
  rimraf(outDual);

  // Build root UI
  console.log('Building UI for root...');
  run('yarn', ['build'], uiDir, {
    NEXT_PUBLIC_BASE_PATH: '',
    NEXT_PUBLIC_API_PATH: process.env.NEXT_PUBLIC_API_PATH || '/graphql',
    NEXT_PUBLIC_SOCKET_PATH: process.env.NEXT_PUBLIC_SOCKET_PATH || '/socket.io',
  });
  copyDir(path.join(uiDir, 'out'), outDual);

  // Build classic UI under /classic
  console.log('Building UI for /classic...');
  run('yarn', ['build'], uiDir, {
    NEXT_PUBLIC_BASE_PATH: '/classic',
    NEXT_PUBLIC_API_PATH: process.env.NEXT_PUBLIC_API_PATH || '/graphql',
    NEXT_PUBLIC_SOCKET_PATH: '/classic/socket.io',
  });
  copyDir(path.join(uiDir, 'out'), path.join(outDual, 'classic'));

  console.log('Dual UI export created at', outDual);
}

main();

