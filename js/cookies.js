(() => {
  const K = 'chavita-consent';
  let st = null;
  try { st = localStorage.getItem(K); } catch {}
  const games = document.body.hasAttribute('data-games');
  const ui = document.createElement('div'); document.body.append(ui);
  const COOKIE = '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><mask id="bite"><rect width="64" height="64" fill="#fff"/><circle cx="51" cy="11" r="9" fill="#000"/><circle cx="59" cy="27" r="6" fill="#000"/></mask></defs><circle cx="32" cy="32" r="28" fill="#DAD7CD" mask="url(#bite)"/><g fill="#1f3326"><circle cx="20" cy="24" r="3.5"/><circle cx="32" cy="40" r="3.5"/><circle cx="45" cy="38" r="3"/><circle cx="20" cy="43" r="3"/><circle cx="32" cy="21" r="2.5"/></g></svg>';
  const wipe = () => { try { Object.keys(localStorage).filter(k => k.startsWith('chavita-') && k !== K).forEach(k => localStorage.removeItem(k)); } catch {} };
  const toast = t => { const n = document.createElement('div'); n.className = 'toast'; n.setAttribute('role', 'status'); n.textContent = t; document.body.append(n); setTimeout(() => n.remove(), 3500); };
  function render() {
    if (!games) return;
    ui.innerHTML = st === null
      ? `<div class="consent" role="region" aria-label="Cookies"><p><b>¿Guardamos tu progreso?</b> Chavita Arcade puede usar cookies y almacenamiento local de tu navegador para guardar tus récords y avances. Si rechazas, podrás jugar igual, pero nada se guardará. <a href="../cookies/">Política de cookies</a></p><div class="cta"><button class="btn" data-c="yes">Aceptar</button><button class="btn alt" data-c="no">Rechazar</button></div></div>`
      : st === 'no' ? `<button class="cookie-btn" aria-label="Activar cookies para guardar mi progreso" title="Activar cookies para guardar mi progreso">${COOKIE}<span>Activar cookies</span></button>` : '';
  }
  function set(v) {
    st = v; try { localStorage.setItem(K, v); } catch {}
    if (v === 'no') wipe();
    render(); dispatchEvent(new CustomEvent('consent', { detail: v }));
  }
  ui.addEventListener('click', e => {
    const b = e.target.closest('[data-c],.cookie-btn'); if (!b) return;
    set(b.dataset.c || 'yes'); if (!b.dataset.c) toast('Cookies activadas. Tu progreso se guardará.');
  });
  document.querySelectorAll('[data-revocar]').forEach(b => b.addEventListener('click', () => {
    set('no'); const s = document.getElementById('revocar-estado'); if (s) s.textContent = 'Listo: se borró tu progreso y ya no se guardará.';
  }));
  window.Consent = { ok: () => st === 'yes', set };
  render();
})();
