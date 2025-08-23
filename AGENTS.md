# Repository Guidelines

## Runbooks First
- Always consult runbooks before making changes: open `docs/runbooks/` (authoritative) or `.cursor/rules/` (synced copies) and identify the 1–3 most relevant runbooks by topic or file globs.
- Start with the index: see `docs/runbooks/index.md` for a concise list of all runbooks with summaries and when to use them.
  - From the index, choose 1–3 runbooks whose globs/area/owner match your change.
- During planning, add a step to consult runbooks and name which ones you used (by `id`/filename). If none apply, state that explicitly.
- When answering or implementing, reference runbooks by `id` (e.g., `e2e-tests`, `graphql-change`) and follow their checklists. If a runbook contradicts a general guideline, prefer the runbook.
- Keep runbooks in sync: run `yarn agent:runbook:sync` after editing or adding runbooks; run `yarn agent:check` to verify there’s no drift.
- When you discover a new repeatable workflow or gotcha, create or update a runbook with `yarn agent:runbook:new <id> "Title"`, then sync.


## Project Structure
- `proofofcombat-server`: Apollo GraphQL + Express + Socket.IO (TypeScript). Tests sit next to code (`*.test.ts`). Admin-only resolvers live in `schema/admin/` and require `@auth @admin`.
- `proofofcombat-ui`: Next.js app with Apollo Client. UI code in `src/`, pages in `pages/`, static assets in `public/`. Playwright e2e tests in `e2e/`.
- Root `jest.config.js` orchestrates both packages; CI runs e2e on PRs.

## Build, Test, Dev
- Node: `nvm use 20.11.0` (Yarn Classic).
- Install: `yarn --cwd proofofcombat-server install` and `yarn --cwd proofofcombat-ui install`.
- Dev: server `yarn --cwd proofofcombat-server dev` (uses `HTTP_PORT/HTTPS_PORT/SOCKET_PORT`); UI `yarn --cwd proofofcombat-ui dev`.
- Codegen (GraphQL): `yarn --cwd proofofcombat-server generate` and `yarn --cwd proofofcombat-ui generate` after schema or `.graphql` changes.
- Tests: all `yarn test`; UI e2e `yarn --cwd proofofcombat-ui e2e` (run `yarn --cwd proofofcombat-ui playwright install` once).

## Test Driven Bug Fixing
 - When an issue is found, before fixing it, always create a failing unit test first
 - Once a failing unit is created, fix the issue and then re-run the test to ensure that the fix worked
 - Creating the test first makes it so that we're also ensuring that the unit test checks what we think it does

## Coding Style & Naming
- 2-space indent, LF, UTF‑8 (`.editorconfig`). TypeScript throughout; prefer kebab-case filenames (e.g., `artifact-selection-box.tsx`).
- Linting: server ESLint `@typescript-eslint`; UI `next/core-web-vitals`. Run `yarn --cwd <pkg> lint`.

## GraphQL & UI Conventions
- UI: never inline `gql` tags; write queries in `.graphql` files and use generated hooks. Do not edit generated files.
- UI must remain static-exportable (no SSR). `yarn --cwd proofofcombat-ui build` creates static `out/`.

## Testing Guidelines
- Co-locate tests with code; name `*.test.ts[x]`.
- UI unit tests run in `jsdom` with `src/setupTests.ts`.
- E2E: select elements by `id` or `data-testid`; avoid timeouts—fix selectors or flow instead.

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
- Avoid shell-escaped artifacts: don’t wrap the entire message with quotes that include escaped sequences (e.g., `\n`, `\t`).
- Keep subject concise; body uses bullets for clarity. Example:
  - `git commit -m "server: dynamic delay override" -m "- delay directive: persist final delay" -m "- account fields prefer context delay"`

## Security & Config
- Never commit secrets. Copy `.env.example` to `.env` in `proofofcombat-ui/`. Server loads env via `dotenv`; TLS (if used) from `privatekey.pem`/`certificate.pem`.

## Agent Quickstart
- `yarn agent:bootstrap`: install deps for server and UI; install Playwright.
- `yarn agent:status`: show environment, install status, and runbook drift.
- `yarn agent:runbook:sync`: sync `docs/runbooks` to `.cursor/rules`.
- `yarn agent:runbook:new <id> "Title"`: scaffold a new runbook.
- `yarn agent:check`: guardrails (no inline gql), runbook drift check, codegen drift.

Runbooks live in `docs/runbooks/` with YAML frontmatter. Update runbooks whenever you discover a gotcha; then run `yarn agent:runbook:sync` to keep `.cursor/rules` aligned.
