# Agent File Structure — OpenClaw Brain Bootstrap Path

**Source:** OpenClaw SOUL.md, AGENTS.md, TOOLS.md
**Status:** Active — OpenClaw agent bootstrap files

---

## OpenClaw Agent Files (LBC35/OpenClaw Startup)

These are the files LBC35/OpenClaw reads at startup, in order:

```
~/Desktop/Openclaw Brain/Openclaw Brain/
├── SOUL.md                    ← Identity and purpose (updated Phase 3)
├── AGENTS.md                 ← Agent roles and responsibilities (updated Phase 3)
├── TOOLS.md                  ← Environment and integrations (updated Phase 3)
├── TOOLS-REFERENCE.md        ← Large reference tables (not in bootstrap)
├── AGENTS-REFERENCE.md       ← Extended agent notes
├── BOT_HANDOFF.md            ← Handoff protocol notes
├── PROTOCOL.md               ← Archived (Phase 3 Wave 2) — pre-Phase 3
├── SYSTEM_INSTRUCTIONS.md    ← Archived (Phase 3 Wave 2) — pre-Phase 3
├── CONTEXT-MANAGEMENT.md
├── memory/                   ← Daily memory notes
├── docs/
│   └── SYSTEM_SERVICES_MAP.md  ← Archived (Phase 3 Wave 2) — replaced by Hermes
└── archive/
    └── phase-2-deprecated/   ← Archived Phase 2 docs (Phase 3 Wave 2)
```

---

## Files Updated in Phase 3

| File | Change | Commit |
|------|--------|--------|
| `SOUL.md` | Architecture note added, LBC35 role corrected | `f5eaa691` |
| `AGENTS.md` | Phase 3 demotion header, role retitled | `f5eaa691` |
| `TOOLS.md` | Orchestration corrected, vault hierarchy, cron ownership | `f5eaa691` |
| `PROTOCOL.md` | Archived to `archive/phase-2-deprecated/` | `399141d` |
| `SYSTEM_INSTRUCTIONS.md` | Archived to `archive/phase-2-deprecated/` | `399141d` |
| `docs/SYSTEM_SERVICES_MAP.md` | Archived to `archive/phase-2-deprecated/` | `399141d` |

---

## Hermes Agent Files (Separate from OpenClaw)

Hermes uses a different profile system. BossMan profile reads:

```
~/.hermes/profiles/bossman/
├── SOUL.md                   ← BossMan personality (minimal)
├── PROFILE.md               ← Profile config
└── instructions.md          ← Profile instructions

~/.hermes/knowledge/          ← Primary operational docs
├── OPERATING_BLUEPRINT.md   ← Canonical architecture
├── LBC35_SOUL_v2_delegated_executor.md
├── TELEGRAM_COMMANDS.md
├── SERVICES_MAP.md
└── PHASE*_REPORT.md
```

---

## Agent Hierarchy

```
BossMan (Hermes bossman profile)
  ├── Routes all work
  ├── Owns Kanban board
  └── Owns OPERATING_BLUEPRINT.md

LBC35 (OpenClaw — delegated executor)
  ├── Reads OpenClaw Brain files
  ├── Executes BossMan-assigned tasks
  └── Reports back to BossMan

Hermes Builder, Ops, Trading, Content (Hermes profiles)
  └── Execute what BossMan assigns

Bot team (DWDAWGBOT, YTDAWGBOT, etc.)
  └── Coordinated by LBC35 within delegated scope
```

---

## Key Distinction

OpenClaw Brain files are for **LBC35 and the bot team**. Hermes knowledge is for **BossMan and the Hermes profiles**.

When LBC35 needs operational context, it reads from OpenClaw Brain.
When BossMan needs operational context, it reads from `~/.hermes/knowledge/`.

The two systems are **separate but connected** — BossMan routes work to LBC35, LBC35 executes using OpenClaw Brain files.

---

## Bootstrap Order

1. SOUL.md — Who you are (LBC35 identity + Phase 3 architecture note)
2. AGENTS.md — What you do (role: delegated executor)
3. TOOLS.md — How you work (constraints, vault hierarchy, cron ownership)

All three updated in Phase 3 to reflect Hermes-primary architecture.