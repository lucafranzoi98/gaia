document.documentElement.classList.add('js');

// Comparsa sezioni allo scroll
const io = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

// CTA mobile: visibile solo dopo i bottoni dell'apertura, nascosta su contatti e footer
const cta = document.querySelector('.mobile-cta');
const contatti = document.getElementById('contatti');
const footer = document.querySelector('.site-footer');
if (cta && contatti && 'IntersectionObserver' in window) {
  const visible = new Set();
  const ctaObs = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
    cta.classList.toggle('hide', visible.size > 0);
  }, { threshold: 0.05 });
  ctaObs.observe(contatti);
  if (footer) ctaObs.observe(footer);
  const heroBtns = document.querySelector('.hero .btn-row');
  if (heroBtns) ctaObs.observe(heroBtns);
}

// Menu mobile
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Form contatti (Web3Forms)
const form = document.getElementById('contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type=submit]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    status.textContent = 'Invio in corso…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (data.success) {
        form.reset();
        status.textContent = 'Grazie! Ho ricevuto il tuo messaggio e ti risponderò al più presto.';
      } else {
        status.textContent = 'Si è verificato un errore: ' + (data.message || 'riprova più tardi.');
      }
    } catch {
      status.textContent = 'Errore di connessione. Riprova o scrivimi via email.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Tab "Chi sono"
document.querySelectorAll('.tablist').forEach(list => {
  const tabs = [...list.querySelectorAll('[role=tab]')];
  const select = (tab) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      select(next); next.focus();
    });
  });
});
