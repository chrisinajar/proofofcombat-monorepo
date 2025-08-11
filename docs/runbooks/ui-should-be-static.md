---
id: ui-should-be-static
description: UI must remain static-exportable
owner: ui
triggers:
  - proofofcombat-ui/**/*
checklist:
  - Avoid SSR-only APIs
  - Validate static export
source: cursor-rule
---
Short rule: UI must remain static-exportable (no SSR). `yarn --cwd proofofcombat-ui build` creates static `out/`.

