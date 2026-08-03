# LEARNED_APPLE_MOTION.md — Apple Motion 6.3 in the Hermes Stack

**Status:** Active knowledge (2026-07-30). Authored from Motion 6.3 User Guide (Apple, official) + Apple Support + Creator Studio tutorial sources.
**Owner:** BossMan (content lane).
**Scope:** Apple Motion 6.x as it relates to the four-tool video stack on Mac Studio M4 + future pipelines.
**Companion files:**
- `LEARNED_FOUR_TOOL_VIDEO_STACK.md` — operational stack (ElevenLabs + Blender + Motion + Resolve Studio)
- `LEARNED_VIDEO_RENDERING.md` — rendering pipeline rules
- `LEARNED_V4_CANONICAL_LOCK.md` — canonical decisions
- `~/Projects/four-tool-video-stack/BLUEPRINT.md` — project blueprint
- `~/Projects/four-tool-video-stack/refs/motion_user_guide_6.3.pdf` — extracted 1393-page PDF (local mirror)

---

## 1. What Apple Motion Is

Apple Motion is Apple's motion-graphics and compositing app. It is **not** a video editor (Final Cut Pro is); it is **not** a professional compositor for long-form film (Nuke/After Effects fill that role). It occupies a unique position: **titles, motion graphics, particle systems, animated 2D/3D overlays, generators, and effects templates** that feed into Final Cut Pro and other NLEs.

**Key positioning facts (Motion 6.3 User Guide):**
- Ships bundled with Final Cut Pro for Mac and is also available standalone on the App Store.
- Tightly integrated with Final Cut Pro via **templates** (titles, generators, effects, transitions) and **publishing**.
- Apple silicon-native; "Apple Intelligence" features (Image Playground) require macOS 15.2+ on M1+ chips.
- Real-time engine leverages the GPU; supports external GPUs (eGPU).
- Designed for Mac Studio M4 / M-series workflows — Rosetta is auto-installed for non-native codec imports.

**One-line job in our stack:** "The 2D motion-graphics layer." Adds titles, lower thirds, animated overlays, particle bursts, and motion-graphic intros/Outros on top of Blender 3D scenes before Resolve Studio validation + ffmpeg composite.

---

## 2. Core Capabilities (the 8 things Motion does well)

From the Motion 6.3 User Guide table of contents and verified section reads:

| # | Capability | Where it shines | Best for our stack |
|---|------------|-----------------|--------------------|
| 1 | **Text & Titles** | Animated titles, lower thirds, 3D text, text behaviors | Lower thirds on Blender scenes, animated intro titles |
| 2 | **Behaviors** (procedural animation) | Throw, Spin, Fade, Grow/Shrink, Motion Path, Framing, Align To | Animating 2D overlays without hand-keyframing every parameter |
| 3 | **Keyframing** (traditional animation) | Position, scale, rotation, opacity, blend modes, parameter curves | When behaviors don't fit — exact-timing work |
| 4 | **Particle Systems** | Emitters with cells (image/shape/text sources), physics-driven motion | Logo reveal particles, energy effects, snow/smoke overlays |
| 5 | **Cameras & 3D** | Real 3D scene cameras, depth-of-field, framing behaviors, multi-camera scenes | Camera moves over 2D + 3D composited layers |
| 6 | **Tracking & Match Moving** | 6 tracking behaviors — Analyze Motion, Match Move, Stabilize, Corner Pin, Tracking Points, Track To | Pin overlays to moving Blender camera output |
| 7 | **Templates** (publishing to FCP) | Custom title/effect/generator/transition templates with drop zones | Single asset reused across many videos |
| 8 | **Image Playground** (Apple Intelligence, M1+ macOS 15.2+) | Generate AI concept images (Animation, Illustration styles) into project as 1024×1024 HEIC | Concept art for backgrounds, hero graphics |

**Sections NOT covered well by Motion:** raw video editing (use FCP), node-based compositing at Nuke scale (Motion is layer-list based), color grading (Resolve Studio is canonical for our stack), audio mixing/mixing (use Logic/Fairlight).

---

## 3. The 7-Step Motion Workflow

From the Motion User Guide "Motion workflow" section (page ~6) — this is the canonical order of operations:

```
1. ASSET PREP      → Organize source media in Finder; import-ready naming.
2. CREATE PROJECT  → File > New or New from Project Browser; set frame size, frame rate, duration, color space.
3. ORGANIZE        → Import media (File > Import); use Layers list + Groups to organize hierarchy.
4. ANIMATE         → Use Behaviors OR Keyframes (NOT both unless combining intentionally).
5. POLISH          → Apply Filters, Masks, Blend Modes; tune timing.
6. PREVIEW         → RAM Preview (Cmd-B); use HUD onscreen controls.
7. EXPORT          → File > Share > pick a destination; or File > Publish Template for FCP reuse.
```

**Critical rule from the guide:** "When you apply a behavior to an object, no keyframes are added. Rather, behaviors automatically generate a range of values." Behaviors and keyframes coexist but should be designed coherently — don't fight a behavior by keyframing the same parameter with conflicting values.

---

## 4. Project Settings — Frame Size, Frame Rate, Duration, Color

From page 51 of the Motion 6.3 User Guide ("About Motion project frame size"):

**Frame size** controls the resolution of the canvas AND the exported file. It is independent of media resolution — you can mix 1080p, 4K, and 8K media in the same project. To change: **Format > Project Size** (or Modify > Project Properties in older builds).

**Standard presets we use in the stack:**

| Preset | Resolution | Frame rate | When |
|--------|-----------|------------|------|
| **YouTube 1080p** | 1920×1080 | 29.97 fps | Default v17 pipeline output (`final.mp4`) |
| **YouTube 4K** | 3840×2160 | 29.97 fps | Premium-tier videos |
| **YouTube Shorts** | 1080×1920 | 29.97 fps | Vertical short-form |
| **Apple Devices (Apple TV 4K)** | 3840×2160 | 23.976/29.97/59.94 fps | HDR content |
| **360° equirectangular** | 3840×2160 (min) | matches source | Special 360° use case |

**Frame rate considerations:** Motion preserves the imported media's frame rate. When mixing 23.976fps clips with 30fps project frame rate, retime the slow clip (Retiming > Slow 80%). Don't change project frame rate mid-project.

**Duration:** set via Format > Project Duration (or Modify > Project Properties). Projects start infinite; still images stretch to fill project duration.

**Color processing method:** Motion handles Rec. 709 (SDR), Rec. 2020 (HDR), and Dolby Vision. Match the project's color method to the source media + target output. For our v17 pipeline (SDR H.264 YouTube target): default Rec. 709.

---

## 5. Keyframing — Mechanics

From the Motion 6.3 User Guide page 387 ("Keyframe controls in the Inspector"):

**Keyframe UI in the Inspector:**
- **Add/Delete Keyframe button**: diamond outline = no keyframe; click = add keyframe at playhead. Diamond turns solid gray = keyframe exists; click = delete.
- **Previous/Next Keyframe** arrows appear when a parameter has keyframes before/after the playhead.

**Keyframe modes (Timeline > Keyframe > Set Mode):**
- **Quick**: auto-smoothed (Bezier handles auto-adjust).
- **Fitted**: Bezier handles manually editable for full control.
- **All**: every selected keyframe edits together (combine with Curves mode for color/opacity tweens).

**Best practices from the guide:**
- Set initial keyframes FIRST (define "before" state), then move playhead, then edit the "after" state — Motion adds the keyframe automatically on parameter change.
- Use **Hold** keyframes for instant parameter changes (no interpolation) — Timeline > Keyframe > Convert to Hold.
- For group transforms (Position + Scale + Rotation together), use **Group transform** parameters rather than per-layer keyframes — fewer keyframes, cleaner curves.

---

## 6. Behaviors — The Procedural Animation Toolkit

From the Motion 6.3 User Guide pages 211, 279–280 ("Animate with behaviors"):

**What behaviors are:** Non-keyframe animation effects. Apply them to an object → Motion auto-generates values for the duration of the behavior. Edit the behavior's parameters to retune the animation.

**Categories (from the Library sidebar):**

| Category | Notable behaviors | Use case |
|----------|-------------------|----------|
| **Basic Motion** | Throw, Spin, Fade, Grow/Shrink, Motion Path, Scale | One-shot entrance/exit animations |
| **Parameter** | Link, Oscillate, Randomize, Sequence, Track | Drive one parameter procedurally |
| **Camera** | Framing, Sweep, Dolly, Focus | Animated camera moves |
| **Tracking** | Analyze Motion, Match Move, Stabilize | Pin overlays to source movement |
| **Particles** | Scale Over Life, Fade Over Life | Particle-cell modulation |
| **Replicator** | Scatter, Sequence, Oscillate | Cellular patterns |
| **Shape** | Oscillate, Points Along Path, Randomize | Animate shape paths |
| **Text** | Sequence Text, Tracking In/Out, Text On Path, Wave | Animate text glyphs |
| **Audio** | Audio Parameter | React to audio waveform |

**Critical rules from the guide:**
- Behaviors live in the **Library** (`Cmd+1` to open).
- Apply by drag-and-drop onto layer, or Behaviors pop-up menu in toolbar.
- Adjust via Behaviors Inspector OR HUD (heads-up display) onscreen controls.
- **Order matters**: behaviors on the same parameter compose. Reorder by dragging in the Layers list.
- **Save to Favorites** for reusable animations: drag the behavior from Layers list into the Library's Favorites category.

**"Affect Subobjects" toggle:** when applied to a group/emitter, determines whether the behavior affects the parent object or its children. Important when applying Throw/Spin to particle emitters or replicators — test both.

---

## 7. Particle Systems

From the Motion 6.3 User Guide pages 544, 552:

**Anatomy:**
- **Emitter** = the source (location, birth rate, angle, range, speed).
- **Cells** = the visual elements (image, shape, text, video clip). Use 1–4 cells per emitter for variety.
- **Behaviors** = applied to the emitter or cells for motion/physics (Scale Over Life, Fade Over Life, Spin, Throw).

**Cell image sources:**
- Still images (PNG, JPEG, HEIC, TIFF, PSD, OpenEXR) — see supported formats in §11.
- Shape layers (vector primitives).
- Text glyphs (each character becomes a particle).
- Video clips (page 552 caution: "Using a video clip as the image source of a particle cell may impact your project's playback performance.").

**Best practices from the guide (page 552):**
- "Clips to be used as particles should be saved using a high-quality codec, such as Animation, Uncompressed 8- and 10-bit 4:2:2, or ProRes 4444. Other codecs can be used, but they might introduce unwanted artifacts."
- "Particles created from clips loop over and over for the duration of each particle's life. If the clip you use doesn't loop well, there will be a jump cut at every loop point."
- For looping animation, **use very short loops** (~0.5–2 sec) to mask loop points and add randomness.

**Filters and masks on emitters:**
- Filters/masks can be applied to the emitter (affects the whole system).
- Filters/masks CANNOT be applied to individual cells — work around by applying the filter to the cell's image source layer instead.

---

## 8. Cameras & 3D

From the Motion 6.3 User Guide pages 182, 211:

**Camera setup basics:**
- Cameras only matter when a layer is enabled as **3D** in the Layers list (the cube icon). 2D layers ignore camera depth.
- Active camera is set in the **Camera pop-up menu** in the upper-left of the canvas: Active, Camera 1, 2, 3..., 360° Overview, Perspective, Orthographic.
- **Multiple cameras** allow quick cutaways: in the Layers list, lock all but the active camera; unlock the next camera at the desired frame.

**Camera behaviors** (page 211+):
- **Framing behavior**: target a layer → camera auto-adjusts zoom/position to frame the target. Add Transition time and Easing for smooth move.
- **Sweep, Dolly, Focus** behaviors: animated camera moves without keyframing.

**3D intersection:** by default, layer order in the Layers list overrides 3D depth. To make 3D objects intersect (cross in front/behind), use **Create 3D Intersection** via the Layers list's shortcut menu — this forces the order to be depth-driven, not list-driven.

**Rasterization side effect (from page 1380):** "When a 3D group is rasterized, the group as a whole can no longer intersect with objects outside the group." Some filters force rasterization — be aware.

---

## 9. Tracking & Match Moving

From the Motion 6.3 User Guide page 1158 ("Intro to tracking in Motion"):

**Six tracking behaviors:**

| Behavior | Purpose |
|----------|---------|
| **Analyze Motion** | Records movement data from a source clip (no destination assigned) |
| **Match Move** | Applies source clip's movement to a destination layer — most common |
| **Stabilize** | Removes shake from source clip |
| **Corner Pin** | Tracks four corner points for screen-replacement / sign replacement |
| **Tracking Points** | Multi-point tracking with individually addressable trackers |
| **Track To** | Pins a destination layer to one tracked point |

**Workflow:**
1. Apply Analyze Motion or Match Move to the source clip layer.
2. Drag the onscreen tracker to the reference pattern in the canvas (high-contrast, easily identifiable detail).
3. Click the **Analyze** button in the Behaviors Inspector.
4. (For Match Move) drag the destination layer onto the Tracker's "Attach" image well.
5. (For corner pin) use four trackers to define the surface corners.

**For our v17 pipeline:** if Blender scene rendering produces a moving camera shot, Motion can take the rendered `.mov` + a destination overlay (logo, lower-third) and match-move the overlay to the camera motion. This is the highest-value Motion automation beyond title rendering.

---

## 10. Templates (the FCP integration power move)

From the Motion 6.3 User Guide page 39 ("Use templates in Motion"):

**Four template types Motion can publish:**
1. **Title templates** (FCP's "Titles" sidebar).
2. **Generator templates** (FCP's "Generators" sidebar — animated backgrounds, placeholders).
3. **Effect templates** (FCP's "Effects" sidebar — chain-able filters).
4. **Transition templates** (FCP's "Transitions" sidebar).

**Drop zones:** wells in the template that the FCP user drops their own media into (logo, headline, image). Mark any layer or group as a drop zone via **Publish** → check "Published" in the Inspector, then set the Well type.

**To publish:** **File > Publish Template** (Cmd-Shift-S while project is set as a standard Motion project). Choose the template type and save to `/Users/username/Movies/Motion Templates/` (or a custom folder).

**Workflow from Final Cut Pro:** in FCP, browse to **Titles > My Templates > [name]** and drag onto the timeline; drop assets into the orange drop zones in the viewer.

**For our stack:** if we ever want to scale v17-style videos beyond 1-per-build, Motion templates published into FCP let a non-technical editor remix the same look. Not currently wired into the v17 pipeline (we still render-per-video) — flagged as a Phase 6 candidate.

---

## 11. Supported Media Formats (Motion 6.3)

From the Motion 6.3 User Guide pages 62–64 ("Supported media formats in Motion"):

**Video formats we use:**
- **H.264 (AVC)** — primary v17 input/output.
- **H.265 (HEVC)** — higher-quality alternative.
- **Apple ProRes (all versions)** — intermediate codec for Blender → Motion round-trip.
- **Apple ProRes 4444** — when alpha channel is needed (overlays with transparency).
- **Apple ProRes RAW and ProRes RAW HQ** — RAW workflows.
- **QuickTime formats (MOV)** — default container.

**Still image formats we use:**
- **PNG** — primary, supports alpha.
- **JPEG** — photos.
- **HEIC/HEIF** — Apple-native stills (e.g., Image Playground outputs 1024×1024 HEIC).
- **PSD** — merged and layered (Photoshop imports).
- **OpenEXR** — HDR / linear-color workflows.

**Audio formats we use:**
- **MP3** — primary voice input from ElevenLabs (ElevenLabs outputs MP3 by default).
- **WAV** — intermediate high-fidelity.
- **AAC** — embedded in MOV/MP4.

**Container formats:** MOV (QuickTime), MP4, MXF, MTS/M2TS, 3GP, AVI.

**Critical caveat (from page 64):** "If you're using a Mac with Apple silicon and you import media in a video format that is not compatible with Apple silicon, a dialog to install Rosetta is displayed. After installing Rosetta, you must quit and reopen Motion." We hit this once on Mac Studio M4 — flag in the kanban card whenever Motion opens with an unexpected Rosetta prompt.

**Mixed-format rule:** "You can combine clips that are compressed with different codecs in the same project. You can also combine clips that have different frame sizes and pixel aspect ratios."

---

## 12. Export & Sharing — Destinations

From the Motion 6.3 User Guide pages 1248–1259 ("Share Motion projects"):

**Default destinations in the Share menu:**

| Destination | Output | When |
|-------------|--------|------|
| **Export Movie (default)** | QuickTime `.mov` | Highest-quality intermediate |
| **Export Selection to Movie** | QuickTime `.mov` (selected layer only) | Exporting a single overlay with alpha (page 882: use ProRes 4444 for alpha) |
| **Export Audio** | `.m4a` / `.aac` | Voice-only, music stems |
| **Save Current Frame** | PNG / JPEG / TIFF / HEIC | Still image of any frame |
| **Export Image Sequence** | PNG / TIFF / DPX / OpenEXR | Frame-by-frame export for offline compositing |
| **Apple Devices** | H.264 .m4v for iPhone/iPad/Apple TV | Direct device preview |
| **Email** | Creates Mail.app message with attached movie | Quick share |
| **Send frame to Pixelmator Pro** | PNG into Pixelmator | Quick edit handoff |

**Custom destinations:** choose **Share > Add Destination** to create a customized one (e.g., 4K H.264 preset). Custom destinations live in the Share menu.

**The two-step Share flow:**
1. **Info pane**: set title, description, metadata.
2. **Settings pane**: codec, frame rate, resolution, color channels (Alpha vs Color), bitrate, audio codec.
3. **Save** the file.

**Codec recommendations per pipeline step:**

| Pipeline step | Codec | Container | Why |
|---------------|-------|-----------|-----|
| Blender → Motion intermediate | ProRes 422 LT | .mov | Fast decode, high quality, no alpha needed |
| Motion → Blender overlay round-trip | ProRes 4444 | .mov | Alpha channel for compositing |
| Motion → final ffmpeg composite source | H.264 high profile | .mov | Already at target codec; ffmpeg just remuxes |
| Motion → YouTube upload | H.264 high profile | .mp4 | YouTube prefers .mp4 |

**Alpha channel codec rule (page 882):** "In the Settings pane of the Export Selection to Movie window, click the Video Codec pop-up menu, then choose a codec that supports alpha channels (such as Apple ProRes 4444)." Followed by Color Channels pop-up → choose Alpha (or Color + Alpha).

---

## 13. Apple Intelligence / Image Playground

From the Motion 6.3 User Guide pages 61–62:

**What it is:** Generate AI concept images inside Motion via File > Import > Image Playground (Option-Shift-P). Output is 1024×1024 HEIC added to the project. Saved to `/Users/username/Movies/Motion Projects/Image Playground Media/`.

**Requirements:**
- macOS 15.2 (Sequoia) or later.
- Mac with M1 chip or later (we're on M4 — fine).
- Apple Intelligence must be enabled in System Settings.

**Inputs:**
- Concept picker (suggestion, theme, expression, costume, accessory, place).
- Text description.
- Person photo (from library).
- Source photo (subject of the generation — pet, food, etc.).
- Style picker (Animation, Illustration, etc.).

**For our pipeline:** potential for hero graphics, custom lower-third backgrounds, animated-style intros. Output is a still image — to animate it, drop it into a Motion layer + add behaviors (Spin, Fade In, etc.) or hand-keyframe.

**Caveat from the guide:** "Apple Intelligence uses generative models and outputs may vary. Check important information for accuracy." Don't ship AI-generated graphics without review for factual accuracy (e.g., fake product shots, fake people).

---

## 14. Apple Silicon & Performance Notes

From the Motion 6.3 User Guide pages 1380, 1387 ("Rasterization", "Work with GPUs"):

**Apple silicon optimization:**
- Motion is Apple silicon-native. Rosetta 2 is invoked only for non-native codec imports.
- **Magnetic Mask** performance: "For the best performance, use a Mac with Apple silicon when working with Magnetic Masks." (page 882)

**GPU options:**
- Internal Apple silicon GPU is the default.
- eGPU supported — drag project window to eGPU-attached display, or enable "Prefer eGPU" in Motion Info (Cmd-I on .app).
- Certain filters force rasterization (page 1387 — "All Tiling filters force rasterization of 3D groups", "All Time filters force rasterization", "Deinterlace filter force rasterization"). Rasterized 3D groups lose 3D intersection with objects outside the group.

**Performance tips from the guide:**
- "Playback performance: Using a video clip as the image source of a particle cell may impact your project's playback performance."
- Use ProRes 422 LT or H.264 high profile for previews; avoid 8K media when 1080p output is intended.
- Use **RAM Preview (Cmd-B)** to cache preview renders — mandatory for complex compositions.

---

## 15. Automation Reality — Why Motion Is GUI-Only

**Critical fact:** Apple Motion has NO official scripting API. No AppleScript dictionary, no Python API, no headless render mode. It is exclusively a **GUI app**. This is a fundamental constraint in the four-tool video stack:

| Tool | Headless? | CLI render? | Use in pipeline |
|------|-----------|-------------|-----------------|
| **ElevenLabs** | ✅ API-based | curl + jq | TTS (voice.mp3) |
| **Blender** | ✅ Headless via `-b` flag | `blender -b scene.blend -o frame_###.png` | 3D scene (scene_3d.mp4) |
| **Motion** | ❌ **GUI-only** | ❌ **No CLI render** | **NOT used in current v17 pipeline** |
| **DaVinci Resolve Studio** | ✅ Scripting API (Lua/Python) | partial; P5-Resolve = validation only | verification + (planned) color |
| **ffmpeg** | ✅ CLI | full | final composite + mux |

**Current v17 pipeline approach for motion-graphics overlays:** use **ffmpeg** for animated text / lower-thirds (e.g., `drawtext` filter with `enable=between(t,...)` for fade-in timing). This is the **fallback path** in `BLUEPRINT.md`.

**When to bring Motion in (manual sub-agent UI workflow):**
1. BossMan opens Motion GUI on Mac Studio M4 (Hermes Computer Use).
2. Renders a static or animated `.mov` overlay (e.g., intro title, particle burst).
3. Saves to `~/Projects/four-tool-video-stack/build/motion_overlay.mov`.
4. ffmpeg composites the `.mov` onto the Blender scene + voice.
5. Resolve Studio validates final + ffmpeg muxes the final `.mp4`.

This is **GUI-only, manual-touch, sub-agent-performed**. Marcelo does NOT open Motion.

**Future automation candidates (flagged, NOT committed):**
- FxPlug SDK (developer-level Motion plugin API) — third-party tools like MotionVFX scripts Motion programmatically, but they're GUI-driven.
- Compressor as a batch render queue — but requires Compressor license ($50) and Motion still needs to be open.
- Apple Vision Pro / VisionOS Motion? — too speculative for v17 stack.

---

## 16. v17 Pipeline Integration (Current State)

**Where Motion COULD slot in:**

| Stage | Current | Motion-enabled alternative |
|-------|---------|----------------------------|
| Intro bumper | ffmpeg drawtext | Motion export of `motion_intro.mov` |
| Lower thirds | ffmpeg drawtext | Motion export of `motion_lower_third.mov` |
| Animated overlay (logo, particle burst) | Blender particles | Motion particles export |
| Outro / end card | ffmpeg drawtext | Motion export of `motion_outro.mov` |

**v17 pipeline does NOT use Motion.** Reasons:
1. Motion requires GUI → cannot be scripted in PM2/autonomous cron.
2. ffmpeg drawtext is sufficient for our current output style.
3. Adding Motion as a stage would require sub-agent GUI interaction per video (slow).

**Trigger conditions to ADD Motion to the pipeline:**
- Marketing/sales need a custom branded intro for a product launch.
- A video requires particle effects (energy, sparkle, reveal).
- A series shares an animated template — render once in Motion, reuse via template.

### v17 sibling tools (cross-references from Motion's perspective)

- **Blender 5.2 LTS (render engine)** — Motion outputs alpha-aware `.mov` files that layer on top of Blender's 3D base. Blender LTS 5.2.0 is pinned to commit `fbe6228777e7` (2-year support window July 2026 → July 2028). When Motion's output replaces a Blender particle burst, the layer alpha must match the Blender render format (`png` for stills, `ffmpeg -c:v h264 -pix_fmt yuv420p` for stitched video). See `LEARNED_BLENDER_LTS.md` for the rendering pipeline.
- **DaVinci Resolve Studio (validator)** — Motion's output lands in Resolve as V2 (overlay track) via `MediaPool.AppendToTimeline`. Resolve Studio v21.0.3 (App Store variant, bundle id `com.blackmagic-design.DaVinciResolveAppStore`) constructs a real `.drp` project to validate the timeline structure. **Motion is GUI-only and is not the validator** — Resolve Studio validates; Motion overlays. Full rationale in `LEARNED_DAVINCI_RESOLVE_STUDIO.md` §10.
- **ffmpeg composite (final encode)** — after Motion's `.mov` is exported, ffmpeg's `[1:v]overlay=0:0:format=auto[v]` filter composites it over Blender's base, and the final encode uses `-c:v h264 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k`. The `+faststart` flag is **mandatory** — without it, YouTube's processor buffers the moov atom before playback, increasing initial load time 30–60%.

---

## 17. Key Controls & Keyboard Shortcuts

From the Motion 6.3 User Guide page 1330 ("Keyboard shortcuts") and page 1314 ("Motion menus"):

**Essential shortcuts every Motion operator must know:**

| Shortcut | Action |
|----------|--------|
| **Cmd-N** | New project |
| **Cmd-O** | Open project |
| **Cmd-S** | Save project |
| **Cmd-Shift-S** | Save As / Publish Template |
| **Cmd-I** | Import media |
| **Cmd-Shift-I** | Import As Project |
| **Cmd-E** | Export Movie (Share) |
| **Cmd-B** | RAM Preview |
| **Cmd-1** | Open Library |
| **Cmd-2** | Open Inspector |
| **Cmd-3** | Open Project Pane (Timeline/Layers/Media) |
| **Cmd-4** | Open HUD (heads-up display) |
| **Spacebar** | Play/pause |
| **F (in canvas)** | Frame selection |
| **Shift-F** | Frame all |
| **Z** | Zoom in to fit canvas |
| **B** | Add keyframe at playhead (in Timeline) |
| **Cmd-Z** | Undo |
| **Cmd-Shift-Z** | Redo |
| **Shift-Command-P** | Import > Image Playground |

**Two critical menu locations:**
- **File menu** (page 1316): New, Open, Open Recent, Save, Save As, Publish Template, Revert to Saved, Restore from Autosave, Import (Media / Image Playground), Import As (Project / Unused Media / Audio), Share (Export Movie / Export Audio / Save Current Frame / Export Image Sequence / Apple Devices / Email / Send frame to Pixelmator Pro).
- **Toolbar right side**: Share button → same destinations as File > Share.

---

## 18. Sub-Agent Operating Procedures for Motion Tasks

**When BossMan assigns a Motion task to a sub-agent:**

1. **Before opening Motion:**
   - Confirm the v17 stack is in a stable state (verify.py PASS from last run).
   - Read the project's `BLUEPRINT.md` Motion section.
   - Check if the requested output (e.g., intro, lower-third) can be done with ffmpeg first — if yes, defer to ffmpeg and document why in the kanban card.
2. **Opening Motion:**
   - Use Hermes Computer Use on Mac Studio M4.
   - DO NOT use `-nogui` / headless (no Motion support).
   - Capture screenshot with `computer_use action='capture' mode='som'` before each significant action.
3. **In Motion:**
   - Set project frame size + frame rate to match the v17 target (default 1920×1080 @ 29.97fps).
   - Use existing templates from `~/Movies/Motion Templates/` first; only build from scratch if no template fits.
   - Always export with alpha channel (ProRes 4444) when overlay needs transparency.
4. **Exporting:**
   - Save to `~/Projects/four-tool-video-stack/build/motion_<descriptor>_<version>.mov`.
   - Verify file size > 100 KB (motion output should not be 0-byte).
   - Update the kanban card with the new file path.
5. **Cleanup:**
   - Discard the `.motion` source project (we don't version-control binary .motion files; only the `.mov` outputs).
   - Document the build parameters in the card's comments for reproducibility.

---

## 19. Common Pitfalls (from the User Guide + stack experience)

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| **Behavior + keyframe on same parameter** | Animation fights itself; jittery motion | Pick one: behavior OR keyframe, not both |
| **Wrong project color space** | Colors look washed out or oversaturated after export | Set color processing method (Rec. 709 SDR) before adding media |
| **Forgetting alpha channel** | Export has black background where transparency expected | Use ProRes 4444 + Color + Alpha in export settings |
| **Particle clip loops badly** | Visible jump cut every loop point in particle | Use very short clips (< 2 sec) or loops that match |
| **3D group rasterization** | Group loses 3D intersection with rest of scene | Avoid filters that force rasterization on 3D groups |
| **Rosetta install dialog on import** | Motion asks for Rosetta after import | Install Rosetta, quit and reopen Motion |
| **Saving .motion file but losing it** | Subsequent edits missing media, project won't open | Use Auto-save vault; Motion saves to `/Users/username/Movies/Motion Projects/` |
| **Custom destination disappeared** | Custom share preset vanished after Motion update | Re-create the custom destination |
| **Render = 0 bytes / export fails silently** | Output file empty | Check Permissions on save folder; Motion requires write access |
| **FPS mismatch between sources** | Choppy playback after mixing 23.976 + 30fps media | Retime source clips to match project frame rate |

---

## 20. Future Work / Out of Scope

- **AppleScript automation** — blocked by Apple (Motion has no public scripting dictionary). Future-proofing: don't expect this.
- **Server-side rendering** — not possible (GUI-only).
- **3D character animation** — Motion is not Maya; use Blender for character rigging.
- **Long-form color grading** — use DaVinci Resolve Studio Color page.
- **Audio mixing/mixing** — use Logic Pro or FCP's audio tools.

---

## 21. Reference URLs (Official Sources)

| Resource | URL | Notes |
|----------|-----|-------|
| **Motion User Guide — current** | https://support.apple.com/guide/motion/toc/mac | TOC for 6.3 (newest as of 2026-07-30) |
| **Motion User Guide — Welcome page** | https://support.apple.com/guide/motion/welcome/6.3/mac | 6.3 welcome |
| **Motion User Guide — PDF** | https://help.apple.com/pdf/motion/en_US/motion-user-guide.pdf | 64 MB PDF; mirrored locally at `~/Projects/four-tool-video-stack/refs/motion_user_guide_6.3.pdf` |
| **Motion Support home** | https://support.apple.com/motion | Apple Support landing page for Motion |
| **Motion on the App Store** | https://apps.apple.com/app/motion/id434290957?mt=12 | $50 standalone; bundled with FCP |
| **Motion on Apple.com** | https://www.apple.com/final-cut-pro/motion/ | Marketing page |
| **Apple Developer FxPlug docs** | https://developer.apple.com/documentation/professionalvideoapplications/fxplug | For developers building Motion plugins (not needed for our pipeline) |

**Approved third-party tutorial sources** (when sub-agents need a worked example):

**2026 verified tutorials (HTTP 200, all live as of 2026-07-30):**

| Title | Channel | Length | Date | URL |
|-------|---------|--------|------|-----|
| Apple Motion Beginner Tutorial 2026 \| You got this! | Jenn Jager Pro Tutorials | 24:15 | 2026-03-16 | https://www.youtube.com/watch?v=-N_iNALYFSc |
| How to use Apple Motion 2026 (step-by-step guide) | Dylan Bates • The Final Cut Bro | 37:13 | 2026-02-05 | https://www.youtube.com/watch?v=mcZz5PAgct8 |
| Apple Motion's Camera In Depth: Part One | Simon Ubsdell | 14:59 | 2026-01-20 | https://www.youtube.com/watch?v=VOI7Yju0kOQ |

- **TheTakeoffCollege** (YouTube) — beginner-to-intermediate Motion tutorials.
- **FinalCutBro** (YouTube) — Motion + Final Cut workflow tutorials.
- **Simon Ubsdell** (YouTube) — compositing and tracking tutorials.

**NOT approved (no script-flipping, no AI-generated tutorial transcripts):**
- Random blog tutorials with outdated Motion 4 or Motion 3 screenshots.
- Fiverr/Upwork freelancer workflow videos (no canonical authority).

---

## 22. Quick Reference Card (TL;DR)

**For BossMan or sub-agents asked "do we need Motion for this?":**

| Asked for | Answer | Why |
|-----------|--------|-----|
| Animated logo intro | **Motion** if branded/particles; **ffmpeg** if simple text | Both work; pick Motion when reusability matters |
| Lower third text | **ffmpeg drawtext** | Sufficient; Motion is overkill |
| Particle effect (sparkle, energy) | **Motion** | ffmpeg drawtext can't do particles |
| Match-move overlay on Blender scene | **Motion** | Only way to do it |
| Title card with custom font + 3D rotation | **Motion** | Best tool for 3D text |
| Animated explainer scene (full motion graphics) | **Motion** | Core competency |
| Color grading | **Resolve Studio** | Not Motion's job |
| 3D scene rendering | **Blender** | Not Motion's job |
| Voice / audio mixing | **ElevenLabs** + FCP | Not Motion's job |

---

## 23. Update Log

- **2026-07-30** — Initial authoring from Motion 6.3 User Guide (PDF + TOC scrape + targeted page reads), Apple Support docs, stack context (BLUEPRINT/README/LEARNED_FOUR_TOOL_VIDEO_STACK). Source PDF mirrored at `~/Projects/four-tool-video-stack/refs/motion_user_guide_6.3.pdf`. Authored by BossMan content lane.