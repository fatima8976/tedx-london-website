document.addEventListener('DOMContentLoaded', function () {
  var slug = new URLSearchParams(window.location.search).get('slug');
  var content = document.getElementById('articleContent');
  var notFound = document.getElementById('articleNotFound');
  var notFoundMessage = document.getElementById('articleNotFoundMessage');

  function showNotFound(message) {
    if (content) content.style.display = 'none';
    if (notFoundMessage) notFoundMessage.textContent = message;
    if (notFound) notFound.style.display = 'block';
  }

  if (!slug) {
    showNotFound('No article was specified. Head back to News and pick a story.');
    return;
  }

  fetch('/content/articles.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var article = (data.articles || []).find(function (a) { return a.slug === slug; });
      if (!article) {
        showNotFound("We couldn't find that article — the link may be out of date.");
        return;
      }

      document.title = article.title + ' | TEDxNortheasternU London';
      var metaDesc = document.getElementById('pageDescription');
      if (metaDesc) metaDesc.setAttribute('content', article.teaser || article.title);

      document.getElementById('articleImage').src = article.image || '';
      document.getElementById('articleImage').alt = article.title || '';
      document.getElementById('articleTag').textContent = article.tag || '';
      document.getElementById('articleTitle').textContent = article.title || '';
      document.getElementById('articleDate').textContent = new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

      var bodyEl = document.getElementById('articleBody');
      if (window.marked) {
        bodyEl.innerHTML = window.marked.parse(article.body || '');
      } else {
        bodyEl.textContent = article.body || '';
      }

      if (content) content.style.visibility = 'visible';
    })
    .catch(function (err) {
      console.error('article.js: failed to load content/articles.json', err);
      showNotFound('Something went wrong loading this article. Please try again shortly.');
    });
});
