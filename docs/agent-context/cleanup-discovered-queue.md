# Discovered during cleanup (parked work)

When **[prompt-cleanup-one-item.md](./prompt-cleanup-one-item.md)** surfaces **unrelated** problems, **do not fix them in the same change**. Add a **one-line** entry here (or a short table row) so they can become future `cleanup-todo-list` items.

| Date | One-line finding | Suggested file(s) | Notes |
|------|------------------|-------------------|-------|
| 2026-04-04 | Stale audit: `fight.ts` section still claims unused `EnchantmentType` import; verify against current `combat/fight.ts`. | docs/agent-context/combat-runtime-and-consumption.md | |
| 2026-04-04 | `getEnchantedAttributes` import in `schema/items/resolvers.ts` still appears unused (re-grep before removing). | proofofcombat-server/schema/items/resolvers.ts | See cleanup-todo C unused-import row. |
| 2026-04-08 | Unused type imports `InventoryItem`, `MonsterInstance`, `Quest` in `treasure.ts` (pre-existing, not from gossip cleanup). | proofofcombat-server/schema/quests/treasure.ts | Safe to remove; vestiges of aspirational TODO. |
| 2026-04-08 | Unused imports `EnchantmentType`, `InventoryItem` in `meet-the-queen.ts`. | proofofcombat-server/schema/quests/meet-the-queen.ts | Safe to remove; neither type is referenced in the file body. |
| 2026-04-08 | Dev `console.log("checking skip drop!")` in `meet-the-queen.ts` line 34 (`checkSkipDrop`). | proofofcombat-server/schema/quests/meet-the-queen.ts | Low-priority; remove or gate behind debug flag. |
| 2026-04-08 | Dev `console.log` calls in `washed-up.ts` lines 100, 179, 236 (pub, dock, initial). | proofofcombat-server/schema/quests/washed-up.ts | Remove or gate behind debug flag; not part of the `// return hero;` cleanup row. |
| 2026-04-08 | Placeholder comment `// asdf asdf` in `movingMountainReward`. | proofofcombat-server/schema/monster/aberration-drops.ts (line ~86) | Safe to remove; meaningless dev note. |
| 2026-04-08 | Unused import `randomEnchantment` in `aberration-drops.ts`. | proofofcombat-server/schema/monster/aberration-drops.ts | Safe to remove; not referenced anywhere in the file body. |
| 2026-04-08 | Unused import `createHeroCombatant` in `schema/items/resolvers.ts`. | proofofcombat-server/schema/items/resolvers.ts | Safe to remove; imported from `../../combat/hero` but never called. |
| 2026-04-08 | **Bug:** `executeAltarBlessing` checks `altar-blessing-emerald` twice (lines ~305-316 duplicate lines ~292-303); `altar-blessing-sapphire` has no handler — sapphire blessings always fail. | proofofcombat-server/schema/locations/npc-shops.ts (`executeAltarBlessing`) | Second `altar-blessing-emerald` block should be `altar-blessing-sapphire` with `SapphireBlessing`. |
| 2026-04-08 | Unused import `heroLocationName` in `db/models/hero.ts`. | proofofcombat-server/db/models/hero.ts | Safe to remove; imported from helpers but never referenced. |
| 2026-04-08 | Multiple commented `console.log` lines in `db/models/hero.ts` (`getUnit` lines 97-98, `rollSkill` line 403, `get` lines 898-903). | proofofcombat-server/db/models/hero.ts | Debug artifacts; safe to remove. |
| 2026-04-08 | **Bug:** `delay` directive ban check is a no-op — `if (account.banned) { if (!context?.auth?.id) throw … }` but `context.auth.id` was already validated at line 34, so the inner throw never fires. Banned users can still take delayed actions. | proofofcombat-server/schema/directives/delay.ts (lines 40-44) | Should likely throw unconditionally inside `if (account.banned)`. |
| 2026-04-08 | Live `console.log` in `spawnRandomAberration`: `{ totalWeight, roll }` (line 30) and `"ABERRATION SPAWN EVENT!?"` (line 48) — noisy in production; consider removing or gating. | proofofcombat-server/schema/aberration.ts | Not dev timer constants; separate concern from the commented-out timer row. |

Periodically, promote rows into [cleanup-todo-list.md](./cleanup-todo-list.md) or drop them if obsolete.
