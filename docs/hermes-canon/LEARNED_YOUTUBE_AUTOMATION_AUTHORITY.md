---
type: standing_authority
created: 2026-07-30
card: t_video_stack_lockin_20260730
status: PERMANENT — granted by Marcelo, 2026-07-30
---

# YouTube Automation Authority — v17 Four-Tool Video Stack

**Owner:** BossMan (delegates to content sub-agent + sub-agents)
**Trigger:** Any new short YouTube video request from Marcelo.
**Granting directive:** "v17 YouTube workflow is now canon. I stay out of the UI and out of the loop until the finished video and docs are ready." — Marcelo, 2026-07-30

---

## The standing contract

When BossMan or a sub-agent is asked to produce a **short YouTube video**, the following is **automatic and non-negotiable** unless overruled by an explicit V3 carve-out:

1. **Use the v17 stack. No re-discovery.**
   - ElevenLabs TTS (P1)
   - Blender 5.2 LTS headless (P2)
   - Apple Motion 5 GUI-only (P3) — with ffmpeg animated-text fallback
   - DaVinci Resolve Studio v21.0.3 as **validator only** (P5)
   - ffmpeg composite (P4) with `+faststart` (mandatory for YouTube)

2. **Default path:** `bash build/youtube_workflow.sh <script.txt>` → `final.mp4`.
   - The script accepts `SCRIPT_PATH` / `SCRIPT_TEXT` env overrides via `tts_elevenlabs.py`.
   - `VOICE_ID` env override supported.
   - Runs P2→P5→P5-Resolve→P6-verify end-to-end.

3. **The 4 mandatory clauses** must hold in every pipeline run:
   - **Resolve = validator only** (not renderer). Construct `.drp` project + timeline; ffmpeg produces final.mp4.
   - **Motion = GUI-only** (no CLI scripting). ffmpeg animated-text fallback when GUI is unavailable.
   - **Blender 5.2 LTS** — PNG-frames → ffmpeg stitch (FFMPEG setting removed in 5.2).
   - **ffmpeg `+faststart`** — moov-at-front for YouTube streaming.

4. **No Marcelo UI.** No step-by-step. No "can you click this." No "open this app." BossMan and sub-agents drive every tool via CLI/API/script. Plane, simple, no exceptions.

5. **Edge case → update LEARNED, not improvise.** If a new failure mode or capability is encountered:
   - Update the relevant `LEARNED_<DOMAIN>.md` (rows 28–33 in `LEARNED_INDEX`).
   - Add a new LEARNED row if a new domain emerges.
   - Register in `hermes-canon-drift-check.sh`.
   - Mirror to Obsidian V3-Canon + `~/Repos/BossMan/docs/hermes-canon/`.
   - Run drift-check to confirm 3-way md5 alignment.
   - **Never** improvise a workaround and ship without documenting it.

6. **Finished deliverable = video + docs.** When surfacing to Marcelo:
   - The `final.mp4` (path + size + duration + codec summary).
   - The 26/26 verify PASS line.
   - Any LEARNED doc that was created or updated.
   - The drift-check "0 drift" line.
   - **Nothing else.** No mid-build narration. No "what I'm doing now." No "should I...?"

---

## Forbidden patterns (drift signals)

These are **automatic V3 carve-outs** if they happen:

- ❌ Asking Marcelo to open Resolve / Motion / Blender.
- ❌ Asking Marcelo to copy-paste between tools.
- ❌ Asking Marcelo to research what a tool can do.
- ❌ "Re-discovering" tool capabilities that are already in LEARNED_<DOMAIN>.md.
- ❌ Shipping a workaround without updating LEARNED.
- ❌ Running `youtube_workflow.sh` without `+faststart` in the final encode.
- ❌ Using Resolve free (Lite) — Studio is the only Resolve (Lite uninstalled).
- ❌ Running Resolve in `-nogui` mode — disables IOXPC, breaks `scriptapp("Resolve")`.
- ❌ Validating Resolve artifacts via filesystem (use live API introspection).

---

## The 6 LEARNED docs that define this authority

| # | Doc | Scope |
|---|-----|-------|
| 28 | `LEARNED_APPLE_MOTION.md` | Apple Motion 6.3 GUI-only — 23 sections |
| 29 | `LEARNED_BLENDER_LTS.md` | Blender 5.2 LTS headless — 24 sections |
| 30 | `LEARNED_DAVINCI_RESOLVE_STUDIO.md` | Resolve Studio v21.0.3 validator — 24 sections |
| 31 | `LEARNED_FOUR_TOOL_VIDEO_STACK.md` | v17 pipeline spec — 9.5 KB |
| 32 | `LEARNED_VIDEO_RENDERING.md` | ffmpeg composite spec — 7.8 KB |
| 33 | `LEARNED_YOUTUBE_WORKFLOW.md` | Single-script wrapper / this authority — 3.0 KB |

**Total:** ~85 KB of canon. Read these before any new YouTube job. Update these after any new edge case. Drift-check enforces 3-way alignment across Hermes canon + Obsidian V3-Canon + GitHub mirror.

---

## Provenance

- **Granted by:** Marcelo (SoCal, BossMan operator), 2026-07-30
- **Card:** `t_video_stack_lockin_20260730`
- **Phase:** 6 (YouTube workflow demo) — 26/26 PASS on a fresh narration, no re-discovery
- **Activation trigger:** Marcelo's message "v17 YouTube workflow is now canon. I stay out of the UI and out of the loop until the finished video and docs are ready."

---

**Maintained by:** knowledge-canon sub-agent on BossMan's behalf.
**Last refresh:** 2026-07-30 (creation).
