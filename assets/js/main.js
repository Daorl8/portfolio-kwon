// 상단 메뉴: 현재 보고 있는 섹션 강조
(function () {
  var links = document.querySelectorAll('.nav-links a');
  if (!('IntersectionObserver' in window) || !links.length) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove('active'); });
      var a = map[e.target.id];
      if (a) a.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) io.observe(el);
  });
})();
