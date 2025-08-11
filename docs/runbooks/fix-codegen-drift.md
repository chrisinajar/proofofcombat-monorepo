---
id: fix-codegen-drift
description: Resolve generated types drift between schema and committed files
owner: server, ui
triggers:
  - proofofcombat-server/schema/**/*
  - proofofcombat-ui/src/**/*.graphql
checklist:
  - Run both codegens
  - Commit generated changes
  - Re-run tests and build
source: runbook
---
Summary: Fix CI failures caused by outdated generated artifacts.

Steps:
1) Run `yarn --cwd proofofcombat-server generate && yarn --cwd proofofcombat-ui generate`.
2) Inspect `proofofcombat-server/types/graphql.ts` and `proofofcombat-ui/src/generated/graphql.tsx` changes.
3) Commit generated changes with a clear message.
4) Run `yarn test` and UI `yarn --cwd proofofcombat-ui build`.

Gotchas:
- Never manually edit generated files.

