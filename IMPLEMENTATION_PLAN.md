# Implementation plan and audit

## Existing architecture
Python 3.12+, setuptools, no runtime package dependencies. A standard-library HTTP development server serves one HTML file containing a 30-lesson curriculum and JavaScript UI. Four unittest tests validate the CLI and all lesson example outputs. Existing browser checks cover quizzes, progress, import/export, completion, and mobile layouts.

## Original baseline findings (before milestone 1)
- No accounts, database, real AI, runtime, validated XP, assessments, or PDF certificates.
- Quiz answers are client-side and progress imports are editable. Completion is a personal learning record, not verified credit.
- Curriculum has no introductory Level 0 and does not cover every requested specialization.
- Most lessons have only one multiple-choice question. Final project code is not graded.
- HTML combines content, behavior, and styles; asset delivery needs explicit routes.
- No production server, service worker, CI, lint configuration, or type-check configuration.
- Local browser storage can fail; code drafts need explicit failure messages.
- Existing glass UI is dark-only. Mobile sidebar is long; responsive regression checks are required.

## Stages
1. **Interactive learning workspace:** sandboxed browser Python execution; output/error handling, stop/timeouts, code persistence, downloads, editor usability, themes, HTTP tests, browser regression checks, and honest runtime limitations.
2. **Curriculum and projects:** Level 0, complete requested topic mapping, lesson objectives/common mistakes/completion criteria, varied exercises, guided projects, progressive assessments. Retain all existing lessons.
3. **Accounts and validated progress:** established backend authentication, recovery provider, SQLite/PostgreSQL migrations, owner-scoped storage, server-validated quizzes and idempotent rewards, activity and streaks, profile sync. Requires mail-provider configuration for recovery.
4. **AI tutoring:** server-side provider adapter, validation, quotas, rate limits, timeouts, lesson context, explicit unconfigured state. Provider credentials must be supplied securely.
5. **Assessments and certificates:** verified assessments, course-specific PDF certificates and identifiers, verification endpoint; no accreditation claims.
6. **Production delivery:** PWA/offline lesson cache, secure updates, accessibility audit, performance measurement, CI, supported backend hosting, production build and security checks. Deployment requires approval.

Each stage must be tested and reported. No GitHub push or deployment without approval. Completing stage 1 does not establish production readiness.

## Ultimate upgrade request: persistent phase checklist

The expanded request retains the milestone boundary. Existing unpushed work is preserved, not reset. Source backup: `/workspace/backups/pymaster-before-ultimate-upgrade.tar.gz`. No database exists yet; no migrations have been run. Browser data lives on learners' devices and is not accessible to this source backup. Use progress export and code downloads for those backups.

| Phase | Status | Dependency / acceptance gate |
|---|---|---|
| 0 Audit | Complete for current repository | Baseline eight tests and packaging; all 30 lessons retained |
| 1 Premium UI | In progress, milestone 1 | Themes, mobile navigation and requested viewport checks; full WCAG audit remains |
| 2 Curriculum | Planned | Preserve lesson IDs; six requested levels and substantive content review |
| 3 Playground | In progress, milestone 1 | Real browser interpreter, input, timeouts, isolation and persistence tests |
| 4 AI tutor | Planned | Authenticated provider proxy, secure credentials, quota controls |
| 5 Adaptive learning | Planned | Genuine attempts and mastery events; explainable opt-out recommendations |
| 6 Debugging assistant | Planned | Interpreter findings distinct from optional provider suggestions |
| 7 Visualizer | Planned | Bounded real execution traces and supported-construct tests |
| 8 Voice tutor | Planned | AI service and explicit microphone permission; text fallback |
| 9 Gamification | Planned | Server-validated activities and idempotent rewards after account foundation |
| 10 Coding arena | Planned | Isolated evaluator, hidden tests, deterministic scores |
| 11 Revision | Planned | Real learner attempts and opt-out scheduling |
| 12 Error encyclopedia | Planned | Reproducible incorrect/correct examples and lesson links |
| 13 Interviewer | Planned | Explicit rubrics, provider setup, saved sessions |
| 14 GitHub integration | Planned | OAuth registration, minimum scopes, explicit export confirmation |
| 15 Project generator | Planned | Guided project library first; configured AI suggestions later |
| 16 Collaboration | Planned | Authenticated rooms, ownership, synchronization and access tests |
| 17 Code quality | Planned | Deterministic lint findings separate from AI feedback |
| 18 Analytics | Planned | Real event storage; no invented activity or streaks |
| 19 Languages | Planned | English/Sinhala/Tamil UI plus reviewed content, honest fallback |
| 20 Offline PWA | Planned | Versioned cache, updates, runtime compatibility, offline boundaries |
| 21 Portfolio | Planned | Owner-scoped projects; opt-in public sharing |
| 22 Assessments | Planned | Verified rubric and isolated practical tests |
| 23 Certificates | Planned | Verified assessments, PDF issuance, stable ID and verification |
| 24 Accounts/database | Planned; foundational backend milestone | Secure auth/recovery and transactional additive migrations |
| 25 Mobile experience | Partial in milestone 1 | Width emulation; physical device testing remains |
| 26 Security/performance | Ongoing | Measure loading/rendering; audit each introduced boundary |
| 27 Automated tests | Ongoing | Extend each feature's success/failure checks |
| 28 Bug hunt | Ongoing | Review each stage; preserve known limitations |
| 29 Deployment | Planned | Hosting and credentials decisions; explicit user approval |
| 30 Final verification | Not complete | All required implemented flows and production gates |

### Data preservation and migrations

Do not overwrite local progress/draft keys or renumber the 30 existing lesson positions. New content needs stable IDs and an explicit legacy-key migration. Introduce database tables with numbered, transactional migrations; back up before schema changes and test restore on a separate copy. Do not silently import editable browser progress as verified XP or assessment credit. Recovery, OAuth and AI credentials must be provided securely when those milestones need them.

### Milestone 1 extension

Implement system theme selection, safe-area mobile bottom navigation, queued stdin input, interpreter execution timing, starter templates, keyboard shortcuts, loading indicator, and requested-width regression checks. This milestone does not claim the remaining 30-phase platform is complete.

## Milestone 1 outcome

Implemented and verified: real sandboxed Pyodide execution; syntax highlighting and editor controls; queued input; interpreter timing; timeout/output caps; source isolation; saved lesson drafts; dark/light/system themes; mobile bottom navigation; safe areas; actual-progress ring; loading state; starter templates and keyboard shortcuts. All existing 30 lessons and their client-side completion behavior remain intact. Stage 1 is a bounded UI/playground milestone, not completion of phases 1 and 3 in every requested production detail. No new Python dependencies or database schema changes; Pyodide 0.27.7 is an external browser runtime. No GitHub push or deployment was performed. Next milestone: expand curriculum with Level 0 and stable content IDs, objectives/common mistakes/completion criteria, and substantive guided projects.

## V3 request: milestone order and dependency map

The latest request adds features 31–50 and specifies a new order. Earlier milestones remain preserved. Current source backup: `/workspace/backups/pymaster-before-v3-intelligent-learning.tar.gz`.

- [x] V3 Milestone 0: audit actual local app; baseline eight Python tests and wheel build passed. Existing stack is Python stdlib + vanilla HTML/JS, with sandboxed Pyodide, no database/authentication/provider.
- [x] V3 Milestone 1 deterministic foundation: prerequisite-aware roadmaps, opt-in local preferences, five-level authored hints, eight comparisons, lazy feature loading, local persistence and failure handling. See FEATURE_STATUS.md for boundaries.
- [ ] V3 Milestone 1 AI/account extension: authenticated private companion memory, secure provider integration, specialist content and actual assessments. Do not claim local-device preferences establish cross-user isolation.
- [ ] V3 Milestone 2 (33/34/35/40): code partner, validated debugging missions, structured notebooks and bounded multifile projects. Share the existing sandbox runtime rather than introducing main-server execution.
- [ ] V3 Milestone 3 (31/37/38/44): real bounded trace capture, static AST flowcharts, replay and known-algorithm measurement; load visual renderers on demand.
- [ ] V3 Milestone 4 (36/42/45): authoritative exams, official documentation explorer and optional focus sessions.
- [ ] V3 Milestone 5 (46/47/48/49): community, instructor roles, versioned authoring and moderated challenge library. Requires accounts, RBAC and moderation before public access.
- [ ] V3 Milestone 6 (50): capstone lifecycle, project versions, rubrics and authorized exports.
- [ ] V3 Milestone 7: cross-feature tests, production backend/database migrations, mobile/accessibility/performance audits, hosting and deployment preparation. Deployment and pushes require approval.

No microservices are justified by the present app. Extend the existing static UI and add typed, versioned backend contracts only as authenticated features are introduced. Tests must validate success and failure flows at every milestone. Future database introduction uses numbered transactional migrations and separate restore tests; no current learner-key reset or silent import into verified rewards.

## Publication request

The user authorized pushing the tested local milestones and deploying to Vercel. Added static export, Vercel security headers and the preserved serverless greeting endpoint. Twelve Python tests and exported-site learning/workspace browser checks passed. Vercel CLI authentication is absent and the current proxy rejects api.vercel.com with HTTP 403. The secure VERCEL_TOKEN requirement/domain addition is saved in the environment draft; configuration persistence does not apply it to this running environment. No remote deployment is claimed.
