# Documentation Index

This folder contains reference documentation for the Proof of Combat project. For procedural workflows (how to change GraphQL, run tests, etc.), see `.cursor/skills/`. For repo conventions and build commands, see `AGENTS.md`.

## Game Reference

| Document | Description |
|----------|-------------|
| [project-description.md](./project-description.md) | Project overview, tech stack, and code organization. |
| [non-player-characters.md](./non-player-characters.md) | NPC roster, roles, and bartender personas. |
| [day-night-cycles.md](./day-night-cycles.md) | Timezone math, twilight behavior, and testing guidance. |
| [ui-quests-progress.md](./ui-quests-progress.md) | Quest log semantics, rebirth detection, and onboarding integration. |

## Technical Architecture

| Document | Description |
|----------|-------------|
| [ui-architecture.md](./ui-architecture.md) | UI structure, data layer, feature modules, theming, and UX opportunities. |
| [agent-context/](./agent-context/README.md) | Deep-dive server docs: combat, stats, modifiers, persistence, and cleanup tracking. |

## Design

| Document | Description |
|----------|-------------|
| [design/npc-graal-the-unbroken.md](./design/npc-graal-the-unbroken.md) | Graal the Eternal Duelist — late-game NPC design spec. |

## Server-Side Reference

These live inside `proofofcombat-server/docs/` alongside the code they document.

| Document | Description |
|----------|-------------|
| [../proofofcombat-server/docs/quest-text.md](../proofofcombat-server/docs/quest-text.md) | Quest dialogue and narrative text (all quests). |
| [../proofofcombat-server/docs/bartender-advice.md](../proofofcombat-server/docs/bartender-advice.md) | Generated reference of bartender advice rules and persona lines. |
