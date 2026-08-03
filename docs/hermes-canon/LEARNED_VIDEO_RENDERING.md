
## Slide-style render pipeline (≤2026-07-27)

### Build artifact
- `/tmp/build_slides_video.py` — single-file PIL builder
- CLI: `python3 /tmp/build_slides_video.py --script <md> --audio <mp3> --out <mp4> --id <vid_id> --theme dark`
- Always run from `/Users/bigdawg` cwd (avoids `struct.py` shadowing in /tmp)

### Slide architecture
- **Title slide (§1)**: kicker (gold) + accent bar + large headline + 2-line subtitle + tagline
- **Body slide**: header card + left body text (≈960px wide) + RIGHT `_render_bullet_card` (3 numbered gold points in translucent panel)
- **Diagram slide**: same body layout, takeaway card pulls diagram-relevant sentences
- **Close slide**: large takeaway + disclaimer pill on bottom (keywords: disclaimer, volatile, financial advice, do your own research)

### Critical font/encoding rules
- **h1 font = `Avenir Next.ttc` only** — Helvetica.ttc renders `→` (U+2192) as TOFU (verified bug)
- Use ASCII `->` in script titles whenever possible (defense-in-depth)
- Bullet font: `fonts(60, 42, 32, 26, 22)["body"]` — small enough that 70-char bullets fit in ≤2 lines at width 460
- Number font: SFNSMono 64 (gold)
- Mono accent: SFNSMono 36 (amber #FFB347) for kicker + KEY TAKEAWAYS label
- ALWAYS set `draw_footer(draw, vid_id)` before `img.save(out_path)` — easy to forget on new branches

### Bullet extraction
- `extract_key_points(spoken, n=3, max_len=70)` — sentences scored on (length 30–120, not first/last, not subordinate clause start). Output is 3 ≤70-char claim sentences.
- Skip bullet card on `is_title_slide or is_diagram_close or is_close`

### Footer
- Line 1 (968px): `NO AVATAR · VOICEOVER ONLY · ElevenLabs Marcelo voice`
- Line 2 (1010px): `video id {vid_id} · slide-style render · no raw sub-clips / audio files attached`

### Audio-to-slide alignment
- `parse_script` reads durations from `[§N — title] [START–END]` lines
- `parse_audio_durations` from elapsed timestamps in `audio_durations.json` style files (when present)
- ffmpeg concat with `-t` per slide segment ensures audio matches exactly
- Verify with: `ffprobe -v error -show_entries format=duration -of csv=p=0 out.mp4` vs same on input mp3

### Verified outputs
- vAI_short.mp4: 7.56MB, 208.23s, 6 slides @ 1920×1080
- vCrypto_short.mp4: 7.70MB, 208.28s, 6 slides, bitcoin disclaimer pill on close

---

## DaVinci Resolve Studio scripting (2026-07-30 onward)

Use the canonical Studio paths (Lite was uninstalled — never fall back):

```bash
export RESOLVE_SCRIPT_API="/Applications/DaVinci Resolve Studio.app/Contents/Resources/Developer/Scripting"
export RESOLVE_SCRIPT_LIB="/Applications/DaVinci Resolve Studio.app/Contents/Libraries/Fusion/fusionscript.so"
export PYTHONPATH="${PYTHONPATH}:${RESOLVE_SCRIPT_API}/Modules"
python3 -c 'import DaVinciResolveScript as dvr; r = dvr.scriptapp("Resolve"); print("OK" if r else "FAIL")'
```

- App Store variant, bundle id `com.blackmagic-design.DaVinciResolveAppStore`
- External scripting toggle at `~/Library/Preferences/com.blackmagic-design.DaVinciResolve.plist` (`ExternalScriptingEnabled=1`)
- `scriptapp("Resolve")` returns a `PyRemoteObject` on Studio; returned `None` on Lite (the Lite wall)

Full canonical reference: `LEARNED_FOUR_TOOL_VIDEO_STACK.md`.

---

## v17 Pipeline Tool-by-Tool (2026-07-30)

The v17 four-tool pipeline integrates four specialized tools. Each lives in its own LEARNED doc; this section is the orchestrator's reference.

### Blender 5.2 LTS — render engine (image sequences → ffmpeg)

- **Role:** Producer of the 3D scene layers (V1 base track).
- **LEARNED doc:** `LEARNED_BLENDER_LTS.md` (canonical deep-dive).
- **LTS stability:** Blender 5.2.0 LTS is pinned to commit `fbe6228777e7` with a 2-year support window (July 2026 → July 2028). We do not upgrade to 5.3+/6.0 within the v17 line.
- **API break:** Blender 5.2 removed `image_settings.file_format = "FFMPEG"`. Render PNG frames, then ffmpeg stitches.
  ```bash
  /Applications/Blender.app/Contents/MacOS/Blender -b -noaudio --factory-startup -P build/blender_scene.py
  ffmpeg -framerate 30 -i frames/frame_%04d.png -c:v libx264 -pix_fmt yuv420p +faststart scene_3d.mp4
  ```
- **Eevee engine:** works headless on Apple Silicon (Mac Studio M4). 90 frames @ 30 fps = ~3 s render in ~15 s.

### Apple Motion 5 — motion graphics (overlays, titles)

- **Role:** Producer of motion-graphic overlay layers (V2 overlay track).
- **LEARNED doc:** `LEARNED_APPLE_MOTION.md` (canonical deep-dive).
- **GUI-only reality:** Motion 5 is a GUI-only app. AppleScript automation is unstable (splash screen blocks AppleEvents). When Motion's UI is unavailable (headless, automation, CI), **fall back to ffmpeg `drawtext`** with animated alpha — see `LEARNED_FOUR_TOOL_VIDEO_STACK.md` for the fallback filter graph.
- **When to use Motion:** the title sequence is complex (multi-layer, parallax, 3D text), the user explicitly requests Motion's signature look, or the v17 client wants a real Motion project file.
- **When to use ffmpeg drawtext:** the overlay is single-line text, the overlay is animated but doesn't need Motion's depth-of-field, or the pipeline is running headless.

### DaVinci Resolve Studio — validator (project + timeline assembly)

- **Role:** Validator and headless composite verifier. NOT the primary renderer.
- **LEARNED doc:** `LEARNED_DAVINCI_RESOLVE_STUDIO.md` (canonical deep-dive; required reading for v17).
- **Why Validator:** Resolve Studio's scripting API (`scriptapp("Resolve")`) returns a `PyRemoteObject` that exposes `MediaPool.AppendToTimeline` and `RenderQueue.AddJobFromTimeline`. We use these to construct a real `.drp` project with the same V1/V2/A1 layout ffmpeg produces. If the Resolve timeline assembles correctly, the ffmpeg composite is structurally valid.
- **App Store variant, sandboxed:** `com.blackmagic-design.DaVinciResolveAppStore`. External scripting toggle at `~/Library/Preferences/com.blackmagic-design.DaVinciResolveAppStore.plist` (`ExternalScriptingEnabled=1`).
- **MUST run in GUI mode (`open -a "DaVinci Resolve Studio"`, NOT `-nogui`)** — headless disables IOXPC, breaks `scriptapp`.
- **Lite is uninstalled.** Detect script (in `LEARNED_DAVINCI_RESOLVE_STUDIO.md` §2) must print "Studio OK" before any v17 run.

### ffmpeg — composite + final encode

- **Role:** Final composite (P5b) and the YouTube-delivery encoder.
- **Composite filter graph:** `[1:v]overlay=0:0:format=auto[v]` over Blender base + ElevenLabs audio. `overlay=format=auto` handles both alpha and opaque overlays.
- **Audio loop:** `aloop=loop=-1:size=2e9,atrim=0:${DUR},asetpts=PTS-STARTPTS`
- **Final encode:** `-shortest` to clamp to video duration; `-c:v h264 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k`.
- **The `+faststart` flag is mandatory** — without it, YouTube's processor has to buffer the moov atom before playback, increasing initial load time by 30–60 %.

### Why ffmpeg is the final renderer, not Resolve

Resolve Studio validates; ffmpeg produces. Reasons (full analysis in `LEARNED_DAVINCI_RESOLVE_STUDIO.md` §10):
1. App Store variant headless render is unstable
2. ffmpeg composite is ~1.5 s vs Resolve's ~30 s
3. ffmpeg filter graphs are text-reproducible (CI-friendly)
4. `verify.py` can check `final.mp4` without launching Resolve

## Visual layout authority (2026-07-31 — newer than this doc)

All long-form video projects MUST additionally pass the **visual QC checklist** in `LEARNED_VIDEO_LAYOUT_REFERENCES.md` before being marked final. That doc is the authority on intro/lower-third/PiP/outro style. Pipeline rules in this doc (§P3a/P5) defer to it for visual design. `MOTION_FORCE_FFMPEG=1` is now **emergency-fallback-only** (default: Motion-primary).

## v18 N-layer PiP composite (2026-07-31, card `t_video_stack_v18pip_20260731`)

Extends the v17pp base with **video-inside-video PiP overlays** at scripted timestamps.

### Filter graph rule (CRITICAL)
- **Pass filter graph via `-filter_complex_script file.txt`** (NOT `-filter_complex file.txt` — that reads "file.txt" as the filter expression itself).
- **`enable=` expressions must be single-quoted:** `enable='between(t,90,120)'` — unquoted commas are parsed as filter separators → `No such filter: '90'`.
- **Bash arrays, no `eval`:** build `${FFMPEG_ARGS[@]}` and pass directly. `eval "$CMD"` corrupts `$` expansion in expressions.

### Bash 3.2.57 compatibility (macOS default)
Apple's bundled bash 3.2.57 does NOT support `declare -A` associative arrays. Use **parallel indexed arrays** + `mapfile -t` to load from TSV. v18 pattern in `composite_ffmpeg_pip.sh` (108 lines).

### Composite pattern (v18 working version, 2026-07-31 PASS)
```
ffmpeg -y -i scene_3d.mp4 \
       -i motion_overlay.mov \
       -i broll_etf.mp4 -i broll_stablecoins.mp4 -i broll_rwa.mp4 -i broll_ai_agents.mp4 \
       -i voice.mp3 \
       -filter_complex_script /tmp/filter.txt \
       -map "[v_final]" -map "[aout]" \
       -t 590 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
       -c:a aac -b:a 128k -movflags +faststart final.mp4
```

### Audio-index gotcha
When `pip_count=N`, voice is at input index `2+N` (0=scene, 1=motion, 2..2+N-1=B-rolls, 2+N=voice). v18 v1 crashed with `Invalid input index '0' in script` because `AUD_INPUT=$((1+PIP_COUNT))` skipped the voice input by one.

### Pipeline crash recovery
If composite crashes mid-pipeline but all upstream artifacts (scene_3d.mp4, motion_overlay.mov, 4 B-rolls, voice.mp3) are on disk, **don't re-run the entire pipeline** — just re-run the composite step directly. ~5 min recovery vs ~30 min full re-render.

---

## Cross-references — the v17 line

| Tool | LEARNED doc | Role in v17 |
|---|---|---|
| ElevenLabs | (no doc — single API call) | Voice producer (P2) |
| Blender 5.2 LTS | `LEARNED_BLENDER_LTS.md` | Render engine (P3) |
| Apple Motion 5 | `LEARNED_APPLE_MOTION.md` | Motion graphics (P4) |
| DaVinci Resolve Studio | `LEARNED_DAVINCI_RESOLVE_STUDIO.md` | Validator (P5) |
| ffmpeg | this doc | Composite + final encode (P5a/P5b) |

**Single rule:** when in doubt about which tool, read `LEARNED_FOUR_TOOL_VIDEO_STACK.md` first.
