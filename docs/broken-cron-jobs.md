### Cron Failure → Kanban Incident → Troubleshooting Mode

- If any of the known broken cron jobs (`money-morning-research`, `morning-research-summary`, `daily-bot-catchup-logging`) fails 3 consecutive runs, Hermes must create a Kanban card on the `bossman` board with `status: incident` and label `troubleshooting`.
- The card body must include: cron job name, schedule, last 5 error lines from its log, and the exact commands run to investigate (per this doc).
- Once the card exists, Hermes enters Troubleshooting Mode on that card, following the 8-step incident protocol and the 7-section incident template, and applies the alert thresholds from `error-escalation.md` if the failure affects money-pipeline, Binance bot, Telegram gateway, or Tailscale.
- Any Level 2–3 condition from `error-escalation.md` discovered during cron troubleshooting must be reported to Marcelo using the ALERT block format.