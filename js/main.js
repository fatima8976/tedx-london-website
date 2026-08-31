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

  // ── PHOTO CAROUSEL ──
  var carouselImages = [
    'gallery/fatima-lorena.JPG',
    'gallery/jack.jpg',
    'gallery/wilder.JPG',
    'gallery/grace.jpg',
    'gallery/sarah.JPG',
    'gallery/audience.JPG',
    'gallery/james.JPG',
    'gallery/julia.jpg',
    'gallery/sulayman.JPG',
    'gallery/asif.jpg',
    'gallery/exco-and-speakers.jpg'
  ];
  var carouselIndex = 0;
  var carouselTouchX = 0;
  var carouselEl = document.querySelector('.photo-carousel');

  function carouselNav(dir) {
    var img = document.getElementById('carouselImg');
    var bg = document.getElementById('carouselBg');
    if (!img) return;
    img.style.opacity = '0';
    if (bg) bg.style.opacity = '0';
    setTimeout(function() {
      carouselIndex = (carouselIndex + dir + carouselImages.length) % carouselImages.length;
      img.src = carouselImages[carouselIndex];
      if (bg) bg.src = carouselImages[carouselIndex];
      document.getElementById('carouselCounter').textContent = (carouselIndex + 1) + ' / ' + carouselImages.length;
      img.style.opacity = '1';
      if (bg) bg.style.opacity = '0.75';
    }, 200);
  }

  if (carouselEl) {
    document.getElementById('carouselPrev').addEventListener('click', function() { carouselNav(-1); });
    document.getElementById('carouselNext').addEventListener('click', function() { carouselNav(1); });

    carouselEl.addEventListener('touchstart', function(e) {
      carouselTouchX = e.touches[0].clientX;
    }, { passive: true });
    carouselEl.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - carouselTouchX;
      if (Math.abs(dx) > 50) carouselNav(dx < 0 ? 1 : -1);
    }, { passive: true });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') carouselNav(-1);
      else if (e.key === 'ArrowRight') carouselNav(1);
    });
  }

  // ── SCROLL REVEALS ──
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });
});
