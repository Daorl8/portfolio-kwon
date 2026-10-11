// =========================================================
// 권현서 HR Portfolio — interactions
// 모든 애니메이션은 OS의 '동작 줄이기' 설정과 관계없이 항상 실행(요청 사항).
// transform/opacity만 움직여 저사양 기기에서도 부드럽게 동작.
// =========================================================
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('motion-ready');
  var hasIO = 'IntersectionObserver' in window;
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var easeInOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  // ---------- 1. 스크롤 등장 (fade-up, 그룹별 순차) ----------
  var groups = [
    '.hero-grid > div:first-child > *', '.kpi', '.sec-head', '.comp', '#summary .table-wrap',
    '.ch-head', '.act', 'details.overview', '.prow', '.way', '#appendix .act'
  ];
  var targets = [];
  groups.forEach(function (sel) {
    var list = document.querySelectorAll(sel);
    Array.prototype.forEach.call(list, function (el) {
      if (el.classList.contains('reveal')) return;
      var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      el.style.setProperty('--d', Math.min(sib, 6) * 0.08 + 's');
      el.classList.add('reveal');
      targets.push(el);
    });
  });

  // ---------- 2. 숫자 카운트업 ----------
  function countUp(el) {
    var node = el.firstChild;
    if (!node || node.nodeType !== 3) return;
    var raw = node.nodeValue;
    var m = raw.match(/^(\D*?)([\d,]+(?:\.\d+)?)(\D*)$/);
    if (!m) return;
    var pre = m[1], numStr = m[2], post = m[3];
    var decimals = (numStr.split('.')[1] || '').length;
    var useComma = numStr.indexOf(',') > -1;
    var target = parseFloat(numStr.replace(/,/g, ''));
    if (!isFinite(target)) return;
    var dur = 1200, start = null;
    function fmt(v) {
      var s = v.toFixed(decimals);
      if (useComma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return pre + s + post;
    }
    node.nodeValue = fmt(0);
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      node.nodeValue = fmt(target * easeOut(p));
      if (p < 1) raf(step); else node.nodeValue = raw;
    }
    raf(step);
  }
  var counters = document.querySelectorAll('.kpi .num, .stat .v');

  // ---------- 3. 막대그래프 ----------
  var barSets = document.querySelectorAll('.bars');
  Array.prototype.forEach.call(barSets, function (b) {
    Array.prototype.forEach.call(b.querySelectorAll('.fill'), function (f, i) {
      f.style.setProperty('--d', i * 0.07 + 's');
    });
  });

  function show(el) {
    el.classList.add('in');
    setTimeout(function () { el.style.setProperty('--d', '0s'); }, 1400);
    if (el.matches && el.matches('.kpi, .act, #appendix .act')) {
      Array.prototype.forEach.call(el.querySelectorAll('.num, .stat .v'), countUp);
    }
  }

  if (hasIO) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        show(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
    Array.prototype.forEach.call(barSets, function (b) { io.observe(b); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
    Array.prototype.forEach.call(barSets, function (b) { b.classList.add('in'); });
  }
  // 첫 화면에 이미 보이는 요소는 즉시 등장
  raf(function () {
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) { show(el); if (hasIO) io.unobserve(el); }
    });
  });
  // 안전장치: 3초 뒤에도 숨겨진 요소가 화면 안에 있으면 표시
  setTimeout(function () {
    targets.concat(Array.prototype.slice.call(barSets)).forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    });
  }, 3000);

  // ---------- 4. 부드러운 앵커 스크롤 (모든 브라우저 동일) ----------
  var navH = 64;
  function smoothTo(y) {
    var startY = window.pageYOffset, dist = y - startY;
    var dur = Math.min(1100, Math.max(450, Math.abs(dist) * 0.45)), t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      window.scrollTo(0, startY + dist * easeInOut(p));
      if (p < 1) raf(step);
    }
    raf(step);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    var el = id === '#top' ? document.body : document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    var y = id === '#top' ? 0 : el.getBoundingClientRect().top + window.pageYOffset - navH;
    smoothTo(Math.max(0, y));
    if (history.replaceState) history.replaceState(null, '', id);
  });

  // ---------- 5. '전체 활동 보기' 펼침 애니메이션 ----------
  Array.prototype.forEach.call(document.querySelectorAll('details.overview'), function (d) {
    var sum = d.querySelector('summary'), body = d.querySelector('.ov-grid');
    if (!sum || !body) return;
    sum.addEventListener('click', function (e) {
      e.preventDefault();
      if (d.dataset.anim) return;
      d.dataset.anim = '1';
      var opening = !d.open;
      if (opening) d.open = true;
      var full = body.scrollHeight;
      body.style.height = (opening ? 0 : full) + 'px';
      body.style.opacity = opening ? '0' : '1';
      body.style.transition = 'height 0.45s cubic-bezier(0.22,0.61,0.36,1), opacity 0.45s';
      raf(function () {
        raf(function () {
          body.style.height = (opening ? full : 0) + 'px';
          body.style.opacity = opening ? '1' : '0';
        });
      });
      setTimeout(function () {
        if (!opening) d.open = false;
        body.style.height = ''; body.style.opacity = ''; body.style.transition = '';
        delete d.dataset.anim;
      }, 470);
    });
  });

  // ---------- 6. 상단 메뉴 상태 · 진행 막대 ----------
  var nav = document.querySelector('.nav');
  var bar = document.querySelector('.progress');
  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset;
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (bar) {
      var max = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; raf(onScroll); }
  }, { passive: true });
  onScroll();

  // ---------- 7. 현재 섹션 메뉴 강조 ----------
  var links = document.querySelectorAll('.nav-links a');
  if (hasIO && links.length) {
    var map = {};
    Array.prototype.forEach.call(links, function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Array.prototype.forEach.call(links, function (a) { a.classList.remove('active'); });
        if (map[e.target.id]) map[e.target.id].classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io2.observe(el);
    });
  }
})();
