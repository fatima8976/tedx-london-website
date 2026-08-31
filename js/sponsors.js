document.addEventListener('DOMContentLoaded', function () {
  Promise.all([
    fetch('/content/sponsors-page.json').then(function (r) { return r.json(); }),
    fetch('/content/sponsors.json').then(function (r) { return r.json(); })
  ]).then(function (results) {
    var page = results[0];
    var sponsors = (results[1].sponsors || []).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

    document.getElementById('spHeroLabel').textContent = page.heroLabel || '';
    document.getElementById('spHeroTitle').textContent = page.heroTitle || '';
    document.getElementById('spHeroSubhead').textContent = page.heroSubhead || '';
    document.getElementById('spCtaParagraph1').textContent = page.ctaParagraph1 || '';
    document.getElementById('spCtaParagraph2').textContent = page.ctaParagraph2 || '';

    var ctaBtn = document.getElementById('spCtaBtn');
    ctaBtn.textContent = page.ctaButtonText || ctaBtn.textContent;
    if (page.ctaButtonLink) ctaBtn.href = page.ctaButtonLink;

    var grid = document.getElementById('sponsorsGrid');
    if (sponsors.length === 0) return;

    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(180px, 1fr))';
    grid.style.gap = '2rem';
    grid.style.marginBottom = '3rem';

    sponsors.forEach(function (sponsor) {
      var link = document.createElement('a');
      link.href = sponsor.websiteUrl || '#';
      link.target = '_blank';
      link.rel = 'noopener';
      link.style.cssText = 'display:flex; align-items:center; justify-content:center; padding:1.5rem;';

      var img = document.createElement('img');
      img.src = sponsor.logo || '';
      img.alt = sponsor.name || '';
      img.style.cssText = 'max-width:100%; max-height:80px; object-fit:contain;';

      link.appendChild(img);
      grid.appendChild(link);
    });
  }).catch(function (err) { console.error('sponsors.js: failed to load sponsors data', err); });
});
