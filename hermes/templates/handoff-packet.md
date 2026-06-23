---
name: handoff-packet
description: |
  Canonical handoff packet template for BossMan → sub-agent (LBC35) task
  assignment. Use this exact structure when BossMan delegates work to a
  sub-agent, cron, or delegated executor. The packet makes the task
  unambiguous: scope, files, commands, acceptance criteria, blockers.
  Always attach to the kanban card body; never paste raw handoffs.
---

# Handoff Packet (BossMan → Sub-Agent)

**Card ID:** <t_xxxxx>
**From:** bossman
**To:** <sub-agent | lbc35 | cron | ...>
**Date:** <YYYY-MM-DD>
**Work type:** <new_build | existing_build | troubleshooting | audit | refactor>
**Telegram delivery:** <yes | no>
**Step-5 QA required:** <yes | no>

---

## 1. Task
<One-sentence summary of the task. Active voice. "Implement X", "Fix Y", "Audit Z".>

## 2. Why
<One-sentence business / system reason. Why does this matter?>

## 3. Scope (in)
- <concrete deliverable 1>
- <concrete deliverable 2>
- <concrete deliverable N>

## 4. Scope (out)
- <what NOT to touch — explicit carve-outs>

## 5. Files / paths
- Read first: <path1>, <path2>
- Modify: <path3>, <path4>
- Verify: <path5>

## 6. Commands to run
```bash
<exact commands, in order, with expected output shape>
```

## 7. Acceptance criteria
- [ ] <observable check 1 — pass/fail, not subjective>
- [ ] <observable check 2>
- [ ] <observable check N>

## 8. Touches sensitive?
- [ ] money / trading
- [ ] auth / secrets
- [ ] PII
- [ ] public APIs
- [ ] shared infra
- [ ] destructive / irreversible
- [ ] vendor / billing
- [ ] none of the above

If any box is checked → STOP and page Marcelo before applying.

## 9. Step-5 QA verifier (if required)
- Model: <DeepSeek v4-flash | Claude Sonnet-4 | MiniMax-M3>
- Verdict file: ~/.hermes/state/security-watch/incidents/qa-log/<verdict-file>.json
- Expected verdict: `pass` (otherwise → fail & re-loop)

## 10. Self-verify checklist (P5)
- [ ] `curl -fsS http://localhost:PORT/` returns 200/307
- [ ] `pm2 list | grep <service>` shows online
- [ ] `tailscale status | grep <hostname>` if applicable
- [ ] `sqlite3 <db> "<query>"` returns expected count
- [ ] No `TODO|FIXME|stub|mock|synthetic` in src
- [ ] Step-5 verdict = `pass`

## 11. Report back
On completion, post a comment on this card with:
- ✅ Done — or — 🚨 Blocker
- One-paragraph summary (what was done, what was verified, where the evidence lives)
- If blocker: specific question for BossMan

## 12. Escalation triggers (call BossMan immediately)
- Touches anything in §8 that wasn't pre-approved
- Files outside §5
- Two consecutive failed attempts
- Step-5 verdict = `fail` after one fix attempt
