# Rough edges, dead ends, and incomplete migrations

Purpose: **contextual glue** — where the surprising bits live, not a line-by-line reading of self-explanatory code. Use this when something "should" work but feels stubby, or when enums and UX disagree.

For a **single checklist** you can tick off while cleaning, see **[cleanup-todo-list.md](./cleanup-todo-list.md)** (aggregates this file, combat-runtime notes, and scans).

---

## Quests: schema vs copy vs wiring

**`talk` mutation — design debt, not missing resolver**

- Implementation: `proofofcombat-server/schema/quests/resolvers.ts` — the block comment above `talk` is an explicit **TODO / venting** about better onboarding text and possibly tying events to bartender interaction. Behavior is real (tavern check, gossip gating on `tasteForBusiness` finished); the gap is **player-facing guidance**, not a dead code path.

**Treasure map / gossip — partial design, minimal implementation**

- `checkHeroGossip` in `proofofcombat-server/schema/quests/treasure.ts` — current behavior: **if the hero has no treasure map item, grant one**. `readMap` mutation is implemented in the same resolver file. The aspirational TODO (random map, dungeon loop, repeatability) and dev `console.log` were removed; current behavior is documented.

**Meet the Queen — known gap called out in code**

- `proofofcombat-server/schema/quests/meet-the-queen.ts` — comment **"probably needs to find droop first at this code path"** marks a branch that may fire without the intended prerequisite story order.

---

## World / class stubs

**Staff of teleportation hook**

- `proofofcombat-server/schema/quests/staff-of-teleportation.ts` — **`checkTeleport` always returns `false`** (comment: "return true to prevent teleport"). Wired from `schema/locations/resolvers.ts` (~line 1588). **Hook exists for future quest locks**; nothing blocks teleport today.

---

## Combat pipeline

**Details:** see **[combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md)** — that file is the full audit of the **`combat/`** layer only.

**Active concern:** **`getEnchantedAttributes` / `enterCombat`** can run **twice per hit** (hit + damage). Merging would need API threading and broader tests.

---

## How to extend this document

When you find a new stub: add **one line** with **file path + what's missing**, avoid duplicating what `grep TODO` already lists unless there's **non-obvious behavior** (like fallthrough `"not implemented"` being a routing mismatch).

---

## Resolved (archived)

Items below were identified in earlier audits and have since been cleaned up. Kept here for historical context.

**Quests:**
- **Enum vs `QuestLog` field names** mismatch (e.g. `Quest.EssencePurification` → `dailyPurification`) — resolved via `QUEST_LOG_FIELD` canonical map in `helpers.ts`; `setQuestLogProgress` now derives the field from the quest enum.
- **Quest description strings** — empty descriptions for implemented quests (DroopsQuest, TavernChampion, MinorClassUpgrades, MeetTheQueen, EssencePurification) — filled in; co-located test enforces completeness.
- **Washed up commented early return** (`// return hero;` in `checkInitialWashedUp`) — removed.
- **Droop dead comment scaffolding** (`// const secret`, `// const eastWest =`) — removed.
- **Void / "cataclysm" TODO** (`///@TODO trigger cataclysm event` in `void-travel.ts`) — removed; void reset is self-contained.
- **Aberration void reward** commented cracked-orb → full-orb path and "lolololol" placeholder — removed; story already implemented via essence-of-void + cracked-orb → orb-of-forbidden-power through Amixea.

**NPC trades:**
- **`"not implemented"` fallback messages** in `npc-shops.ts` — replaced with `unrecognizedTradeResult` helper providing `console.warn` with tradeId + vendor context and descriptive player-facing message.

**World / class stubs:**
- **Monk class** commented `// return HeroClasses.Monk;` branch — removed; unarmed heroes fall through to Adventurer. `Monk` enum stays in schema.
- **Water terrain drop branch** (`// if (location.terrain === "water") {` stub) — deleted; water combat works via `challenges` query.

**Socket / chat / DB:**
- **Private chat `addChatMessage`** commented in `socket/index.ts` — documented as intentional omission (global ring buffer would leak private messages); dead call removed.
- **`DatabaseInterface.create`** with uuid commented in `db/interface.ts` — removed; ID generation happens at call sites.
- **`db/models/trade-offers.ts` commented `upgrade`** — removed; was copy-pasted stub from `system.ts` for a field TradeOffer never had.

**Hero model:**
- **`///@TODO redo with modifiers`** and 22-line commented artifact health block in `db/models/hero.ts` — removed; one-line note left confirming stats come via `getUnit`.

**Aberration:**
- **Dev timer** commented constants in `schema/aberration.ts` — removed.
- **`handleAberrationSettlementBattle`** dead function and no-op settlement checks in `aberration-roam.ts` — removed.
