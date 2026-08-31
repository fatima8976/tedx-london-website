document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('teamsGrid');
  if (!grid) return;

  fetch('/content/teams.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var teams = (data.teams || []).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

      teams.forEach(function (team) {
        var card = document.createElement('div');
        card.className = 'role-card reveal';

        var icon = document.createElement('div');
        icon.className = 'role-icon';
        icon.textContent = team.icon || '';

        var title = document.createElement('h3');
        title.textContent = team.title || '';

        var desc = document.createElement('p');
        desc.textContent = team.description || '';

        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(desc);
        grid.appendChild(card);

        if (window.tedxObserveReveal) window.tedxObserveReveal(card);
      });
    })
    .catch(function (err) { console.error('teams.js: failed to load content/teams.json', err); });
});
