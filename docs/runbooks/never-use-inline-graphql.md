---
id: never-use-inline-graphql
description: Never use graphql tag in the UI project
owner: ui
triggers:
  - proofofcombat-ui/src/**/*
checklist:
  - Write .graphql files only
  - Use generated hooks
  - Run UI codegen after changes
source: cursor-rule
---
- Always write .graphql files in the UI project
- Never write inline graphql using the gql` tag
- Server code may use gql tag, but the UI must not
- Any time you edit any .graphql file you must generate types again in the UI project
- Always use the auto-generated hooks
- The command for running codegen is `yarn run generate`
