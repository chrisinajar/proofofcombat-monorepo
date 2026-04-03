# Glossary and conventions

## Core types

- **`Unit`** — Stat container + modifier host; **`stats`** is computed via `getModifiedValue`.
- **`Modifier`** — Object implementing `getBonus`, `getMultiplier`, `getExtraBonus`; may attach to items or units.
- **`Combatant`** — Combat snapshot + `Unit` used by `fight.ts` / `calculate-*`.
- **`EnchantedCombatant`** — Adds flattened post-`enterCombat` numbers for convenience.

## Naming patterns

- **`baseValues`** — Starting numbers before modifier pipeline (plus special cases in `getBaseValue`).
- **`*Multiplier` stats** — Separate numeric channels (e.g. `strengthMultiplier`) used to **accumulate additive % bonuses** that become **`1 + total`** multipliers via `BasicUnitModifier` for the matching primary stat.
- **`percentageDamageIncrease` / `percentageDamageReduction`** — Used as **factors** in `calculateDamage` (multiply together into `multiplier`). Despite “percentage” in the name, treat as **opaque scalars** from `unit.stats`.
- **`percentageEnchantmentDamageReduction`** — Scales down enchantment tick damage/leech in `calculate-enchantment-damage.ts`.

## Attack types (`AttackType`)

Drive **damage type** selection in `calculateDamage` (physical / magical / holy / blight override) and which **attributes** participate via `attributesForAttack` (`combat/constants.ts`).

## Enchantment vs enchantment tick

- **Enchantment (item affix)** — Resolved through **`modifiersForEnchantment`** into `GenericStatsModifier` and friends.
- **Enchantment tick (fight loop)** — Periodic **DoT/sustain** math via **`calculateEnchantmentDamage`**, separate from weapon hits.

## Files with similar names

- **`combat/enchantments.ts`** — Combat pipeline / attribute flattening.
- **`calculations/modifiers/enchantments.ts`** — Data definitions for enchantment → modifiers.

Always disambiguate by path in reviews and AI prompts.

## Testing conventions

- Tests are **co-located** as `*.test.ts` next to sources (`always-colocate-tests` runbook).
- Prefer **deterministic** damage tests by mocking `Math.random` where used (see `calculate-damage-multipliers.test.ts`).
