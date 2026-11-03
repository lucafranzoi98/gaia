document.documentElement.classList.add('js');

// Comparsa sezioni allo scroll
const io = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

// CTA mobile: nascosta quando la sezione contatti è visibile
const cta = document.querySelector('.mobile-cta');
const contatti = document.getElementById('contatti');
if (cta && contatti && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => cta.classList.toggle('hide', e.isIntersecting), { threshold: 0.05 }).observe(contatti);
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
