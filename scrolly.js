// scrolly.js — Scroll tracking, layer management, fancy navigation
(function () {
  var allLayers = document.querySelectorAll('#mainDiagram .layer');
  var textSteps = document.querySelectorAll('.text-step');
  var prevLayerIds = new Set(['L0']);

  // ── Group text steps by visible section number from label (1.x, 2.x, 3.x, etc.) ──
  var stepGroups = [];  // [{num: '1', steps: [el, el, ...]}, ...]
  var groupMap = {};    // { '1': groupObj, '2': groupObj, ... }
  textSteps.forEach(function (s) {
    var label = s.querySelector('.step-label');
    if (!label) return;
    var m = label.textContent.match(/^(\d+)\./);
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
  var deploySec = document.getElementById('sec-deploy');
  var productsSec = document.getElementById('sec-products');
  var evalSec = document.getElementById('sec-eval');
  var endSec = document.getElementById('sec-end');

  // All navigable items: { el, navEl, type }
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
      var segs = [];

      group.steps.forEach(function (step) {
        var seg = document.createElement('button');
        seg.className = 'nav-pill-seg';
        seg.setAttribute('aria-label', 'Step ' + group.num);
        seg.onclick = function () { step.scrollIntoView({ behavior: 'smooth' }); };
        pill.appendChild(seg);
        segs.push(seg);
        navItems.push({ el: step, navEl: seg, type: 'seg', pill: pill });
      });

      nav.appendChild(pill);
    });

    // Post-scrolly dots
    var postSecs = [
      { el: deploySec, label: 'Deploy' },
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

  function renumberPills() {
    // Pills now self-label via data-label — no auto-renumbering needed
  }

  function updateNav(activeIdx) {
    // Reset all nav items
    navItems.forEach(function (item) {
      item.navEl.classList.remove('active');
      if (item.pill) item.pill.classList.remove('group-active');
    });

    // Find which nav item is active based on IntersectionObserver or scroll position
    // We use a simple approach: find the text step closest to viewport center
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

    // Update fancy nav
    updateNav(activeIdx);

    if (!active) {
      var scrollyContainer = document.getElementById('scrollyContainer');
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

    // Continuous scroll animation for step 4 arrow zone
    var L4inner = document.getElementById('L4inner');
    var l4ArrowIds = ['L4a', 'L4b', 'L4c', 'L4d', 'L4f'];

    // Clear previous inline overrides
    l4ArrowIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.style.opacity = ''; el.style.transition = ''; }
    });

    if (L4inner) {
      var step4Steps = [];
      textSteps.forEach(function (s, i) {
        var off = s.getAttribute('data-scroll-offset');
        if (off !== null) step4Steps.push({ el: s, idx: i, offset: parseFloat(off) });
      });

      if (step4Steps.length > 0) {
        var vc2 = window.innerHeight / 2;
        var currentOffset = 0;
        var inStep4Scroll = false;

        for (var k = 0; k < step4Steps.length; k++) {
          var cur = step4Steps[k];
          var next = step4Steps[k + 1];
          var rect = cur.el.getBoundingClientRect();

          if (!next) {
            if (rect.top < vc2) { currentOffset = cur.offset; inStep4Scroll = true; }
            break;
          }

          var nextRect = next.el.getBoundingClientRect();
          if (rect.top < vc2 && nextRect.top >= vc2) {
            inStep4Scroll = true;
            var total = nextRect.top - rect.top;
            var rawProgress = total > 0 ? Math.max(0, Math.min(1, (vc2 - rect.top) / total)) : 0;

            // Dead zone: first 40% of scroll does nothing, then ramp over remaining 60%
            var adjProgress = Math.max(0, Math.min(1, (rawProgress - 0.4) / 0.6));
            currentOffset = cur.offset + (next.offset - cur.offset) * adjProgress;
            break;
          } else if (rect.top >= vc2) {
            currentOffset = k > 0 ? step4Steps[k - 1].offset : 0;
            inStep4Scroll = k > 0;
            break;
          }
        }

        L4inner.style.transform = 'translateY(' + currentOffset + 'px)';

        // Scroll-driven fade: opacity based on effective SVG position after transform
        if (inStep4Scroll) {
          var yCenters = { L4a: 518, L4b: 646, L4c: 778, L4d: 933, L4f: 1190 };
          // Visible band where arrows are fully opaque, fade zone outside
          var bandTop = 500, bandBot = 660, fadeRange = 100;

          l4ArrowIds.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            // Only control opacity for layers that are .show via data-layers
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
    }
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

  // Keyboard navigation
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
})();
