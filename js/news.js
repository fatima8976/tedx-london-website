document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('news-grid');
  if (!grid) return;

  fetch('/content/articles.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var articles = (data.articles || [])
        .filter(function (a) { return a.status === 'published'; })
        .sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

      if (articles.length === 0) {
        var empty = document.createElement('p');
        empty.style.textAlign = 'center';
        empty.style.color = 'var(--text-secondary)';
        empty.textContent = 'No news yet — check back soon.';
        grid.appendChild(empty);
        return;
      }

      articles.forEach(function (article) {
        var card = document.createElement('a');
        card.href = 'articles/article.html?slug=' + encodeURIComponent(article.slug);
        card.className = 'news-card reveal';

        var imageWrap = document.createElement('div');
        imageWrap.className = 'news-card-image-wrap';
        if (article.image) {
          var img = document.createElement('img');
          img.src = article.image;
          img.alt = article.title || '';
          imageWrap.appendChild(img);
        }
        if (article.tag) {
          var badge = document.createElement('div');
          badge.className = 'news-card-badge';
          badge.textContent = article.tag;
          imageWrap.appendChild(badge);
        }

        var body = document.createElement('div');
        body.className = 'news-card-body';

        var date = document.createElement('div');
        date.className = 'news-card-date';
        date.textContent = new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

        var title = document.createElement('div');
        title.className = 'news-card-title';
        title.textContent = article.title || '';

        var teaser = document.createElement('p');
        teaser.className = 'news-card-teaser';
        teaser.textContent = article.teaser || '';

        body.appendChild(date);
        body.appendChild(title);
        body.appendChild(teaser);

        card.appendChild(imageWrap);
        card.appendChild(body);
        grid.appendChild(card);

        if (window.tedxObserveReveal) window.tedxObserveReveal(card);
      });
    })
    .catch(function (err) { console.error('news.js: failed to load content/articles.json', err); });
});
