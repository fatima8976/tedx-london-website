document.addEventListener('DOMContentLoaded', function () {
  var slug = new URLSearchParams(window.location.search).get('slug');
  var content = document.getElementById('roleContent');
  var notFound = document.getElementById('roleNotFound');
  var notFoundMessage = document.getElementById('roleNotFoundMessage');

  function showNotFound(message) {
    if (content) content.style.display = 'none';
    if (notFoundMessage) notFoundMessage.textContent = message;
    if (notFound) notFound.style.display = 'block';
  }

  if (!slug) {
    showNotFound("No role was specified. Head back and pick a position from the list.");
    return;
  }

  fetch('/content/roles.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var role = (data.roles || []).find(function (r) { return r.slug === slug; });
      if (!role) {
        showNotFound("We couldn't find that role — it may have closed or the link may be out of date.");
        return;
      }

      document.title = role.title + ' | TEDxNortheasternU London';
      var metaDesc = document.getElementById('pageDescription');
      if (metaDesc) metaDesc.setAttribute('content', 'Apply for the ' + role.title + ' role at TEDxNortheasternU London.');

      document.getElementById('roleBadge').textContent = role.category || '';
      document.getElementById('roleTitle').textContent = role.title || '';
      document.getElementById('roleDescription').textContent = role.description || '';
      document.getElementById('roleLocation').textContent = role.location || 'London, UK';
      document.getElementById('roleTimeCommitment').textContent = role.timeCommitment || '';

      var respList = document.getElementById('roleResponsibilities');
      (role.responsibilities || []).forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        respList.appendChild(li);
      });

      var reqList = document.getElementById('roleRequirements');
      (role.requirements || []).forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        reqList.appendChild(li);
      });

      var applyBtn = document.getElementById('roleApplyBtn');
      if (role.applyUrl) {
        applyBtn.href = role.applyUrl;
      } else {
        applyBtn.href = '#';
        applyBtn.removeAttribute('target');
        applyBtn.querySelector('span').textContent = 'Applications currently closed';
        applyBtn.style.opacity = '0.5';
        applyBtn.style.pointerEvents = 'none';
      }

      if (content) content.style.visibility = 'visible';
    })
    .catch(function (err) {
      console.error('role.js: failed to load content/roles.json', err);
      showNotFound('Something went wrong loading this role. Please try again shortly.');
    });
});
