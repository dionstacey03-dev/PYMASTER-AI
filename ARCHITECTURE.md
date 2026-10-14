# Architecture

The existing Python standard-library development server remains. It serves explicit packaged asset routes and the preserved greeting API; it never receives or executes learner Python. `/health` returns a simple JSON liveness response. Curriculum and course navigation remain in `static/index.html`; `workspace.js` handles the editor, themes, and drafts.

## Execution boundary

The main page embeds `playground.html` with `sandbox="allow-scripts"` and without `allow-same-origin`. This creates an opaque-origin frame with no access to the parent's DOM or local storage. A CSP restricts the frame's connections to the pinned runtime CDN. It creates a new disposable Web Worker for each run. Pyodide 0.27.7 runs Python as WebAssembly. Parent and frame messages check their source; results are displayed with textContent. Runtime output never awards XP or verifies a project.

Loading has a 60-second deadline; execution has a 5-second deadline. The frame can terminate a worker running an infinite Python loop. Code is limited to 20,000 characters and emitted output to 20,000 characters. input() consumes pre-supplied newline-separated values; it raises EOFError when the queue is exhausted. Live prompt interaction is not available. Interpreter execution timing excludes download/setup time. Files are ephemeral. Browser memory controls apply, but there is no enforceable per-run memory quota; resource exhaustion can still disrupt the tab. Pyodide compatibility differs from native Python. No worker API grants server or application credentials. CDN access remains possible by design, and this runtime is not a general-purpose hardened hostile-code hosting service.

## Persistence

Existing local quiz progress is preserved. Lesson drafts use separate browser-local keys; themes persist separately. Navigation retains drafts. Storage failures are reported, and Save Code downloads a local backup. Accounts, cross-device sync, and server-validated rewards are future stages. Client storage and quizzes are editable and cannot establish trusted achievement credit.

## Delivery

Setuptools includes HTML and JavaScript in the wheel. This server is development-only. Production migration, CSP hardening of the main page, access control, dependency audit, and secure deployment remain required. See IMPLEMENTATION_PLAN.md.

## V3 intelligent-learning module

`learning-core.js` contains a deterministic acyclic prerequisite graph, eight goal target sets, weekly budget allocation, bounded/expiring preference validation and authored comparison content. It is usable from Node tests without the DOM. `learning-ui.js` renders forms and examples through safe text nodes and coordinates existing lesson navigation/editor functions. Both load on demand when Learning tools or progressive hints are first opened. Roadmap options, preferences and hint counts use new versioned local keys; old progress and draft keys remain unchanged. No server learner data, migrations, model calls or public interactions are introduced. The companion is a local preference summary, not a private AI account.
