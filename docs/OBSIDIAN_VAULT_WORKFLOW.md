# Obsidian Vault Workflow — Permanent Operating Standard

**Version:** 2.0
**Date:** 2026-06-13
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** Canonical — replaces OBSIDIAN_RULES.md v1.0 (2026-03-24)
**Supersedes:** `/Users/bigdawg/Desktop/CLAW-Backup/memory/OBSIDIAN_RULES.md`

---

## 1. Purpose

This document defines the **permanent operating standard** for all Obsidian vault interactions across BossMan, Hermes agents, and Marcelo's personal knowledge workflow. It replaces the ad-hoc OBSIDIAN_RULES.md v1.0 with a formal, enforceable standard that covers read/write operations, mirroring between Hermes knowledge and the vault, daily note workflow, git integration, and security boundaries.

---

## 2. Vault Identification (Discovery Order)

| Priority | Vault | Path | Status | Notes |
|----------|-------|------|--------|-------|
| **PRIMARY** | CLAW-Backup | `~/Desktop/CLAW-Backup/` | ✅ **Active — canonical** | Full agent brain, daily notes, learn/knowledge base, agents/, memory/, projects/ |
| **SECONDARY** | Openclaw Brain | `~/Desktop/Openclaw Brain/Openclaw Brain/` | ⚠️ **Credential-sensitive** | Contains `bot-tokens.env` with live Telegram tokens. Read-only unless explicitly assigned. |
| **FALLBACK** | iCloud | `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/` | ❌ Often empty | Sync-dependent. Not for active work. |

**Verification:** A directory is a real Obsidian vault if it contains a `.obsidian/` subfolder.

**Policy:**
- All new agent-initiated writes go to **CLAW-Backup only**.
- The secondary vault is **read-only unless specifically assigned**.
- Never write credentials, tokens, or secrets to **any** Obsidian vault (use `.env` files outside the vault).

---

## 3. Vault Structure — CLAW-Backup

```
~/Desktop/CLAW-Backup/
├── .obsidian/             # Obsidian config (do not touch)
├── .git/                  # Git repo (see §7 Git Integration)
│
├── AGENTS.md              # Agent delegation rules (mirror of ~/.hermes/AGENTS.md)
├── USER.md                # User profile
├── SOUL.md                # Agent soul / identity
├── OPERATING_BLUEPRINT.md # Canonical operating document
├── ROUTING-RULES.md       # Aliased to RULES (team preference)
├── README.md              # Vault documentation
│
├── memory/                # Long-term system/personal memory
│   ├── OBSIDIAN_RULES.md  # [DEPRECATED — points to this doc]
│   ├── TELEGRAM_NOTIFICATION_RULES.md
│   └── ...                # Per-date memory files
│
├── learn/                 # Knowledge files (LEARNED_* patterns)
│   ├── LEARNED_BINANCE_API.md
│   ├── LEARNED_PYTHON.md
│   └── ...
│
├── daily/                 # Daily notes (YYYY-MM-DD.md)
│
├── projects/              # Project notes and specs
│   ├── Money-Pipeline.md
│   ├── SquarePayouts.md
│   └── ...
│
├── sessions/              # Standalone session notes
│
├── agents/                # Bot agent config files
│
├── reference/             # Reference documents
│
└── test/                  # Test/scratch notes (clean periodically)
```

### 3.1 Folder Rules

| Folder | Write Allowed | Read Frequency | Retention |
|--------|---------------|----------------|-----------|
| `/` (vault root) | ✅ Operating standards only | Always (canonical docs) | Permanent |
| `daily/` | ✅ Agent logs, summaries | Session start | 1 year |
| `memory/` | ✅ Permanent decisions, preferences | Session start, context recovery | Permanent |
| `learn/` | ✅ Knowledge files | On project reference | Permanent |
| `projects/` | ✅ Project specs | On project work | Permanent |
| `sessions/` | ✅ Standalone session notes | On reference | 1 year |
| `agents/` | ❌ BossMan only | Rare | Permanent |
| `reference/` | ❌ Reference docs only | On need | Permanent |
| `test/` | ✅ Scratch work | Rare | Clean on archive |
| `.obsidian/` | ❌ NEVER | NEVER | Protected |
| `.git/` | ❌ NEVER | NEVER | Protected |
| Hidden/dotfolders | ❌ NEVER | NEVER | Protected |

---

## 4. Hermes Knowledge ↔ Obsidian Mirror Pattern

A subset of documents lives in **both** `~/.hermes/knowledge/` and `~/Desktop/CLAW-Backup/`. This is by design:

| Hermes knowledge path | Obsidian vault path | Purpose |
|-----------------------|---------------------|---------|
| `~/.hermes/AGENTS.md` | `~/Desktop/CLAW-Backup/AGENTS.md` | Agent delegation rules |
| `~/.hermes/SOUL.md` | `~/Desktop/CLAW-Backup/SOUL.md` | Agent soul |
| `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md` | `~/Desktop/CLAW-Backup/OBSIDIAN_VAULT_WORKFLOW.md` | THIS STANDARD |

### 4.1 Mirror Rules

- **Hermes knowledge (`~/.hermes/knowledge/`)** is the **authoritative source** for agent-facing documents.
- **Obsidian vault** is the **human-facing mirror** — Marcelo reads and browses here.
- When a doc is updated in Hermes knowledge, the Obsidian mirror should be updated within the same session.
- **Do NOT update the Obsidian mirror without updating Hermes knowledge**, and vice versa. They must stay in sync.
- The BossMan repo (`~/Repos/BossMan/docs/`) is the **public GitHub mirror** — used for version control and collaboration.

### 4.2 Document Lifecycle

```
New document created in Hermes knowledge
    ↓
Mirrored to Obsidian vault (CLAW-Backup root or appropriate subfolder)
    ↓
Added to BossMan repo docs/ (if it's an operating standard or permanent rule)
    ↓
Referenced in ROUTING-RULES.md or AGENTS.md if it governs routing
    ↓
Updated in sync across all 3 locations on revision
```

---

## 5. Read Workflow (How BossMan Reads From the Vault)

### 5.1 When to Read the Vault

BossMan reads from Obsidian when:

| Trigger | What to Read |
|---------|-------------|
| Session start | Today's `daily/YYYY-MM-DD.md` (if exists) + `memory/` for context continuity |
| Project work | Relevant `projects/<project-name>.md` or subfolder |
| Deep project history | `sessions/`, `memory/`, `learn/` — Tier 4 in memory search priority |
| Decision recall | `memory/MEMORY_CAPTURE_LOG.md` or per-date memory files |
| Agent config check | `agents/AGENTS.md` or root `AGENTS.md` |

### 5.2 Search Priority (From Memory Policy)

When searching memory, use this priority order:

1. **FTS (`session_search`)** — recent sessions, specific events (Tier 1)
2. **`~/.hermes/knowledge/`** — project docs, learned files (Tier 2)
3. **`~/.hermes/SOUL.md` / `~/.hermes/AGENTS.md`** — identity and routing (Tier 3)
4. **Obsidian vault** — deep project history (Tier 4)

The vault is for **deep project history and long-term context**, not daily operational lookup.

### 5.3 Read Method

```
When reading from the vault:
1. Resolve absolute path — never use ~/ or $VAR in file tool calls
2. Use read_file (preferred) — line numbers, pagination
3. Use search_files for content/name searches — not grep/find
4. Quote paths with spaces in terminal commands
```

---

## 6. Write Workflow (How BossMan Writes to the Vault)

### 6.1 What Gets Written

| Type | Goes to | Example |
|------|---------|---------|
| Operating standards | Vault root | OBSIDIAN_VAULT_WORKFLOW.md, OPERATING_BLUEPRINT.md |
| Daily logs | `daily/YYYY-MM-DD.md` | End-of-day summaries, agent logs |
| Permanent decisions | `memory/` | `memory/YOUR_MEMORY.md` |
| Learned knowledge | `learn/` | `learn/LEARNED_DOMAIN.md` |
| Project specs | `projects/` | `projects/Project-Name.md` |
| Session notes | `sessions/` | `sessions/YYYY-MM-DD-Topic.md` |

### 6.2 Write Method

```
When writing to the vault:
1. Resolve absolute path
2. Use write_file (preferred) — structured, no shell quoting issues
3. Use patch for targeted edits (append, replace sections)
4. Use terminal only for file copying between Hermes knowledge and vault
```

### 6.3 Write Triggers (Proactive — No Prompting Required)

Write to the vault immediately when:

- **Session completion:** At least a daily log entry or summary
- **Project decision:** Save to `projects/` or `memory/`
- **New operating rule:** Save to vault root or `memory/`
- **Knowledge discovery:** Save to `learn/`
- **End of day:** End-of-day summary appended to daily note

**This is not optional — it's the permanent standard. If you don't write it, it doesn't exist for future sessions.**

### 6.4 Daily Note Format

```markdown
# YYYY-MM-DD

## Agent Log
- HH:MM – [BotName] – Short description of action or decision
- HH:MM – [BotName] – Another action

## Meetings
- [Meeting name] — [key outcomes]

## Daily Summary
- 3-5 bullet points: key decisions and actions
- 1-2 bullet points: open loops / follow-ups for tomorrow
```

---

## 7. Security Boundaries

### 7.1 Vault Separation

| Vault | Security Level | Policy |
|-------|---------------|--------|
| CLAW-Backup | **Public-facing** | All agent deliverables, operating docs, project knowledge go here |
| Openclaw Brain | **Credential-carrying** | Contains `bot-tokens.env` with live Telegram API tokens. NEVER write to this vault unless explicitly assigned. NEVER read credential file contents aloud in responses. |

### 7.2 NEVER Write to Obsidian

- Live credentials, API keys, tokens, passwords
- `.env` files or credential dumps
- Private keys or certificates
- Credit card numbers, SSNs, or PII
- Anything the user explicitly marked as "off the record"

### 7.3 Credential Exposure Response

If `bot-tokens.env` or similar credential files are found during a vault search:
1. Note their existence and location
2. Flag them immediately to Marcelo as a security exposure
3. Do NOT read token values aloud in responses
4. Recommend deletion/rotation as a priority action

---

## 8. Git Integration

### 8.1 Vault Git Status

Both CLAW-Backup and the BossMan repo are git repositories:

- **CLAW-Backup**: Active git repo at `~/Desktop/CLAW-Backup/.git/`
- **BossMan repo**: Active git repo at `~/Repos/BossMan/.git/`

### 8.2 Git Workflow for Vault Changes

When updating operating standards in the vault:

```
1. Write the file (write_file or patch)
2. Verify the content reads back correctly
3. Commit with descriptive message
4. Note: CLAW-Backup commits use existing conventions
```

**Commit trailer (for BossMan repo):**
```
Profile: bossman-profile
Task: <task_id>
Approval: auto
```

This standard document itself uses auto-approval (SAFE_AUTONOMOUS — documentation only, no infra mutation).

---

## 9. Integration With Hermes Routes

### 9.1 Memory Policy Reference

The Obsidian vault is the **Tier 4** memory store in the Hermes memory system (from SOUL.md Memory Automation Policy):

```
Search priority:
1. FTS (session_search) — recent sessions, specific events
2. ~/.hermes/knowledge/ — project docs, learned files
3. SOUL.md / AGENTS.md — identity and routing rules
4. Obsidian vault — deep project history
```

### 9.2 Routing Rules Reference

From ROUTING-RULES.md v3.0:

```
Mirrors (kept in sync):
- ~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md (Hermes knowledge)
- ~/Desktop/CLAW-Backup/OBSIDIAN_VAULT_WORKFLOW.md (Obsidian vault)
- ~/Repos/BossMan/docs/OBSIDIAN_VAULT_WORKFLOW.md (GitHub mirror)
```

---

## 10. Staleness & Review

| Aspect | Review Frequency | Refresh Trigger |
|--------|-----------------|----------------|
| Vault structure | Annually | New folder pattern adopted |
| Mirror mappings | Per document revision | Document updated |
| Security boundaries | Per incident | Credential exposure detected |
| Git workflow | Per vault architecture change | Vault restructured |
| This standard | 90 days | Workflow changes or breaks |

---

## 11. Version History

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 2.0 | 2026-06-13 | Complete rewrite as permanent operating standard. Supersedes OBSIDIAN_RULES.md v1.0 (2026-03-24). | BossMan |
| 1.0 | 2026-03-24 | Initial OBSIDIAN_RULES.md created (now deprecated). | OpenClaw |

---

## 12. Canonical Locations

| Copy | Path |
|------|------|
| Hermes knowledge (authoritative) | `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md` |
| Obsidian vault (human-facing mirror) | `~/Desktop/CLAW-Backup/OBSIDIAN_VAULT_WORKFLOW.md` |
| BossMan repo (GitHub mirror) | `~/Repos/BossMan/docs/OBSIDIAN_VAULT_WORKFLOW.md` |

---

*This standard replaces all prior Obsidian vault usage rules. Cross-reference: OBSIDIAN_RULES.md v1.0 at `~/Desktop/CLAW-Backup/memory/OBSIDIAN_RULES.md` is superseded. That file should link to this document.*
