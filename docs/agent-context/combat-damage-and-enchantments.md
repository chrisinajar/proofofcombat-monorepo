# Combat, damage, and enchantment ticks

For **unused `Combatant` fields, dead imports in `calculate-damage.ts`, triple-crit visibility, and repeated `getEnchantedAttributes` per hit**, see **[combat-runtime-and-consumption.md](./combat-runtime-and-consumption.md)** (companion doc focused on the combat layer only).

## Combatant snapshot (`combat/types.ts`)

Combat code uses **`Combatant`** structs that bundle:

- **Class, level, name**, **`attackType`**, **luck roll modifiers** (small/large/ultra — derived from luck),
- **Health / maxHealth**, **equipment** references,
- A **`Unit`** instance (`attacker.unit` / `victim.unit`),
- **Attack speed** fields for timing.

**Enchanted combatants** extend this with flattened numeric fields copied from `unit.stats` for convenience (`percentageDamageIncrease`, dodge/focus chances, etc.).

## `getEnchantedAttributes` (`combat/enchantments.ts`)

This is the **bridge** from raw combatants to “fully buffed” numbers:

1. **`attacker.unit.enterCombat(victim.unit)`** — sets opponent links, applies steal + attack modifiers + counterspell resolution prerequisites.
2. **`enchantCombatants`** — copies **`unit.stats`** into **`attributes`** (primary stats) and the percentage / chance fields used by older combat code paths.

Any combat math that **skips** this risks using **pre-buff** stats.

## Auto-attack damage (`combat/calculate-damage.ts`)

### `calculateDamageValues`

Computes inputs used both for tuning displays and for `calculateDamage`:

- Calls **`getEnchantedAttributes`**.
- Determines **`damageType`** from **`attackType`** (physical for melee/ranged; magical for cast/blood; holy default for smite with stance override for Blight).
- Reads **victim armor**, **`percentageArmorReduction`**, attacker **damage amplification** (`percentageDamageIncrease`), victim **damage reduction** (`percentageDamageReduction`).
- **`baseDamage`** starts as **`attacker.unit.getBaseDamage(isSecondAttack)`**, then applies **armor mitigation** (piecewise formula when armor is large relative to base).
- **Crit chances** from luck modifiers (disabled for **Blood** attack type).
- **`multiplier`** = `attackerAmplification * victimDamageReduction` (applied later in `calculateDamage`).
- **Variation** amplitude — RNG spread shrinks as luck modifiers increase.

### `calculateDamage`

1. Re-fetch enchanted attributes (ensures consistency if callers mutated state — be careful of double work / side effects).
2. Roll **`baseDamage - variation * random`** with minimum 1 before crits.
3. **Crit ladder** — independent rolls can stack multiplicatively on damage for big spikes.
4. Apply **`multiplier`** (amplification × damage reduction).
5. **Blood** (`AttackType.Blood`) adds a **flat** amount based on **attacker current health** and class (specialists get a higher percent). This is **explicitly** done **after** amplification so it is **not** scaled by those multipliers (see source comments).
6. **Damage conversion** — `damageAs*` stats split damage across types; conversion amounts are **normalized** if total conversion exceeds 100%.
7. **Resistances** — per-type caps (`maxXResistance`) applied; separate handling for converted types.
8. **`canOnlyTakeOneDamage`** forces all instances to **1** and clears overkill tracking.

### Debug logging

`calculateDamage` / `calculateDamageValues` accept a **`debug`** flag that **`console.log`s** — noisy in production paths; useful in tests.

## Hit resolution (`combat/calculate-hit.ts`)

**`calculateOdds`** uses **`unit.stats.attackRating`** vs **`unit.stats.evasionRating`** (which themselves incorporate class quirks like dual-attribute accuracy in `Unit.getBaseValue`).

## Fight orchestration (`combat/fight.ts`)

**`executeFight`** advances a **duration clock** and decides whether the next event is:

- A **basic attack** from faster combatant,
- An **enchantment tick** (interval from `ENCHANTMENT_INTERVAL`),
- Or neither within remaining time.

It accumulates:

- Physical-style damage totals vs enchantment DoT totals (naming in `CombatResult`),
- Heals,
- Mesmerize / focus outcomes,
- Second-attack flags for dual-wield cadence.

**`hasTwoAttacks`** encodes special rules: monsters never double-attack in this sense; **ranged** is treated like a single cadence path (see comments — avoids doubling certain mechanics).

## Enchantment damage / heal ticks (`combat/calculate-enchantment-damage.ts`)

Separate from weapon swings:

- **`getOneSidedData`** scales **`enchantmentDamage`**, **`enchantmentLeech`**, **`enchantmentHeal`** against **constitution**, adjusts for **`percentageEnchantmentDamageReduction`**, and applies a **level-based divisor** (different shape for heroes vs mobs — uses `Math.sqrt` for heroes).
- **`healthRegeneration`** contributes to heal based on **max health**.

This is the **“rot / sustain”** layer of combat — distinct balance knobs from auto-attack damage.

## Order and grouping helpers

- `combat/enchantment-order.ts` — priority for **counterspell** resolution.
- `combat/enchantment-groups.ts` — `expandEnchantmentList` can expand one logical enchantment into several for modifier generation.

## GraphQL-facing weapon damage (UI vs combat)

Resolver code exposes **`baseDamage`** / **`secondAttackBaseDamage`** on hero combat stats using the same **`unit.getBaseDamage`** family as combat. **UI** (`combat-stats.tsx`) displays these.

**Inventory** code sometimes computes a local estimate (`weaponDamageWithBuiltIns`) for presentation — **do not assume** it always matches every combat edge case unless tests lock them together.

## Tests worth knowing

| Test file | What it guards |
|-----------|------------------|
| `combat/calculate-damage-multipliers.test.ts` | Snapshot of amplification × DR behavior. |
| `combat/calculate-damage-resistance.test.ts` | Resistance / conversion edge cases. |
| `combat/second-attack-and-ranged.test.ts` | Second hit base damage and ranged behavior. |
| `calculations/units/base-damage-builtins.test.ts` | Weapon built-ins applied once, curve shape. |
