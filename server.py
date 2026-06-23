"""Konghei 个人网站 · 本地开发服务器（带一键发布）"""
import http.server
import json
import os
import sys

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
CONTENT_JS = os.path.join(ROOT, 'content.js')

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_POST(self):
        if self.path == '/publish':
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length))
            self._update_content(data)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': True, 'count': len(data)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def _update_content(self, posts):
        items = []
        for p in posts:
            items.append('    {\n' +
                         '      id: ' + json.dumps(p.get('id',''), ensure_ascii=False) + ',\n' +
                         '      date: ' + json.dumps(p.get('date','')) + ',\n' +
                         '      title: ' + json.dumps(p.get('title',''), ensure_ascii=False) + ',\n' +
                         '      summary: ' + json.dumps(p.get('summary',''), ensure_ascii=False) + ',\n' +
                         '      tag: ' + json.dumps(p.get('tag',''), ensure_ascii=False) + ',\n' +
                         '      body: ' + json.dumps(p.get('body',''), ensure_ascii=False) + '\n' +
                         '    }')

        with open(CONTENT_JS, 'r', encoding='utf-8') as f:
            content = f.read()

        import re
        pattern = r'(blog:\s*\[)[\s\S]*?(\n\s*\])'
        replacement = r'\1\n' + ',\n'.join(items) + r'\2'
        new_content = re.sub(pattern, replacement, content, count=1)

        with open(CONTENT_JS, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f'[Publish] Updated content.js with {len(posts)} blog posts')

print(f'Server: http://localhost:{PORT}')
print(f'Publish: POST http://localhost:{PORT}/publish')
http.server.HTTPServer(('', PORT), Handler).serve_forever()
