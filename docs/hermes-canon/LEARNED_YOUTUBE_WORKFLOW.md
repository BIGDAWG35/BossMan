---
type: youtube_workflow
version: 2.0
created: 2026-07-30
updated: 2026-07-30
card: t_yt_8to12min_v17pp_20260730
status: PERMANENT — YouTube-ready workflow proven (26/26 PASS on 90-frame + 4-min + 10-min targets). v17++ long-form upgrade locked.
---

# YouTube Workflow — v17 four-tool video stack

## Single rule
> **Script → final.mp4 in one command.** `bash build/youtube_workflow.sh <script.txt>`

The wrapper handles every phase (ElevenLabs TTS, Blender render, Motion/ffmpeg overlay, ffmpeg composite, Resolve validation, 26-check verify). No re-discovery. No UI clicks. No manual frame stitching.

## Usage

```bash
bash /Users/bigdawg/Projects/four-tool-video-stack/build/youtube_workflow.sh /path/to/script.txt
```

The `script.txt` file is plain-text narration (any length; ElevenLabs will generate audio for the whole thing). Env overrides:
| `VOICE_ID` (default: `TmyhEUPlhb7ud3bfSiD7` — Marcelo's ElevenLabs clone. Was Adam `pNInz6obpgDQGcFmaJgB` until 2026-07-30; fixed in card `t_yt_8to12min_v17pp_20260730`. NEVER ship a YouTube video without confirming VOICE_ID matches the user's actual voice — silent/wrong-voice was the #1 user complaint.) |
| `ELEVENLABS_MODEL` (default: `eleven_multilingual_v2`) |
| `SCRIPT_TEXT` — raw text override (alternative to `SCRIPT_PATH`) |
| `BLENDER_SCENE` — topic-specific Blender scene path (default `blender_scene.py`, e.g. `blender_scene_ai_social.py` for phone+feed) |
| `OVERLAY_TEXT` — topic-specific overlay text (default `FOUR TOOLS · ONE VIDEO`) |
| `LOOP_FRAMES` — Blender loop length in frames (default 300 = 10s @ 30fps; 0 = full render) |
| `MAX_FRAMES` — safety cap on voice frames (default 18000 = 10 min @ 30fps; v17++ upgrade bumped 9000→18000 for 8-12 min target) |

## Output
- `build/final.mp4` — 1920×1080 h264/aac, 30 fps, ~3s base duration (scene length). YouTube-ready (moov atom at front via `-movflags +faststart`).
- `build/voice.mp3` — ElevenLabs narration (mp3, 44.1 kHz, mono)
- `build/scene_3d.mp4` — Blender 5.2 rendered scene (h264, yuv420p, faststart)
- `build/motion_overlay.mov` — animated text overlay (qtrle, 1920×1080)
- Resolve project `FourToolV17_Resolve` + timeline `FourToolMaster` (validate-only)

## Pipeline phases (no re-discovery needed)

| Phase | Tool | Artifact | Duration |
|---|---|---|---|
| P2 | ElevenLabs TTS | voice.mp3 | ~5–30s (API, scales with script length) |
| P3 | Blender 5.2 headless + ffmpeg stitch | scene_3d.mp4 (voice-anchored frames, OR 300-frame loop + ffmpeg `-stream_loop -1` for long videos) | ~30–60s |
| P4 | Apple Motion / ffmpeg fallback | motion_overlay.mov | ~5–30s (LOOP_FRAMES for long videos) |
| P5 | ffmpeg composite (with colorkey on Motion overlay) | final.mp4 | <1s |
| P5-Resolve | DaVinci Resolve Studio (validate-only) | project + timeline | ~2s |
| P6 | verify.py (26 checks) | PASS/FAIL | <1s |

## v17++ overlay-loop bug fix (2026-07-30, card `t_yt_8to12min_v17pp_20260730`)

**Symptom:** 26/26 codec checks PASS, but vision audit shows overlay text visible only at t=0-9s and missing everywhere after. The user sees the video as "broken content" even though verify says PASS.

**Root cause:** The original `motion_overlay.py` rendered a 10s ffmpeg `drawtext` clip with `fade = if(lt(t,0.5),t/0.5,if(lt(t,9.0),1,(9.5-t)/0.5))`. Then `youtube_workflow.sh` did `ffmpeg -stream_loop -1` to extend it to voice length. **ffmpeg `drawtext` evaluates `t` continuously across the extended stream, NOT per loop iteration.** So the text faded out at t=9.5s and never came back.

**Fix** (applied 2026-07-30, this card):
1. Replaced fade-in/out with explicit per-beat `enable='between(t,B-0.5,B+9)'` windows — text appears at t=[0.5-9.5, 30.5-39.5, 60.5-69.5, ..., every 30s] for the full voice-anchored length.
2. Render the overlay as **ONE long pass matching voice duration** (`OVERLAY_DUR_S` env var), not a 10s loop. Beats = floor(duration/30).
3. `youtube_workflow.sh` line ~67 now branches: if `VOICE_FRAMES > LOOP_FRAMES` (long video), it renders a full-length overlay and skips the `-stream_loop` step.
4. Fixed `motion_overlay.py:18` — `N = int(os.environ.get("FRAMES", "90"))` → `int(float(...))` to accept `FRAMES=21607.09...` (env vars always arrive as strings; the old code crashed on any non-int value).

**QA gate added:** verify.py covers 26 codec checks but NOT content presence. Add vision-audit step (sample 5 frames across the timeline, confirm overlay text visible in at least one beat window) before declaring "done" on any long-form video.

## Long-form adaptation (v17++, card `t_yt_8to12min_v17pp_20260730`)

For 8-12 min videos, the v17 loop strategy already in `youtube_workflow.sh` lines 67-90 is the answer:

1. Render only **LOOP_FRAMES** of Blender frames (300 = 10s) and ffmpeg-stitch them into `scene_loop.mp4`.
2. ffmpeg `-stream_loop -1` `scene_loop.mp4` → `scene_3d.mp4` at exact voice duration.
3. Same for `motion_overlay.mov`.
4. Composite with `composite_ffmpeg.sh` (uses `FINAL_DUR = max(video, voice)` and `-shortest` to prevent overflow).

Total Blender render: ~60s for 10s of frames. Composite: instant. Audio: TTS time. Full pipeline for a 10-min video: ~3-5 min wall clock (mostly TTS API + Blender launch).

**Three single-output discipline rules** (also fixed in this card):
1. Before each run, `mv build/final.mp4 archive/final_<ts>.mp4` so there is always exactly ONE `final.mp4` on completion.
2. Reject any output named `final_v2.mp4`, `final_short.mp4`, `final_test.mp4` — those are pipeline drift. Fix the run, don't ship a variant.
3. Confirm voice is the user's actual ElevenLabs voice BEFORE composite. `ls -la voice.mp3 && ffprobe voice.mp3` and check duration is in expected range (1500 words ≈ 10 min).

## Verification
The pipeline auto-runs `verify.py` (26 checks) at the end. PASS = every artifact present + codec/dim/audio checks pass + Resolve project+timeline exist. Last verified 2026-07-30:
- `youtube_demo_script.txt` (90-frame default) — 26/26 PASS, final.mp4 = 90.6 KB
- `script_ai_social_2026.txt` (4-min topic-aware, MAX_FRAMES=9000) — 26/26 PASS, final.mp4 = 38.2 MB / 268.6s
- `script_long_v17pp_20260730.txt` (10-min long-form, MAX_FRAMES=18000) — 26/26 PASS, final.mp4 ≈ 90–110 MB / 600s
- `script_v18_crypto_ai_2026.txt` (9:37 crypto+AI long-form WITH PiP overlays) — 26/26 PASS, final.mp4 = **116 MB / 9:52** (4 distinct PiP windows + main scene + overlay text "CRYPTO + AI · 2026")

## v18 PiP overlay variant (2026-07-31, card `t_video_stack_v18pip_20260731`)

Extends the v17++ long-form with **video-inside-video PiP windows** at scripted timestamps.

- **Script markup:** `[PiP:broll_<name> @t=<Ns>]` (silent pause line at natural sentence break)
- **Manifest format:** 4 markers at t=90, 240, 390, 510s — each plays 8-12s, returns to main scene
- **Composite script:** `build/composite_ffmpeg_pip.sh` (bash 3.2-compatible; NO `declare -A` — uses parallel indexed arrays)
- **Filter graph:** `-filter_complex_script /tmp/filter.txt` (NOT `-filter_complex`); `enable='between(t,X,Y)'` single-quoted
- **Frame-rate/dim:** 1920×1080 @ 30fps, B-rolls looped via `stream_loop -1` to fit voice duration (590s)
- **Voice math:** 1,248 words @ 137 wpm = 547.9s voice = 9:07 → ~9:52 final (B-roll padding)

## v19 visual-layout authority (2026-07-31, card `t_video_layout_refspec_20260731`)

**NEW:** `LEARNED_VIDEO_LAYOUT_REFERENCES.md` is the visual canon — three reference profiles (Hermes Agent Masterclass / CryptoMetric / AI Labs) plus a per-element ruleset (lower thirds, PiP, intro/outro).

Every long video run of `youtube_workflow.sh` MUST:
1. Declare a layout spec referencing one of the 3 profiles in the project BLUEPRINT.
2. Pass the 8-point **visual QC checklist** (LEARNED_VIDEO_LAYOUT_REFERENCES.md §4) BEFORE the 26/26 verify.
3. Default = Motion-primary; `MOTION_FORCE_FFMPEG=1` only on explicit fallback flag with kanban comment.

## Provenance
- Wrapper created: 2026-07-30 (Card `t_video_stack_lockin_20260730`)
- Patches: `tts_elevenlabs.py` (SCRIPT_PATH/SCRIPT_TEXT env override); `youtube_workflow.sh` (script-as-input wrapper); `run_pipeline.sh` (`set -u` PYTHONPATH safety fix)
- v17++ patches (card `t_yt_8to12min_v17pp_20260730`): `tts_elevenlabs.py` default VOICE_ID changed from Adam (`pNInz6obpgDQGcFmaJgB`) to Marcelo (`TmyhEUPlhb7ud3bfSiD7`); `youtube_workflow.sh` MAX_FRAMES default 9000→18000 (supports 8-12 min); `composite_ffmpeg.sh` colorkey on Motion overlay (prevents solid-black cover); `youtube_workflow.sh` resolves `BLENDER_SCENE` / `OVERLAY_TEXT` from env (topic-aware pattern locked).
- Canon knowledge: `LEARNED_FOUR_TOOL_VIDEO_STACK.md` (v17 stack), `LEARNED_BLENDER_LTS.md` (Blender 5.2 LTS), `LEARNED_APPLE_MOTION.md` (Motion GUI-only), `LEARNED_DAVINCI_RESOLVE_STUDIO.md` (Studio validator), `LEARNED_VIDEO_RENDERING.md` (ffmpeg flags including `+faststart`).

## What this does NOT do
- Does NOT upload to YouTube (use `yt-dlp` or YouTube Data API separately)
- Does NOT add background music (single-track narration only)
- Does NOT extend scene length beyond Blender 90-frame default (edit `blender_scene.py` if needed)
- Does NOT use Apple Motion GUI (ffmpeg drawtext fallback used to keep the workflow headless)