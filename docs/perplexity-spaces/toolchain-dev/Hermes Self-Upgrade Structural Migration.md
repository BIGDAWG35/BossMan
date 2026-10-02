**Version:** v4 · **Date:** 2026-09-29 · **Source:** `~/.hermes/knowledge/LEARNED_HERMES_SELF_UPGRADE_STRUCTURAL_MIGRATION.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# LEARNED — Hermes self-upgrade is a structural migration, not a version bump

**Scope:** Upgrading a git-source Hermes install on macOS when the install predates the
PM/Python-3.14 migration. Read this BEFORE planning any Hermes self-upgrade.
**Status:** Canonical constraints + procedure. Derived from card `t_0ce87c87` baseline
audit (2026-09-30) and the house record for the 2026-08-05 / 2026-09-16 attempts.

---

## 1. Classify the install BEFORE choosing a target version

Never pick a target version from "latest tag" alone. Determine these five facts first;
each one changes the plan.

```bash
hermes --version                  # version, upstream sha, local sha, install method
hermes doctor                     # config version, plugin-compat, interpreter, provenance
hermes config check               # on-disk _config_version vs required
ls ~/.hermes/hermes-agent/pm/     # exists => post-PM-migration; absent => PRE-migration
~/.hermes/hermes-agent/venv/bin/python --version
```

**Rule: if `pm/` does not exist, the upgrade is an interpreter migration, not a code
update.** Upstream requires Python 3.14 with `python_version >= '3.14'` markers on every
runtime dependency. A pre-PM venv on 3.11–3.13 must do a one-time handoff: check out the
new code, run one update, let PM provision the pinned 3.14 interpreter from `pm/lock.json`,
rebuild the dependency environment, and repoint the launchers.

## 2. A partially-landed upgrade is worse than no upgrade

Checking out a newer tag **without** completing the PM/3.14 handoff leaves the source tree
on code whose dependencies cannot import on the installed interpreter. Hermes is then
broken until the handoff finishes.

**Rule: never `git checkout <new-tag>` in the live install as a "first step."** The
checkout and the interpreter/dependency rebuild are one atomic operation. If you cannot
complete all of it, do none of it.

## 3. An agent cannot upgrade the install that is hosting it

`hermes update` restarts gateways and kills running agents. A Kanban worker or any Hermes
session runs as a child of the exact install being upgraded, so the update terminates the
process performing it.

**Rule: schedule self-upgrades to run from outside the agent session** (operator shell,
LaunchAgent, or a wrapper that survives the restart). Never drive it from inside the agent
that the upgrade will kill.

Corollary: verify the runtime safety layer permits it. On this box `hermes update` is
BLOCKED as a dangerous command and is only unblockable via
`approvals.single_query_mode: approve` — a **permission expansion**. Do not trade
governance for convenience; escalate instead.

## 4. `hermes update` is known-broken on this box — use the manual path deliberately

House record (2026-08-05): `hermes update` resolves `PROJECT_ROOT` from the venv copy of
`main.py`, which has no `.git`, so the managed update path fails here.

Manual path (adapt the target to a **release tag**, never `main`):

```bash
cd ~/.hermes/hermes-agent
git fetch --tags origin
git stash push -u -m "pre-upgrade-$(date -u +%Y%m%dT%H%M%SZ)"   # capture local patches
git checkout v<RELEASE-TAG>
uv pip install -e ".[all]"        # NOT bare `uv sync` — creates an unwanted .venv/
hermes config check && hermes config migrate
```

## 5. Inventory local source patches before touching the tree

A git install accumulates uncommitted local patches. On this box: **5 modified files,
552 insertions** across `cron/scheduler.py`, `gateway/kanban_watchers.py`,
`gateway/kanban_watchers_dispatcher.py`, `hermes_cli/kanban_db.py`,
`hermes_cli/kanban_db_dispatch.py`, plus 4 untracked test files — on a **non-release
branch** 1 commit ahead / 679 behind the current release tag.

`updates.non_interactive_local_changes: stash` means a non-interactive update auto-stashes,
pulls, and auto-restores those lines on top of thousands of upstream commits. Conflict is
likely.

**Rule: always capture all three recovery artifacts before the upgrade** — the tracked diff
(`git diff`), the untracked files verbatim, and a git bundle of the branch commits past the
release tag (`git bundle create x.bundle <tag>..HEAD`, then `git bundle verify`). A diff
alone does not restore untracked work.

## 6. Review the multiplex gateway fold as a first-class change, not a side effect

For a multi-profile install, the official update folds per-profile gateways into a single
multiplexed default gateway when nothing blocks it (equivalent to
`hermes gateway migrate --multiplex --yes`). Blockers (a bot token shared by two profiles;
a secondary profile binding a port with no `/p/ /` ingress) make it print and change
nothing.

**Rule: decide the gateway topology outcome BEFORE upgrading.** A fold changes who owns
ingress for every profile; under any governance that pins "no new service/gateway," it is
an approval item, not an implementation detail.

## 7. New upstream defaults are not routing decisions

Releases ship behavior changes that look like config but are policy: e.g. `skills.auto_load`
pinning skills into every new session's prompt; webhook deliveries mirrored into a chat
session; a gateway `decline` DM behavior. `hermes config migrate` may also surface new keys.

**Rule: never accept a new default because it arrived with a version bump.** Routing and
authority change only on an explicit decision. Take the version; leave the policy alone.

## 8. Config schema migrations are cheap — check the step count, not the version delta

`hermes config check` reporting `39 -> 45` looks like six migrations. The table-driven
registry (`hermes_cli/config_migrations.py`, `SUPPORT_FLOOR_VERSION = 12`) actually needed
only `_migrate_to_41` and `_migrate_to_45`. Grep the step functions to size the real work:

```bash
grep -o "_migrate_to_[0-9]*" ~/.hermes/hermes-agent/hermes_cli/config_migrations.py \
  | sort -u -V | tail
```

**Rule: size a config migration by counting step functions above the current version, not
by `new - old`.** Look for an existing profile already at the target version — it is
proof the path works on this box.

## 9. Check disk before promising a backup

On this box: 13 GB free / 98% full, `~/backups` at 89 GB. A full `HERMES_HOME` replica is
~24 GB (dominated by `state.db` ~10 GB and profile session stores ~14 GB) and will exhaust
the volume. PM's 3.14 handoff also provisions a new Python generation plus a rebuilt
dependency environment.

**Rule: back up the control plane, not the transcripts.** Copy config, profiles'
`config.yaml`/`SOUL.md`, identity docs, `knowledge/`, `skills/`, `plugins/`, `cron`
definitions, small DBs, LaunchAgents, PM2 dump, and the source-repo git state. Exclude
`state.db`, session stores, `sessions/`, `checkpoints/`, `logs/`, `node_modules/`, `venv/`,
and `cron/output/`. Document every exclusion with its size and why it is safe — an
undocumented gap in a rollback artifact is a liability.

Verify the artifact before trusting it: `shasum -a 256 -c SHA256SUMS.txt` must be clean.
Do not hash a file into a ledger that also contains itself.

## 10. Audit for pre-existing drift, or you will misattribute it to the upgrade

A before/after diff is only meaningful if the "before" is captured as structured data.
Capture routing/authority/scope as JSON, not prose, so the post-upgrade comparison is
mechanical.

Doing this surfaced drift that had nothing to do with any upgrade: four profiles
(`bossman`, `builder`, `content`, `trading`) running `MiniMax-M2.7` while the routing
ledger specified `MiniMax-M3` — including the **orchestrator** profile; and config schema
applied non-uniformly (`ops` at v45, root and 7 profiles at v39).

**Rule: run the baseline audit before the upgrade and report pre-existing drift
separately.** Bundling a discovered drift into an upgrade makes both unverifiable.

## 11. Plugin-compat is a dated cliff — check it explicitly

Hermes carried a temporary plugin-compat layer with a hard removal date; after that date
affected plugins are **disabled**, not merely warned. Verify rather than assume:

```bash
hermes doctor 2>&1 | grep -A2 "Plugin import paths"
```

Green means no action. Record it — it is the difference between "checked" and "hoped."

## 12. Rollback must name the pre-upgrade commit

Rolling back a config-schema change can leave options the older revision rejects.

```bash
cd ~/.hermes/hermes-agent
git checkout <recorded-pre-upgrade-commit>
uv pip install -e ".[all]"
hermes config check      # then remove options the older revision refuses
```

**Rule: record the exact pre-upgrade commit SHA in the manifest** (not just the version
string — a git install can be on a branch that the version string does not describe).
