document.addEventListener('DOMContentLoaded', function () {
  var section = document.getElementById('speakerCallSection');
  if (!section) return;

  fetch('/content/speaker-call.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.active) return;

      if (data.deadline) {
        var deadlineDate = new Date(data.deadline + 'T23:59:59');
        if (deadlineDate < new Date()) return;
      }

      document.getElementById('speakerCallEyebrow').textContent = data.eyebrow || '';
      document.getElementById('speakerCallTitle').textContent = data.title || '';
      document.getElementById('speakerCallDescription').textContent = data.description || '';
      document.getElementById('speakerCallTiming').textContent = data.eventTiming || '';

      if (data.deadline) {
        var displayDate = new Date(data.deadline + 'T00:00:00');
        document.getElementById('speakerCallDeadline').textContent = displayDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      }

      var btn = document.getElementById('speakerCallButton');
      btn.textContent = data.buttonText || 'Apply Now';
      btn.href = data.formUrl || '#';

      section.style.display = 'block';
    })
    .catch(function (err) { console.error('speaker-call.js: failed to load content/speaker-call.json', err); });
});
