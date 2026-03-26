// scrolly.js — Scroll tracking, layer management, fancy navigation
(function () {
  // ── Multi-diagram support ──
  // Each scrolly pair: { container, diagramId, layers, textSteps, prevLayerIds }
  var scrollyPairs = [
    { containerId: 'scrollyContainer', diagramId: 'mainDiagram' },
    { containerId: 'scrollyContainer2', diagramId: 'deployDiagram' }
  ];

  var pairs = [];
  scrollyPairs.forEach(function (cfg) {
    var container = document.getElementById(cfg.containerId);
    var diagram = document.getElementById(cfg.diagramId);
    if (!container || !diagram) return;
    var textSteps = container.querySelectorAll('.text-step');
    var layers = diagram.querySelectorAll('.layer');
    pairs.push({
      container: container,
      diagramId: cfg.diagramId,
      layers: layers,
      textSteps: textSteps,
      prevLayerIds: new Set(cfg.diagramId === 'mainDiagram' ? ['L0'] : ['DL0'])
    });
  });

  // All text steps across all pairs (for nav grouping)
  var allTextSteps = [];
  pairs.forEach(function (p) {
    p.textSteps.forEach(function (s) { allTextSteps.push(s); });
  });

  // ── Group text steps by visible section number from label ──
  var stepGroups = [];
  var groupMap = {};
  allTextSteps.forEach(function (s) {
    var label = s.querySelector('.step-label');
    if (!label) return;
    var m = label.textContent.match(/(\d+)\./);
    if (!m) return;
    var num = m[1];
    if (!groupMap[num]) {
      var g = { num: num, steps: [] };
      groupMap[num] = g;
      stepGroups.push(g);
    }
    groupMap[num].steps.push(s);
  });

  // ── Build fancy nav ──
  var nav = document.getElementById('navDots');
  var heroSec = document.getElementById('sec-hero');
  var productsSec = document.getElementById('sec-products');
  var evalSec = document.getElementById('sec-eval');
  var endSec = document.getElementById('sec-end');

  var navItems = [];

  function makeDot(targetEl, label) {
    var d = document.createElement('button');
    d.className = 'nav-dot';
    d.setAttribute('aria-label', label || 'Navigate to section');
    d.onclick = function () { targetEl.scrollIntoView({ behavior: 'smooth' }); };
    return d;
  }

  if (nav) {
    // Hero dot
    if (heroSec) {
      var heroDot = makeDot(heroSec, 'Hero');
      nav.appendChild(heroDot);
      navItems.push({ el: heroSec, navEl: heroDot, type: 'dot' });
    }

    // Step group pills
    stepGroups.forEach(function (group) {
      var pill = document.createElement('div');
      pill.className = 'nav-pill';
      pill.setAttribute('data-group', group.num);

      group.steps.forEach(function (step) {
        var seg = document.createElement('button');
        seg.className = 'nav-pill-seg';
        seg.setAttribute('aria-label', 'Step ' + group.num);
        seg.onclick = function () { step.scrollIntoView({ behavior: 'smooth' }); };
        pill.appendChild(seg);
        navItems.push({ el: step, navEl: seg, type: 'seg', pill: pill });
      });

      nav.appendChild(pill);
    });

    // Post-scrolly dots
    var postSecs = [
      { el: productsSec, label: 'Products' },
      { el: evalSec, label: 'Eval' },
      { el: endSec, label: 'End' }
    ];
    postSecs.forEach(function (s) {
      if (!s.el) return;
      var d = makeDot(s.el, s.label);
      nav.appendChild(d);
      navItems.push({ el: s.el, navEl: d, type: 'dot' });
    });
  }

  function updateNav() {
    navItems.forEach(function (item) {
      item.navEl.classList.remove('active');
      if (item.pill) item.pill.classList.remove('group-active');
    });

    var vc = window.innerHeight / 2;
    var bestItem = null;
    var bestDist = Infinity;

    navItems.forEach(function (item) {
      var r = item.el.getBoundingClientRect();
      var center = (r.top + r.bottom) / 2;
      var dist = Math.abs(center - vc);
      if (dist < bestDist) {
        bestDist = dist;
        bestItem = item;
      }
    });

    if (bestItem) {
      bestItem.navEl.classList.add('active');
      if (bestItem.pill) bestItem.pill.classList.add('group-active');
    }
  }

  // ── Update a single scrolly pair ──
  function updatePair(pair) {
    var vc = window.innerHeight / 2;
    var active = null;

    pair.textSteps.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top < vc + 100 && r.bottom > vc - 100) {
        active = s;
      }
    });

    if (!active) {
      var containerRect = pair.container.getBoundingClientRect();
      if (containerRect.top > 0) {
        // Before scrolly — reset to base
        pair.layers.forEach(function (l) { l.classList.remove('show', 'highlight'); });
        var baseId = pair.diagramId === 'mainDiagram' ? 'L0' : 'DL0';
        var base = document.getElementById(baseId);
        if (base) base.classList.add('show');
        pair.prevLayerIds = new Set([baseId]);
      }
      return;
    }

    var ids = new Set((active.getAttribute('data-layers') || '').split(','));
    var newIds = new Set();
    ids.forEach(function (id) {
      if (!pair.prevLayerIds.has(id)) newIds.add(id);
    });

    pair.layers.forEach(function (l) {
      var shouldShow = ids.has(l.id);
      l.classList.toggle('show', shouldShow);
      if (newIds.has(l.id)) {
        l.classList.remove('highlight');
        void l.offsetWidth;
        l.classList.add('highlight');
      }
    });

    pair.prevLayerIds = ids;
  }

  // ── Step 4 scroll animation (mainDiagram only) ──
  function updateStep4Scroll(pair) {
    if (pair.diagramId !== 'mainDiagram') return;

    var L4inner = document.getElementById('L4inner');
    var l4ArrowIds = ['L4a', 'L4b', 'L4c', 'L4d', 'L4f'];

    l4ArrowIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.style.opacity = ''; el.style.transition = ''; }
    });

    if (!L4inner) return;

    var step4Steps = [];
    pair.textSteps.forEach(function (s, i) {
      var off = s.getAttribute('data-scroll-offset');
      if (off !== null) step4Steps.push({ el: s, idx: i, offset: parseFloat(off) });
    });

    if (step4Steps.length === 0) return;

    var vc = window.innerHeight / 2;
    var currentOffset = 0;
    var inStep4Scroll = false;

    for (var k = 0; k < step4Steps.length; k++) {
      var cur = step4Steps[k];
      var next = step4Steps[k + 1];
      var rect = cur.el.getBoundingClientRect();

      if (!next) {
        if (rect.top < vc) { currentOffset = cur.offset; inStep4Scroll = true; }
        break;
      }

      var nextRect = next.el.getBoundingClientRect();
      if (rect.top < vc && nextRect.top >= vc) {
        inStep4Scroll = true;
        var total = nextRect.top - rect.top;
        var rawProgress = total > 0 ? Math.max(0, Math.min(1, (vc - rect.top) / total)) : 0;
        var adjProgress = Math.max(0, Math.min(1, (rawProgress - 0.4) / 0.6));
        currentOffset = cur.offset + (next.offset - cur.offset) * adjProgress;
        break;
      } else if (rect.top >= vc) {
        currentOffset = k > 0 ? step4Steps[k - 1].offset : 0;
        inStep4Scroll = k > 0;
        break;
      }
    }

    L4inner.style.transform = 'translateY(' + currentOffset + 'px)';

    if (inStep4Scroll) {
      var yCenters = { L4a: 518, L4b: 646, L4c: 778, L4d: 933, L4f: 1190 };
      var bandTop = 500, bandBot = 660, fadeRange = 100;

      l4ArrowIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (!el.classList.contains('show')) {
          el.style.opacity = '';
          el.style.transition = '';
          return;
        }
        el.style.transition = 'none';

        var effCenter = yCenters[id] + currentOffset;
        var opacity;
        if (effCenter < bandTop - fadeRange) {
          opacity = 0;
        } else if (effCenter < bandTop) {
          opacity = (effCenter - (bandTop - fadeRange)) / fadeRange;
        } else if (effCenter > bandBot + fadeRange) {
          opacity = 0;
        } else if (effCenter > bandBot) {
          opacity = ((bandBot + fadeRange) - effCenter) / fadeRange;
        } else {
          opacity = 1;
        }
        el.style.opacity = Math.max(0, Math.min(1, opacity));
      });
    }
  }

  // ── Main update loop ──
  function updateDiagram() {
    updateNav();
    pairs.forEach(function (pair) {
      updatePair(pair);
      updateStep4Scroll(pair);
    });
  }

  // ── Text step fade-in observer ──
  var stepObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var inner = e.target.querySelector('.text-step-inner');
      if (e.isIntersecting && inner) inner.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });
  allTextSteps.forEach(function (s) { stepObs.observe(s); });

  window.addEventListener('scroll', updateDiagram, { passive: true });
  updateDiagram();

  // ── Section fade-in observer ──
  var secObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.section-inner').forEach(function (el) { secObs.observe(el); });

  // ── Keyboard navigation ──
  document.addEventListener('keydown', function (e) {
    if (!navItems.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      var current = -1;
      navItems.forEach(function (item, i) {
        if (item.navEl.classList.contains('active')) current = i;
      });
      var next = Math.min(current + 1, navItems.length - 1);
      navItems[next].el.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      var current = -1;
      navItems.forEach(function (item, i) {
        if (item.navEl.classList.contains('active')) current = i;
      });
      var prev = Math.max(current - 1, 0);
      navItems[prev].el.scrollIntoView({ behavior: 'smooth' });
    }
  });
  // ── Mobile: align SVG content to top ──
  if (window.innerWidth <= 900) {
    var mainSvg = document.getElementById('mainDiagram');
    var deploySvg = document.getElementById('deployDiagram');
    if (mainSvg) mainSvg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
    if (deploySvg) deploySvg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
  }
})();
