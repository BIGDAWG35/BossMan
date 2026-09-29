# Health OS V3 — Supplement Baseline (V3)

**Date captured**: 2026-07-14
**Source MEMORY entry**: pulled out of MEMORY.md 2026-07-20 to keep MEMORY lean.

## Stack
- SQLite + FTS5 (full-text search with porter/prefix/synonym)
- NIH DSLD v9 (Dietary Supplement Label Database)
- Ingestion: `scripts/dsld_ingest.py`

## Weekly re-pull
The supplement catalog is refreshed weekly by the cron. Categories:
- NOW
- Kyolic
- CON-CRET
- LE (Life Extension)
- Universal Nutrition

## Nutrient conversion rules
- **EPA + DHA fold** is applied per WHO/AHA guidance
- **IU→mg conversion constants**:
  - Vitamin A: 0.0003
  - Vitamin D: 0.000025
  - Vitamin E: 0.9

## Proprietary blend policy
When a product uses a proprietary blend:
- `undisclosed: true`
- `amount: null` (NEVER zero)
- The UI shows "Proprietary blend — amounts not disclosed" instead of synthesizing a number

## Pack-form facts
- **Animal Pak** — pack form (multiple compartments)
- **Animal Flex** — pack form
- **Animal Greens** — pack form
- **Animal Omega 3** — softgel (the only Animal-line softgel)

## Regimen dose math
`EnrichWithRegimens` uses **catalog serving_qty** for nutrient math, NOT regimen dose.
Reason: prevents double-multiplication when a regimen describes a multi-cap dose.

## Search behavior
- **FTS5** with porter stemming + prefix expansion + synonym map
- `unified-search` returns `not_found_reason` on zero hits (UI shows why)
- Coverage view exposes: target/UL/severity/contributing_products + NIH ODS citation link

## API surfaces
- `catalog_red_flags` — flags products with structural data issues (suspicious amount per serving, etc.)
- `label_provenance` — tracks which DSLD release row came from

## Production verification
- App: https://bigdawgs-mac--studio.tailed3212.ts.net/health-os/v3 (Tailscale Funnel — NOT localhost)
- Healthcheck script: `~/.hermes/scripts/v3_supplement_healthcheck.sh`

## Target state
- ≥ 2,000 catalog rows
- ≥ 300 brands
- ≥ 80% of stacks DSLD-sourced
- All grade-A recommendations probe live `gradeProduct()` against the full eligible catalog (never pre-grade inference)
