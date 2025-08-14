---
id: ui-next-steps-onboarding
description: Implement and maintain the Welcome "Next steps" onboarding card safely
owner: ui
triggers:
  - proofofcombat-ui/src/game/index.tsx
  - proofofcombat-ui/src/game/rebirth.tsx
  - proofofcombat-ui/src/helpers.ts
  - docs/ui-architecture.md
checklist:
  - UI remains static-exportable; no SSR patterns
  - No inline gql in UI; only generated hooks
  - Don’t render or move RebirthMenu into Welcome; teach flow via Inventory
  - Gating uses hero.levelCap > 10 for first rebirth completion
  - Avoid using hero.version for gameplay logic (it’s a data schema/version marker)
  - Don’t hide onboarding due to Washed Up alone; rebirth completion drives hide
  - Early hook declarations; no early-returns before hooks/effects
  - A11y: buttons/links have labels; hints use secondary text with italics
source: runbook
---

# Next Steps Onboarding Card

Purpose: Provide gentle guidance through the very start of the game — up to and including the first rebirth — then defer to the Quest Log.

Key rules
- Visibility: Show the card until the first rebirth is completed. Use `hero.levelCap > 10` to detect this. Do not use `hero.version` — that’s a schema/data upgrade marker updated by the server and is not reliable for rebirth detection.
- Washed Up: Do not hide the card just because Washed Up started. Keep the card until first rebirth completes, but do nudge the player to “try a swim” before Washed Up begins.
- Rebirth flow: Do not embed `RebirthMenu` in the Welcome card. Players must learn to complete rebirth from the Inventory tab (Quest items). Provide an “Open Inventory” helper button instead.
- Strike-throughs: Use simple, resilient heuristics (no server changes):
  - Combat tip: line-through after any EXP is earned.
  - Map tip: line-through after first movement (tracked via localStorage) or once Washed Up starts.
  - Shop tip: line-through once the hero has any gold or any inventory items.

Implementation notes
- File: `proofofcombat-ui/src/game/index.tsx`
  - Guard hooks ordering: declare all `useState/useRef/useEffect` before any early return that renders fallback UI (e.g., redirect or loading). Otherwise React will error (Rules of Hooks).
  - Movement tracking: store a boolean in `localStorage` keyed `poc_has_moved_once` after a coordinate change to power the Map strike-through.
  - A11y: ensure helper buttons have `aria-label`s; use `secondaryTypographyProps` with italics for hints.
- File: `proofofcombat-ui/src/game/rebirth.tsx`
  - Accept a minimal hero type where possible (Pick fields actually used) to avoid tightening `RebirthMenu` across unrelated callers.

Do nots
- Do not rely on `hero.version` for gameplay states.
- Do not inline GraphQL queries (`gql` tags) in the UI code.
- Do not break static export (no dynamic server-only code paths).

Checklist before commit
- Built UI and exported statically.
- Lint warnings are baseline-only; no new inline gql.
- Run `yarn agent:runbook:sync` and `yarn agent:check` to verify runbook drift and guardrails.

