---
name: migration-playbook
description: "Marcelo's multi-phase infrastructure migration framework. Phase-gated execution, blocker-resolution workflow, live-money safety rules, and doc-sync conventions for migrating between agent/orchestrator systems."
version: 1.0.0
author: Hermes / Marcelo
license: proprietary
metadata:
  hermes:
    tags: [migration, infrastructure, multi-phase, kanban, openclaw, hermes]
    related_skills: [kanban-orchestrator]
---

# Migration Playbook

Framework for executing multi-phase infrastructure migrations with phase-gated approval, live-system safety rules, and per-phase doc-sync discipline.

**Applies to:** Marcelo's environment — Hermes primary control migration from OpenClaw/LBC35
**Reference docs:** `docs/PHASE1_AUDIT_REPORT.md`, `docs/PHASE2_PLANNING.md`, `docs/BLOCKER_RESOLUTIONS.md`, `docs/SERVICES_MAP.md`

## Scope & STOPs (Permanent — 2026-06-23)

**Purpose:** Make explicit what migration-playbook may auto-execute vs what must escalate to operator. Tied to v3 Routing Ledger + Step-5 QA rule.

### Autonomous scope (migration-playbook may auto-execute without operator approval)

- **Phase plan creation** (phase 1, 2, 3 structure with goals + success criteria)
- **Phase gate checks** at boundaries — verify deliverables complete before unblocking next phase
- **Doc-sync at phase boundaries** — PHASEREPORT entry, Services Map updates, reference doc refresh
- **Migration templates** (canonical path: docs → scripts → kanban → execution → verify)
- **Read-only inspection** of legacy and target systems to map differences

### Approval gates (operator approval REQUIRED)

- **Cutover decisions** — every cutover between systems needs explicit operator go
- **Rollback decisions** — operator must approve any rollback during a migration
- **New infra installations** (Homebrew packages, databases, Caddy, Tailscale, OS-level tools, language runtimes, daemons)
- **Public/VPN port changes** during migration (opening/closing/repointing)
- **New cron schedules** triggered as part of migration

### STOP conditions (MUST halt and escalate)

- **Money systems live during migration** — never migrate a live money pipeline without rollback plan + operator approval
- **Auth/credential rotation** during migration — explicit operator approval per change
- **Env file changes** — never auto-edit during migration
- **SOUL.md / AGENTS.md / ROUTING-RULES.md / MODELROUTINGWORKFLOW.md edits** — kernel-doc; never in migration scope without explicit operator approval
- **Conflicting canon between migration phases** — STOP and surface
- **Vendor/API/billing decisions during migration** — explicit operator approval
- **Production cutover without rollback plan** — STOP and refuse
- **AI model disagreement on phase sequencing** — STOP

### Routing Ledger (what a card invoking migration-playbook looks like)

| Field | Value |
|---|---|
| work_type | existing_build (multi-phase) |
| lead_model | bossman |
| cost_tier | high (long-running, multi-phase, infra-touching) |
| qa_required | yes (mandatory Step-5 per phase) |

### Step-5 QA rule

Step-5 verifier (DeepSeek or best available reasoning model) required at every phase boundary. Each phase completion must be Step-5 PASSED before next phase starts. Migrations touching money/auth/PII need Step-5 per-card within a phase, not just per-phase.

### Canonical references

- AGENTS.md (M3 routing) — `~/.hermes/AGENTS.md`
- ROUTING-RULES v3 — `~/Projects/BossMan/docs/ROUTING-RULES.md`
- PHASEREPORT — `~/Projects/BossMan/PHASEREPORT.md`
- ACP (governance parent) — `~/.hermes/skills/autonomous-change-pipeline/SKILL.md`
- Phase 2 hardening entry — `~/.hermes/knowledge/PHASEREPORT_AUTONOMY_PHASE2_2026-06-23.md` (forthcoming)

---

## Phase Lifecycle

Each phase follows this sequence:

```
PLANNING PHASE (no live changes)
  → Document findings
  → Propose actions with risk/impact
  → Marcelo reviews and approves
  
APPROVED → EXECUTION PHASE (apply changes)
  → Execute approved actions only
  → Update Kanban card
  → Sync docs to 4 locations
  
DONE → Next phase card unblocks
```

**Rule:** Never execute changes in a planning phase. Never skip the planning phase for an execution phase.

---

## Blocker Resolution Workflow

When a critical blocker is found mid-audit:

### Step 1 — Isolate the blocker
Stop the investigation of other items. The blocker gates everything downstream.

### Step 2 — Capture the evidence
```bash
# Unknown port → owner → process → command
lsof -i :<PORT>          # Get PID
ps -p <PID> -o args=     # Get exact command
```

### Step 3 — Classify the risk
| Level | Meaning | Action |
|-------|---------|--------|
| 🚨 Critical | Live money / active business broken | Stop/pause immediately, Marcelo approval required |
| ⚠️ Warning | Degraded but running | Document, defer to later phase |
| 🔍 Ambiguity | Not enough data | Identify before acting |

### Step 4 — Propose options with Marcelo approval
Present: exact action + risk/impact + whether Marcelo must approve first.

### Step 5 — Execute approved action only
No side changes. No "while I'm here" improvements.

### Step 6 — Sync decisions
Update `BLOCKER_RESOLUTIONS.md` in all 4 locations. Update Kanban card comment.

---

## Live-Money Safety Rule

**For any bot, trading system, or financial automation:**

1. **Never blind-fix.** Capture logs first, identify root cause, then propose fix.
2. **Stopping is always safe.** `pm2 stop <name>` is reversible, no data lost.
3. **Pausing is an option.** Set env var + restart preserves state.
4. **Pre-trade hooks missing = silent safety gap**, not a crash. Trades go through without the safety review. Treat as critical.
5. **Get explicit Marcelo approval before any intervention** on live-money systems.

---

## Port Investigation Sequence

When encountering an unknown port or service conflict:

```bash
# 1. Who owns it?
lsof -i :<PORT>

# 2. What's the exact process command?
ps -p <PID> -o args=

# 3. Is it Hermes gateway (LaunchAgent) or PM2?
#    Hermes gateway = python/hermes_cli/main.py gateway run --replace
#    Not a web port — messaging/Telegram only

# 4. Check PM2 for known service
pm2 list

# 5. Verify binary exists (for broken cron job paths)
ls /Users/bigdawg/Projects/<name>/
```

---

## Cron Job Safety

Before migrating or removing a cron job:

1. **Verify the script path still exists** — broken symlinks or deleted projects = silently failing jobs
2. **Check crontab owner** — `crontab -l` shows current user crontab
3. **Test the script manually** before relying on it
4. **Broken cron + financial system = silent data loss risk** — document and escalate

### Cron Hanging Workaround (macOS / this environment)

On this Mac mini, `crontab -e` and `crontab -` (stdin write) hang indefinitely due to zsh shell hook interference with the SUID binary. See `references/macos-cron-hang-workaround.md` for the full pattern — always check there before attempting remote cron edits. The workaround is to pipe `sed` through `crontab -` inside an interactive terminal session on the machine itself.

---

## Cloudflare Tunnel Setup (Tailscale Funnel Alternative)

When Tailscale Funnel is blocked by Google SSO ACL lock ("Managed via external system"), Cloudflare Tunnel provides a working public URL alternative.

### Cloudflare API Token — Correct Scope

**Critical:** The pre-built "Edit Cloudflare Workers" token template does NOT include tunnel management permissions. Use a **custom token** with these permissions:

```
Account permissions:
  - Cloudflare Tunnel: Edit
  - Account Settings: Read
Zone permissions:
  - All zones (or specific domain)
```

Standard "Edit Cloudflare Workers" template → 403 on tunnel API. Custom token with "Cloudflare Tunnel: Edit" → works.

### Interactive Token Input Pattern

When acquiring an API token from Marcelo, prefer interactive input over copy-paste:

```bash
echo "Paste your Cloudflare token and press Enter:" && read TOKEN && curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" -H "Authorization: Bearer $TOKEN"
```

**Rationale:** Marcelo prefers typing the token in one place rather than copy-pasting between Terminal and the chat. The `read` builtin handles this cleanly.

### Tunnel Setup Sequence (API-based, no browser required)

```bash
# 1. Verify token
curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer $TOKEN"

# 2. Get account ID (if unknown)
curl -s "https://api.cloudflare.com/client/v4/accounts" \
  -H "Authorization: Bearer $TOKEN" | python3 -c "import json,sys; [print(a['id'], a['name']) for a in json.load(sys.stdin)['result']]"

# 3. Create tunnel
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/tunnels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"<TUNNEL_NAME>","tunnel_type":"cloudflare"}'

# 4. Get credentials file
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/tunnels/<TUNNEL_ID>/credentials" \
  -H "Authorization: Bearer $TOKEN"

# 5. Write credentials to ~/.cloudflared/credentials.json
# 6. Update ~/.cloudflared/config.yml with tunnel ingress
# 7. Run cloudflared as service
```

### Ingress config for SquarePayouts (example)

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /Users/bigdawg/.cloudflared/credentials.json
ingress:
  - hostname: <SUBDOMAIN>.trycloudflare.com
    service: http://127.0.0.1:8030
  - service: http_status:404
```

### If Cloudflare Dashboard blocks browser automation

Cloudflare Dashboard (`dash.cloudflare.com`) aggressively blocks headless browsers. If automation is blocked:
1. Skip the browser — use the API directly (cloudflared CLI + curl)
2. Marcelo creates the token in his regular browser, pastes to BossMan via the interactive prompt
3. All tunnel management can be done via API — no Dashboard UI needed after token creation

## Doc Sync Convention

All migration artifacts sync to 4 locations simultaneously:

| Location | Path |
|---------|------|
| Local | `~/Desktop/hermes-docs/<DOC>.md` |
| GitHub | `~/Repos/BossMan/docs/<DOC>.md` |
| Obsidian | `~/Obsidian/Hermes/Systems/<DOC>.md` |
| Hermes knowledge | `~/.hermes/knowledge/<DOC>.md` |

```bash
SOURCE="~/Desktop/hermes-docs/<DOC>.md"
cp "$SOURCE" ~/Repos/BossMan/docs/
cp "$SOURCE" ~/Obsidian/Hermes/Systems/
cp "$SOURCE" ~/.hermes/knowledge/
# Then git add + commit + push in BossMan
```

## Canon Rewrite Pattern (Class of Edits, Not a Single Doc)

The Doc Sync Convention above is for *new* docs. Canon rewrites are different: an existing class of docs is being updated to reflect a new policy, and the same edit needs to land in every mirror at the same time. Pattern captured 2026-06-03 during the Default Build Flow canon rewrite.

### When to use this pattern

- A new operating policy replaces an old one (e.g. "MiniMax 2.7 primary brain" → "M3 + model stack")
- A new convention is canonized (e.g. `model_plan:` line on every Kanban card)
- A standing rule is being clarified or sharpened (e.g. "LBC35 does not choose models")
- One canon doc + N mirrors all need the same class of edit

### The 6-step sequence

1. **Identify the class of edits and the file list first.** Use `find` / `grep` to enumerate every file that mentions the old framing. Don't start patching until you have the list.
   ```bash
   grep -rln "MiniMax 2.7\|M2\.7\|primary brain" \
     ~/.hermes ~/Repos/BossMan/docs ~/.hermes/spaces 2>/dev/null
   ```
2. **Classify each hit as either intentional traceback (keep) or stale (rewrite).** Version history entries, "replaces the old X" paragraphs, and the M2.7→M3 migration notes section are intentional traceback — they stay. Active model role descriptions, system maps, project kickoff protocols, and pool tables are stale — rewrite them.
3. **Write the canonical first** (under `~/.hermes/knowledge/`). Use `patch` for surgical edits, `write_file` for new docs, `read_file` first to confirm context. Never start by editing mirrors.
4. **Copy mirrors via `cp`, then `patch` for the divergence points.** If a mirror is identical to canonical after a `cp`, commit. If a mirror has different framing (e.g. spaces/agent-os/03-routing-rules.md was actually a misfiled LBC35 SOUL), `patch` it into the right content.
5. **Sweep at the end with the same grep from step 1.** Every remaining hit should be intentional traceback. If you find a stale one, fix it. Do the sweep, do not skip it.
6. **Commit each repo separately with `feat(docs):` prefix.** Each repo gets its own commit with a body that lists the files changed and the policy shift. Two repos in one commit makes rollback harder.

### Pitfalls

- **Misnamed mirror files.** `~/.hermes/spaces/agent-os/03-routing-rules.md` was an LBC35 SOUL mirror, not routing rules. Always `head` the file before assuming its role.
- **Pre-existing untracked files in the target repo.** `~/Repos/BossMan/docs/perplexity-spaces/agent-os/05-ai-stack-v2.md` (dated May 27) was not from this session. Filter `git status --short` output before staging. Only `git add` the files you actually touched.
- **Traceback references look like orphans.** "MiniMax 2.7" appears in v1.0/v1.1/v2.0 version history entries, in "replaces the old X" intros, and in the M2.7→M3 migration notes section. These are the audit trail. Do not strip them.
- **Mistrust a `diff` that shows files differ at the line where you copied them.** Always re-`diff -q` after the `cp` to confirm. A subtle encoding issue can corrupt the mirror.
- **The first sweep is reconnaissance; the last sweep is verification.** They use the same command, but the first one tells you the size of the work and the second one tells you the work is complete.
- **Mixed-source `M` files in `git status`.** When the working tree has pre-existing modifications from an earlier session, `git add` only the specific files you just edited. `git add .` will drag in unrelated changes.

### Example: Default Build Flow canon rewrite (2026-06-03)

- Old: "MiniMax 2.7 primary brain" framing in 9+ docs across 2 repos
- New: 5-step Default Build Flow (Perplexity → M3 → primary builder → Llama → Claude)
- Files changed: 9 in `~/.hermes/`, 9 in `~/Repos/BossMan/` (mirror sync)
- Commits: `ae2a4e6` and `84ce88c`
- Total: 18 files, 4385 insertions, 337 deletions, in two commits

Full session detail: `~/.hermes/skills/devops/ai-model-routing/references/default-build-flow-2026-06-03.md`.

---

## OpenClaw Config Investigation

`openclaw.json` is the source of truth for agents. Agent definitions are in `agents.list[]`, NOT in individual agent directories. SOUL/prompt files in agent dirs may not exist.

```bash
# Parse openclaw.json
python3 -c "import json; d=json.load(open('/path/to/openclaw.json')); print(list(d.keys()))"

# Find a specific agent
python3 -c "
import json
d=json.load(open('/Users/bigdawg/.openclaw/openclaw.json'))
for a in d['agents']['list']:
    if a['id']=='lbc35': print(json.dumps(a, indent=2))
"

# Update an agent field
python3 -c "
import json
with open('/path/to/openclaw.json') as f: d=json.load(f)
for a in d['agents']['list']:
    if a['id']=='target': a['role']='new_role'
with open('/path/to/openclaw.json','w') as f: json.dump(d,f,indent=2)
"
```

---

## SOUL File Convention

**Updated 2026-05-07: The `role`/`reportsTo`/`soul` fields are NOT supported in `openclaw.json`. OpenClaw's agent schema validates strictly and rejects them with "Unrecognized keys". SOUL.md alone establishes the behavioral contract.**

OpenClaw SOUL files live at `~/.openclaw/agents/<agent-name>/SOUL.md`. Create with:
- Version number and date
- Role statement (explicit — "delegated executor under BossMan")
- Authority, constraints, relationship to BossMan
- Workspace path
- Handoff protocol reference

**How to hot-reload OpenClaw gateway after SOUL/config changes:**

**Option 1 — Web UI (preferred, no restart):**
```bash
# Navigate in browser to:
http://localhost:18789/reload
# Click the "Click to hot-reload agents" button
# Clean — no process restart, no outage
```

**Option 2 — SIGHUP (causes brief outage):**
```bash
pgrep -f "openclaw/dist/index.js gateway"   # find PID
kill -HUP <pid>                            # graceful restart
sleep 3
curl -s localhost:18789/health             # verify back up
openclaw agents list                        # validate config accepted
```
SIGHUP triggers a full gateway restart (old PID dies, new PID starts). Brief outage. Works every time.

**What does NOT work:**
- `curl -X POST localhost:18789/reload` → 404 Not Found
- `curl -X POST localhost:18789/api/agents/reload` → 404
- `openclaw gateway hotreload` → wrong syntax (expects 0 args)

**Always validate after any change:**
```bash
openclaw agents list  # Must succeed — "Config invalid" means the change was rejected
```

**What openclaw.json actually supports for agent entries (schema-validated):**
```json
{
  "id": "lbc35",
  "name": "lbc35",
  "workspace": "/Users/bigdawg/.openclaw/workspace-lbc35",
  "agentDir": "/Users/bigdawg/.openclaw/agents/lbc35/agent",
  "model": "minimax-portal/MiniMax-M2.1",
  "tools": { "allow": ["exec", "read", "write", ...] }
}
```

**UNSUPPORTED (will be rejected by `openclaw agents list` and cause config errors):**
- `role` ✗
- `reportsTo` ✗
- `soul` or `soUL` ✗

**Always validate after editing openclaw.json:**
```bash
openclaw agents list  # Must succeed without "Config invalid" error
```

**Verify SOUL.md exists and is readable:**
```bash
ls -la ~/.openclaw/agents/<agent>/SOUL.md
```

---

## Kanban Card Operations

```bash
# Mark done
sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \
  "UPDATE tasks SET status='done' WHERE id='<card_id>';"

# Add comment
hermes kanban comment <card_id> "message"

# Create card (hex ID)
# See references/kanban-schema.md for hex ID generation
```

Schema and card operations: `references/kanban-schema.md`

## Doc-Update vs. Runtime-Reload Distinction

When updating OpenClaw/LBC35 documentation (SOUL.md, AGENTS.md, TOOLS.md):
- **Files on disk updated:** ✅ Changes saved to `~/Desktop/Openclaw Brain/Openclaw Brain/`
- **OpenClaw gateway reloaded:** ❌ NOT done automatically — LBC35 Telegram bot is a long-running process
- **LBC35 sees new docs:** On its next session start (when it reads SOUL.md at wake-up)
- **Runtime behavior unchanged:** Until LBC35 restarts or hot-reloads, the bot may still operate from cached context

**To force runtime reload (if needed):**
```bash
# Option 1 — Web UI (preferred, no outage)
open http://localhost:18789/reload   # Then click "hot-reload" button

# Option 2 — SIGHUP (brief outage)
pgrep -f "openclaw/dist/index.js gateway"  # find PID
kill -HUP <pid>
sleep 3
curl -s localhost:18789/health       # verify back up
```

**Rule:** For documentation-only changes (no config or SOUL behavioral change), a runtime reload is optional — the next session start will pick up the new files automatically. Reload is required if the SOUL changes affect real-time bot behavior.

## Wave-Based Doc Update Pattern (from 2026-05-10)

When BossMan requests a wave-based documentation update:

**Wave N sequence:**
1. Draft all changes — write updated files, don't commit
2. Show structured diffs (```diff blocks, + line / - line format)
3. Wait for explicit "yes" from BossMan
4. Commit only after approval — one commit per logical wave
5. Verify: file state, git hash, no broken references

**2026-05-10 Waves executed:**
- Wave 1: SOUL.md, AGENTS.md, TOOLS.md — hierarchy contradictions fixed → commit `f5eaa6917f4d3ce70058df196a930b8da1bde129`
- Wave 2: PROTOCOL.md, SYSTEM_INSTRUCTIONS.md, docs/SYSTEM_SERVICES_MAP.md → archived → commit `399141d`
- Wave 3: [pending]

## Phase Status Reference

**Source:** `references/phase-status-2026-05-10.md` — verified phase completion status as of 2026-05-10.

Key findings:
- **Phase 7A does NOT exist** — the operating blueprint defines only Phases 0–7, no sub-phases. Do not reference "Phase 7A" in answers.
- **Phase 7 sub-parts:** Perplexity Spaces ✅ complete (8 spaces built 2026-05-07). PM dashboard retirement ✅ complete as of 2026-05-10 (port 5000 has no listener, AGENTS.md updated to reflect retirement, SYSTEM_INSTRUCTIONS.md archived).
- **Phase 6 is blocked** on two independent items: finance data source decision (Marcelo) + Binance bot fix approval (Marcelo). Both gates must clear before Phase 6 begins.
- **Money Pipeline** (port 8020) runs in degraded state — stream errors, broken research automation, OpenClaw-owned cron, no Basecamp project. Phase 6 unblock is the only path forward.

## Doc Sync Convention
