# Cleanup manual queue (hands-on)

Items **moved here** when an automated pass could not complete them safely. Each row should be self-contained enough that a human (or a future focused session) can pick it up without re-deriving context.

**Do not** delete rows when done — mark **Resolved** with date/PR, or strike through, so we keep a paper trail.

| Date moved | Source (section + summary) | Files / symbols | Why it was deferred (be specific) | Resolved |
|------------|-----------------------------|-----------------|-----------------------------------|----------|
| 2026-04-08 | B. Units — Split or index `calculations/modifiers/enchantments.ts` (size/maintainability) | `proofofcombat-server/calculations/modifiers/enchantments.ts` (1286 lines) | Tagged **product**. The item itself says "when behavior stabilizes" — timing is a judgment call. No specification of target module boundaries (by category? enchantment type? phase?). Splitting a 1286-line file without a clear design would be guesswork. Needs a human decision on grouping before an agent can execute safely. | |
| 2026-04-08 | C. Schema — `talk` mutation: add player-facing text / onboarding | `proofofcombat-server/schema/quests/resolvers.ts` (lines 32-39, `talk` mutation TODO comment); `proofofcombat-server/schema/quests/text/bartender-advice.ts` | Tagged **product**. The `talk` mutation already works (tavern lookup → quest gate → bartender advice → gossip/treasure-map roll). The TODO is aspirational brainstorming: "add text to help players", "maybe convert 'appear here' quest events to bartender conversations". Deciding what onboarding text to add, which quest triggers to reroute, and writing flavor copy are gameplay/design decisions. No specification of target content or flow. | |
| 2026-04-08 | C. Schema — Meet the Queen: prerequisite / Droop ordering | `proofofcombat-server/schema/quests/meet-the-queen.ts` (lines 94-141, `checkHero` palace branch) | Tagged **product**. When `progress === 2` and Droop quest is not finished, player visits the palace and gets **no feedback** — all three if-blocks skip (progress not < 2, droop not finished, progress not 3). Line 138 comment `// probably needs to find droop first at this code path` confirms the developer was uncertain. Fixing requires a design decision: should the "notHere" message replay? Should a new message hint at finding Droop? What if progress somehow lands between 4-9? These are gameplay/narrative choices, not mechanical cleanup. | |

---

## How items arrive here

An agent following **[prompt-cleanup-one-item.md](./prompt-cleanup-one-item.md)** bails out when the work is ambiguous, risky, or needs a product/design call. It **keeps the row** in [cleanup-todo-list.md](./cleanup-todo-list.md) but sets **Done** to `[→ manual YYYY-MM-DD]`, and appends a full row **here** with the deferral reason (the main table still shows *what* was attempted).
