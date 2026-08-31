document.addEventListener('DOMContentLoaded', function () {
  fetch('/content/settings.json')
    .then(function (r) { return r.json(); })
    .then(function (settings) {
      var socialLinks = { Instagram: settings.instagramUrl, LinkedIn: settings.linkedinUrl, WhatsApp: settings.whatsappUrl };
      Object.keys(socialLinks).forEach(function (label) {
        if (!socialLinks[label]) return;
        document.querySelectorAll('.footer-social-link[aria-label="' + label + '"]').forEach(function (a) {
          a.href = socialLinks[label];
        });
      });

      if (settings.contactEmail) {
        document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
          a.href = 'mailto:' + settings.contactEmail;
        });
      }

      if (settings.footerBlurb) {
        var blurb = document.querySelector('.footer-brand p');
        if (blurb) blurb.textContent = settings.footerBlurb;
      }
    })
    .catch(function (err) { console.error('settings.js: failed to load content/settings.json', err); });
});
