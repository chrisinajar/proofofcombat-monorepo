# Proof of Combat UI — Structure & UX Audit

This document maps the UI structure and highlights opportunities to improve the visual user experience. It’s intended as a quick ramp for contributors to understand where things live and how to make meaningful changes quickly.

- Tech stack: Next.js 12 (static export), React 18, MUI v5, Apollo Client, GraphQL Codegen, Socket.IO, notistack.
- Conventions: GraphQL ops in `*.graphql` (no inline gql); generated hooks under `src/generated/`; tests colocated `*.test.ts[x]`.
- Relevant runbooks: `runbook-index`, `project-description`, `ui-should-be-static`, `always-keep-accessibility-in-mind`.

## High-Level Flow

- `pages/_app.tsx`: App shell providers
  - `ProofOfApolloProvider` (Apollo Client w/ error + delay handling)
  - `SnackbarProvider` (toasts)
  - `DelayContext` (global action-delay state)
- `src/components/layout.tsx`: Theme + dark mode + app layout
  - Wraps page content with MUI `ThemeProvider`, `CssBaseline`, `AppBar`, `Footer`
  - Fetches `me` (when `showHero`) to render hero HUD: `HeroBars`, `DelayBar`
- Routing strategy
  - Landing at `/` → `LoginOrSignup`
  - Game at `/play` and `/play/*` all resolve to `src/game/index.tsx`
  - Pages under `pages/play/*.tsx` export `src/game` (tabs driven by route suffix)

## Data Layer

- `src/apollo.tsx` defines Apollo client
  - Endpoint from `NEXT_PUBLIC_BASE_URL`
  - Auth token from `sessionStorage` header
  - Error link pipes GraphQL errors into toasts and sets global delay via `DelayContext`
- Generated hooks: `src/generated/graphql.tsx` (do not edit)
- GraphQL operations live beside features (e.g., `src/components/combat/*.graphql`, `src/game/locations/*.graphql`)

## Key Contexts & Hooks

- `src/hooks/use-delay.ts`: `[delay, setDelay]` global action delay
- `src/hooks/use-dark-mode.ts`: `[darkMode, setDarkMode]` for theme
- `src/hooks/use-hero.ts`: reads hero from `useMeQuery({ fetchPolicy: 'cache-only' })`
- `src/hooks/use-location.ts`: derived `useLocation`, `useSpecialLocation`, `usePlayerLocation`, `useCanVoidTravel`

## Feature Modules

- App Shell
  - `src/components/app-bar.tsx`: Title, hero summary, dark mode toggle, logout
  - `src/components/footer.tsx`: Links to repos and API explorer; renders hidden logout for a11y
  - `src/components/hero-bars.tsx`, `src/components/delay-bar.tsx`: HUD
- Game (main UI): `src/game/index.tsx`
  - Tab navigation (`@mui/lab`): Welcome, Combat, Shop, Inventory, Map, Quests, Settings, Admin
  - Top-of-page dynamic banners: `LevelUpBox`, `QuestEventDisplay`
  - Welcome → Next Steps onboarding card:
    - Shows until first rebirth completes (check `hero.levelCap > 10`).
    - Don’t embed `RebirthMenu` here; instruct to rebirth via Inventory and offer an “Open Inventory” helper button.
    - Nudge Washed Up with “Maybe try going for a swim…” until it starts.
    - Strike-through heuristics: Combat after any EXP; Map after first movement (localStorage) or Washed Up started; Shop after any gold or inventory.
  - Feature tabs:
    - Combat: `src/components/combat/*` (list, stance selector, battle log)
    - Shop: `src/game/shop/*` (server-provided items)
    - Inventory: `src/game/inventory/*`
    - Map/Locations: `src/game/locations/*` (movement, special locations, settlement manager, docks, NPC shop)
    - Quests: `src/game/quest-log/*`
    - Settings: `src/game/settings/*`
    - Admin: `src/admin/*` (loaded dynamically)
  - Chat: `src/components/chat/*` (Socket.IO, tabs for all/chat/notifications + private threads)

## Pages

- `/` → `pages/index.tsx` → `LoginOrSignup` inside `Layout`
- `/map` → `pages/map.tsx` → `src/map-preview.tsx`
- `/play[/*]` → `pages/play/*.tsx` → `src/game/index.tsx` (tab picked from route suffix)

## Theming & Styling

- Theme is created in `src/components/layout.tsx`
  - Dark mode from `useMediaQuery('(prefers-color-scheme: dark)')` with override via context
  - Custom palette (primary, secondary, info, error, background)
  - Small `shape.borderRadius`
- AppBar re-wraps with a focused theme (primary color varies by dark mode)
- Spacing often via `sx` props; some legacy `<br />` remain and can be replaced with spacing tokens

## Testing

- Unit tests colocated (e.g., `src/components/chat/artifact-modal.test.tsx`)
- UI unit tests run with JSDOM (`src/setupTests.ts`)
- E2E tests in `proofofcombat-ui/e2e/` (Playwright). See `docs/runbooks/e2e-tests.md`

---

# UX Opportunities (Prioritized)

1) Navigation & Information Hierarchy
- Problem: Long content blocks on the Welcome tab with minimal visual hierarchy; `<br />` used for spacing.
- Improvements:
  - Replace `<br />` with `Box` or `Stack` spacing, elevate headings and subheads.
  - Add a compact summary card for “What to do next” for new players.
- Where: `src/game/index.tsx` (Welcome tab body)

2) AppBar Layout & Controls
- Problem: Dark mode toggle is a full `FormControlLabel` taking vertical space; hero name + logout stacked in a tight column.
- Improvements:
  - Use an `IconButton` with tooltip for dark mode; move theme toggle to Settings and keep a quick toggle in AppBar as an icon.
  - Wrap hero name + logout in a `Stack` with tighter spacing; consider an avatar or hero class badge for recognition.
- Where: `src/components/app-bar.tsx`

3) Combat Readability
- Problem: Combat log is dense text; state changes (victory, drops) blend into the feed.
- Improvements:
  - Use MUI `Alert` or `Card` for victory/level-up summaries; accentuate drops with an outlined card and item icon (if available).
  - Add keyboard shortcuts (1/2/3) to trigger available attacks with focus hints.
  - Consider color-coding or chips for damage types.
- Where: `src/components/combat/combat-display.tsx`

4) Map/Movement Affordances
- Problem: Movement grid works but isn’t visually obvious for new users; teleport UI is compact and numeric-only.
- Improvements:
  - Visually group the N/E/S/W controls with a compass-like container and add small arrows.
  - Teleport: add helper text for range/cost; debounce invalid numeric input; show disabled reason via `Tooltip`.
- Where: `src/game/locations/index.tsx`

5) Chat Usability & Density
- Problem: Messages prepend to top; long list without virtualization; timestamps repeat visually and add noise.
- Improvements:
  - Render messages bottom-up with auto-scroll to bottom; show timestamp on hover (title) or as subtle right-aligned caption.
  - Use `List`/`ListItem` with type-specific color chips; optionally virtualize if backlog grows (e.g., `react-window`).
  - Persist last selected tab and draft message in `sessionStorage`.
- Where: `src/components/chat/index.tsx`

6) Spacing & Consistency
- Problem: Mixed use of `<br />` and `sx={{ mt }}` spacing; inconsistent max widths in some modal/content areas.
- Improvements:
  - Replace `<br />` with theme spacing; use `Container` and `Stack` for consistent vertical rhythm.
  - Audit modals for responsive width and padding consistency.
- Where: `Layout`, `Footer`, Welcome tab, Chat modal(s)

7) Dark/Light Palette Polish
- Problem: Secondary and error colors in dark mode may lack contrast in some contexts; background papers differ between shells (AppBar vs. Layout).
- Improvements:
  - Validate contrast ratios; standardize paper/background tones across AppBar-wrapped regions.
  - Consider a neutral “surface” color token for cards/logs.
- Where: `src/components/layout.tsx`, `src/components/app-bar.tsx`

8) Accessibility Enhancements (a11y)
- Positive: Thoughtful use of `visuallyHidden`, labels, and tab roles.
- Improvements:
  - Add `aria-live="polite"` region for combat log and chat system messages to assist screen readers.
  - Ensure all icon buttons have descriptive `aria-label` + tooltip.
  - Provide focus outlines for tab changes and modal open/close.
- Where: Combat display, Chat input/send, AppBar icons

9) Feedback During Delays
- Problem: Actions disabled during delay without always communicating remaining time in context.
- Improvements:
  - Inline hint under disabled action buttons (“Available in 2.3s”), sourced from `DelayContext`.
- Where: Movement buttons, Combat actions, Teleport

10) Onboarding & Empty States
- Problem: Some tabs show very little when inventories or lists are empty.
- Improvements:
  - Add friendly empty-state illustrations/text and a CTA (“Fight monsters in Combat to earn gold and buy items”).
- Where: Shop, Inventory, Quests

---

## How-To Cheatsheet

- Add a new GraphQL operation
  - Create `*.graphql` near the component, run `yarn --cwd proofofcombat-ui generate`, import hook from `src/generated/graphql`.
- Add a new tab (route)
  - Add `pages/play/<name>.tsx` exporting `src/game`, add a `<Tab>` and `<TabPanel value="<name>">` in `src/game/index.tsx`.
- Show a global delay or error
  - Use `useDelay()` and `enqueueSnackbar()` (via `useSnackbar`) or add inline `Alert`.
- Adjust theme or dark mode
  - Update `src/components/layout.tsx` palette and pass `DarkModeContext` through.

## Suggested Follow-ups

- Validate these changes against `docs/runbooks/ui-should-be-static.md` to preserve static export.
- Consider E2E coverage additions after UX changes (selectors via `data-testid`), see `docs/runbooks/e2e-tests.md`.
