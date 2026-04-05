# Combat runtime: consuming units (dead code, stale fields, glue)

Scope: **`proofofcombat-server/combat/**`** and the bridge **`combat/enchantments.ts`**. This is **not** the modifier/unit pipeline (`calculations/`); it is the code that **calls** `unit.stats`, `getBaseDamage`, and `enterCombat` during hits and enchantment ticks.

Agents already read source well — this file only records **non-obvious drift**, **unused pieces**, and **data-shape lies**.

---

## Single source of truth during a swing

For **hit chance**, **weapon damage**, **armor**, **resists**, **amplification**, **crit luck**, combat reads **`attacker.unit` / `victim.unit`** (via `getEnchantedAttributes` → `unit.stats` / `getBaseDamage`), **not** the loose fields on `Combatant` except where noted below.

Anything on **`Combatant`** that duplicates that (e.g. `damageReduction`, initial `attributes`) is often a **legacy snapshot** or **test plumbing**.

---

## `Combatant` / `EnchantedCombatant` (`combat/types.ts`)

| Field | Role in combat code | Notes |
|-------|---------------------|--------|
| `damageReduction: number` | **Not read** anywhere under `combat/` | Still set in `hero.ts` (`hero.level`) and `monster.ts` (`constitution/2`). Tests pass a number. **Treat as vestigial** unless something outside `combat/` reads `Combatant` directly. |
| `attributes` (initial) | **Overwritten** in `enchantCombatants` | Heroes seed from **`heroUnit.baseValues`** in `createHeroCombatant`, not full modified stats — **misleading** until `getEnchantedAttributes` runs. |
| `skills?` | **Not read** in `combat/` | Only populated on heroes; skills affect stats via **`BasicHeroModifier` on the unit**, not via this field. |
| `EnchantedCombatant.enchanted: true` | **Never set** | Type is satisfied only by **cast** in `enchantments.ts`; the tag is **nominal only**. |
| Flattened fields on `EnchantedCombatant` (`bonusAccuracy`, `bonusDodge`, `bonusWeaponTiers`, `lifesteal`, etc.) | **Copied in `enchantCombatants`** | **No reads** in `combat/*.ts` after flattening — hit/damage use **`unit.stats`**. These exist for **callers outside combat** (or future use); **`schema/hero/resolvers.ts` combatStats** mostly uses **`unit.stats`** and `percentageDamageIncrease`, not these flats. |

---

## Bridge: `getEnchantedAttributes` / `enchantCombatants` (`combat/enchantments.ts`)

- **`enterCombat` runs once per `getEnchantedAttributes` call** (per pair). Inside one **weapon swing**, **`calculateHit`** calls it once and **`calculateDamage`** calls it **once** (shared between `calculateDamageValues` and the rest of `calculateDamage`). So **`enterCombat` can run twice per hit** (hit + damage). Stat-steal side is partially guarded (`StatStealVictimModifier` removes an existing victim mod before re-adding — see `calculations/modifiers/stat-steal-modifier.ts`); **`applyAttackModifiers` / counterspells still re-run** on each `enterCombat`. Further merging hit + damage into a single `getEnchantedAttributes` would need API threading and broader tests.

- **`attacker`’s `attackType` in `enchantCombatants`** is read only to satisfy typing; flattening does not depend on it for the victim’s copy.

---

## `calculate-damage.ts`

**Unused / dead in implementation (verify before deleting — may be lint-suppressed):**

- Imports: **`EnchantmentType`**, **`getItemPassiveUpgradeTier`** (from `./helpers`) — **not referenced** in the file.
- `calculateDamageValues`: **`let damage = 0`** — unused.
- **`baseDamageDecrease`** — assigned, never used.
- **`attackerDamageStat`**, **`victimReductionStat`** — read from `attributes` then **never used** (likely leftover from an older reduction formula).

**Behavior notes:**

- **`attacker.class` / `attackerInput.health`** for Blood use **`Combatant`**, not only `unit` — correct for **current health** on the snapshot.
- Third crit tier: extra `damage *= 3` roll using **`trippleCriticalChance`** (Gambler/Daredevil); no separate boolean is tracked or returned—only **`critical`** / **`doubleCritical`** are part of the `calculateDamage` result. Typo **`tripple`** is consistent in identifiers.

**Resistance indexing:** uses `` `${damageType.toLowerCase()}Resistance` `` — must stay aligned with `Unit` stat names (e.g. `physicalResistance`).

---

## `calculate-hit.ts`

- Hit chance uses **`unit.stats.attackRating` / `evasionRating`** only; **main vs off-hand** is not a separate axis here (off-hand still affects **damage** via `isSecondAttack` on the **`calculateDamage`** path in `fight.ts`).

---

## `calculate-enchantment-damage.ts`

- Imports **`AttackType`**, **`EnchantmentType`**, **`HeroClasses`**, **`attributesForAttack`** — **unused** (nothing in the file references them).
- Uses **`attacker.maxHealth`** on `EnchantedCombatant` for regen — **`Combatant.maxHealth`** is required on the snapshot.

---

## `monster.ts`

- Luck uses **`createLuck(monsterAttributes.luck)`** (same helper as heroes; values come from **`createMonsterStatsByLevel`**).
- Author comment on **`...combatData` spread**: acknowledges redundancy.

---

## `fight.ts`

- **`EnchantmentType` import** — **unused**.
- Local type **`AttackCombatantResult`** — return shape of `attackCombatant`; only used inside this file.

---

## `item-helpers.ts` vs `helpers.ts`

- **`getItemPassiveUpgradeTier`** is **duplicated**: identical implementation in **`combat/helpers.ts`** and **`combat/item-helpers.ts`**.
- **`calculations/units/unit.ts`** imports from **`combat/item-helpers`** only. **`calculate-damage.ts`** imports **`helpers.ts`** for **`attributesForAttack`** but also pulls **`getItemPassiveUpgradeTier`** there **without using it** (see above). Net: **two copies of one helper** + **one dangling import**.

---

## `enchantment-order.ts`

- **`EnchantmentCounterSpellOrder`** — **used** by `calculations/modifiers/enchantments.ts` (counterspell ordering).

---

## `enchantment-groups.ts`

- Used from **`calculations/modifiers/enchantments.ts`** (not from `combat/` combat math). Listed here only because it lives under **`combat/`** and is re-exported by **`combat/index.ts`**.

---

## Tests (`combat/*.test.ts`)

- **`getAverageDamage`** in `combat.test.ts` uses a **closed-form approximation** of crits that **does not match** the nested random crit ladder in `calculateDamage` — useful for **rough expectations**, not a spec of the implementation.

---

## Related (outside `combat/` but same confusion)

- **`schema/items/resolvers.ts`** imports **`getEnchantedAttributes`** but **does not use it** — **unused import** at time of writing; combat consumers are unaffected.

---

## Quick map: file responsibilities

| File | Consumes units? | Notes |
|------|-----------------|--------|
| `constants.ts` | No | `attributesForAttack` mapping only. |
| `helpers.ts` | Via DB for luck | `createLuck`; duplicate `getItemPassiveUpgradeTier`. |
| `hero.ts` | Yes | Builds `Combatant` + equipment mirror for UI/two-weapon logic; seeds **base** attributes. |
| `monster.ts` | Yes | Builds mob `Unit`. |
| `enchantments.ts` | Yes | **Only** place that flattens `unit.stats` onto combatant-shaped objects for combat. |
| `calculate-*.ts` | Yes | Core math. |
| `fight.ts` | Yes | Scheduling + mesmerize + logging; unused `EnchantmentType` import. |
| `fight-monster.ts` / `fight-hero.ts` | Yes | Thin wrappers over `executeFight`. |
| `enchantment-order.ts` | No | Counterspell order only (`EnchantmentCounterSpellOrder`). |
| `enchantment-groups.ts` | No | Expanded enchant lists for modifier layer. |
