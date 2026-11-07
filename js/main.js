// ── THEME ──
(function () {
  var saved = localStorage.getItem('tedx-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('tedx-theme', next);
}

// ── NAV ──
window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
});

function toggleNav() {
  var navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.toggle('open');
}

function toggleDropdown(event) {
  event.preventDefault();
  event.stopPropagation();
  var toggle = event.currentTarget;
  var menu = toggle.nextElementSibling;
  var isOpen = menu.classList.contains('open');
  document.querySelectorAll('.nav-dropdown-menu').forEach(function (m) { if (m.classList.contains("exclude")) return; m.classList.remove('open'); });
  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (t) { if (t.classList.contains("exclude")) return; t.classList.remove('open'); });
  if (!isOpen) {
    if (!menu.classList.contains("exclude"))
      menu.classList.add('open');

    if (!toggle.classList.contains("exclude"))
      toggle.classList.add('open');
  }
}

function toggleSubDropdown(event) {
  event.preventDefault();
  event.stopPropagation();
  var toggle = event.currentTarget;
  var menu = toggle.nextElementSibling;
  var isOpen = menu.classList.contains('open');

  if (!isOpen) {
    menu.classList.add('open');
    toggle.classList.add('open');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    if (a.classList.contains('nav-dropdown-toggle')) return;
    a.addEventListener('click', function () {
      var navLinks = document.getElementById('navLinks');
      if (navLinks) navLinks.classList.remove('open');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown-menu').forEach(function (m) { m.classList.remove('open'); });
      document.querySelectorAll('.nav-dropdown-toggle').forEach(function (t) { t.classList.remove('open'); });
    }
  });

  // Photo carousel (events.html) now lives in js/events.js, driven by
  // content/events.json's gallery field instead of a hardcoded array here.

  // ── SCROLL REVEALS ──
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

  // Lets scripts that inject content after DOMContentLoaded (CMS-driven
  // fetch/render, e.g. js/join.js, js/news.js) register their new .reveal
  // elements for the same scroll animation.
  window.tedxObserveReveal = function (el) {
    observer.observe(el);
  };
});

//Update code
(async () => {
  const getNavbarUpdate = await fetch("/navbar.update.html")
  const navLinks = document.getElementById("navLinks")

  let k = true
  const children = Array.from(navLinks.children)
  for (let index = 0; index < children.length; index++) {
    let e = children[index];

    if (!(e.innerHTML.indexOf("events.html") == -1)) {

      e.outerHTML = await (getNavbarUpdate.text())
      console.log(e.outerHTML)
      break
    }

  }

  (function () {
    // 18:00 GMT on 12 Nov 2026 (GMT = UTC in November). Months are zero-based: 10 = November.
    var TARGET = Date.UTC(2026, 10, 12, 18, 0, 0);
    var FLIP_MS = 600; // total flip time, matches the CSS durations
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var bar = document.getElementById("cd-bar");
    if (!bar) return;
    var groups = {};
    ["d", "h", "m", "s"].forEach(function (k) {
      groups[k] = bar.querySelector('[data-cd="' + k + '"]');
    });

    function makeCard(v) {
      var c = document.createElement("span");
      c.className = "cd-card";
      c.innerHTML =
        '<span class="cd-half cd-top"><span></span></span>' +
        '<span class="cd-half cd-bot"><span></span></span>' +
        '<span class="cd-half cd-top cd-flap-top"><span></span></span>' +
        '<span class="cd-half cd-bot cd-flap-bot"><span></span></span>';
      c._p = c.querySelectorAll(".cd-half > span"); // top, bottom, flapTop, flapBottom
      setCard(c, v, false);
      return c;
    }

    function setCard(card, v, animate) {
      var old = card._v;
      if (old === v) return;
      card._v = v;
      var p = card._p;
      clearTimeout(card._t);

      if (!animate || old === undefined || reduceMotion) {
        for (var i = 0; i < 4; i++) p[i].textContent = v;
        card.classList.remove("is-flip");
        return;
      }
      // Static halves: new top revealed behind the falling flap, old bottom until the flap lands
      p[0].textContent = v;
      p[1].textContent = old;
      p[2].textContent = old;
      p[3].textContent = v;
      card.classList.remove("is-flip");
      void card.offsetWidth; // restart the animation
      card.classList.add("is-flip");
      card._t = setTimeout(function () { p[1].textContent = v; }, FLIP_MS);
    }

    function render(group, str, animate, delayBase) {
      // Rebuild if the number of digits changed (e.g. days going from 10 to 9)
      if (group.children.length !== str.length) {
        group.innerHTML = "";
        for (var i = 0; i < str.length; i++) group.appendChild(makeCard("0"));
      }
      group._want = str;
      for (var j = 0; j < str.length; j++) {
        (function (card, idx, delay) {
          // Read the wanted digit when the flip fires, so a delayed flip never shows a stale value
          var go = function () {
            if (group._want.length === group.children.length) setCard(card, group._want[idx], animate);
          };
          if (delay) setTimeout(go, delay); else go();
        })(group.children[j], j, delayBase ? delayBase + j * 70 : 0);
      }
    }

    function pad(n) { return (n < 10 ? "0" : "") + n; }

    function parts() {
      var diff = Math.max(0, TARGET - Date.now());
      var t = Math.floor(diff / 1000);
      return {
        done: diff === 0,
        d: String(Math.floor(t / 86400)),
        h: pad(Math.floor((t % 86400) / 3600)),
        m: pad(Math.floor((t % 3600) / 60)),
        s: pad(t % 60)
      };
    }

    function tick(intro) {
      var p = parts();
      var keys = ["d", "h", "m", "s"];
      keys.forEach(function (k, i) {
        render(groups[k], p[k], true, intro ? 450 + i * 160 : 0);
      });
      if (p.done) {
        bar.classList.add("is-done");
        bar.querySelector(".cd-text").textContent = "It’s 6 PM. Time’s up.";
        return;
      }
      setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    }

    // Start every card at zero, then cascade-flip to the real time as the bar rises in
    var first = parts();
    ["d", "h", "m", "s"].forEach(function (k) {
      render(groups[k], first[k].replace(/\d/g, "0"), false, 0);
    });
    tick(!reduceMotion);

    const cdbar = document.getElementById("cd-bar")
    document.body.appendChild(cdbar)
  })();
})()
