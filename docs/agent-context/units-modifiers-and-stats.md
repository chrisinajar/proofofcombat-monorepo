# Units, modifiers, and stats (detailed)

## `Unit` (`calculations/units/unit.ts`)

### Responsibilities

- Holds **`baseValues`** — numeric keys for core RPG stats, resistances, “percentage” combat knobs, weapon-tier bonuses, steal stats, etc.
- Holds **`modifiers: Modifier[]`** — all active modifiers affecting this unit.
- Exposes **`stats`** as a **`Proxy`** whose getters delegate to **`getModifiedValue(prop)`** — you should treat **`unit.stats.foo`** as the computed stat, not a raw field write (writes are rejected / logged).
- Tracks **`equipment`** (`Item[]`) and optional **`opponent`** during combat setup.
- **`enterCombat(victim)`** — symmetric hook used by combat:
  - Creates **stat steal** modifiers both ways.
  - **`applyAttackModifiers`** both ways (weapon-driven victim modifiers — see below).
  - **`applyCounterSpells`** once (built-in symmetry).

### Documented pipeline (comment in source)

The file comments describe evaluation order:

1. **Base value** (`getBaseValue` — special cases for `attackRating` / `evasionRating`, else `baseValues[name]`).
2. **Add flat “bonus” contributions** — `getBonusValue` = `reduceModifiersAdditively("getBonus", ...)`.
3. **Multiply by “amp” values** — `getMultiplierModifier` = `reduceModifiersMultiplicatively("getMultiplier", ...)` with starting value `1`.
4. **Add extra bonus** — `getBonusModifier` = additive `getExtraBonus`.
5. **Round / clamp** — `roundModifiedValue` using `precisions` and `clamps`.

Final combined formula in `getModifiedValue`:

```text
modified = roundClamp( getBonusValue(prop) * getMultiplierModifier(prop) + getBonusModifier(prop) )
```

### Critical subtlety: primary stats vs `*Multiplier` stats

Many enchantments in `calculations/modifiers/enchantments.ts` specify `multiplier: { strength: 1.3 }` on `GenericStatsModifier`.

**That does not call `getBonus("strength")` directly.** Instead, `GenericStatsModifier` maps `multiplier` entries onto the corresponding **`*Multiplier` property**:

- For `multiplier.strength`, the additive piece is returned from **`getBonus("strengthMultiplier")`** as **`(1.3 - 1) = 0.3`** (see `generic-stats-modifier.ts`: only when the **requested prop** ends with `"Multiplier"` does it translate `multiplier[baseProp]` into an additive increment).

Then **`BasicUnitModifier.getMultiplier("strength")`** applies **`1 + unit.stats.strengthMultiplier`** (not a direct stack on `strength`).

**Net effect:** Multiple sources of “+30% strength” accumulate **additively on the `strengthMultiplier` stat**, then apply as **one** multiplier against the rolled-up base+bonus strength — matching the **additive stacking** design goal.

### When true multiplicative stacking is still used

`GenericStatsModifier` supports **`stackMultiplicatively: true`**. In that mode, **`getMultiplier`** returns the configured `multiplier[prop]` values and **`getBonus`** does not carry the load.

Examples called out in code include **Mesmerize** and **Focus** — stacking behaves **multiplicatively** on those chance stats (e.g. `0.5` per modifier on the same prop).

### `getBaseDamage(isSecondAttack)`

Used by combat after enchantments resolve:

- Picks **first or second weapon** from `equipment` (`InventoryItem` weapons only) depending on `isSecondAttack`.
- Uses **`increasedBaseDamage`** from modified stats (default base includes `20` in `baseValues`).
- Delegates to **`weaponDamageWithBuiltIns`** (`schema/items/helpers.ts`) for real weapons, which uses **`computeBaseWeaponDamage`** plus item built-in flat/bonus damage.

If there is **no valid weapon** and `isSecondAttack` is true, returns **0** (no second hit). If no weapon and not second attack, returns **`1 + increasedBaseDamage`** as a bare minimum curve anchor.

### Legacy / unused-ish fields

- ~~`rangedSecondAttackChance`~~ — **removed**. Was legacy (previously randomized ranged second attack); no code read or set it. `rangedAttackSpeedMultiplier` is the active replacement.

## `Modifier` base (`calculations/modifiers/modifier.ts`)

- Each modifier **attaches** to a `Unit` and lives in `unit.modifiers`.
- **`isUnique()`** — when true, attaching removes other modifiers of the **same class**.
- **Persistence** — `isPersistent()` allows saving `expireTime` + `options` for rehydration (used with buff-style mechanics).

## Important concrete modifiers

| Modifier | Role |
|----------|------|
| `BasicUnitModifier` | Global glue: percentage damage increase from primary damage stat; resist-all hook; opponent-aware enchantment damage reduction vs Blood; **`1 + stats[statMultiplier]`** amplification for non-steal primary stats. |
| `BasicHeroModifier` | Health formula, skill-based scaling, terrain resistance penalties, stance-adjacent hooks. |
| `HeroClassModifier` / `HeroStanceModifier` | Class and stance-specific behavior. |
| `GenericArmorModifier` | Armor slot math from tier + built-ins. |
| `GenericStatsModifier` | Data-driven enchantment stats; see stacking modes above. |
| `ParentModifier` | Container that instantiates child modifier definitions (used for victim-side attack modifiers). |
| `StatStealModifier` | Implements enchantment stat steal effects. |

## Items (`calculations/items/inventory-item.ts`)

When an `InventoryItem` is constructed on a `Unit`:

- Armor registers **`GenericArmorModifier`** from tier + built-ins.
- If the item has an **`enchantment`**, **`modifiersForEnchantment`** splits into **attacker-side** and **victim-side** definitions.
  - **Attacker-side** enchantments register immediately on the wielder.
  - **Victim-side** enchantments are collected into **`victimModifiers`** and applied inside **`applyAttackModifiers`** as a **`ParentModifier`** on the **opponent** during combat — this is how “applies to enemy” enchantments get a **symmetric, combat-scoped** application.

## Artifacts

`Hero` calls **`equipArtifact`** after normal equipment. `ArtifactItem` translates artifact attributes into modifiers. Source contains **skeptical maintainer humor** about completeness — treat artifact behavior as **important** but verify edge cases against tests when changing.
