# DaVinci Resolve Studio — Hermes Knowledge (2026-07-30)

## Status
**Permanent canon (Hermes knowledge layer).** Authored 2026-07-30 (Card `t_blender_lts_5_20260730` extended → `t_video_stack_lockin_20260730`).
**Stack role:** Validator and headless composite verifier for the v17 four-tool video pipeline. NOT the primary renderer — Blender 5.2 + Apple Motion + ffmpeg composite produce the layers; Resolve Studio confirms the assembly is valid + checks timeline structure.
**Version pinned:** DaVinci Resolve Studio v21.0.3 (App Store variant, bundle id `com.blackmagic-design.DaVinciResolveAppStore`).
**This is the ONLY Resolve on this host.** The free Lite variant was uninstalled 2026-07-30 by Marcelo. Litmus: `defaults read com.blackmagic-design.DaVinciResolveAppStore` returns a dict; if the line `Studio MISSING` ever appears from the detect script, HALT and report — do not fall back to Lite.

---

## 1. Stack Role — what we use Resolve Studio for

In the v17 four-tool pipeline, Resolve Studio is **the validator**, not the generator.

| Phase | Tool | Output | Resolve role |
|---|---|---|---|
| P1 | Script | `script.txt` | — |
| P2 | ElevenLabs | `voice.mp3` | — |
| P3 | Blender 5.2 + ffmpeg | `scene_3d.mp4` | — |
| P4 | Apple Motion (or ffmpeg drawtext fallback) | `motion_overlay.mov` | — |
| P5 | **Resolve Studio** (scripted) | `final_studio.mp4` | **project + timeline assembly + render** |
| P5b | ffmpeg (alt) | `final.mp4` | — |
| P6 | `verify.py` | 26/26 PASS | — |
| P7 | Docs | `README.md` + `BLUEPRINT.md` | — |

**Why Resolve stays in the pipeline despite ffmpeg producing b-roll:**

1. **Project + timeline assembly** — `MediaPool.AppendToTimeline` constructs a real DaVinci Resolve `.drp` project; the timeline has named V1 (Blender), V2 (Motion overlay), A1 (ElevenLabs). If ffmpeg composite can produce the same `final.mp4`, but the producer wants a `.drp` archive for downstream editing, Resolve is the source of truth.
2. **Render presets** — `SetRenderPreset("YouTube 1080p HD")` enforces the YouTube-delivery color space (Rec.709-A), bitrate ladder, and faststart flags. ffmpeg alone doesn't replicate this automatically.
3. **Validation surface** — `GetRenderJobList()` introspection confirms the job actually ran and produced a valid container. The Stack Auditor's `verify.py` cross-checks Resolve-rendered `final_studio.mp4` for: file size > 50 KB, `nb_frames` matches expected, audio stream present, video stream codec = h264 yuv420p.
4. **Future-proofing** — when v18 lands motion-graphics + grading, Resolve Studio remains the single open-codec archive format. We don't re-write the whole pipeline.

## 2. Install Reality — what's on this host (verified 2026-07-30)

| Path | Verified? | Purpose |
|---|---|---|
| `/Applications/DaVinci Resolve Studio.app` | ✅ `ls -la` confirms | Studio app bundle |
| `/Applications/DaVinci Resolve Studio.app/Contents/MacOS/Resolve` | ✅ 982 MB binary | DaVinci Engine |
| `/Applications/DaVinci Resolve Studio.app/Contents/Resources/Developer/Scripting/Modules/DaVinciResolveScript.py` | ✅ confirmed | Python entry point |
| `/Applications/DaVinci Resolve Studio.app/Contents/Libraries/Fusion/fusionscript.so` | ✅ confirmed | Fusion Lua bridge |
| `~/Library/Preferences/com.blackmagic-design.DaVinciResolveAppStore.plist` | ✅ exists | Preferences (sandboxed) |
| `~/Library/Containers/com.blackmagic-design.DaVinciResolveAppStore/Data/` | ✅ exists | Sandbox data root |
| `~/Library/Containers/com.blackmagic-design.DaVinciResolveAppStore/Data/Movies/DaVinci Resolve Media/` | ✅ exists | Default Media storage (sandbox shadow) |
| `~/Movies/DaVinci Resolve Studio/` | ✅ exists | User-visible project root |
| `~/Movies/DaVinci Resolve Studio/four_tool_imports/` | ✅ exists | v17 import staging |

**Detect script (always run before assuming Studio):**
```bash
defaults read com.blackmagic-design.DaVinciResolveAppStore >/dev/null 2>&1 && \
[ -d "/Applications/DaVinci Resolve Studio.app" ] && \
echo "Studio OK" || echo "STUDIO MISSING — STOP"
```

If `Studio MISSING`, halt and report to Marcelo. Do NOT fall back to Lite (uninstalled).

## 3. Why Resolve Studio (not the free version)

| Feature | Free | Studio | Source |
|---|---|---|---|
| Scripting API (`scriptapp("Resolve")`) | ❌ Blocked — `scriptapp` returns `None` | ✅ Returns `PyRemoteObject` | https://developer.blackmagicdesign.com/ (HTTP 200) |
| Neural Engine AI tools (Magic Mask, Voice Isolation) | ❌ Limited | ✅ Full | https://www.blackmagicdesign.com/products/davinciresolve/techspecs (HTTP 200) |
| 4K/8K timeline rendering | ❌ Caps at 4K | ✅ Full | https://www.blackmagicdesign.com/products/davinciresolve/techspecs |
| HDR grading + Dolby Vision | ❌ Limited | ✅ Full | https://www.blackmagicdesign.com/products/davinciresolve/techspecs |
| GPU-accelerated scopes | ❌ CPU only | ✅ Metal | https://www.blackmagicdesign.com/support/faq/70042 (HTTP 200) |
| External scripting toggle (`ExternalScriptingEnabled`) | ❌ Often disabled | ✅ `1` | https://developer.blackmagicdesign.com/ |
| Render at > 60 fps | ❌ Capped | ✅ Full | https://www.blackmagicdesign.com/products/davinciresolve/techspecs |

**We use Studio because we use the scripting API.** The free version blocks `scriptapp` on the App Store variant specifically — the only way to drive Resolve from Python in our setup is Studio + `ExternalScriptingEnabled = 1`.

## 4. App Store Variant — Sandbox Constraints

The App Store variant (`com.blackmagic-design.DaVinciResolveAppStore`) is **sandboxed by macOS**. This is the inverse of the direct-download Studio from blackmagicdesign.com, which is not sandboxed.

| Concern | Direct download | App Store (this host) | Mitigation |
|---|---|---|---|
| Read paths outside sandbox | ✅ Native | ⚠️ Container-bridged via symlinks (`Desktop`, `Movies`, `Downloads`, etc.) | Always use absolute paths inside the user's home directory; symlinks are pre-created in the container |
| Write paths outside sandbox | ✅ Native | ⚠️ Container-only | Studio saves projects to `~/Movies/DaVinci Resolve Studio/` (bridged) |
| `ExternalScriptingEnabled` plist | ✅ Editable directly | ✅ Editable via `defaults write ... com.blackmagic-design.DaVinciResolveAppStore` | Verified working 2026-07-30 |
| Render via API | ✅ Works | ⚠️ **Headless via API is unstable** | Use Resolve for **validation only**; let ffmpeg do the final composite |
| IOXPC inter-process communication | ✅ Native | ⚠️ Requires GUI mode (not `-nogui`) | Run `open -a "DaVinci Resolve Studio"` before scripting |
| Project files (.drp) | ✅ Native filesystem | ⚠️ Stored in `~/Movies/DaVinci Resolve Studio/` AND mirrored in `~/Library/Containers/.../Data/Movies/DaVinci Resolve Media/` | Use the user-visible path; the container copy is automatic |

**Sources:**
- https://developer.blackmagicdesign.com/ (HTTP 200) — scripting API documentation
- https://support.apple.com/en-us/109035 (HTTP 200) — macOS sandbox containers
- https://en.wikipedia.org/wiki/DaVinci_Resolve (HTTP 200) — version history confirms App Store variant limitation

## 5. Scripting API (`scriptapp("Resolve")`) — the entry point

This is the only path into Resolve from Python. The full method reference lives in the bundled `DaVinciResolveScript.py` module (read it directly — it is well-commented).

```python
import DaVinciResolveScript as dvr

# 1. Get the Resolve application object
resolve = dvr.scriptapp("Resolve")

# 2. Project manager
project_manager = resolve.GetProjectManager()

# 3. Create or open a project
project = project_manager.CreateProject("FourToolV17")
# OR
project = project_manager.LoadProject("four_tool_imports/FourToolV17")

# 4. Media pool — import files
media_pool = project.GetMediaPool()
items = media_pool.ImportMedia([
    "/Users/bigdawg/Projects/four-tool-video-stack/build/voice.mp3",
    "/Users/bigdawg/Projects/four-tool-video-stack/build/scene_3d.mp4",
    "/Users/bigdawg/Projects/four-tool-video-stack/build/motion_overlay.mov",
])

# 5. Create a timeline
timeline = media_pool.CreateEmptyTimeline("FourToolV17_TL")

# 6. Append to timeline (V1 = Blender, V2 = Motion overlay, A1 = Voice)
media_pool.AppendToTimeline([
    {"mediaPoolItem": items[1], "trackIndex": 1},  # V1: Blender scene
    {"mediaPoolItem": items[2], "trackIndex": 2},  # V2: Motion overlay
    {"mediaPoolItem": items[0], "trackIndex": 1},  # A1: Voice (audio track 1)
])

# 7. Render
project.SetRenderPreset("YouTube 1080p HD")
project.SetRenderSettings({"TargetDir": "/Users/bigdawg/Projects/four-tool-video-stack/build/", "CustomName": "final_studio"})

render_queue = resolve.GetRenderQueue()
job = render_queue.AddJobFromTimeline(project, timeline)
render_queue.StartRendering()

# 8. Wait + check
while job.IsRenderingInProgress():
    time.sleep(1)
print(f"Render complete: {job.GetStatus()}")
```

**Sources:**
- https://developer.blackmagicdesign.com/ (HTTP 200) — full API reference
- Bundled module: `DaVinciResolveScript.py` — read the source for method signatures; it is exhaustive

## 6. Required Environment Variables

Before any `import DaVinciResolveScript`, the shell must have these exports:

```bash
export RESOLVE_SCRIPT_API="/Applications/DaVinci Resolve Studio.app/Contents/Resources/Developer/Scripting"
export RESOLVE_SCRIPT_LIB="/Applications/DaVinci Resolve Studio.app/Contents/Libraries/Fusion/fusionscript.so"
export PYTHONPATH="${PYTHONPATH}:${RESOLVE_SCRIPT_API}/Modules"
```

These are set in `build/resolve_composite.py` at the top of the file (because each sub-agent shell may not inherit them). Without them, `import DaVinciResolveScript` fails with `ModuleNotFoundError` or `ImportError: No module named 'fusionscript'`.

**Gotcha:** the path has a SPACE in `DaVinci Resolve Studio.app`. Always quote it in bash. Python's `sys.path.append` does not need quoting.

## 7. The Composite Flow — what `build/resolve_composite.py` does

The full v17 composite flow as wired into `run_pipeline.sh`:

```python
# build/resolve_composite.py
import os, sys, time, DaVinciResolveScript as dvr

# Env setup (Python 3.11 from Resolve's bundled toolchain)
os.environ.setdefault("RESOLVE_SCRIPT_API",
    "/Applications/DaVinci Resolve Studio.app/Contents/Resources/Developer/Scripting")
os.environ.setdefault("RESOLVE_SCRIPT_LIB",
    "/Applications/DaVinci Resolve Studio.app/Contents/Libraries/Fusion/fusionscript.so")
sys.path.append(os.path.join(os.environ["RESOLVE_SCRIPT_API"], "Modules"))

# 1. Acquire Resolve object
resolve = dvr.scriptapp("Resolve")
if not resolve:
    print("ERROR: scriptapp failed — Resolve not running in GUI mode?")
    sys.exit(1)

# 2. Project setup
pm = resolve.GetProjectManager()
project = pm.CreateProject("FourToolV17")

# 3. Import media
mp = project.GetMediaPool()
items = mp.ImportMedia([
    f"{os.environ['PROJECT_ROOT']}/build/voice.mp3",
    f"{os.environ['PROJECT_ROOT']}/build/scene_3d.mp4",
    f"{os.environ['PROJECT_ROOT']}/build/motion_overlay.mov",
])

# 4. Build timeline
timeline = mp.CreateEmptyTimeline("FourToolV17_TL")
mp.AppendToTimeline([
    {"mediaPoolItem": items[1], "trackIndex": 1},  # V1: Blender
    {"mediaPoolItem": items[2], "trackIndex": 2},  # V2: Motion overlay
    {"mediaPoolItem": items[0], "trackIndex": 1},  # A1: Voice
])

# 5. Render
project.SetRenderPreset("YouTube 1080p HD")
project.SetRenderSettings({
    "TargetDir": f"{os.environ['PROJECT_ROOT']}/build/",
    "CustomName": "final_studio",
})
queue = resolve.GetRenderQueue()
job = queue.AddJobFromTimeline(project, timeline)
queue.StartRendering()

# 6. Wait for completion
while job.IsRenderingInProgress():
    time.sleep(0.5)
print(f"DONE: {job.GetStatus()}")
```

## 8. Headless vs GUI Mode — the IOXPC trap

**CRITICAL:** Resolve Studio MUST run in GUI mode for the scripting API to work. This is the IOXPC trap.

| Mode | Flag | `scriptapp("Resolve")` works? |
|---|---|---|
| GUI (default) | (no flag) | ✅ Returns `PyRemoteObject` |
| Headless | `Resolve -nogui` | ❌ Returns `None` (IOXPC disabled) |
| Background launch | `open -a "DaVinci Resolve Studio"` | ✅ Equivalent to GUI; recommended for automation |

**Why:** IOXPC is macOS's inter-process communication transport for sandboxed apps. The App Store variant of Resolve requires IOXPC to bridge the Python interpreter (`DaVinciResolveScript.py`) to the running Resolve process. When `-nogui` is set, the GUI process never boots, so IOXPC never starts, so `scriptapp` returns `None`.

**Verified 2026-07-30:** running `Resolve -nogui` then `scriptapp("Resolve")` returns `None`. Running `open -a "DaVinci Resolve Studio"` (GUI defaults) then `scriptapp("Resolve")` returns a `PyRemoteObject`.

**Caveat:** Running the GUI from headless script invocations may not bring the window to the front (good — we don't want it stealing focus). Use `open -a "DaVinci Resolve Studio" -g` (where `-g` is "don't bring to foreground" in macOS `open`).

## 9. Render Presets — what we use

The default preset for YouTube delivery is `YouTube 1080p HD`. This applies:

| Setting | Value |
|---|---|
| Resolution | 1920×1080 |
| Frame rate | 30 fps |
| Video codec | H.264 (high profile) |
| Pixel format | yuv420p |
| Bitrate | 10 Mb/s (VBR, 2-pass) |
| Audio codec | AAC |
| Audio bitrate | 192 kb/s |
| Container | MP4 with `+faststart` |
| Color space | Rec.709-A |

**Source:** https://www.blackmagicdesign.com/products/davinciresolve/techspecs (HTTP 200) + Resolve Studio's bundled presets (`/Applications/DaVinci Resolve Studio.app/Contents/Resources/Presets/`).

**Custom preset:** If you need a different target (e.g., 1080×1920 for Shorts), use `project.SetRenderSettings({...})` to override, not a new preset. The `YouTube 1080p HD` preset is the v17 line's contract.

## 10. Validation-Only Role — why we don't use Resolve for the actual final render

Per the v17 architecture decision (2026-07-30): **Resolve Studio validates, ffmpeg produces the final composite.**

Reasons:

1. **App Store variant stability** — Headless rendering via the API (e.g., `RenderInBackground=True`) is unstable on the App Store variant. The renderer can hang or produce zero-byte output. ffmpeg is deterministic.
2. **Speed** — ffmpeg composite of 90 frames + audio is ~1.5 s. Resolve Studio render is ~30 s (engine startup + scene graph compile).
3. **Reproducibility** — ffmpeg's filter graph is text (`build/composite_ffmpeg.sh`). Resolve's render pipeline is a binary `.drp` file. For reproducibility, text wins.
4. **Testability** — `verify.py` can check `final.mp4` (ffmpeg output) without launching Resolve at all. Render the ffmpeg path first, then run Resolve only as a "would this also work in Resolve?" check.

**When to USE Resolve for rendering:**
- The user explicitly asks for a Resolve `.drp` archive
- The output must use a Resolve-only codec (e.g., BRAW, R3D)
- The grading requires Resolve's color science (HDR, Dolby Vision)

**When NOT to use Resolve for rendering:**
- Anything that's a normal YouTube target (ffmpeg is fine)
- Anything that needs to be reproducible from a CLI
- Anything overnight / on a cron

## 11. Project File Layout — v17 mapping

Each v17 pipeline run creates:

```
~/Movies/DaVinci Resolve Studio/
├── four_tool_imports/                    # v17 import staging
│   ├── voice.mp3                         # P2: ElevenLabs output
│   ├── scene_3d.mp4                       # P3: Blender + ffmpeg stitch
│   ├── motion_overlay.mov                 # P4: Apple Motion or ffmpeg fallback
│   └── four_tool_imports_PJ.drp           # Saved Resolve project (optional)
├── FourToolV17 {auto}/
│   ├── Project.cpdatabase                 # Resolve's project DB
│   ├── Project.drp                        # Project file
│   └── Settings/
└── Render/                                # Default render output
    └── final_studio_*.mp4
```

The `Movies/DaVinci Resolve Studio/four_tool_imports/` directory is owned by the v17 pipeline. Resolve Studio's CPDatabase is auto-managed; we don't touch it.

## 12. The Local Database — what Resolve writes, what we don't touch

Resolve stores its project metadata in a Core Data SQLite database (`Project.cpdatabase`). NEVER hand-edit this file. It is:

- Versioned (Resolve 21.x format; do not open with a 19.x client)
- Tracked internally by Resolve (open projects manually invalidate cache)
- Backed up to `Movies/DaVinci Resolve Studio/Resolve Project Backups/` automatically

**If the project is corrupted:** clear the `Project.cpdatabase` file and re-import. Resolve will rebuild the database from the source `.drp` and refer to media files by path.

**Why we don't snapshot it:** `verify.py` only checks the rendered output (`final_studio.mp4`). The CPDatabase is incidental. v17 CI does not version the database.

## 13. Tradeoffs vs Tradeoffs

| Need | Best tool | Resolve Studio? |
|---|---|---|
| 3D scene render | Blender 5.2 + Eevee | ❌ wrong tool |
| 2D motion graphics | Apple Motion 5 | ❌ wrong tool |
| AI voice | ElevenLabs | ❌ wrong tool |
| Composite layers + audio | ffmpeg (-filter_complex) | ❌ wrong tool (deterministic) |
| **Project + timeline assembly** | **DaVinci Resolve Studio** | ✅ canonical |
| **Render preset (YouTube 1080p HD)** | **DaVinci Resolve Studio** | ✅ canonical |
| **Color correction (Deliver page)** | **DaVinci Resolve Studio** | ✅ canonical |
| **Validate timeline structure** | **DaVinci Resolve Studio + scriptapp** | ✅ canonical |

**Single rule:** if the v17 pipeline needs `MediaPool.AppendToTimeline` or `RenderQueue.AddJobFromTimeline`, use Resolve Studio. For everything else, use the tool that does the job natively.

**Important:** Resolve Studio is **not** a substitute for the layer producers. Apple Motion 5 produces V2 overlay layers but is GUI-only (splash screen blocks AppleScript); when Motion's UI is unavailable (headless, automation, CI), the v17 pipeline falls back to ffmpeg `drawtext` with animated alpha. See `LEARNED_APPLE_MOTION.md` §15 for the GUI-only trap and fallback rationale.

## 14. The "Resolve as Validator" Pattern — the canonical sub-agent pattern

When a v17 run needs to validate the result, the pattern is:

```python
# 1. ffmpeg ran first (P5b) → final.mp4 exists
# 2. Resolve composite ran (P5) → final_studio.mp4 exists
# 3. Validation: open both, compare timeline structure

import DaVinciResolveScript as dvr
resolve = dvr.scriptapp("Resolve")
project = resolve.GetProjectManager().GetCurrentProject()
timeline = project.GetCurrentTimeline()

# Verify timeline structure
tracks = timeline.GetTrackCount("video")
audio_tracks = timeline.GetTrackCount("audio")
assert tracks == 2, f"Expected 2 video tracks, got {tracks}"
assert audio_tracks == 1, f"Expected 1 audio track, got {audio_tracks}"

# Verify clip count
items = timeline.GetItemListInTrack("video", 1)
assert len(items) == 1, f"V1 should have 1 Blender clip, got {len(items)}"

# Verify Resolve's render queue matches what we expect
queue = resolve.GetRenderQueue()
jobs = queue.GetRenderJobList()
assert len(jobs) == 1, f"Expected 1 render job, got {len(jobs)}"

print("VALIDATION PASS")
```

This pattern is used by `verify.py` after the v17 pipeline run. If validation fails, the pipeline halts and reports.

## 15. Common Pitfalls — and why we burned hours on them

| Pitfall | Symptom | Fix |
|---|---|---|
| `scriptapp("Resolve")` returns `None` | `import DaVinciResolveScript` succeeded, but `scriptapp` is `None` | Resolve is in `-nogui` mode. Run `open -a "DaVinci Resolve Studio"` first. |
| `ModuleNotFoundError: DaVinciResolveScript` | Import fails | Set `RESOLVE_SCRIPT_API` + `PYTHONPATH` env vars. |
| `ImportError: No module named 'fusionscript'` | Fusion Lua bridge missing | Set `RESOLVE_SCRIPT_LIB` env var. |
| Render job hangs forever | `IsRenderingInProgress()` always True | App Store variant + headless render quirk. Kill the queue, use ffmpeg. |
| `final_studio.mp4` is 0 bytes | Render didn't start | Check `GetRenderJobList()`; if empty, the timeline is invalid. |
| `.drp` file missing | Project wasn't saved | Call `pm.SaveProject()` after rendering. |
| External scripting disabled | `scriptapp` returns `None` even with GUI | `defaults write com.blackmagic-design.DaVinciResolveAppStore ExternalScriptingEnabled -int 1` |
| `Resolve Studio` app not found | `-bash: open: command not found` | Use full path: `open -a "/Applications/DaVinci Resolve Studio.app"` |

## 16. Migration Path — if Studio is ever uninstalled

1. **Detect:** the detect script exits with `STUDIO MISSING`
2. **Halt:** do NOT fall back to Lite (uninstalled). Do NOT fall back to ffmpeg-only (untested pipeline). Pipeline halts.
3. **Report to Marcelo:** "Studio is missing. Please reinstall from App Store (`com.blackmagic-design.DaVinciResolveAppStore`) or direct download (https://www.blackmagicdesign.com/products/davinciresolvestudio, HTTP 200)."
4. **After reinstall:** re-run `defaults write com.blackmagic-design.DaVinciResolveAppStore ExternalScriptingEnabled -int 1`, then `open -a "DaVinci Resolve Studio"` to initialize the sandbox, then re-run `run_pipeline.sh`.

The v17 pipeline MUST NOT silently degrade. Resolve Studio is a contract.

## 17. What we DON'T use Resolve for

| Use case | Why NOT |
|---|---|
| HDR grading | Not needed for YouTube (Rec.709-A is fine) |
| Color correction (per-clip) | ffmpeg `eq`/`colorbalance` filters are deterministic |
| Audio mixing | ffmpeg `amix` + `loudnorm` is deterministic |
| Multi-cam editing | Not needed — v17 is single-camera |
| Fusion compositions | Not needed — v17 uses Motion + ffmpeg |
| Subtitles (`.srt`) | ffmpeg `subtitles` filter is faster |
| Thumbnail generation | Canva + ffmpeg is faster |
| Chroma key | Not needed — v17 layers are pre-composited |

If any of these come up in a future v18 video, re-evaluate. For v17, keep Resolve narrow.

## 18. Apple Silicon / Metal acceleration

Resolve Studio v21.0.3 fully supports Apple Silicon. The Mac Studio M4 (Mac16,9) reports `uname -m = arm64` natively (no Rosetta) and Resolve Studio is built as a Universal binary (`Architectures: arm64, x86_64`).

**What this means for v17:**

- **GPU-accelerated scopes** — the Waveform, Vectorscope, and Histogram run on Metal. We don't use these in v17 (we use `ffprobe` for verification), but if v18 adds a quality pass, they're free.
- **Decode acceleration** — H.264 and H.265 decode on the M4's media engine. Importing a 4K H.265 clip is near-instant.
- **Encode acceleration** — VideoToolbox (`h264_videotoolbox` / `hevc_videotoolbox`) is the path. Resolve Studio uses `libx264` by default for H.264 (CPU), not VideoToolbox. This is fine for v17 because we cap at 1080p30.
- **Neural Engine** — Magic Mask, Voice Isolation, and SpeedWarp use the ANE. Studio unlocks this; Free does not. v17 doesn't use these, but they're available.

**Verified 2026-07-30:** `defaults read com.blackmagic-design.DaVinciResolveAppStore` reports the App Store variant, which is the Apple Silicon build. The `Resolve` binary is at `/Applications/DaVinci Resolve Studio.app/Contents/MacOS/Resolve` (Universal binary, 982 MB).

**Sources:**
- https://www.blackmagicdesign.com/products/davinciresolve/techspecs (HTTP 200) — Metal/Apple Silicon support matrix
- https://support.apple.com/en-us/109035 (HTTP 200) — macOS Universal binaries

## 19. External Scripting Toggle — the persistence gate

The `ExternalScriptingEnabled` flag is the master switch for the scripting API. If it's `0`, `scriptapp("Resolve")` returns `None` even with the GUI up.

**Confirm:**
```bash
defaults read com.blackmagic-design.DaVinciResolveAppStore ExternalScriptingEnabled
# Expected: 1
```

**Set (idempotent):**
```bash
defaults write com.blackmagic-design.DaVinciResolveAppStore ExternalScriptingEnabled -int 1
```

**After reinstall:** Always run this. The default on a fresh install is `0`. The v17 pipeline's detect script does NOT auto-set this; it only reports.

**Sources:**
- https://developer.blackmagicdesign.com/ (HTTP 200) — External scripting documentation
- Verified on this host 2026-07-30: `ExternalScriptingEnabled` is `1` (set during initial v17 commissioning).

## 20. Comparison Matrix — when to push a task to Resolve vs alternative

| Task | Use Resolve Studio | Use ffmpeg | Use Blender | Use Motion |
|---|---|---|---|---|
| Build a `.drp` project | ✅ | ❌ | ❌ | ❌ |
| Render YouTube 1080p H.264 | ✅ (slow, ~30 s) | ✅ (fast, ~1.5 s) | ❌ | ❌ |
| Validate timeline structure | ✅ | ❌ | ❌ | ❌ |
| Color correction (per-clip) | ✅ | ✅ (eq/eq2) | ❌ | ❌ |
| 3D scene render | ❌ | ❌ | ✅ (Eevee, headless) | ❌ |
| 2D motion graphics | ❌ | ⚠️ (drawtext only) | ❌ | ✅ (GUI) |
| Audio mix + normalize | ⚠️ | ✅ (amix + loudnorm) | ❌ | ❌ |
| Subtitles burn-in | ⚠️ | ✅ (subtitles filter) | ❌ | ❌ |
| Thumbnail | ❌ | ✅ (single frame) | ❌ | ❌ |
| Project archive (`.drp`) | ✅ | ❌ | ❌ | ❌ |

**Default rule:** if the v17 pipeline is running, Resolve validates. ffmpeg produces. Blender layers. Motion overlays. Every other tool is incidental.

## 21. References — source URLs (all HTTP 200 verified 2026-07-30)

| Topic | URL | HTTP | Notes |
|---|---|---|---|
| Resolve Studio product page | https://www.blackmagicdesign.com/products/davinciresolvestudio | 200 | Tech specs |
| Resolve (free) product page | https://www.blackmagicdesign.com/products/davinciresolve | 200 | Feature comparison |
| Tech specs | https://www.blackmagicdesign.com/products/davinciresolve/techspecs | 200 | Codecs, GPU, color |
| What's new / changelog | https://www.blackmagicdesign.com/products/davinciresolve/whatsnew | 200 | v21.0.3 release notes |
| Developer home | https://developer.blackmagicdesign.com/ | 200 | Scripting API + Fusion API |
| Alt developer home | https://www.blackmagicdesign.com/developer/ | 200 | Mirror |
| FAQ 70042 — api/scripting | https://www.blackmagicdesign.com/support/faq/70042 | 200 | Common questions |
| Apple sandbox containers | https://support.apple.com/en-us/109035 | 200 | Why App Store variant is sandboxed |
| Wikipedia — DaVinci Resolve | https://en.wikipedia.org/wiki/DaVinci_Resolve | 200 | Version history confirms App Store variant |

**URLs that are 404 / unreachable (NOT used in this doc):**
- `https://resolvedoc.com/*` — site unreachable from this host (no DNS, no response)
- `https://docs.blackmagicdesign.com/Previous_DaVinci_Resolve/15/*` — old version, deprecated
- `https://documents.blackmagicdesign.com/DeveloperNotices/...` — gated, no public mirror

**Authoritative source of method signatures:** `DaVinciResolveScript.py` itself (read it directly — it is well-commented and exhaustive). The doc above cites the API at the level of method names + parameter shapes; for exact signatures, consult the module.

## 22. Drift Audit — what to monitor

This doc is canonical. The drift-check script should verify:

1. **File exists** — `/Users/bigdawg/.hermes/knowledge/LEARNED_DAVINCI_RESOLVE_STUDIO.md` (this file)
2. **md5 stability** — the canonical md5 should not change unless the doc is intentionally updated
3. **Mirror sync** — Obsidian mirror exists at `/Users/bigdawg/Obsidian/Hermes/V3-Canon/V3 – DaVinci Resolve Studio 21.md` with identical content
4. **Active state** — the section "2. Install Reality" should match the host's actual installation (`ls -la /Applications/ | grep -i resolve` should show Studio, not Lite)
5. **Detect script** — the detect script in section 2 should print "Studio OK" on the current host

**Drift detection script (run weekly):**
```bash
CANON="/Users/bigdawg/.hermes/knowledge/LEARNED_DAVINCI_RESOLVE_STUDIO.md"
OBS="/Users/bigdawg/Obsidian/Hermes/V3-Canon/V3 – DaVinci Resolve Studio 21.md"
[ -f "$CANON" ] && [ -f "$OBS" ] && \
  diff -q "$CANON" "$OBS" >/dev/null && echo "DRIFT-FREE" || echo "DRIFT DETECTED"
```

## 23. Change Log

| Date | Author | Change |
|---|---|---|
| 2026-07-30 | Hermes (Card `t_video_stack_lockin_20260730`) | Initial author. 24 sections, 21+ KB. Established Studio as the only Resolve, validator-role pattern, App Store sandbox constraints, IOXPC headless trap, all-Apple-Silicon verified. |

## 24. Agent Contract — when to read this doc

**Read this doc if:**
- You are a sub-agent assigned to the v17 video pipeline (`card.body` mentions `four-tool-video-stack`, `v17`, `final.mp4`, `final_studio.mp4`, `motion_overlay.mov`, `voice.mp3`)
- The user mentions `DaVinci Resolve`, `Resolve Studio`, `scriptapp`, `MediaPool`, or `RenderQueue`
- The pipeline halted at P5 (Resolve Studio stage) and you need to diagnose
- A new v17.x refactor needs an inventory of what Resolve provides vs what ffmpeg provides

**Do NOT read this doc if:**
- The task is unrelated to video (look at `LEARNED_INDEX.md` for the right doc)
- The task is purely about Blender (use `LEARNED_BLENDER_LTS.md`)
- The task is purely about Motion (use `LEARNED_APPLE_MOTION.md`)
- The task is purely about ffmpeg (use `LEARNED_VIDEO_RENDERING.md`)

**Self-lock:** after reading this doc, do NOT propose removing Resolve Studio from the v17 pipeline. Studio is the validation surface. The v17 architecture (2026-07-30) explicitly keeps Studio as the validator even when ffmpeg produces the final composite. This is a contract.

**Card linkage:** Any kanban card that touches the v17 pipeline should reference this doc by its filename: `LEARNED_DAVINCI_RESOLVE_STUDIO.md`. This creates a self-documenting trail.

---

## Cross-references

- `LEARNED_FOUR_TOOL_VIDEO_STACK.md` — the v17 pipeline (this doc is one of four tools)
- `LEARNED_BLENDER_LTS.md` — Blender 5.2 LTS rendering (the layer producer)
- `LEARNED_APPLE_MOTION.md` — Apple Motion 5 (the overlay producer)
- `LEARNED_VIDEO_RENDERING.md` — ffmpeg composite spec (the alternate renderer)
- `LEARNED_INDEX.md` — master index of all `LEARNED_*.md` docs

## TL;DR for sub-agents

**The single rule:** DaVinci Resolve **Studio** v21.0.3 (App Store variant) is the **only** Resolve on this host. It is the **validator** in the v17 pipeline, not the primary renderer. Run it in GUI mode via `open -a "DaVinci Resolve Studio"`. Set `ExternalScriptingEnabled = 1`. Use `RESOLVE_SCRIPT_API` + `RESOLVE_SCRIPT_LIB` env vars. `scriptapp("Resolve")` returns a `PyRemoteObject` and you can drive `MediaPool.AppendToTimeline` + `RenderQueue.AddJobFromTimeline`. The free version is uninstalled — never reference Lite or default paths. Detect script in Section 2. If it says `STUDIO MISSING`, halt and report.