---
id: never-run-commands-in-the-root-directory
description: Never run commands in the root directory
owner: server, ui
triggers:
  - ./
checklist:
  - Run commands in subprojects only
  - Use `nvm use` per subproject
source: cursor-rule
---
- Always run commands within one of the two sub-projects
- Never try to interract with yarn or npm in the root directory since there is no package.json file
- Always run `nvm use` within the subproject before running any commands, there is no guarentee they are on the same node version

