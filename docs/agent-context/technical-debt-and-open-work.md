# Technical debt and open work (audit snapshot)

This is a **point-in-time** inventory derived from **code search and spot reads**, not a commitment tracker. Expect drift; re-scan when starting large work.

**Deeper pass (quests, stubs, fallthrough NPC errors, combat leftovers):** see **[rough-edges-and-incomplete-work.md](./rough-edges-and-incomplete-work.md)** — that file is the home for "why does this feel unfinished?" glue; this file stays a lighter TODO index.

**Actionable checklist (checkboxes, grouped by area):** **[cleanup-todo-list.md](./cleanup-todo-list.md)** — use it to drive refactors; keep it in sync as items close.

## Explicit TODO / FIXME comments (server sample)

| Location | Signal |
|----------|--------|
| `schema/quests/resolvers.ts` | `///@TODO Add text here to help players!` — player-facing onboarding text for the `talk` mutation. See [cleanup-manual-queue.md](./cleanup-manual-queue.md) for context. |

## Tone / "partially baked" markers

- `calculations/units/hero.ts` — comment on artifacts: ironic note that the feature "definitely" works. **Treat as a warning** to verify artifact edge cases (affix toggles, imbues) when touching equipment.
- `combat/calculate-damage.ts` — **debug `console.log`** behind flags — acceptable for dev, but ensure hot paths do not enable logging in production builds.

## Legacy compatibility patterns

- **`upgrade()`** paths often mention **legacy records** gaining defaults — normal for long-lived player data.

## Areas likely to reward cleanup (hypotheses)

These are **not** confirmed dead code — validate with tests and grep:

1. **`getEnchantedAttributes` calls** in `calculateDamage` — called in both `calculateDamageValues` (with `??` fallback) and `calculateDamage` (unconditionally), so `enterCombat` can run twice per hit. Partially improved from the original triple-call pattern; further merging would need API threading and broader tests.
2. **Naming drift** — fields like `percentageDamageIncrease` behave as **multiplicative factors in the damage function** (`attackerAmplification * victimDamageReduction`) while the **modifier stacking** design moved to **additive** composition in the unit layer. Names may confuse future readers.
3. **Enchantment switch size** — `calculations/modifiers/enchantments.ts` is very large; future maintainers may split by category once behavior is frozen. See [cleanup-manual-queue.md](./cleanup-manual-queue.md) for context on why this was deferred.

## Verification commands (for humans / agents with shell)

From repo guidelines:

- Full test suite: `yarn test` (root orchestrates both packages).
- Server-only focus: `yarn --cwd proofofcombat-server test` targeting relevant `*.test.ts` files.
- Typecheck: `yarn --cwd proofofcombat-server ts --pretty false` (see **`ts-checks`** skill).

## Suggested next documentation steps (optional)

Not requested by the user, but useful follow-ups:

- A single **diagram** of `calculateDamage` stage ordering (conversion vs resistance vs clamps).
- A table mapping **each** `EnchantmentType` to **modifier definitions** (generated from code or hand-curated).

---

## Resolved (archived)

Items below appeared in earlier versions of this doc and have since been addressed.

**Explicit TODOs removed from code:**
- `db/models/hero.ts` — `///@TODO redo with modifiers` and commented artifact health block — removed; one-line note confirms stats come via `getUnit`.
- `schema/quests/treasure.ts` — aspirational TODO for gossip/dungeon loop — removed; current grant-one-map behavior documented.
- `schema/void-travel.ts` — `///@TODO trigger cataclysm event` — removed; void reset is self-contained.

**Legacy fields:**
- `rangedSecondAttackChance` — fully removed from codebase; `rangedAttackSpeedMultiplier` is the active replacement.

**Cleanup targets addressed:**
- Duplicate `getEnchantedAttributes` calls reduced from triple to double per hit.
- UI inventory `baseDamage` casts (`(item as any).baseDamage` in `inventory-browser.tsx`) — replaced with typed fields from generated `InventoryItem` type.
