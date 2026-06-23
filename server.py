"""Konghei 个人网站 · 本地开发服务器（发布到 /posts/ 和 /projects/ 目录）"""
import http.server
import json
import os
import re
import base64

PORT = 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
POSTS_DIR = os.path.join(ROOT, 'posts')
PROJECTS_DIR = os.path.join(ROOT, 'projects')


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
        elif self.path == '/portfolio-publish':
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length))
            result = self._write_portfolio(data)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
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

    def _write_portfolio(self, data):
        projects = data.get('projects', [])
        images = data.get('images', {})
        os.makedirs(PROJECTS_DIR, exist_ok=True)
        saved_images = {}
        for pid, img_data in images.items():
            proj_dir = os.path.join(PROJECTS_DIR, pid)
            os.makedirs(proj_dir, exist_ok=True)
            saved = []
            if img_data.get('thumb'):
                b64 = re.sub(r'^data:image/\w+;base64,', '', img_data['thumb'])
                fpath = os.path.join(proj_dir, 'thumb.png')
                with open(fpath, 'wb') as f:
                    f.write(base64.b64decode(b64))
                saved.append('thumb.png')
                print(f'[Portfolio] Saved {pid}/thumb.png')
            for i, shot in enumerate(img_data.get('screenshots', [])):
                b64 = re.sub(r'^data:image/\w+;base64,', '', shot)
                fname = f'shot-{i+1}.png'
                fpath = os.path.join(proj_dir, fname)
                with open(fpath, 'wb') as f:
                    f.write(base64.b64decode(b64))
                saved.append(fname)
                print(f'[Portfolio] Saved {pid}/{fname}')
            saved_images[pid] = saved
        index = []
        for p in projects:
            index.append({
                'id': p.get('id', ''),
                'icon': p.get('icon', ''),
                'title': p.get('title', ''),
                'summary': p.get('summary', ''),
                'tag': p.get('tag', ''),
                'image': p.get('image', ''),
                'screenshots': p.get('screenshots', []),
                'demo': p.get('demo', ''),
                'github': p.get('github', ''),
                'body': p.get('body', '')
            })
        with open(os.path.join(PROJECTS_DIR, 'index.json'), 'w', encoding='utf-8') as f:
            json.dump(index, f, ensure_ascii=False, indent=2)
        print(f'[Portfolio] Updated index.json with {len(projects)} projects')
        return {'ok': True, 'count': len(projects), 'images_saved': saved_images}


print(f'Server: http://localhost:{PORT}')
print(f'Publish: POST http://localhost:{PORT}/publish')
http.server.HTTPServer(('', PORT), Handler).serve_forever()
