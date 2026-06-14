# Trading — CSDAWGBOT Weekly Strategy Review

## Purpose
Automated weekly strategy review for crypto trading bots (Binance + Kraken). Gathers metrics, runs structured questions, feeds to DeepSeek/OpenAI for analysis, surfaces recommendations to Marcelo for approval.

## Schedule
- **Cron:** `0 20 * * 6` (Saturdays 8 PM PDT)
- **First run:** 2026-04-11 (Saturday)
- **Recurrence:** Weekly

## Systems Involved

| System | Port | Endpoint | Purpose |
|--------|------|----------|---------|
| Binance Bot | 8104 | `/api/status`, `/api/trades` | Balance, trades, config |
| Kraken Bot | 8899 | `/api/status` | Balance, config (once auth fixed) |
| Trading Review | 8132 | `/api/summary` | Analysis layer |
| CSDAWGBOT | N/A | Agent | Questions & notes |
| DeepSeek | N/A | Model | Trade quality analysis |
| GPT-5.4 | N/A | Model | Synthesis & recommendation |
| LBC35 | N/A | Orchestrator | Surface to user |

## Step-by-Step Workflow

### Step 1: Data Pull (Both Exchanges)
For each exchange (Binance + Kraken):
- Active pairs / coin list
- RSI window (Binance: 40-65, Kraken: 30-70)
- MIN_RR setting
- Risk per trade (should be 3%)
- Daily loss cap (6%)
- Max positions (3)
- Last 7 days: trades opened/closed, realized PnL, win/loss count
- Average win vs average loss
- Drawdown or loss streaks
- 24h/72h no-trade triggers
- Any E6 events (risk limits hit)
- Any proposals accepted/rejected
- Last trade timestamps for each pair

### Step 2: CSDAWGBOT Questions / Notes
Run structured questions:
- **A1:** Are the current pairs still fitting the strategy and behaving as expected?
- **A2:** Is trade frequency appropriate, or are we getting "dead" periods?
- **B1:** For Binance: is RSI 40-65 still working, or too restrictive/loose?
- **B2:** For Kraken: is RSI 30-70 behaving well, or should be tightened/loosened?
- **C1:** Does recent drawdown suggest risk per trade should be adjusted? (within rails)
- **C2:** Are any pairs showing consistently bad performance?
- **D1:** Did any proposals (config changes) over the last week help or hurt?

Store observations for continuity.

### Step 3: DeepSeek + GPT-5.4 Analysis
Using data + CSDAWGBOT notes:
- **DeepSeek:** Evaluate trade quality, E-codes, market-flow fit, whether filters (RSI, RR, etc.) are too tight or loose per exchange
- **GPT-5.4:** Synthesize and decide for EACH exchange:
  - **KEEP** - Keep current settings
  - **CHANGE** - Suggest config changes (1-3 concrete tweaks)
  - **ESCALATE** - Risk/system issue requiring immediate attention

If **CHANGE** suggested:
- Must stay within rails: 3% risk, 6% daily cap, max 3 positions, locked coin list
- Propose RSI tweaks, MIN_RR tweaks, or filter changes
- Explain expected effects on trade frequency, quality, risk

### Step 4: Output / Escalation to Marcelo
Produce weekly summary:

**For BINANCE:**
- Brief activity/performance summary
- Key CSDAWGBOT notes
- DeepSeek/GPT-5.4 recommendation (KEEP/CHANGE/ESCALATE)
- If CHANGE: exact suggested edits

**For KRAKEN:**
- Same structure

**Cross-exchange view:**
- Should Binance/Kraken stay differentiated or converge?
- Any systemic issues CSDAWGBOT should track

## Rules / Constraints

| Rule | Value |
|------|-------|
| Risk per trade | **3%** (max) |
| Daily loss cap | **6%** |
| Max positions | **3** |
| Coin list | **Locked** (no auto-adding) |
| Auto-apply changes | **NOT ALLOWED** - Must get Marcelo approval |

## Where Outputs Are Logged

- Weekly summary: Sent to Telegram
- Full notes: `memory/YYYY-MM-DD.md` under ## Agent Log
- Trading review: Port 8132 dashboard

## Health & Verification

### How to Verify Job is Registered
```bash
openclaw cron list | grep CSDAWGBOT-Weekly
```

### How to Check Last Run
```bash
openclaw cron runs CSDAWGBOT-Weekly-Strategy-Review
```

### What to Look For
- Last run timestamp should be Saturday 8 PM
- Status: "ok" (not "error")
- Telegram message received with summary

### Frequency
- Weekly every Saturday 8 PM
- Check by verifying cron schedule matches: `0 20 * * 6`

## Linkage

- **Obsidian:** This note (`Trading — CSDAWGBOT Weekly Strategy Review`)
- **GitHub:** `CLAW-Backup/docs/trading/csdawgbot-weekly-review.md`

---

*Created: 2026-04-08*
*Last Updated: 2026-04-09*

## Operational Rules (Apr 9, 2026)

### Auto-Proposal Spam Disabled
The Binance bot's `checkNoTrade24h()` function (in `~/Projects/binance-bot/server.js`) was generating RSI proposals every 5 minutes when no trade occurred for 24h+. This created a flood of Telegram messages.

**Fix:** Kill-switch added — `AUTO_PROPOSAL_ENABLED = false` at top of server.js.

**Current behavior:**
- No automatic strategy/proposal messages to Telegram
- Baseline remains frozen: RSI 40-65, 3% risk, 6% daily cap, max 3 positions
- Strategy change proposals only appear in the Saturday weekly review OR when Marcelo explicitly asks for optimization


**To re-enable:** Set `AUTO_PROPOSAL_ENABLED = true` in `~/Projects/binance-bot/server.js`

### Noise Reduction Policy
- No recurring AI-generated parameter proposals outside of scheduled weekly review
- No auto-triggered Telegram messages based on trade inactivity alone
- All strategy changes require explicit user approval