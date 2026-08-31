document.addEventListener('DOMContentLoaded', function () {
  var excoGrid = document.getElementById('excoGrid');
  var officersGrid = document.getElementById('officersGrid');
  if (!excoGrid && !officersGrid) return;

  function renderCard(member) {
    var card = document.createElement('div');
    card.className = 'member-card reveal';

    var photoWrap = document.createElement('div');
    photoWrap.className = 'member-photo';
    if (member.photo) {
      var img = document.createElement('img');
      img.src = member.photo;
      img.alt = member.name || member.role;
      photoWrap.appendChild(img);
    } else {
      var placeholder = document.createElement('div');
      placeholder.className = 'member-photo-placeholder';
      placeholder.textContent = '—';
      photoWrap.appendChild(placeholder);
    }

    var name = document.createElement('div');
    name.className = 'member-name';
    name.textContent = member.name || '[Name]';

    var role = document.createElement('div');
    role.className = 'member-role';
    role.textContent = member.role || '';

    card.appendChild(photoWrap);
    card.appendChild(name);
    card.appendChild(role);
    return card;
  }

  fetch('/content/members.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var members = (data.members || []).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

      members.filter(function (m) { return m.group === 'ExCo'; }).forEach(function (m) {
        if (!excoGrid) return;
        var card = renderCard(m);
        excoGrid.appendChild(card);
        if (window.tedxObserveReveal) window.tedxObserveReveal(card);
      });

      members.filter(function (m) { return m.group === 'Officers'; }).forEach(function (m) {
        if (!officersGrid) return;
        var card = renderCard(m);
        officersGrid.appendChild(card);
        if (window.tedxObserveReveal) window.tedxObserveReveal(card);
      });
    })
    .catch(function (err) { console.error('members.js: failed to load content/members.json', err); });
});
