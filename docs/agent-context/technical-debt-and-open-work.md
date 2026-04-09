# Technical debt and open work (audit snapshot)

This is a **point-in-time** inventory derived from **code search and spot reads**, not a commitment tracker. Expect drift; re-scan when starting large work.

**Deeper pass (quests, stubs, fallthrough NPC errors, combat leftovers):** see **[rough-edges-and-incomplete-work.md](./rough-edges-and-incomplete-work.md)** — that file is the home for “why does this feel unfinished?” glue; this file stays a lighter TODO index.

**Actionable checklist (checkboxes, grouped by area):** **[cleanup-todo-list.md](./cleanup-todo-list.md)** — use it to drive refactors; keep it in sync as items close.

## Explicit TODO / FIXME comments (server sample)

| Location | Signal |
|----------|--------|
| `db/models/hero.ts` | `///@TODO redo with modifiers` near **commented** artifact math in `recalculateStats` — likely **stale**; verify before acting. |
| `schema/quests/treasure.ts` | Content TODO for treasure map drops. |
| `schema/quests/resolvers.ts` | Player-facing text TODO. |
| `schema/void-travel.ts` | Placeholder for “cataclysm” event. |

## Tone / “partially baked” markers

- `calculations/units/hero.ts` — comment on artifacts: ironic note that the feature “definitely” works. **Treat as a warning** to verify artifact edge cases (affix toggles, imbues) when touching equipment.
- `combat/calculate-damage.ts` — **debug `console.log`** behind flags — acceptable for dev, but ensure hot paths do not enable logging in production builds.

## Legacy compatibility patterns

- **`upgrade()`** paths often mention **legacy records** gaining defaults — normal for long-lived player data.
- ~~`rangedSecondAttackChance`~~ — **removed** (no code read or set this legacy field; `rangedAttackSpeedMultiplier` is the active replacement).

## Areas likely to reward cleanup (hypotheses)

These are **not** confirmed dead code — validate with tests and grep:

1. **Duplicate `getEnchantedAttributes` calls** inside `calculateDamage` (called twice). Might be intentional reset, might be oversight — profile/audit before changing.
2. **Naming drift** — fields like `percentageDamageIncrease` behave as **multiplicative factors in the damage function** (`attackerAmplification * victimDamageReduction`) while the **modifier stacking** design moved to **additive** composition in the unit layer. Names may confuse future readers.
3. **Enchantment switch size** — `calculations/modifiers/enchantments.ts` is very large; future maintainers may split by category once behavior is frozen.
4. **UI inventory `baseDamage` casts** — `inventory-browser.tsx` uses `(item as any).baseDamage` fallbacks — possible type/schema alignment opportunity.

## Verification commands (for humans / agents with shell)

From repo guidelines:

- Full test suite: `yarn test` (root orchestrates both packages).
- Server-only focus: `yarn --cwd proofofcombat-server test` targeting relevant `*.test.ts` files.
- Typecheck: `yarn --cwd proofofcombat-server ts --pretty false` (see **`ts-checks`** runbook).

## Suggested next documentation steps (optional)

Not requested by the user, but useful follow-ups:

- A single **diagram** of `calculateDamage` stage ordering (conversion vs resistance vs clamps).
- A table mapping **each** `EnchantmentType` to **modifier definitions** (generated from code or hand-curated).
