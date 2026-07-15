# Project Overview
This is a game called "Proof of Combat", a browser-based RPG where players progressively become more powerful by defeating monsters and completing quests. The project consists of both the server-side game logic and the client-side user interface in a unified repository structure.

## Project Structure
- `proofofcombat-server/`: Server-side game logic and API
- `proofofcombat-ui/`: Client-side user interface

## Server
### Server Tech Stack
- Node.js & Express for server
- GraphQL API using Apollo Server
- GraphQL Code Generator for auto-generating types
- LevelDB for flat file database
- Single-threaded, single instance architecture

### Server Code Organization
- `schema/*`: GraphQL resolvers and API endpoints
  - `schema/admin/`: Admin-only resolvers requiring `@auth @admin` (see AGENTS.md "Admin Code")
  - `schema/quests/`: Game content and quest mechanics
  - `schema/quests/text/`: Quest dialogue and text content
- `calculations/`: Character and monster stat calculation system
- `combat/`: Combat mechanics implementation
- `constants/`: Game data and location information
- `types/graphql.ts`: Auto-generated GraphQL types — never edit by hand; regenerate after schema changes (see AGENTS.md "GraphQL Conventions")

## Client
### Client Tech Stack
- React & Next.JS
- Material UI & styled-components
- Apollo Client
- GraphQL Code Generator for auto-generating types and hooks

### Client Code Organization
- `src/` contains all app code
- `pages/` contains Next.js pages
- `public/` contains static assets
- `e2e/` contains Playwright tests

## See Also

- [docs/README.md](./README.md) — full documentation index
- [docs/agent-context/](./agent-context/README.md) — deep-dive server architecture: combat, stats, modifiers, persistence, cleanup tracking
- [docs/non-player-characters.md](./non-player-characters.md) — NPC roster and bartender personas
- [docs/day-night-cycles.md](./day-night-cycles.md) — timezone math and twilight behavior
- [docs/ui-architecture.md](./ui-architecture.md) — UI structure, data layer, and UX opportunities
- [docs/ui-quests-progress.md](./ui-quests-progress.md) — quest log semantics and onboarding integration
- [docs/design/npc-graal-the-unbroken.md](./design/npc-graal-the-unbroken.md) — Graal the Eternal Duelist design spec
