# Perplexity Spaces — Quick Reference (Hermes)

## When to Open Each Space

| What You're Doing | → Use This Space | Why |
|------------------|-----------------|-----|
| **Routing a task, checking bot profiles, service health** | Agent OS | Bot roles, routing table, who's owner of what |
| **Checking system status / ports / services** | Agent OS | Services map, Hermes routes, Tailscale access |
| **Finding a file, folder, or Hermes config** | Agent OS | Workspace map, ~/.hermes/ directory |
| **New business idea, opportunity, money pipeline** | Business Ideas | Opportunities tracker, passive income research |
| **VP-level IT consulting, automation client work** | Business Ideas | Money pipeline, client targeting |
| **Real estate research, property analysis** | Business Ideas | Real estate targets, deal math |
| **Trading bot / crypto strategy, signals, portfolio** | Trading Ops | Strategy, MIN_RR, pair performance, signals |
| **Trading bot acting weird, health check, cron issues** | Trading Ops | Bot health, Binance status, service checks |
| **Coding, building apps, web dev** | Toolchain Dev | Hermes, Cursor, Claude, Node/Python tools |
| **Debugging services, PM2, Hub, Tailscale, Docker** | Toolchain Dev | Debugging stack, port scanning, log commands |
| **Hermes config, skills, profiles, gateway setup** | Toolchain Dev | Hermes architecture, CLI commands, services |

---

## Space Summary Cards

### 🧠 Agent OS
**When:** System questions — which profile does what, what ports, where files are, routing rules, service health.
**Start here for:** Anything operational about Hermes itself.

### 💰 Business Ideas
**When:** New opportunity, side project, passive income idea, money pipeline, consulting leads.
**Start here for:** Evaluating ideas, researching opportunities, money pipeline review.

### 📈 Trading Ops
**When:** Trading strategy, bot parameters, portfolio review, risk rules, Binance bot health.
**Start here for:** MIN_RR settings, cycle targets, pair performance, open trading items.

### 🔧 Toolchain Dev
**When:** Coding, debugging, Hermes config, using Cursor or Claude, checking services.
**Start here for:** Dev tools, debugging commands, Hermes CLI, local dev setup.

---

## Decision Flow

```
What am I working on today?
│
├─ Hermes routing / profiles / services → Agent OS
├─ New idea / money / opportunity → Business Ideas
├─ Coding / building / app dev → Toolchain Dev
├─ Debugging services / PM2 / ports → Toolchain Dev
├─ Trading bot / crypto / portfolio → Trading Ops
├─ Bot acting up / health check → Trading Ops
└─ Hermes config / skills / profiles → Toolchain Dev
```

---

## Key URLs

| What | Local | Remote (Tailscale) |
|------|-------|---------------------|
| Hermes gateway | localhost:3001 | Tailscale |
| Hermes dashboard | localhost:9119 | localhost only |
| Trading bot (Binance) | localhost:8104 | localhost only |
| Crypto tracker | localhost:8020 | localhost only |
| OpenHue (lights) | localhost:3100 | Tailscale |
| Web service | localhost:8090 | Tailscale + local |

---

## Hermes Profile Routing

| Task Type | Route To |
|-----------|----------|
| New idea / brainstorming | ideas skill → bossman |
| Code / app / web dev | builder |
| PM2 / services / deploy | ops |
| Crypto / stocks / trading | trading |
| Content / docs / scripts | content |
| Debugging / security | debug skill |
| Apple apps / iMessage | apple skill |
| GitHub / repos | github skill |

---

**Spaces location:** `/Users/bigdawg/Desktop/perplexity-spaces Hermes/`
**Hermes config:** `~/.hermes/`
