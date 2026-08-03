# Four-Tool Video Stack — v17 (2026-07-30)

## TL;DR
ElevenLabs + Blender 5.2 + Apple Motion 5 + **DaVinci Resolve Studio (scripted)** → 3 s 1080p test video on Mac Studio M4. **Resolve Studio is the ONLY Resolve** — the free version was uninstalled on 2026-07-30. Resolve Lite scripting was permanently blocked (`scriptapp` returned `None`); Studio scripting works (returns `PyRemoteObject`).

**Resolve Studio's role in v17 is the validator**, not the primary renderer. ffmpeg produces the final `final.mp4` composite; Resolve Studio confirms the project + timeline assembly is structurally valid by constructing a real `.drp` project with the same V1/V2/A1 layout. See `LEARNED_DAVINCI_RESOLVE_STUDIO.md` §10 for the full rationale.

**Motion 5 is GUI-only.** AppleScript automation is unstable (splash screen blocks AppleEvents). When Motion's UI is unavailable (headless, automation, CI), **fall back to ffmpeg `drawtext`** with animated alpha — see the "ffmpeg Composite (alternative)" section below.

## Layer Spec (everything must match)
- Resolution: 1920×1080
- FPS: 30
- Frame count: 90 (3 s)
- Video codec: h264, yuv420p, faststart (`-movflags +faststart` mandatory — moves moov atom to front; without it YouTube buffering spikes 30–60%)
- Audio codec: aac, 192 kb/s, mono, 44.1 kHz

## Tool Specifics

### ElevenLabs
- Key in `~/.zshrc` as `ELEVENLABS_API_KEY`
- Default voice: Adam (`pNInz6obpgDQGcFmaJgB`), model `eleven_multilingual_v2`
- Endpoint: `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}` with `Accept: audio/mpeg`
- 12.26 s narration = ~193 KB mp3

### Blender 5.2 LTS
- **API BREAK:** Blender 5.2 removed `image_settings.file_format = "FFMPEG"`. The valid enum is now image-format only (AVIF, JPEG, OPEN_EXR, PNG, WEBP, BMP, CINEON, DPX, IRIS, JPEG2000, HDR, TARGA, TARGA_RAW, TIFF).
- **Workaround:** Render PNG frames, then ffmpeg stitch:
  ```
  /Applications/Blender.app/Contents/MacOS/Blender -b -noaudio --factory-startup -P build/blender_scene.py
  ffmpeg -framerate 30 -i frames/frame_%04d.png -c:v libx264 -pix_fmt yuv420p scene_3d.mp4
  ```
- Eevee engine works headless on Apple Silicon (Mac Studio M4)
- 90 frames @ 30 fps = ~3 s render in ~15 s
- Frame format: `frame_0001.png` (4-digit zero-pad)

### Apple Motion 5 (with ffmpeg fallback)
- **Primary path (AppleScript):** Open Motion → File → Share → Export Movie. **TIMED OUT** on first attempt (Motion splash screen never releases AppleEvents).
- **Fallback path (ffmpeg):** Use `drawtext` with animated alpha across 1920×1080 canvas, `qtrle` codec → `.mov`. Produces 1.2 MB, 90 frames, 3.0 s.
- Animation: `alpha='if(lt(t,0.5),t/0.5,if(lt(t,2.5),1,(3-t)/0.5))'` (fade in 0.5s, hold 2s, fade out 0.5s)
- Font: `/System/Library/Fonts/Supplemental/Arial Black.ttf`
- Motion 5 stays in the stack as a permanent motion-graphics tool (titles/graphics). The ffmpeg fallback is documented and acceptable when Motion's splash screen blocks automation.

### DaVinci Resolve **Studio** (scripted, in pipeline)
- **App Store variant** — bundle id `com.blackmagic-design.DaVinciResolveAppStore`, version 21.0.3.
- **Replaceable, NOT optional.** Marcelo uninstalled the free Lite version on 2026-07-30. Studio is the only Resolve on this machine.
- **Scripting works.** `DaVinciResolveScript.scriptapp("Resolve")` returns a `PyRemoteObject`. The free Lite wall is gone.
- **No sudo, no UI clicks required.** Resolve Studio can be fully driven by the Python API.
- **Canonical paths (always use these — never Lite):**
  ```
  /Applications/DaVinci Resolve Studio.app                  # Studio app bundle
  /Applications/DaVinci Resolve Studio.app/Contents/MacOS/Resolve    # binary
  /Applications/DaVinci Resolve Studio.app/Contents/Resources/Developer/Scripting   # Modules/
  /Applications/DaVinci Resolve Studio.app/Contents/Libraries/Fusion/fusionscript.so
  ~/Library/Preferences/com.blackmagic-design.DaVinciResolve.plist    # ExternalScriptingEnabled = 1
  ```
- **Env vars required before `import DaVinciResolveScript`:**
  ```bash
  export RESOLVE_SCRIPT_API="/Applications/DaVinci Resolve Studio.app/Contents/Resources/Developer/Scripting"
  export RESOLVE_SCRIPT_LIB="/Applications/DaVinci Resolve Studio.app/Contents/Libraries/Fusion/fusionscript.so"
  export PYTHONPATH="${PYTHONPATH}:${RESOLVE_SCRIPT_API}/Modules"
  ```
- **Scripted composite flow** (`build/resolve_composite.py`):
  1. `scriptapp("Resolve")` → `r`
  2. `r.GetProjectManager().CreateProject("FourToolV17")`
  3. `proj.GetMediaPool().ImportMedia([voice.mp3, scene_3d.mp4, motion_overlay.mov])`
  4. `mp.CreateEmptyTimeline("FourToolV17_TL")`
  5. `mp.AppendToTimeline([{mediaPoolItem: c, trackIndex: 1}])` per layer (V1=Blender, V2=Motion, A1=Voice)
  6. `r.GetRenderQueue().AddJobFromTimeline(proj, timeline)`
  7. `job.SetRenderPreset("YouTube 1080p HD")`
  8. `queue.StartRendering()` → wait → `final_studio.mp4`
- **Headless mode supported:** `Resolve -nogui` flag works (used during the Lite investigation; now redundant but documented). Studio can run scripted with the GUI up or with `-nogui`.
- **External scripting toggle** is currently `1`. If Studio is reinstalled, re-enable via:
  ```bash
  defaults write com.blackmagic-design.DaVinciResolve ExternalScriptingEnabled -int 1
  ```
- **Studio upgrades:** all paths are version-agnostic (no hardcoded version number). The `Contents/Resources/Developer/Scripting` layout is stable across 17.x/18.x/21.x. Re-probe after any major version bump.

### ffmpeg Composite (alternative / headless fallback)
- One-shot filter graph: `[1:v]overlay=0:0:format=auto[v]` over Blender base + ElevenLabs audio
- `overlay=format=auto` handles both alpha and opaque overlays
- Audio looping: `aloop=loop=-1:size=2e9,atrim=0:${DUR},asetpts=PTS-STARTPTS`
- `-shortest` to clamp to video duration
- Use when Resolve Studio is unavailable or for fully headless runs (e.g., CI).

### v18 PiP variant (2026-07-31, card `t_video_stack_v18pip_20260731`)
- **N-layer PiP composite:** `build/composite_ffmpeg_pip.sh` adds 4 B-roll windows (bottom-right 480×270) at scripted timestamps
- **Trigger markup:** `[PiP:broll_<name> @t=<Ns>]` markers in script — ffmpeg composite parses these, converts to `enable='between(t,START,END)'` (single-quoted; commas inside parens)
- **Layer chain:** `[0:v]` scene_3d → `[1:v]` colorkey motion_overlay → `[2..N+1:v]` PiP B-rolls → composite → `aloop` voice → `-t ${FINAL_DUR}`
- **Filter graph:** `-filter_complex_script /tmp/filter.txt` (NOT `-filter_complex` with file — must use `_script`)
- **Working combo verified:** 116 MB / 9:52 / 4 distinct PiP windows / 26/26 PASS

### v19 visual-layout hierarchy (2026-07-31, card `t_video_layout_refspec_20260731`)
**NEW CANON:** `LEARNED_VIDEO_LAYOUT_REFERENCES.md`. The visual quality bar for every long video is set by **3 reference channels** (Hermes Agent Masterclass / CryptoMetric / AI Labs). The spec doc is the visual authority — this file defers to it.
- Every long video must declare a **layout spec** against one of the 3 profiles before rendering starts.
- PiP sources MUST be real (screen captures / charts / UI footage) — generic Blender-shape PiP is BANNED.
- `MOTION_FORCE_FFMPEG=1` is now **emergency-fallback-only** (default = Motion-primary). Working on Motion template engineering so dynamic text works without bypassing Motion.

## Pipeline Stages (final)
| Stage | Tool | Script | Output | Notes |
|---|---|---|---|---|
| P2 | ElevenLabs | `build/tts_elevenlabs.py` | `voice.mp3` | auto |
| P3 | Blender 5.2 | `build/blender_scene.py` + ffmpeg stitch | `scene_3d.mp4` | auto |
| P4 | Motion 5 / ffmpeg | `build/motion_overlay.py` | `motion_overlay.mov` | auto (fallback wired) |
| P5 | **Resolve Studio** | `build/resolve_composite.py` | `final_studio.mp4` | **auto, scripted** |
| P5b | ffmpeg (alt) | `build/composite_ffmpeg.sh` | `final.mp4` | auto (fallback / headless) |
| P6 | Verify | `build/verify.py` | 25/25 PASS | auto |
| P7 | Docs | `README.md` + `BLUEPRINT.md` | written | auto |

## verify.py gotchas
- `size_ok` threshold for `final.mp4` should be 50 KB not 100 KB after composite (overhead can be small)
- PNG-stitched mp4s have `format.duration=0` — must check `nb_frames` in stream, not format duration
- ElevenLabs voice > scene duration is fine; ffmpeg `-shortest` clamps
- `format.duration` reported as 0 by ffprobe on raw PNG-stitched mp4s
- Resolve-rendered `final_studio.mp4` has full container metadata (duration, bitrate); no workaround needed.

## File Pattern (project root)
```
~/Projects/four-tool-video-stack/
├── BLUEPRINT.md
├── README.md
└── build/
    ├── voice.mp3
    ├── scene_3d.mp4
    ├── motion_overlay.mov
    ├── frames/frame_0001.png ... frame_0090.png
    ├── final_studio.mp4    (Resolve Studio deliverable)
    ├── final.mp4           (ffmpeg alternative)
    └── (scripts)
```

## Re-run
```bash
cd ~/Projects/four-tool-video-stack
bash build/run_pipeline.sh
```
~60 s end-to-end. Pipeline driver launches Resolve Studio via `open -a "DaVinci Resolve Studio"` if not already running.

## Marcelo's standing rules
- **2026-07-30:** DaVinci Resolve Studio is the only Resolve. Free version is gone. Do not reference Lite paths anywhere.
- **2026-07-30:** Motion stays in the stack as a permanent motion-graphics tool. Do not remove or downgrade.
- **2026-07-30:** Apple Motion 6.3 knowledge captured in `~/.hermes/knowledge/LEARNED_APPLE_MOTION.md` — read that file before any Motion-driven task.
- **2026-07-30:** Blender 5.2 LTS knowledge captured in `~/.hermes/knowledge/LEARNED_BLENDER_LTS.md` — read that file before any Blender-driven task. Blender is pinned to 5.2 LTS (`fbe6228777e7`); do not upgrade to 5.3+/6.0 within the v17 line.
- **2026-07-30:** All four-tool automation runs from agent side. No UI clicks by Marcelo. Manual Resolve/Motion steps are agent-side (cua-driver / sub-agents) where needed; Marcelo only reviews final video + docs.
- Surface only when final video + docs exist.

## Detect script (always run before assuming Studio)
```bash
defaults read com.blackmagic-design.DaVinciResolveAppStore 2>/dev/null && \
[ -d "/Applications/DaVinci Resolve Studio.app" ] && \
echo "Studio OK" || echo "STUDIO MISSING — STOP"
```
If `Studio MISSING`, halt and report to Marcelo. Do NOT fall back to Lite (uninstalled).

## Canonical references

- **`LEARNED_DAVINCI_RESOLVE_STUDIO.md`** — authoritative deep-dive for v17's validator tool (24 sections covering scripting API, App Store sandbox, IOXPC, render presets, validator pattern). Read this before any Resolve-related sub-agent task.
- **`LEARNED_BLENDER_LTS.md`** — Blender 5.2 LTS reference (render engine, image-sequence workflow, Eevee headless).
- **`LEARNED_APPLE_MOTION.md`** — Apple Motion 5 reference (motion graphics, GUI-only reality, ffmpeg drawtext fallback).
- **`LEARNED_VIDEO_RENDERING.md`** — ffmpeg composite spec + v17 tool-by-tool orchestrator reference.
---

## v18: PiP B-roll Pattern (2026-07-30)

### What changed
Four independent Blender PiP scenes (chart, coin, nodes, protocol) are rendered as separate PNG sequences → ffmpeg-stitched MP4s → overlaid onto a black canvas at specific time windows.

### Pipeline
| Stage | Tool | Output |
|---|---|---|
| P2 | ElevenLabs | `voice.mp3` (full narration) |
| P3b | Blender × 4 | `frames_pip_{scene}/frame_%04d.png` (240 frames = 8s each) |
| P4 | ffmpeg stitch | `broll_{scene}.mp4` per scene |
| P5 | ffmpeg overlay | `final_pip.mp4` (28s) |

### Composite filtergraph (canonical)
```
ffmpeg -y \
  -f lavfi -i "color=c=black:s=1920x1080:r=30:d=28" \
  -framerate 30 -i chart_frames/frame_%04d.png \
  -i        broll_coin.mp4 \
  -framerate 30 -i nodes_frames/frame_%04d.png \
  -framerate 30 -i protocol_frames/frame_%04d.png \
  -i voice_main.mp3 \
  -filter_complex "
    [0:v][1:v]overlay=1200:720:format=auto:enable='between(t,0,8)'[v1]
    [v1][2:v]overlay=1440:810:format=auto:enable='between(t,8,15)'[v2]
    [v2][3:v]overlay=1200:720:format=auto:enable='between(t,15,22)'[v3]
    [v3][4:v]overlay=1440:810:format=auto:enable='between(t,22,28)'[vout]
    [0:a][5:a]amix=inputs=2:duration=first:dropout_transition=0[aout]
  " \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 \
  -movflags +faststart -shortest final_pip.mp4
```

### PiP positions (bottom-right quadrant, 1920×1080 canvas)
- Chart + Nodes: `(1200, 720)` → 240×135 px
- Coin + Protocol: `(1440, 810)` → 360×203 px (featured, larger)

### PiP trigger timings (seconds into audio)
- 0–8s → chart (intro)
- 8–15s → coin (Bitcoin greed)
- 15–22s → nodes (AI revolution)
- 22–28s → protocol (conclusion)

### Blender 5.2 LTS PiP script gotchas
- `scene.frame_end` (NOT `scene.frame.end`) — Blender 5.2 removed the `.frame` accessor
- `mat.node_tree.nodes["Principled BSDF"].inputs["Roughness"]` — full path required; `nodes["Roughness"]` alone does NOT work
- Use `scene.frame_start` / `scene.frame_end` for frame range
- Use `--factory-startup` to ensure clean node tree state

### Script locations
- Composite: `build/composite_pip_broll.sh`
- Blender scripts: `build/blender_pip_{chart,coin,nodes,protocol}.py`
- Frame output: `build/frames_pip_{scene}/`

### Resolve Studio note
v18 uses ffmpeg-only composite (no Resolve). Resolve Studio remains in the stack for future 3D scene work. The PiP B-roll approach is purely ffmpeg — no Resolve needed for static overlays.
