---
id: e2e-tests
description: E2E tests rules and guidelines
owner: ui
triggers:
  - proofofcombat-ui/e2e/**
checklist:
  - Use id/testid selectors
  - Run individual tests
  - Avoid increasing timeouts
source: cursor-rule
---
The answer is never timeouts.

# Quickstart
- Run locally with `yarn --cwd proofofcombat-ui e2e` — no extra install steps required.
- The e2e harness starts the server/UI on test ports and triggers UI GraphQL codegen automatically. Do not start your own server.
- To run a single spec: `yarn --cwd proofofcombat-ui e2e e2e/tests/<file>.spec.ts`.

# Select elements by id and testid
Do not ever select elements by things like material ui classnames or the text within them. This is fragile, and small usability changes could potentially break tests. We want our tests to be semantic in nature, so instead we select elements by ID's when they're already available or by `data-testid` when there is no id.

# Run individual tests
When you're not intentionally running the entire suite, you should use `yarn run e2e [path]` to run individual tests at a time, that way it's easy to iterate on them.

# The answer is never timeouts
Any time you find yourself looking at an error and think, "maybe I should increase the timeout in `playwright.config.ts`" then not only is that not the answer, but it means that you're on the wrong track. The odds are, a previous step or assumption is incorrect, and we instead need to take a big step back and verify all our assumptions to be absolutely sure.

If you want to wait for an action that has `delay`, you should use the helper function which waits for the delay bar to start and then finish again.

Most actions, especially UI ones, happen within individual milliseconds. If an element isn't appearing then the odds are it's simply not there or not being selected correctly.

# The server probably isn't crashing
If you see `Server process exited with code 1` at the end of the tests running, this is because we kill the server at the end of tests. The odds are the server is not crashing, especially if there is no stack trace along with it.

# Seeding fixtures and equipment-state tests
- Use `seedFixture('<name>', E2E_DB_PATH)` from `e2e/helpers/database.ts` to seed precise hero/account state.
- Place JSON fixtures in `proofofcombat-ui/e2e/fixtures/`. Examples: `equip-melee.json`, `equip-focus.json`, `equip-shield.json`, `equip-ranged.json`, `equip-battlemage.json`.
- These tests are a robust way to validate equipment-specific UI behavior (e.g., attack button availability) without fragile in-test crafting flows.

# Gotchas
- Do not run `playwright install`. The repo already includes `@playwright/test` and manages browser binaries during CI where needed. Local runs should work with just `yarn e2e` in the UI project.
- Schema/UI drift: after server schema changes, run server codegen and re-run UI codegen or the e2e quickstart will regenerate at boot.
