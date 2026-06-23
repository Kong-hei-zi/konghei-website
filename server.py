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
NOTES_DIR = os.path.join(ROOT, 'notes')


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
        elif self.path == '/notes-publish':
            length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(length))
            result = self._write_notes(data)
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
        # 读取旧的 index.json，保留已有的图片路径
        old_index = {}
        old_path = os.path.join(PROJECTS_DIR, 'index.json')
        if os.path.exists(old_path):
            try:
                with open(old_path, 'r', encoding='utf-8') as f:
                    for item in json.load(f):
                        old_index[item['id']] = item
            except Exception:
                pass
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
            pid = p.get('id', '')
            old = old_index.get(pid, {})
            img_path = old.get('image', '')
            shot_paths = old.get('screenshots', [])
            # 新图片覆盖旧路径
            if pid in saved_images:
                saved = saved_images[pid]
                if 'thumb.png' in saved:
                    img_path = 'projects/' + pid + '/thumb.png'
                new_shots = ['projects/' + pid + '/' + f for f in saved if f.startswith('shot-')]
                if new_shots:
                    shot_paths = new_shots
            # 检查磁盘上是否已有图片文件（兜底）
            if not img_path:
                thumb_file = os.path.join(PROJECTS_DIR, pid, 'thumb.png')
                if os.path.exists(thumb_file):
                    img_path = 'projects/' + pid + '/thumb.png'
            if not shot_paths:
                proj_dir = os.path.join(PROJECTS_DIR, pid)
                if os.path.isdir(proj_dir):
                    existing = sorted([f for f in os.listdir(proj_dir) if f.startswith('shot-')])
                    if existing:
                        shot_paths = ['projects/' + pid + '/' + f for f in existing]
            index.append({
                'id': pid,
                'icon': p.get('icon', ''),
                'title': p.get('title', ''),
                'summary': p.get('summary', ''),
                'tag': p.get('tag', ''),
                'image': img_path,
                'screenshots': shot_paths,
                'demo': p.get('demo', ''),
                'github': p.get('github', ''),
                'body': p.get('body', '')
            })
        with open(os.path.join(PROJECTS_DIR, 'index.json'), 'w', encoding='utf-8') as f:
            json.dump(index, f, ensure_ascii=False, indent=2)
        print(f'[Portfolio] Updated index.json with {len(projects)} projects')
        return {'ok': True, 'count': len(projects), 'images_saved': saved_images}

    def _write_notes(self, data):
        notes = data.get('notes', [])
        del_ids = set(data.get('deleted', []))
        os.makedirs(NOTES_DIR, exist_ok=True)
        keep_ids = {n['id'] for n in notes}
        for fname in os.listdir(NOTES_DIR):
            nid = fname[:-3] if fname.endswith('.md') else None
            if nid and (nid in del_ids or (nid not in keep_ids)):
                os.remove(os.path.join(NOTES_DIR, fname))
                print(f'[Notes] Removed {fname}')
        # Also remove deleted entries from index
        notes = [n for n in notes if n['id'] not in del_ids]
        for n in notes:
            fpath = os.path.join(NOTES_DIR, n['id'] + '.md')
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(n.get('body', ''))
            print(f'[Notes] Wrote {n["id"]}.md')
        index = []
        for n in notes:
            index.append({
                'id': n.get('id', ''),
                'date': n.get('date', ''),
                'title': n.get('title', ''),
                'summary': n.get('summary', ''),
                'category': n.get('category', ''),
                'tags': n.get('tags', [])
            })
        with open(os.path.join(NOTES_DIR, 'index.json'), 'w', encoding='utf-8') as f:
            json.dump(index, f, ensure_ascii=False, indent=2)
        print(f'[Notes] Updated index.json with {len(notes)} notes')
        return {'ok': True, 'count': len(notes)}


print(f'Server: http://localhost:{PORT}')
print(f'Publish: POST http://localhost:{PORT}/publish')
http.server.HTTPServer(('', PORT), Handler).serve_forever()
