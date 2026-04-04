# Cleanup backlog: dead, incomplete, or should-be-dead paths

Purpose: **actionable checklist** derived from **`docs/agent-context/`** (especially [rough-edges-and-incomplete-work.md](./rough-edges-and-incomplete-work.md) and [combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md)) plus targeted repo scans. Items are **not** ordered by priority unless noted — validate with tests (`yarn test`) before removing behavior. **Spelling of identifiers** in a row (e.g. `trippleCritical`, `AttackCombcatantResult`) matches the repo **as of the last refresh**; rename/fix rows call that out explicitly.

**How to use:** Check boxes when done; add a short note or PR link in a trailing column if you keep this file updated. Re-scan periodically (`grep TODO`, `grep FIXME`, commented `// return` / `// if`).

**Automated iteration:** Use the copy-paste prompt in [prompt-cleanup-one-item.md](./prompt-cleanup-one-item.md) — **one row per run**, commit per row; if an agent cannot finish safely, it sets **Done** to `[→ manual YYYY-MM-DD]` and records the reason in [cleanup-manual-queue.md](./cleanup-manual-queue.md). Unrelated findings go to [cleanup-discovered-queue.md](./cleanup-discovered-queue.md).

---

## Legend

| Tag | Meaning |
|-----|---------|
| **safe** | Mostly mechanical (imports, dead functions, comments) — still run tests. |
| **verify** | Needs grep/tests to prove nothing external relies on it. |
| **product** | Requires design/copy/gameplay decision, not just deletion. |

---

## A. Combat layer (`proofofcombat-server/combat/`)

| Done | Item | Tag | Notes |
|------|------|-----|--------|
| [ ] | Remove **unused imports** (`calculate-damage.ts`: `EnchantmentType`, unused `getItemPassiveUpgradeTier`; `calculate-enchantment-damage.ts`: `AttackType`, `EnchantmentType`, `HeroClasses`, `attributesForAttack`; `fight.ts`: `EnchantmentType`; `monster.ts`: `CombatEntry`). | safe | Listed in [combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md). |
| [ ] | Remove or use **dead locals** in `calculate-damage.ts` (`damage`, `baseDamageDecrease`; confirm whether `attackerDamageStat` / `victimReductionStat` are truly obsolete). | safe | Same file. |
| [ ] | **Deduplicate `getItemPassiveUpgradeTier`** — single implementation (e.g. `item-helpers.ts`), delete duplicate in `helpers.ts`, fix imports. | verify | `calculations/units/unit.ts` imports `combat/item-helpers`. |
| [ ] | Delete or repurpose **`createMonsterLuck`** in `monster.ts` (never called; live path uses `createLuck`). | verify | Remove dead curve or wire it if balance intent returns. |
| [ ] | **`EnchantmentActivationOrder`** in `enchantment-order.ts` — unused anywhere; remove export or implement ordering. | verify | Only defined in `enchantment-order.ts` + docs; grep confirms no consumers. |
| [ ] | Fix typo **`AttackCombcatantResult`** → `AttackCombatantResult` in `fight.ts` (or inline type). | safe | |
| [ ] | **`isSecondAttack`** passed into `calculateOdds` / `calculateHit` but **not used** inside `calculateOdds` (hit chance ignores off-hand); either document as intentional API stability or stop threading it through hit path. Damage path still uses it via `getBaseDamage`. | product | See `combat/calculate-hit.ts`. |
| [ ] | Reduce **triple `getEnchantedAttributes` / `enterCombat` per weapon swing** (hit + two damage paths) — perf/correctness surface; needs careful test pass. | product | [combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md). |
| [ ] | Expose or drop **`trippleCritical`** from `calculateDamage` return + `attackCombatant` if UI/debug needs third tier. | product | Currently computed, not surfaced. |
| [ ] | Reconcile **`Combatant.damageReduction` flat field** vs **`attributes`** — flat value set on hero/monster, combat reads `attributes` path; consider removing flat field or wiring it. | verify | [combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md). |
| [ ] | Audit **flattened `EnchantedCombatant` fields** (bonusAccuracy, lifesteal, …) — copied in `enchantCombatants`, minimal reads in `combat/`; confirm GraphQL/resolvers still need or trim. | verify | |
| [ ] | **`combat.test.ts` `getAverageDamage`** — doc that approximation ≠ nested crit ladder, or tighten test helper. | product | |

---

## B. Units / calculations (non-modifier pipeline)

| Done | Item | Tag | Notes |
|------|------|-----|--------|
| [ ] | **`rangedSecondAttackChance`** on `Unit` base — comment says unused for combat; grep full repo, then remove or formalize. | verify | `calculations/units/unit.ts`. |
| [ ] | **`calculations/units/mob.ts`** commented `damageReduction` — align with monster combatant or delete hint. | safe | |
| [ ] | Split or index **`calculations/modifiers/enchantments.ts`** when behavior stabilizes (size / maintainability). | product | [technical-debt-and-open-work.md](./technical-debt-and-open-work.md). |
| [ ] | Review **`stat-steal-modifier.ts`** commented alternate formula. | product | May be intentional scratch work. |

---

## C. Schema: quests, world, items

| Done | Item | Tag | Notes |
|------|------|-----|--------|
| [ ] | **Treasure / gossip** — implement or scope-down `checkHeroGossip` TODO (random map, dungeon loop); remove dev `console.log` when settled. | product | `schema/quests/treasure.ts`. |
| [ ] | **`talk` mutation** — add player-facing text / onboarding (`///@TODO` in resolvers). | product | `schema/quests/resolvers.ts`. |
| [ ] | **Meet the Queen** — prerequisite / Droop ordering (`meet-the-queen.ts`). | product | |
| [ ] | **`resetVoid` cataclysm** — hook or remove TODO (`void-travel.ts`). | product | |
| [ ] | **Washed up** — remove or gate **`// return hero;`** debug line (`washed-up.ts`). | safe | |
| [ ] | **Droop** — delete dead **`// const secret`** scaffolding (`droop.ts`). | safe | |
| [ ] | **Aberration void reward** — commented cracked-orb → full-orb path; decide story + remove placeholder comment (`aberration-drops.ts`). | product | |
| [ ] | **Staff of teleportation** — `checkTeleport` always `false`; implement quest lock or delete hook (`staff-of-teleportation.ts`, callers in `schema/locations/resolvers.ts`). | product | |
| [ ] | **Water terrain drops** — implement or delete commented branch (`schema/monster/resolvers.ts`). | product | |
| [ ] | **Monk class** — implement `HeroClasses.Monk` or remove commented branch (`db/models/hero/classes.ts`). | product | |
| [ ] | **Aqua lung** — commented branch for magic bubble drop (`schema/quests/aqua-lung.ts`). | verify | |
| [ ] | **`schema/items/resolvers.ts`** — remove unused **`getEnchantedAttributes`** import if still unused. | safe | Re-grep before edit. |

---

## D. NPC trades and UX footguns

| Done | Item | Tag | Notes |
|------|------|-----|--------|
| [ ] | **`"not implemented"` responses** in `npc-shops.ts` — operational signal of **tradeId mismatch**; optional: structured error codes / logging to distinguish bug vs fallback. | product | [rough-edges-and-incomplete-work.md](./rough-edges-and-incomplete-work.md). |
| [ ] | **Quest enum vs `QuestLog` keys** — align naming or document map (e.g. `EssencePurification` ↔ `dailyPurification`). | product | Reduces agent/human confusion. |

---

## E. Persistence, DB, socket

| Done | Item | Tag | Notes |
|------|------|-----|--------|
| [ ] | **`db/models/hero.ts`** — remove stale **`///@TODO redo with modifiers`** and commented artifact health block **or** replace with a one-line “stats via `getUnit`” comment. | safe | |
| [ ] | **`db/models/trade-offers.ts`** — commented `upgrade`; confirm migrations elsewhere or implement. | verify | |
| [ ] | **`db/interface.ts`** — commented `create`; document pattern or remove. | safe | |
| [ ] | **Private chat** — `addChatMessage` commented in `socket/index.ts`; persist or document intentional omission. | product | |
| [ ] | **`schema/account/resolvers.ts`** — commented `account` fetch — dead path or WIP? | verify | |

---

## F. Aberration / roam / misc server

| Done | Item | Tag | Notes |
|------|------|-----|--------|
| [ ] | **`schema/aberration.ts`** — remove or isolate **dev timer** commented constants to a dev-only block. | safe | |
| [ ] | **`schema/monster/aberration-roam.ts`** — commented `handleAberrationSettlementBattle` follow-up. | product | |
| [ ] | **`db/models/player-location.ts`** — commented distance check — dead or future PvP/move validation? | verify | |
| [ ] | **`schema/locations/resolvers.ts`** — commented `return location.type === "altar"` (altar detection). | verify | |

---

## G. UI (`proofofcombat-ui`)

| Done | Item | Tag | Notes |
|------|------|-----|--------|
| [ ] | Replace **`(item as any).baseDamage` / `baseArmor`** in inventory UI with proper GraphQL types or narrowed helpers (`inventory-browser.tsx`, `equipment-slot.tsx`). | verify | [technical-debt-and-open-work.md](./technical-debt-and-open-work.md). |

---

## H. Copy and data completeness (low code, high player impact)

| Done | Item | Tag | Notes |
|------|------|-----|--------|
| [ ] | Fill **`quest-descriptions.ts`** for `Quest` enum values that still return **`""`** so quest panel isn’t blank for implemented quests. | product | [rough-edges-and-incomplete-work.md](./rough-edges-and-incomplete-work.md). |

---

## Cross-references

- Narrative / stub **glue**: [rough-edges-and-incomplete-work.md](./rough-edges-and-incomplete-work.md)
- **Combat-only** audit: [combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md)
- Lighter **TODO index**: [technical-debt-and-open-work.md](./technical-debt-and-open-work.md)

When this list goes stale, refresh with:

`rg 'TODO|FIXME' proofofcombat-server --glob '*.ts'`

and spot-check commented control flow in hot directories (`schema/`, `db/models/`, `combat/`).
