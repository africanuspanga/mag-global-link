(function () {
  var WHATSAPP = '8618764701228';
  var header = document.getElementById('header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var wa = document.querySelector('.wa-float');
  var hasHero = !!document.querySelector('.hero');

  // Header turns solid once the page scrolls; the floating WhatsApp button
  // waits until the hero buttons are out of view on the home page.
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 24);
    if (wa) wa.classList.toggle('is-hidden', hasHero && y < window.innerHeight * 0.6);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    header.classList.toggle('is-solid', open || window.scrollY > 24);
    if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); burger.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });

  // Quick form: opens WhatsApp with the message filled in
  var form = document.getElementById('quickForm');
  if (form) {
    var name = form.elements.name;
    var nameErr = document.getElementById('qfNameErr');
    function showNameError(show) {
      name.setAttribute('aria-invalid', String(show));
      nameErr.hidden = !show;
    }
    name.addEventListener('input', function () { if (name.value.trim()) showNameError(false); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var who = name.value.trim();
      if (!who) { showNameError(true); name.focus(); return; }
      var country = form.elements.country ? form.elements.country.value : '';
      var need = form.elements.need.value;
      var msg = form.elements.message.value.trim();
      var text = 'Hello MAG Global Link, my name is ' + who +
        (country && country !== 'Another country' ? ' from ' + country : '') +
        '. I am interested in: ' + need + '.' + (msg ? '\n\n' + msg : '');
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
