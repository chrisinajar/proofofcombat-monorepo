#!/usr/bin/env node
/*
  Sync docs/runbooks/*.md to .cursor/rules/*.mdc
  - Maps frontmatter: description, triggers -> globs
  - Body is passed through as-is
  Usage:
    node scripts/sync-runbooks-to-cursor.js [--verify]
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const RUNBOOKS_DIR = path.join(ROOT, 'docs', 'runbooks');
const CURSOR_DIR = path.join(ROOT, '.cursor', 'rules');
const VERIFY = process.argv.includes('--verify');

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { fm: {}, body: text };
  const yaml = m[1];
  const body = text.slice(m[0].length);
  const fm = {};
  const lines = yaml.split(/\r?\n/);
  let currentKey = null;
  for (const line of lines) {
    if (!line.trim()) continue;
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      let v = keyMatch[2];
      if (!v) { fm[currentKey] = ''; continue; }
      if (v.startsWith('[') && v.endsWith(']')) {
        try { fm[currentKey] = JSON.parse(v.replace(/([a-zA-Z0-9_\-\/\.\*]+)(?=,|\])/g, '"$1"')); } catch { fm[currentKey] = []; }
      } else {
        fm[currentKey] = v.replace(/^"|"$/g, '');
      }
    } else if (/^\s*-\s+/.test(line) && currentKey) {
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
      fm[currentKey].push(line.replace(/^\s*-\s+/, '').trim());
    }
  }
  return { fm, body };
}

function toCursorRule({ description, triggers }, body) {
  const header = [
    '---',
    `description: ${description || ''}`,
    `globs: ${Array.isArray(triggers) && triggers.length ? triggers.join(', ') : ''}`,
    '---',
    ''
  ].join('\n');
  return header + body.replace(/^\n+/, '');
}

function main() {
  if (!fs.existsSync(RUNBOOKS_DIR)) {
    console.error('Runbooks dir not found:', RUNBOOKS_DIR);
    process.exit(2);
  }
  if (!fs.existsSync(CURSOR_DIR)) fs.mkdirSync(CURSOR_DIR, { recursive: true });
  const files = fs.readdirSync(RUNBOOKS_DIR).filter(f => f.endsWith('.md') && f !== '_template.md');
  let drift = false;
  for (const f of files) {
    const p = path.join(RUNBOOKS_DIR, f);
    const raw = fs.readFileSync(p, 'utf8');
    const { fm, body } = parseFrontmatter(raw);
    const id = (fm.id || path.basename(f, '.md')).trim();
    const outPath = path.join(CURSOR_DIR, `${id}.mdc`);
    const out = toCursorRule({ description: fm.description, triggers: fm.triggers }, body);
    if (VERIFY) {
      if (fs.existsSync(outPath)) {
        const cur = fs.readFileSync(outPath, 'utf8');
        if (cur.trim() !== out.trim()) {
          console.error(`Drift detected for ${id}. Update with: node scripts/sync-runbooks-to-cursor.js`);
          drift = true;
        }
      } else {
        console.error(`Missing Cursor rule for ${id}.`);
        drift = true;
      }
    } else {
      fs.writeFileSync(outPath, out, 'utf8');
      console.log('Synced', outPath);
    }
  }
  if (VERIFY && drift) process.exit(1);
}

main();

