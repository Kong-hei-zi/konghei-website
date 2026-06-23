"""Konghei 个人网站 · 本地开发服务器（发布到 /posts/ 目录）"""
import http.server
import json
import os
import re

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
POSTS_DIR = os.path.join(ROOT, 'posts')


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_POST(self):
        if self.path == '/publish':
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length))
            self._write_posts(data)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': True, 'count': len(data)}, ensure_ascii=False).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def _write_posts(self, posts):
        os.makedirs(POSTS_DIR, exist_ok=True)
        keep_ids = {p['id'] for p in posts}
        for fname in os.listdir(POSTS_DIR):
            if fname.endswith('.md') and fname[:-3] not in keep_ids:
                os.remove(os.path.join(POSTS_DIR, fname))
                print(f'[Publish] Removed {fname}')
        for p in posts:
            fpath = os.path.join(POSTS_DIR, p['id'] + '.md')
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(p.get('body', ''))
            print(f'[Publish] Wrote {p["id"]}.md')
        index = []
        for p in posts:
            index.append({
                'id': p.get('id', ''),
                'date': p.get('date', ''),
                'title': p.get('title', ''),
                'summary': p.get('summary', ''),
                'tag': p.get('tag', '')
            })
        with open(os.path.join(POSTS_DIR, 'index.json'), 'w', encoding='utf-8') as f:
            json.dump(index, f, ensure_ascii=False, indent=2)
        print(f'[Publish] Updated index.json with {len(posts)} posts')


print(f'Server: http://localhost:{PORT}')
print(f'Publish: POST http://localhost:{PORT}/publish')
http.server.HTTPServer(('', PORT), Handler).serve_forever()
