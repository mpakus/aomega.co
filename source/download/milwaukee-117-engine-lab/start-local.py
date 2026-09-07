#!/usr/bin/env python3
"""Serve the engine lab on localhost using only the Python standard library."""
import argparse
import functools
import http.server
import pathlib
import sys
import threading
import webbrowser


class StaticHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'text/javascript; charset=utf-8',
        '.mjs': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.html': 'text/html; charset=utf-8',
    }

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('--port must be between 1 and 65535')
    root = pathlib.Path(__file__).resolve().parent
    handler = functools.partial(StaticHandler, directory=str(root))
    try:
        server = http.server.ThreadingHTTPServer(('127.0.0.1', args.port), handler)
    except OSError as error:
        print(f'Could not start local server: {error}', file=sys.stderr)
        print('Try a different port: python3 start-local.py --port 8080', file=sys.stderr)
        return 1
    url = f'http://127.0.0.1:{args.port}/'
    print(f'Milwaukee-Eight 117 — Engine Lab\nOpen {url}\nPress Ctrl+C to stop.', flush=True)
    if not args.no_browser:
        timer = threading.Timer(0.4, lambda: webbrowser.open(url))
        timer.daemon = True
        timer.start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')
    finally:
        server.server_close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
