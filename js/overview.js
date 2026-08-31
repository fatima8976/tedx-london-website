document.addEventListener('DOMContentLoaded', function () {
  function renderStats(stats) {
    var grid = document.getElementById('ovStatsGrid');
    if (!grid) return;
    stats.forEach(function (stat, i) {
      var tile = document.createElement('div');
      var borderRight = (i < stats.length - 1) ? 'border-right:1px solid rgba(255,255,255,0.08);' : '';
      tile.style.cssText = 'padding:2rem;' + borderRight;

      var number = document.createElement('div');
      number.style.cssText = 'font-family:var(--font-display); font-size:clamp(3.5rem,6vw,5.5rem); font-style:italic; color:var(--red); line-height:1;';
      number.textContent = stat.number;

      var label = document.createElement('div');
      label.style.cssText = 'font-size:0.72rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.4); margin-top:0.75rem;';
      label.textContent = stat.label;

      tile.appendChild(number);
      tile.appendChild(label);
      grid.appendChild(tile);
    });
  }

  Promise.all([
    fetch('/content/overview.json').then(function (r) { return r.json(); }),
    fetch('/content/stats.json').then(function (r) { return r.json(); })
  ]).then(function (results) {
    var ov = results[0];
    var stats = results[1].stats || [];

    document.getElementById('ovHeroLabel').textContent = ov.heroLabel || '';
    document.getElementById('ovHeroTitle').textContent = ov.heroTitle || '';
    document.getElementById('ovHeroBody').textContent = ov.heroBody || '';
    if (ov.heroImage) document.getElementById('ovHeroImage').src = ov.heroImage;

    document.getElementById('ovIntroParagraph').textContent = ov.introParagraph || '';
    document.getElementById('ovPullQuote').textContent = ov.pullQuote || '';
    document.getElementById('ovClosingEvent').textContent = ov.closingParagraphEvent || '';
    document.getElementById('ovClosingMission').textContent = ov.closingParagraphMission || '';

    document.getElementById('ovCtaLabel').textContent = ov.ctaLabel || '';
    document.getElementById('ovCtaTitle').textContent = ov.ctaTitle || '';
    document.getElementById('ovCtaBody').textContent = ov.ctaBody || '';

    var btn1 = document.getElementById('ovCtaBtn1');
    btn1.textContent = ov.ctaButton1Text || btn1.textContent;
    if (ov.ctaButton1Link) btn1.href = ov.ctaButton1Link;

    var btn2 = document.getElementById('ovCtaBtn2');
    btn2.textContent = ov.ctaButton2Text || btn2.textContent;
    if (ov.ctaButton2Link) btn2.href = ov.ctaButton2Link;

    renderStats(stats);
  }).catch(function (err) {
    console.error('overview.js: failed to load content/overview.json', err);
  });
});
