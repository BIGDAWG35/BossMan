# BossMan Verification — Post-Migration Template

Use this template after any migration task, deployment, or significant configuration change.

---

## Pre-Flight Checks

### Hermes Accessibility
- [ ] `hermes --version` or `gh` responds
- [ ] Agent can reach web (search or curl test)
- [ ] GitHub auth confirmed (`gh auth status` → `✓`)

### BossMan Repo
- [ ] `BossMan/` directory exists locally
- [ ] `git remote -v` shows `https://github.com/BIGDAWG35/BossMan`
- [ ] `.gitignore` is active and working
- [ ] `.env.example` exists with placeholder names only

---

## Active Services Verification

### LBC35 Ports

```bash
for port in 3001 3100 5050 8090 8100 8102 8104 8110 8130 8140 8020; do
  echo -n "Port $port: "
  curl -s -o /dev/null -w "%{http_code}\n" --max-time 5 http://localhost:$port/health
done
```

**Expected:** All HTTP ports return 200 (or configured status). Port 8020 (TCP) — `nc -z` returns 0.

### Hermes Cronjobs

```bash
hermes cron list
# or
crontab -l
```

Verify all scheduled jobs are present and enabled.

---

## Vault & Knowledge Checks

- [ ] `OBSIDIAN_VAULT_PATH` is accessible and readable
- [ ] Vault contains expected folder structure
- [ ] `docs/` and `prompts/` folders are present in vault

---

## GitHub Integration Checks

```bash
gh repo view BIGDAWG35/BossMan
gh api user --jq '.login'   # Should return BIGDAWG35
gh auth status              # Should show ✓ Logged in
```

- [ ] BossMan repo is accessible
- [ ] Token has `repo` scope
- [ ] No legacy OpenClaw tokens in use

---

## Secrets & Environment

```bash
# Verify no real secrets in git history
git log --all --full-history -S "TOKEN" -- . | head -20

# Check .env is not tracked
git ls-files --cached .env
# Should return empty (never committed)
```

- [ ] `.env` is in `.gitignore`
- [ ] No `*.key`, `*.pem`, `secrets/` in repo
- [ ] `.env.example` has placeholder names only

---

## Memory & Skills

- [ ] `memory` tool works (test: save and retrieve a test fact)
- [ ] Core skills load correctly: `github-auth`, `github-repo-management`
- [ ] No broken skill references

---

## Communication & Delivery

- [ ] Telegram bot is connected (if configured)
- [ ] Cronjob delivery targets are correct (`origin` or `local`)
- [ ] Scheduled notifications working

---

## Sign-Off

```
Verification completed: [DATE/TIME]
Performed by: [Hermes session / User]
Result: ✅ PASS / ⚠️ WARNINGS / ❌ FAIL

Issues found:
- [List any issues or leave blank]

Next action:
- [Any follow-up items]
```
