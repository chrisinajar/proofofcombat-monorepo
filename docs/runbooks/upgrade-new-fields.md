---
id: upgrade-new-fields
description: Ensure new GraphQL fields are upgraded in persisted models
owner: server
triggers:
  - proofofcombat-server/schema/**
  - proofofcombat-server/db/models/**
checklist:
  - Add new field to GraphQL types and resolvers
  - Make the field optional in model Partial<T> types
  - Provide a default in the model upgrade() function
  - Prefer resolvers for computed fields; avoid duplicating logic
  - Regenerate server and UI GraphQL types
  - Run agent checks for drift and runbook sync
source: runbook
---

# Upgrade New Fields

Old player data will not include newly added fields. Any time you add a field to a GraphQL type that maps to a persisted model (e.g., `Hero`), you must update the model upgrade path so legacy records load safely.

What to do when adding a new field:

- Make it optional in Partial types:
  - Update the `Partial<Hero>` (or equivalent) union in `db/models/*` to include the new key so old data can pass through the upgrader without compile errors.

- Provide a default in `upgrade()`:
  - In the model's `upgrade(data)` function, initialize the new field with a sensible default. If the field is computed-only, set a conservative placeholder; the resolver should remain source of truth.

- Keep logic single-sourced:
  - For computed fields (derived from equipment, class, etc.), implement the logic in a helper or the GraphQL field resolver. Only set a default in `upgrade()` to satisfy typing; do not duplicate complex calculations.

- Regenerate code and validate:
  - Server: `yarn --cwd proofofcombat-server generate`
  - UI: ensure the server is running locally, then `yarn --cwd proofofcombat-ui generate`
  - Run: `yarn agent:check` to catch codegen or runbook drift.

Common pitfalls:

- Forgetting to update `Partial<T>` leads to TypeScript errors when loading old data.
- Duplicating business logic between resolvers and `upgrade()` creates drift; prefer resolvers/helpers for truth, defaults for typing only.
- Not updating `.graphql` queries in UI to request new fields after server changes.

