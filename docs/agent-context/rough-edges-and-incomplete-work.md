# Rough edges, dead ends, and incomplete migrations

Purpose: **contextual glue** — where the surprising bits live, not a line-by-line reading of self-explanatory code. Use this when something “should” work but feels stubby, or when enums and UX disagree.

For a **single checklist** you can tick off while cleaning, see **[cleanup-todo-list.md](./cleanup-todo-list.md)** (aggregates this file, combat-runtime notes, and scans).

---

## Quests: schema vs copy vs wiring

**Enum vs `QuestLog` field names**

- GraphQL `Quest` enum: `proofofcombat-server/schema/quests/type.ts`
- Progress storage on `QuestLog`: same file — keys like `droop`, `clockwork`, `dailyPurification` **do not** always match the enum spelling (e.g. `Quest.EssencePurification` drives **`dailyPurification`** progress in `npc-shops.ts` transcendence purification trade). When searching, grep **both** the enum value and the quest log field name.

**Quest description strings (`Query.quest`)**

- Source: `proofofcombat-server/schema/quests/text/quest-descriptions.ts`
- Only a **subset** of `Quest` enum values have non-empty copy; the rest fall back to **`""`**. The UI (`proofofcombat-ui/src/game/quest-log/quest.tsx`) renders `questDescription.description` — **empty string means a blank description** in the quest panel even if the quest is fully implemented in logic.

**`talk` mutation — design debt, not missing resolver**

- Implementation: `proofofcombat-server/schema/quests/resolvers.ts` — the block comment above `talk` is an explicit **TODO / venting** about better onboarding text and possibly tying events to bartender interaction. Behavior is real (tavern check, gossip gating on `tasteForBusiness` finished); the gap is **player-facing guidance**, not a dead code path.

**Treasure map / gossip — partial design, minimal implementation**

- `checkHeroGossip` in `proofofcombat-server/schema/quests/treasure.ts` has a **large block TODO** (random map on gossip, dungeon reward loop, repeatability). Current behavior: **if the hero has no treasure map item, grant one** (with a dev `console.log` of the granted item). `readMap` mutation is implemented in the same resolver file.

**Meet the Queen — known gap called out in code**

- `proofofcombat-server/schema/quests/meet-the-queen.ts` — comment **“probably needs to find droop first at this code path”** marks a branch that may fire without the intended prerequisite story order.

**Washed up — commented early return**

- `checkInitialWashedUp` in `proofofcombat-server/schema/quests/washed-up.ts` contains **`// return hero;`** at the start of a function — likely a **debug toggle** left in; the real logic runs when that line stays commented.

**Droop — abandoned comment stub**

- `proofofcombat-server/schema/quests/droop.ts` — trailing **`// const secret`** / **`// const eastWest =`** after `setQuestLogProgress`: dead comment scaffolding, not active logic.

**Void / “cataclysm” — TODO after reset**

- `proofofcombat-server/schema/void-travel.ts` — `resetVoid` clears void monsters and kicks heroes to default map; ends with **`///@TODO trigger cataclysm event`**. No event hook is wired; **narrative/system follow-through is absent**.

**Aberration first-void kill — orb storyline commented out**

- `proofofcombat-server/schema/monster/aberration-drops.ts` — `genericAberrationReward` (void monster) has a **commented block** that would swap cracked orb → full orb; live path gives **essence-of-void** and optional global notification if player still has cracked orb. Placeholder “lololol” comment in file.

---

## NPC trades: `"not implemented"` messages

**File:** `proofofcombat-server/schema/locations/npc-shops.ts`

These strings are mostly **fallbacks when `tradeId` does not match a known branch**, not unused code:

- Top-level `executeNpcTrade`: unknown `tradeId` prefix → `"not implemented"`.
- Per-vendor executors (`executeAltarBlessing`, `executeTranscendenceTrade`, `executeAmixeaTrade`, `executeTrimarimTrade`, `executeNaxxremisTrade`): final return when **no `if` matched** — means **client sent or constructed an id the server does not handle** (or a bug added a shop row without a handler).
- `executeTrimarimTrade`: `TrimarimTrades[tradeId]` missing → same message.
- `executeDomariTrade`: unknown id → ``Trade not implemented: ${tradeId}``; if `aberration` were null after costs paid → `"not implemented"` (defensive; normally `domariAberration-1` is populated).

**Implication for debugging:** seeing this message usually means **trade list / UI id mismatch**, not that the whole NPC is unimplemented.

---

## Combat pipeline: subtle leftovers

**Details (imports, dead locals, `Combatant` fields, duplicate helpers):** see **[combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md)** — that file is the full audit of the **`combat/`** layer only.

**Summary:** third crit tier affects damage but is not returned to `attackCombatant`; **`getEnchantedAttributes` / `enterCombat`** can run **three times per hit** (hit + two damage paths).

---

## World / class stubs

**Monk class**

- `proofofcombat-server/db/models/hero/classes.ts` — “no monks yet” with **`// return HeroClasses.Monk;`** commented under unarmed branch. **Unarmed** heroes fall through to other rules; no `Monk` class in live selection.

**Water terrain drop branch**

- `proofofcombat-server/schema/monster/resolvers.ts` — **`// if (location.terrain === "water") {`** left next to victory/drop logic. **Water-specific drop behavior is not active** (comment only).

**Staff of teleportation hook**

- `proofofcombat-server/schema/quests/staff-of-teleportation.ts` — **`checkTeleport` always returns `false`** (comment: “return true to prevent teleport”). Wired from `schema/locations/resolvers.ts` (~line 1588). **Hook exists for future quest locks**; nothing blocks teleport today.

---

## Socket / chat persistence

**File:** `proofofcombat-server/socket/index.ts`

- Private message handler has **`addChatMessage` commented out** and broadcast stubbed; live path **emits to sockets** and `console.log`s. **Persistent chat history** (if any) is not updated on this path — check wherever `getChatCache` is fed.

---

## Database layer

**`DatabaseInterface.create`**

- `proofofcombat-server/db/interface.ts` — **`create` with uuid is commented**; models use other patterns. Don’t assume a generic `create` API.

**Trade offers `upgrade`**

- `proofofcombat-server/db/models/trade-offers.ts` — entire **`upgrade` method commented**; if trade schema evolved, migration may be **elsewhere or absent**.

---

## Aberration tuning (dev vs prod times)

**File:** `proofofcombat-server/schema/aberration.ts`

- **Commented** alternate `minSpawnTime` / `maxSpawnTime` / `idealSpawnTime` next to live constants — quick **dev speed-up toggles**, not dead code.

---

## Hero model / rebalance TODO

**File:** `proofofcombat-server/db/models/hero.ts`

- `recalculateStats`: **`///@TODO redo with modifiers`** above a **fully commented** artifact health block — the **live** max health comes from **`getUnit` → `unit.stats.health`**. The TODO is **stale relative to current architecture**; treat as **reminder not to resurrect inline artifact math** without going through units.

- Other commented lines in same file (e.g. stance list, `recalculateStats` return) are **old paths** kept as hints — verify before deleting.

---

## How to extend this document

When you find a new stub: add **one line** with **file path + what’s missing**, avoid duplicating what `grep TODO` already lists unless there’s **non-obvious behavior** (like fallthrough `"not implemented"` being a routing mismatch).
