---
name: acceptance-criteria
description: |
  Canonical acceptance criteria template. Every non-trivial change MUST
  have an `accept_when` block on the parent kanban card AND a checklist
  in the handoff packet. Use the observable-check pattern below — no
  subjective phrasing, no "should be fine" language. Each check is a
  pass/fail decision a verifier (or a model) can run.
---

# Acceptance Criteria (canonical template)

A work item is "done" only when ALL of the following are true. Each check
is observable — a human or a model can run it and report pass/fail.

## 1. Build / code complete
- [ ] All child cards (P1..P5 or scoped N children) are `status=done`
- [ ] No `TODO` / `FIXME` / `XXX` in the new code
- [ ] No `stub` / `mock` / `synthetic` data paths in production code
- [ ] `git diff --stat main..HEAD` matches the expected file list

## 2. Service health
- [ ] `pm2 list` shows the affected service(s) as `online`
- [ ] `curl -fsS http://localhost:PORT/<route>` returns 200 or 307
- [ ] `pm2 logs <service> --err --lines 50` has no NEW errors since deploy
- [ ] Restart count ≤ prior count + 2

## 3. Data integrity
- [ ] DB schema migration applied (if any)
- [ ] No null / empty / placeholder rows in tables that should be populated
- [ ] `sqlite3 <db> "SELECT count(*) FROM <table>"` matches expected count
- [ ] No `synthetic` / `test_` / `stub_` prefixed rows in production tables

## 4. Routing / network (if applicable)
- [ ] `tailscale status` shows the host (if exposed via Tailscale)
- [ ] Tailscale MagicDNS name resolves: `tailscale ping <name>`
- [ ] Caddy vhost (if any) returns 200 on canonical URL
- [ ] No 5xx in the last 100 access log lines for the affected route

## 5. Step-5 QA
- [ ] Step-5 verifier ran on the final implementation
- [ ] Verdict = `pass` (verdict file at `~/.hermes/state/security-watch/incidents/qa-log/<...>.json`)
- [ ] `touches_sensitive` field correctly populated
- [ ] Verifier reasoning cites the source-of-truth check, not a vibes claim

## 6. Workflow logic sanity
- [ ] End-to-end user path tested: input → action → expected output
- [ ] All buttons/links/routes return correct destinations
- [ ] Empty-state and error-state behavior is sane (no 500s, no silent fails)
- [ ] Workflow makes sense as a real product (not just technically working)

## 7. Documentation
- [ ] Runbook / changelog / canonical doc updated
- [ ] `~/.hermes/knowledge/<domain>/` updated if rules changed
- [ ] Stand-down line or standing rule text added if this is a permanent pattern

## 8. Self-verify card (P5)
- [ ] P5 card is `status=done`
- [ ] P5 evidence attached as comment or file link
- [ ] P5 verdict block on the card body: `p5_verdict: pass`

## Final gate

> "Done" is reported to Marcelo only after ALL boxes above are checked.
> If any check fails, BossMan continues working — does NOT report "done",
> does NOT hand back partial work, does NOT ask "is this OK?" midstream.
