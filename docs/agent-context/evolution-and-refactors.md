# Evolution and refactors (historical context)

This document captures **intent and history** as understood from maintainer narrative and from the codebase. It is not a git archaeology report.

## Era 1 — Hard-coded iteration (legacy)

**Problem shape:** Logic walked inventory/enchantments in a simple loop and applied effects. Combat processed **one side then the other**, which produced **asymmetry**. Everything was largely **hard-coded**, so dynamic systems (notably **artifacts** with configurable affix behavior) could not be expressed cleanly.

**Residual footprint:** Occasional comments about “legacy” fields or behaviors, and tests labeled “legacy” where they exercise older data shapes. (Note: `rangedSecondAttackChance`, formerly cited as an example here, has been removed — it had zero readers.) Do not assume every “legacy” label is removable without checking persisted data and callers.

## Era 2 — Units and modifiers (current structural backbone)

**Idea:** Introduce **`Unit`** objects that own **`Modifier`** instances. Modifiers implement hooks (`getBonus`, `getMultiplier`, `getExtraBonus`) so stats are queried through a single **OOP-style** interface (`unit.stats.*`) instead of ad hoc recomputation scattered across combat.

**What this unlocked:**

- **Dynamic equipment:** `InventoryItem` constructs modifiers from enchantments and built-ins; artifacts attach via `ArtifactItem`.
- **Symmetry in setup:** `Unit.enterCombat` wires both participants (stat steal, attack-side modifiers, counter-spells) so the **data model** is less one-sided than the old loop.

**Cleanup state:** A large amount of **dead code** from earlier eras was removed over time; some comments and disabled blocks remain.

## Era 3 — Hardened modifiers + rebuilt combat math

**Goals (as stated by maintainer):**

1. **Enchantment stacking model:** Move from **multiplicative stacking** of percentage-style effects to **additive stacking** where sensible — e.g. two “+20%” contributions become **+40% additive** to the relevant channel instead of `1.2 × 1.2 = 1.44`.
2. **Damage pipeline:** Re-center combat around a **`base damage`** value (from the attacker’s weapon / unit), then apply **scaling**, **variation**, **crits**, **global amplification/reduction**, **Blood** flat health-based add-on, **conversion**, **resistances**, and **clamps**.

**Universal balance effect:** Additive stacking **nerfed** stacked multiplicative bonuses across the board; that was largely intentional.

**Implementation anchors (for agents reading code):**

- Stat modification pipeline: `proofofcombat-server/calculations/units/unit.ts`
- Generic enchantment stat mapping: `proofofcombat-server/calculations/modifiers/generic-stats-modifier.ts` and the large switch in `calculations/modifiers/enchantments.ts`
- Auto attack damage: `proofofcombat-server/combat/calculate-damage.ts`
- Periodic “enchantment damage / heal” ticks: `proofofcombat-server/combat/calculate-enchantment-damage.ts` and orchestration in `combat/fight.ts`

## Mental model for readers

When you see both **old-sounding** names (`percentageDamageIncrease` as a field) and **new pipeline** behavior, assume **names may lag semantics**. Prefer reading the actual **`getModifiedValue` / `calculateDamage*`** flow over assuming a field name matches classic ARPG meaning.

## What this document does not claim

- Exact dates or branch names for refactors.
- That every comment in code still matches behavior (see technical-debt doc).
