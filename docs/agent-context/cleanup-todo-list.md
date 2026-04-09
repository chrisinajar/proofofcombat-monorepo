# Cleanup backlog: dead, incomplete, or should-be-dead paths

Purpose: **actionable checklist** derived from **`docs/agent-context/`** (especially [rough-edges-and-incomplete-work.md](./rough-edges-and-incomplete-work.md) and [combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md)) plus targeted repo scans. Items are **not** ordered by priority unless noted — validate with tests (`yarn test`) before removing behavior. **Spelling of identifiers** in a row (e.g. `trippleCritical`) matches the repo **as of the last refresh**; rename/fix rows call that out explicitly.

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
| [x] | Remove **unused imports** (`calculate-damage.ts`: `EnchantmentType`, unused `getItemPassiveUpgradeTier`; `calculate-enchantment-damage.ts`: `AttackType`, `EnchantmentType`, `HeroClasses`, `attributesForAttack`; `fight.ts`: `EnchantmentType`; `monster.ts`: `CombatEntry`). | safe | Listed in [combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md). |
| [x] | Remove or use **dead locals** in `calculate-damage.ts` (`damage`, `baseDamageDecrease`; confirm whether `attackerDamageStat` / `victimReductionStat` are truly obsolete). | safe | Same file. |
| [x] | **Deduplicate `getItemPassiveUpgradeTier`** — single implementation (e.g. `item-helpers.ts`), delete duplicate in `helpers.ts`, fix imports. | verify | `calculations/units/unit.ts` imports `combat/item-helpers`. |
| [x] | Delete or repurpose **`createMonsterLuck`** in `monster.ts` (never called; live path uses `createLuck`). | verify | Remove dead curve or wire it if balance intent returns. |
| [x] | **`EnchantmentActivationOrder`** in `enchantment-order.ts` — unused anywhere; remove export or implement ordering. | verify | Only defined in `enchantment-order.ts` + docs; grep confirms no consumers. |
| [x] | Fix typo **`AttackCombcatantResult`** → `AttackCombatantResult` in `fight.ts` (or inline type). | safe | |
| [x] | **`isSecondAttack`** passed into `calculateOdds` / `calculateHit` but **not used** inside `calculateOdds` (hit chance ignores off-hand); either document as intentional API stability or stop threading it through hit path. Damage path still uses it via `getBaseDamage`. | product | See `combat/calculate-hit.ts`. |
| [x] | Reduce **triple `getEnchantedAttributes` / `enterCombat` per weapon swing** (hit + two damage paths) — perf/correctness surface; needs careful test pass. | product | [combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md). |
| [x] | Expose or drop **`trippleCritical`** from `calculateDamage` return + `attackCombatant` if UI/debug needs third tier. | product | Dropped unused local flag; third tier still applies to damage. Exposing a flag would need schema/product if the log should distinguish tiers. |
| [x] | Reconcile **`Combatant.damageReduction` flat field** vs **`attributes`** — flat value set on hero/monster, combat reads `attributes` path; consider removing flat field or wiring it. | verify | Removed vestigial flat field; combat already used `unit.stats` only. [combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md). |
| [x] | Audit **flattened `EnchantedCombatant` fields** (bonusAccuracy, lifesteal, …) — copied in `enchantCombatants`, minimal reads in `combat/`; confirm GraphQL/resolvers still need or trim. | verify | Removed duplicate flats; `EnchantedCombatant` is `Combatant`; reads use `unit.stats` (incl. `schema/hero/resolvers.ts` combatStats). |
| [x] | **`combat.test.ts` `getAverageDamage`** — doc that approximation ≠ nested crit ladder, or tighten test helper. | product | Expected crit mult: `(1-c)+c*(2+4d+12dt)` per nested ×2/×3/×3 in `calculateDamage`; JSDoc notes limits (variation only; no Blood flat). |

---

## B. Units / calculations (non-modifier pipeline)

| Done | Item | Tag | Notes |
|------|------|-----|--------|
| [x] | **`rangedSecondAttackChance`** on `Unit` base — comment says unused for combat; grep full repo, then remove or formalize. | verify | `calculations/units/unit.ts`. Removed: no code read or set this field; only defined in baseValues. |
| [x] | **`calculations/units/mob.ts`** commented `damageReduction` — align with monster combatant or delete hint. | safe | Deleted both commented blocks (old combatant shape + sample equipment); flat `damageReduction` already removed from `Combatant`. |
| [→ manual 2026-04-08] | Split or index **`calculations/modifiers/enchantments.ts`** when behavior stabilizes (size / maintainability). | product | [technical-debt-and-open-work.md](./technical-debt-and-open-work.md). |
| [x] | Review **`stat-steal-modifier.ts`** commented alternate formula. | product | Removed scratch formulas (line 68 fragment, line 80 old return) and trailing test comment; active formula well-documented and covered by 6 tests. |

---

## C. Schema: quests, world, items

| Done | Item | Tag | Notes |
|------|------|-----|--------|
| [x] | **Treasure / gossip** — implement or scope-down `checkHeroGossip` TODO (random map, dungeon loop); remove dev `console.log` when settled. | product | Scoped down: removed aspirational TODO + dev console.log + dead `getOrCreateQuestItem` call; documented current grant-one-map behavior. `schema/quests/treasure.ts`. |
| [→ manual 2026-04-08] | **`talk` mutation** — add player-facing text / onboarding (`///@TODO` in resolvers). | product | `schema/quests/resolvers.ts`. |
| [→ manual 2026-04-08] | **Meet the Queen** — prerequisite / Droop ordering (`meet-the-queen.ts`). | product | |
| [x] | **`resetVoid` cataclysm** — hook or remove TODO (`void-travel.ts`). | product | Removed undesigned TODO; fixed "catacalism" typo; void reset is self-contained. |
| [x] | **Washed up** — remove or gate **`// return hero;`** debug line (`washed-up.ts`). | safe | Removed commented-out early return in `checkInitialWashedUp`. |
| [x] | **Droop** — delete dead **`// const secret`** scaffolding (`droop.ts`). | safe | Removed two dead comment stubs (`// const secret`, `// const eastWest =`); live variables defined earlier in function. |
| [x] | **Aberration void reward** — commented cracked-orb → full-orb path; decide story + remove placeholder comment (`aberration-drops.ts`). | product | Story already implemented: essence-of-void + cracked-orb → orb-of-forbidden-power via Amixea (rebirth.ts). Removed superseded alt-design comments, dead `rebirth` import, and "lolololol" placeholder; added cross-ref comment. |
| [→ manual 2026-04-08] | **Staff of teleportation** — `checkTeleport` always `false`; implement quest lock or delete hook (`staff-of-teleportation.ts`, callers in `schema/locations/resolvers.ts`). | product | |
| [x] | **Water terrain drops** — implement or delete commented branch (`schema/monster/resolvers.ts`). | product | Deleted bare `// if (location.terrain === "water") {` stub (no body/logic); water combat already works via `challenges` query; terrain-specific drops can be added fresh if needed. |
| [x] | **Monk class** — implement `HeroClasses.Monk` or remove commented branch (`db/models/hero/classes.ts`). | product | Removed dead commented branch; unarmed heroes already fall through to Adventurer. `Monk` enum stays in schema (removing it would be a breaking change). Added co-located test coverage for `getBaseClass`/`getClass`. |
| [x] | **Aqua lung** — commented branch for magic bubble drop (`schema/quests/aqua-lung.ts`). | verify | No commented branch present; removed unused imports (`InventoryItem`, `HeroClasses`). File is clean. |
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
