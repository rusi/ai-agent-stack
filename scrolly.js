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

  function updateDiagram() {
    var vc = window.innerHeight / 2;
    var active = null;
    var activeIdx = -1;

    textSteps.forEach(function (s, i) {
      var r = s.getBoundingClientRect();
      if (r.top < vc + 150 && r.bottom > vc - 150) {
        active = s;
        activeIdx = i;
      }
    });

    // Show/hide progress indicator
    var container = document.getElementById('scrollyContainer').getBoundingClientRect();
    var inScrolly = container.top < 0 && container.bottom > window.innerHeight;
    progress.classList.toggle('visible', inScrolly);

    // Update progress bars
    progressBars.forEach(function (bar, i) {
      bar.classList.toggle('active', i === activeIdx);
    });

    if (!active) {
      if (container.top > 0) {
        allLayers.forEach(function (l) { l.classList.remove('show', 'highlight'); });
        document.getElementById('L0').classList.add('show');
        prevLayerIds = new Set(['L0']);
      }
      return;
    }

    var ids = new Set((active.getAttribute('data-layers') || '').split(','));

    // Highlight newly appearing layers
    var newIds = new Set();
    ids.forEach(function (id) {
      if (!prevLayerIds.has(id)) newIds.add(id);
    });

    allLayers.forEach(function (l) {
      var shouldShow = ids.has(l.id);
      l.classList.toggle('show', shouldShow);
      if (newIds.has(l.id)) {
        l.classList.remove('highlight');
        void l.offsetWidth; // trigger reflow for re-animation
        l.classList.add('highlight');
      }
    });

    prevLayerIds = ids;
  }

  // Text step visibility observer
  var stepObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var inner = e.target.querySelector('.text-step-inner');
      if (e.isIntersecting) inner.classList.add('visible');
      else inner.classList.remove('visible');
    });
  }, { threshold: 0.2 });
  textSteps.forEach(function (s) { stepObs.observe(s); });

  // Scroll listener for diagram
  window.addEventListener('scroll', updateDiagram, { passive: true });
  updateDiagram();

  // Section reveal observer
  var secObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.section-inner').forEach(function (el) { secObs.observe(el); });

  // Nav dots
  var allSecs = [
    document.getElementById('sec-hero')
  ].concat(
    Array.from(textSteps),
    [
      document.getElementById('sec-deploy'),
      document.getElementById('sec-products'),
      document.getElementById('sec-eval'),
      document.getElementById('sec-end')
    ]
  );
  var nav = document.getElementById('navDots');
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
  }, { threshold: 0.35 });
  allSecs.forEach(function (s) { dObs.observe(s); });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
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
