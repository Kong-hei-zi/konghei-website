/* ═══════════════════════════════════════════
   Konghei 渲染引擎 · 首页专用
   ═══════════════════════════════════════════ */

function h(tag, attrs, children) {
  var el = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(function(k) {
      if (k === 'className') el.className = attrs[k];
      else if (k === 'innerHTML') el.innerHTML = attrs[k];
      else if (k === 'dataset') Object.assign(el.dataset, attrs[k]);
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), attrs[k]);
      else el.setAttribute(k, attrs[k]);
    });
  }
  if (children) {
    if (typeof children === 'string') el.textContent = children;
    else if (Array.isArray(children)) children.forEach(function(c) { if (c) el.appendChild(c); });
    else el.appendChild(children);
  }
  return el;
}

/* 渲染首页 */
(function() {
  var body = document.getElementById('hero-body');
  if (!body) return;

  /* 访客系统 */
  var visitorBox = h('div', { id: 'visitor-box', className: 'visitor-box' }, [
    h('span', { className: 'visitor-icon' }, '🧸'),
    h('input', { id: 'visitor-name-input', className: 'visitor-input', placeholder: '告诉我你的名字吧～', autocomplete: 'off' }),
    h('button', { id: 'visitor-confirm', className: 'visitor-btn' }, '进门')
  ]);
  var visitorGreeting = h('div', { id: 'visitor-greeting', className: 'visitor-greeting', style: 'display:none' }, [
    h('span', { className: 'doll-greet' }, '🧸'),
    h('span', null, [document.createTextNode('欢迎回来，'), h('strong', { id: 'visitor-name' }), document.createTextNode('～ 随便坐！')]),
    h('button', { id: 'visitor-change', className: 'visitor-change-btn', title: '换个名字' }, '✎')
  ]);

  var tag = h('div', { className: 'hero-tag' }, SITE.hero.tag);
  var title = h('h1', { className: 'hero-title' }, [
    h('span', { className: 'ht-line1' }, SITE.hero.title),
    h('span', { className: 'ht-line2' }, SITE.hero.subtitle)
  ]);
  var desc = h('p', { className: 'hero-desc' }, SITE.hero.desc);
  var visitorWrap = h('div', { className: 'hero-visitor' }, [visitorBox, visitorGreeting]);

  var entries = [
    { href: 'blog.html', icon: '📝', en: 'BLOG', cn: '博客' },
    { href: 'portfolio.html', icon: '🎨', en: 'WORKS', cn: '作品集' },
    { href: 'shop.html', icon: '🛒', en: 'SHOP', cn: '小店' },
    { href: 'notes.html', icon: '📚', en: 'NOTES', cn: '学习笔记' }
  ];
  var navCards = h('div', { className: 'hero-nav-cards' },
    entries.map(function(e) {
      return h('a', { className: 'hn-card', href: e.href }, [
        h('span', { className: 'hn-icon' }, e.icon),
        h('span', { className: 'hn-title' }, e.en),
        h('span', { className: 'hn-sub' }, e.cn)
      ]);
    })
  );

  body.appendChild(tag);
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(visitorWrap);
  body.appendChild(navCards);
})();

/* ═══════════════════════════════════════════
   加载动画（仅首次访问）
   ═══════════════════════════════════════════ */
(function() {
  var VISITED_KEY = 'konghei_visited';
  var loading = document.getElementById('loading-screen');
  var bgm = document.getElementById('bgm');
  var musicBtn = document.getElementById('music-toggle');

  /* 音乐控制（始终绑定，不随加载动画跳过） */
  if (musicBtn && bgm) {
    var playing = false;
    musicBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (playing) {
        bgm.pause(); musicBtn.textContent = '🔇'; musicBtn.classList.remove('playing');
      } else {
        bgm.play().then(function() {
          musicBtn.textContent = '🔊'; musicBtn.classList.add('playing');
        }).catch(function() { musicBtn.textContent = '🎵'; });
      }
      playing = !playing;
    });
  }

  /* 不是首次访问 → 跳过加载动画 */
  if (sessionStorage.getItem(VISITED_KEY)) {
    if (loading) loading.classList.add('hidden');
    if (musicBtn) musicBtn.style.display = 'flex';
    animateHero();
    return;
  }

  sessionStorage.setItem(VISITED_KEY, '1');
  var done = false;

  function finish() {
    if (done) return; done = true;
    if (loading) loading.classList.add('hidden');
    if (musicBtn) musicBtn.style.display = 'flex';
    setTimeout(animateHero, 200);
  }

  window.addEventListener('load', function() { setTimeout(finish, 2000); });
  document.addEventListener('click', function() { setTimeout(finish, 400); }, { once: true });

  function animateHero() {
    var hero = document.querySelector('.hero-body');
    if (!hero) return;
    var items = hero.querySelectorAll('.hero-tag, .hero-title, .hero-desc, .hero-visitor, .hn-card');
    items.forEach(function(el, i) {
      el.style.setProperty('--anim-delay', (i * 0.12) + 's');
      el.classList.add('anim-in');
    });
  }
})();

/* 访客系统 */
(function() {
  var nameKey = 'konghei_visitor_name';
  var saved = localStorage.getItem(nameKey);

  function bind() {
    var greeting = document.getElementById('visitor-greeting');
    var nameInput = document.getElementById('visitor-name-input');
    var confirmBtn = document.getElementById('visitor-confirm');
    var changeBtn = document.getElementById('visitor-change');
    var visitorNameEl = document.getElementById('visitor-name');
    if (!greeting) return;

    if (saved) { showGreeting(saved); } else { showInput(); }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', function() {
        var name = nameInput.value.trim();
        if (name) { localStorage.setItem(nameKey, name); showGreeting(name); }
      });
    }
    if (nameInput) {
      nameInput.addEventListener('keydown', function(e) { if (e.key === 'Enter' && confirmBtn) confirmBtn.click(); });
    }
    if (changeBtn) {
      changeBtn.addEventListener('click', function() { localStorage.removeItem(nameKey); showInput(); });
    }

    function showGreeting(name) {
      if (greeting) greeting.style.display = 'flex';
      if (visitorNameEl) visitorNameEl.textContent = name;
      var box = document.getElementById('visitor-box');
      if (box) box.style.display = 'none';
    }
    function showInput() {
      if (greeting) greeting.style.display = 'none';
      var box = document.getElementById('visitor-box');
      if (box) box.style.display = 'flex';
      if (nameInput) nameInput.value = '';
    }
  }
  setTimeout(bind, 0);
})();
