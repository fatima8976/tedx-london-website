// ── THEME ──
(function() {
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
window.addEventListener('scroll', function() {
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
  document.querySelectorAll('.nav-dropdown-menu').forEach(function(m) { m.classList.remove('open'); });
  document.querySelectorAll('.nav-dropdown-toggle').forEach(function(t) { t.classList.remove('open'); });
  if (!isOpen) {
    menu.classList.add('open');
    toggle.classList.add('open');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    if (a.classList.contains('nav-dropdown-toggle')) return;
    a.addEventListener('click', function() {
      var navLinks = document.getElementById('navLinks');
      if (navLinks) navLinks.classList.remove('open');
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown-menu').forEach(function(m) { m.classList.remove('open'); });
      document.querySelectorAll('.nav-dropdown-toggle').forEach(function(t) { t.classList.remove('open'); });
    }
  });

  // Photo carousel (events.html) now lives in js/events.js, driven by
  // content/events.json's gallery field instead of a hardcoded array here.

  // ── SCROLL REVEALS ──
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });

  // Lets scripts that inject content after DOMContentLoaded (CMS-driven
  // fetch/render, e.g. js/join.js, js/news.js) register their new .reveal
  // elements for the same scroll animation.
  window.tedxObserveReveal = function(el) {
    observer.observe(el);
  };
});
