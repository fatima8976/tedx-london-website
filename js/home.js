document.addEventListener('DOMContentLoaded', function () {
  function renderStats(stats) {
    var grid = document.getElementById('statsGrid');
    if (!grid) return;
    stats.forEach(function (stat, i) {
      var tile = document.createElement('div');
      var borderRight = (i % 2 === 0) ? 'border-right:1px solid rgba(255,255,255,0.18);' : '';
      var borderBottom = (i < 2) ? 'border-bottom:1px solid rgba(255,255,255,0.18);' : '';
      tile.style.cssText = 'padding:2.5rem 2rem; text-align:center;' + borderRight + borderBottom;

      var number = document.createElement('div');
      number.style.cssText = 'font-family:var(--font-display); font-size:clamp(3rem,4.5vw,4.5rem); font-style:italic; color:#fff; line-height:1;';
      number.textContent = stat.number;

      var label = document.createElement('div');
      label.style.cssText = 'font-size:0.68rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.7); margin-top:0.6rem;';
      label.textContent = stat.label;

      tile.appendChild(number);
      tile.appendChild(label);
      grid.appendChild(tile);
    });
  }

  function renderFlagship(event) {
    if (!event) {
      var card = document.getElementById('flagshipCard');
      if (card) card.style.display = 'none';
      return;
    }

    document.getElementById('flagshipBg').src = event.heroImage || '';
    document.getElementById('flagshipEyebrow').textContent = new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('flagshipTheme').textContent = event.title || '';
    document.getElementById('flagshipDesc').textContent = event.description || '';
    document.getElementById('flagshipDate').textContent = new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('flagshipTime').textContent = event.time || '';

    var foodDetail = document.getElementById('flagshipFoodDetail');
    if (event.foodNote) {
      document.getElementById('flagshipFood').textContent = event.foodNote;
    } else if (foodDetail) {
      foodDetail.style.display = 'none';
    }

    document.getElementById('flagshipCtaLink').href = 'events.html?slug=' + encodeURIComponent(event.slug);

    var photos = document.getElementById('flagshipPhotos');
    (event.gallery || []).forEach(function (photo) {
      var img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.alt || '';
      photos.appendChild(img);
    });
  }

  function renderNews(articles) {
    var grid = document.getElementById('home-news-grid');
    if (!grid) return;
    var published = articles
      .filter(function (a) { return a.status === 'published'; })
      .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
      .slice(0, 3);

    if (published.length === 0) {
      var empty = document.createElement('p');
      empty.style.gridColumn = '1 / -1';
      empty.style.textAlign = 'center';
      empty.style.color = 'var(--text-secondary)';
      empty.textContent = 'No news yet — check back soon.';
      grid.appendChild(empty);
      return;
    }

    published.forEach(function (article) {
      var card = document.createElement('a');
      card.href = 'articles/article.html?slug=' + encodeURIComponent(article.slug);
      card.style.cssText = 'text-decoration:none; display:block; border-radius:12px; overflow:hidden; border:1px solid var(--border);';

      var imageWrap = document.createElement('div');
      imageWrap.style.cssText = 'position:relative; overflow:hidden;';
      if (article.image) {
        var img = document.createElement('img');
        img.src = article.image;
        img.alt = article.title || '';
        img.style.cssText = 'width:100%; height:180px; object-fit:cover; object-position:center; display:block;';
        imageWrap.appendChild(img);
      }
      if (article.tag) {
        var badge = document.createElement('span');
        badge.style.cssText = 'position:absolute; top:0.9rem; left:0.9rem; background:var(--red); color:#fff; font-size:0.62rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:0.2rem 0.65rem; border-radius:999px;';
        badge.textContent = article.tag;
        imageWrap.appendChild(badge);
      }

      var body = document.createElement('div');
      body.style.cssText = 'padding:1.25rem 1.4rem 1.5rem; background:var(--bg-secondary);';

      var eyebrow = document.createElement('div');
      eyebrow.style.cssText = 'font-size:0.68rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem;';
      eyebrow.textContent = article.tag || 'News';

      var title = document.createElement('div');
      title.style.cssText = 'font-family:var(--font-display); font-size:1.1rem; font-style:italic; color:var(--text-primary); line-height:1.35;';
      title.textContent = article.title || '';

      body.appendChild(eyebrow);
      body.appendChild(title);
      card.appendChild(imageWrap);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  Promise.all([
    fetch('/content/home.json').then(function (r) { return r.json(); }),
    fetch('/content/stats.json').then(function (r) { return r.json(); }),
    fetch('/content/events.json').then(function (r) { return r.json(); }),
    fetch('/content/articles.json').then(function (r) { return r.json(); })
  ]).then(function (results) {
    var home = results[0];
    var stats = results[1].stats || [];
    var events = results[2].events || [];
    var articles = results[3].articles || [];

    document.getElementById('heroTag').textContent = home.heroTag || '';
    document.getElementById('heroHeading').textContent = home.heroHeading || '';
    document.getElementById('heroSubheading').textContent = home.heroSubheading || '';
    if (home.heroImage) document.getElementById('heroImage').src = home.heroImage;
    var primaryBtn = document.getElementById('heroPrimaryBtn');
    primaryBtn.textContent = home.heroPrimaryButtonText || primaryBtn.textContent;
    if (home.heroPrimaryButtonLink) primaryBtn.href = home.heroPrimaryButtonLink;
    var secondaryBtn = document.getElementById('heroSecondaryBtn');
    secondaryBtn.textContent = home.heroSecondaryButtonText || secondaryBtn.textContent;
    if (home.heroSecondaryButtonLink) secondaryBtn.href = home.heroSecondaryButtonLink;

    document.getElementById('aboutLabel').textContent = home.aboutLabel || '';
    document.getElementById('aboutTitle').textContent = home.aboutTitle || '';
    document.getElementById('aboutParagraph1').textContent = home.aboutParagraph1 || '';
    document.getElementById('aboutParagraph2').textContent = home.aboutParagraph2 || '';
    if (home.aboutImage) document.getElementById('aboutImage').src = home.aboutImage;

    document.getElementById('missionLabel').textContent = home.missionLabel || '';
    document.getElementById('missionTitle').textContent = home.missionTitle || '';
    document.getElementById('missionQuote').textContent = home.missionQuote ? '“' + home.missionQuote + '”' : '';
    document.getElementById('missionParagraph1').textContent = home.missionParagraph1 || '';
    document.getElementById('missionParagraph2').textContent = home.missionParagraph2 || '';
    if (home.missionImage) document.getElementById('missionImage').src = home.missionImage;

    renderStats(stats);

    var featuredEvent = events.find(function (e) { return e.featured; }) || events[0];
    renderFlagship(featuredEvent);

    renderNews(articles);
  }).catch(function (err) {
    console.error('home.js: failed to load homepage data', err);
  });
});
