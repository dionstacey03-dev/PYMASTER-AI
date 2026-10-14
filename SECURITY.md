# Security boundaries and known limitations

## Implemented boundaries

- Learner Python runs in an opaque-origin sandboxed frame and disposable browser worker, never in the application server.
- CSP limits runtime connections to its CDN. Parent/frame source checks constrain communication; actual tests cover denied local storage access and blocked app-endpoint fetches.
- Code, input, output and time limits are enforced. A strict memory quota is unavailable, so a hostile program may still disrupt its browser tab.
- Roadmaps and comparisons do not execute code automatically. Comparison examples require explicit draft-replacement confirmation, then manual Run Code.
- Preferences, user text, output and imported values are rendered with textContent. Syntax highlighting escapes HTML before adding fixed span classes.
- Companion preference storage requires explicit opt-in. Values are bounded, visible, editable, deletable and expire after 7/30/90 days. They are not sent to a provider.
- Code/data keys for original lessons are unchanged. Tests verify memory deletion does not remove progress or drafts.
- Static assets are served via explicit routes; traversal and private-file paths return 404.

## Not implemented yet

Authentication, per-user server authorization, CSRF/session controls, trusted assessment grading, rate-limited AI APIs, hidden challenge tests, instructor roles, moderated public content, and private cloud storage. Local preferences are device-local and visible to anyone using that browser profile; they are not an authenticated vault. Do not use client quiz data as verified credit or expose private server services behind this development server.

The main page still contains inline code/styles and needs a production CSP/asset review. No third-party Python runtime package dependencies are installed; pinned Pyodide is downloaded from a CDN. TLS checks are never disabled. Cloud Chromium does not trust the injected proxy CA, so direct CDN execution in that machine is blocked; runtime tests use a TLS-verifying system-client relay. This is a test method, not a production proxy route.

No API key, OAuth token, AI conversation, audio, or private environment variable is embedded in the UI. Secrets must be introduced securely only when backend/provider integrations exist. AI content and user uploads must remain untrusted when those features are added. There has been no external penetration test or full dependency/security audit; no perfect-security claim is made.
