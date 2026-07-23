# Travel OS — Permanent Operating Rules

**Source:** AGENTS.md §"Travel Planning" + §"Travel OS — Canonical Handoff Repo" (extracted 2026-07-22)
**Status:** Permanent

---

## Travel Planning — Default Routing Rule (Permanent, 2026-06-04)

When Marcelo mentions a possible or planned trip with **destination and approximate dates**, BossMan defaults to **Travel OS first**:

1. Create or open a Travel OS trip record (port 3537, dashboard at `localhost:3537`; public URL: `https://bigdawgs-mac--studio.tailed3212.ts.net/travel-os`).
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
| **PM2 process** | `travel-os` (PM2 id 7), PM2_HOME=`~/.pm2`, daemon PID stable at canonical 1-daemon invariant |
| **Localhost port** | `3537` (was `3535` pre-2026-07-22; health-os-v4 took 3535 silently) |
| **Public URL** | `https://bigdawgs-mac--studio.tailed3212.ts.net/travel-os` (Tailscale Funnel strips `/travel-os` prefix when forwarding to `localhost:3537`) |
| **basePath** | **NOT used.** Next.js serves at root `/`. Tailscale strips `/travel-os`; basePath would cause 404 on the public URL. |
| **Health route** | `http://localhost:3537/` (HTTP 200, "Travel OS — Dashboard") + public `/travel-os` (HTTP 200 via Tailscale) |
| **Watchdog** | `~/.hermes/scripts/travel-os-external-watchdog.sh` — pings public `/travel-os` every 5 min, 2-consecutive-failure auto-recovery (re-attaches Funnel) |
| **Trip reminder cron** | `7f58cef97c80` — runs `scripts/process-trip-reminders.py` SIX times for T-14, T-7, T-3, T-1, trip-start, trip-end stages |
| **Handoff sync cron** | `ab41f101c407` — weekly drift check against `github.com/BIGDAWG35/Bossman-And-Cello-Travel-OS` |
| **Hostname** | `bigdawgs-mac--studio.tailed3212.ts.net` (canonical, 2026-07-22 drift-fix; legacy `bigdawgs-mac-mini-2` retired) |

**Hardening (Layer 1, 2026-06-05):** `min_uptime: 60s`, `max_restarts: 10`, `max_memory_restart: 1536M`, `kill_timeout: 8000` — see `ecosystem.travel-os.js`.

**Drift-fix history (2026-07-22, Card t_travel_os_tailscale_routes_cleanup_20260722):**
- Legacy hostname `bigdawgs-mac-mini-2.tailed3212.ts.net` replaced with `bigdawgs-mac--studio.tailed3212.ts.net` in 3 crons + watchdog script
- Watchdog URL changed from `/` (was probing Health OS V4 by mistake) to `/travel-os` (Travel OS canonical)
- Recovery command changed from `http://localhost:3535` to `http://localhost:3537`
- PM2 Health Monitor skill table corrected (was `3535 / Travel OS`, now `3537 / Travel OS`)
- Tried `basePath: '/travel-os'` on Next.js → caused 404 on public URL (Tailscale strips prefix) → reverted

See `~/.hermes/knowledge/TRAVEL_OS_HANDOFF_REPO.md` for full bootstrap instructions, identity rules, and handoff playbook.

---

## Loop Engineering integration — Travel OS Weekly Review (added 2026-07-23, Card t_travelos_trip-review-loop_v1_20260723)

Travel OS is now Loop-owned for **loop design**. The Travel lane owns trip data + UX; Loop owns cron cadence / no-spam / lock-window state.

**Travel OS crons (4 total):**

| Cron id | Name | Schedule | Delivery | Lane design | Lane runtime |
|---|---|---|---|---|---|
| `7f58cef97c80` | Trip Reminder (consolidated, 6-stage) | daily 08:00 PT | telegram (pre-approved) | Loop | Travel |
| `b858e01bd089` | External Watchdog | every 15 min | local | Loop (silent-by-default) | Ops |
| `ab41f101c407` | Handoff Sync Drift Check | Sat 06:00 PT | local (silent) | Loop | knowledge-canon + Travel |
| **`5fced7f41345`** | **Weekly Review (NEW)** | **Sun 18:00 PT** | **local (silent-by-default; Telegram on blockers only)** | **Loop** | **Ops (cron) + Travel (content)** |

**Loop A (Weekly Review) design brief:** `~/.hermes/logs/travel-os-loop-design-20260723.md` (12.2 KB).

**No-spam rules enforced by Loop A (Permanent):**
- 7-day lock window (`~/.hermes/state/travel-os-weekly-review.state`).
- One brief per cron run; re-runs within window stay silent.
- Telegram escalation only when blockers detected (`exit 10` → marker file → cron prompt escalates).
- PM2 Health Monitor already covers `travel-os` port 3537.

**Travel-lane follow-ups (logged on kanban):**
- `t_travelos_loop_a_trips_endpoint_20260723` — add `/trips` JSON endpoint for Loop A's brief.
- `t_travelos_upcoming_trips_view_20260723` — Upcoming + Weekly-review UI views.
- `t_travelos_loop_b_prompt_update_20260723` — tighten Trip Reminder prompt (12h send window + per-trip-per-day lock).

**Lane profile reference (Travel):** `~/.hermes/knowledge/LEARNED_TRAVEL_OS.md` (this file). Per-lane Loop-integration note: see Travel lane profile after Loop-Engineering rollout card `t_subagent_loop_rollout_v1_20260723` creates it.
