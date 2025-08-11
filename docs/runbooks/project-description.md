---
id: project-description
description: Project overview, gameplay, and story
owner: server, ui
triggers:
  - docs/**
checklist:
  - Keep structure section current
  - Update tech stack if upgraded
source: cursor-rule
---
# Project Overview
This is a game called "Proof of Combat", a browser-based RPG where players progressively become more powerful by defeating monsters and completing quests. The project consists of both the server-side game logic and the client-side user interface in a unified repository structure.

## Project Structure
- `proofofcombat-server/`: Server-side game logic and API
- `proofofcombat-ui/`: Client-side user interface

## Server
### Server Tech Stack
- Node.js & Express for server
- GraphQL API using Apollo Server
- GraphQL Code Generator for auto-generating types
- LevelDB for flat file database
- Single-threaded, single instance architecture

### Server Code Organization
- `schema/*`: GraphQL resolvers and API endpoints
  - `schema/admin/`: Admin specific code, see "Put all admin functionality in admin specific folders" rule for details
  - `schema/quests/`: Game content and quest mechanics
  - `schema/quests/text/`: Quest dialogue and text content
- `calculations/`: Character and monster stat calculation system
- `combat/`: Combat mechanics implementation
- `constants/`: Game data and location information
- `types/graphql.ts`: Auto-generated GraphQL types, check the "Always generate types from graphql" rule for details

## Client
### Client Tech Stack
- React & Next.JS
- Material UI & styled-components
- Apollo Client
- GraphQL Code Generator for auto-generating types and hooks

### Client Code Organization
- `src/` contains all app code
- `pages/` contains Next.js pages
- `public/` contains static assets
- `e2e/` contains Playwright tests

