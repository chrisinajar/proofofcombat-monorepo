# Reusable prompt: one cleanup todo per iteration

Use this to chip away at [cleanup-todo-list.md](./cleanup-todo-list.md) **slowly**, with **low trust in the model** and **high trust in tests and procedure**. Paste the block under **“Copy-paste prompt”** into a coding agent (or Cursor chat) **as the user message**. Re-run after each commit.

**Supporting files**

| File | Role |
|------|------|
| [cleanup-todo-list.md](./cleanup-todo-list.md) | Main checklist (`[ ]` / `[x]`). |
| [cleanup-manual-queue.md](./cleanup-manual-queue.md) | Items that could not be completed safely this round. |
| [cleanup-discovered-queue.md](./cleanup-discovered-queue.md) | Unrelated findings to fix **later** (no scope creep). |
| [AGENTS.md](../../AGENTS.md) | Runbooks, tests, repo conventions — follow before schema/UI changes. |

---

## Principles (do not skip)

1. **One checklist row per session** — not one “theme”, one **row**.
2. **Bail out by default** if anything about the correct change is not **obvious after reading the cited files** and running targeted searches. Uncertainty → **manual queue**, not a guess.
3. **No heroics** — prefer moving to [cleanup-manual-queue.md](./cleanup-manual-queue.md) over shipping a clever fix you cannot **prove** with tests.
4. **No scope creep** — unrelated issues go to [cleanup-discovered-queue.md](./cleanup-discovered-queue.md); do not fix them in this iteration.
5. **Sub-agents / fresh passes** — where your environment supports it, use an **isolated review or sub-task** (e.g. a second agent with **only the diff + test output**, no prior chat history) to reduce context snowballing and overconfidence.
6. **One commit when finished** — either (a) completed work for this row, or (b) documentation-only move to manual queue. **Do not push** unless the human asked you to.
7. **Respect the tag** — rows tagged **product** in the list usually need a design/gameplay decision; **default to bailout** unless the path is fully specified in code comments + tests.

---

## Copy-paste prompt

Use everything inside the fence as the **entire** user message (adjust nothing unless the human told you to).

```text
You are working on the Proof of Combat repo. Follow AGENTS.md (runbooks, tests, no inline gql in UI).

GOAL: Process exactly ONE incomplete item from docs/agent-context/cleanup-todo-list.md — the first table row whose **Done** column is still “[ ]”, reading the file **top to bottom** (section A, then B, …). One checklist row = one outcome = **one git commit** at the end (never push unless the human said so).

RULES:
- **Assume you are often wrong.** Low confidence is a feature. If the correct change is not obvious after reading the files named in that row plus `rg`/grep for callers and reading those call sites, **STOP**. Do not guess; do not “try something.”
- **STOP path:** Append a full row to docs/agent-context/cleanup-manual-queue.md (date, summary, files/symbols, concrete reason you cannot proceed). In cleanup-todo-list.md, change that row’s **Done** cell from `[ ]` to `[→ manual YYYY-MM-DD]` (keep the rest of the row intact so we keep context). Commit **only** doc updates for this path.
- **Unrelated issues:** If you notice other problems, do **not** fix them. Add one line per finding to docs/agent-context/cleanup-discovered-queue.md.
- **Sub-agents / cold review:** If available, run a **second pass** that sees only the final diff and test output (minimal or no prior chat). Use it to find red flags — same spirit as a human re-reviewing uncommitted work without knowing your intent.
- **Tests:** For code changes, use test-first when it helps prove behavior. Run the **narrowest** relevant tests (e.g. yarn --cwd proofofcombat-server test path/to/file.test.ts). If tests fail and the fix is not obvious, **STOP** → manual queue.

If there is **no** row with `[ ]` in the Done column, report **QUEUE EMPTY** and stop (no commit).

CHECKLIST:
1) Select the first `[ ]` row in cleanup-todo-list.md.
2) Read cited files + linked agent-context docs. Decide: unambiguous and safe, or not?
3) If not → manual queue updates + `[→ manual DATE]` in that row; commit; report; **done**.
4) If yes → minimal implementation; tests; re-run tests.
5) **Critical review of all uncommitted changes** (do not describe *why* you changed things — just scrutinize the result): clarity for future readers/AI agents, robustness vs hard-coded slops, coverage and production readiness. Prefer small, direct improvements. “Perfect is the enemy of good”: do not broaden scope beyond this row.
6) On success: set that row’s **Done** to `[x]` (same table row; keep notes).
7) One commit with a message that names the checklist item. Do not push.

REPORT BACK (short): Which row (quote the **Item** cell), completed vs manual-deferred, commands run, commit hash.
```

---

## After the agent finishes (human)

1. **Review the commit** (`git show`) — small diff expected.
2. Run **`yarn test`** (or CI) if you want extra safety before continuing.
3. Paste the same prompt again for the **next** `[ ]` row.

---

## Design notes (why this prompt looks like this)

- **First `[ ]` in file order** avoids “pick the fun one” bias; reorder rows in the markdown if priority changes.
- **Manual queue** preserves failed items with **reasons**, so hands-on work starts from evidence, not memory.
- **Discovered queue** fights scope creep — the failure mode of cleanup passes is “and I also rewrote half the module.”
- **Sub-agent / cold review** mirrors the user’s separate “review uncommitted changes” prompt: **critique without narrative contamination**.
- **One commit** keeps `git revert` aligned with one checklist row.
- **`[→ manual DATE]`** in the main table keeps *what* was attempted visible; **cleanup-manual-queue.md** holds the *why*.

**Maintenance:** If `[→ manual]` rows clutter the main list, archive or collapse them periodically. If repo commands drift (e.g. test invocation), update the copy-paste fence **and** [AGENTS.md](../../AGENTS.md) together.
