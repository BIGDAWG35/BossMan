# LEARNED_SERVICECHANNEL.md — ServiceChannel API Integration Canon (pointer + hard rules)

**Status:** CANON · research complete · **no production integration authorized**
**Package built:** 2026-11-24 · **Kanban card:** `t_bfde1dee` (assignee `bossman`) · **Source snapshot date:** 2026-11-24
**Independent verification:** **four read-only verification lanes** (2026-11-24) on disjoint evidence sets — auth/environment/requests/throttling (**COMPLETE**), webhooks (**PARTIAL**), work orders + check-in/out (**PARTIAL**), financial/proposals/invoices (**PARTIAL**) — plus a **fresh-context sub-agent retrieval probe** (**PASSED**) that found and correctly cited this package with no prior context. A second independent pass machine-audited **41** documented method+path assertions. Evidence and the per-lane record: `sources-and-change-log.md` §5.
**Verification caught real errors in our own drafts** — the invoice attachment endpoint that does not exist, the invoice collection read that does not exist, base64 vs multipart attachments, and the guide-only priority path. All were corrected in place rather than left standing.
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
5. **Document conflicts, don't silently resolve them.** **Twenty-one are open today** (`C-1` … `C-21` in `open-questions.md`) — including HTTP `406` carrying two official meanings, the documented verb set omitting PATCH while the spec contains PATCH operations, `Retry-After` specified as HTTP-date but exemplified as delta-seconds, the guide's `GET /workorders/priorities` being absent from the spec, three conflicting work-order status vocabularies, and the invoice-requirements endpoint the guide says does not exist.
6. **Financial writes require a human approval gate.** Invoice submission, proposal approval, NTE changes, and spending-limit changes are money actions → V3 carve-out path, plus a local pre-flight validation gate.
7. **Snapshot is dated, not permanent.** Before any build: re-fetch the spec, diff against the stored SHA-256, recheck auth/permissions/endpoints/limits/webhooks, then test in an authorized sandbox (`testing-and-rollout.md` §5).
8. **Never hardcode a work-order status enum.** The captured spec carries **three** different primary-status vocabularies; read `GET /workorders/{workorderId}/statuses` for the calling role (`capabilities.md` §2, **C-20**).
9. **Branch on the vendor's internal error code, not the HTTP status.** One code (`503`) covers five check-in/out conditions and `924` covers three; business rejections are terminal, not retryable (`architecture-and-reliability.md` §4, **C-21**).
10. **Attachment uploads are multipart, invoice reads are OData.** Work-order/per-note/by-PO attachments use `multipart/form-data`; base64 only via `POST /workorders/attachmentAsBase64`. Invoice collection reads are `GET /odata/invoices` — there is **no** `GET /invoices` collection endpoint.

---

## 4. Fast facts (verified 2026-11-24 — re-verify before use)

- REST + JSON, stateless, OAuth 2.0 bearer tokens. Access token **600 s**, refresh token **30 days**. TLS 1.2+.
- Hosts: Sandbox2 `sb2api.servicechannel.com` · Production `api.servicechannel.com` · token endpoint `login.servicechannel.com/oauth/token`.
- Rate limits: Production **300/min per client id** + **600/min per company**; Sandbox2 **40/min** + **80/min**. Token POST: **1 per 5 s per user**, else `429` + `Error-Message: Rejected by security reason: Login attempts limit exceed.`
- Duplicate request inside 10 s → **HTTP 406** with `{"Reason":"Duplicate request/request already processed", …}`.
- Throttling → **429** + `{"Reason":"Request has been throttled…"}` + HTTP-date `Retry-After`.
- Webhook signature: `GET /NotificationSubscriptions/SigningKey` → `Key`; HMAC-SHA256 over the exact body, Base64/UTF-8, compare to the `Sign-Data` header. Ack within **5 s**; **3 retries at 5-minute intervals**; disable after **1,000** consecutive failures. 80+ events; general pattern `ObjectEvent`; exceptions `WorkOrderCheckIn` / `WorkOrderCheckOut`.
- Work orders: `POST /workorders` (body `ServiceChannel.Services.Messaging.Workorders.CreateWoRequest`) → `201 {"id":…}`; `PUT /workorders/{workorderId}/status` (body `…ChangeWoStatusRequestExt`) → `200 {"result":…,"id":…}`. `CreateWoRequest.required` = `["ContractInfo","Category","CallDate","Description","ProblemCode"]`; `ContractInfo.required` = `["SubscriberId","LocationId","TradeName"]` but those are **conditional** in the field descriptions (**C-15**).
- **Work-order writes are permission-gated (spec prose):** `WorkOrderFullEdit` for the NTE and priority writes, `WorkOrderStatusChange` for the status write. The spec's `x-access` on all three reads `Any` — treat `x-access` as guidance, not an authorization matrix.
- **Priorities:** the spec exposes `GET /priorities` (+ `POST /priorities`, `GET /priorities/locations/{locationId}/priorities`); the guide's `GET /workorders/priorities` is **absent from the spec** (**C-18**).
- **Statuses:** three conflicting vocabularies exist in one spec (`GetStatusResponse.Id` vs `CheckOutRequest.PrimaryStatus` vs `WorkOrderViewModel.Status`) — **C-20**. Use `WorkorderStatusConstraints` (`IsResolutionTextRequired`, `IsShippingInfoRequired`, `IsResolutionCodesRequired`, `IsScheduledDateRequired` — providers only; `AskForReviews` — subscribers only) instead of a hand-written rule table.
- **Attachments:** work-order, per-note and by-PO-number uploads are **`multipart/form-data`** (`AddAttachmentsRequest` + `file`); base64 only via `POST /workorders/attachmentAsBase64`. Deleting an attachment **creates a system note** and **does not remove it from the ServiceChannel database**.
- **Bulk work-order reads:** `POST /odata/workorders/filter` — last **90 days** default, **365-day** `CallDate` ceiling, 50 rows, `$skip`. Duplicates/recalls: `GET /odata/locations({locationId})/workorders/Service.GetDuplicates()` and `…/Service.GetRecalls()`.
- **Check-in/out:** the official troubleshooting page documents **18** failure conditions (HTTP + internal code + message + reason + remedy) — including the **168-hour (7-day)** out-of-date rule, the **24-hour** location-date bound, the account-derived GPS radius (`GET /workorders/{workorderId}/GPSRadius`; 2-mile default only when Site Access rules are absent), and `403 / 804` as an **entitlement** failure that must not be retried.
- **Work activities:** `POST/PUT/DELETE /workorders/{workorderId}/workactivities` + OData reads; `In Progress` only; check-in ≤ check-out; check-in ≥ scheduled date; **no overlapping ranges**. A multi-ID delete succeeds if **at least one** ID is valid — always read back.
- Invoices only from a work order in `Completed` / `Completed/Confirmed`; a submitted invoice cannot be edited and **there is no API method to void it** (UI only, and a rejected/held invoice cannot be voided either).
- **Invoice surface:** 17 operations under `/invoices…` + **`GET /odata/invoices`** = **18**. There is **no** `GET /invoices` collection endpoint and **no** `POST /invoices/{invoiceId}/attachments`. `GET /odata/invoices` defaults to the last **90 days** with a **365-day** `PostedDate` ceiling. `CreateInvoiceRequest` requires `InvoiceNumber` + `WoIdentifier`; a created invoice is in `Open` state, and payment acts on `Approved`.
- **Invoice state actions (query contracts):** approve → `approvalCode`, `comments`, `category`; reject → `comments` (+ optional `isNotifyProvider`, `additionalEmails`); on-hold → `comments`. Success = **HTTP 204**. Failures carry internal codes: `502` (wrong invoice id), `503` (MLI enabled), `504` (security permissions, HTTP 401).
- **Invoice gates:** payment needs **both** `Invoice Admin` and `InvoiceChangeToPaid`; `/approve`, `/reject`, `/onhold` are **MLI-incompatible**. No captured source defines a `Draft` invoice state and `Invoice.Status` is an untyped string with no complete enum — do not build a draft→paid state machine.
- **Invoice requirements:** the guide says "Currently, you cannot obtain these requirements using API, so ask the subscriber", but the spec exposes `GET /invoices/{subscriberId}/InvoiceRequirements` → `InvoiceSettingsGeneral` for both subscribers and providers (**C-16**). Keep our onboarding-captured table authoritative until a sandbox probe settles it.
- Proposals cannot be approved if the work order is already invoiced, no work order is attached, or the amount exceeds the user's approval limit. Link with `PUT /proposals/{proposalId}/assignWO`. Available actions are discoverable via `GET /proposals/proposalIds` (Edit, Open, On hold, Approve, Reject, Assign). The spec's `UpdateProposalStatusRequest` field is **`Comment`** (singular) while the guide table says `Comments` (**C-2**). The guide lists four statuses (`Open`, `On Hold`, `Approved`, `Rejected`); the spec also lists `Void` and `Reviewed` (**C-17**).

- **Child-subscriber scoping** is token-level: a second `POST /oauth/token` with `subsidiary_id` in the body (id from `GET /subscribers/current/subsidiaries`). Bind the tenant key to the token, never to request input.
- **Duplicate recovery:** the `406` body carries `ProcessedRequestInfo` — the *first* request's response. Read it instead of re-posting.
- **Production read-after-write can `404`:** production reads hit replica servers while writes hit the primary. A `404` right after a `2xx` write is not a failure — re-read with backoff, never re-post.
- **Error bodies:** `{"ErrorCodes":[…],"ErrorCode":<first>,"ErrorMessage":"…"}`; `gen_codes.md` holds 41 HTTP codes plus a 380-entry internal error-code catalogue.
- **Impersonation is documented** (bearer `auth_type=Impersonate&ImpersonateInfo.UserName=…`; JWT `impersonate_info.username`; verify with `GET /users/current/profile`). It inherits the impersonated user's permissions **and data boundaries** → privileged, approval-gated, never in an automated pipeline.
- **Sandbox2 → Production method replication lag:** a method proven in Sandbox2 is not automatically Production-ready.
- **Webhook budgets:** 20 webhooks, 20 subscriptions per webhook, 400 total (VERIFIED). No payload-size or event-volume limit is documented.
- **Webhook test path:** `POST /test/webhooks/notifications` → 201 + a `Source: "WebhookTest"` payload carrying real `Sign-Type`/`Sign-Data` headers — proves the full HMAC path before creating a real webhook.
- **Webhook delivery guarantees are absent from the docs:** no ordering, no exactly-once, no duplicate/missed-event guidance, no replay API. Events are deleted after 3 failed deliveries → reconciliation is mandatory, not optional.

Full detail, with source URL + verification date per claim, is in the package.

---

## 5. Owner + change discipline

- **Owner:** BossMan (kernel) · lane execution: builder + qa-verification.
- **Change log:** every revalidation appends to `sources-and-change-log.md` §4 (change-log discipline) with date, new spec SHA-256, and what changed; independent-verification results go in §5.
- **Unresolved items:** `open-questions.md` is the single register; closing an item requires the evidence noted in its "Resolution" column.
- Mirrors of this pointer: `Repos/BossMan/docs/hermes-canon/LEARNED_SERVICECHANNEL.md` and `Obsidian/Hermes/V3-Canon/V3 – ServiceChannel.md` (canon wins; mirrors are read-only views).
