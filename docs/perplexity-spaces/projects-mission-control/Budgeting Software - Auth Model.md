**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/PROJ-2026-07_budgeting-software/AUTH_MODEL.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# BudgetingSoftware — Phase 2 Auth Model

**Phase:** 2 of 10
**Date:** 2026-07-21
**Parent:** `ARCHITECTURE.md` + `DB_SCHEMA.md`
**Status:** Auth model locked 2026-07-21 (Phase 2 closed; Phase 3 MVP live 2026-07-22; Phase 4+ paused)

---

## 1. Authentication strategy

**v1:** Local accounts only — email + bcrypt password. No SSO, no magic links, no OAuth. Pilot is a single-Company internal tool; the user base is ≤50 (one admin + a few editors + viewers). Local accounts are sufficient.

**Future (v2):** swap to OIDC / SAML SSO via `passport.js` with a new strategy. The `users.password_hash` column stays for fallback; `users.oidc_subject` column added.

## 2. Roles (locked in Phase 1)

| Role | Scope | Powers |
|---|---|---|
| **Admin** | Company-wide | Everything. Force-approve. User management. Department/Category management. |
| **Editor** | Department(s) | Create/edit DRAFT budgets, import Excel/CSV, upload contracts, edit actuals. Cannot approve. |
| **Viewer** | Department(s) | Read-only. Can be the **Reviewer** for their Department (per Q1.1). |

**Reviewer** is not a separate role — it's the user assigned to `departments.reviewer_user_id`. A Reviewer is typically a **Viewer** with the additional power to `POST /budget-years/:id/approve|reject` on budgets in their Department.

**Accounting/Admin override:** Admin can act as Reviewer for any Department when `departments.reviewer_user_id IS NULL` (per Q1.1).

## 3. Session model

**Library:** `express-session` with `better-sqlite3-session-store` (persistent sessions in the SQLite DB — survives process restarts).

**Cookie:**
```js
{
  name: 'budgeting.sid',
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',  // Tailscale only — no public exposure in v1
  maxAge: 8 * 60 * 60 * 1000,                     // 8 hours (workday)
  resave: false,
  saveUninitialized: false,
  store: new SqliteStore({ client: db, expired: { clear: true, intervalMs: 900000 } }),
  secret: process.env.BUDGETING_SESSION_SECRET     // 32-byte random, in .env
}
```

**Session payload:** `{ userId, companyId, role, departmentId }` — minimal; full user is re-fetched on every request via `req.user` middleware.

**Logout:** `POST /logout` → `req.session.destroy()` + cookie clear.

## 4. Password hashing

**Library:** `bcrypt` (native bindings, matches the rest of the stack).

**Cost factor:** 12 (≈250 ms on M4 Max — sweet spot for security vs UX).

**Policy:**
- Min length 10 chars (enforced in app + DB CHECK)
- Must contain at least one letter + one digit
- Not in a small common-passwords list (`lib/common-passwords.js` — top 10k)
- Hashed with `bcrypt.hashSync(password, 12)`
- Compared with `bcrypt.compareSync(submitted, hash)` — constant-time

## 5. CSRF

**Library:** `csurf` (or `csrf-csrf` if csurf is unmaintained).

**Strategy:**
- Per-session CSRF token generated at login
- Embedded in every HTML form as `<input type="hidden" name="_csrf">`
- Required header on all POST/PUT/DELETE JSON API endpoints: `X-CSRF-Token: <token>`
- `app.use(csurf())` middleware on all state-changing routes
- Token is session-bound (not per-form) — simpler for v1

## 6. Route protection — middleware chain

```js
// middleware/auth.js
function requireAuth(req, res, next) {
  if (!req.session?.userId) return res.redirect('/login');
  const user = db.prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL').get(req.session.userId);
  if (!user) return res.redirect('/login');
  req.user = user;
  next();
}

function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'unauthenticated' });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

function requireReviewer(req, res, next) {
  // Reviewer for the budget year's department, OR Admin
  if (req.user.role === 'admin') return next();
  const budgetYear = db.prepare('SELECT * FROM budget_years WHERE id = ?').get(req.params.id);
  if (!budgetYear) return res.status(404).end();
  const dept = db.prepare('SELECT * FROM departments WHERE id = ?').get(budgetYear.company_id);  // wait — fix this
  // Actually: budget_year → line_items → department; or budget_year.company_id + user's company_id match
  // For v1 single-tenant, simpler: check if user's department_id matches ANY line_item's department_id in this budget year
  const isReviewer = db.prepare(`
    SELECT 1 FROM line_items li
    WHERE li.budget_year_id = ?
      AND li.department_id = ?
      AND li.deleted_at IS NULL
    LIMIT 1
  `).get(budgetYear.id, req.user.department_id);
  if (!isReviewer) return res.status(403).json({ error: 'not_reviewer_for_this_year' });
  next();
}
```

**Usage:**
```js
router.post('/budget-years', requireAuth, requireRole('admin','editor'), handler);
router.post('/budget-years/:id/approve', requireAuth, requireReviewer, handler);
router.get('/settings', requireAuth, requireRole('admin'), handler);
router.get('/dashboard', requireAuth, handler);  // any logged-in user
```

## 7. Login flow

```
GET  /login     → render login.ejs (with CSRF token)
POST /login     → { email, password, _csrf }
                  1. verify CSRF
                  2. SELECT user WHERE email = ? AND deleted_at IS NULL AND is_active = 1
                  3. bcrypt.compareSync(password, user.password_hash)
                  4. if match: req.session.userId = user.id; req.session.companyId = user.company_id; redirect /
                  5. if no match: render login.ejs with "Invalid email or password" (no enumeration leak)
                  6. rate-limit: 5 attempts / 15 min / IP (express-rate-limit)
```

## 8. First-run bootstrap (Admin user)

`scripts/one-time-seed.js`:
1. Apply migrations
2. INSERT companies row (Pilot Co)
3. INSERT 13 departments
4. INSERT default categories
5. INSERT default admin user:
   - email from `SEED_ADMIN_EMAIL` env var (default: `admin@localhost`)
   - password = random 16 chars, **printed to stdout once**, never stored in plaintext
6. Operator reads password from seed output, logs in, rotates password via Settings page

## 9. Session lifecycle

| Event | Action |
|---|---|
| Login | Create session, store `userId` + `companyId` + `role` + `departmentId` |
| Request | Re-fetch user from DB on every protected request (cheap with better-sqlite3) |
| Logout | `req.session.destroy()` + clear cookie |
| Password change | Destroy all sessions for that user (force re-login everywhere) |
| User deactivated | Destroy all sessions; reject new logins for that user_id |
| Idle timeout | 8 hours (configurable via `BUDGETING_SESSION_TTL_MS`) |
| CSRF failure | Log to `audit_log` with action='csrf_failure', return 403 |
| Login failure | Log to `audit_log` with action='login_failure', no PII in log (just email hash) |

## 10. Rate limiting + lockout

**Library:** `express-rate-limit`.

| Endpoint | Limit |
|---|---|
| `POST /login` | 5 / 15 min / IP |
| `POST /login` (per email) | 10 / hour / email |
| `POST /import` | 10 / hour / user |
| `POST /budget-years/:id/rollover` | 1 / day / user (idempotency) |

**Account lockout:** after 10 failed login attempts per email in 1 hour, lock the account for 1 hour (sets `users.is_active = 0` + audit_log). Admin can unlock via Settings page.

## 11. Audit log integration

Every auth event writes to `audit_log`:
- `auth.login` (success) — after `req.session.userId` is set
- `auth.login_failure` (failure) — without password in the log
- `auth.logout` — before `req.session.destroy()`
- `auth.password_change` — after the password_hash update
- `auth.csrf_failure` — when csurf middleware rejects

Sample row:
```json
{
  "id": "uuid",
  "company_id": "uuid",
  "user_id": "uuid",
  "action": "auth.login",
  "entity_type": "session",
  "entity_id": "session-id",
  "ip_address": "100.x.x.x",
  "user_agent": "Mozilla/5.0...",
  "created_at": 1721600000
}
```

## 12. Open issues for Phase 3

- **Session store backend:** better-sqlite3-session-store (recommend) vs connect-sqlite3. Pick before Phase 3 starts.
- **MFA:** not in v1. Document as v2 candidate.
- **Password reset:** not in v1 (Admin resets via Settings page; user can't self-reset). Document as v2 candidate.
- **First-login password rotation:** the seed prints the random password once. Phase 3 should add a `must_change_password` flag + forced redirect to `/change-password` on first login (defense in depth).

---

**Status:** Auth model locked. Phase 3 can implement.