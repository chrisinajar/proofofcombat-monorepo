# Discovered during cleanup (parked work)

When **[prompt-cleanup-one-item.md](./prompt-cleanup-one-item.md)** surfaces **unrelated** problems, **do not fix them in the same change**. Add a **one-line** entry here (or a short table row) so they can become future `cleanup-todo-list` items.

## Still open

(No items — queue is empty.)

## Resolved

| Date | One-line finding | Resolution |
|------|------------------|------------|
| 2026-04-04 | Stale audit: `fight.ts` section still claims unused `EnchantmentType` import. | Resolved — import was removed during cleanup. Doc updated. |
| 2026-04-04 | `getEnchantedAttributes` import in `schema/items/resolvers.ts` still appears unused. | Resolved — import removed. |
| 2026-04-08 | Unused type imports `InventoryItem`, `MonsterInstance`, `Quest` in `treasure.ts`. | Resolved — imports removed during gossip cleanup. |
| 2026-04-08 | Unused imports `EnchantmentType`, `InventoryItem` in `meet-the-queen.ts`. | Resolved — imports removed. |
| 2026-04-08 | Unused import `randomEnchantment` in `aberration-drops.ts`. | Resolved — import removed during aberration cleanup. |
| 2026-04-08 | **Bug:** `executeAltarBlessing` checks `altar-blessing-emerald` twice; sapphire has no handler. | Resolved — second emerald block corrected to sapphire. |
| 2026-07-15 | Unused import `createHeroCombatant` in `schema/items/resolvers.ts`. | Resolved — import removed. |
| 2026-07-15 | Unused import `heroLocationName` in `db/models/hero.ts`. | Resolved — import removed. |
| 2026-07-15 | Dev `console.log("checking skip drop!")` in `meet-the-queen.ts`. | Resolved — removed (also removed second dev log at line 178). |
| 2026-07-15 | Dev `console.log` calls in `washed-up.ts` (3 occurrences). | Resolved — all 3 removed. |
| 2026-07-15 | Placeholder comment `// asdf asdf` in `movingMountainReward`. | Resolved — removed from `aberration-drops.ts`. |
| 2026-07-15 | Multiple commented/live `console.log` lines in `db/models/hero.ts` (4 occurrences). | Resolved — all 4 removed (2 commented in `getUnit`, 1 commented + 1 live in `rollSkill`). |
| 2026-07-15 | Live `console.log` in `spawnRandomAberration` (`{ totalWeight, roll }` and `"ABERRATION SPAWN EVENT!?"`). | Resolved — both removed from `aberration.ts`. Init log kept. |
| 2026-07-16 | **Bug:** `delay` directive ban check was a no-op — redundant `if (!context?.auth?.id)` inside `if (account.banned)`. | Resolved — removed redundant inner check; ban now throws unconditionally. |

---

Periodically, promote "Still open" rows into [cleanup-todo-list.md](./cleanup-todo-list.md) or drop them if obsolete.
