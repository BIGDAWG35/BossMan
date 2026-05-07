---
name: ideas
description: Intake and structure raw ideas, then route them to the right profile. Use when a half-formed concept, "what if we…", or new proposal needs to be captured, clarified, and routed before building.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [intake, ideas, routing, planning, bossman]
    related_skills: [bossman, plan, writing-plans]
---

# SKILL.md — ideas

Intake and structure raw ideas, then route them to the right profile.

---

## Purpose

- Capture ideas so they don't get lost or die in chat
- Turn vague thoughts into structured, actionable proposals
- Route them to the right profile for execution or further planning
- Mark what's ready to do now vs. what's parked for later

---

## When to Use

**Call this skill when:**
- You drop a new idea, feature concept, "what if we…", or experiment
- A profile notices a recurring pain point and wants to propose an improvement
- A weekly deep dive surfaces something worth doing but not immediately
- Any profile encounters something that should be captured but doesn't belong in current work

---

## Inputs

- Raw idea in your own words
- Any context you gave (why it came up, where it applies, urgency)
- Optional constraints: budget, risk tolerance, timeline

---

## Outputs

A structured idea card:
IDEA: [one-line title]
PROBLEM / OPPORTUNITY: [what this tries to solve]
PROPOSED SOLUTION: [what the fix or change looks like]
EXPECTED IMPACT: [who benefits, what improves]
RISK LEVEL: [low / medium / high]
SUGGESTED OWNER: [builder / ops / trading / content / bossman]
RECOMMENDATION: [do now / park for later / needs clarification]
ASSUMPTIONS: [any made without your input — flag these]

---

## Structuring Protocol

Ask these 4 questions. If you're not available and I have enough signal, I make reasonable assumptions and mark them.

1. **What problem is this trying to solve?**
2. **What would success look like?**
3. **What constraints matter most — time, money, risk, or complexity?**
4. **Which profile is the likely owner — builder, ops, trading, content, or bossman?**

If answers to questions 1 and 2 are missing → send it back for clarification before structuring. Don't force a vague idea into a card.

---

## Idea Quality Bar

**Send it back for clarification when:**
- The problem is unclear or too vague to define
- No success criteria can be inferred
- It conflicts with stated constraints or red lines
- It's just a feeling without a proposed direction

**Accept and structure it when:**
- There's enough signal to define a problem and a likely owner
- A reasonable assumption can fill a gap (mark it as an assumption)

---

## Routing Rules

| Owner | Routes to | Examples |
|-------|-----------|---------|
| **builder** | `~/.hermes/profiles/builder/SOUL.md` | Features, dashboards, scripts, automations, app builds |
| **ops** | `~/.hermes/profiles/ops/SOUL.md` | Reliability improvements, PM2, deployments, monitoring, health checks |
| **trading** | `~/.hermes/profiles/trading/SOUL.md` | Research questions, strategy ideas, market analysis — research only |
| **content** | `~/.hermes/profiles/content/SOUL.md` | YouTube topics, social content, publishing workflows, SEO |
| **bossman** | `~/.hermes/profiles/bossman/SOUL.md` | Operating model changes, review loop design, profile structure, MD conventions |

### Routing examples

| Idea | Route to |
|------|---------|
| "Build a crypto tracking dashboard" | builder |
| "Automate our weekly deployment checklist" | ops |
| "Research whether gold is a good hedge right now" | trading (research only) |
| "Make a video about the new API" | content |
| "Change how profiles handle handoffs" | bossman |
| "What if we could run everything from one command?" | bossman (routing clarification) |
