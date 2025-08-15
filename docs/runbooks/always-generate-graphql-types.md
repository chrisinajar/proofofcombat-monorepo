---
id: always-generate-graphql-types
description: Always generate types from graphql
owner: server, ui
triggers:
  - proofofcombat-server/schema/**/*
  - proofofcombat-ui/src/**/*.graphql
checklist:
  - Run both codegens after changes
  - Never edit generated files
  - Use generated hooks in UI
source: cursor-rule
---

# GraphQL Code Generator
- The GraphQL Code Generator is used to auto-generate the types for both API and client
- It also generates hooks and code for the UI
- Any time we edit the GraphQL schema, we must run `yarn run generate` to update the generated types.
- We never manually edit the `types/graphql.ts` file in the server
- We never manually edit the `src/generated/graphql.tsx` file on the UI

## Important: Do not change codegen configuration
- Do not edit `codegen.yml` or environment variables to “make codegen work”. Use the existing `yarn generate` scripts as-is in each project:
  - UI: `yarn --cwd proofofcombat-ui generate`
  - Server: `yarn --cwd proofofcombat-server generate`
- If codegen fails in a sandbox due to environment quirks (network, CPU detection, or sandboxed system calls), run the same `yarn generate` locally where it succeeds rather than changing repo config.
- Never switch schema sources or hardcode endpoints in the repo when running codegen.

See the "Never use graphql tag in the UI project" rule for details on the UI's auto generated hooks.
