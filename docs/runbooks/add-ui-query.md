---
id: add-ui-query
description: Add a new UI query using generated hooks
owner: ui
triggers:
  - proofofcombat-ui/src/**/*.graphql
  - proofofcombat-ui/src/**/*
checklist:
  - Create .graphql file
  - Run UI codegen
  - Use generated hooks
  - Add tests and stable selectors
source: runbook
---
Summary: Wire a new UI query/mutation via `.graphql` + generated React hooks.

Steps:
1) Create `src/graphql/<feature>/<name>.graphql` with the operation.
2) Run `yarn --cwd proofofcombat-ui generate`.
3) Use generated `use<Name>Query`/`use<Name>Mutation` hooks in components.
4) Add `id` or `data-testid` for Playwright; add a minimal unit test if logic exists.
5) Run `yarn --cwd proofofcombat-ui test` and `yarn --cwd proofofcombat-ui e2e` for the path.

Gotchas:
- Never use `gql` tag in UI.
- Prefer colocated tests: `<component>.test.tsx` next to the file.

