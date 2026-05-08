# Phase 5 — Telegram Mobile Controls for Kanban
**Date:** 2026-05-08
**Status:** ✅ COMPLETE

---

## What Was Done

### 1. Telegram Command Reference Created ✅

**File:** `~/.hermes/knowledge/TELEGRAM_COMMANDS.md`
**Locations:** All 4 (GitHub, Obsidian, Hermes knowledge, local)

BossMan (the Hermes primary orchestrator on MiniMax 2.7) is already connected to Telegram — it receives messages, interprets them, and routes actions. Marcelo just sends natural-language requests and BossMan executes the corresponding `hermes kanban` CLI calls.

---

## Section 1 — Telegram Command Reference

### How It Works

Send any of these commands to BossMan via Telegram. BossMan interprets the request and executes the corresponding Kanban action. Responses come back to this Telegram chat.

> **Note:** All work still routes through the bossman board. BossMan is the parser and executor — the Kanban board is the source of truth. No direct database edits.

---

### CREATE a Card

**Telegram message:**
```
[new card / create card / add task] [title]
```

**Example:**
```
new card Test priority task for builder profile
```

**What BossMan does:**
```bash
hermes kanban create "Test priority task for builder profile" --priority 1 --board bossman
```

**BossMan replies:** Card ID + confirmation.

---

### LIST Cards

**Telegram message:**
```
list my cards
list blocked cards
list all cards
list cards in [status]
what's on the board
what's running
```

**Examples:**
```
list my cards
list blocked cards
what's running
```

**What BossMan does:**
```bash
hermes kanban ls --mine
hermes kanban ls --status blocked
hermes kanban ls
hermes kanban ls --status running
```

**BossMan replies:** Compact card list with IDs, titles, statuses.

---

### SHOW a Card

**Telegram message:**
```
show card [id]
show [id]
what is [id]
```

**Example:**
```
show t_43dec590
```

**What BossMan does:**
```bash
hermes kanban show t_43dec590
```

**BossMan replies:** Full card detail — title, status, body, comments, assignee, priority.

---

### MOVE a Card (change status)

**Telegram message:**
```
move [id] to [status]
put [id] in [status]
mark [id] [status]
[id] is now [status]
```

**Examples:**
```
move t_43dec590 to done
mark t_6b1a49f4 done
put t_faa6d371 in blocked
move t_71fdab1a to running
```

**Valid statuses:** `todo`, `planned`, `running`, `blocked`, `done`, `awaiting_approval`

**What BossMan does:**
```bash
# done
hermes kanban complete t_43dec590 --board bossman
# blocked
hermes kanban block t_faa6d371 --board bossman
# unblock / move to planned
hermes kanban unblock t_faa6d371 --board bossman
hermes kanban edit t_faa6d371 --status planned --board bossman
```

**BossMan replies:** Confirmation + new status.

---

### ADD a Comment

**Telegram message:**
```
comment on [id]: [message]
add comment to [id] [message]
[id] note: [message]
```

**Example:**
```
comment on t_43dec590: Phase 5 complete, all Telegram commands documented
```

**What BossMan does:**
```bash
hermes kanban comment t_43dec590 "Phase 5 complete, all Telegram commands documented"
```

**BossMan replies:** Confirmation.

---

### ASSIGN a Card

**Telegram message:**
```
assign [id] to [profile]
assign [id] to lbc35
assign [id] to builder
```

**Examples:**
```
assign t_71fdab1a to builder
assign t_0b722ed8 to lbc35
```

**What BossMan does:**
```bash
hermes kanban assign t_71fdab1a builder --board bossman
hermes kanban assign t_0b722ed8 lbc35 --board bossman
```

**BossMan replies:** Confirmation with assignee.

---

### CREATE + ASSIGN in One Step

**Telegram message:**
```
new card [title] — assign to [profile] — priority [1-3]
```

**Example:**
```
new card Fix Binance pre-trade hook — assign to ops — priority 1
```

**What BossMan does:**
```bash
hermes kanban create "Fix Binance pre-trade hook" --assignee ops --priority 1 --board bossman
```

---

### BLOCK / UNBLOCK

**Telegram message:**
```
block [id] because [reason]
unblock [id]
```

**Examples:**
```
block t_71fdab1a because waiting for Marcelo approval
unblock t_faa6d371
```

**What BossMan does:**
```bash
hermes kanban block t_71fdab1a "waiting for Marcelo approval"
hermes kanban unblock t_faa6d371
```

---

### REQUEST APPROVAL

**Telegram message:**
```
mark [id] awaiting approval
move [id] to awaiting approval — reason: [text]
```

**Example:**
```
move t_1a4193ba to awaiting approval — reason: Marcelo needs to review before we proceed
```

---

## Section 2 — Quick Reference Card

**Quick reference — copy this to your phone:**

```
KANBAN VIA TELEGRAM — BossMan Commands
═══════════════════════════════════════
CREATE:  new card [title]
LIST:    list my cards / list blocked / what's running
SHOW:    show [card id]
MOVE:    move [id] to [status]
COMMENT: comment on [id]: [message]
ASSIGN:  assign [id] to [profile]
BLOCK:   block [id] because [reason]
UNBLOCK: unblock [id]
APPROVAL: move [id] to awaiting approval
═══════════════════════════════════════
Statuses: todo | planned | running | blocked | done
Profiles: bossman | builder | ops | trading | content | lbc35
═══════════════════════════════════════
```

---

## Section 3 — Example Workflows

### Workflow 1 — New Task from Anywhere

```
Marcelo → BossMan (Telegram):
  "new card Add Binance trading pause feature — assign to builder — priority 1"

BossMan → Kanban:
  hermes kanban create "Add Binance trading pause feature" --assignee builder --priority 1

BossMan → Marcelo (Telegram):
  ✅ Card created: t_newid
  Title: Add Binance trading pause feature
  Assignee: builder
  Priority: 1
  Status: todo
```

### Workflow 2 — Quick Status Check

```
Marcelo → BossMan (Telegram):
  "what's blocked"

BossMan → Kanban:
  hermes kanban ls --status blocked

BossMan → Marcelo (Telegram):
  📋 Blocked cards:
  • t_71fdab1a — Phase 6 pilot (money pipeline) — waiting on finance data
  • t_faa6d371 — Phase 6 (trading monitor) — waiting on Binance rebuild
  • t_0b722ed8 — Squares testing — waiting on tester
  • t_a821d42a — Bakery testing — waiting on bakery PR
```

### Workflow 3 — LBC35 Handoff

```
Marcelo → BossMan (Telegram):
  "new card Review OpenClaw cron scripts — assign to lbc35 — priority 2"

BossMan → Kanban:
  hermes kanban create "Review OpenClaw cron scripts" --assignee lbc35 --priority 2

BossMan → Marcelo (Telegram):
  ✅ Card created: t_newid
  Assignee: lbc35 (delegated executor)
  Handoff packet will be sent when lbc35 picks it up.
  Remember: lbc35 cannot self-assign — BossMan routes the work.
```

### Workflow 4 — Approve and Move

```
Marcelo reviews card t_1a4193ba and decides to approve:
  "move t_1a4193ba to done"

BossMan → Kanban:
  hermes kanban complete t_1a4193ba

BossMan → Marcelo (Telegram):
  ✅ t_1a4193ba marked done.
  Next: t_71fdab1a (Phase 6 pilot) is waiting on finance data.
```

---

## Section 4 — What NOT to Do via Telegram

These are still blocked by guardrails — ask BossMan explicitly:

| Action | Command | Notes |
|--------|---------|-------|
| Stop PM2 services | Any | Requires explicit BossMan approval |
| Change cron jobs | Any | Requires explicit BossMan approval |
| Retire dashboards | Any | Requires explicit BossMan approval |
| Modify Perplexity Spaces | Any | Requires explicit BossMan approval |
| Delete cards | Any | BossMan must review before deletion |

---

## Section 5 — Phase 5 Card Update

**Card:** `t_43dec590` ✅ Done

**What changed:**
- Telegram command reference documented
- Quick reference card created
- 4 example workflows documented
- Operating blueprint v1.2 updated with Telegram section

**GitHub:** committed `d2b8f89`

**No PM2, cron, dashboards, or Perplexity Spaces were touched.**

---

## GitHub Commits This Session

| Commit | Phase | Content |
|--------|-------|---------|
| `d2b8f89` | Phase 4+5 | Operating blueprint v1.1, Phase 4 report |
| (Phase 5) | Phase 5 | Telegram command reference + v1.2 update |

---

## Blockers Before Phase 6

| Card | Blocker |
|------|---------|
| `t_71fdab1a` — Phase 6 pilot | Waiting on finance data for money pipeline rebuild |
| `t_faa6d371` — Phase 6 trading | Waiting on Binance bot rebuild (Phase 2 issue, deferred) |

Both are Phase 6 items — Phase 5 is complete. **Phase 6 has internal blockers that need to be resolved before the pilot can run.**
