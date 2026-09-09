# GIPA Services Limited — Admin Portal Master Specification
## Level 1 — Internal Recruitment & Contact Administration

**Status:** Architecture baseline / implementation specification  
**Scope:** Level 1 only  
**Authoritative rule:** This document is the source of truth for the Level 1 admin portal. Cursor must not redesign the architecture during implementation without stopping and reporting the conflict.

---

## 1. Objective

Build a secure internal Admin Portal for GIPA Services Limited within the existing GIPA website codebase.

The portal must allow authorized GIPA staff to manage submitted Driver and Warehouse Operative applications and Contact submissions without replacing or breaking existing public website functionality.

The admin portal is an internal management surface, not a separate public product.

---

## 2. Hosting and Codebase

Use the **same Next.js codebase and repository** as the existing GIPA website.

Admin URL:

`https://gipaservicesuk.com/admin`

Do NOT create a separate application or separate database for Level 1.

Use the same PostgreSQL database, with logical separation between public-domain data and admin-domain metadata.

Admin routes must be protected server-side.

The existing public website, public application forms, WorkDrive integration, ZeptoMail integration, Reply-To behavior, and health endpoint must remain functional.

---

## 3. Existing Technology Baseline

Existing project baseline:

- Next.js 15
- React 18.3
- TypeScript 5.8
- App Router
- UI under `src/views/` and `src/components/`
- shadcn/Radix UI
- Tailwind CSS 3.4
- PostgreSQL
- Prisma 7.4.1
- Zoho WorkDrive for CV storage
- Zoho ZeptoMail for transactional email

Do not replace these technologies without explicit approval.

---

## 4. Existing Public Database Models

Existing Prisma models:

### DriverApplication
Contains applicant-submitted driver information, including:
- id (UUID)
- fullName
- address
- phone
- email
- licenceType
- experienceYears
- rightToWork
- gdprConsent
- consentTimestamp
- cpcStatus?
- hgvCategory?
- availability?
- cvFileUrl
- ipAddress?
- createdAt

### WarehouseOperativeApplication
Contains applicant-submitted warehouse information, including:
- id (UUID)
- fullName
- address
- phone
- email
- warehouseExperienceYears
- rightToWork
- gdprConsent
- consentTimestamp
- availability?
- cvFileUrl
- ipAddress?
- createdAt

### Contact
Contains:
- id (UUID)
- fullName
- companyName?
- email
- phone?
- message
- ipAddress?
- createdAt

These public models remain the source of truth for submitted applicant/contact data.

Do NOT duplicate applicant PII into admin metadata tables.

Do NOT add a generic applicantId merely for linking. Existing UUID primary keys are sufficient.

---

## 5. Admin Database Architecture

Create separate admin-domain metadata models in the SAME PostgreSQL database.

### AdminUser

Fields:
- id
- name
- email (unique)
- passwordHash
- role
- isActive
- createdAt
- updatedAt
- lastLoginAt?
- failedLoginCount
- lockedUntil?

Roles:
- ADMIN
- STAFF

Admin accounts should normally be deactivated using `isActive=false`, not physically deleted, so historical audit attribution remains meaningful.

---

### DriverApplicationAdmin

Fields:
- id
- driverApplicationId (required, unique FK)
- status
- archivedAt?
- archivedById?
- cvFileId?
- createdAt
- updatedAt

Relationship:

`DriverApplication 1 : 1 DriverApplicationAdmin`

The FK must be NOT NULL and UNIQUE.

---

### WarehouseApplicationAdmin

Fields:
- id
- warehouseApplicationId (required, unique FK)
- status
- archivedAt?
- archivedById?
- cvFileId?
- createdAt
- updatedAt

Relationship:

`WarehouseOperativeApplication 1 : 1 WarehouseApplicationAdmin`

The FK must be NOT NULL and UNIQUE.

---

### ContactAdmin

Fields:
- id
- contactId (required, unique FK)
- archivedAt?
- archivedById?
- createdAt
- updatedAt

Relationship:

`Contact 1 : 1 ContactAdmin`

---

### Note

Use one Note model.

Fields:
- id
- authorId
- driverApplicationId?
- warehouseApplicationId?
- contactId?
- content
- createdAt

A note must belong to exactly ONE supported entity:
- DriverApplication OR
- WarehouseOperativeApplication OR
- Contact

Do not allow zero-owner or multi-owner notes.

Notes are append-only in Level 1:
- add allowed
- editing not supported
- deletion not supported

---

### AuditLog

Fields:
- id
- actorId?
- actorEmail
- action
- entityType
- entityId
- metadata?
- ipAddress?
- createdAt

Audit logs are immutable.

Do not cascade-delete audit logs when application/contact records are permanently deleted.

Avoid storing unnecessary applicant PII inside audit metadata.

Meaningful events to audit include:
- LOGIN
- LOGOUT
- APPLICATION_STATUS_CHANGED
- APPLICATION_ARCHIVED
- APPLICATION_RESTORED
- APPLICATION_DELETED
- NOTE_ADDED
- CV_ACCESSED
- CONTACT_ARCHIVED
- CONTACT_RESTORED
- CONTACT_DELETED

Do not create noisy page-view audit events in Level 1.

---

## 6. Enums

### AdminRole
- ADMIN
- STAFF

### ApplicationStatus
- NEW
- UNDER_REVIEW
- SHORTLISTED
- INTERVIEW
- OFFER
- HIRED
- REJECTED
- WITHDRAWN

Archive is NOT a status.

---

## 7. Data Integrity Rules

The database must enforce integrity wherever practical.

Required:
- UUID primary keys
- NOT NULL where logically mandatory
- UNIQUE on admin-to-public FK fields
- Foreign keys
- Appropriate indexes
- Explicit cascade/restrict behavior
- Sensible defaults
- Enum constraints through Prisma
- Database check constraint for Note ownership if Prisma migration supports it cleanly; otherwise enforce through a centralized server-layer invariant and test it thoroughly

Important invariant:

> Every successfully persisted DriverApplication must have exactly one DriverApplicationAdmin record.

Important invariant:

> Every successfully persisted WarehouseOperativeApplication must have exactly one WarehouseApplicationAdmin record.

Important invariant:

> Every Note belongs to exactly one supported entity.

---

## 8. Submission Transaction

When a public applicant submits successfully:

1. Validate input.
2. Upload CV to WorkDrive if applicable.
3. Start a PostgreSQL transaction.
4. Create the public application row.
5. Create the corresponding admin metadata row with `status=NEW` and `archivedAt=NULL`.
6. Commit.
7. Send transactional emails after successful persistence.

The public application and admin metadata must be created atomically at the database level.

If either DB creation fails, roll back both.

WorkDrive is external to the PostgreSQL transaction. If a DB transaction fails after CV upload, attempt cleanup of the uploaded WorkDrive resource and log a recoverable cleanup failure if cleanup itself fails.

Email failure must NOT roll back a successfully persisted application.

The same principle applies to Warehouse applications.

---

## 9. WorkDrive / CV Handling

Current WorkDrive upload returns a `resource_id` but the existing flow does not persist it.

Level 1 must preserve a reliable WorkDrive resource identifier (`cvFileId`) for newly submitted applications.

Do not expose WorkDrive credentials to the browser.

Admin CV access must go through an authenticated server-side route/service that:
1. authenticates the admin,
2. authorizes access,
3. resolves the application,
4. resolves the stored WorkDrive resource,
5. retrieves/streams the CV safely.

Do not rely on unrestricted public CV URLs.

Historical applications that lack `cvFileId` require a safe compatibility strategy; do not guess resource IDs.

Permanent deletion must account for the WorkDrive file and must not silently claim complete deletion if WorkDrive deletion fails.

---

## 10. Application Lifecycle

Recruitment status is:

`NEW → UNDER_REVIEW → SHORTLISTED → INTERVIEW → OFFER → HIRED`

Also allowed:
- REJECTED
- WITHDRAWN

Level 1 may allow flexible/backwards status transitions unless a stricter transition matrix is explicitly approved later.

Every status change must:
- be server-authorized,
- validate the requested enum value,
- update the admin metadata,
- create an AuditLog entry.

---

## 11. Archive Lifecycle

Archive is administrative state, separate from recruitment status.

Active:
- `archivedAt = NULL`

Archived:
- `archivedAt = timestamp`
- `archivedById = authenticated admin`

Default application list should show active records.

Archived records must remain retrievable through an archive filter/view.

Restore:
- `archivedAt = NULL`
- `archivedById = NULL`
- create audit record

Archive and restore are allowed to ADMIN and STAFF unless an explicit later security decision changes this.

---

## 12. Permanent Deletion

Permanent deletion is restricted to ADMIN.

Conditions:
- application/contact must already be archived
- authenticated actor must be ADMIN
- explicit confirmation required
- server must re-check all conditions at mutation time

Never permit direct active-record permanent deletion.

When deleting an application:
- handle WorkDrive CV according to the safe deletion procedure
- delete application/admin metadata/dependent notes as appropriate
- retain AuditLog
- do not retain unnecessary applicant PII in audit records

Use foreign-key cascade behavior only where it is intentional and safe.

Deletion operations must be designed to avoid race conditions and double-submit problems.

---

## 13. Roles and Authorization

### ADMIN
Allowed:
- view applications
- view contacts
- search/filter/sort
- change application status
- add notes
- view CVs
- archive
- restore
- permanent delete
- view audit history

### STAFF
Allowed:
- view applications
- view contacts
- search/filter/sort
- change application status
- add notes
- view CVs
- archive
- restore

Not allowed:
- permanent deletion
- admin-user management
- audit-log administration/view if restricted by Level 1 policy

Authorization must be checked on the server for every mutation and every sensitive CV access. Never trust role information supplied by the client.

No user-management UI is required in Level 1. Seed the initial ADMIN through a controlled process.

---

## 14. Authentication Requirements

Admin login must use:
- strong password hashing, preferably Argon2id where supported by the selected auth implementation
- secure server-side sessions
- HttpOnly cookies
- Secure cookies in production
- appropriate SameSite policy
- login rate limiting / brute-force protection
- inactive account rejection
- logout
- safe generic login errors
- no password logging
- no password storage in plaintext

Do not expose session secrets or password hashes to the browser.

Choose an authentication library only after Phase 0 verifies compatibility with the current Next.js/Prisma setup.

---

## 15. Admin Routes

Required:

- `/admin/login`
- `/admin`
- `/admin/applications`
- `/admin/applications/[id]`
- `/admin/contacts`
- `/admin/contacts/[id]`

A protected admin layout should wrap authenticated routes.

Do not use the public marketing Header/Footer as the admin shell.

Admin UI should use existing GIPA design tokens and the existing shadcn/Radix/Tailwind ecosystem where practical.

---

## 16. Applications UI

Unified admin applications view.

It must support:
- Driver and Warehouse application types
- search by name, email, phone
- filter by type
- filter by status
- filter active/archived
- filter by date where practical
- sort newest/oldest
- sort by recently updated
- server-side pagination, approximately 25 records/page

Do not load the entire application dataset into the browser for filtering.

Applicant detail view should show:
- common applicant information
- type-specific fields
- GDPR consent state/timestamp read-only
- application status
- archive state
- notes
- CV access
- meaningful audit history according to role

Applicant PII should not be editable in Level 1.

Do not expose applicant IP addresses to STAFF.

---

## 17. Dashboard

Operational dashboard only.

Include:
- total active applications
- new applications
- under-review applications
- driver applications
- warehouse applications
- requires-attention count (initially NEW)
- recent applications

No advanced charts or analytics in Level 1.

Dashboard queries must be server-side and reasonably indexed.

---

## 18. Contact Administration

Separate from recruitment.

Required:
- list
- search
- detail
- notes
- archive
- restore
- ADMIN-only permanent deletion
- audit

No email composer in Level 1.

---

## 19. Security Threat Model

The implementation must actively defend against:
- authentication bypass
- broken access control
- IDOR / insecure direct object reference
- privilege escalation
- CSRF where applicable
- XSS, including malicious notes
- SQL injection
- unsafe query construction
- brute-force login
- session fixation/hijacking
- insecure cookies
- CV/WorkDrive credential exposure
- unrestricted CV URLs
- application enumeration
- leaking STAFF-only/ADMIN-only data
- race conditions in deletion/archive/status changes
- double-submit mutations
- mass assignment
- unsafe error messages
- secret leakage
- accidental public indexing of admin pages

Use framework/database parameterization and server-side validation.

Do not use `dangerouslySetInnerHTML` for notes or untrusted applicant content.

---

## 20. Privacy

Applicant PII is sensitive business data.

Principles:
- collect/store only what the existing application requires
- do not duplicate applicant PII into admin metadata
- minimize PII in audit logs
- keep GDPR consent and timestamp read-only
- do not expose IP to STAFF
- protect CVs
- use HTTPS in production
- avoid logging CV contents, passwords, tokens, or unnecessary PII

---

## 21. Database Migration Rules

Before modifying production:
- verify current production DB
- verify migration workflow
- take/confirm backup
- test migration on a development/staging database
- inspect generated SQL
- verify rollback/recovery plan

Do not run destructive production migrations automatically.

Never delete or transform existing production application data merely to fit the new architecture.

If production migration assumptions are unknown, stop and report the blocker.

---

## 22. Public-System Regression Rules

The following must remain working:
- public Driver application
- public Warehouse Operative application
- public Contact form
- WorkDrive CV upload
- ZeptoMail internal notification
- applicant acknowledgement emails
- Reply-To applicant email
- `/api/health`

Avoid unnecessary modifications to public views and email templates.

---

## 23. Performance

Prefer server-side:
- filtering
- sorting
- pagination
- authorization
- database querying

Avoid N+1 database queries.

Use indexes for common admin filters and sorting.

Do not fetch full CV files until explicitly requested.

---

## 24. Error Handling

Errors must be:
- safe for users
- useful for server logs
- non-leaky

Never return:
- database credentials
- stack traces to end users
- WorkDrive credentials
- password hashes
- session secrets
- internal implementation details

Mutation failures should provide a clear user-facing outcome and be logged appropriately.

---

## 25. UI/UX Requirements

Admin UI should feel like a professional internal operations dashboard.

Priorities:
- clear hierarchy
- fast scanning
- readable tables
- obvious status badges
- predictable actions
- confirmation for destructive operations
- clear loading states
- empty states
- error states
- responsive layout
- keyboard accessibility
- visible focus states
- proper form labels
- accessible dialogs

Do not over-design Level 1.

---

## 26. Phase Plan

### Phase 0 — Reconnaissance
READ ONLY. No implementation.

Inspect the current repository and compare it to this specification.

Report:
- architecture compatibility
- database/migration state
- authentication options
- WorkDrive behavior
- deployment concerns
- conflicts
- blockers
- exact proposed files to change

Stop for approval.

### Phase 1 — Database Foundation
Implement only database models, migration, relationships, constraints, indexes, and controlled ADMIN seed strategy.

Test database behavior.

Stop for manual verification.

### Phase 2 — Authentication
Implement admin login/session/logout/authz/rate limiting.

Test manually.

Stop for manual verification.

### Phase 3 — Public Submission Synchronization
Modify public submission APIs only as needed so application + admin metadata are transactionally created.

Regression-test public forms.

Stop for manual verification.

### Phase 4 — Admin Backend
Implement secure server-side application/contact operations.

Stop for manual verification.

### Phase 5 — Admin UI
Implement admin shell, dashboard, applications, details, contacts.

Stop for manual verification.

### Phase 6 — CV / WorkDrive
Implement protected CV access and safe deletion handling.

Stop for manual verification.

### Phase 7 — Archive/Delete/Audit Completion
Complete and harden archive, restore, deletion, notes, audit behavior.

Stop for manual verification.

### Phase 8 — Security Hardening
Run focused security review and fix findings.

Do not introduce unnecessary architectural changes.

Stop for final manual verification.

---

## 27. Cursor Operating Rules

1. Read before modifying.
2. Follow this specification as authoritative.
3. Do not implement future Level 2/3 features.
4. Do not redesign the architecture without reporting the reason first.
5. Keep changes incremental and phase-scoped.
6. Do not modify unrelated public functionality.
7. Prefer existing project patterns and dependencies.
8. Avoid unnecessary dependencies.
9. After implementation of each phase, run appropriate automated checks.
10. Report exactly what changed and what was tested.
11. Never claim production readiness solely because a build passes.
12. Never run destructive production operations without explicit human approval.
13. If requirements conflict with the existing codebase, stop and report the conflict.
14. If a migration could be destructive, stop before applying it.
15. Keep security-sensitive operations server-side.
16. Do not expose secrets to the client.
17. Do not duplicate applicant PII into admin metadata.
18. Preserve the existing public application flow unless a narrowly scoped change is required for transactional admin synchronization.

---

## 28. Definition of Done — Level 1

Level 1 is complete only when:

- admin login works securely
- ADMIN and STAFF authorization works
- admin routes are protected
- application/admin metadata relationships are intact
- new applications create both records transactionally
- application search/filter/sort/pagination works
- dashboard works
- applicant details work
- notes work
- statuses work
- archive/restore work
- CV access is protected
- permanent deletion is ADMIN-only and archive-gated
- audit records are created for meaningful actions
- contacts can be managed
- public forms still work
- WorkDrive still works
- ZeptoMail still works
- production build passes
- database migration has been tested safely
- security review findings have been addressed
- manual end-to-end testing has been completed by the project owner

---

## 29. Explicit Non-Goals for Level 1

Do NOT build:
- advanced analytics
- Kanban recruitment board
- interview scheduler
- automated interview workflows
- email composer
- bulk email
- exports
- complex permission builder
- applicant self-service portal
- employee/user-management UI
- advanced recruitment automation
- AI candidate scoring
- advanced reporting
- separate admin application
- separate database

These belong to later levels unless explicitly re-approved.

---

## 30. Final Architecture Principle

Public domain = applicant-submitted/source data.

Admin domain = internal administrative state.

Both live in the same PostgreSQL database.

Existing UUID primary keys identify public records.

Admin metadata tables reference those records through explicit one-to-one foreign keys.

Database constraints protect structural integrity.

Server-side business logic protects authorization and workflow rules.

The system should fail safely, preserve auditability, and avoid unnecessary duplication of personal data.
