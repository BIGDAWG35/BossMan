---
name: debug
description: First responder for runtime incidents — service crashes, job failures, red health checks. Diagnoses, performs safe auto-retries, escalates to builder or ops. Use when something is broken or a service is down.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [debugging, runtime, incident-response, ops, builder]
    related_skills: [systematic-debugging, ideas, python-debugpy, node-inspect-debugger]
---

# SKILL.md — debug

First responder for errors and broken services across the Hermes system.

---

## Purpose

Act as first responder when:
- A service returns 5xx errors or timeouts
- A cron job or scheduled task fails
- A health endpoint is red
- A user reports "something is broken"
- A repeated failure occurs after a previous auto-fix

This skill diagnoses, performs safe auto-retries, and escalates cleanly to the right profile. It does not change code or configs.

---

## When to Use

**bossman calls debug when:** something breaks and it's unclear whether it needs builder or ops — debug investigates and routes.

**builder calls debug when:** implementation work hits a runtime error, test failure, or service crash during development.

**ops calls debug when:** a service is down, a health check is red, or a PM2 process is in an error state.

---

## Inputs

The calling profile should provide:
- Service name
- Port and/or URL (if known)
- Brief symptom description
- Any known log snippets or error messages
- Whether this is a new failure or a repeat

---

## Outputs

After running, the skill returns:
- Concise incident summary (what broke, when, what the symptom was)
- Checks performed (health endpoint hit, log lines found)
- Auto-fix actions taken (retry, restart — with before/after state)
- Recommended escalation target (builder or ops) if unresolved
- Next-step recommendations

---

## First Responder Protocol

1. **Identify the service** — map name → port/process using `docs/services-map.md` or `~/.hermes/knowledge/` if available. If no map exists, note that.

2. **Check health endpoint** — curl the port's health URL. Record the response code and latency.

3. **Check recent logs** — pull the last 20–50 lines from the service log around the time of failure. Look for: exceptions, stack traces, connection errors, OOM signals.

4. **Assess severity:**
   - Is the service responding but returning errors? → Likely code/logic issue → builder
   - Is the service not responding at all? → Likely infra/config → ops
   - Is it a scheduled job that silently failed? → Check the job runner logs → builder or ops depending on what the job does

5. **Auto-fix if safe** — if the issue is a hung process, stalled job, or temporary crash (not a code or config problem):
   - Restart the service via PM2, OR
   - Re-run the failed job once
   - Re-check health after 30 seconds

6. **If still failing after auto-fix** — stop at diagnosis. Do not make code or config changes. Summarize findings and recommend escalation.

7. **If the same failure recurs** — escalate immediately. Recurring failures after auto-fix indicate a deeper problem that needs builder or ops.

---

## Auto-Fix Permissions

**Allowed without extra approval:**
- Restarting a PM2 service (no config change)
- Re-running a failed scheduled job once
- Retrying a health check or API call that timed out
- Clearing a known build artifact from a temp directory
- Recording the incident in daily logs

**Not allowed — must escalate:**
- Any code change
- Any config file change
- Any secret or credential update
- Changes to trading logic, position sizing, or Binance bot settings
- Anything that affects money, public output, or system architecture
- Installing or removing packages

**Default:** When in doubt, stop and escalate. Never force a fix that could make things worse.

---

## Escalation Path

**→ Escalate to builder when logs point to:**
- Code exceptions or unhandled errors
- Logic bugs or incorrect API usage
- Test failures
- Issues introduced in a recent code change

**→ Escalate to ops when logs show:**
- PM2 process in error/restart loop with no code change
- Config parsing errors
- Port already in use, binding failures
- Disk full, OOM, permission denied
- Deployment or Docker issues

### Handoff format for escalation
INCIDENT: [service name] — [one-line symptom]
CHECKS RUN: [health, logs]
AUTO-FIX ATTEMPTED: [yes/no — what was done]
RESULT: [resolved / still failing]
ESCALATE TO: [builder / ops]

REASON: [why builder or ops based on what logs show]
NEXT STEP: [specific action the receiving profile should take]
LOGS: [last 5–10 relevant lines]

Keep handoffs tight. The receiving profile should have everything they need to act without re-diagnosing.

