---
id: commit-sequencing
description: Create clean, multi-commit changes safely without empty commits
owner: server, ui
triggers:
  - '**/*.ts'
  - '**/*.tsx'
  - '**/*.graphql'
checklist:
  - Stage only the files for the intended commit
  - Commit once per staged set; avoid multiple commits in a row without staging
  - For multiple commits, repeat: stage subset -> commit -> stage next subset -> commit
  - Never run `git add -A` followed by multiple `git commit` commands
  - Use multiple `-m` flags for title/body formatting
source: runbook
---

# Commit Sequencing

Use this when preparing multiple focused commits to avoid empty (no-op) commits.

- Stage subsets: Add only the files that belong to the commit you are about to make (e.g., `git add path1 path2` or `git add -p`).
- One commit per stage: Run exactly one `git commit` for the currently staged set. Do not immediately run a second commit.
- Iterate for next commit: Stage the next subset of files, then run `git commit` again.
- Avoid: Running `git add -A` once and then attempting two `git commit` commands in a row. The second will be empty and fail.
- Message formatting: Prefer multiple `-m` flags for subject/body; do not embed `\n` in a single `-m`.

Examples
- Two commits:
  1) `git add proofofcombat-server/...` then `git commit -m "server: feature X"`
  2) `git add proofofcombat-ui/...` then `git commit -m "ui: feature X UI"`

