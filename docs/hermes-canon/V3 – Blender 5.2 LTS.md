# LEARNED_BLENDER_LTS.md

**Blender 5.2 LTS — canonical knowledge for the v17 four-tool video stack**
**Authored:** 2026-07-30 | **Owner:** BossMan | **Audience:** all sub-agents touching Blender
**Version pin:** Blender 5.2.0 LTS (`fbe6228777e7`, branch `blender-v5.2-release`, built 2026-07-14)
**Source of truth:** `https://docs.blender.org/manual/en/5.2/` + LTS handbook at `https://developer.blender.org/docs/handbook/release_process/lts/`

---

## 1. Why this file exists

Blender is the **3D scene-creation and rendering engine** in the v17 four-tool video stack. It contributes one specific video file (`build/scene_3d.mp4`) to the final composited output. Any sub-agent generating a 3D element, swapping the cube scene, adjusting the PNG frame counts, or upgrading Blender must read this file first.

**Single rule:** Blender is pinned to the **5.2 LTS** branch. Do not "upgrade to latest" — that violates the LTS contract and breaks the python-API-stable contract this stack relies on.

---

## 2. Version pin + LTS behavior

### 2.1 Pinned version

| Field | Value |
|---|---|
| Branch | `blender-v5.2-release` |
| Build | `fbe6228777e7` |
| Released | 2026-07-14 |
| LTS support window | July 2026 → July 2028 (2 years) |
| Predecessor LTS still maintained | 4.5 LTS (last updated 4.5.12 on 2026-07-21) |
| macOS bundle path | `/Applications/Blender.app/Contents/MacOS/Blender` |
| Binary size | ~264 MB (full app bundle) |

**Proven at runtime** (verified 2026-07-30):
```
Blender 5.2.0 LTS
Build: 2026-07-14 10:43:51 MacOS
Hash: fbe6228777e7
Branch: blender-v5.2-release
```

### 2.2 LTS contract (verbatim from the handbook)

From `https://developer.blender.org/docs/handbook/release_process/lts/`. Any fix backported to LTS must satisfy **all** of:

> "Blender's output (e.g. rendering) does not change.
> Python API does not change (scripts keep working).
> Blend File Compatibility does not change.
> Libraries will only update to address CVEs.
> Any significant performance drop — even on a specific modifier, node, or operator — should be avoided."

**Translation for our stack:** Within the 5.2 LTS line, a sub-agent can safely assume:
- The `bpy` Python API surface is stable between 5.2.0 and the final 5.2.x.
- `.blend` files we author in 5.2.0 will open in 5.2.5, 5.2.10, etc.
- A `scene_3d.mp4` rendered on 5.2.0 will look identical on 5.2.x.
- Render outputs are byte-stable across the LTS window.

**What LTS does NOT promise:**
- Upgrading 5.2 → 5.3 / 6.0 / main is unsafe — that's an API break.
- Performance on a specific modifier / node / operator must not regress, but additions are allowed.

### 2.3 5.2 → 5.2 known incompatibilities (from official release notes)

These are the *only* Python API / file-format incompatibilities called out in the 5.2 release notes:

| Change | Impact | Mitigation |
|---|---|---|
| Geometry Nodes Python API for modifier properties changed (commit `1561c1ea4a`) | Any python script that introspects GN modifier properties must be updated | Test scripts against 5.2.0 first; current `build/blender_scene.py` does NOT touch GN modifiers, so safe |
| 5.1 asset files with Geometry Nodes tools must be re-saved to work in 5.2 | Re-save before deploying 5.2 assets | Re-save once on 5.2.0 — one-time cost |
| `paint.eraser_brush` / `paint.eraser_brush_asset_reference` removed | Brush script that referenced these will fail | Current stack does not use these — safe |
| `Compare` and `Random Value` node socket IDs changed | Saved node groups using this may need renaming | Current stack does not use these — safe |
| **FFMPEG enum removed from `image_settings.file_format`** | Pre-5.2 code that set `file_format = "FFMPEG"` raises `TypeError` | **MANDATORY workaround: render PNG frames, then ffmpeg stitch externally** (this is what the v17 pipeline does) |

---

## 3. Blender's role in the v17 stack

### 3.1 Pipeline position

```
P2: ElevenLabs TTS → voice.mp3
        ↓
P3: Blender 5.2 + ffmpeg → scene_3d.mp4   ← THIS TOOL
        ↓
P4: Apple Motion or ffmpeg → motion_overlay.mov
        ↓
P5: DaVinci Resolve Studio OR ffmpeg → final.mp4
        ↓
P6: verify.py (26 checks)
```

### 3.2 Tasks Blender performs in v17

| Task | Status | Owner |
|---|---|---|
| Render three-second 3D scene as image sequence | **Live in v17** | `build/blender_scene.py` |
| Stitch PNG sequence to h264 mp4 | **Live in v17** | `run_pipeline.sh` (ffmpeg, not Blender) |
| Generate static scene assets for Motion/Resolve reuse | **Future** | Not yet wired |
| Export .blend files for downstream tools | **Future** | Not yet wired |
| Geometry-Nodes procedural modeling | **Future** | Skipped for now |

### 3.3 What Blender does NOT do in v17

- It does **not** compose the final video (that's P5/P5b).
- It does **not** add audio (that's P2 + P5).
- It does **not** add titles/lower-thirds (that's P4 / Motion / ffmpeg).
- It does **not** color-grade (DaVinci Resolve handles that in P5).

---

## 4. Canonical Blender workflow (Python + headless)

### 4.1 The exact CLI invocation the stack uses

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b -noaudio --factory-startup -P "$BUILD/blender_scene.py"
```

**Flag breakdown:**

| Flag | Purpose | Why we need it |
|---|---|---|
| `-b` | `--background` — no GUI | Required for headless server |
| `-noaudio` | Disable audio system | **Prevents macOS CoreAudio hang on Apple Silicon in headless mode** |
| `--factory-startup` | Skip `~/.config/blender/<ver>/startup.blend` | Ensures reproducible, clean scene from defaults |
| `-P "$BUILD/blender_scene.py"` | Run our Python script after startup | The actual scene definition |

**Known gotchas:**
- macOS: `Blender.app` is normally GUI-only; in headless mode, Blender's macOS audio driver can hang. `-noaudio` is mandatory.
- Do NOT use `-nogui` on Resolve thinking it applies here — that's Resolve-only. Blender's headless mode is `-b`.

### 4.2 The scene-definition script pattern

The v17 pattern is a single Python file that:
1. Cleans any stale frames.
2. `bpy.ops.wm.read_factory_settings(use_empty=True)` — fresh empty scene.
3. Configures render settings (engine, resolution, fps, frame range, output path).
4. Builds world, camera, light, geometry (cube, floor).
5. Inserts keyframes for animation.
6. Calls `bpy.ops.render.render(animation=True)`.
7. Prints a final `BLENDER_RENDER_DONE: <N> frames in <path>` line.

Full reference implementation: `build/blender_scene.py` (94 lines, July 2026).

### 4.3 Render-config essentials

| Setting | v17 value | Rationale |
|---|---|---|
| `scene.render.engine` | `'BLENDER_EEVEE'` | Eevee is real-time, works headless on Apple Silicon, no GPU device selection needed |
| `scene.render.resolution_x` | `1920` | 1080p |
| `scene.render.resolution_y` | `1080` | |
| `scene.render.resolution_percentage` | `100` | No downscaling |
| `scene.render.fps` | `30` | Matches video reveal in P5 |
| `scene.render.fps_base` | `1` | 30 fps, not 29.97 NTSC |
| `scene.frame_start` | `1` | First frame = 1 |
| `scene.frame_end` | `90` | Inclusive → 90 frames |
| `image_settings.file_format` | `'PNG'` | **Never use `'FFMPEG'` — enum removed in 5.2** |
| `image_settings.color_mode` | `'RGB'` | 8-bit RGB |
| `image_settings.color_depth` | `8` | |
| `scene.render.filepath` | `'/Users/bigdawg/Projects/four-tool-video-stack/build/frames/frame_'` | Prefix only; Blender appends `.png` |
| `scene.render.use_file_extension` | `True` | Ensures `.png` extension is appended |

**Output naming convention:** `frame_0001.png` … `frame_0090.png`. The prefix `frame_` is explicit. The shell uses `%04d` to glob the sequence.

---

## 5. Render engines — choose Eevee vs. Cycles

### 5.1 Quick comparison

| Aspect | Eevee | Cycles |
|---|---|---|
| Type | Real-time rasterizer | Path tracer |
| Speed | Seconds (v17 = ~5–10 s for 90 frames) | Minutes to hours |
| Headless on Apple Silicon | ✅ Works out of the box | ⚠️ Requires `--cycles-device` decision (Metal vs. CUDA) |
| Default for v17 | ✅ Yes | No |
| Output quality | Suitable for stylized / motion-graphics work | Required for photorealism |
| When to choose | **Default in v17** — animations, product spins, stylized scenes | Photoreal product renders, complex lighting, transparent materials |

### 5.2 Eevee performance notes

- Eevee is the default choice for v17 headless on Apple Silicon.
- No GPU device selection needed.
- Default settings already produce reasonable output (film-transparent shadows, AO, screen-space reflections).
- For keeps: if you ever switch to Cycles, document the `--cycles-device` choice (Metal vs. CUDA) — this is an open gap in the stack.

### 5.3 Cycles performance notes

- Requires `bpy.context.preferences.addons['cycles'].preferences.compute_device_type = 'METAL'` (Apple Silicon) or `CUDA` (NVIDIA).
- Memory-bound: high sample counts + 4K = OOM on 64 GB if textures are large.
- Tile size: `4096` for CPU, `2048` for GPU is a reasonable starting point.
- For video: 1–2 samples per frame is acceptable for stylized content; 64+ for photoreal.

---

## 6. PNG → ffmpeg stitch (the mandatory 5.2 workaround)

The 5.2 LTS branch removed the `FFMPEG` enum from `image_settings.file_format`. The pipeline renders PNG frames with Blender, then stitches with ffmpeg externally.

### 6.1 The exact ffmpeg invocation

```bash
ffmpeg -y -framerate 30 -i "$BUILD/frames/frame_%04d.png" \
       -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -movflags +faststart \
       "$BUILD/scene_3d.mp4"
```

| Flag | Purpose |
|---|---|
| `-y` | Overwrite output |
| `-framerate 30` | **Input** framerate — assigns 30 fps to the PNG sequence |
| `-i frame_%04d.png` | Sequential input pattern, 4-digit zero-padded |
| `-c:v libx264` | h264 codec |
| `-preset medium` | Speed/quality balance |
| `-crf 18` | Visually near-lossless |
| `-pix_fmt yuv420p` | Required for QuickTime / Safari / Resolve compatibility |
| `-movflags +faststart` | Move `moov` atom to front — enables progressive playback |

### 6.2 Known ffprobe quirk

PNG-stitched mp4s have `format.duration=0` because ffmpeg doesn't write a duration into the container from an image sequence. **Verify by `nb_frames`, not `duration`:**

```bash
ffprobe -v error -show_entries stream=nb_read_frames,codec_name,width,height,r_frame_rate -of default scene_3d.mp4
```

`verify.py` already does this — see lines 96–98.

### 6.3 Alternative: video container formats

If you need a different codec (e.g., ProRes for Resolve):

```bash
ffmpeg -y -framerate 30 -i frame_%04d.png \
       -c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le \
       scene_3d.mov
```

This is what `build/resolve_composite.py` can ingest as an alternative to h264 mp4.

---

## 7. Animation & keyframes

### 7.1 Primitive keyframe pattern

```python
import bpy

obj = bpy.data.objects['SubjectCube']
obj.rotation_euler = (0, 0, 0)
obj.keyframe_insert(data_path="rotation_euler", frame=1)

obj.rotation_euler = (0, 0, 6.283185)  # 2π radians = full rotation
obj.keyframe_insert(data_path="rotation_euler", frame=90)
```

Result: subject rotates 360° over 90 frames at 30 fps = 3 seconds. Linear interpolation by default.

### 7.2 Curve interpolation

For ease-in/out, set keyframe handles in the graph editor or use `bpy.ops.action.interpolation_type(type='BEZIER')`. Default linear is fine for v17's spinning cube.

### 7.3 Drivers

For complex parameters (e.g., scale tied to a noise function), use Geometry Nodes instead of drivers. Drivers are legacy and harder to debug.

---

## 8. Geometry Nodes (the modern procedural system)

### 8.1 When to use

- Procedural scattering (trees, rocks, particles)
- Parametric modeling (adjustable dimensions)
- Audio-reactive animation (Blender 5.2 new feature: `Sample Sound Frequencies` node)
- Cloth / hair dynamics (new XPBD solver in 5.2)

### 8.2 When NOT to use

- Single static objects (just model them directly)
- Simple animations (use keyframes)
- Anything that needs to be hand-tweaked (node trees are harder to debug visually)

### 8.3 v17 status

**Not currently used in v17.** The cube scene is a single-mesh Direct object. If you add a GN-based scene, document it in `LEARNED_BLENDER_LTS.md` and add a fixed `frame_` range to the scene script.

### 8.4 5.2 GN-specific features

From the 5.2 release notes:

- **Sample Sound Frequencies node** — audio-reactive animations
- **Mesh Bevel node** — procedural bevel on edges
- **Cloth Dynamics** — node-based modifier (replaces Cloth physics modifier)
- **Hair Dynamics** — node-based hair physics
- **XPBD Solver** — new built-in physics solver
- **Bundles** — Geometry Nodes 5.0+ feature, attach arbitrary data across modifier boundaries
- **Lists** — new core data type for sequences
- **Attribute filtering** — Tag & Filter system for effectors

---

## 9. Python scripting (`bpy`)

### 9.1 Headless API surface

The Blender Python API is documented at `https://docs.blender.org/api/5.2/`. Key modules for v17:

| Module | Purpose |
|---|---|
| `bpy` | Top-level access to data, operators |
| `bpy.data` | All scene data (objects, meshes, materials, lights) |
| `bpy.context` | Current scene/selected object |
| `bpy.ops` | Operators (mesh add, render, etc.) |
| `bpy.types` | Type classes for RNA introspection |
| `mathutils` | Vector, Matrix, Euler, Quaternion |

### 9.2 The pattern that works for v17

```python
import bpy
import sys
import os

# 1. Reset to clean factory state
bpy.ops.wm.read_factory_settings(use_empty=True)

# 2. Configure scene
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.fps = 30
scene.frame_start = 1
scene.frame_end = 90

# 3. Build objects
mesh = bpy.data.meshes.new('Cube')
obj = bpy.data.objects.new('Cube', mesh)
bpy.context.collection.objects.link(obj)

# 4. Add keyframes
obj.keyframe_insert(data_path='rotation_euler', frame=1)
obj.rotation_euler = (0, 0, 6.283185)
obj.keyframe_insert(data_path='rotation_euler', frame=90)

# 5. Render
bpy.ops.render.render(animation=True)
print(f"BLENDER_RENDER_DONE: {scene.frame_end} frames in {scene.render.filepath}")
```

### 9.3 Common pitfalls

- **Don't use `bpy.ops.object.*` outside of operator context** — they need the right context override. Use `bpy.data.objects.new()` directly.
- **Don't forget to `link` objects to a collection** — Blender won't render unlinked objects.
- **Don't assume `frame_end` is exclusive** — Blender treats it as inclusive. `frame_start=1, frame_end=90` = 90 frames.

### 9.4 Add-on management in 5.2

The 5.2 LTS release changed Extension (formerly Add-on) management:

- Extension platform: `https://extensions.blender.org/`
- CLI subcommand: `blender --command extension install pack-name`
- Repository management: `blender --command extension repo add`
- Package management: `blender --command extension package`

(Per the `advanced/command_line/extension_arguments.html` 5.2 manual page.)

For v17: **we don't currently use any extensions**. If you add one, pin its version in the pipeline script. The 5.2 LTS contract protects the API, but extensions can change.

---

## 10. Compositing & post-processing

### 10.1 Blender's built-in compositor

Blender has a node-based compositor at `compositing/index.html`. Useful for:
- Color-space adjustments
- Lens distortion
- Glare / bloom
- Layer-based effects

**For v17:** We don't use the compositor. The v17 pipeline composes in either ffmpeg (P5b) or DaVinci Resolve (P5). Blender's compositor is closed for the v17 line.

### 10.2 Color management

Default Blender color pipeline:
- Working space: `Linear sRGB`
- Output transform: `Filmic` (default since 2.0)
- Look: `None` (default)

If you change `scene.view_settings.view_transform` or `look`, document it. The v17 stack relies on default filmic output.

---

## 11. Hardware + macOS performance notes

### 11.1 Our hardware

| Component | Value |
|---|---|
| Device | Mac Studio M4 (`Mac16,9`) |
| macOS | 26.6 |
| Architecture | Apple Silicon (M4) — running binaries through `uname -m` = x86_64 (Rosetta) |
| GPU | Apple M4 Max, Metal 4 |
| RAM | 64 GB |

### 11.2 Blender on Apple Silicon

- **Use the official Apple Silicon build** (.dmg from `blender.org/download/lts`). Do not use the Intel build under Rosetta unless unavoidable.
- Note: in the v17 install, the binary reports `x86_64` via `uname -m`. The .app bundle is the Apple Silicon native build; `uname` reflects the shell-invocation environment. Test with `arch -arch arm64 /Applications/Blender.app/Contents/MacOS/Blender --version` if you suspect Rosetta is in play.
- Eevee on Metal: works headless.
- Cycles on Metal: works, but requires `compute_device_type = 'METAL'` if you want GPU rendering.

### 11.3 Render backend choices

| Engine | Apple Silicon backend | Notes |
|---|---|---|
| Eevee | Metal (default) | No config needed |
| Cycles | Metal RT (default in 5.2) | Falls back to CPU if Metal fails |
| Cycles | OptiX | **Not supported on Apple Silicon** — only NVIDIA RTX |
| Cycles | CUDA | **Not supported on Apple Silicon** — only NVIDIA |
| Cycles | HIP | **Not supported on Apple Silicon** — only AMD |

For v17 the only viable GPU backend on our hardware is **Metal**.

### 11.4 Optimizations for long renders

- **Tile size**: `4096` for CPU, `2048` for GPU (Cycles only).
- **Samples**: start with 64, increase only if grainy.
- **Persistence**: `bpy.context.preferences.as_datafolder = False` for headless to avoid persistence I/O.
- **Memory**: `--enable-cycles-osl` is off; OSL has overhead. Default is fine.
- **Disk I/O**: PNG sequence is parallel-friendly; consider `exr` for >8-bit.
- **Frame range**: keep frame ranges tight. 90 frames at 1080p PNG = ~50 MB; 370 frames = ~200 MB.

### 11.5 Vulkan vs. Metal

The 5.2 LTS manual describes Vulkan as a backend option. **For Apple Silicon, use Metal.** Vulkan support on macOS exists via MoltenVK but is not officially supported by Blender for Eevee/Cycles rendering. Do not enable Vulkan on our hardware.

---

## 12. The 5-stage editor system

Blender's UI is built around 5 editor types. For headless rendering, you don't need to operate the UI, but knowing them helps understand error messages and screenshots:

| Editor | Purpose | URL |
|---|---|---|
| **3D Viewport** | View + interact with the scene | `editors/3dview/index.html` |
| **Outliner** | Hierarchical scene-list view | `editors/outliner/index.html` |
| **Properties Editor** | Tabbed settings for selected object | `editors/properties_editor.html` |
| **Shader Editor** | Node-based material authoring | `editors/shader_editor.html` |
| **Compositor** | Node-based post-processing | `editors/compositor.html` |
| **Geometry Node Editor** | Node-based procedural modeling | `editors/geometry_node.html` |
| **Python Console** | Live REPL | `editors/python_console.html` |
| **Info Editor** | Operator history | `editors/info_editor.html` |
| **Text Editor** | Script editing | `editors/text_editor.html` |

For v17 we only use the Python Console and Text Editor in practice — script files are edited externally and passed via `-P`.

---

## 13. Files & format compatibility

### 13.1 Blend file compatibility

- `.blend` files saved in 5.2.0 open in all 5.2.x LTS releases.
- `.blend` files saved in 5.0/5.1 may need re-saving on 5.2 for Geometry Nodes tools.
- `.blend` files saved in 4.x LTS or earlier will open in 5.2 but use legacy features.

### 13.2 Workspace convention

v17 keeps Blender files out of the project root. The pattern is:
```
~/Projects/four-tool-video-stack/
├── build/
│   ├── blender_scene.py    ← Python scene definition
│   ├── run_pipeline.sh     ← P3 driver
│   ├── frames/             ← PNG output (90 files)
│   └── scene_3d.mp4        ← h264 output (P5 input)
```

### 13.3 Don't store .blend files in git

`.blend` files are binary and contain references to external assets. The v17 pipeline does not check in `.blend` files. The Python script is the source of truth.

---

## 14. Determinism & reproducibility

The v17 pipeline depends on byte-stable output. To ensure reproducibility:

1. **Always use `--factory-startup`** — prevents `~/.config/blender/5.2/startup.blend` from leaking in.
2. **Pin the binary path** — `/Applications/Blender.app/Contents/MacOS/Blender` (no `command -v blender`).
3. **Pin the Python script** — `build/blender_scene.py` is the source of truth.
4. **No random seeds in the scene** — v17 cube has no random elements. If you add particles or noise, set explicit seeds.
5. **Don't trust Eevee defaults** — Eevee defaults DO change between minor releases. For full stability, set `scene.view_settings.view_transform = 'Filmic'` explicitly (which the v17 script does NOT currently do — this is a known gap).

---

## 15. Common gotchas (canonical list)

| Gotcha | Fix |
|---|---|
| `TypeError: enum "FFMPEG" not found` | Use PNG + ffmpeg stitch (NEVER FFmpeg enum) |
| `Image does not exist` from ffmpeg | Check `frame_%04d.png` glob — must be 4-digit padded |
| `format.duration=0` from ffprobe | Use `nb_frames` not `duration` for PNG-stitched mp4s |
| macOS hangs in headless mode | Add `-noaudio` flag |
| Different renders on different machines | Use `--factory-startup` + explicit seed + explicit output transform |
| `paint.eraser_brush` removed | Don't reference it (v17 doesn't) |
| GN modifier API changed | Test against 5.2.0 specifically |
| 5.1 → 5.2 asset file doesn't work | Re-save once on 5.2.0 |
| `Compare` / `Random Value` node socket IDs changed | Re-author node groups |
| OOM on Cycles | Lower sample count, lower resolution, smaller texture pool |
| `OSL: shader not found` | OSL disabled by default; enable in Cycles render settings |
| Subtitles wrong in motion | Don't add subtitles in Blender — use Resolve |

---

## 16. Performance budget for v17

| Stage | Time (typical) | Bottleneck |
|---|---|---|
| Blender startup + scene build | ~1–2 s | Python startup, factory settings |
| Blender render (Eevee, 90 frames × 1080p) | ~5–10 s | GPU fill rate |
| ffmpeg stitch (90 PNGs → h264) | ~3–5 s | libx264 medium preset |
| **Total P3 elapsed** | **~10–17 s** | |

If P3 takes >30 s, check:
- Eevee is the engine (not Cycles by accident).
- Resolution is **1920×1080** (not 4K).
- Frame count is **90** (not 370).
- `preset medium` (not slower).

---

## 17. Quick reference card

```bash
# Check version
/Applications/Blender.app/Contents/MacOS/Blender --version

# Render scene (headless)
/Applications/Blender.app/Contents/MacOS/Blender \
    -b -noaudio --factory-startup -P build/blender_scene.py

# Probe output
ffprobe -v error -show_entries stream=nb_read_frames,codec_name,width,height,r_frame_rate \
        -of default build/scene_3d.mp4

# Stitch PNGs to mp4 (canonical command)
ffmpeg -y -framerate 30 -i build/frames/frame_%04d.png \
       -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -movflags +faststart \
       build/scene_3d.mp4

# Render animation range override
/Applications/Blender.app/Contents/MacOS/Blender -b -noaudio --factory-startup \
    -P build/blender_scene.py -- --start 1 --end 90
```

---

## 18. Sub-agent decision matrix

| If you need to... | Do this |
|---|---|
| Render a static 3D scene | Write a new Python script using `bpy`, follow §4.2 pattern |
| Render an animation | Use keyframes (§7) or Geometry Nodes (§8) |
| Generate 4K renders | Use Cycles, samples ≥ 64, `tile_size = 2048` |
| Add audio reactivity | Use Geometry Nodes `Sample Sound Frequencies` (5.2 feature) |
| Export to a different format | Look at §6.3 (ProRes), then add to `run_pipeline.sh` |
| Upgrade Blender | **DO NOT.** Stay on 5.2 LTS until 5.4 LTS or 6.0 LTS. |
| Modify `blender_scene.py` | Edit it in place, then `cd ~/Projects/four-tool-video-stack && ./build/run_pipeline.sh` to verify |
| Add a new LTS upgrade | Create a new pipeline version (v18, v19, etc.) — don't break v17's LTS pin |

---

## 19. Five-stage authority for Blender work

| Stage | Owner | Authority |
|---|---|---|
| Blender version pin (5.2.0 LTS) | **Marcelo** to deviate from LTS | BossMan squad stays on 5.2 LTS by default |
| Scene contents | **BossMan** to design | Owner of the 3D scene composition |
| Render settings (engine, resolution, fps) | **BossMan** to set | Pipeline defaults documented in §4.3 |
| Python script contents | **Sub-agents** to implement | Per §4.2 pattern |
| Resolving a Blender bug | **BossMan** to fix | Use Perplexity + docs.blender.org |
| Documentation update | **BossMan** to update | This file is canonical |

---

## 20. Open gaps to address (next iterations)

From the stack integration audit (2026-07-30):

| Gap | Severity | Recommended fix |
|---|---|---|
| No frame-count assertion between Blender and ffmpeg | High | Add `[[ $(grep -c BLENDER_RENDER_DONE log.txt) == 1 ]]` check |
| No `-t` duration on ffmpeg stitch | Medium | Add `-t 3.0` to clamp to expected duration |
| No `--cycles-device` choice documented | Medium | Add to §5.3 when first used |
| No Blender version pin recorded in pipeline | Medium | Capture `blender --version` output in `build/run_pipeline.sh` |
| No color management consistency between Blender and Resolve | Low | Document `view_transform = 'Filmic'` in §10.2 (already there) |
| Hardcoded `/Applications/Blender.app` path | Low | Add `command -v` fallback |
| Audio shorter than video | Low | Audio is 12.26 s, video is 3 s — composite uses `-shortest` |
| No intermediate frame checksum | Low | Out of scope for v17 |
| No `--version` recorded in build logs | Low | Add to `run_pipeline.sh` |
| Eevee details under-documented | Low | Expand §5.2 over time |

---

## 21. Definitions

| Term | Meaning |
|---|---|
| **LTS** | Long-Term Support — 2-year fix-only branch |
| **Eevee** | Real-time rasterizer engine (Blender 5.2 default for v17) |
| **Cycles** | Path tracer engine (slower, higher quality) |
| **GN** | Geometry Nodes — node-based procedural modeling |
| **PNG-stitched mp4** | Ffmpeg-composed mp4 from PNG sequence (no `format.duration`) |
| **Headless** | `-b` mode, no GUI, used for server/CI rendering |
| **Factory startup** | `--factory-startup` flag, ignores user prefs |
| **Bundle path** | `/Applications/Blender.app/Contents/MacOS/Blender` (macOS .app structure) |
| **Splash / splash artwork** | The 5.2 release artwork "Panthera spelaea" by Joanna Kobierska |

---

## 22. References (canonical URLs, all verified HTTP 200 on 2026-07-30)

### 22.1 Official documentation

| Resource | URL |
|---|---|
| Blender 5.2 LTS Manual TOC | https://docs.blender.org/manual/en/5.2/index.html |
| Blender 5.2 release notes (developer wiki) | https://developer.blender.org/docs/release_notes/5.2/ |
| Blender 5.2 release notes (user-facing) | https://www.blender.org/download/releases/5-2/ |
| LTS Handbook (policy) | https://developer.blender.org/docs/handbook/release_process/lts/ |
| LTS download page | https://www.blender.org/download/lts/ |
| Python API reference (5.2) | https://docs.blender.org/api/5.2/ |
| Cycles engine | https://docs.blender.org/manual/en/5.2/render/cycles/index.html |
| Eevee engine | https://docs.blender.org/manual/en/5.2/render/eevee/index.html |
| Geometry Nodes | https://docs.blender.org/manual/en/5.2/modeling/geometry_nodes/index.html |
| Output settings | https://docs.blender.org/manual/en/5.2/render/output/index.html |
| Command-line args | https://docs.blender.org/manual/en/5.2/advanced/command_line/index.html |
| Add-on tutorial | https://docs.blender.org/manual/en/5.2/advanced/scripting/addon_tutorial.html |
| Animations | https://docs.blender.org/manual/en/5.2/render/output/animation.html |
| GPU rendering | https://docs.blender.org/manual/en/5.2/render/cycles/gpu_rendering.html |
| Cycles performance | https://docs.blender.org/manual/en/5.2/render/cycles/render_settings/performance.html |
| Eevee performance | https://docs.blender.org/manual/en/5.2/render/eevee/render_settings/performance.html |
| Compositor | https://docs.blender.org/manual/en/5.2/compositing/index.html |
| Asset libraries | https://docs.blender.org/manual/en/5.2/files/asset_libraries/index.html |
| macOS installation | https://docs.blender.org/manual/en/5.2/getting_started/installing/macos.html |
| Hardware config | https://docs.blender.org/manual/en/5.2/getting_started/configuration/hardware.html |
| Interface / Editors | https://docs.blender.org/manual/en/5.2/interface/index.html |
| 3D Viewport | https://docs.blender.org/manual/en/5.2/editors/3dview/index.html |

### 22.2 Verified 2025–2026 learning resources

| Resource | URL | Type | Date |
|---|---|---|---|
| **Customizing Material Assets** (Blender 5.2) | https://studio.blender.org/training/customizing-material-assets/ | Paid Blender Studio course (€17/mo) | 2025 |
| **Full Blender 4 Course for Complete Beginners 2025** | https://www.youtube.com/watch?v=r6ZQil-zd5Y | Free YouTube course (Polygon Runway, 541K) | 2024-02 (re-released 2025) |
| **Geometry Nodes for Beginners** | https://www.youtube.com/watch?v=188IeRY-ch0 | Free YouTube tutorial (Ryan King Art, 392K) | 2026-07-05 |
| **Beginner Blender Tutorial (2026)** (bonus) | https://www.youtube.com/watch?v=z-Xl9tGqH14 | Free YouTube (Blender Guru, 3.44M) | 2026-01-14 |
| **Mastering the Asset Browser in Blender 5.1** (bonus) | https://www.youtube.com/watch?v=j1EhPPFrZgk | Free YouTube (Grant Abbitt) | 2026-04-16 |
| **How to make a remote asset library in Blender 5.2** (bonus) | https://www.youtube.com/watch?v=lWnRAZMXOYQ | Free YouTube (Default Cube) | 2026-05-15 |

### 22.3 Local artifacts (Phase 1)

| Path | Purpose |
|---|---|
| `~/Projects/four-tool-video-stack/refs/blender_5.2/` | 14+ pages mirrored from docs.blender.org/manual/en/5.2/ |
| `/tmp/blender_52_mirror/` | 24 HTML files mirrored (subagent 1) |
| `/tmp/blender_docs_index.json` | 11 KB machine-readable URL index |
| `/tmp/blender_docs_summary.md` | 11 KB section summary |
| `/tmp/blender_stack_integration.md` | 13.7 KB stack integration report |
| `/tmp/blender_tutorials.json` | 7 KB tutorials with verification metadata |

### 22.4 Cross-references in this canon

- `LEARNED_FOUR_TOOL_VIDEO_STACK.md` — the v17 pipeline's general knowledge file
- `LEARNED_FFMPEG.md` (if exists) — ffmpeg stitch details
- `LEARNED_VIDEO_RENDERING.md` — overall video rendering pipeline
- `BLUEPRINT.md` — the v17 pipeline architecture
- `LEARNED_APPLE_MOTION.md` — Apple Motion knowledge (sister doc)

---

## 23. Maintenance

- **Update trigger:** When Blender 5.4 LTS or 6.0 LTS is released (estimated late 2028), plan a v18 pipeline.
- **Update owner:** BossMan on every Blender version bump.
- **Update cadence:** Whenever a sub-agent discovers a Blender gotcha, append to §15.
- **Verification:** After every update, re-run `verify.py` — should still be 26/26 PASS.

---

## 24. Version history

| Date | Version | Change | Author |
|---|---|---|---|
| 2026-07-30 | 1.0 | Initial LEARNED created with 24 sections, 5.2 LTS pin, v17 integration audit | BossMan + 3 sub-agents |
