# Non-Player Characters

NPCs drive quests, trades, and world flavor. This document lists the named characters and bartender personas. For quest dialogue text, see `proofofcombat-server/docs/quest-text.md`. For bartender advice lines, see `proofofcombat-server/docs/bartender-advice.md` (auto-generated).

## Named NPCs

### Amixea
- Ancient witch at the Witchforge
- Trades: Enchanting dust for Transcended gear
- Key role in Void storyline (restores cracked orb via essence-of-void)
- Late-game crafting specialist
- Code: `schema/locations/npc-shops.ts` (`executeAmixeaTrade`), `schema/quests/rebirth.ts`

### Queen Brewconia
- Powerful bard-queen
- First appears as traveling performer (Washed Up quest at The Hidden Stump Inn)
- Locations: First Tavern → Palace
- Provides unique rewards and kingdom quests (bloody rags favor)
- Code: `schema/quests/meet-the-queen.ts`, `schema/quests/text/meet-the-queen-text.ts`

### Droop
- Brewconia's goblin companion
- Known for theft and poor map-making
- Provides access to rare artifacts
- Key character in early story (robbing the player, then chase via Hobgoblin maps)
- Code: `schema/quests/droop.ts`, `schema/quests/text/droop-text.ts`

### Naxxremis
- Underwater merchant
- Trades artifacts and rare items
- Requires water breathing ability (Aqua Lung quest completion)
- High-end economy vendor
- Code: `schema/locations/npc-shops.ts` (`executeNaxxremisTrade`)

### Trimarim
- Tavern owner (The Hellhound's Fur) and alchemist
- Early game enchanting vendor
- Tutorial quest provider (crafting introduction)
- Trades in dust and ingredients
- Also serves as bartender persona (see below)
- Code: `schema/locations/npc-shops.ts` (`executeTrimarimTrade`)

### Domari the Huntsman
- Expert monster tracker
- Provides boss locations
- Resource trading
- Rare creature quest chain (aberration hunts)
- Code: `schema/locations/npc-shops.ts` (`executeDomariTrade`), `schema/monster/aberration-drops.ts`

### Graal the Unbroken
- The Eternal Duelist; late-game skill check
- Unlocks after notable combat milestones (PvP or kills)
- Daily duel at taverns via the Dueling Stone
- Rewards: titles, cosmetic auras, trophy; loss grants temporary boon
- Full design spec: [design/npc-graal-the-unbroken.md](./design/npc-graal-the-unbroken.md)
- Code: `schema/quests/text/graal-the-unbroken-text.ts` (flavor lines)

## Bartender Personas

Each tavern has a named bartender with a distinct personality. Bartenders give quest-aware advice when players use the `talk` mutation (requires completing Taste for Business quest). Advice rules and fallback lines are defined in `schema/quests/text/bartender-advice.ts`.

| Tavern | Persona | Tone | Notable advice topics |
|--------|---------|------|----------------------|
| Ancient Vault | Warden of Echoes | Hushed | Rebirth |
| Steamgear Tap House | Foreman Brin | Industrial | Clockwork, settlements |
| The Drowning Fish | Old Mera | Gruff | Washed Up, aqua/clockwork/naga |
| The Hellhound's Fur | Trimarim | Eccentric | Washed Up, tavern champion, crafting, Meet the Queen |
| The Hidden Stump Inn | Rootkeeper Iri | Rustic | Hobgoblins, Droop, forest hunt |
| Wyverns Holm | Keeper of Bones | Hushed | Naga scale |

A generic `current-quest` rule also fires across all taverns when the hero has an active quest, providing the quest description as a hint.
