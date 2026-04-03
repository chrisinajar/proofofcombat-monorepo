#!/usr/bin/env node
/*
  Sync docs/runbooks/*.md to .cursor/skills/<id>/SKILL.md
  - Maps frontmatter: id -> name, description -> description
  - Body is passed through as-is
  - Deletes matching .cursor/rules/<id>.mdc if present (stale files from the old runbook→Cursor Rules pipeline)
  Usage:
    node scripts/sync-runbooks-to-skills.js [--verify]
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const RUNBOOKS_DIR = path.join(ROOT, 'docs', 'runbooks');
const SKILLS_DIR = path.join(ROOT, '.cursor', 'skills');
const LEGACY_RULES_DIR = path.join(ROOT, '.cursor', 'rules');
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

function toSkillMarkdown({ id, description }, body) {
  const desc = description || '';
  const header = [
    '---',
    `name: ${id}`,
    `description: ${JSON.stringify(desc)}`,
    '---',
    ''
  ].join('\n');
  return header + body.replace(/^\n+/, '');
}

function removeLegacyRule(id) {
  const legacy = path.join(LEGACY_RULES_DIR, `${id}.mdc`);
  if (fs.existsSync(legacy)) {
    fs.unlinkSync(legacy);
    console.log('Removed legacy rule', legacy);
  }
}

function main() {
  if (!fs.existsSync(RUNBOOKS_DIR)) {
    console.error('Runbooks dir not found:', RUNBOOKS_DIR);
    process.exit(2);
  }
  if (!fs.existsSync(SKILLS_DIR)) fs.mkdirSync(SKILLS_DIR, { recursive: true });
  const files = fs.readdirSync(RUNBOOKS_DIR).filter(f => f.endsWith('.md') && f !== '_template.md');
  let drift = false;
  for (const f of files) {
    const p = path.join(RUNBOOKS_DIR, f);
    const raw = fs.readFileSync(p, 'utf8');
    const { fm, body } = parseFrontmatter(raw);
    const id = (fm.id || path.basename(f, '.md')).trim();
    const skillDir = path.join(SKILLS_DIR, id);
    const outPath = path.join(skillDir, 'SKILL.md');
    const out = toSkillMarkdown({ id, description: fm.description }, body);
    if (VERIFY) {
      if (fs.existsSync(outPath)) {
        const cur = fs.readFileSync(outPath, 'utf8');
        if (cur.trim() !== out.trim()) {
          console.error(`Drift detected for ${id}. Update with: node scripts/sync-runbooks-to-skills.js`);
          drift = true;
        }
      } else {
        console.error(`Missing skill for ${id}:`, outPath);
        drift = true;
      }
    } else {
      if (!fs.existsSync(skillDir)) fs.mkdirSync(skillDir, { recursive: true });
      fs.writeFileSync(outPath, out, 'utf8');
      console.log('Synced', outPath);
      removeLegacyRule(id);
    }
  }
  if (VERIFY && drift) process.exit(1);
}

main();
