/* =====================================================================
   PANNELLO COLORI TEMPORANEO
   Per ora è sempre visibile (sito in test).
   Link a una palette precisa: ?colori=6575B0-A9B7A0-F2C14E-F3F2EC-2B2F3A-6B805F
   Da eliminare (insieme al blocco in fondo a script.js) quando la palette è scelta.
   ===================================================================== */

/* Palette da provare. Ruoli:
   principale = struttura, titoli, fasce blu, pulsanti secondari
   secondario = fondi morbidi, nuvolette, dettagli
   accento    = pulsante "Richiedi un primo colloquio" ed evidenziazioni
   sfondo     = fondo della pagina
   testo      = testo e footer
   fascia     = fondo della sezione "Il mio approccio" (facoltativo: se manca è il principale scurito) */
const PALETTE = [
  { nome: 'Attuale · Pervinca e salvia + giallo', principale: '#6575B0', secondario: '#A9B7A0', accento: '#F2C14E', sfondo: '#F3F2EC', testo: '#2B2F3A', fascia: '#6B805F' },
  { nome: 'Precedente · Blu e arancio', principale: '#4464AD', secondario: '#A4B0F5', accento: '#F58F29', sfondo: '#FBFAF6', testo: '#1B2340', fascia: '#3A5697' },
  { nome: '1 · Blu polvere e oliva', principale: '#496677', secondario: '#9FB2CD', accento: '#ABAC5A', sfondo: '#F0EDE8', testo: '#271203' },
  { nome: '1b · Blu polvere, fascia cacao', principale: '#496677', secondario: '#9FB2CD', accento: '#ABAC5A', sfondo: '#F0EDE8', testo: '#271203', fascia: '#271203' },
  { nome: '2 · Mimosa', principale: '#847E4E', secondario: '#BBCBDC', accento: '#FABD49', sfondo: '#FFF4E1', testo: '#1B1B1B' },
  { nome: '3 · Pervinca e salvia', principale: '#6575B0', secondario: '#A9B7A0', accento: '#EBB59A', sfondo: '#F3F2EC', testo: '#2B2F3A', fascia: '#6B805F' },
  { nome: '4 · Lino, lavanda e corallo', principale: '#A2863D', secondario: '#DAC6FF', accento: '#E65E34', sfondo: '#FFF3E3', testo: '#390404', fascia: '#390404' },
  { nome: '5 · Bosco e terracotta', principale: '#74842E', secondario: '#E5E8F5', accento: '#D9572B', sfondo: '#FAF8F5', testo: '#2A3224', fascia: '#2A3224' },
];

const RUOLI = [
  ['principale', 'Principale', 'titoli, fasce, icone'],
  ['secondario', 'Secondario', 'fondi morbidi, nuvolette'],
  ['accento', 'Accento', 'pulsante principale, evidenziati'],
  ['sfondo', 'Sfondo', 'fondo pagina'],
  ['testo', 'Testo', 'testi e footer'],
  ['fascia', 'Fascia', 'sezione "Il mio approccio"'],
];
const KEY = 'gaia-colori';
const ORIGINALI = { principale: '#6575B0', secondario: '#A9B7A0', accento: '#F2C14E' };

/* ---------- utilità colore ---------- */
const hex2rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const rgb2hex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => { const x = hex2rgb(a), y = hex2rgb(b); return rgb2hex(x.map((v, i) => v + (y[i] - v) * t)); }; // t = quanto di b
const lum = h => { const [r, g, b] = hex2rgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
const contrasto = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
const validHex = h => /^#?[0-9a-f]{6}$/i.test(h.trim()) || /^#?[0-9a-f]{3}$/i.test(h.trim());
const norm = h => { h = h.trim().replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return '#' + h.toUpperCase(); };

const fasciaDa = P => mix(P, '#000000', .14);
const val = (p, k) => p[k] || (k === 'fascia' ? fasciaDa(p.principale) : '#000000');

/* Dai colori base ricava tutte le variabili del sito */
function variabili(p) {
  const W = '#FFFFFF', { principale: P, secondario: S, accento: A, sfondo: B, testo: T } = p;
  const F = p.fascia || fasciaDa(P);
  const onP = contrasto(W, P) >= contrasto(T, P) ? W : T;
  const onF = contrasto(W, F) >= contrasto(T, F) ? W : T;
  return {
    '--blue': P,
    '--blue-deep': F,
    '--blue-soft': mix(F, W, .12),
    '--on-band': onF,
    '--on-band-soft': mix(onF, F, .12),
    '--sky': S,
    '--accent': A,
    '--accent-hover': mix(A, '#000000', .07),
    '--bg': B,
    '--surface': W,
    '--ink': T,
    '--ink-soft': mix(T, B, .3),
    '--line': mix(T, B, .88),
    '--neutral': mix(B, T, .04),
    '--lilac-soft': mix(S, W, .82),
    '--ph': mix(S, W, .55),
    '--on-primary': onP,
    '--on-blue': mix(onP, P, .12),
    '--on-sky': mix(T, S, .2),
    '--on-ink': mix(T, W, .65),
  };
}

/* Controlli di leggibilità sulle combinazioni che il sito usa davvero */
function controlli(p, v) {
  return [
    ['Testo sullo sfondo', v['--ink'], v['--bg'], 4.5],
    ['Testo secondario sullo sfondo', v['--ink-soft'], v['--bg'], 4.5],
    ['Testo sul pulsante accento', v['--ink'], p.accento, 4.5],
    ['Testo sul colore principale', v['--on-primary'], p.principale, 4.5],
    ['Testo sulla fascia', v['--on-band'], v['--blue-deep'], 4.5],
    ['Testo sulle nuvolette', v['--ink'], p.secondario, 4.5],
    ['Titoletti nel colore principale', p.principale, v['--bg'], 3],
  ].map(([nome, a, b, min]) => ({ nome, r: contrasto(a, b), ok: contrasto(a, b) >= min }));
}

/* ---------- loghi: ricolora gli SVG ---------- */
const svgCache = {};
async function ricoloraLoghi(p) {
  for (const img of document.querySelectorAll('img[src$=".svg"]')) {
    const src = img.dataset.origSrc || img.getAttribute('src');
    img.dataset.origSrc = src;
    try {
      svgCache[src] ??= await fetch(src).then(r => r.text());
      let svg = svgCache[src];
      for (const k in ORIGINALI) svg = svg.replace(new RegExp(ORIGINALI[k], 'gi'), p[k]);
      svg = svg.replace(/#F0F2EE/gi, variabili(p)['--lilac-soft']);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    } catch { /* se non riesce, resta il logo originale */ }
  }
}

/* ---------- applica / salva ---------- */
let corrente = { ...PALETTE[0] };
function applica(p) {
  corrente = { ...p, fascia: p.fascia || fasciaDa(p.principale) };
  p = corrente;
  const v = variabili(p);
  // la palette attuale usa i valori rifiniti a mano nel CSS: non sovrascriverli
  const attuale = RUOLI.every(([k]) => p[k].toUpperCase() === PALETTE[0][k].toUpperCase());
  for (const k in v) attuale ? document.documentElement.style.removeProperty(k) : document.documentElement.style.setProperty(k, v[k]);
  try { sessionStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  ricoloraLoghi(p);
  aggiornaUI();
}

/* ---------- interfaccia ---------- */
const host = document.createElement('div');
host.id = 'pannello-colori';
const root = host.attachShadow({ mode: 'open' });
root.innerHTML = `
<style>
  :host { all: initial; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
  * { box-sizing: border-box; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
  .fab { position: fixed; left: 16px; bottom: 16px; z-index: 2147483000; border: 0; border-radius: 99px;
    padding: 12px 18px; background: #111; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer;
    box-shadow: 0 8px 24px rgba(0,0,0,.3); }
  .panel { position: fixed; left: 16px; bottom: 16px; z-index: 2147483001; width: 330px; max-width: calc(100vw - 32px);
    height: 50vh; min-height: 380px; max-height: calc(100vh - 32px); display: flex; flex-direction: column; overflow: hidden; background: #fff; color: #111; border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,.35); padding: 16px; font-size: 13px; }
  .panel[hidden], .fab[hidden] { display: none; }
  .top { flex: none; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  h2 { font-size: 15px; margin: 0; }
  h3 { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #666; margin: 16px 0 8px; }
  .sec { border-top: 1px solid #eee; }
  .sec > summary { list-style: none; display: flex; align-items: center; gap: 10px; padding: 12px 2px; cursor: pointer; user-select: none; }
  .sec > summary::-webkit-details-marker { display: none; }
  .sec > summary::after { content: ""; flex: none; width: 8px; height: 8px; margin: 0 4px 3px 0; border: solid #888;
    border-width: 0 2px 2px 0; transform: rotate(45deg); transition: transform .2s; }
  .sec[open] > summary::after { transform: rotate(-135deg); margin-bottom: -3px; }
  .sec > summary > :nth-child(2) { margin-left: auto; }
  .sec > summary .lbl { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #666; font-weight: 700; flex: none; }
  .sec > summary .cur { display: flex; align-items: center; gap: 8px; min-width: 0; margin-left: auto; font-weight: 600; }
  .sec > summary .cur span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sec .body { padding: 0 0 14px; }
  .sw.mini { width: 56px; height: 18px; border-radius: 5px; }
  .stato { margin-left: auto; font-weight: 600; }
  button { font: inherit; cursor: pointer; }
  .x { border: 0; background: #eee; border-radius: 99px; width: 28px; height: 28px; font-size: 16px; line-height: 1; }
  .presets { display: grid; gap: 6px; }
  .preset { display: flex; align-items: center; gap: 10px; border: 1.5px solid #ddd; background: #fff; border-radius: 10px; padding: 8px 10px; text-align: left; }
  .preset.on { border-color: #111; }
  .preset { padding: 8px; gap: 12px; font-weight: 600; }
  .sw { display: flex; width: 96px; height: 28px; border-radius: 8px; overflow: hidden; flex: none; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
  .sw i { flex: 1; } .sw i:first-child { flex: 2; }
  .strip { display: flex; height: 18px; width: 72px; border-radius: 5px; overflow: hidden; margin-left: auto;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
  .strip i { flex: 1; transition: background-color .25s, flex .25s; }
  .strip i:first-child { flex: 2; }
  .roles-list { display: grid; gap: 6px; }
  .row { display: flex; align-items: center; gap: 12px; padding: 8px 10px 8px 8px; border-radius: 14px;
    background: #f6f6f4; transition: background .15s; }
  .row:hover { background: #efefec; }
  .chip { position: relative; flex: none; width: 44px; height: 44px; border-radius: 12px; cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,.1), 0 2px 6px -2px rgba(0,0,0,.25); transition: transform .15s, background-color .25s; }
  .chip:hover { transform: scale(1.06); }
  .chip::after { content: ""; position: absolute; inset: 0; margin: auto; width: 16px; height: 16px; opacity: 0; transition: opacity .15s;
    background: var(--pen) center / contain no-repeat; }
  .chip:hover::after { opacity: 1; }
  .chip input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; border: 0; padding: 0; }
  .chip:focus-within { outline: 2px solid #111; outline-offset: 2px; }
  .info { flex: 1; min-width: 0; }
  .info b { display: block; font-size: 13px; line-height: 1.2; } .info small { display: block; color: #777; font-size: 11px; margin-top: 2px; }
  .hex { display: flex; align-items: center; flex: none; width: 82px; background: #fff; border-radius: 99px; padding: 5px 10px;
    box-shadow: inset 0 0 0 1px #e2e2de; font: 12px/1 ui-monospace, SFMono-Regular, Menlo, monospace; color: #999; }
  .hex:focus-within { box-shadow: inset 0 0 0 1.5px #111; }
  .hex input { width: 100%; border: 0; outline: 0; padding: 0; background: none; font: inherit; color: #111; text-transform: uppercase; }
  .btns { display: flex; gap: 6px; margin-top: 14px; flex-wrap: wrap; }
  .scroll { flex: 1; min-height: 0; overflow: auto; overscroll-behavior: contain; margin: 0 -16px; padding: 0 16px; }
  .foot { flex: none; padding-top: 4px; border-top: 1px solid #eee; }
  .copy { display: inline-flex; align-items: center; gap: 10px; }
  .copy .sw.mini { width: 48px; height: 16px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.35); }
  .btn { border: 0; border-radius: 99px; padding: 8px 14px; background: #111; color: #fff; font-weight: 600; }
  .btn.alt { background: #eee; color: #111; }
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 4px; }
  li { display: flex; justify-content: space-between; gap: 8px; }
  .ok { color: #1a7f37; } .ko { color: #c0392b; font-weight: 600; }
  .note { color: #777; font-size: 11px; margin: 6px 0 0; }
  .msg { color: #1a7f37; font-size: 12px; min-height: 1em; margin-top: 6px; }
</style>
<button class="fab" type="button">🎨 Colori</button>
<div class="panel" hidden>
  <div class="top"><h2>Prova colori</h2><button class="x" type="button" aria-label="Chiudi">×</button></div>
  <div class="scroll">
  <details class="sec dd">
    <summary><span class="lbl">Palette</span><span class="cur"></span></summary>
    <div class="body presets"></div>
  </details>
  <details class="sec">
    <summary><span class="lbl">Modifica a mano</span><span class="strip" aria-hidden="true"></span></summary>
    <div class="body">
      <div class="roles roles-list"></div>
    </div>
  </details>
  <details class="sec">
    <summary><span class="lbl">Leggibilità</span><span class="stato"></span></summary>
    <div class="body">
      <ul class="checks"></ul>
      <p class="note">Rosso = il testo rischia di leggersi male (sotto la soglia di contrasto consigliata).</p>
    </div>
  </details>
  </div>
  <div class="foot">
  <div class="btns">
    <button class="btn copy" type="button"><span class="sw mini"></span>Copia i colori</button>
    <button class="btn alt reset" type="button">Ripristina</button>
  </div>
  <div class="msg" role="status"></div>
  </div>
</div>`;

const $ = s => root.querySelector(s);
const fab = $('.fab'), panel = $('.panel');
fab.onclick = () => { panel.hidden = false; fab.hidden = true; };
$('.x').onclick = () => { panel.hidden = true; fab.hidden = false; };

$('.presets').innerHTML = PALETTE.map((p, i) => `
  <button class="preset" type="button" data-i="${i}">
    <span class="sw">${RUOLI.map(([k]) => `<i style="background:${val(p, k)}"></i>`).join('')}</span>
    <span>${p.nome}</span>
  </button>`).join('');
$('.presets').onclick = e => { const b = e.target.closest('.preset'); if (b) applica(PALETTE[b.dataset.i]); };

$('.roles').innerHTML = RUOLI.map(([k, nome, uso]) => `
  <div class="row">
    <label class="chip" data-k="${k}" title="Scegli il colore ${nome.toLowerCase()}">
      <input type="color" data-k="${k}" aria-label="${nome}">
    </label>
    <span class="info"><b>${nome}</b><small>${uso}</small></span>
    <label class="hex">#<input type="text" data-k="${k}" maxlength="7" spellcheck="false" aria-label="Codice ${nome}"></label>
  </div>`).join('');
$('.strip').innerHTML = RUOLI.map(([k]) => `<i data-k="${k}"></i>`).join('');
root.querySelectorAll('.roles input').forEach(inp => {
  inp.addEventListener('input', () => {
    if (!validHex(inp.value)) return;
    applica({ ...corrente, nome: 'Personalizzata', [inp.dataset.k]: norm(inp.value) });
  });
});

$('.copy').onclick = async () => {
  const link = `${location.origin}${location.pathname}?colori=${RUOLI.map(([k]) => corrente[k].slice(1)).join('-')}`;
  const testo = RUOLI.map(([k, nome]) => `${nome}: ${corrente[k]}`).join('\n') + `\n\nAnteprima: ${link}`;
  try { await navigator.clipboard.writeText(testo); }
  catch { // browser più vecchi
    const t = document.createElement('textarea');
    t.value = testo; t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
  }
  msg('Colori copiati! Incollali in un messaggio.');
};
$('.reset').onclick = () => applica(PALETTE[0]);

function msg(t) { $('.msg').textContent = t; }

function aggiornaUI() {
  root.querySelectorAll('.roles input').forEach(inp => {
    const v = corrente[inp.dataset.k];
    if (inp.type === 'color') inp.value = v.toLowerCase();
    else if (root.activeElement !== inp) inp.value = v.slice(1);
  });
  root.querySelectorAll('.chip, .strip i').forEach(el => {
    const v = corrente[el.dataset.k];
    el.style.backgroundColor = v;
    // matita bianca o scura a seconda del colore
    const c = contrasto('#FFFFFF', v) >= contrasto('#111111', v) ? 'white' : '%23111';
    el.style.setProperty('--pen', `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${c}' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 20h4L19 9l-4-4L4 16z'/%3E%3C/svg%3E")`);
  });
  root.querySelectorAll('.preset').forEach(b => {
    const p = PALETTE[b.dataset.i];
    b.classList.toggle('on', RUOLI.every(([k]) => val(p, k).toUpperCase() === corrente[k].toUpperCase()));
  });
  const ck = controlli(corrente, variabili(corrente));
  $('.checks').innerHTML = ck.map(c =>
    `<li><span>${c.nome}</span><span class="${c.ok ? 'ok' : 'ko'}">${c.ok ? '✓' : '⚠'} ${c.r.toFixed(1)}</span></li>`).join('');
  const ko = ck.filter(c => !c.ok).length;
  $('.stato').className = 'stato ' + (ko ? 'ko' : 'ok');
  $('.stato').textContent = ko ? `⚠ ${ko} da controllare` : '✓ tutto ok';
  const scelta = PALETTE.find(p => RUOLI.every(([k]) => val(p, k).toUpperCase() === corrente[k].toUpperCase()));
  $('.copy .sw').innerHTML = RUOLI.map(([k]) => `<i style="background:${corrente[k]}"></i>`).join('');
  $('.cur').innerHTML = `<span class="sw mini">${RUOLI.map(([k]) => `<i style="background:${corrente[k]}"></i>`).join('')}</span><span>${scelta ? scelta.nome : 'Personalizzata'}</span>`;
}

document.body.appendChild(host);
let salvata = null;
try { salvata = JSON.parse(sessionStorage.getItem(KEY)); } catch {}
const daLink = (new URLSearchParams(location.search).get('colori') || '').match(/[0-9a-f]{6}/gi);
if (daLink) {
  salvata = { ...PALETTE[0], nome: 'Da link' };
  delete salvata.fascia;
  RUOLI.forEach(([k], i) => { if (daLink[i]) salvata[k] = norm(daLink[i]); });
}
applica(salvata && RUOLI.every(([k]) => k === 'fascia' || validHex(salvata[k] || '')) ? salvata : PALETTE[0]);
// pannello già aperto se l'indirizzo finisce con #apri
if (location.hash === '#apri') fab.click();
