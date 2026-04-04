# Cleanup manual queue (hands-on)

Items **moved here** when an automated pass could not complete them safely. Each row should be self-contained enough that a human (or a future focused session) can pick it up without re-deriving context.

**Do not** delete rows when done — mark **Resolved** with date/PR, or strike through, so we keep a paper trail.

| Date moved | Source (section + summary) | Files / symbols | Why it was deferred (be specific) | Resolved |
|------------|-----------------------------|-----------------|-----------------------------------|----------|
| _(none yet)_ | | | | |

---

## How items arrive here

An agent following **[prompt-cleanup-one-item.md](./prompt-cleanup-one-item.md)** bails out when the work is ambiguous, risky, or needs a product/design call. It **keeps the row** in [cleanup-todo-list.md](./cleanup-todo-list.md) but sets **Done** to `[→ manual YYYY-MM-DD]`, and appends a full row **here** with the deferral reason (the main table still shows *what* was attempted).
