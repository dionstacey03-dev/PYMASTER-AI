# V3 feature status

This is a local development milestone, not a released V3 platform. All 30 original lessons, progress keys, and code-draft keys are preserved. The latest user request authorizes GitHub push and Vercel deployment. Remote Vercel publication remains pending hosting authentication/network access.

| Feature | Actual status | Remaining dependency or limitation |
|---|---|---|
| 31 3D learning lab | Not implemented | Bounded real trace service first; optional lazy 3D library and accessible 2D renderer |
| 32 Learning path architect | Deterministic baseline implemented | Eight goals, prerequisite graph, weekly allocation, editable/regenerated saved options, export and actual local completion; specialized curriculum and verified milestone exams still pending |
| 33 AI pair programmer | Not implemented | Authenticated backend/provider adapter, quota controls and secure credentials |
| 34 Debugging missions | Not implemented | Mission content, isolated test validation and server-authoritative idempotent rewards |
| 35 Notebook | Not implemented | Structured document persistence, safe Markdown renderer and version recovery |
| 36 Exam simulator | Not implemented | Authenticated attempt storage, hidden grading and authoritative timers |
| 37 Flowcharts | Not implemented | Nonexecuting bounded AST parser and renderer |
| 38 Time machine | Not implemented | Bounded recorded interpreter traces; no reversible-execution claims |
| 39 Learning companion | Local preferences/summary implemented; AI companion unavailable | Opt-in/edit/delete/expiry on this device, visible memory and no remote sharing. User-isolated server memory requires authentication and a configured provider |
| 40 Project sandbox | Not implemented | Multi-file document model, bounded runtime filesystem and export/versioning |
| 41 Hint engine | Authored lesson hints implemented | Five progressive levels, usage counts and guidance after repeated actual quiz misses; no graded-credit changes and no AI/code-error diagnosis |
| 42 Documentation explorer | Not implemented | Versioned official-reference index and attribution |
| 43 Concept comparison | Eight comparisons implemented | Verified executable illustrative examples; thread/process and Flask/FastAPI cards explicitly use sequential/data-response models, not real OS/framework execution |
| 44 Complexity analyzer | Not implemented | Instrumented known algorithms; no heuristic complexity guarantees |
| 45 Focus mode | Not implemented | Accessible opt-in timer/session storage |
| 46 Community Q&A | Not implemented | Authenticated storage, authorization, moderation/reporting, rate limits |
| 47 Instructor tools | Not implemented | Server-enforced roles/enrollment/audit logging |
| 48 Course builder | Not implemented | Versioned content storage, role controls and stable progress migration |
| 49 Challenge marketplace | Not implemented | Moderation and hidden-test sandbox evaluator |
| 50 Capstone studio | Not implemented | Project/milestone/rubric data model and secure integration; existing task-tracker lesson remains available |

## AI and deployment blockers

There is no authenticated backend, provider adapter or AI credential binding. No live AI request is attempted and no authored message is presented as model output. Implement the backend boundary before requesting provider credentials through secure environment settings. Shared-browser storage is not a private user account. Do not enable public community, instructor, collaborative or graded workflows without their corresponding authorization/evaluation infrastructure.

The standard-library web server remains development-only. No PWA/offline-runtime guarantee, physical-device compatibility certification, WCAG certification, or production readiness is claimed.
