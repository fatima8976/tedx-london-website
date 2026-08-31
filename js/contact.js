document.addEventListener('DOMContentLoaded', function () {
  fetch('/content/contact.json')
    .then(function (r) { return r.json(); })
    .then(function (contact) {
      document.getElementById('contactLabel').textContent = contact.label || '';
      document.getElementById('contactHeading').textContent = contact.heading || '';
      document.getElementById('contactBody').textContent = contact.body || '';
      var btn = document.getElementById('contactCtaBtn');
      btn.textContent = contact.ctaButtonText || btn.textContent;
    })
    .catch(function (err) { console.error('contact.js: failed to load content/contact.json', err); });
});
