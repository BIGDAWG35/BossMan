---
name: workflow-sanity-check
description: |
  Workflow / logic sanity check — verifies that a feature or fix actually
  makes sense as a real user workflow, not just that it runs. Loaded by
  P5 self-verify when a change touches UI, forms, buttons, routes, or
  any user-facing flow. Triggers: PMD-style 5-child pipeline, autonomous
  remediation of a broken workflow, or a Step-5 verdict that surfaces
  a "technically works but logic is bad" finding.
---

# Workflow Sanity Check

A feature is "done" only if it makes sense as a real workflow. A button
that opens a modal that does nothing useful is NOT done. A form that
posts to a route that 500s is NOT done. A page that loads but is empty
is NOT done.

This skill is the **logical / UX companion** to the technical P5
self-verify. It checks: does the user path actually work end-to-end,
and is the flow the user expects?

---

## When to load this skill

Load it on P5 of any pipeline that touches:
- UI / forms / buttons / routes
- A workflow that was just fixed (autonomous remediation case)
- Any feature where the operator said "the flow is bad" or "the logic
  doesn't make sense"

---

## The 5 workflow checks

### 1. End-to-end user path
Open the affected page. Do the exact user action the page is for. Does
the resulting state match what a real user would expect?

| Tool | What to do |
|------|------------|
| `browser_navigate` | Open the page in browser |
| `browser_snapshot` | Get the accessibility tree |
| `browser_click` | Click the primary CTA / button |
| `browser_snapshot` | Verify the resulting state |

**Pass condition:** the action produces a result the user expects. The
button doesn't just "do something" — it does the right thing.

### 2. Empty / error / boundary states
What happens when:
- The input is empty
- The input is invalid
- The DB has no rows for this query
- The user is unauthenticated (if applicable)

| Tool | What to do |
|------|------------|
| `browser_navigate` | Open the affected page with empty data |
| `browser_console` | Look for `Error` / `TypeError` / `500` |
| Manual check | Is the empty state human-readable? |

**Pass condition:** the empty / error state is handled gracefully — not
a 500, not a blank page, not a silent fail.

### 3. Navigation / links / buttons
Every link and button on the affected pages should go somewhere that
makes sense.

| Tool | What to do |
|------|------------|
| `browser_snapshot` | List all clickable elements |
| `browser_click` | Click each one (or a sample) |
| Verify | Resulting URL or modal is correct |

**Pass condition:** no 404s, no broken links, no buttons that go
nowhere, no pages that load with empty content.

### 4. Form / input validation
If the change touches a form:

| Tool | What to do |
|------|------------|
| `browser_type` | Try invalid input |
| `browser_click` | Submit |
| Verify | Validation message is shown (not silent accept) |
| `browser_type` | Try valid input |
| `browser_click` | Submit |
| Verify | Success state is shown, data persisted |

**Pass condition:** both invalid + valid paths are handled. Data is
actually persisted (verify with `sqlite3` or DB query).

### 5. Real-user intuition test
Pause. Read the page as if you were the user. Ask:

- **Does this make sense?** (If a human looked at this screen for 5
  seconds, would they know what to do?)
- **Is the wording clear?** (No jargon, no ambiguity)
- **Is the next step obvious?** (After the action, does the user
  know what to do next?)
- **Is the feedback clear?** (Did the action succeed? Fail? Why?)

**Pass condition:** yes to all four. If "no" to any, the workflow
needs a fix — not just the code.

---

## How to attach evidence

After the 5 checks run, write a short verdict:

```yaml
workflow_sanity:
  card_id: t_xxxxx
  date: 2026-06-23
  checks_run: 5
  checks_pass: 5
  checks_fail: 0
  verdict: pass
  evidence: |
    - user_path: "clicked Add Property → modal opened → form filled → submit → success toast → row in table"
    - empty_state: "no properties → 'No properties yet' message visible"
    - error_state: "invalid email → red border + 'Please enter a valid email' message"
    - nav: "every button on the page resolves to an expected route"
    - intuition: "user flow is intuitive; primary CTA obvious; feedback clear"
```

Attach this as a comment on the parent kanban card, or as a file
under `~/.hermes/state/<project>/p5-evidence/`.

If `verdict != pass` → P5 fails → BossMan fixes and re-runs.

---

## Companion skills

- `autonomous-change-pipeline` — the parent 5-child pattern
- `troubleshooting-mode` — incident flow
- `kanban-board-governance` — parent + child card structure
- `dogfood` — exploratory QA of web apps (uses similar patterns)
- `playwright-e2e-audit` — scripted E2E for deep coverage

---

## Pitfalls

- **"The page loads" ≠ "the workflow works"** — load + no 500s is
  necessary but not sufficient. Test the user action.
- **Empty state usually looks fine in dev because there's data** —
  test with the DB truncated.
- **Success state in screenshots ≠ success state in reality** —
  verify data is actually persisted.
- **Modal/CTA looks fine in isolation** — test the full page after.
- **Don't trust labels** — read the action, not the text.
