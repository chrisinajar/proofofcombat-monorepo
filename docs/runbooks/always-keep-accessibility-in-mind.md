---
id: always-keep-accessibility-in-mind
description: Always keep a11y in mind when working on the UI
owner: ui
triggers:
  - proofofcombar-ui/**
checklist:
  - Leverage MUI for a11y
  - Ensure screen reader support
  - Use correct element semantics
  - Consider headers and tab order
source: cursor-rule
---
# We care about accessibility
We have blind players who play this game, so every feature needs to work for blind players too. Most of the time we don't need to think much about this because the UI consists of buttons and text, however in some spots we need to add special tooltips or even custom screen reader specific UI's.

- Leverage Material UI to make a11y support easy
- Never create a feature that can't be used from a screen reader
- Always be considerate of element types
- Always be considerate of header levels, remember we can visually style text to be one header level while making the component a diferent one.
- Consider tab order and selectability of UI elements
