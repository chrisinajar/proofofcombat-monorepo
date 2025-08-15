#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const UI_SRC = path.join(process.cwd(), 'proofofcombat-ui', 'src');
let violations = [];

function scan(dir) {
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    // Ignore generated artifacts; they may legitimately contain gql tagged templates
    if (e.isDirectory()) {
      if (p.includes(path.join('src', 'generated'))) continue;
      scan(p);
    }
    else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) {
      const text = fs.readFileSync(p, 'utf8');
      if (/import\s*\{\s*gql\s*\}\s*from\s*['"]@apollo\/client['"]/.test(text) || /gql`/.test(text)) {
        violations.push(p);
      }
    }
  }
}

scan(UI_SRC);

if (violations.length) {
  console.error('Inline GraphQL detected in UI (forbidden):');
  for (const v of violations) console.error(' -', path.relative(process.cwd(), v));
  process.exit(1);
} else {
  console.log('No inline GraphQL found in UI.');
}
