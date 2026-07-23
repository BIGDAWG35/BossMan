# Travel OS — Permanent Operating Rules

**Source:** AGENTS.md §"Travel Planning" + §"Travel OS — Canonical Handoff Repo" (extracted 2026-07-22)
**Status:** Permanent

---

## Travel Planning — Default Routing Rule (Permanent, 2026-06-04)

When Marcelo mentions a possible or planned trip with **destination and approximate dates**, BossMan defaults to **Travel OS first**:

1. Create or open a Travel OS trip record (port 3535, dashboard at `localhost:3535`).
2. Make it the **active planning trip** in the Travel OS dashboard.
3. Create/update the related Kanban card for planning work tied to that specific trip.
4. Use Travel OS as the **system of record** for trip modules: Trip Details, Booking, Itinerary, Expenses, Safety, Compliance, Reminders. Past Trips when archived.

**Data location:** Travel OS data lives in `/Users/bigdawg/Projects/travel-os-dashboard/data/sampleData.tsx` — trips are added by editing the static `sampleData.trips` array and rebuilding (the in-app `+ New Trip` button is a no-op stub; persistence requires source edit + `next build`).

**This rule is a permanent standing directive, not a per-trip instruction.** When in doubt: Travel OS is the answer, Kanban is the planning backbone, Perplexity is the research engine.

---

## Travel OS — Canonical Handoff Repo (Permanent — 2026-06-05)

**Official shared repo:** `https://github.com/BIGDAWG35/Bossman-And-Cello-Travel-OS` (private, BIGDAWG35 account)

This is the **canonical source** for cloning Travel OS onto any other machine (Cello's BossLady Mac mini, future replicas, etc.). Use it before proposing any new repos or flash-drive copies.

**Identity note (2026-06-05):** "Cello" / "BossLady" is **Marcelo's own second Mac mini** — NOT a separate person, NOT a Telegram contact, NOT an SSH target BossMan can reach. The Tailscale tailnet name "cello" is Marcelo's own account. **BossMan only talks to Marcelo. No other recipient is ever authorized for any handoff message, repo-link share, or "notify Cello" task.** If a future agent is asked to message a non-Marcelo identity, STOP and report to Marcelo.

**Hard rules (Marcelo's standing directive, 2026-06-05):**
- ❌ **Do NOT move or delete this repo** without Marcelo's explicit approval.
- ✅ **Use it as the canonical source** for cloning Travel OS onto other machines.
- ✅ **Keep it in sync** with the working BossMan Travel OS codebase, without touching the live runtime when pushing.
- ✅ **For any future handoff or replication**, use this repo first before proposing new repos or flash-drive copies.
- ❌ **Do NOT message any non-Marcelo identity** about this repo (no "Cello", "BossLady", `rsbixa`, or any other chat_id).
- ❌ **Do NOT clone this repo on a non-BossMan-Mac-mini host** without Marcelo running the clone himself from that host. BossMan may push to it; BossMan does not fan it out to other machines.
- ❌ **Do NOT change visibility** (public/private) without Marcelo's explicit directive. Currently PRIVATE.

**Sync protocol:**
- Local source of truth: `/Users/bigdawg/Projects/travel-os-dashboard/` on `main`
- Push pattern that works on this host: `https://oauth2:$(gh auth token)@github.com/BIGDAWG35/Bossman-And-Cello-Travel-OS.git` (the `oauth2:` user prefix is what GitHub expects for `gho_` OAuth tokens; `x-access-token:` is for fine-grained PATs only)
- Never push from inside the live PM2 process — only from the local working tree, and only when no in-progress build is running
- Live system health: PM2 `travel-os` on port 3535, HTTP 200 — leave it alone during sync operations
- Current HEAD: `31175ada` (verified 2026-06-05)

See `~/.hermes/knowledge/TRAVEL_OS_HANDOFF_REPO.md` for full bootstrap instructions, identity rules, and handoff playbook.
