#!/usr/bin/env bash
# Wrapper for the SquarePayouts Weekly Health Review Python script.
# Card t_squarepayouts_health-loop_v1_20260723 (2026-07-23).
# Loop A: weekly Monday 08:00 PT. Silent-by-default.
exec python3 /Users/bigdawg/.hermes/scripts/squarepayouts-weekly-review.py "$@"
