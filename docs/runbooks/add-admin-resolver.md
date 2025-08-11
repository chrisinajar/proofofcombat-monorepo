---
id: add-admin-resolver
description: Add a new admin-only resolver safely
owner: server
triggers:
  - proofofcombat-server/schema/admin/**/*
  - proofofcombat-server/schema/**/*.graphql
checklist:
  - Place under schema/admin/
  - Require @auth @admin
  - Regenerate server types
  - Add focused unit tests
source: runbook
---
Summary: Implement an admin resolver with correct routing and authorization.

Steps:
1) Add resolver and schema under `schema/admin/` and annotate with `@auth @admin`.
2) Run `yarn --cwd proofofcombat-server generate`.
3) Add a resolver unit test next to the file (`*.test.ts`).
4) Run `yarn --cwd proofofcombat-server test` and then root `yarn test`.

Gotchas:
- Keep admin logic separate from core game logic.

