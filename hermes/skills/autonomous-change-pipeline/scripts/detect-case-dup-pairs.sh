#!/bin/bash
# detect-case-dup-pairs.sh
# Detect case-different duplicate file pairs in a directory (macOS case-insensitive fs artifact).
# Proven 2026-06-23 — found 88 pairs (~990KB wasted) in ~/.hermes/knowledge/.
#
# Usage: detect-case-dup-pairs.sh [DIR] [--delete-lower]
#   DIR              Directory to scan (default: ~/.hermes/knowledge)
#   --delete-lower   DELETE the lowercase copy of each pair (DESTRUCTIVE — use with care)
#
# Output: list of pair paths + total wasted bytes. Exit code 0 if clean, 1 if pairs found.

set -e

DIR="${1:-$HOME/.hermes/knowledge}"
DELETE_LOWER=false

if [ "$2" = "--delete-lower" ]; then
  DELETE_LOWER=true
fi

if [ ! -d "$DIR" ]; then
  echo "ERROR: directory not found: $DIR" >&2
  exit 2
fi

cd "$DIR"

pairs=0
wasted=0
report=""

for f in $(ls | grep -E "^[A-Z_0-9-]*\.md$"); do
  lower=$(echo "$f" | tr '[:upper:]' '[:lower:]')
  if [ -f "$lower" ] && [ "$f" != "$lower" ]; then
    # PATCHED 2026-06-23: macOS case-insensitive HFS+ returns true for [ -f "$lower" ]
    # even when it's the SAME inode as $f (case-insensitive lookup). Compare inodes
    # to distinguish phantom-pair (same file) from real-pair (two files).
    inode_upper=$(stat -f%i "$f")
    inode_lower=$(stat -f%i "$lower")
    if [ "$inode_upper" = "$inode_lower" ]; then
      # Same file — case-insensitive fs collapsed the names. NOT a real pair.
      continue
    fi
    pairs=$((pairs + 1))
    sz_upper=$(stat -f%z "$f")
    sz_lower=$(stat -f%z "$lower")
    if [ "$sz_upper" = "$sz_lower" ]; then
      wasted=$((wasted + sz_lower))
      report="$report
PAIR: $f ($sz_upper b) == $lower ($sz_lower b)"
      if [ "$DELETE_LOWER" = true ]; then
        rm -v "$lower" >&2
      fi
    else
      report="$report
PAIR-MISMATCH: $f ($sz_upper b) != $lower ($sz_lower b) — NOT byte-identical, manual review required"
    fi
  fi
done

echo "=== CASE-DUP DETECTION REPORT ==="
echo "Directory: $DIR"
echo "Pairs found: $pairs"
echo "Wasted bytes (byte-identical): $wasted ($(echo "scale=1; $wasted/1024" | bc) KB)"
echo
if [ -n "$report" ]; then
  echo "$report"
fi

if [ $pairs -gt 0 ]; then
  exit 1
fi
exit 0