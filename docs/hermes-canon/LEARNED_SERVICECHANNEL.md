# LEARNED_SERVICECHANNEL.md — ServiceChannel API Integration Canon (pointer + hard rules)

**Status:** CANON · research complete · **no production integration authorized**
**Package built:** 2026-11-24 · **Kanban card:** `t_bfde1dee` (assignee `bossman`) · **Source snapshot date:** 2026-11-24
**Canonical package:** `~/.hermes/knowledge/integrations/servicechannel/`
**Spec snapshot:** `specs/servicechannel-swagger-v3.json` · Swagger `2.0` · API version `3` · 664 paths / 740 operations · 1,890,160 bytes · SHA-256 `d490d65968093cec2475ad278448f5f7c6654a3658130a21b56f60b4802fec98`

This file is the **entry point**. The detail lives in the package. Do not duplicate package content here.

---

## 1. Routing rule (MANDATORY)

> **Before planning or implementing anything involving ServiceChannel, retrieve `integrations/servicechannel/README.md` and the relevant playbooks. Verify the current official operation schema and account permissions before making implementation decisions or executing writes.**

Applies to every lane (builder, ops, research-intel, qa-verification, knowledge-canon) and to BossMan itself.

**Retrieval tags (use these when searching the knowledge base or dispatching a lane):**
`ServiceChannel`, `maintenance`, `work orders`, `facilities management`, `CMMS`, `providers`, `assets`, `proposals`, `invoices`, `webhooks`, `OAuth`.

**Discovery path for a fresh sub-agent (no prior context):**
1. `~/.hermes/knowledge/LEARNED_INDEX.md` → row "ServiceChannel Integration".
2. This file → package map below.
3. `~/.hermes/knowledge/integrations/servicechannel/README.md` → routing table for the task at hand.
4. Skill `servicechannel-integration` (`skill_view(name='servicechannel-integration')`) for the operational checklist.

---

## 2. Package map (`~/.hermes/knowledge/integrations/servicechannel/`)

| File | Use it for |
|---|---|
| `README.md` | Entry point, document manifest, "which file do I read for X" table |
| `capabilities.md` | Business capability map (work orders, reference data, assets, notes, check-in/out, proposals, invoices, webhooks, subscriber vs provider) |
| `api-operation-index.md` | All 740 operations grouped by path family (human-readable) |
| `authentication-and-security.md` | OAuth grants, token lifetimes, environments, TLS, secret handling, app registration |
| `data-model-and-id-mapping.md` | `SubscriberId` / `ProviderId` / `LocationId` / `StoreId` / `workorderId` / `AssetId` / `noteId` domains + tenant isolation |
| `work-order-playbook.md` | Classic vs IssueList creation, reference-data preflight, status/NTE/priority/notes/attachments mutations |
| `webhook-playbook.md` | Subscription setup, delivery, HMAC-SHA256 `Sign-Data` verification, 5-second ack, retries, disable rule, reconciler |
| `financial-workflows.md` | Proposal approval gates, invoice lifecycle, invoice requirements gap, voiding gap, audit rules |
| `architecture-and-reliability.md` | Future-build blueprint (labelled recommendations, not vendor requirements) |
| `testing-and-rollout.md` | Hermetic mock-server strategy, sandbox test matrix T1–T16, staged rollout, revalidation cadence |
| `open-questions.md` | The honesty register: every conflict, unknown, and account-specific item |
| `sources-and-change-log.md` | 56 official sources with URLs + dates + byte counts; spec checksum; change-log discipline |
| `specs/` | Raw Swagger snapshot, generated operation index (JSON), schema extract, 56 page snapshots |
| `BLUEPRINT.md` | Research scope, source authority, conflict policy, package layout |

---

## 3. Hard rules (carry into any future build)

1. **Research-only until authorized.** No app registration, no account creation, no authenticated call, no vendor-side mutation without an explicit card + Marcelo's approval.
2. **No secrets in knowledge documents.** Use placeholders. Credentials live in the app's secret store, never in `~/.hermes/knowledge/`.
3. **No `client_credentials` assumption.** The official authentication page documents exactly two OAuth grants: authorization code and resource owner password credentials. Do not design unattended access on an undocumented grant — see `open-questions.md` Q-AUTH-01.
4. **Never invent schemas, endpoints, permissions, or limits.** Unknown = `open-questions.md`, not a guess.
5. **Document conflicts, don't silently resolve them.** Four are open today (C-1 … C-4 in `open-questions.md`).
6. **Financial writes require a human approval gate.** Invoice submission, proposal approval, NTE changes, and spending-limit changes are money actions → V3 carve-out path, plus a local pre-flight validation gate.
7. **Snapshot is dated, not permanent.** Before any build: re-fetch the spec, diff against the stored SHA-256, recheck auth/permissions/endpoints/limits/webhooks, then test in an authorized sandbox (`testing-and-rollout.md` §5).

---

## 4. Fast facts (verified 2026-11-24 — re-verify before use)

- REST + JSON, stateless, OAuth 2.0 bearer tokens. Access token **600 s**, refresh token **30 days**. TLS 1.2+.
- Hosts: Sandbox2 `sb2api.servicechannel.com` · Production `api.servicechannel.com` · token endpoint `login.servicechannel.com/oauth/token`.
- Rate limits: Production **300/min per client id** + **600/min per company**; Sandbox2 **40/min** + **80/min**. Token POST: **1 per 5 s per user**, else `429` + `Error-Message: Rejected by security reason: Login attempts limit exceed.`
- Duplicate request inside 10 s → **HTTP 406** with `{"Reason":"Duplicate request/request already processed", …}`.
- Throttling → **429** + `{"Reason":"Request has been throttled…"}` + HTTP-date `Retry-After`.
- Webhook signature: `GET /NotificationSubscriptions/SigningKey` → `Key`; HMAC-SHA256 over the exact body, Base64/UTF-8, compare to the `Sign-Data` header. Ack within **5 s**; **3 retries at 5-minute intervals**; disable after **1,000** consecutive failures. 80+ events; general pattern `ObjectEvent`; exceptions `WorkOrderCheckIn` / `WorkOrderCheckOut`.
- Work orders: `POST /workorders` (body `ServiceChannel.Services.Messaging.Workorders.CreateWoRequest`) → `201 {"id":…}`; `PUT /workorders/{workorderId}/status` (body `…ChangeWoStatusRequestExt`) → `200 {"result":…,"id":…}`.
- Invoices only from a work order in `Completed` / `Completed/Confirmed`; a submitted invoice cannot be edited and **there is no API method to void it** (UI only); invoice requirements must be obtained from the subscriber (not available via API).
- Proposals cannot be approved if the work order is already invoiced, no work order is attached, or the amount exceeds the user's approval limit. Link with `PUT /proposals/{proposalId}/assignWO`.

Full detail, with source URL + verification date per claim, is in the package.

---

## 5. Owner + change discipline

- **Owner:** BossMan (kernel) · lane execution: builder + qa-verification.
- **Change log:** every revalidation appends to `sources-and-change-log.md` §5 with date, new spec SHA-256, and what changed.
- **Unresolved items:** `open-questions.md` is the single register; closing an item requires the evidence noted in its "Resolution" column.
- Mirrors of this pointer: `Repos/BossMan/docs/hermes-canon/LEARNED_SERVICECHANNEL.md` and `Obsidian/Hermes/V3-Canon/V3 – ServiceChannel.md` (canon wins; mirrors are read-only views).
