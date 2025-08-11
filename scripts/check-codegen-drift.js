#!/usr/bin/env node
const { spawnSync } = require('child_process');

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd, env: process.env });
  if (r.error) throw r.error;
  return r.status;
}

function main() {
  console.log('Running server codegen...');
  let status = run('yarn', ['--cwd', 'proofofcombat-server', 'generate']);
  if (status !== 0) process.exit(status);
  console.log('Running UI codegen...');
  status = run('yarn', ['--cwd', 'proofofcombat-ui', 'generate']);
  if (status !== 0) process.exit(status);

  console.log('Checking for generated file drift...');
  const diff = spawnSync('git', ['status', '--porcelain', 'proofofcombat-server/types/graphql.ts', 'proofofcombat-ui/src/generated/graphql.tsx'], { encoding: 'utf8' });
  const out = (diff.stdout || '').trim();
  if (out) {
    console.error('Generated files changed. Commit the updates:');
    console.error(out);
    process.exit(1);
  }
  console.log('No codegen drift detected.');
}

main();

