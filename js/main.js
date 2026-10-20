(() => {
  const E1 = 'garciagomezchava61@gmail.com', E2 = 'garciagomezchava61@icloud.com', TEL = '3841357715';
  // Si ya activaste FormSubmit, cambia el correo del final por la dirección aleatoria que te manda (así no se ve tu correo).
  const ENDPOINT = 'https://formsubmit.co/ajax/' + E1;
  const page = document.body.dataset.page;
  // DATOS LEGALES: completa estos campos antes de publicar. Se rellenan solos en todas las políticas.
  const LEGAL = { nombre: 'Salvador García Gómez', domicilio: 'Av. de los Gigantes #134, Guadalajara, Jalisco, México', ciudad: 'Guadalajara, Jalisco' };
  document.querySelectorAll('[data-k]').forEach(n => { const v = LEGAL[n.dataset.k]; if (v) { n.textContent = v; n.classList.remove('fill'); } });
  const nav = [['home', 'home', 'inicio'], ['videojuegos', 'videojuegos', 'videojuegos'], ['paginasweb', 'paginasweb', 'páginas web']];
  const links = nav.map(([k, h, t]) => `<a href="../${h}/"${k === page ? ' aria-current="page"' : ''}>[ ${t} ]</a>`).join('');

  document.body.insertAdjacentHTML('afterbegin', `
  <header class="top"><div class="wrap nav">
    <a class="brand" href="../home/" aria-label="Chavita, ir al inicio">
      <img src="../assets/minilogo.png" alt=""><img src="../assets/nombre-claro.png" alt="Chavita"></a>
    <button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú"><span></span></button>
    <nav id="menu" aria-label="Principal">${links}<a class="btn" href="../contacto/">Contacto</a></nav>
  </div></header>`);

  document.body.insertAdjacentHTML('beforeend', `
  <footer><div class="wrap">
    <img src="../assets/minilogo.png" alt="Chavita" loading="lazy">
    <div><a href="mailto:${E1}">${E1}</a><a href="mailto:${E2}">${E2}</a><a href="tel:+52${TEL}">${TEL.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}</a></div>
    <span>© ${new Date().getFullYear()} Chavita. Todos los derechos reservados.</span>
  <nav aria-label="Legal"><a href="../privacidad/">Aviso de privacidad</a><a href="../terminos/">Términos y condiciones</a><a href="../cookies/">Política de cookies</a><a href="../devoluciones/">Devoluciones</a></nav>
    <p>Los logotipos de tecnologías son marcas de sus respectivos titulares y se muestran solo con fines informativos.</p>
  </div></footer>`);

  const burger = document.querySelector('.burger'), menu = document.getElementById('menu');
  const toggle = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
  menu.addEventListener('click', e => e.target.closest('a') && toggle(false));

  // Formulario: se envía al correo mediante FormSubmit, sin necesitar una app de correo.
  const form = document.getElementById('form');
  if (!form) return;
  const estado = document.getElementById('estado'), boton = form.querySelector('button');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    boton.disabled = true; estado.textContent = 'Enviando…';
    try {
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), _subject: 'Nuevo mensaje desde tu página web', _template: 'table', _captcha: 'false' })
      });
      const j = await r.json();
      if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || 'error');
      form.reset(); estado.textContent = '¡Mensaje enviado! Te responderé pronto.';
    } catch {
      estado.innerHTML = `No se pudo enviar. Escríbeme directo a <a href="mailto:${E1}"><u>${E1}</u></a>.`;
    }
    boton.disabled = false;
  });
})();
