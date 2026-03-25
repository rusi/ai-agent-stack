// scrolly.js — Scroll tracking, layer management, navigation
(function () {
  var allLayers = document.querySelectorAll('#mainDiagram .layer');
  var textSteps = document.querySelectorAll('.text-step');
  var progress = document.getElementById('stepProgress');
  var prevLayerIds = new Set(['L0']);

  // Build step progress bars
  textSteps.forEach(function () {
    var bar = document.createElement('div');
    bar.className = 'step-progress-bar';
    progress.appendChild(bar);
  });
  var progressBars = progress.querySelectorAll('.step-progress-bar');

  function renumberPills() {
    var visible = [];
    allLayers.forEach(function (l) {
      if (l.classList.contains('show')) {
        var pills = l.querySelectorAll('.dyn-pill');
        pills.forEach(function (p) { visible.push(p); });
      }
    });
    visible.sort(function (a, b) {
      return parseInt(a.dataset.order) - parseInt(b.dataset.order);
    });
    visible.forEach(function (p, i) {
      var txt = p.querySelector('text');
      if (txt) txt.textContent = i + 1;
    });
  }

  function updateDiagram() {
    var vc = window.innerHeight / 2;
    var active = null;
    var activeIdx = -1;

    textSteps.forEach(function (s, i) {
      var r = s.getBoundingClientRect();
      if (r.top < vc + 100 && r.bottom > vc - 100) {
        active = s;
        activeIdx = i;
      }
    });

    var scrollyContainer = document.getElementById('scrollyContainer');
    if (scrollyContainer) {
      var containerRect = scrollyContainer.getBoundingClientRect();
      var inScrolly = containerRect.top < 0 && containerRect.bottom > window.innerHeight;
      progress.classList.toggle('visible', inScrolly);
    }

    progressBars.forEach(function (bar, i) {
      bar.classList.toggle('active', i === activeIdx);
    });

    if (!active) {
      if (scrollyContainer && scrollyContainer.getBoundingClientRect().top > 0) {
        allLayers.forEach(function (l) { l.classList.remove('show', 'highlight'); });
        var l0 = document.getElementById('L0');
        if (l0) l0.classList.add('show');
        prevLayerIds = new Set(['L0']);
      }
      renumberPills();
      return;
    }

    var ids = new Set((active.getAttribute('data-layers') || '').split(','));
    var newIds = new Set();
    ids.forEach(function (id) {
      if (!prevLayerIds.has(id)) newIds.add(id);
    });

    allLayers.forEach(function (l) {
      var shouldShow = ids.has(l.id);
      l.classList.toggle('show', shouldShow);
      if (newIds.has(l.id)) {
        l.classList.remove('highlight');
        void l.offsetWidth;
        l.classList.add('highlight');
      }
    });

    prevLayerIds = ids;
    renumberPills();
  }

  var stepObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var inner = e.target.querySelector('.text-step-inner');
      if (e.isIntersecting) inner.classList.add('visible');
      // No removal of visible class to prevent "fading away" once scrolled to
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });
  textSteps.forEach(function (s) { stepObs.observe(s); });

  window.addEventListener('scroll', updateDiagram, { passive: true });
  updateDiagram();

  var secObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.section-inner').forEach(function (el) { secObs.observe(el); });

  var heroSec = document.getElementById('sec-hero');
  var deploySec = document.getElementById('sec-deploy');
  var productsSec = document.getElementById('sec-products');
  var evalSec = document.getElementById('sec-eval');
  var endSec = document.getElementById('sec-end');

  var allSecs = [heroSec].concat(
    Array.from(textSteps),
    [deploySec, productsSec, evalSec, endSec]
  ).filter(Boolean);

  var nav = document.getElementById('navDots');
  if (nav) {
    allSecs.forEach(function (s) {
      var d = document.createElement('button');
      d.className = 'nav-dot';
      d.setAttribute('aria-label', 'Navigate to section');
      d.onclick = function () { s.scrollIntoView({ behavior: 'smooth' }); };
      nav.appendChild(d);
    });
    
    var dots = nav.querySelectorAll('.nav-dot');
    var dObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var i = allSecs.indexOf(e.target);
          dots.forEach(function (d, j) { d.classList.toggle('active', j === i); });
        }
      });
    }, { threshold: 0.4 });
    allSecs.forEach(function (s) { dObs.observe(s); });
  }

  document.addEventListener('keydown', function (e) {
    var dots = nav ? nav.querySelectorAll('.nav-dot') : [];
    if (!dots.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      var current = Array.from(dots).findIndex(function (d) { return d.classList.contains('active'); });
      var next = Math.min(current + 1, allSecs.length - 1);
      allSecs[next].scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      var current = Array.from(dots).findIndex(function (d) { return d.classList.contains('active'); });
      var prev = Math.max(current - 1, 0);
      allSecs[prev].scrollIntoView({ behavior: 'smooth' });
    }
  });
})();
