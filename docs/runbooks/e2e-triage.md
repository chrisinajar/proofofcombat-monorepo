---
id: e2e-triage
description: Quickly triage failing Playwright tests without timeouts
owner: ui
triggers:
  - proofofcombat-ui/e2e/**/*
checklist:
  - Avoid timeouts; fix selectors
  - Run targeted tests locally
  - Prefer id/testid selectors
source: runbook
---
Summary: Diagnose E2E failures by validating selectors and flow, not by extending timeouts.

Steps:
1) Run a single test: `yarn --cwd proofofcombat-ui e2e path/to/test.spec.ts`.
2) Validate element selection uses `id` or `data-testid`.
3) Use provided helpers for delayed actions; avoid arbitrary waits.
4) Confirm server logs for real crashes vs clean shutdown.

Gotchas:
- The server often shows exit code 1 at the end because tests stop it; look for stack traces to confirm real crashes.

