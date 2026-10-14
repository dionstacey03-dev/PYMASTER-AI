# Testing

Run Python tests from the repository root:

```bash
.venv/bin/python -m unittest discover -s tests -v
```

There are eight tests: CLI behavior, execution/output validation of all 30 curriculum examples, asset/health routes, greeting compatibility, runtime security policy, and missing/traversal paths.

## Browser workspace suite

Install Playwright as a development-only tool in a separate directory and install its Chromium browser. For example:

```bash
npm install --prefix /tmp/pymaster-browser-tools playwright
/tmp/pymaster-browser-tools/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/pymaster-browser-tools/node_modules node tests/browser/workspace.cjs
```

Start the app beforehand. `TEST_BASE_URL` optionally overrides http://127.0.0.1:8000. `CHROMIUM_PATH` selects an existing browser executable. Browser tests use actual Pyodide code execution, not mock execution responses. They test normal output, syntax/runtime errors, timeout, output caps, storage isolation, blocked app fetch, saved drafts, theme persistence, keyboard editor behavior, downloads, mobile/tablet/desktop widths, and CDN failures.

In cloud environments where Chromium does not trust an injected proxy certificate but the system HTTPS client does, `RUNTIME_TLS_RELAY=1` downloads the real pinned assets with TLS-verifying curl and provides them to the browser test. This mode does not change trust stores or disable TLS checks; it verifies the runtime, not direct Chromium-to-CDN networking. Direct CDN access must be verified separately on the target deployment network.

No lint or type-check tools are configured. Use `git diff --check`, `node --check` on JavaScript assets, and a wheel build. Device emulation does not establish testing on physical iPhones/Android phones or Safari. Keyboard and layout checks are targeted checks, not a full WCAG 2.2 audit.

## Milestone 1 validation results

- Eight Python tests passed, including all 30 runnable examples.
- `tests/browser/course.cjs` passed all 30 quizzes, navigation, search/filter, completion, import/export, invalid-file handling, and responsive layout checks against the updated app.
- `tests/browser/workspace.cjs` passed actual execution and failure/isolation tests using the TLS-verifying cloud runtime relay. Direct Chromium CDN access in this machine remains blocked by the proxy CA trust mismatch.
- JavaScript syntax checks and `git diff --check` passed.
- A wheel built successfully and contains every HTML/JavaScript asset. Packaging success does not establish production deployment readiness.

Run the course regression suite with `node tests/browser/course.cjs` against a live server.

## Ultimate-request milestone extension

The workspace suite now tests input()/EOF, interpreter timing, system-theme changes, starter templates, keyboard shortcuts and mobile navigation. `node tests/browser/layout.cjs` checks both dark and light dashboard/lesson layouts at 320, 375, 390, 430, 768, 1024 and 1440 pixels, labeled editor/input controls, a labeled actual-progress ring, and reduced-motion behavior. These are targeted accessibility checks, not a WCAG certification. All three browser suites are run against a live application.

## V3 intelligent-learning tests

Run `node --test tests/js/learning-core.test.cjs` for seven core tests covering all goal prerequisite paths, budget allocations (including split lessons), invalid/cyclic input, local completion handling, deadline estimates, consent/retention and comparison metadata. Python tests now number nine and include execution of all 16 comparison examples alongside the original 30 lesson examples. Run `node tests/browser/learning.cjs` against a live server for lazy loading, roadmap export/restore, preference consent/edit/delete/expiry, safe text rendering, preservation of old data, eight comparison checks, hint progression/attempt guidance, load failure/retry, and seven-width dark/light layouts. Existing course/workspace/layout suites remain required regression checks.

### V3 milestone results

Nine Python tests and seven JavaScript core tests passed. All four browser suites (course, workspace, layout, learning) passed against the updated live application. Python tests executed 46 educational examples (30 original plus 16 comparison examples). Final wheel build and asset verification passed. No lint/type-check configuration is supplied in the existing project; syntax and whitespace checks are separate from lint/type analysis.

The new intelligent-learning scripts are not requested on initial dashboard load. A single local Chromium observation recorded 68,312 encoded HTML bytes and 732 ms to DOMContentLoaded; this is a smoke measurement under cloud test load, not a mobile-network benchmark or deployment guarantee. The browser learning suite checks an initial HTML budget of 100 KiB and lazy module delivery.

## Deployment packaging checks

Twelve Python tests passed including static asset export, serverless handler reuse and Vercel runtime security policy. The learning and actual-Python workspace browser suites passed against the exported assets with equivalent configured headers. A remote Vercel build/deployment remains unrun because hosting authentication and API egress are unavailable.
