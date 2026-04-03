# Persistence, GraphQL, and UI

## Hero persistence (`db/models/hero.ts`)

- Heroes are stored in LevelDB; **`upgrade()`** migrates older records when new fields appear (see runbook **`upgrade-new-fields`** in `docs/runbooks/index.md`).
- **`persistedModifiers`** — populated from **`heroUnit.getPersistentModifiers()`** when saving. These mirror modifier definitions that opt into **`isPersistent()`** on the unit modifier instances.
- **`recalculateStats`** rebuilds a **`Hero` unit** via **`getUnit`**, then writes **`combat.maxHealth`** from **`heroUnit.stats.health`**, preserving **health percentage** where applicable.

### Notable TODO

The model contains a **`///@TODO redo with modifiers`** near commented artifact buff logic in **`recalculateStats`**. Artifact power is **not** supposed to be reimplemented there — the **unit pipeline** should remain authoritative. Treat this TODO as **historical scaffolding**, not a directive to duplicate logic.

## GraphQL: combat-relevant fields

- **`Hero` combat stats** (see `schema/hero/type.ts` and resolvers) expose computed values including **`baseDamage`**, **`secondAttackBaseDamage`**, resistances, ratings, amplification, etc.
- Resolver implementation builds a **`Hero` unit** (`calculations/units/hero.ts`) and reads **`unit.stats`** / **`getBaseDamage`**.

**After schema changes:** run server + UI codegen (`yarn --cwd proofofcombat-server generate`, `yarn --cwd proofofcombat-ui generate`) per **`always-generate-graphql-types`** runbook.

## UI consumption

- **`proofofcombat-ui/src/game/combat-stats.tsx`** — primary player-facing display of **`baseDamage`** and optional second-attack value.
- **`.graphql` files** under `src/` declare operations; **never** inline `gql` in components (runbook **`never-use-inline-graphql`**).

## Static export constraint

The UI must remain **static-exportable** — no accidental SSR-only APIs. Combat stats pages should keep using client GraphQL as elsewhere.
