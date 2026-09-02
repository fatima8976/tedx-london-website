document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('open-positions');
  if (!grid) return;

  fetch('/content/roles.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var roles = (data.roles || [])
        .filter(function (r) { return r.status === 'open'; })
        .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

      if (roles.length === 0) {
        var empty = document.createElement('p');
        empty.style.textAlign = 'center';
        empty.style.color = 'var(--text-secondary)';
        empty.textContent = 'No open positions right now — check back soon.';
        grid.appendChild(empty);
        return;
      }

      roles.forEach(function (role) {
        var link = document.createElement('a');
        link.href = 'roles/role?slug=' + encodeURIComponent(role.slug);
        link.className = 'open-position-card-link reveal';

        var card = document.createElement('div');
        card.className = 'open-position-card';

        var meta = document.createElement('div');
        meta.className = 'open-position-meta';

        var tag = document.createElement('span');
        tag.className = 'open-position-tag';
        tag.textContent = role.category || '';

        var badge = document.createElement('span');
        badge.className = 'open-badge';
        badge.textContent = 'Opening Soon';

        meta.appendChild(tag);
        meta.appendChild(badge);

        var title = document.createElement('div');
        title.className = 'open-position-title';
        title.textContent = role.title || '';

        card.appendChild(meta);
        card.appendChild(title);
        link.appendChild(card);
        grid.appendChild(link);

        if (window.tedxObserveReveal) window.tedxObserveReveal(link);
      });
    })
    .catch(function (err) { console.error('join.js: failed to load content/roles.json', err); });
});
