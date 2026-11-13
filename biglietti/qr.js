/* QR personalizzato per i biglietti: moduli tondi color inchiostro, "occhi" pervinca,
   sedia al centro. Correzione d'errore H (30%), così il logo centrale non disturba la lettura.
   Richiede qrcode-generator (qrcode.js) caricato prima. */
function qrBiglietto(url, opt = {}) {
  const ink = opt.ink || '#2B2F3A', eye = opt.eye || '#6575B0', icon = opt.icon || '../img/icona.svg';
  const qr = qrcode(0, 'H'); qr.addData(url); qr.make();
  const n = qr.getModuleCount();
  const inEye = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  // spazio libero al centro per la sedia (dispari, ~ 1/4 del lato)
  const hole = (Math.round(n * 0.26) | 1), h0 = (n - hole) / 2, h1 = h0 + hole;
  const inHole = (r, c) => r >= h0 && r < h1 && c >= h0 && c < h1;

  let out = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!qr.isDark(r, c) || inEye(r, c) || inHole(r, c)) continue;
    out += `<rect x="${c + .08}" y="${r + .08}" width=".84" height=".84" rx=".38"/>`;
  }
  const occhio = (x, y) =>
    `<rect x="${x + .5}" y="${y + .5}" width="6" height="6" rx="1.9" fill="none" stroke="${eye}" stroke-width="1"/>` +
    `<rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".9" fill="${ink}"/>`;
  // la sedia è più alta che larga (178 × 223)
  const ih = hole - 1.2, iw = ih * 177.86 / 222.67;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="geometricPrecision">` +
    `<g fill="${ink}">${out}</g>` + occhio(0, 0) + occhio(n - 7, 0) + occhio(0, n - 7) +
    `<image href="${icon}" x="${(n - iw) / 2}" y="${(n - ih) / 2}" width="${iw}" height="${ih}"/></svg>`;
}
