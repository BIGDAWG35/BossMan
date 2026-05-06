# BossMan Daily Health & Operations Check

Run this prompt template each morning (or on-demand via cronjob).

---

## 1. Health Check — All Active Ports

Probe each active port on LBC35. Report UP/DOWN for each.

```bash
for port in 3001 3100 5050 8090 8100 8102 8104 8110 8130 8140 8020; do
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:$port/health 2>/dev/null)
  if [ "$status" = "200" ]; then
    echo "✓ Port $port: UP"
  else
    echo "✗ Port $port: DOWN (status: $status)"
  fi
done
```

**Expected:** All ports return HTTP 200 (or expected status code per `docs/services-map.md`)

---

## 2. Vault Query — Overnight Notes

Check the Obsidian vault for:
- Any notes tagged `#flagged` or `#urgent` created in the last 24h
- Notes modified in `daily/` folder
- Any `#blocker` items that need immediate attention

```bash
# Example vault query (adjust paths to your vault)
VENDOR/bin notingest --vault $OBSIDIAN_VAULT_PATH --query "tag:#flagged after:today-1"
```

---

## 3. GitHub Review — Active Repos

Check the following repos for recent activity:

| Repo                           | What to Check                        |
|--------------------------------|--------------------------------------|
| `BIGDAWG35/BossMan`            | Recent commits, open PRs             |
| `BIGDAWG35/Bigdawgclaw`        | Any accidental pushes (should be frozen) |
| (add active repos here)        |                                      |

```bash
gh run list --limit 5
gh pr list --state open --limit 10
```

---

## 4. Log Analysis — Hermes Logs

Check Hermes logs for errors or anomalies since last run.

```bash
# Check for errors in recent Hermes sessions
grep -i "error\|exception\|failed" ~/.hermes/logs/*.log 2>/dev/null | tail -20

# Check last session output
ls -lt ~/.hermes/sessions/ | head -5
```

**Flag:** Any `ERROR` or `CRITICAL` entries that need investigation.

---

## 5. Cronjob Status — Overnight Runs

Verify that overnight cronjobs completed successfully.

```bash
# List recent cronjob runs
crontab -l 2>/dev/null || echo "No crontab — using Hermes scheduler"

# Check Hermes cronjob history
# (via Hermes built-in or ~/.hermes/cron/history/)
```

---

## 6. Quick Summary Response

Format your findings as:

```
BossMan Daily — [DATE]

✓ Ports: 11/11 UP
⚠ Vault: 1 flagged note found → [note link or title]
✓ GitHub: 0 new PRs, last commit [HASH] at [TIME]
✓ Logs: No errors
✓ Cron: Overnight jobs completed

Action items:
- [Any items requiring attention]
```

---

## Troubleshooting

| Problem                        | Resolution                                           |
|--------------------------------|------------------------------------------------------|
| Port DOWN                      | SSH to LBC35, check service status, restart if needed |
| Vault query fails              | Check `OBSIDIAN_VAULT_PATH` env var is set correctly |
| GitHub auth fails              | Re-run `gh auth status`, refresh token if needed    |
| Hermes log missing             | Check `HERMES_LOG_LEVEL` in `.env`, raise to `debug` |
| Cronjob missed                 | Check scheduler is running, review job config        |
