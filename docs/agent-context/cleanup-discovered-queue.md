# Discovered during cleanup (parked work)

When **[prompt-cleanup-one-item.md](./prompt-cleanup-one-item.md)** surfaces **unrelated** problems, **do not fix them in the same change**. Add a **one-line** entry here (or a short table row) so they can become future `cleanup-todo-list` items.

## Still open

| Date | One-line finding | Suggested file(s) | Notes |
|------|------------------|-------------------|-------|
| 2026-04-08 | Unused import `createHeroCombatant` in `schema/items/resolvers.ts`. | proofofcombat-server/schema/items/resolvers.ts | Safe to remove; imported from `../../combat/hero` but never called. |
| 2026-04-08 | Unused import `heroLocationName` in `db/models/hero.ts`. | proofofcombat-server/db/models/hero.ts | Safe to remove; imported from helpers but never referenced. |
| 2026-04-08 | Dev `console.log("checking skip drop!")` in `meet-the-queen.ts` line 34 (`checkSkipDrop`). | proofofcombat-server/schema/quests/meet-the-queen.ts | Low-priority; remove or gate behind debug flag. |
| 2026-04-08 | Dev `console.log` calls in `washed-up.ts` (3 occurrences). | proofofcombat-server/schema/quests/washed-up.ts | Remove or gate behind debug flag. |
| 2026-04-08 | Placeholder comment `// asdf asdf` in `movingMountainReward`. | proofofcombat-server/schema/monster/aberration-drops.ts (line ~87) | Safe to remove; meaningless dev note. |
| 2026-04-08 | Multiple commented `console.log` lines in `db/models/hero.ts` (4 occurrences). | proofofcombat-server/db/models/hero.ts | Debug artifacts; safe to remove. |
| 2026-04-08 | **Bug:** `delay` directive ban check is a no-op — `if (account.banned) { if (!context?.auth?.id) throw … }` but `context.auth.id` was already validated at line 34, so the inner throw never fires. Banned users can still take delayed actions. | proofofcombat-server/schema/directives/delay.ts (lines 40-44) | Should likely throw unconditionally inside `if (account.banned)`. |
| 2026-04-08 | Live `console.log` in `spawnRandomAberration`: `{ totalWeight, roll }` (line 30) and `"ABERRATION SPAWN EVENT!?"` (line 48) — noisy in production; consider removing or gating. | proofofcombat-server/schema/aberration.ts | Not dev timer constants; separate concern from the commented-out timer row. |

## Resolved

| Date | One-line finding | Resolution |
|------|------------------|------------|
| 2026-04-04 | Stale audit: `fight.ts` section still claims unused `EnchantmentType` import. | Resolved — import was removed during cleanup. Doc updated. |
| 2026-04-04 | `getEnchantedAttributes` import in `schema/items/resolvers.ts` still appears unused. | Resolved — import removed. |
| 2026-04-08 | Unused type imports `InventoryItem`, `MonsterInstance`, `Quest` in `treasure.ts`. | Resolved — imports removed during gossip cleanup. |
| 2026-04-08 | Unused imports `EnchantmentType`, `InventoryItem` in `meet-the-queen.ts`. | Resolved — imports removed. |
| 2026-04-08 | Unused import `randomEnchantment` in `aberration-drops.ts`. | Resolved — import removed during aberration cleanup. |
| 2026-04-08 | **Bug:** `executeAltarBlessing` checks `altar-blessing-emerald` twice; sapphire has no handler. | Resolved — second emerald block corrected to sapphire. |

---

Periodically, promote "Still open" rows into [cleanup-todo-list.md](./cleanup-todo-list.md) or drop them if obsolete.
