---
id: static-export-troubleshooting
description: Keep Next.js UI static-exportable and fix export issues
owner: ui
triggers:
  - proofofcombat-ui/src/**/*
  - proofofcombat-ui/pages/**/*
checklist:
  - Avoid SSR-only APIs
  - Use static data where needed
  - Validate `yarn build && next export`
source: runbook
---
Summary: Ensure UI remains static-exportable; fix common export pitfalls.

Steps:
1) Run `yarn --cwd proofofcombat-ui build` to reproduce.
2) Remove Node-only APIs and server-only code paths from pages/components.
3) Prefer client-safe APIs and generated GraphQL hooks.
4) Re-run build and check `out/` artifacts.

Gotchas:
- Avoid dynamic server-side code paths; no custom servers.

