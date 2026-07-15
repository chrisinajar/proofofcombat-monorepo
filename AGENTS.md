# Repository Guidelines

## Project Structure
- `proofofcombat-server`: Apollo GraphQL + Express + Socket.IO (TypeScript). Tests sit next to code (`*.test.ts`). Admin-only resolvers live in `schema/admin/` and require `@auth @admin`.
- `proofofcombat-ui`: Next.js app with Apollo Client. UI code in `src/`, pages in `pages/`, static assets in `public/`. Playwright e2e tests in `e2e/`.
- Root `jest.config.js` orchestrates both packages; CI runs e2e on PRs.
- Reference docs live in `docs/` (project overview, NPC lore, game mechanics).
- Procedural skills live in `.cursor/skills/` — consult them for detailed workflows.

## Build, Test, Dev
- Node: `nvm use 20.11.0` (Yarn Classic).
- Install: `yarn --cwd proofofcombat-server install` and `yarn --cwd proofofcombat-ui install`.
- Dev: server `yarn --cwd proofofcombat-server dev` (uses `HTTP_PORT/HTTPS_PORT/SOCKET_PORT`); UI `yarn --cwd proofofcombat-ui dev`.
- Codegen (GraphQL): `yarn --cwd proofofcombat-server generate` and `yarn --cwd proofofcombat-ui generate` after schema or `.graphql` changes.
- Tests: all `yarn test`; UI e2e `yarn --cwd proofofcombat-ui e2e` (run `yarn --cwd proofofcombat-ui playwright install` once).
- Bootstrap: `yarn agent:bootstrap` installs deps for server and UI and Playwright.

## Package Management
- Use Yarn Classic throughout. Never use npm.
- Always run commands within one of the two sub-projects (`proofofcombat-server/` or `proofofcombat-ui/`), not the root directory, unless using a root-level script like `yarn test`.

## Test Driven Bug Fixing
- When an issue is found, before fixing it, always create a failing unit test first.
- Once a failing test is created, fix the issue and re-run the test to ensure the fix worked.
- Creating the test first ensures the test actually checks what we think it does.

## Testing Guidelines
- Co-locate tests with code; name `*.test.ts[x]`. Never use `__tests__` directories.
- UI unit tests run in `jsdom` with `src/setupTests.ts`.
- E2E: select elements by `id` or `data-testid`; avoid timeouts—fix selectors or flow instead.
- All tests should be within their respective sub-project; there are no global tests.

## Coding Style & Naming
- 2-space indent, LF, UTF-8 (`.editorconfig`). TypeScript throughout; prefer kebab-case filenames (e.g., `artifact-selection-box.tsx`).
- Linting: server ESLint `@typescript-eslint`; UI `next/core-web-vitals`. Run `yarn --cwd <pkg> lint`.

## GraphQL Conventions
- UI: never inline `gql` tags; write queries in `.graphql` files and use generated hooks. Do not edit generated files (`types/graphql.ts` on server, `src/generated/graphql.tsx` on UI).
- After schema or `.graphql` changes, run `yarn generate` in both server and UI.
- Do not change codegen configuration (`codegen.yml`). Use the existing `yarn generate` scripts as-is.
- See the `graphql-change` and `add-ui-query` skills for detailed workflows.

## UI Conventions
- UI must remain static-exportable (no SSR). `yarn --cwd proofofcombat-ui build` creates static `out/`.
- Accessibility matters: we have blind players. Leverage Material UI for a11y, ensure screen reader support, use correct element semantics, consider header levels and tab order.

## Admin Code
- All admin endpoints live in `schema/admin/` and require `@auth @admin` decorators.
- Any testing functionality can be used to cheat — always treat it as admin-only.

## Commits & PRs
- Commits: short, imperative, optionally scoped (e.g., `server: refactor pathfinding`).
- PRs: clear description, linked issues, verification steps, and screenshots/GIFs for UI changes. Keep CI green (unit + e2e) and rerun codegen after schema changes.

### Git Commit Message Formatting
- Use real newlines, not literal `\n`: Git does not interpret `\n` inside a single `-m` as a newline. They appear literally in `git log`.
- Prefer multiple `-m` flags: `git commit -m "Title" -m "Body line 1" -m "Body line 2"`.
- Or use a heredoc/file for the body:
  - `git commit -F- <<'MSG'
    Title line
    
    - Bullet 1
    - Bullet 2
    MSG`
- Keep subject concise; body uses bullets for clarity.

## Security & Config
- Never commit secrets. Copy `.env.example` to `.env` in `proofofcombat-ui/`. Server loads env via `dotenv`; TLS (if used) from `privatekey.pem`/`certificate.pem`.

## Skills
Skills in `.cursor/skills/` provide detailed procedural workflows. Consult the relevant skill when performing these tasks:
- `graphql-change`: Making schema changes across server and UI
- `add-admin-resolver`: Adding admin-only resolvers
- `add-ui-query`: Adding new GraphQL operations in the UI
- `e2e-tests`: Writing and maintaining Playwright tests
- `e2e-triage`: Debugging failing E2E tests
- `commit-sequencing`: Preparing multi-commit changes
- `finalizing-changes`: Pre-commit checklist (tests, cleanup, a11y)
- `fix-codegen-drift`: Resolving generated types drift
- `static-export-troubleshooting`: Fixing Next.js export failures
- `ts-checks`: Running TypeScript checks reliably
- `ui-next-steps-onboarding`: Maintaining the Welcome onboarding card
- `upgrade-new-fields`: Adding fields to persisted models
