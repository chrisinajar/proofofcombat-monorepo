# Discovered during cleanup (parked work)

When **[prompt-cleanup-one-item.md](./prompt-cleanup-one-item.md)** surfaces **unrelated** problems, **do not fix them in the same change**. Add a **one-line** entry here (or a short table row) so they can become future `cleanup-todo-list` items.

| Date | One-line finding | Suggested file(s) | Notes |
|------|------------------|-------------------|-------|
| 2026-04-04 | Stale audit: `fight.ts` section still claims unused `EnchantmentType` import; verify against current `combat/fight.ts`. | docs/agent-context/combat-runtime-and-consumption.md | |
| 2026-04-04 | `getEnchantedAttributes` import in `schema/items/resolvers.ts` still appears unused (re-grep before removing). | proofofcombat-server/schema/items/resolvers.ts | See cleanup-todo C unused-import row. |

Periodically, promote rows into [cleanup-todo-list.md](./cleanup-todo-list.md) or drop them if obsolete.
