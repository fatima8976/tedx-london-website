document.addEventListener('DOMContentLoaded', function () {
  fetch('/content/workshop-series.json')
    .then(function (r) { return r.json(); })
    .then(function (ws) {
      document.getElementById('wsHeroTitle').textContent = ws.heroTitle || '';
      document.getElementById('wsHeroIntro').textContent = ws.heroIntro || '';
      if (ws.heroImage) document.getElementById('wsHeroImage').src = ws.heroImage;

      document.getElementById('wsIntroParagraph1').textContent = ws.introParagraph1 || '';
      document.getElementById('wsIntroParagraph2').textContent = ws.introParagraph2 || '';
      document.getElementById('wsPullQuote').textContent = ws.pullQuote || '';
      document.getElementById('wsGalleryLabel').textContent = ws.galleryLabel || '';

      var gallery = document.getElementById('wsGallery');
      (ws.gallery || []).forEach(function (photo) {
        var img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt || '';
        img.style.cssText = 'width:100%; border-radius:12px; object-fit:cover; aspect-ratio:4/3; display:block;';
        gallery.appendChild(img);
      });
    })
    .catch(function (err) { console.error('workshop-series.js: failed to load content/workshop-series.json', err); });
});
