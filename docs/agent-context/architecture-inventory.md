# Architecture inventory (where things live)

Monorepo layout (high level):

- **`proofofcombat-server/`** — Game logic, GraphQL API, persistence (LevelDB), Socket.IO (see repo root `AGENTS.md`).
- **`proofofcombat-ui/`** — Next.js client, Apollo, static export constraints.

This document focuses on **server** areas tied to stats and combat.

## Core packages (server)

### `proofofcombat-server/calculations/`

The **unit / modifier / item** layer.

| Area | Path | Role |
|------|------|------|
| Units | `calculations/units/` | `Unit`, `Hero`, `Mob`, `Boss`, `Player` — construct modifiers, hold `equipment`, expose `stats` proxy. |
| Modifiers | `calculations/modifiers/` | `Modifier` base class; concrete modifiers (`BasicUnitModifier`, `BasicHeroModifier`, `GenericStatsModifier`, armor, stance, class, stat steal, parent container). |
| Items | `calculations/items/` | `InventoryItem`, `ArtifactItem`, base `Item` — register modifiers when equipment is applied. |

**Tests** are co-located (`*.test.ts`) per project rules — e.g. `calculations/units/unit.test.ts`, `calculations/units/base-damage-builtins.test.ts`.

### `proofofcombat-server/combat/`

Runtime **combat orchestration** and damage/hit math that consumes `Unit.stats` and combatant snapshots.

| File | Role |
|------|------|
| `fight.ts` | Time-stepped fight: attack cadence, enchantment interval ticks, mesmerize/focus hooks, accumulates damage/heal into `CombatResult`. |
| `calculate-hit.ts` | Hit chance from `attackRating` vs `evasionRating` via `maths.calculateHitChance`. |
| `calculate-damage.ts` | `calculateDamageValues` / `calculateDamage` — base damage, armor, crits, amplification, conversion, resistances. |
| `calculate-enchantment-damage.ts` | Periodic “enchantment” damage/heal based on `enchantmentDamage` / `enchantmentLeech` / `enchantmentHeal` style stats and constitution. |
| `enchantments.ts` (combat) | `getEnchantedAttributes` / `enchantCombatants` — calls `unit.enterCombat`, then copies `unit.stats` into `Combatant` fields used by combat. |
| `enchantments.ts` (calculations) | **Different file** — enchantment → `GenericStatsModifier` definitions (see `calculations/modifiers/enchantments.ts`). |

### `proofofcombat-server/schema/`

GraphQL schema, resolvers, and gameplay content. Notable for stats:

- `schema/hero/` — `combatStats` and related fields; `baseDamage` / `secondAttackBaseDamage` come from resolver logic that builds a `Hero` unit and reads `unit.getBaseDamage`.
- `schema/items/` — Item definitions, built-ins (`item-built-ins.ts`), helpers like `weaponDamageWithBuiltIns`, `computeBaseWeaponDamage`.

### `proofofcombat-server/db/models/`

Persistence and upgrade paths for `Hero` and related records. **Important:** `persistedModifiers` and `upgrade()` behavior interact with the modifier system.

### `proofofcombat-server/types/graphql.ts`

Generated GraphQL types — **never edit by hand**; regenerate after schema changes.

## UI touchpoints (minimal)

- `proofofcombat-ui/src/game/combat-stats.tsx` displays `baseDamage` / `secondAttackBaseDamage` from GraphQL.
- `proofofcombat-ui/src/me.graphql` (and related) queries `baseDamage` on combat stats.
- Inventory UI may mirror or approximate weapon damage via helpers — **server remains authoritative** for combat.

## Entry points for “how does combat run?”

1. **Build combatants** — functions in `combat/hero.ts`, `combat/monster.ts`, `combat/fight-hero.ts` / `fight-monster.ts` (see `combat/index.ts` exports).
2. **Run a fight** — `executeFight` in `combat/fight.ts`.
3. **Per hit** — `calculateHit` then `calculateDamage` (and enchantment tick path separately).

## Cross-cutting concerns

- **Tests:** `combat/combat.test.ts` is large and scenario-based; smaller files focus on damage math (`calculate-damage-*.test.ts`).
- **Math utilities:** `proofofcombat-server/maths/` — rating/hit chance helpers.
