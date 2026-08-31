document.addEventListener('DOMContentLoaded', function () {
  var WATCH_ICON_SVG = '<svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/></svg>';

  function renderSpeaker(speaker) {
    var wrap = document.createElement('div');
    wrap.className = 'speaker-full reveal';

    var photoWrap = document.createElement('div');
    photoWrap.className = 'speaker-full-photo';
    var img = document.createElement('img');
    img.src = speaker.photo || '';
    img.alt = speaker.name || '';
    img.loading = 'lazy';
    photoWrap.appendChild(img);

    var info = document.createElement('div');

    var name = document.createElement('div');
    name.className = 'speaker-full-name';
    name.textContent = speaker.name || '';

    var role = document.createElement('div');
    role.className = 'speaker-full-role';
    role.textContent = speaker.roleAffiliation || '';

    var talk = document.createElement('div');
    talk.className = 'speaker-talk-title';
    talk.textContent = speaker.talkTitle || '';

    var bio = document.createElement('p');
    bio.className = 'speaker-full-desc';
    bio.textContent = speaker.bio || '';

    info.appendChild(name);
    info.appendChild(role);
    info.appendChild(talk);
    info.appendChild(bio);

    if (speaker.watchLink) {
      var watch = document.createElement('a');
      watch.href = speaker.watchLink;
      watch.target = '_blank';
      watch.rel = 'noopener';
      watch.className = 'watch-link';
      watch.innerHTML = WATCH_ICON_SVG + ' Watch Talk';
      info.appendChild(watch);
    }

    wrap.appendChild(photoWrap);
    wrap.appendChild(info);
    return wrap;
  }

  function setupCarousel(gallery) {
    var el = document.querySelector('.photo-carousel');
    var img = document.getElementById('carouselImg');
    var bg = document.getElementById('carouselBg');
    var counter = document.getElementById('carouselCounter');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    if (!el || !img || !gallery || gallery.length === 0) return;

    var index = 0;
    var touchX = 0;

    function show(i) {
      index = (i + gallery.length) % gallery.length;
      img.style.opacity = '0';
      if (bg) bg.style.opacity = '0';
      setTimeout(function () {
        img.src = gallery[index].src;
        img.alt = gallery[index].alt || '';
        if (bg) bg.src = gallery[index].src;
        if (counter) counter.textContent = (index + 1) + ' / ' + gallery.length;
        img.style.opacity = '1';
        if (bg) bg.style.opacity = '0.75';
      }, 200);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); });

    el.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });

    show(0);
  }

  Promise.all([
    fetch('/content/events.json').then(function (r) { return r.json(); }),
    fetch('/content/speakers.json').then(function (r) { return r.json(); })
  ]).then(function (results) {
    var events = results[0].events || [];
    var speakers = results[1].speakers || [];

    var slug = new URLSearchParams(window.location.search).get('slug');
    var event = slug
      ? events.find(function (e) { return e.slug === slug; })
      : events.find(function (e) { return e.featured; }) || events[0];

    if (!event) return;

    document.title = event.title + ' | TEDxNortheasternU London';

    var titleEl = document.getElementById('flagTitle');
    if (titleEl) titleEl.textContent = event.title || '';

    var dateEl = document.getElementById('flagPillDate');
    if (dateEl) dateEl.textContent = new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    var timeEl = document.getElementById('flagPillTime');
    if (timeEl) timeEl.textContent = event.time || '';

    var locationEl = document.getElementById('flagPillLocation');
    if (locationEl) locationEl.textContent = event.location || '';

    var foodWrap = document.getElementById('flagPillFoodWrap');
    var foodEl = document.getElementById('flagPillFood');
    if (event.foodNote && foodEl) {
      foodEl.textContent = event.foodNote;
    } else if (foodWrap) {
      foodWrap.style.display = 'none';
    }

    var descEl = document.getElementById('flagDesc');
    if (descEl) descEl.textContent = event.description || '';

    var concludedEl = document.getElementById('flagConcluded');
    if (concludedEl) concludedEl.style.display = event.concluded ? 'inline-flex' : 'none';

    var heroImgEl = document.getElementById('flagHeroImg');
    if (heroImgEl && event.heroImage) {
      heroImgEl.src = event.heroImage;
      heroImgEl.alt = event.title || '';
    }

    var taglineEl = document.getElementById('flagTagline');
    if (taglineEl) taglineEl.textContent = event.tagline ? '“' + event.tagline + '”' : '';

    var eventSpeakers = speakers
      .filter(function (s) { return s.eventSlug === event.slug; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

    var studentContainer = document.getElementById('studentSpeakers');
    var industryContainer = document.getElementById('industrySpeakers');

    eventSpeakers.forEach(function (speaker) {
      var target = speaker.speakerType === 'Industry' ? industryContainer : studentContainer;
      if (!target) return;
      var card = renderSpeaker(speaker);
      target.appendChild(card);
      if (window.tedxObserveReveal) window.tedxObserveReveal(card);
    });

    setupCarousel(event.gallery || []);
  }).catch(function (err) {
    console.error('events.js: failed to load event/speaker data', err);
  });
});
