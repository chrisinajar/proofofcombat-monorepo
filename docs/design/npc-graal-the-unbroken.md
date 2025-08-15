# Graal the Unbroken — The Eternal Duelist

Goal: Convert a flavorful but chaotic NPC pitch into a tight, game‑fit design that aligns with Proof of Combat’s systems, pacing, and lore. This document summarizes player‑facing behavior and server/UI hooks to implement later.

## Summary
- Role: Late‑game daily skill check and prestige sink tied to Void lore.
- Where: At any Tavern, interact with a new “Dueling Stone” to access Graal.
- Access: Unlocks after a combat milestone (first time only). One challenge per real‑world day.
- Encounter: 1v1 duel vs “Graal’s Echo” (generated opponent) with slight overtuning and buff restrictions to showcase true build quality.
- Rewards: Cosmetic bragging rights (titles, aura variants, trophy). Loss still grants a small temporary boon.

## Unlock & Availability
- Unlock (first time any is met):
  - 10 PvP victories OR
  - 500 mob kills OR
  - Defeat any Void‑tier boss (future hook)
- Entry point: At Taverns, a contextual location action “Challenge Graal” appears once unlocked (via the Dueling Stone prop in UI).
- Frequency: Once per real‑world day per hero (resets at 00:00 UTC).
- Ledger: Tracks wins, losses, current/best streak, last challenge time, last result.

## Duel Rules
- Format: Single duel against a generated enemy “Graal’s Echo”.
- Scaling: Echo’s total combat rating scales from the hero’s computed combat attributes with +5–10% overtune, leaning against the hero’s dominant damage type to test resilience.
- Restrictions: Temporary buffs/consumables/external auras disabled; only gear, permanent enchants, hero base stats apply.
- Classification: Counts as a boss encounter for proc/bonus purposes.

## Rewards
- Win:
  - Update ledger (wins, streaks)
  - Title unlocks at streak milestones: Worthy (1), Ironblooded (3), Name of Stone (7)
  - Cosmetic aura (visual only, no stats): rotate through variants (Ember, Stone, Aurora). Stored on account/hero cosmetics.
  - Trophy: “Graal’s Mark” (cosmetic token, level 1, no stats) for display/collection.
- Loss:
  - Choose one consolation boon:
    - Shame‑Forged: +1% damage vs bosses for the next 10 boss kills
    - Scabsteel: +2% defense for 1 hour
  - Hint line tailored to build (e.g., resist gap, attack cadence, sustain issue).

## Lore Hooks
- Graal faced the Void and lived; cannot die until bested by someone who truly understands combat.
- Speaks as though he knows each challenger’s story; victory lines are unique by hero (seeded by hero id).

## Server Implementation Hooks (GraphQL)
- Schema (new types):
  - type GraalLedger { total: Int!, wins: Int!, losses: Int!, bestStreak: Int!, currentStreak: Int!, lastChallengedAt: String, lastResult: String }
  - enum GraalLossBenefit { ShameForged, Scabsteel }
  - type DuelResult { outcome: String!, hint: String, auraUnlocked: String, titleUnlocked: String, trophyAwarded: Boolean! }
  - extend type Query { graalLedger(heroId: ID!): GraalLedger!, graalAvailable(heroId: ID!): Boolean! }
  - extend type Mutation { challengeGraal(heroId: ID!): DuelResult!, chooseGraalLossBenefit(heroId: ID!, benefit: GraalLossBenefit!): GraalLedger! }

- Storage:
  - LevelDB key per hero: `graal:<heroId>` with ledger fields + cooldown timestamp.
  - Cosmetic unlocks recorded under existing cosmetics (if present) or a new collection; do not confer stats.

- Combat:
  - Build opponent “Graal’s Echo” from hero combat stats (proofofcombat-server/combat/*), then apply an overtune multiplier and anti‑build nudge (e.g., adds resistance against hero’s top damage type).
  - Execute one duel via existing `executeFight` flow; treat as boss.
  - Disable temporary effects by passing a sanitized combatant (strip temporary buffs/consumables/external auras).

- Cooldown:
  - Reject `challengeGraal` if attempted within the same UTC day; return remaining time.

## UI Implementation Hooks (Next.js)
- Access from Tavern detail panel via a new action card: “Dueling Stone — Challenge Graal”.
- Show availability and cooldown; tap to start duel mutation; render duel result with flavor line.
- Profile → Achievements tab: display Graal Ledger and earned titles/auras.
- Cosmetic auras: visual layer only, toggle in cosmetics screen; no stats.

## Text & Dialogue
- See `proofofcombat-server/schema/quests/text/graal-the-unbroken-text.ts` for flavor lines:
  - Openers, victory lines (seeded), loss hints keyed by common failure patterns (low resistances, poor sustain, low hit chance).

## Out‑of‑Scope (for initial drop)
- Full PvP history UI; future iteration can surface detailed PvP breakdowns.
- New map markers; Graal entry is via Tavern UI to avoid changing map JSONs.

## QA Notes
- Validate cooldown boundaries (pre/post UTC midnight).
- Ensure duel restrictions actually strip temporary buffs.
- Verify aura/title unlocks are purely cosmetic with no stat drift.

## Rollout
- Ship server changes behind a feature flag `feature.graalDuel` default on in dev.
- UI hides the Dueling Stone if `graalAvailable` is false.

