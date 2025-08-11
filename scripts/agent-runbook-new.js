#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const [, , id, ...titleParts] = process.argv;
if (!id) {
  console.error('Usage: node scripts/agent-runbook-new.js <id> ["Title..."]');
  process.exit(1);
}
const title = titleParts.join(' ');
const RUNBOOKS_DIR = path.join(process.cwd(), 'docs', 'runbooks');
const outPath = path.join(RUNBOOKS_DIR, `${id}.md`);
if (fs.existsSync(outPath)) {
  console.error('Runbook already exists:', outPath);
  process.exit(2);
}
const content = `---\nid: ${id}\ndescription: ${title || 'Short description'}\nowner: TBD\ntriggers:\n  - path/glob/**\nchecklist:\n  - Fill out checklist\nsource: runbook\n---\nSummary: ${title || 'Summary of this runbook.'}\n\nSteps:\n1) First step\n2) Second step\n3) Third step\n\nGotchas:\n- Common pitfalls here\n`;
fs.mkdirSync(RUNBOOKS_DIR, { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Created', outPath);

