"""Browser interface for the Python learning platform."""

import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from importlib.resources import files
from urllib.parse import parse_qs, urlsplit


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlsplit(self.path)
        if url.path == "/":
            body = files("pymaster_ai").joinpath("static/index.html").read_bytes()
            content_type = "text/html; charset=utf-8"
        elif url.path in {"/workspace.js", "/playground-frame.js", "/playground.html", "/learning-core.js", "/learning-ui.js"}:
            body = files("pymaster_ai").joinpath("static", url.path[1:]).read_bytes()
            content_type = "text/html; charset=utf-8" if url.path.endswith(".html") else "text/javascript; charset=utf-8"
        elif url.path == "/health":
            body = b'{"status":"ok"}'
            content_type = "application/json; charset=utf-8"
        elif url.path == "/api/greet":
            name = parse_qs(url.query).get("name", ["world"])[0].strip() or "world"
            if len(name) > 200:
                self.send_error(400, "Name must be 200 characters or fewer")
                return
            body = json.dumps({"message": f"Hello, {name}! Welcome to PYMASTER-AI."}).encode()
            content_type = "application/json; charset=utf-8"
        else:
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Cache-Control", "no-store")
        if url.path == "/playground.html":
            self.send_header("Content-Security-Policy", "default-src 'none'; script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net; worker-src blob:; connect-src https://cdn.jsdelivr.net; frame-ancestors 'self'; base-uri 'none'; form-action 'none'")
        self.end_headers()
        self.wfile.write(body)


def main():
    parser = argparse.ArgumentParser(description="Run the PYMASTER-AI browser interface")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"PYMASTER-AI UI listening on {args.host}:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
