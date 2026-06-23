(function () {
  var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var AUTH_KEY = 'konghei_notes_auth';
  var DRAFT_KEY = 'konghei_notes_draft';
  var DEL_KEY = 'konghei_notes_del';
  var PWD = 'konghei2026';
  var authed = sessionStorage.getItem(AUTH_KEY) === '1';
  var deleted = [];
  var delMode = false;
  var btnDelMode = document.getElementById('bs-btn-del-mode');
  var shelvesEl = document.getElementById('bs-shelves');
  var emptyEl = document.getElementById('notes-empty');
  var searchInput = document.getElementById('notes-search');
  var searchClear = document.getElementById('search-clear');
  var catsEl = document.getElementById('bs-cats');
  var btnAdd = document.getElementById('bs-btn-add');
  var overlay = document.getElementById('note-overlay');
  var panelBody = document.getElementById('note-panel-body');
  var panelFolder = document.getElementById('note-panel-folder');
  var panelClose = document.getElementById('note-panel-close');
  var edOverlay = document.getElementById('bs-editor-overlay');
  var edTitle = document.getElementById('ed-title');
  var edCat = document.getElementById('ed-cat');
  var edDate = document.getElementById('ed-date');
  var edTags = document.getElementById('ed-tags');
  var edSummary = document.getElementById('ed-summary');
  var edBody = document.getElementById('ed-body');
  var edFile = document.getElementById('ed-file');
  var edStatus = document.getElementById('ed-status');
  var edUploadHint = document.getElementById('bs-upload-hint');
  var authOverlay = document.getElementById('bs-auth-overlay');
  var authPwd = document.getElementById('bs-auth-pwd');
  var authErr = document.getElementById('bs-auth-err');
  var notes = [];
  var drafts = [];
  var currentCat = 'ALL';
  var editingId = null;
  var CAT_COLORS = {
    '编程': ['#a78bfa', '#7c3aed', '#8b5cf6', '#6d28d9', '#9f7aea'],
    '金融': ['#fbbf24', '#f59e0b', '#d97706', '#eab308', '#facc15'],
    '工具': ['#22d3ee', '#06b6d4', '#0891b2', '#67e8f9', '#0ea5e9'],
    '其他': ['#e879f9', '#c026d3', '#a855f7', '#d946ef', '#c084fc']
  };
  function setStatus(msg, cls) { edStatus.textContent = msg; edStatus.className = cls || ''; }
  function parseTags(t) {
    if (Array.isArray(t)) return t;
    if (typeof t === 'string') return t.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    return [];
  }
  function askAuth() {
    authOverlay.style.display = 'flex'; authPwd.value = ''; authErr.textContent = ''; authPwd.focus();
  }
  document.getElementById('bs-auth-go').onclick = function () {
    if (authPwd.value === PWD) {
      sessionStorage.setItem(AUTH_KEY, '1'); authed = true;
      authOverlay.style.display = 'none'; btnAdd.style.display = 'inline-block'; loadDrafts();
    } else { authErr.textContent = '密码错误！'; }
  };
  authPwd.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('bs-auth-go').click(); });
  authOverlay.onclick = function (e) { if (e.target === authOverlay) authOverlay.style.display = 'none'; };
  function ensureAuth(cb) {
    if (authed) { cb(); return; }
    askAuth();
    var t = setInterval(function () { if (authed) { clearInterval(t); cb(); } }, 200);
  }
  function loadDrafts() { try { drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'); } catch (e) { drafts = []; } }
  function saveDrafts() { localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts)); }
  function loadDeleted() { try { deleted = JSON.parse(localStorage.getItem(DEL_KEY) || '[]'); } catch (e) { deleted = []; } }
  function saveDeleted() { localStorage.setItem(DEL_KEY, JSON.stringify(deleted)); }

  function deleteNote(note) {
    if (!confirm('确定要删除「' + note.title + '」吗？')) return;
    if (note._draft) {
      drafts = drafts.filter(function (d) { return d.id !== note.id; });
      saveDrafts();
    } else {
      if (deleted.indexOf(note.id) === -1) deleted.push(note.id);
      saveDeleted();
    }
    buildShelves();
  }
  function getBooksByCategory() {
    var map = {}, order = [];
    notes.forEach(function (n) {
      var cat = n.category || '其他';
      if (!map[cat]) { map[cat] = []; order.push(cat); }
      map[cat].push(n);
    });
    drafts.forEach(function (d) {
      var cat = d.category || '其他';
      if (!map[cat]) { map[cat] = []; order.push(cat); }
      map[cat].push(d);
    });
    return { map: map, order: order };
  }
  function buildShelves() {
    shelvesEl.innerHTML = '';
    var g = getBooksByCategory();
    catsEl.innerHTML = '<span class="bs-cat active" data-cat="ALL">ALL</span>';
    g.order.forEach(function (cat) {
      var sp = document.createElement('span'); sp.className = 'bs-cat';
      sp.setAttribute('data-cat', cat); sp.textContent = cat;
      sp.onclick = function () { filterCat(cat); };
      catsEl.appendChild(sp);
    });
    if (g.order.length === 0) { emptyEl.style.display = 'flex'; return; }
    emptyEl.style.display = 'none';
    g.order.forEach(function (cat) {
      var books = g.map[cat];
      if (currentCat !== 'ALL' && cat !== currentCat) return;
      var shelf = document.createElement('div'); shelf.className = 'bs-shelf'; shelf.setAttribute('data-cat', cat);
      var label = document.createElement('div'); label.className = 'bs-shelf-label'; label.textContent = cat;
      shelf.appendChild(label);
      var row = document.createElement('div'); row.className = 'bs-books';
      books.forEach(function (n, i) { row.appendChild(buildBook(n, cat, i)); });
      shelf.appendChild(row);
      shelvesEl.appendChild(shelf);
    });
  }
  function buildBook(n, cat, idx) {
    var colors = CAT_COLORS[cat] || CAT_COLORS['其他'];
    var color = colors[idx % colors.length];
    var len = (n.title || '').length;
    var h = 130 + (len % 7) * 8;
    var w = 32 + (len % 5) * 3;
    var book = document.createElement('div');
    book.className = 'bs-book' + (n._draft ? ' is-draft' : '');
    book.setAttribute('data-id', n.id || '');
    book.setAttribute('data-title', (n.title || '').toLowerCase());
    book.setAttribute('data-tags', parseTags(n.tags).join(' ').toLowerCase());
    book.setAttribute('data-summary', (n.summary || '').toLowerCase());
    book.setAttribute('data-cat', cat.toLowerCase());
    book.style.height = h + 'px'; book.style.width = w + 'px';
    book.style.setProperty('--book-color', color);
    book.style.animationDelay = (idx * 0.06) + 's';
    var spine = document.createElement('div'); spine.className = 'bs-spine';
    spine.style.background = 'linear-gradient(180deg, ' + color + ', ' + color + 'cc, ' + color + 'ee)';
    var titleEl = document.createElement('span'); titleEl.className = 'bs-book-title';
    titleEl.textContent = n.title || 'Untitled';
    spine.appendChild(titleEl);
    if (n._draft) { var bdg = document.createElement('span'); bdg.className = 'bs-book-badge'; bdg.textContent = 'D'; spine.appendChild(bdg); }
    book.appendChild(spine);
    book.onclick = function () { openDetail(n); };
    if (isLocal) {
      var delBtn = document.createElement('span');
      delBtn.className = 'bs-book-del';
      delBtn.textContent = '✕';
      delBtn.onclick = function (e) { e.stopPropagation(); deleteNote(n); };
      book.appendChild(delBtn);
      if (delMode) delBtn.classList.add('show');
    }
    return book;
  }
  function filterCat(cat) {
    currentCat = cat;
    document.querySelectorAll('.bs-cat').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-cat') === cat);
    });
    buildShelves();
  }
  function openDetail(note) {
    panelFolder.textContent = (note.category || '其他') + ' / ' + note.title;
    if (note.body || note.content) {
      panelBody.innerHTML = marked.parse(note.body || note.content || '');
      overlay.classList.add('show'); document.body.style.overflow = 'hidden';
    } else {
      panelBody.innerHTML = '<p style="text-align:center;color:var(--text-dim)">加载中...</p>';
      overlay.classList.add('show'); document.body.style.overflow = 'hidden';
      fetch('notes/' + note.id + '.md')
        .then(function (r) { return r.text(); })
        .then(function (md) { panelBody.innerHTML = marked.parse(md); })
        .catch(function () { panelBody.innerHTML = '<p style="text-align:center;color:#f87171">加载失败</p>'; });
    }
  }
  function closeDetail() { overlay.classList.remove('show'); document.body.style.overflow = ''; }
  panelClose.onclick = closeDetail;
  overlay.onclick = function (e) { if (e.target === overlay) closeDetail(); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDetail(); });
  searchInput.addEventListener('input', function () {
    var q = searchInput.value.trim().toLowerCase();
    searchClear.style.display = q ? 'block' : 'none';
    document.querySelectorAll('.bs-book').forEach(function (b) {
      var t = b.getAttribute('data-title'), tg = b.getAttribute('data-tags'), s = b.getAttribute('data-summary');
      b.style.display = (!q || t.indexOf(q) !== -1 || tg.indexOf(q) !== -1 || s.indexOf(q) !== -1) ? '' : 'none';
    });
    var total = 0;
    document.querySelectorAll('.bs-shelf').forEach(function (sh) {
      var vis = sh.querySelectorAll('.bs-book:not([style*="display: none"])').length;
      sh.style.display = (vis === 0 && q) ? 'none' : '';
      total += vis;
    });
    emptyEl.style.display = (q && total === 0) ? 'flex' : 'none';
  });
  searchClear.addEventListener('click', function () {
    searchInput.value = ''; searchInput.dispatchEvent(new Event('input')); searchInput.focus();
  });
  function openEditor(note) {
    editingId = note ? note.id : null;
    edTitle.value = note ? (note.title || '') : '';
    edCat.value = note ? (note.category || '编程') : '编程';
    edDate.value = note ? (note.date || '') : '';
    edTags.value = note ? parseTags(note.tags).join(', ') : '';
    edSummary.value = note ? (note.summary || '') : '';
    edBody.value = note ? (note.body || note.content || '') : '';
    edUploadHint.textContent = ''; setStatus('', '');
    edOverlay.classList.add('show');
  }
  document.getElementById('bs-editor-close').onclick = function () { edOverlay.classList.remove('show'); };
  edOverlay.onclick = function (e) { if (e.target === edOverlay) edOverlay.classList.remove('show'); };
  document.getElementById('bs-btn-upload').onclick = function () { edFile.click(); };
  edFile.addEventListener('change', function () {
    var file = edFile.files[0]; if (!file) return;
    edUploadHint.textContent = '已选择: ' + file.name;
    var reader = new FileReader();
    reader.onload = function (e) {
      edBody.value = e.target.result;
      if (!edTitle.value.trim()) edTitle.value = file.name.replace(/\.md$/, '');
      setStatus('文件已加载', 'ok');
    };
    reader.readAsText(file);
  });
  document.getElementById('bs-btn-save').onclick = function () {
    var d = {
      id: editingId || ('draft-' + Date.now()),
      title: edTitle.value.trim(), category: edCat.value, date: edDate.value.trim(),
      tags: edTags.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean),
      summary: edSummary.value.trim(), body: edBody.value, _draft: true
    };
    if (!d.title) { setStatus('标题不能为空！', 'err'); return; }
    var idx = -1;
    for (var i = 0; i < drafts.length; i++) { if (drafts[i].id === d.id) { idx = i; break; } }
    if (idx >= 0) drafts[idx] = d; else drafts.push(d);
    editingId = d.id; saveDrafts();
    setStatus('草稿已保存', 'ok'); buildShelves();
  };
  document.getElementById('bs-btn-pub').onclick = function () {
    if (!edTitle.value.trim()) { setStatus('标题不能为空！', 'err'); return; }
    if (!edBody.value.trim()) { setStatus('内容不能为空！', 'err'); return; }
    setStatus('正在发布...', '');
    document.getElementById('bs-btn-save').click();
    var payload = [], seen = {};
    function add(n) {
      if (seen[n.id]) return; seen[n.id] = true;
      payload.push({ id: n.id, title: n.title || '', date: n.date || '', summary: n.summary || '', category: n.category || '其他', tags: parseTags(n.tags), body: n.body || '' });
    }
    notes.forEach(add); drafts.forEach(add);
    fetch('/notes-publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notes: payload, deleted: deleted }) })
      .then(function (r) { return r.json(); })
      .then(function () { setStatus('发布成功！', 'ok'); deleted = []; saveDeleted(); drafts = []; saveDrafts(); loadNotes(); })
      .catch(function () { setStatus('发布失败', 'err'); });
  };
  function loadNotes() {
    loadDeleted();
    fetch('notes/index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        notes = (data || []).filter(function (n) { return deleted.indexOf(n.id) === -1; });
        loadDrafts(); buildShelves();
      })
      .catch(function () { notes = []; loadDrafts(); buildShelves(); });
  }
  if (isLocal) {
    btnAdd.style.display = 'inline-block';
    btnDelMode.style.display = 'inline-block';
    btnDelMode.title = '删除模式';
    btnDelMode.onclick = function () {
      delMode = !delMode;
      btnDelMode.classList.toggle('active', delMode);
      document.querySelectorAll('.bs-book-del').forEach(function (b) {
        b.classList.toggle('show', delMode);
      });
    };
    if (authed) { loadDrafts(); }
    btnAdd.onclick = function () { ensureAuth(function () { openEditor(null); }); };
  }
  loadNotes();
})();
