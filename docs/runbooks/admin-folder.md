---
id: admin-folder
description: Put all admin functionality in admin specific folders
owner: server
triggers:
  - proofofcombat-server/schema/admin/**
checklist:
  - Place admin endpoints in schema/admin/
  - Require @auth @admin decorators
  - Treat testing/cheat tools as admin-only
source: cursor-rule
---
There is some admin only functionality, since this is an online game. This can range from testing functionality to content moderation, but we want to keep it separated from any and all game logic.

 - Always put all admin endpoints in the `schema/admin/` folder
 - Always make sure admin functionality is locked down using `@auth @admin` decorators
 - Any testing functionality can be used to cheat, always consider those as admin only

