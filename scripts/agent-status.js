#!/usr/bin/env node
const { execSync } = require('child_process');

function safe(cmd) {
  try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim(); }
  catch (e) { return ''; }
}

console.log('Agent Status');
console.log('Node:', safe('node -v'));
console.log('Yarn:', safe('yarn -v'));

console.log('\nPackages:');
console.log('- server deps installed:', safe('test -d proofofcombat-server/node_modules && echo yes || echo no'));
console.log('- ui deps installed    :', safe('test -d proofofcombat-ui/node_modules && echo yes || echo no'));

console.log('\nGenerated artifacts:');
console.log('- server types:', safe('test -f proofofcombat-server/types/graphql.ts && echo present || echo missing'));
console.log('- ui hooks   :', safe('test -f proofofcombat-ui/src/generated/graphql.tsx && echo present || echo missing'));

console.log('\nRunbooks:');
console.log('- count:', safe("ls -1 docs/runbooks/*.md 2>/dev/null | wc -l"));
console.log('- cursor rules drift check:', safe('node scripts/sync-runbooks-to-cursor.js --verify && echo ok || echo drift'));

