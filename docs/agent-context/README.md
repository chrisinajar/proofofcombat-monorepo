# Agent context: Proof of Combat

This folder is **standalone documentation** for engineers and AI coding agents who need to work on the repo **without** prior conversation history. It describes the **current** server-side combat/stat architecture, how it got here at a high level, known gaps, and where to look in the tree.

## How to use this folder

1. Start with **evolution-and-refactors.md** for narrative context (why things look the way they do).
2. Read **architecture-inventory.md** for a map of directories and responsibilities.
3. For implementation detail, use **units-modifiers-and-stats.md** and **combat-damage-and-enchantments.md**.
4. Before changing persisted heroes or GraphQL, read **persistence-graphql-and-ui.md** and **technical-debt-and-open-work.md**.
5. When something feels half-finished (quests, NPCs, void), read **rough-edges-and-incomplete-work.md** first — it points at files where behavior and copy diverge.
6. When changing **`proofofcombat-server/combat/`** (hits, damage, `Combatant` snapshots), read **combat-runtime-and-consumption.md** — it lists which fields are lies, dead imports, and how often `enterCombat` runs per swing.
7. For a **checklist of cleanup targets** (dead code, stubs, tech debt), use **cleanup-todo-list.md** — it aggregates findings from the other agent-context docs plus scans; keep it updated as work completes.
8. To **run agents against that checklist** safely (one item per commit, bailout → manual queue), use **prompt-cleanup-one-item.md** and the companion queues **cleanup-manual-queue.md** / **cleanup-discovered-queue.md**.

## Relationship to other docs

- Authoritative procedural docs live in `docs/runbooks/` (see `docs/runbooks/index.md`). After edits, `yarn agent:runbook:sync` copies them into **`.cursor/skills/`** as Cursor Agent Skills (generated files — edit runbooks, not `SKILL.md` directly). This folder is **descriptive** (what the code does), not procedural (how to change GraphQL safely).
- The runbook `project-description` gives a short project overview; this folder goes deeper on combat and calculations.

## Scope

- **In scope**: `proofofcombat-server` calculations (`calculations/`), combat (`combat/`), related schema/resolvers, and high-signal UI touchpoints.
- **Out of scope**: Quest narrative text, admin tooling details, full UI component inventory (only references where stats surface).

## Document list

| File | Contents |
|------|----------|
| [evolution-and-refactors.md](./evolution-and-refactors.md) | Three eras of design (hard-coded → units/modifiers → additive stacking + new damage). |
| [architecture-inventory.md](./architecture-inventory.md) | Directory map, main entry points, test locations. |
| [units-modifiers-and-stats.md](./units-modifiers-and-stats.md) | `Unit`, `Modifier`, stat pipeline, additive vs multiplicative paths. |
| [combat-damage-and-enchantments.md](./combat-damage-and-enchantments.md) | Fight loop, base damage, hits, weapon damage, DoT-style enchantment damage. |
| [persistence-graphql-and-ui.md](./persistence-graphql-and-ui.md) | Heroes, persisted modifiers, GraphQL fields consumers care about. |
| [technical-debt-and-open-work.md](./technical-debt-and-open-work.md) | TODOs, ironic comments, likely cleanup targets. |
| [rough-edges-and-incomplete-work.md](./rough-edges-and-incomplete-work.md) | Dead ends, partial migrations, quest/NPC stubs — **glue** for non-obvious behavior. |
| [combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md) | Combat layer (`combat/`) only: what it reads from units, stale `Combatant` fields, dead helpers/imports, double `enterCombat`. |
| [glossary-and-conventions.md](./glossary-and-conventions.md) | Terms and naming patterns used across the code. |
| [cleanup-todo-list.md](./cleanup-todo-list.md) | Actionable backlog: incomplete quests, combat dead code, DB/socket stubs, UI `as any` — checkboxes + file pointers. |
| [prompt-cleanup-one-item.md](./prompt-cleanup-one-item.md) | **Reusable agent prompt:** one todo per iteration, bailout rules, commit discipline, links to manual/discovered queues. |
| [cleanup-manual-queue.md](./cleanup-manual-queue.md) | Items deferred from the main list (ambiguous / needs human). |
| [cleanup-discovered-queue.md](./cleanup-discovered-queue.md) | Unrelated findings parked during cleanup (no scope creep). |
