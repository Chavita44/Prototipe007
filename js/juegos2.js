(() => {
  const $ = id => document.getElementById(id);
  const C = { bg: '#3A5A40', fg: '#DAD7CD', dk: '#1f3326' };
  const ld = k => { if (!Consent.ok()) return null; try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const sv = (k, v) => { if (Consent.ok()) try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const fmt = n => { if (n < 1e3) return String(Math.floor(n)); const u = ['K', 'M', 'B', 'T', 'Qa']; let i = -1; while (n >= 1e3 && i < 4) { n /= 1e3; i++; } return n.toFixed(n < 10 ? 2 : n < 100 ? 1 : 0) + u[i]; };
  const sum = (a, f) => a.reduce((t, x, i) => t + f(x, i), 0);
  const cube = new Image(); cube.src = '../assets/minilogo.png';
  const drawCube = (g, x, y, w, h) => cube.complete && cube.naturalWidth ? g.drawImage(cube, x, y, w, h) : g.fillRect(x, y, w, h);
  const say = (g, w, h, t) => { g.fillStyle = C.fg; g.font = '600 22px "JetBrains Mono",monospace'; g.textAlign = 'center'; g.fillText(t, w / 2, h / 2); };
  const hud = (g, t) => { g.fillStyle = C.fg; g.font = '600 18px "JetBrains Mono",monospace'; g.textAlign = 'left'; g.fillText(t, 14, 26); };
  const poly = (g, pts) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); };
  const keys = {}; let cur = '';
  const loop = (name, fn) => { let on = false, last = 0; return () => { if (on) return; on = true; const f = t => { if (cur !== name) { on = false; return; } const dt = Math.min((t - last) / 1000, .05) || 0; last = t; fn(dt); requestAnimationFrame(f); }; requestAnimationFrame(f); }; };

  /* ---------- IDLE: Código infinito ---------- */
  const IT = [['Teclado mecánico', '+1 por clic', 15, 'c', 1], ['Tutorial de YouTube', '+1 línea/s', 50, 'a', 1], ['Café', '+6 líneas/s', 400, 'a', 6], ['Servidor propio', '+40 líneas/s', 3000, 'a', 40], ['Copiloto de IA', '+250 líneas/s', 25000, 'a', 250], ['Compilador cuántico', '+1,800 líneas/s', 200000, 'a', 1800]];
  const I = Object.assign({ n: 0, own: IT.map(() => 0), t: Date.now() }, ld('chavita-idle'));
  const iCost = i => Math.ceil(IT[i][2] * 1.15 ** I.own[i]);
  const iClick = () => 1 + sum(IT, (x, i) => x[3] === 'c' ? I.own[i] * x[4] : 0);
  const iRate = () => sum(IT, (x, i) => x[3] === 'a' ? I.own[i] * x[4] : 0);
  const idle = $('idle');
  idle.innerHTML = `<p class="tag">[ idle · código infinito ]</p><div class="stat" id="in"></div><p class="tag" id="ir"></p><button class="btn" id="ic"></button><div class="lst">${IT.map((x, i) => `<button class="btn alt row" data-i="${i}"><span><b>${x[0]}</b><br>${x[1]}</span><span></span></button>`).join('')}</div><p class="tag" id="io"></p>`;
  const iRender = () => {
    idle.querySelector('#in').textContent = fmt(I.n) + ' líneas';
    idle.querySelector('#ir').textContent = '[ ' + fmt(iRate()) + ' líneas por segundo ]';
    idle.querySelector('#ic').textContent = 'Escribir código +' + fmt(iClick());
    idle.querySelectorAll('[data-i]').forEach(b => { const i = +b.dataset.i, c = iCost(i); b.lastChild.textContent = 'x' + I.own[i] + ' · ' + fmt(c); b.disabled = I.n < c; });
  };
  idle.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'ic') I.n += iClick();
    else if (b.dataset.i) { const i = +b.dataset.i, c = iCost(i); if (I.n >= c) { I.n -= c; I.own[i]++; } }
    iRender();
  });
  idle.querySelector('#io').textContent = '[ el progreso avanza solo mientras juegas y se pausa al cambiar de juego ]'; iRender();

  /* ---------- TYCOON: Estudio Chavita ---------- */
  const TS = [['Escritorio freelance', 1, 20], ['Estudio de diseño', 6, 150], ['Servidor de apps', 30, 1100], ['Equipo de QA', 160, 8000], ['Marketing', 900, 60000], ['Sede central', 5000, 450000]];
  const T = Object.assign({ m: 25, tot: 0, lv: TS.map(() => 0), t: Date.now(), bn: 0, goal: 5000, msg: '' }, ld('chavita-tycoon'));
  const tInc = () => sum(TS, (x, i) => x[1] * T.lv[i]);
  const tCost = i => Math.ceil(TS[i][2] * 1.5 ** T.lv[i]);
  const gain = v => { T.m += v; T.tot += v; if (T.tot >= T.goal) { T.goal *= 10; T.msg = '¡Lanzaste un juego! Nueva meta arriba'; } };
  const tyc = $('tycoon');
  tyc.innerHTML = `<p class="tag">[ tycoon · estudio chavita ]</p><div class="stat" id="tm"></div><p class="tag" id="ti"></p><div class="prog"><i></i></div><p class="tag" id="tg"></p><button class="btn" id="tb"></button><div class="slots">${TS.map((x, i) => `<button class="btn alt row" data-s="${i}"><b>${x[0]}</b><span></span><span></span></button>`).join('')}</div>`;
  const tRender = () => {
    const q = s => tyc.querySelector(s), w = Math.ceil((T.bn - Date.now()) / 1000);
    q('#tm').textContent = '$' + fmt(T.m); q('#ti').textContent = '[ +$' + fmt(tInc()) + ' por segundo ]';
    q('.prog i').style.width = Math.min(100, T.tot / T.goal * 100) + '%';
    q('#tg').textContent = (T.msg ? T.msg + ' · ' : '') + 'Meta de lanzamiento: $' + fmt(T.tot) + ' / $' + fmt(T.goal);
    const b = q('#tb'); b.disabled = w > 0; b.textContent = w > 0 ? 'Cliente VIP llega en ' + w + 's' : 'Cliente VIP: cobrar bono';
    tyc.querySelectorAll('[data-s]').forEach(el => {
      const i = +el.dataset.s, c = tCost(i), l = T.lv[i];
      el.children[1].textContent = l ? 'Nivel ' + l + ' · +$' + fmt(TS[i][1] * l) + '/s' : 'Sin construir';
      el.children[2].textContent = (l ? 'Mejorar' : 'Construir') + ' · $' + fmt(c); el.disabled = T.m < c;
    });
  };
  tyc.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'tb' && Date.now() >= T.bn) { gain(Math.max(25, tInc() * 30)); T.bn = Date.now() + 30000; }
    else if (b.dataset.s) { const i = +b.dataset.s, c = tCost(i); if (T.m >= c) { T.m -= c; T.lv[i]++; } }
    tRender();
  });
  tRender();

  let ticks = 0, lastT = Date.now();
  setInterval(() => {
    const now = Date.now(), dt = Math.min(now - lastT, 1000) / 1000; lastT = now;
    if (cur === 'idle') { I.n += iRate() * dt; iRender(); }
    if (cur === 'tycoon') { gain(tInc() * dt); tRender(); }
    if (++ticks % 30 === 0) persist();
  }, 100);

  /* ---------- PLATAFORMAS ---------- */
  const pc = $('pcv'), pg = pc.getContext('2d'), TL = 40, COLS = 24, ROWS = 12, PW = 26, PH = 34;
  // f: huecos en el piso · p: plataformas [fila, columna, largo] · st: estrellas · sp: picos [fila, columna]
  const rg = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const LV = [
    { f: [], p: [[9, 3, 3], [7, 8, 3], [5, 13, 3], [7, 18, 3]], st: [[10, 10], [8, 4], [6, 9], [4, 14], [6, 19]], sp: [] },
    { f: [7, 8, 15, 16], p: [[9, 3, 3], [7, 7, 3], [5, 11, 3], [7, 16, 3]], st: [[8, 4], [6, 8], [4, 12], [6, 17], [10, 21]], sp: [[10, 11], [10, 12]] },
    { f: [6, 7, 13, 14, 20, 21], p: [[9, 3, 3], [7, 8, 3], [5, 12, 3], [3, 16, 3], [7, 20, 3]], st: [[8, 4], [6, 9], [4, 13], [2, 17], [6, 21]], sp: [[10, 10], [10, 17]] },
    { f: rg(4, 19), p: [[9, 2, 3], [7, 6, 3], [5, 10, 3], [3, 14, 3], [5, 18, 3], [7, 21, 2]], st: [[8, 3], [6, 7], [4, 11], [2, 15], [4, 19], [6, 21]], sp: [[10, 21], [10, 22]] },
    { f: rg(3, 22), p: [[9, 3, 2], [7, 7, 2], [5, 11, 2], [5, 16, 2], [7, 21, 2]], st: [[8, 4], [6, 8], [4, 12], [4, 17], [6, 22], [10, 23]], sp: [[10, 2]] }
  ];
  let G, left, lvl = 0;
  const P = { s: 'idle', d: 0, mt: 0 };
  const spawn = () => Object.assign(P, { x: TL + 7, y: 11 * TL - PH - .01, vx: 0, vy: 0, g: false });
  const lvlLoad = n => {
    const L = LV[n]; G = Array.from({ length: ROWS }, () => Array(COLS).fill('.'));
    for (let c = 0; c < COLS; c++) if (!L.f.includes(c)) G[11][c] = '#';
    L.p.forEach(([r, c, w]) => { for (let i = 0; i < w; i++) G[r][c + i] = '#'; });
    L.st.forEach(([r, c]) => G[r][c] = '*'); L.sp.forEach(([r, c]) => G[r][c] = '^');
    left = L.st.length; spawn();
  };
  const solid = (c, r) => c < 0 || c >= COLS ? true : r < 0 || r >= ROWS ? false : G[r][c] === '#';
  const hit = () => { for (let r = Math.floor(P.y / TL); r <= Math.floor((P.y + PH - 1) / TL); r++) for (let c = Math.floor(P.x / TL); c <= Math.floor((P.x + PW - 1) / TL); c++) if (solid(c, r)) return true; return false; };
  const die = () => { P.d++; spawn(); };
  const pSave = ld('chavita-plat') || {};
  const pStart = () => { if (cur !== 'plat' || P.s === 'play') return; lvl = P.s === 'won' ? 0 : Math.min(pSave.l || 0, LV.length - 1); P.d = 0; P.s = 'play'; lvlLoad(lvl); P.mt = 1.5; };
  lvlLoad(lvl = Math.min(pSave.l || 0, LV.length - 1));
  function pUpdate(dt) {
    if (P.mt > 0) P.mt -= dt;
    if (P.s !== 'play') return;
    const dir = (keys.ArrowRight || keys.d || keys.D || keys.padR ? 1 : 0) - (keys.ArrowLeft || keys.a || keys.A || keys.padL ? 1 : 0);
    const up = keys.ArrowUp || keys.w || keys.W || keys[' '] || keys.padU;
    P.vy = Math.min(P.vy + 1800 * dt, 900);
    if (up && P.g) { P.vy = -620; P.g = false; } else if (!up && P.vy < -200) P.vy = -200;
    P.x += dir * 230 * dt;
    if (hit()) P.x = dir > 0 ? Math.floor((P.x + PW) / TL) * TL - PW - .01 : (Math.floor(P.x / TL) + 1) * TL + .01;
    P.y += P.vy * dt; P.g = false;
    if (hit()) { if (P.vy > 0) { P.y = Math.floor((P.y + PH) / TL) * TL - PH - .01; P.g = true; } else P.y = (Math.floor(P.y / TL) + 1) * TL + .01; P.vy = 0; }
    for (const fy of [4, PH / 2, PH - 4]) { const c = Math.floor((P.x + PW / 2) / TL), r = Math.floor((P.y + fy) / TL); if (G[r] && G[r][c] === '*') { G[r][c] = '.'; left--; } }
    for (const fx of [6, PW - 6]) { const c = Math.floor((P.x + fx) / TL), r = Math.floor((P.y + PH - 3) / TL); if (G[r] && G[r][c] === '^' && P.y + PH > r * TL + 22) die(); }
    if (P.y > ROWS * TL + 60) die();
    if (!left) { if (lvl < LV.length - 1) { lvlLoad(++lvl); P.mt = 1.5; } else P.s = 'won'; sv('chavita-plat', { l: P.s === 'won' ? 0 : lvl }); }
  }
  function pDraw() {
    pg.fillStyle = C.bg; pg.fillRect(0, 0, 960, 480);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const ch = G[r][c], x = c * TL, y = r * TL; pg.fillStyle = C.fg;
      if (ch === '#') { pg.fillRect(x, y, TL, TL - 4); pg.fillStyle = C.dk; pg.fillRect(x, y + TL - 4, TL, 4); }
      if (ch === '*') { const cx = x + 20, cy = y + 20; poly(pg, [[cx, cy - 14], [cx + 4, cy - 4], [cx + 14, cy], [cx + 4, cy + 4], [cx, cy + 14], [cx - 4, cy + 4], [cx - 14, cy], [cx - 4, cy - 4]]); }
      if (ch === '^') poly(pg, [[x + 4, y + TL], [x + 20, y + TL - 22], [x + TL - 4, y + TL]]);
    }
    pg.fillStyle = C.fg; drawCube(pg, P.x - 3, P.y - 1, 32, 35);
    hud(pg, 'NIVEL ' + (lvl + 1) + '/' + LV.length + ' · ESTRELLAS ' + left + ' · CAÍDAS ' + P.d);
    if (P.s === 'idle') say(pg, 960, 330, 'ESPACIO O TOQUE PARA EMPEZAR');
    if (P.s === 'won') say(pg, 960, 330, 'COMPLETASTE TODO · TOCA PARA REINICIAR');
    if (P.s === 'play' && P.mt > 0) say(pg, 960, 330, 'NIVEL ' + (lvl + 1));
  }
  pc.addEventListener('pointerdown', () => pStart());
  document.querySelectorAll('.pad [data-k]').forEach(b => {
    const k = b.dataset.k, on = v => e => { e.preventDefault(); keys[k] = v; if (v) pStart(); };
    b.addEventListener('pointerdown', on(true));
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => b.addEventListener(t, on(false)));
  });

  /* ---------- SHOOTER ---------- */
  const hc = $('hcv'), hg = hc.getContext('2d'), HW = 480, HH = 640;
  const PU = { doble: ['D', 10], triple: ['T', 10], disperso: ['S', 10], laser: ['L', 4], vida: ['+', 0] };
  const H = { s: 'idle', hi: ld('chavita-shooter') || 0, x: HW / 2, tx: HW / 2, b: [], e: [], q: [], u: [], n: 0, life: 3, inv: 0, fire: 0, sp: 0, w: null, wt: 0 };
  const hStart = () => {
    if (cur !== 'shoot' || H.s === 'play' || (H.s === 'over' && performance.now() - H.end < 500)) return;
    Object.assign(H, { s: 'play', b: [], e: [], q: [], u: [], n: 0, life: 3, inv: 0, fire: 0, sp: .5, w: null, wt: 0 });
  };
  const kill = e => {
    e.dead = true; H.n++;
    for (let i = 0; i < 8; i++) H.q.push({ x: e.x, y: e.y, vx: (Math.random() - .5) * 300, vy: (Math.random() - .5) * 300, l: .4 });
    if (Math.random() < .16) H.u.push({ x: e.x, y: e.y, k: Object.keys(PU)[Math.random() * 5 | 0] });
  };
  function hUpdate(dt) {
    if (H.s !== 'play') return;
    const dir = (keys.ArrowRight || keys.d || keys.D ? 1 : 0) - (keys.ArrowLeft || keys.a || keys.A ? 1 : 0);
    H.tx = Math.max(24, Math.min(HW - 24, H.tx + dir * 520 * dt)); H.x += (H.tx - H.x) * Math.min(1, dt * 16);
    H.inv -= dt; H.fire -= dt; H.sp -= dt;
    if (H.wt > 0 && (H.wt -= dt) <= 0) H.w = null;
    if (H.w !== 'laser' && H.fire <= 0) {
      const sh = { doble: [[-9, 0], [9, 0]], triple: [[-16, 0], [0, 0], [16, 0]], disperso: [[0, -260], [0, -130], [0, 0], [0, 130], [0, 260]] }[H.w] || [[0, 0]];
      sh.forEach(([ox, vx]) => H.b.push({ x: H.x + ox, y: HH - 80, vx })); H.fire = .2;
    }
    if (H.sp <= 0) { H.e.push({ x: 30 + Math.random() * (HW - 60), y: -30, vy: 110 + Math.min(H.n * 3, 200) + Math.random() * 60, ph: Math.random() * 6 }); H.sp = Math.max(.32, .9 - H.n * .01); }
    H.b.forEach(b => { b.y -= 720 * dt; b.x += b.vx * dt; });
    H.e.forEach(e => { e.y += e.vy * dt; e.x += Math.sin(e.y / 45 + e.ph) * 60 * dt; });
    if (H.w === 'laser') H.e.forEach(e => { if (!e.dead && Math.abs(e.x - H.x) < 34) kill(e); });
    H.e.forEach(e => { if (e.dead) return; const b = H.b.find(b => Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 22); if (b) { b.y = -99; kill(e); } });
    H.u.forEach(u => u.y += 130 * dt);
    H.u = H.u.filter(u => {
      if (Math.abs(u.x - H.x) < 32 && Math.abs(u.y - (HH - 56)) < 34) { if (u.k === 'vida') H.life = Math.min(H.life + 1, 5); else { H.w = u.k; H.wt = PU[u.k][1]; } return false; }
      return u.y < HH + 30;
    });
    H.e = H.e.filter(e => {
      if (e.dead) return false;
      if (H.inv <= 0 && Math.abs(e.x - H.x) < 28 && Math.abs(e.y - (HH - 56)) < 30) { H.life--; H.inv = 1.3; return false; }
      return e.y < HH + 40;
    });
    H.b = H.b.filter(b => b.y > -20 && b.x > -20 && b.x < HW + 20);
    H.q.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt; }); H.q = H.q.filter(p => p.l > 0);
    if (H.life <= 0) { H.s = 'over'; H.end = performance.now(); if (H.n > H.hi) { H.hi = H.n; sv('chavita-shooter', H.n); } }
  }
  function hDraw() {
    hg.fillStyle = C.bg; hg.fillRect(0, 0, HW, HH);
    if (H.w === 'laser' && H.s === 'play') { hg.fillStyle = C.fg; hg.globalAlpha = .85; hg.fillRect(H.x - 16, 0, 32, HH - 80); hg.globalAlpha = 1; hg.fillStyle = C.dk; hg.fillRect(H.x - 5, 0, 10, HH - 80); }
    hg.fillStyle = C.fg; H.b.forEach(b => hg.fillRect(b.x - 2, b.y, 4, 14));
    H.e.forEach(e => { hg.fillStyle = C.fg; poly(hg, [[e.x - 17, e.y - 16], [e.x + 17, e.y - 16], [e.x, e.y + 18]]); hg.fillStyle = C.dk; hg.fillRect(e.x - 9, e.y - 9, 5, 5); hg.fillRect(e.x + 4, e.y - 9, 5, 5); });
    H.u.forEach(u => { hg.fillStyle = C.fg; hg.beginPath(); hg.arc(u.x, u.y, 15, 0, 7); hg.fill(); hg.fillStyle = C.dk; hg.font = '600 18px "JetBrains Mono",monospace'; hg.textAlign = 'center'; hg.fillText(PU[u.k][0], u.x, u.y + 6); });
    hg.fillStyle = C.fg; H.q.forEach(p => hg.fillRect(p.x, p.y, 5, 5));
    if (H.inv <= 0 || Math.floor(H.inv * 10) % 2) drawCube(hg, H.x - 22, HH - 80, 44, 48);
    hud(hg, 'VIDAS ' + Math.max(H.life, 0) + ' · PUNTOS ' + H.n + ' · HI ' + H.hi);
    if (H.w) hg.fillText(H.w.toUpperCase() + ' ' + Math.ceil(H.wt) + 's', 14, 50);
    if (H.s === 'idle') { say(hg, HW, HH, 'TOCA O ESPACIO PARA EMPEZAR'); hg.font = '14px "JetBrains Mono",monospace'; hg.fillText('D doble · T triple · S disperso · L láser · + vida', HW / 2, HH / 2 + 34); }
    if (H.s === 'over') say(hg, HW, HH, 'GAME OVER · TOCA PARA REINTENTAR');
  }
  const setX = e => { if (cur !== 'shoot') return; const r = hc.getBoundingClientRect(); H.tx = (e.clientX - r.left) / r.width * HW; };
  hc.addEventListener('pointermove', setX);
  hc.addEventListener('pointerdown', e => { setX(e); hStart(); });

  /* ---------- GLOBO AEROSTÁTICO ---------- */
  const gc = $('gcv'), gg = gc.getContext('2d'), GW = 960, GH = 480, BX = 200;
  const B = { s: 'idle', hi: ld('chavita-globo') || 0, hold: false, up: false, cl: [100, 420, 760], t: 0 };
  const bReset = () => Object.assign(B, { y: GH / 2, vy: 0, o: [], n: 0, sp: 220, next: 300 });
  bReset();
  const bStart = () => { if (cur !== 'globo' || B.s === 'play' || (B.s === 'over' && performance.now() - B.end < 500)) return; bReset(); B.s = 'play'; };
  const circRect = (cx, cy, r, x, y, w, h) => { const dx = cx - Math.max(x, Math.min(cx, x + w)), dy = cy - Math.max(y, Math.min(cy, y + h)); return dx * dx + dy * dy < r * r; };
  function bUpdate(dt) {
    B.t += dt; B.cl = B.cl.map(x => x - 40 * dt < -100 ? GW + 40 : x - 40 * dt);
    if (B.s !== 'play') return;
    B.up = B.hold || keys[' '] || keys.ArrowUp || keys.w || keys.W;
    B.vy = Math.max(-240, Math.min(280, B.vy + (B.up ? -900 : 520) * dt)); B.y = Math.max(24, B.y + B.vy * dt);
    B.sp = 220 + Math.min(B.n * 3, 180); B.next -= B.sp * dt;
    if (B.next <= 0) { const gap = Math.max(140, 210 - B.n * 2); B.o.push({ x: GW + 20, w: 80, gy: gap / 2 + 50 + Math.random() * (GH - gap - 100), gap }); B.next = 330 + Math.random() * 60; }
    B.o.forEach(o => {
      o.x -= B.sp * dt;
      if (!o.p && o.x + o.w < BX - 24) { o.p = true; B.n++; }
      if (!o.cc && Math.hypot(o.x + o.w / 2 - BX, o.gy - B.y) < 36) { o.cc = true; B.n += 2; }
    });
    B.o = B.o.filter(o => o.x + o.w > -10);
    const crash = B.y > GH - 50 || B.o.some(o => circRect(BX, B.y, 22, o.x, 0, o.w, o.gy - o.gap / 2 - 14) || circRect(BX, B.y, 22, o.x, o.gy + o.gap / 2 + 14, o.w, GH));
    if (crash) { B.s = 'over'; B.end = performance.now(); if (B.n > B.hi) { B.hi = B.n; sv('chavita-globo', B.n); } }
  }
  function bDraw() {
    gg.fillStyle = C.bg; gg.fillRect(0, 0, GW, GH);
    gg.fillStyle = 'rgba(218,215,205,.2)'; B.cl.forEach((x, i) => gg.fillRect(x, 60 + i * 110, 90, 12));
    const sh = (B.t * 25) % 200; gg.fillStyle = 'rgba(0,0,0,.12)';
    for (let i = 0; i < 6; i++) poly(gg, [[i * 200 - sh, GH], [i * 200 + 100 - sh, GH - 120], [i * 200 + 200 - sh, GH]]);
    gg.fillStyle = C.fg; gg.fillRect(0, GH - 14, GW, 14);
    B.o.forEach(o => {
      const tb = o.gy - o.gap / 2, bt = o.gy + o.gap / 2;
      gg.fillStyle = C.fg; gg.fillRect(o.x, 0, o.w, tb - 14); gg.fillRect(o.x, bt + 14, o.w, GH - bt - 14);
      for (let i = 0; i < 3; i++) { const x = o.x + i * 27; poly(gg, [[x, tb - 14], [x + 27, tb - 14], [x + 13, tb]]); poly(gg, [[x, bt + 14], [x + 27, bt + 14], [x + 13, bt]]); }
      gg.fillStyle = C.dk; gg.fillRect(o.x + o.w - 10, 0, 10, tb - 14); gg.fillRect(o.x + o.w - 10, bt + 14, 10, GH - bt - 14);
      if (!o.cc) { gg.fillStyle = C.fg; const cx = o.x + o.w / 2; poly(gg, [[cx, o.gy - 13], [cx + 4, o.gy - 4], [cx + 13, o.gy], [cx + 4, o.gy + 4], [cx, o.gy + 13], [cx - 4, o.gy + 4], [cx - 13, o.gy], [cx - 4, o.gy - 4]]); }
    });
    gg.save(); gg.translate(BX, B.y); gg.rotate(B.vy / 1500);
    gg.fillStyle = C.fg; gg.beginPath(); gg.ellipse(0, -6, 24, 30, 0, 0, 7); gg.fill();
    gg.fillStyle = C.dk; gg.beginPath(); gg.ellipse(0, -6, 8, 30, 0, 0, 7); gg.fill();
    gg.strokeStyle = C.fg; gg.lineWidth = 2; gg.beginPath(); gg.moveTo(-12, 20); gg.lineTo(-8, 30); gg.moveTo(12, 20); gg.lineTo(8, 30); gg.stroke();
    gg.fillStyle = C.fg; gg.fillRect(-9, 30, 18, 12);
    if (B.s === 'play' && B.up) poly(gg, [[-5, 24], [5, 24], [0, 12 + Math.random() * 5]]);
    gg.restore();
    hud(gg, 'PUNTOS ' + B.n + ' · HI ' + B.hi);
    if (B.s === 'idle') say(gg, GW, GH, 'MANTÉN ESPACIO O TOQUE PARA SUBIR');
    if (B.s === 'over') say(gg, GW, GH, 'GAME OVER · TOCA PARA REINTENTAR');
  }
  gc.addEventListener('pointerdown', () => { B.hold = true; bStart(); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => gc.addEventListener(t, () => { B.hold = false; }));

  /* ---------- ASCENSO (globo vertical) ---------- */
  const ac = $('acv'), ag = ac.getContext('2d'), AW = 480, AH = 720, cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const AP = { vida: '+', dash: 'D', vel: 'V', iman: 'M', dob: 'P' };
  const A = { s: 'idle', hi: ld('chavita-ascenso') || 0 };
  const aReset = () => Object.assign(A, { x: AW / 2, y: AH * .75, tx: AW / 2, ty: AH * .75, o: [], r: [], u: [], sc: 0, D: 0, life: 3, inv: 0, gap: 200, next: 120, t: 0, fx: { vel: 0, iman: 0, dob: 0, dash: 0 } });
  aReset();
  const aStart = () => {
    if (cur !== 'ascenso' || A.s === 'play' || (A.s === 'over' && performance.now() - A.end < 500)) return;
    const tx = A.tx, ty = A.ty; aReset(); A.tx = tx; A.ty = ty; A.s = 'play';
  };
  function aRow() {
    const w = 120 + Math.random() * (80 + Math.min(A.D / 120, 110)), k = Math.random();
    const x = k < .4 ? 0 : k < .8 ? AW - w : 50 + Math.random() * (AW - w - 100);
    A.o.push({ x, y: -26, w });
    const L = x, R2 = AW - x - w, fx = L > R2 ? L / 2 : x + w + R2 / 2, py = -26 - A.gap / 2, px = cl(fx + (Math.random() - .5) * 60, 30, AW - 30);
    if (Math.random() < .8) A.r.push({ x: px, y: py });
    if (Math.random() < .12) A.u.push({ x: cl(px < AW / 2 ? px + 150 : px - 150, 30, AW - 30), y: py, k: Object.keys(AP)[Math.random() * 5 | 0] });
  }
  function aUpdate(dt) {
    A.t += dt;
    if (A.s !== 'play') return;
    const f = A.fx; for (const k in f) f[k] = Math.max(0, f[k] - dt);
    A.inv -= dt;
    const v = (150 + Math.min(A.D / 60, 220)) * (f.dash > 0 ? 2.6 : 1), mult = f.dob > 0 ? 2 : 1, ms = 340 * (f.vel > 0 ? 2 : 1);
    A.D += v * dt; A.sc += v * dt / 100 * mult;
    const dx = (keys.ArrowRight || keys.d || keys.D ? 1 : 0) - (keys.ArrowLeft || keys.a || keys.A ? 1 : 0), dy = (keys.ArrowDown || keys.s || keys.S ? 1 : 0) - (keys.ArrowUp || keys.w || keys.W ? 1 : 0);
    if (dx || dy) { A.x += dx * ms * dt; A.y += dy * ms * dt; A.tx = A.x; A.ty = A.y; }
    else { const ex = A.tx - A.x, ey = A.ty - A.y, d = Math.hypot(ex, ey) || 1, m = Math.min(d, ms * dt); A.x += ex / d * m; A.y += ey / d * m; }
    A.x = cl(A.x, 26, AW - 26); A.y = cl(A.y, AH * .35, AH - 50);
    A.next -= v * dt; if (A.next <= 0) { A.gap = Math.max(150, 200 - A.D / 400); A.next = A.gap; aRow(); }
    [A.o, A.r, A.u].forEach(a => a.forEach(e => e.y += v * dt));
    A.o = A.o.filter(e => e.y < AH + 30);
    A.r = A.r.filter(r => {
      if (f.iman > 0) { const ex = A.x - r.x, ey = A.y - r.y, d = Math.hypot(ex, ey); if (d < 170 && d > 1) { r.x += ex / d * 320 * dt; r.y += ey / d * 320 * dt; } }
      if (Math.hypot(r.x - A.x, r.y - A.y) < 30) { A.sc += 5 * mult; return false; }
      return r.y < AH + 30;
    });
    A.u = A.u.filter(u => {
      if (Math.hypot(u.x - A.x, u.y - A.y) < 34) {
        if (u.k === 'vida') A.life = Math.min(A.life + 1, 5);
        else if (u.k === 'dash') { f.dash = 1.6; A.inv = Math.max(A.inv, 1.8); }
        else f[u.k] = u.k === 'vel' ? 30 : 15;
        return false;
      }
      return u.y < AH + 30;
    });
    if (A.inv <= 0 && A.o.some(o => circRect(A.x, A.y - 6, 20, o.x + 2, o.y, o.w - 4, 20))) {
      A.life--; A.inv = 1.6;
      if (A.life <= 0) { A.s = 'over'; A.end = performance.now(); const sc = Math.floor(A.sc); if (sc > A.hi) { A.hi = sc; sv('chavita-ascenso', sc); } }
    }
  }
  function aDraw() {
    ag.fillStyle = C.bg; ag.fillRect(0, 0, AW, AH);
    ag.fillStyle = 'rgba(218,215,205,.18)';
    for (let i = 0; i < 9; i++) ag.fillRect((i * 137) % (AW - 40), ((i * 131 + A.D * .25) % (AH + 40)) - 20, 36, 8);
    if (A.fx.iman > 0) { ag.strokeStyle = 'rgba(218,215,205,.25)'; ag.lineWidth = 2; ag.beginPath(); ag.arc(A.x, A.y, 170, 0, 7); ag.stroke(); }
    A.o.forEach(o => { ag.fillStyle = C.fg; ag.fillRect(o.x, o.y, o.w, 8); for (let x = o.x; x < o.x + o.w - 6; x += 12) poly(ag, [[x, o.y + 8], [x + 12, o.y + 8], [x + 6, o.y + 22]]); });
    A.r.forEach(r => { ag.strokeStyle = C.fg; ag.lineWidth = 3; ag.beginPath(); ag.arc(r.x, r.y, 13, 0, 7); ag.stroke(); ag.fillStyle = C.fg; ag.beginPath(); ag.arc(r.x - 4, r.y - 4, 3, 0, 7); ag.fill(); });
    A.u.forEach(u => { ag.fillStyle = C.fg; ag.beginPath(); ag.arc(u.x, u.y, 16, 0, 7); ag.fill(); ag.fillStyle = C.dk; ag.font = '600 18px "JetBrains Mono",monospace'; ag.textAlign = 'center'; ag.fillText(AP[u.k], u.x, u.y + 6); });
    if (A.s !== 'play' || A.inv <= 0 || Math.floor(A.inv * 10) % 2) {
      ag.save(); ag.translate(A.x, A.y); ag.rotate(Math.sin(A.t * 2) * .05);
      if (A.fx.dash > 0) { ag.fillStyle = C.fg; for (let i = 0; i < 6; i++) ag.fillRect(-20 + i * 8, 34, 3, 30 + Math.random() * 40); }
      ag.fillStyle = C.fg; ag.beginPath(); ag.ellipse(0, -6, 24, 30, 0, 0, 7); ag.fill();
      ag.fillStyle = C.dk; ag.beginPath(); ag.ellipse(0, -6, 8, 30, 0, 0, 7); ag.fill();
      ag.strokeStyle = C.fg; ag.lineWidth = 2; ag.beginPath(); ag.moveTo(-12, 20); ag.lineTo(-8, 30); ag.moveTo(12, 20); ag.lineTo(8, 30); ag.stroke();
      ag.fillStyle = C.fg; ag.fillRect(-9, 30, 18, 12);
      if (A.s === 'play') poly(ag, [[-5, 24], [5, 24], [0, 12 + Math.random() * 5]]);
      ag.restore();
    }
    hud(ag, 'VIDAS ' + A.life + ' · PUNTOS ' + Math.floor(A.sc) + ' · HI ' + A.hi);
    const fx = [['vel', 'VEL x2'], ['iman', 'IMÁN'], ['dob', 'PUNTOS x2'], ['dash', 'DASH']].filter(([k]) => A.fx[k] > 0).map(([k, n]) => n + ' ' + Math.ceil(A.fx[k]) + 's').join(' · ');
    if (fx) ag.fillText(fx, 14, 50);
    if (A.s === 'idle') { say(ag, AW, AH, 'TOCA O USA FLECHAS/WASD'); ag.font = '14px "JetBrains Mono",monospace'; ag.fillText('+ vida · D dash · V velocidad x2 (30 s)', AW / 2, AH / 2 + 34); ag.fillText('M imán · P puntos x2', AW / 2, AH / 2 + 56); }
    if (A.s === 'over') say(ag, AW, AH, 'GAME OVER · TOCA PARA REINTENTAR');
  }
  const aPos = e => { if (cur !== 'ascenso') return; const r = ac.getBoundingClientRect(); A.tx = (e.clientX - r.left) / r.width * AW; A.ty = (e.clientY - r.top) / r.height * AH - 40; };
  ac.addEventListener('pointermove', aPos);
  ac.addEventListener('pointerdown', e => { aPos(e); aStart(); });

  /* ---------- Teclado, bucles y guardado ---------- */
  const START = { plat: pStart, shoot: hStart, globo: bStart, ascenso: aStart };
  addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('button,a')) return;
    keys[e.key] = true;
    if (START[cur]) {
      if (e.key.startsWith('Arrow') || e.key === ' ') e.preventDefault();
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'Enter'].includes(e.key)) START[cur]();
    }
  });
  addEventListener('keyup', e => { keys[e.key] = false; });
  addEventListener('blur', () => Object.keys(keys).forEach(k => keys[k] = false));
  const runP = loop('plat', dt => { pUpdate(dt); pDraw(); }), runH = loop('shoot', dt => { hUpdate(dt); hDraw(); }), runB = loop('globo', dt => { bUpdate(dt); bDraw(); }), runA = loop('ascenso', dt => { aUpdate(dt); aDraw(); });
  addEventListener('game', e => { cur = e.detail; ({ plat: runP, shoot: runH, globo: runB, ascenso: runA, idle: iRender, tycoon: tRender })[cur]?.(); lastT = Date.now(); });
  function persist() { sv('chavita-idle', I); sv('chavita-tycoon', T); sv('chavita-plat', { l: P.s === 'won' ? 0 : lvl }); sv('chavita-shooter', H.hi); sv('chavita-globo', B.hi); sv('chavita-ascenso', A.hi); }
  addEventListener('pagehide', persist); document.addEventListener('visibilitychange', persist);
  addEventListener('consent', e => { if (e.detail === 'yes') persist(); });
})();
