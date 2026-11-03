# PHASEREPORT.md — ARCHIVED POINTER (NOT ACTIVE CANON)
> **PATH-NOTE-2026-11-03 — path annotation** (added 2026-11-03 by kanban card `t_483f4239`): the mirror path recorded below is the **historical** GitHub-mirror location as of the 2026-08-31 archive of this file. That path does not exist; the GitHub mirror now lives at `~/Repos/BossMan` (`https://github.com/BIGDAWG35/BossMan.git`, public). The wording is preserved verbatim because this file is an archived pointer.


**Status:** Historical archive pointer (2026-08-31).
**Original location:** `~/.hermes/knowledge/PHASEREPORT.md` (now archived)
**Archive location:** `~/.hermes/profiles/ops/cron/output/t_rule9_archive_untracked_knowledge_20260831/`
- `PHASEREPORT.md.original_byte-equal` — byte-equal preservation (original content)
- `PHASEREPORT.md_archived_20260831.md` — provenance header + original content
**Original SHA-256:** `bf8497d3702562dc6ee35ff8c6eda718b57128dc3ca32bbbc33dac338e79b989`
**Archive size:** 224,043 bytes (original content)
**Card:** t_rule9_untracked_knowledge_batch2_archive_v1_20260831 (Batch 2B)

## Why archived

PHASEREPORT.md was the aggregated phase-report log for canon-level changes. It grew to 224 KB / 3,349 lines over many months. It is referenced by:
- 2 lines in `~/.hermes/knowledge/ROUTING-RULES.md` (now updated to point here → archive)
- 47 references across skill docs (most are documentation patterns that don't read the file at runtime)

## Active references

- `~/.hermes/knowledge/ROUTING-RULES.md` lines 155, 166 — UPDATED to point to archive
- `~/.hermes/skills/devops/incident-response/SKILL.md` — references `~/Projects/BossMan/PHASEREPORT.md` (different path; mirror)
- `~/.hermes/skills/canon-md-file-split/templates/archive-wrapper.md` — references PHASEREPORT as a migration destination template

## Recovery

- Rollback: `mv ~/.hermes/profiles/ops/cron/output/t_rule9_archive_untracked_knowledge_20260831/PHASEREPORT.md.original_byte-equal ~/.hermes/knowledge/PHASEREPORT.md`
- Source: snapshot at `~/.hermes/profiles/ops/cron/output/t_rule9_phasereport_archive_snapshot_20260831_235500/`

## Marker

THIS IS A HISTORICAL ARCHIVE POINTER — NOT ACTIVE CANON.
