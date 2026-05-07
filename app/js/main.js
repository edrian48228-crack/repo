// ════════════════════════════════════════════════════════
//  ESTADO GLOBAL
// ════════════════════════════════════════════════════════
let S = {
  adminPass: 'admin2025',
  recoverAnswer: 'edrian cruz down',
  config: {
    systemName: 'MiTienda Pro',
    heroSub: 'Tu tienda online completa con carrito, inventario, dashboard y <strong>auto-actualización en todos los dispositivos</strong>. Desde 7 días gratis.',
    author: 'Edrian Cruz Down',
    freeDesc: 'Accede al sistema completo durante 7 días sin pagar nada. Incluye tienda pública, panel de administración, gestión de productos y la APK de Android. Solo contáctame por cualquiera de mis canales para activarlo.',
    freeFeats: ['Sistema web completo','APK Android incluida','Panel de administración','Carrito de compras','Dashboard estadístico','Avatar promotor animado'],
  },
  plans: [
    { id:'p1', icon:'⚡', name:'STARTER/PROMO BASE',  period:'1 mes',   price:1300,  promo:2500,  popular:true,
      feats:['Sistema completo de tienda','Carrito y pedidos WhatsApp','Panel de administración','Avatar animado promotor','Dashboard con estadísticas'] },
    { id:'p2', icon:'🌙', name:'BÁSICO/PROMO BASE',   period:'3 meses', price:2500, promo:4500, popular:false,
      feats:['Todo lo del Starter','Gestión de proveedores','Múltiples fotos por producto','Exportar / importar datos','Formas de pago personalizables'] },
    { id:'p3', icon:'🔥', name:'PRO/PROMO BASE',      period:'6 meses', price:4500, promo:7500, popular:true,
      feats:['Todo lo del Básico','Links personalizados portada','Auto-actualización SW','Soporte prioritario','Actualizaciones del sistema'] },
    { id:'p4', icon:'🏆', name:'ANUAL/PROMO BASE',    period:'12 meses',price:7500, promo:10500, popular:false,
      feats:['Todo lo del Pro','Máximo ahorro anual','12 meses de actualizaciones','Soporte extendido','Sin interrupciones todo el año'] },
    { id:'p5', icon:'💎', name:'BIANUAL/PROMO BASE',  period:'24 meses',price:10500, promo:15500, popular:false,
      feats:['Todo lo del Anual','2 años de tranquilidad','Precio bloqueado 2 años','Atención VIP','Mejor inversión a largo plazo'] },
  ],
  ownerWeb: 37500,
  ownerApk: 51500,
  contacts: [
    { icon:'📱', title:'WhatsApp', value:'https://wa.me/5354693549', desc:'Respuesta inmediata' },
    { icon:'📘', title:'Facebook', value:'https://facebook.com', desc:'Edrian Cruz Down' },
    { icon:'✉️', title:'Email',    value:'mailto:icdanger48228@gmail.com', desc:'icdanger48228@gmail.com' },
  ],
  links: [
    { icon:'🛍️', title:'Ver Mi Tienda',       sub:'Tienda online funcionando', url:'#', arrow:'Visitar tienda' },
    { icon:'📺', title:'Canal Electrónica',   sub:'Tutoriales y proyectos',    url:'#', arrow:'Ver canal' },
    { icon:'🎓', title:'Curso Gratis',        sub:'Electrónica básica',        url:'#', arrow:'Acceder gratis' },
    { icon:'💰', title:'Curso de Pago',       sub:'Electrónica avanzada',      url:'#', arrow:'Ver curso' },
    { icon:'📍', title:'Mi Dirección',        sub:'Encuéntrame aquí',          url:'#', arrow:'Ver en mapa' },
  ],
  avatar: {
    name: 'TiendaBot',
    img: '',
    color: '#ff6600',
    colorFade: 'rgba(255,102,0,.3)',
    gradient: 'linear-gradient(135deg,#ff2200 0%,#ff6600 50%,#ff8800 100%)',
    msgs: [
      '🚀 ¡Con tu propia tienda vendes 24/7 sin esfuerzo!',
      '💰 Tu tienda trabaja mientras tú duermes.',
      '📱 ¡Tus clientes piden por WhatsApp automáticamente!',
      '🔥 ¡Más de 100 productos en tu catálogo digital!',
      '⭐ Gestiona tu inventario desde el móvil.',
      '🎯 ¡Aumenta tus ventas con una tienda profesional!',
    ],
  },
  promoActive: false,
  exitTarget: null,
  sellers: [],
  clientStores: [],
  notifications: [],
  analytics: { visits:0, regs:0, lastVisit:null },
  terms: { url:'', text:'TÉRMINOS Y CONDICIONES DE MITIENDA PRO\n\n1. ACEPTACIÓN\nAl usar MiTienda Pro aceptas estos términos. El usuario es responsable del contenido de su tienda.\n\n2. SERVICIO\nMiTienda Pro provee sistemas de ventas online profesionales.\n\n3. PAGOS\nLas suscripciones no son reembolsables una vez activadas.\n\n4. OBLIGACIONES\nEl vendedor se compromete a usar el sistema de forma legal y ética.\n\n5. PRIVACIDAD\nLos datos son confidenciales y no se comparten con terceros.\n\n— Edrian Cruz Down, Ing. en Informática' },
  promoConfig: {
    title: 'Promocionamos tu Tienda Online',
    subtitle: 'Herramientas para hacer crecer tu negocio',
    promoLinks: [
      { id:'pl1', title:'WhatsApp', msg:'¡Hola! Conoce MiTienda Pro 🔥 Tienda online completa. Prueba 7 días GRATIS.', url:'' },
      { id:'pl2', title:'Facebook', msg:'', url:'' },
      { id:'pl3', title:'Telegram', msg:'', url:'' },
    ],
    affiliateUrl: '',
    storesVisible: 6,
    securityEnabled: true,
  },
  testimonials: [],
  siteIcon: '',
  shopUrl: '',
  jsonAutoUrl: '',
  contractTemplate: {},
};

let avIdx = 0, avTimer = null;

// ════════════════════════════════════════════════════════
//  LOAD / SAVE
// ════════════════════════════════════════════════════════
function loadS() {
  try {
    const raw = localStorage.getItem('mtp_v2');
    if (raw) {
      const p = JSON.parse(raw);
      // Deep merge conservador
      if (p.adminPass) S.adminPass = dec(p.adminPass);
      if (p.recoverAnswer) S.recoverAnswer = dec(p.recoverAnswer);
      if (p.config) S.config = Object.assign({}, S.config, p.config);
      if (p.plans && p.plans.length) S.plans = p.plans;
      if (p.ownerWeb) S.ownerWeb = p.ownerWeb;
      if (p.ownerApk) S.ownerApk = p.ownerApk;
      if (p.contacts && p.contacts.length) S.contacts = p.contacts;
      if (p.links && p.links.length) S.links = p.links;
      if (p.avatar) S.avatar = Object.assign({}, S.avatar, p.avatar);
      if (p.sellers) S.sellers = p.sellers;
      if (p.clientStores) S.clientStores = p.clientStores;
      if (p.notifications) S.notifications = p.notifications;
      if (p.analytics) S.analytics = Object.assign({visits:0,regs:0,lastVisit:null}, p.analytics);
      if (p.terms) S.terms = Object.assign({}, S.terms, p.terms);
      if (p.promoConfig) S.promoConfig = Object.assign({}, S.promoConfig, p.promoConfig);
      if (p.testimonials) S.testimonials = p.testimonials;
      if (p.siteIcon !== undefined) S.siteIcon = p.siteIcon;
      if (p.shopUrl !== undefined) S.shopUrl = p.shopUrl;
      if (p.jsonAutoUrl !== undefined) S.jsonAutoUrl = p.jsonAutoUrl;
      if (p.contractTemplate) S.contractTemplate = p.contractTemplate;
    }
  } catch(e) { console.warn('loadS:', e); }
}
function saveS() {
  try {
    const toSave = JSON.parse(JSON.stringify(S));
    toSave.adminPass = enc(S.adminPass);
    toSave.recoverAnswer = enc(S.recoverAnswer);
    localStorage.setItem('mtp_v2', JSON.stringify(toSave));
    // Actualizar timestamp de build para invalidar caché del SW automáticamente
    const ts = Date.now();
    document.documentElement.dataset.buildTs = ts;
    localStorage.setItem('mtp_build_ts', ts);
  } catch(e) {}
}

function repoImgUrl(name) {
  return `../public/img/${name}`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error || new Error('No se pudo leer la imagen'));
    r.readAsDataURL(file);
  });
}

async function uploadRepoImage(file, prefix, opts = {}) {
  const stamp = Date.now();
  const cleanPrefix = String(prefix || 'asset').replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  const name = `${cleanPrefix}-${stamp}.webp`;
  const imageOpt = window.MTP?.ImageOpt;
  const writer = window.MTP?.Writer;

  if (imageOpt && writer) {
    const prepared = await imageOpt.prepare(file, opts);
    await writer.writeImage(name, prepared.bytes, { message: `img: ${cleanPrefix} ${stamp}` });
    return repoImgUrl(name);
  }

  return readFileAsDataUrl(file);
}

// ════════════════════════════════════════════════════════
//  ARRANQUE
// ════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadS();
  initBgCanvas();
  createSparks();
  renderAll();
  setupReveal();
  setupEsc();
  setupExit();
});

function renderAll() {
  updateTexts();
  setTimeout(renderTestiPub, 100);
  renderPublicStores();
  renderTC();
  renderPlansGrid();
  renderCompareTable();
  renderOwnerGrid();
  renderLinksGrid();
  renderContactGrid();
  renderFreeFeats();
  initAvatar();
  updateStat('st-plans', S.plans.length);
}

// ════════════════════════════════════════════════════════
//  CANVAS FONDO
// ════════════════════════════════════════════════════════
function initBgCanvas() {
  const cv = document.getElementById('bgc');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, pts = [];

  const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; };
  window.addEventListener('resize', resize); resize();

  for (let i = 0; i < 55; i++) pts.push({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
    r: Math.random() * 1.5 + .4,
    c: Math.random() > .5 ? 'rgba(255,102,0,' : 'rgba(255,34,0,',
    a: Math.random() * .25 + .08
  });

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.a + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

function createSparks() {
  const c = document.getElementById('sparks'); if (!c) return;
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('div'); s.className = 'spark';
    const sz = 5 + Math.random() * 9;
    s.style.cssText = `left:${Math.random()*100}%;bottom:${Math.random()*40}%;width:${sz}px;height:${sz}px;--d:${5+Math.random()*10}s;--dl:${Math.random()*8}s;--tx:${(Math.random()-.5)*200}px;--ty:-${180+Math.random()*300}px`;
    c.appendChild(s);
  }
}

// ════════════════════════════════════════════════════════
//  AVATAR
// ════════════════════════════════════════════════════════
function initAvatar() {
  buildFloatingAvatar();
  renderAvaMsgsList();
  if (avTimer) clearInterval(avTimer);
  setAvaMsgActive(0);
  avTimer = setInterval(() => {
    avIdx = (avIdx + 1) % S.avatar.msgs.length;
    setAvaMsgActive(avIdx);
  }, 4000);
}

function buildFloatingAvatar() {
  const av = S.avatar;
  const grad = av.gradient || 'linear-gradient(135deg,#ff2200,#ff8800)';
  // Actualizar cabeza del avatar flotante
  const head = document.getElementById('float-ava-head');
  if (head) {
    if (av.img) {
      head.innerHTML = `<img src="${av.img}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentNode.innerHTML=buildAvFace()">`;
    } else {
      head.innerHTML = `<div class="float-ava-face" style="background:${grad};width:100%;height:100%;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px">
        <div class="faf-eyes"><span class="faf-eye"></span><span class="faf-eye"></span></div>
        <div class="faf-mouth"></div></div>`;
    }
    head.style.background = grad;
  }
  // Actualizar anillo de color
  const body = document.getElementById('float-ava-body');
  if (body) { body.style.background = grad; body.style.boxShadow = `0 0 0 3px ${av.color}66,0 8px 30px ${av.color}66`; }
  // Nombre
  const nm = document.getElementById('float-ava-name');
  if (nm) nm.textContent = '🤖 ' + (av.name || 'TiendaBot');
  // Botón expand ícono
  const bi = document.getElementById('float-ava-btn-ico');
  if (bi) bi.textContent = av.img ? '🤖' : '🤖';
  // Asegurar visible
  const wrap = document.getElementById('floating-avatar');
  if (wrap) wrap.classList.remove('collapsed');
}

// Compatibilidad: alias
function buildAvatarHTML() { buildFloatingAvatar(); }

function expandAvatar() {
  const w = document.getElementById('floating-avatar');
  if (w) w.classList.remove('collapsed');
}
function collapseAvatar() {
  const w = document.getElementById('floating-avatar');
  if (w) w.classList.add('collapsed');
}
function cycleAvaMsg() {
  if (avTimer) clearInterval(avTimer);
  avIdx = (avIdx + 1) % S.avatar.msgs.length;
  setAvaMsgActive(avIdx);
  avTimer = setInterval(() => { avIdx = (avIdx+1) % S.avatar.msgs.length; setAvaMsgActive(avIdx); }, 4000);
}

function renderAvaMsgsList() {
  const c = document.getElementById('ava-msgs-list'); if (!c) return;
  const icons = ['💡','💰','📱','🔥','⭐','🎯','🚀','💎','🏆','✅'];
  c.innerHTML = S.avatar.msgs.map((msg, i) => `
    <div class="ams-item${i===avIdx?' active':''}" onclick="clickAvaMsg(${i})">
      <span class="ams-ico">${icons[i%10]}</span>
      <div><div class="ams-txt">${esc(msg)}</div><div class="ams-tap">Toca para ver en el avatar →</div></div>
    </div>`).join('');
}

function setAvaMsgActive(idx) {
  avIdx = idx;
  // Actualizar burbuja flotante
  const bt = document.getElementById('float-ava-txt');
  if (bt) {
    bt.style.opacity = '0';
    setTimeout(() => { bt.textContent = S.avatar.msgs[idx] || ''; bt.style.opacity = '1'; bt.style.transition='opacity .3s'; }, 250);
  }
  // Actualizar showcase de mensajes
  document.querySelectorAll('.ams-item').forEach((el, i) => el.classList.toggle('active', i === idx));
  document.querySelectorAll('.ava-msg-item').forEach((el, i) => el.classList.toggle('active', i === idx));
}

function clickAvaMsg(i) {
  if (avTimer) clearInterval(avTimer);
  setAvaMsgActive(i);
  avTimer = setInterval(() => {
    avIdx = (avIdx + 1) % S.avatar.msgs.length;
    setAvaMsgActive(avIdx);
  }, 4000);
}

// ════════════════════════════════════════════════════════
//  TEXTOS
// ════════════════════════════════════════════════════════
function updateTexts() {
  if(S.config.ctcImg){previewCtcBg(S.config.ctcImg);}
  const ci=get('cfg-ctc-img');if(ci&&S.config.ctcImg)ci.value=S.config.ctcImg.startsWith('data:')?'(imagen guardada)':S.config.ctcImg;

  const c = S.config;
  const nm = c.systemName || 'MiTienda Pro';
  document.title = nm + ' — Sistema de Ventas';
  setHTML('hdr-logo', '🔥 ' + nm);
  setHTML('htitle1', nm.replace(' Pro','').replace(' PRO','').toUpperCase());
  setHTML('hsubt', c.heroSub || '');
  setHTML('flogo', '🔥 ' + nm);
  setHTML('fauthor', c.author || 'Edrian Cruz Down');
  const fd = document.getElementById('free-desc');
  if (fd) fd.textContent = c.freeDesc || '';
  updateStat('st-plans', S.plans.length);
}

function renderFreeFeats() {
  const c = document.getElementById('free-feats'); if (!c) return;
  const feats = S.config.freeFeats || [];
  c.innerHTML = feats.map(f => `<div class="free-feat">${esc(f)}</div>`).join('');
}

// ════════════════════════════════════════════════════════
//  PLANES
// ════════════════════════════════════════════════════════
function togglePromo(cb) {
  S.promoActive = cb.checked;
  document.getElementById('lbl-p').classList.toggle('on', cb.checked);
  document.getElementById('lbl-n').classList.toggle('on', !cb.checked);
  document.body.classList.toggle('promo-mode', cb.checked);
  S.plans.forEach(p => {
    const pe = document.getElementById('pp-' + p.id);
    if (pe) pe.innerHTML = fmt(cb.checked ? p.promo : p.price) + ' <span>CUP</span>';
  });
}

function renderPlansGrid() {
  const g = document.getElementById('plans-grid'); if (!g) return;
  g.innerHTML = S.plans.map((p, i) => `
    <div class="pc${p.popular?' hot':''}" style="animation-delay:${i*.07}s">
      ${p.popular ? '<div class="pc-pop">Popular</div>' : ''}
      <span class="pc-icon">${p.icon}</span>
      <div class="pc-name">${esc(p.name)}</div>
      <div class="pc-period">⏱ ${esc(p.period)}</div>
      <div class="pc-price" id="pp-${p.id}">${fmt(p.price)} <span>CUP</span></div>
      <div class="pc-po" id="po-${p.id}">Normal: ${fmt(p.price)} CUP</div>
      <div class="pc-pn" id="pn-${p.id}">CON PROMOCIÓN AVANZADA: ${fmt(p.promo)} CUP</div>
      <div class="pc-div"></div>
      <ul class="pc-feats">${(p.feats||[]).map(f=>`<li>${esc(f)}</li>`).join('')}</ul>
      <button class="pc-cta" onclick="planWA('${p.id}')">📱 Contratar por WhatsApp</button>
      ${i > 0 ? `<div class="pc-save">~${fmt(Math.round(p.price/parseInt(p.period)))} CUP/mes</div>` : ''}
    </div>`).join('');
}

function renderCompareTable() {
  const t = document.getElementById('compare-tbl'); if (!t) return;
  const head = `<thead><tr><th>Plan</th><th>Duración</th><th>Normal</th><th>Con Promo</th><th>Por Mes</th></tr></thead>`;
  const freeRow = `<tr class="free-row">
    <td>🎁 FREE</td><td>7 días</td>
    <td class="pu">GRATIS</td><td class="pu">GRATIS</td><td class="pu">Prueba</td></tr>`;
  const rows = S.plans.map(p => {
    let ppm = '';
    try { ppm = '~' + fmt(Math.round(p.price / parseInt(p.period))) + ' CUP/mes'; } catch(e) {}
    return `<tr${p.popular?' class="rec-row"':''}>
      <td>${p.icon} ${esc(p.name)}${p.popular?'<span class="rbdg">Popular</span>':''}</td>
      <td>${esc(p.period)}</td>
      <td class="pn">${fmt(p.price)} CUP</td>
      <td class="pp">${fmt(p.promo)} CUP</td>
      <td style="font-size:12px;color:var(--t2)">${ppm}</td>
    </tr>`;
  }).join('');
  const ownerRows = `
    <tr style="background:rgba(255,102,0,.04)"><td>💻 Sistema Web</td><td>Propietario</td><td class="pu">${fmt(S.ownerWeb)} CUP</td><td>—</td><td style="color:var(--green);font-weight:700;font-size:12px">Pago único</td></tr>
    <tr style="background:rgba(255,102,0,.04)"><td>🚀 Sistema Web + APK</td><td>Propietario</td><td class="pu">${fmt(S.ownerApk)} CUP</td><td>—</td><td style="color:var(--green);font-weight:700;font-size:12px">Pago único</td></tr>`;
  t.innerHTML = head + `<tbody>${freeRow}${rows}${ownerRows}</tbody>`;
}

function renderOwnerGrid() {
  const g = document.getElementById('own-grid'); if (!g) return;
  g.innerHTML = `
  <div class="own-card">
    <div class="own-fc"></div>
    <div class="own-tag">💻 Sin App Android</div>
    <span class="own-icon">💻</span>
    <div class="own-name">SISTEMA WEB</div>
    <p class="own-desc">El sistema completo instalado en tu servidor. Código fuente incluido, licencia permanente para siempre.</p>
    <div class="own-price">${fmt(S.ownerWeb)} <span>CUP</span></div>
    <ul class="own-feats">
      <li><span class="ic">▸</span>Código fuente completo (HTML+CSS+JS)</li>
      <li><span class="ic">▸</span>Licencia de uso permanente</li>
      <li><span class="ic">▸</span>Sistema completo de tienda online</li>
      <li><span class="ic">▸</span>Auto-actualización PWA incluida</li>
      <li><span class="ic">▸</span>Sin pagos mensuales para siempre</li>
    </ul>
    <button class="btn btn-fire btn-f" onclick="ownerWA('web')">📱 Comprar por WhatsApp</button>
  </div>
  <div class="own-card prem">
    <div class="own-fc"></div>
    <div class="own-tag">⭐ Recomendado · Con App Android</div>
    <span class="own-icon">🚀</span>
    <div class="own-name">SISTEMA + APK</div>
    <p class="own-desc">El sistema web más tu propia APK de Android personalizada con tu nombre y logo. La mejor inversión.</p>
    <div class="own-price">${fmt(S.ownerApk)} <span>CUP</span></div>
    <ul class="own-feats">
      <li><span class="ic">▸</span>Todo lo del Sistema Web</li>
      <li><span class="ic">▸</span>APK de Android personalizada</li>
      <li><span class="ic">▸</span>Tu nombre y logo en la app</li>
      <li><span class="ic">▸</span>Distribución ilimitada de la APK</li>
      <li><span class="ic">▸</span>Auto-actualización sin repartir APK nueva</li>
    </ul>
    <button class="btn btn-fire btn-f" onclick="ownerWA('apk')">📱 Comprar por WhatsApp</button>
  </div>`;
}

function renderLinksGrid() {
  const g = document.getElementById('links-grid'); if (!g) return;
  g.innerHTML = S.links.map((l, i) => {
    const isFirst = i === 0;
    return isFirst ? `
    <a class="lnk-card lnk-card-star" href="${esc(l.url)}" target="_blank">
      <div class="lnk-star-glow"></div>
      <div class="lnk-star-badge">⭐ DESTACADO</div>
      <span class="lci lci-star">${l.icon}</span>
      <div class="lct lct-star">${esc(l.title)}</div>
      <div class="lcs">${esc(l.sub)}</div>
      <div class="lca lca-star">${esc(l.arrow)} →</div>
    </a>` : `
    <a class="lnk-card" href="${esc(l.url)}" target="_blank">
      <span class="lci">${l.icon}</span>
      <div class="lct">${esc(l.title)}</div>
      <div class="lcs">${esc(l.sub)}</div>
      <div class="lca">${esc(l.arrow)} →</div>
    </a>`;
  }).join('');
}

function renderContactGrid() {
  const g = document.getElementById('contact-grid'); if (!g) return;
  g.innerHTML = S.contacts.map(c => `
    <a class="ccard" href="${esc(c.value)}" target="${c.value.startsWith('mailto')?'_self':'_blank'}">
      <span class="ccico">${c.icon}</span>
      <div class="cct">${esc(c.title)}</div>
      <div class="ccv">${esc(c.desc || c.value)}</div>
    </a>`).join('');
}

// ════════════════════════════════════════════════════════
//  ADMIN LOGIN
// ════════════════════════════════════════════════════════
function openAdminLogin() {
  openM('m-alog');
  setTimeout(() => { const e = get('a-pass'); if (e) { e.value = ''; e.focus(); } }, 100);
}

function adminLogout() {
  get('adm-panel').classList.add('hidden');
  get('hdr').style.display = '';
  renderAll();
}

// ════════════════════════════════════════════════════════
//  RECOVER PASSWORD
// ════════════════════════════════════════════════════════
function showRecoverPass() {
  closeM('m-alog');
  const ri = get('rec-ans'); if (ri) ri.value = '';
  const rr = get('rec-result'); if (rr) { rr.textContent = ''; rr.classList.remove('show'); }
  openM('m-rec');
  setTimeout(() => { const e = get('rec-ans'); if (e) e.focus(); }, 100);
}

function checkRecover() {
  const ans = (get('rec-ans') || {}).value || '';
  const rr = get('rec-result');
  if (ans.trim().toLowerCase() === S.recoverAnswer.toLowerCase()) {
    if (rr) {
      rr.innerHTML = `<div style="background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:10px;padding:14px 18px">
        <div style="color:var(--green);font-weight:800;margin-bottom:6px">✅ Verificación correcta</div>
        <div style="color:var(--t2);font-size:13px">Tu contraseña actual es:</div>
        <div style="font-family:var(--fm);font-size:18px;color:var(--t1);margin-top:6px;letter-spacing:2px">${esc(S.adminPass)}</div>
      </div>`;
      rr.classList.add('show');
    }
  } else {
    if (rr) {
      rr.innerHTML = `<div style="background:rgba(255,34,0,.1);border:1px solid rgba(255,34,0,.3);border-radius:10px;padding:12px 16px;color:var(--r);font-size:13px">❌ Respuesta incorrecta. Intenta de nuevo.</div>`;
      rr.classList.add('show');
    }
  }
}

function loadAdminUI() {
  // Planes
  renderPlanEditor();
  const ow = get('own-w'); if (ow) ow.value = S.ownerWeb;
  const oa = get('own-a'); if (oa) oa.value = S.ownerApk;
  // Free
  const fd = get('free-desc-inp'); if (fd) fd.value = S.config.freeDesc || '';
  const ff = get('free-feats-inp'); if (ff) ff.value = (S.config.freeFeats || []).join('\n');
  // Contacto
  renderContactEditor();
  // Links
  renderLinkEditor();
  // Textos
  setVal('cfg-sname', S.config.systemName);
  const sub = get('cfg-sub'); if (sub) sub.value = (S.config.heroSub || '').replace(/<[^>]+>/g, '');
  setVal('cfg-author', S.config.author);
  // Avatar
  renderAvatarEditor();
  // Seguridad
  const rs = get('rec-secret'); if (rs) rs.value = S.recoverAnswer || '';
}

// ════════════════════════════════════════════════════════
//  PLANES EDITOR
// ════════════════════════════════════════════════════════
function renderPlanEditor() {
  const c = get('plan-ed'); if (!c) return;
  c.innerHTML = S.plans.map((p, i) => `
    <div class="ped-row">
      <div class="ped-ico">${p.icon}</div>
      <input value="${esc(p.name)}" placeholder="Nombre" onchange="S.plans[${i}].name=this.value">
      <input value="${esc(p.period)}" placeholder="Ej: 3 meses" onchange="S.plans[${i}].period=this.value">
      <input type="number" value="${p.price}" placeholder="Precio CUP" onchange="S.plans[${i}].price=+this.value">
      <input type="number" value="${p.promo}" placeholder="Con promo" onchange="S.plans[${i}].promo=+this.value">
      <button class="ped-del" onclick="delPlan(${i})">✕</button>
    </div>`).join('');
}

function addPlan() {
  const icons = ['⚡','🌙','🔥','🏆','💎','🎯','🚀','💡','⭐','🔶'];
  S.plans.push({ id: 'p_' + Date.now(), icon: icons[S.plans.length % icons.length],
    name: 'NUEVO', period: '1 mes', price: 5000, promo: 7500, popular: false,
    feats: ['Característica 1', 'Característica 2', 'Característica 3'] });
  renderPlanEditor();
}

function delPlan(i) {
  if (S.plans.length <= 1) { toast('⚠️ Debe haber al menos un plan', 'e'); return; }
  if (!confirm('¿Eliminar este plan?')) return;
  S.plans.splice(i, 1);
  renderPlanEditor();
}

function savePlans() {
  saveS();
  renderPlansGrid();
  renderCompareTable();
  updateStat('st-plans', S.plans.length);
  toast('✅ Planes guardados', 's');
}

function saveOwner() {
  S.ownerWeb = parseInt(get('own-w').value) || 30000;
  S.ownerApk = parseInt(get('own-a').value) || 50000;
  saveS(); renderOwnerGrid(); renderCompareTable();
  toast('✅ Precios propietario guardados', 's');
}

// ════════════════════════════════════════════════════════
//  PLAN FREE
// ════════════════════════════════════════════════════════
function saveFreeConfig() {
  S.config.freeDesc = (get('free-desc-inp') || {}).value || '';
  S.config.freeFeats = ((get('free-feats-inp') || {}).value || '').split('\n').map(s => s.trim()).filter(Boolean);
  saveS();
  const fd = document.getElementById('free-desc');
  if (fd) fd.textContent = S.config.freeDesc;
  renderFreeFeats();
  toast('✅ Plan free actualizado', 's');
}

// ════════════════════════════════════════════════════════
//  AVATAR EDITOR
// ════════════════════════════════════════════════════════
function renderAvatarEditor() {
  setVal('ava-name-inp', S.avatar.name);
  setVal('ava-img-url', S.avatar.img || '');
  // Preview mini
  const pm = get('ava-preview-mini');
  if (pm) {
    if (S.avatar.img) {
      pm.innerHTML = `<img class="ava-img-preview" src="${S.avatar.img}" style="display:block">`;
    } else {
      pm.innerHTML = `<div class="ava-img-ph">🤖</div>`;
    }
  }
  // Colores
  document.querySelectorAll('.color-opt').forEach(el => {
    const [c] = el.dataset.color.split(',');
    el.classList.toggle('sel', c === S.avatar.color);
  });
  // Mensajes
  renderAvaMsgsEditor();
}

function renderAvaMsgsEditor() {
  const c = get('ava-msgs-ed'); if (!c) return;
  c.innerHTML = S.avatar.msgs.map((msg, i) => `
    <div class="ava-msg-row">
      <input value="${esc(msg)}" placeholder="Mensaje del avatar..." onchange="S.avatar.msgs[${i}]=this.value">
      <button onclick="delAvaMsg(${i})">✕</button>
    </div>`).join('');
}

function addAvaMsg() { S.avatar.msgs.push('¡Nuevo mensaje del avatar!'); renderAvaMsgsEditor(); }
function delAvaMsg(i) { if (S.avatar.msgs.length <= 1) return; S.avatar.msgs.splice(i, 1); renderAvaMsgsEditor(); }

function setAvaColor(el) {
  const [color, fade] = el.dataset.color.split(',');
  S.avatar.color = color;
  S.avatar.colorFade = fade;
  S.avatar.gradient = el.style.background;
  document.querySelectorAll('.color-opt').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
}

function previewAvaImg() {
  const url = (get('ava-img-url') || {}).value || '';
  S.avatar.img = url;
  const pm = get('ava-preview-mini');
  if (pm) pm.innerHTML = url ? `<img class="ava-img-preview" src="${url}" style="display:block">` : `<div class="ava-img-ph">🤖</div>`;
}

async function uploadAvaImg(e) {
  const file = e.target.files[0]; if (!file) return;
  try {
    const imgUrl = await uploadRepoImage(file, 'avatar', { maxW: 320, maxH: 320, quality: 0.82, thumbW: 160, thumbH: 160, thumbQ: 0.72 });
    S.avatar.img = imgUrl;
    const url = get('ava-img-url'); if (url) url.value = imgUrl;
    const pm = get('ava-preview-mini');
    if (pm) pm.innerHTML = `<img class="ava-img-preview" src="${imgUrl}" style="display:block">`;
    saveS(); buildFloatingAvatar();
    toast('✅ Avatar actualizado', 's');
  } catch (err) {
    toast('❌ Error al subir avatar: ' + (err.message || err), 'e');
  }
}

function clearAvaImg() {
  S.avatar.img = '';
  const url = get('ava-img-url'); if (url) url.value = '';
  const pm = get('ava-preview-mini');
  if (pm) pm.innerHTML = `<div class="ava-img-ph">🤖</div>`;
}

function saveAvatar() {
  S.avatar.name = (get('ava-name-inp') || {}).value?.trim() || 'TiendaBot';
  // Recolectar mensajes de inputs
  const rows = document.querySelectorAll('.ava-msg-row input');
  S.avatar.msgs = Array.from(rows).map(i => i.value.trim()).filter(Boolean);
  if (!S.avatar.msgs.length) S.avatar.msgs = ['¡Hola! ¿Qué buscas hoy?'];
  saveS();
  initAvatar();
  toast('✅ Avatar actualizado', 's');
}

// ════════════════════════════════════════════════════════
//  CONTACTO EDITOR
// ════════════════════════════════════════════════════════
function renderContactEditor() {
  const c = get('con-ed'); if (!c) return;
  c.innerHTML = S.contacts.map((ct, i) => `
    <div class="con-row">
      <input class="con-icon-pick" value="${ct.icon}" onchange="S.contacts[${i}].icon=this.value" maxlength="3" style="text-align:center;font-size:20px">
      <input value="${esc(ct.title)}" placeholder="Título (WhatsApp...)" onchange="S.contacts[${i}].title=this.value">
      <input value="${esc(ct.value)}" placeholder="URL o enlace" onchange="S.contacts[${i}].value=this.value">
      <input value="${esc(ct.desc||'')}" placeholder="Descripción breve" onchange="S.contacts[${i}].desc=this.value">
      <button class="ped-del" onclick="delContact(${i})">✕</button>
    </div>`).join('');
}

function addContactRow() {
  S.contacts.push({ icon:'📞', title:'Nuevo contacto', value:'#', desc:'Descripción' });
  renderContactEditor();
}
function delContact(i) {
  if (S.contacts.length <= 1) { toast('⚠️ Al menos un contacto', 'e'); return; }
  S.contacts.splice(i, 1); renderContactEditor();
}
function saveContacts() {
  // Recolectar de los inputs actuales
  const rows = document.querySelectorAll('#con-ed .con-row');
  S.contacts = Array.from(rows).map(row => {
    const ins = row.querySelectorAll('input');
    return { icon: ins[0].value, title: ins[1].value, value: ins[2].value, desc: ins[3].value };
  });
  saveS(); renderContactGrid();
  toast('✅ Contactos guardados', 's');
}

// ════════════════════════════════════════════════════════
//  LINKS EDITOR
// ════════════════════════════════════════════════════════
function renderLinkEditor() {
  const c = get('lnk-ed'); if (!c) return;
  c.innerHTML = S.links.map((l, i) => `
    <div class="lnk-ed-row">
      <input value="${esc(l.icon)}" onchange="S.links[${i}].icon=this.value" style="width:54px;text-align:center;font-size:18px">
      <input value="${esc(l.title)}" placeholder="Título" onchange="S.links[${i}].title=this.value">
      <input value="${esc(l.sub)}" placeholder="Subtítulo" onchange="S.links[${i}].sub=this.value">
      <input value="${esc(l.url)}" placeholder="https://..." onchange="S.links[${i}].url=this.value">
      <input value="${esc(l.arrow)}" placeholder="Texto botón" onchange="S.links[${i}].arrow=this.value">
      <button class="del-btn" onclick="delLink(${i})">✕</button>
    </div>`).join('');
}

function addLinkRow() {
  S.links.push({ icon:'🔗', title:'Nuevo link', sub:'Descripción', url:'#', arrow:'Ver más' });
  renderLinkEditor();
}
function delLink(i) { S.links.splice(i, 1); renderLinkEditor(); }
function saveLinks() {
  const rows = document.querySelectorAll('#lnk-ed .lnk-ed-row');
  S.links = Array.from(rows).map(row => {
    const ins = row.querySelectorAll('input');
    return { icon: ins[0].value, title: ins[1].value, sub: ins[2].value, url: ins[3].value, arrow: ins[4].value };
  });
  saveS(); renderLinksGrid();
  toast('✅ Links guardados', 's');
}

// ════════════════════════════════════════════════════════
//  TEXTOS / CONFIG
// ════════════════════════════════════════════════════════
function saveCfg(key) {
  const map = { sname: ['cfg-sname', 'systemName'], sub: ['cfg-sub', 'heroSub'], author: ['cfg-author', 'author'] };
  const [id, prop] = map[key] || [];
  const el = get(id); if (!el) return;
  S.config[prop] = el.value.trim();
  saveS(); updateTexts();
  toast('✅ Guardado', 's');
}

// ════════════════════════════════════════════════════════
//  SEGURIDAD
// ════════════════════════════════════════════════════════
function changePass() {
  const op = (get('old-p') || {}).value || '';
  const np = (get('new-p') || {}).value || '';
  const msg = get('pmsg');
  if (op !== S.adminPass) { if (msg) { msg.textContent = '❌ Contraseña actual incorrecta'; msg.style.color = 'var(--r)'; } return; }
  if (!np || np.length < 4) { if (msg) { msg.textContent = '❌ Mínimo 4 caracteres'; msg.style.color = 'var(--r)'; } return; }
  S.adminPass = np; saveS();
  get('old-p').value = ''; get('new-p').value = '';
  if (msg) { msg.textContent = '✅ Contraseña actualizada'; msg.style.color = 'var(--green)'; }
  setTimeout(() => { if (msg) msg.textContent = ''; }, 3000);
}

function saveRecSecret() {
  const v = (get('rec-secret') || {}).value?.trim() || '';
  if (!v) { toast('❌ Ingresa una respuesta', 'e'); return; }
  S.recoverAnswer = v; saveS();
  const m = get('rec-msg');
  if (m) { m.textContent = '✅ Respuesta guardada'; m.style.color = 'var(--green)'; }
  setTimeout(() => { if (m) m.textContent = ''; }, 3000);
}

// ════════════════════════════════════════════════════════
//  EXPORTAR PDF
// ════════════════════════════════════════════════════════
function exportPDF() {
  const st = get('exp-status');
  if (st) st.textContent = '⏳ Generando PDF...';

  // Generar PDF directamente en el navegador usando reportlab-like approach
  // Como es HTML puro, usamos la API de impresión del navegador con estilos optimizados
  const data = buildExportData();
  const html = buildPrintHTML(data);
  const win = window.open('', '_blank');
  if (!win) { toast('❌ Permite ventanas emergentes', 'e'); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 800);
  if (st) st.textContent = '✅ Se abrió el diálogo de impresión. Elige "Guardar como PDF".';
  toast('📄 Abriendo diálogo de impresión', 'i');
}

function buildPrintHTML(data) {
  const plansRows = data.plans.map(p => `
    <tr>
      <td class="bold">${p.icon} ${p.name}</td>
      <td>${p.period}</td>
      <td class="price-n">${fmt(p.price)} CUP</td>
      <td class="price-p">${fmt(p.promo)} CUP</td>
      <td class="small">~${(() => { try { return fmt(Math.round(p.price/parseInt(p.period))); } catch(e){return '—';} })()} CUP/mes</td>
    </tr>`).join('');

  const featsRows = data.plans.map(p => `
    <div class="plan-card">
      <div class="plan-icon">${p.icon}</div>
      <div class="plan-name">${p.name}</div>
      <div class="plan-period">${p.period} de acceso</div>
      <div class="plan-price">${fmt(p.price)} <span style="font-size:13px;font-weight:400;color:#888">CUP</span></div>
      <div class="plan-promo">Con promo: ${fmt(p.promo)} CUP</div>
      <ul class="plan-feats">${(p.feats||[]).map(f=>`<li>${f}</li>`).join('')}</ul>
    </div>`).join('');

  const contactsHTML = data.contacts.map(c => `<div class="contact-item"><span>${c.icon}</span><strong>${c.title}:</strong> ${c.value}</div>`).join('');

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>${data.systemName} — Catálogo de Precios</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Nunito',Arial,sans-serif;background:#080808;color:#f9f5f1;
  -webkit-print-color-adjust:exact;print-color-adjust:exact}
@media print{body{background:#080808!important;color:#f9f5f1!important}} 
.page{max-width:800px;margin:0 auto;padding:30px}

/* PORTADA */
.cover{background:linear-gradient(160deg,#0a0a0a 0%,#1a0800 100%);
  border:2px solid #ff6600;border-radius:20px;padding:50px 40px;
  margin-bottom:30px;position:relative;overflow:hidden;page-break-after:always}
.cover-bar{height:5px;background:linear-gradient(90deg,#ff2200,#ff6600,#ff8800);
  border-radius:3px;margin-bottom:30px}
.cover-tag{display:inline-block;background:rgba(255,102,0,.12);
  border:1px solid rgba(255,102,0,.3);border-radius:20px;
  padding:4px 16px;font-size:11px;font-weight:800;color:#ff8800;
  letter-spacing:1px;text-transform:uppercase;margin-bottom:16px}
.cover-title{font-size:54px;font-weight:900;line-height:.9;margin-bottom:8px}
.cover-title .fire{background:linear-gradient(135deg,#ff2200,#ff6600,#ff8800);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.cover-sub{font-size:15px;color:#a09080;margin-bottom:20px}
.cover-line{height:2px;background:linear-gradient(90deg,#ff6600,transparent);width:200px;margin-bottom:16px}
.cover-author{font-size:13px;color:#ff8800;font-weight:800}
.cover-job{font-size:11px;color:#504030;margin-top:3px}
.cover-date{font-size:10px;color:#504030;margin-top:30px}
.cover-deco{position:absolute;right:30px;top:50%;transform:translateY(-50%);
  width:140px;height:140px;border-radius:50%;
  border:2px solid rgba(255,102,0,.15);display:flex;align-items:center;
  justify-content:center;font-size:50px;background:rgba(255,102,0,.05)}

/* SECCIONES */
.section{margin-bottom:28px}
.sec-header{display:flex;align-items:center;gap:10px;margin-bottom:16px;
  padding-bottom:8px;border-bottom:2px solid #ff6600}
.sec-header .ico{font-size:22px}
.sec-header h2{font-size:20px;font-weight:900;color:#ff8800}

/* FREE BANNER */
.free-banner{background:linear-gradient(135deg,#0a1f0a,#0d2a0d);
  border:2px solid rgba(34,197,94,.4);border-radius:14px;padding:22px;margin-bottom:22px}
.free-badge{display:inline-block;background:rgba(34,197,94,.12);
  border:1px solid rgba(34,197,94,.3);border-radius:20px;
  padding:3px 13px;font-size:11px;font-weight:800;color:#22c55e;margin-bottom:10px}
.free-title{font-size:20px;font-weight:900;color:#22c55e;margin-bottom:6px}
.free-sub{font-size:12px;color:#a09080;margin-bottom:12px;line-height:1.6}
.free-feats-wrap{display:flex;flex-wrap:wrap;gap:7px}
.free-feat-pill{background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);
  border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600;color:#22c55e}
.free-feat-pill::before{content:'✓ '}

/* PLANES GRID */
.plans-wrap{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}
.plan-card{background:#111;border:1px solid #2a2a2a;border-radius:14px;padding:18px 14px}
.plan-icon{font-size:24px;margin-bottom:8px}
.plan-name{font-size:14px;font-weight:900;margin-bottom:2px}
.plan-period{font-size:10px;color:#504030;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px}
.plan-price{font-size:28px;font-weight:900;color:#ff8800;line-height:1;margin-bottom:3px}
.plan-promo{font-size:11px;color:#ff2200;font-weight:700;margin-bottom:10px}
.plan-feats{list-style:none;display:flex;flex-direction:column;gap:5px}
.plan-feats li{font-size:10px;color:#a09080}
.plan-feats li::before{content:'▸ ';color:#ff6600}

/* TABLA */
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:#1a1810;color:#ff8800;padding:9px 12px;text-align:left;
  font-weight:800;text-transform:uppercase;letter-spacing:.5px}
td{padding:9px 12px;border-bottom:1px solid #1e1e1e;color:#a09080;vertical-align:middle}
td:first-child{font-weight:700;color:#f9f5f1}
.price-n{color:#ff8800;font-weight:800}
.price-p{color:#ff2200;font-weight:800}
.price-u{color:#22c55e;font-weight:800}
.free-row td{color:#22c55e!important}
tr:nth-child(even) td{background:rgba(255,255,255,.02)}

/* PROPIETARIO */
.owner-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px}
.owner-card{background:#111;border:1px solid #2a2a2a;border-radius:14px;padding:20px}
.owner-card.prem{border-color:#ff6600}
.owner-icon{font-size:32px;margin-bottom:10px}
.owner-name{font-size:16px;font-weight:900;margin-bottom:6px}
.owner-price{font-size:32px;font-weight:900;margin-bottom:8px;
  background:linear-gradient(135deg,#ff2200,#ff8800);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.owner-feats{list-style:none;display:flex;flex-direction:column;gap:5px;margin-top:10px}
.owner-feats li{font-size:11px;color:#a09080}
.owner-feats li::before{content:'▸ ';color:#ff6600}

/* CONTACTO */
.contact-wrap{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
.contact-item{background:#111;border:1px solid #2a2a2a;border-radius:10px;
  padding:10px 14px;font-size:12px;color:#a09080;display:flex;align-items:center;gap:8px}
.contact-item strong{color:#f9f5f1}

/* UTILS */
.bold{font-weight:800}
.small{font-size:11px}
.mt{margin-top:20px}
.footer-bar{margin-top:30px;padding-top:16px;border-top:2px solid #ff6600;text-align:center;color:#504030;font-size:11px}

/* ══ TESTI CAROUSEL ══ */
.testi-card{background:linear-gradient(145deg,var(--card),var(--card2));border:1px solid var(--bdr);border-radius:20px;padding:26px;flex:0 0 calc(33.333% - 14px);min-width:0;position:relative;overflow:hidden;transition:all .26s}
.testi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--fire)}
.testi-card:hover{border-color:var(--o);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.4),var(--glow)}
.testi-stars{color:#ffd700;font-size:16px;margin-bottom:12px;letter-spacing:2px}
.testi-txt{font-size:13px;color:var(--t2);line-height:1.7;margin-bottom:16px;font-style:italic}
.testi-author{display:flex;align-items:center;gap:10px}
.testi-ava{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid var(--o);flex-shrink:0;font-size:18px;background:var(--bg2);display:flex;align-items:center;justify-content:center}
.testi-name{font-family:var(--fh);font-size:13px;font-weight:800;color:var(--t1);margin-bottom:2px}
.testi-store{font-size:11px;color:var(--o)}
/* ══ RESPONSIVE CARDS ══ */
@media(max-width:600px){.testi-card{flex:0 0 100%}}
@media(min-width:601px) and (max-width:900px){.testi-card{flex:0 0 calc(50% - 10px)}}
/* ══ PROMO LINK EDITOR ══ */
.plink-row{background:var(--bg2);border:1px solid var(--bdr);border-radius:var(--rb);padding:12px;margin-bottom:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
@media(max-width:600px){.plink-row{grid-template-columns:1fr}}
/* ══ RESPONSIVO GENERAL ══ */
@media(max-width:480px){
  .fr{flex-direction:column}
  .fg{width:100%}
  .tbar{flex-wrap:wrap;gap:8px}
  .tbar-btns{flex-wrap:wrap}
  .mbox{margin:8px;border-radius:14px}
  .mbox.md{max-width:100%}
  .hdr-in{flex-wrap:wrap;gap:8px}
  .adm-nav{min-width:120px!important}
}
@media(max-width:360px){
  .btn{padding:9px 14px;font-size:12px}
  .sec-h{font-size:clamp(20px,6vw,36px)}
}

/* ══ BTN-SHOP: hexagonal parallelogram ══ */
#btn-goto-shop{
  display:none;align-items:center;gap:8px;
  background:linear-gradient(135deg,#ff2200,#ff6600,#ff8800);
  color:#fff;border:none;cursor:pointer;
  font-family:var(--fh);font-size:12px;font-weight:900;
  padding:9px 22px 9px 16px;
  clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);
  transition:all .22s;letter-spacing:.3px;
  box-shadow:0 4px 18px rgba(255,102,0,.45);
  white-space:nowrap;text-decoration:none;
  animation:shopPulse 2.5s ease-in-out infinite alternate;
  position:relative;overflow:hidden;
}
#btn-goto-shop::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 40%,rgba(255,255,255,.15),transparent 60%);transform:translateX(-100%);animation:shopShimmer 3s ease-in-out infinite}
#btn-goto-shop:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,102,0,.7);clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)}
@keyframes shopPulse{from{box-shadow:0 4px 14px rgba(255,102,0,.4)}to{box-shadow:0 4px 26px rgba(255,102,0,.8),0 0 50px rgba(255,34,0,.2)}}
@keyframes shopShimmer{0%{transform:translateX(-100%)}60%,100%{transform:translateX(100%)}}
/* ══ CONFIRM MODAL ELEGANT ══ */
.m-confirm-top{height:5px;background:linear-gradient(90deg,#ff2200,#ff6600,#ff8800);border-radius:18px 18px 0 0}
.m-confirm-ico{font-size:48px;margin-bottom:14px;animation:logoPop 2s ease-in-out infinite alternate;display:block}
</style>
</head>
<body>
<div class="page">

<!-- PORTADA -->
<div class="cover">
  <div class="cover-deco">🔥</div>
  <div class="cover-bar"></div>
  <div class="cover-tag">Sistema de Ventas Profesional</div>
  <div class="cover-title"><span>${esc(data.systemName.replace(' Pro','').toUpperCase())} </span><span class="fire">PRO</span></div>
  <div class="cover-sub">Catálogo de Planes y Precios 2025</div>
  <div class="cover-line"></div>
  <div class="cover-author">${esc(data.author)}</div>
  <div class="cover-job">Ingeniero en Informática</div>
  <div class="cover-date">Generado: ${new Date().toLocaleDateString('es-ES', {year:'numeric',month:'long',day:'numeric'})}</div>
</div>

<!-- PLAN FREE -->
<div class="section">
  <div class="sec-header"><span class="ico">🎁</span><h2>Plan Gratuito</h2></div>
  <div class="free-banner">
    <div class="free-badge">✨ 7 Días GRATIS</div>
    <div class="free-title">Sistema Web + APK Android — Sin Costo para Probar</div>
    <div class="free-sub">${esc(data.freeDesc)}</div>
    <div class="free-feats-wrap">${(data.freeFeats||[]).map(f=>`<div class="free-feat-pill">${esc(f)}</div>`).join('')}</div>
  </div>
</div>

<!-- PLANES -->
<div class="section">
  <div class="sec-header"><span class="ico">💳</span><h2>Planes de Suscripción</h2></div>
  <div class="plans-wrap">${featsRows}</div>
</div>

<!-- TABLA COMPARATIVA -->
<div class="section">
  <div class="sec-header"><span class="ico">📊</span><h2>Tabla Comparativa de Precios</h2></div>
  <table>
    <thead><tr><th>Plan</th><th>Duración</th><th>Precio Normal</th><th>Con Promoción</th><th>Por Mes</th></tr></thead>
    <tbody>
      <tr class="free-row"><td>🎁 FREE</td><td>7 días</td><td class="price-u">GRATIS</td><td class="price-u">GRATIS</td><td class="price-u">Prueba</td></tr>
      ${plansRows}
      <tr><td>💻 Sistema Web</td><td>Propietario</td><td class="price-u">${fmt(data.ownerWeb)} CUP</td><td>—</td><td style="color:#22c55e;font-weight:800">Pago único</td></tr>
      <tr><td>🚀 Sistema Web + APK</td><td>Propietario</td><td class="price-u">${fmt(data.ownerApk)} CUP</td><td>—</td><td style="color:#22c55e;font-weight:800">Pago único</td></tr>
    </tbody>
  </table>
  <p style="font-size:11px;color:#504030;margin-top:8px">* La Promoción añade +2,500 CUP adicionales cada 3 meses al precio del plan activo.</p>
</div>

<!-- PROPIETARIO -->
<div class="section">
  <div class="sec-header"><span class="ico">🏠</span><h2>Opciones de Propietario</h2></div>
  <div class="owner-grid">
    <div class="owner-card">
      <div class="owner-icon">💻</div>
      <div class="owner-name">SISTEMA WEB</div>
      <div class="owner-price">${fmt(data.ownerWeb)} <span style="font-size:14px;font-weight:400;-webkit-text-fill-color:#888">CUP</span></div>
      <ul class="owner-feats">
        <li>Código fuente completo</li><li>Licencia permanente</li>
        <li>Sistema completo de tienda</li><li>Sin pagos mensuales</li>
      </ul>
    </div>
    <div class="owner-card prem">
      <div class="owner-icon">🚀</div>
      <div class="owner-name">SISTEMA + APK</div>
      <div class="owner-price">${fmt(data.ownerApk)} <span style="font-size:14px;font-weight:400;-webkit-text-fill-color:#888">CUP</span></div>
      <ul class="owner-feats">
        <li>Todo lo del Sistema Web</li><li>APK Android personalizada</li>
        <li>Tu nombre y logo</li><li>Distribución ilimitada</li>
      </ul>
    </div>
  </div>
</div>

<!-- CONTACTO -->
<div class="section">
  <div class="sec-header"><span class="ico">📞</span><h2>Formas de Contacto</h2></div>
  <div class="contact-wrap">${contactsHTML}</div>
</div>

<div class="footer-bar">
  <strong style="color:#ff8800">${esc(data.systemName)}</strong> · 
  Desarrollado por ${esc(data.author)} · Ing. en Informática · © 2025
</div>
</div>
</body></html>`;
}

// ════════════════════════════════════════════════════════
//  EXPORTAR DOC
// ════════════════════════════════════════════════════════
function exportDOC() {
  const st = get('exp-status');
  if (st) st.textContent = 'Generando DOC...';
  const data = buildExportData();
  // Limpiar emojis y no-latin (evita garabatos en Word)
  const cl = s => (s||'').replace(/[\u{1F000}-\u{1FFFF}]/gu,'').replace(/[^\x00-\xFF]/g,'').replace(/[►▸•]/g,'>').trim();
  const c1 = t=>`{\\cf1\\b ${cl(t)}\\b0}`;
  const c2 = t=>`{\\cf2\\b ${cl(t)}\\b0}`;
  const c3 = t=>`{\\cf3\\b ${cl(t)}\\b0}`;
  const c4 = t=>`{\\cf4 ${cl(t)}}`;
  const h1 = t=>`\\pard\\sb240\\sa100{\\cf1\\b\\fs34 ${cl(t)}\\b0\\fs24}\\par\n`;
  const h2 = t=>`\\pard\\sb160\\sa80{\\cf1\\b\\fs28 ${cl(t)}\\b0\\fs24}\\par\n`;
  const p  = t=>`\\pard\\sa80{\\cf4\\fs22 ${cl(t)}}\\par\n`;
  const hr = ()=>'\\pard\\brdrb\\brdrs\\brdrw15\\brdrcolor FF6600\\par\n';
  let rtf='{\\rtf1\\ansi\\ansicpg1252\\deff0\n';
  rtf+='{\\colortbl;\\red255\\green102\\blue0;\\red204\\green51\\blue0;\\red22\\green163\\blue74;\\red100\\green80\\blue60;}\n';
  rtf+='{\\fonttbl{\\f0\\fswiss\\fcharset0 Arial;}}\n\\f0\\fs24\n';
  rtf+=`\\pard\\sa160{\\b\\fs56\\cf1 ${cl(data.systemName).toUpperCase()}}\\par\n`;
  rtf+=`\\pard\\sa80{\\fs28\\cf4 Catalogo de Planes y Precios 2025}\\par\n`;
  rtf+=`\\pard\\sa80{\\cf1\\b ${cl(data.author)}} {\\cf4\\fs20 - Ing. en Informatica}\\par\n`;
  rtf+=hr();
  rtf+=h1('PLAN GRATUITO - 7 DIAS GRATIS');
  rtf+=p(data.freeDesc);
  rtf+=`\\pard\\sa60{\\cf3\\b Incluye: }${c4((data.freeFeats||[]).map(cl).join(' - '))}\\par\n`;
  rtf+=hr();
  rtf+=h1('PLANES DE SUSCRIPCION');
  data.plans.forEach(pl=>{
    rtf+=`\\pard\\sb120\\sa40{\\cf1\\b\\fs28 ${cl(pl.name)}} {\\cf4\\fs22 - ${cl(pl.period)} de acceso}\\par\n`;
    rtf+=`\\pard\\sa40 Precio normal: ${c3(fmt(pl.price)+' CUP')}   Con promocion: ${c2(fmt(pl.promo)+' CUP')}\\par\n`;
    rtf+=`\\pard\\sa40{\\cf4\\fs20 ${(pl.feats||[]).map(f=>'> '+cl(f)).join('  ')}}\\par\n`;
  });
  rtf+=hr();
  rtf+=h1('OPCIONES DE PROPIETARIO');
  rtf+=h2('SISTEMA WEB');
  rtf+=`\\pard\\sa60 Precio: ${c3(fmt(data.ownerWeb)+' CUP - Pago unico')}\\par\n`;
  rtf+=p('Codigo fuente completo - Licencia permanente - Sistema completo');
  rtf+=h2('SISTEMA + APK');
  rtf+=`\\pard\\sa60 Precio: ${c3(fmt(data.ownerApk)+' CUP - Pago unico')}\\par\n`;
  rtf+=p('Todo lo del Sistema Web + APK Android personalizada');
  rtf+=hr();
  rtf+=h1('FORMAS DE CONTACTO');
  data.contacts.forEach(c=>{
    rtf+=`\\pard\\sa60{\\b ${cl(c.title)}:} {\\cf4 ${cl(c.value||c.desc||'')}}\\par\n`;
  });
  rtf+='}\n';
  // Codificar como latin-1 byte a byte
  const bytes=[];for(let i=0;i<rtf.length;i++){const cd=rtf.charCodeAt(i);bytes.push(cd<256?cd:63);}
  const blob=new Blob([new Uint8Array(bytes)],{type:'application/rtf;charset=windows-1252'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='catalogo_mitienda_pro.rtf';a.click();
  if(st)st.textContent='DOC descargado. Abrelo con Word o LibreOffice.';
  toast('DOC generado','s');
}

// ════════════════════════════════════════════════════════
//  BACKUP JSON
// ════════════════════════════════════════════════════════
function buildExportData() {
  return {
    systemName: S.config.systemName,
    author:     S.config.author,
    freeDesc:   S.config.freeDesc,
    freeFeats:  S.config.freeFeats,
    plans:      S.plans,
    ownerWeb:   S.ownerWeb,
    ownerApk:   S.ownerApk,
    contacts:   S.contacts,
    links:      S.links,
    avatar:     S.avatar,
  };
}

function importJSON(e) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    try {
      const p = JSON.parse(ev.target.result);
      if (!confirm('¿Importar configuración? Reemplazará los datos actuales.')) return;
      if (p.adminPass) S.adminPass = dec(p.adminPass);
      if (p.config) S.config = Object.assign({}, S.config, p.config);
      if (p.plans) S.plans = p.plans;
      if (p.ownerWeb) S.ownerWeb = p.ownerWeb;
      if (p.ownerApk) S.ownerApk = p.ownerApk;
      if (p.contacts) S.contacts = p.contacts;
      if (p.links) S.links = p.links;
      if (p.avatar) S.avatar = Object.assign({}, S.avatar, p.avatar);
      saveS(); loadAdminUI(); renderAll();
      toast('✅ Datos importados', 's');
    } catch(err) { toast('❌ Archivo inválido', 'e'); }
  };
  r.readAsText(f);
  e.target.value = '';
}

// ════════════════════════════════════════════════════════
//  EXIT CONFIRM
// ════════════════════════════════════════════════════════
function setupExit() {
  window.addEventListener('beforeunload', e => {
    e.preventDefault(); e.returnValue = '';
  });
}
function cancelExit() { get('exit-dlg').classList.add('hidden'); S.exitTarget = null; }
function confirmExit() { S.exitTarget ? window.location.href = S.exitTarget : window.close(); }

// ════════════════════════════════════════════════════════
//  MODALES, HELPERS, REVEAL
// ════════════════════════════════════════════════════════
function openM(id) { const e = get(id); if (e) e.classList.remove('hidden'); }
function closeM(id) { const e = get(id); if (e) e.classList.add('hidden'); }

function setupEsc() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    ['m-alog', 'm-rec'].forEach(id => closeM(id));
  });
  document.addEventListener('click', e => {
    if (e.target.classList.contains('mov')) closeM(e.target.id);
  });
}

function setupReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: .07 });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
}

function toast(msg, type = '') {
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = msg;
  const c = get('toaster');
  if (c) { c.appendChild(el); setTimeout(() => el.remove(), 3200); }
}


// ══ ENCRIPTACIÓN SIMPLE (ofuscación XOR) ══
const _K = [0x4d,0x54,0x50,0x72,0x6f,0x21];
function enc(s){if(!s)return'';let r='';for(let i=0;i<s.length;i++)r+=String.fromCharCode(s.charCodeAt(i)^_K[i%_K.length]);return btoa(r);}
function dec(s){if(!s)return'';try{const d=atob(s);let r='';for(let i=0;i<d.length;i++)r+=String.fromCharCode(d.charCodeAt(i)^_K[i%_K.length]);return r;}catch(e){return s;}}

// ══ VER CONTRASEÑA genérica ══
function tvs(id,btn){const el=get(id);if(!el||!btn)return;el.type=el.type==='password'?'text':'password';btn.textContent=el.type==='password'?'👁':'🙈';}

// ══ CAPS LOCK WARNING ══
function checkCaps(e,targetId){
  const on=e.getModifierState&&e.getModifierState('CapsLock');
  const el=get(targetId);if(!el)return;
  if(on){el.classList.remove('hidden');}else{el.classList.add('hidden');}
}

// ══ WA HELPERS ══
function getWA(){
  const c=S.contacts.find(x=>x.value&&x.value.includes('wa.me'));
  if(c){const m=c.value.match(/wa\.me\/(\d+)/);if(m)return m[1];}
  return (S.config.wa||'5354693549').replace(/\D/g,'');
}
function planWA(pid){
  const p=S.plans.find(x=>x.id===pid);if(!p)return;
  const price=S.promoActive?p.promo:p.price;
  const msg=p.waMsg||`Hola! Quiero el plan *${p.name}* (${p.period}) por ${fmt(price)} CUP.\n\nCaracteristicas:\n${(p.feats||[]).map(f=>'- '+f).join('\n')}\n\nPuedes procesarlo?`;
  window.open('https://wa.me/'+getWA()+'?text='+encodeURIComponent(msg),'_blank');
}
function freeWA(){
  const msg=S.config.freeWaMsg||`Hola! Quiero la *PRUEBA GRATUITA DE 7 DIAS* del sistema web + APK Android.\n\nVi la oferta y me interesa probarlo sin costo. Puedes activarla?`;
  window.open('https://wa.me/'+getWA()+'?text='+encodeURIComponent(msg),'_blank');
}
function ownerWA(tipo){
  const isA=tipo==='apk';
  const price=isA?S.ownerApk:S.ownerWeb;
  const label=isA?'Sistema Web + APK Android':'Sistema Web';
  const msg=S.config[isA?'ownerApkWaMsg':'ownerWebWaMsg']||`Hola! Quiero comprar el *${label}* (Licencia permanente) por ${fmt(price)} CUP.\n\nPuedes enviarme los detalles del pago?`;
  window.open('https://wa.me/'+getWA()+'?text='+encodeURIComponent(msg),'_blank');
}

// ══ IMAGEN CONTACTO ══
function previewCtcBg(url){const el=get('ctc-bg-img');if(el)el.style.backgroundImage=url?`url('${url}')`:'none';}
async function uploadCtcBg(e){
  const f=e.target.files[0]; if(!f) return;
  try {
    const imgUrl = await uploadRepoImage(f, 'contacto-bg', { maxW: 1600, maxH: 1200, quality: 0.84, thumbW: 320, thumbH: 240, thumbQ: 0.7 });
    S.config.ctcImg = imgUrl;
    previewCtcBg(S.config.ctcImg);
    saveS();
    toast('Imagen cargada','s');
  } catch(err) {
    toast('❌ Error al subir imagen: ' + (err.message || err), 'e');
  }
}
function clearCtcBg(){S.config.ctcImg='';previewCtcBg('');saveS();const i=get('cfg-ctc-img');if(i)i.value='';toast('Imagen eliminada');}
function saveCtcImg(){const url=(get('cfg-ctc-img')||{}).value?.trim()||'';if(url&&!url.startsWith('('))S.config.ctcImg=url;previewCtcBg(S.config.ctcImg||'');saveS();toast('Imagen guardada','s');}

// ══ PARTÍCULAS PROMO ══
function initPromoDots(){const c=get('promo-dots');if(!c)return;for(let i=0;i<16;i++){const d=document.createElement('div');const clrs=['rgba(168,85,247,','rgba(6,182,212,','rgba(255,102,0,','rgba(34,197,94,'];d.style.cssText=`position:absolute;border-radius:50%;pointer-events:none;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;background:${clrs[i%4]}${0.15+Math.random()*.35});animation:sdP ${3+Math.random()*7}s ease-in-out ${Math.random()*4}s infinite alternate`;c.appendChild(d);}}


// ══════════════════════════════════════════════
//  ANALYTICS
// ══════════════════════════════════════════════
function trackVisit(){
  if(!S.analytics) S.analytics={visits:0,regs:0,lastVisit:null};
  S.analytics.visits=(S.analytics.visits||0)+1;
  S.analytics.lastVisit=new Date().toISOString();
  saveS();
}
function trackReg(){
  if(!S.analytics) S.analytics={visits:0,regs:0,lastVisit:null};
  S.analytics.regs=(S.analytics.regs||0)+1;
  saveS();
}

// ══════════════════════════════════════════════
//  NOTIFICATIONS
// ══════════════════════════════════════════════
function pushNotif(msg,icon){
  if(!S.notifications) S.notifications=[];
  S.notifications.unshift({id:'n'+Date.now(),msg,icon:icon||'🔔',ts:new Date().toISOString(),read:false});
  if(S.notifications.length>200) S.notifications.length=200;
  saveS(); updateBadges();
}
function updateBadges(){
  const unread=(S.notifications||[]).filter(n=>!n.read).length;
  const nb=get('notif-nb');
  if(nb){nb.textContent=unread>99?'99+':unread; nb.classList.toggle('hidden',unread===0);}
  const pend=(S.sellers||[]).filter(s=>s.status==='pending').length;
  const sb=get('sellers-nb');
  if(sb){sb.textContent=pend; sb.classList.toggle('hidden',pend===0);}
}
function markAllRead(){
  (S.notifications||[]).forEach(n=>n.read=true);
  saveS(); renderNotifAdm(); updateBadges();
}
function delAllNotif(){
  if(!confirm('¿Eliminar todas las notificaciones?')) return;
  S.notifications=[]; saveS(); renderNotifAdm(); updateBadges();
}
function delNotif(id){
  S.notifications=(S.notifications||[]).filter(n=>n.id!==id);
  saveS(); renderNotifAdm(); updateBadges();
}
// ══════════════════════════════════════════════
//  DASHBOARD ADMIN
// ══════════════════════════════════════════════
function renderDash(){
  const el=get('dash-dt');
  if(el) el.textContent=new Date().toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const a=S.analytics||{};
  const sl=S.sellers||[];
  const cs=S.clientStores||[];
  const stats=[
    {n:a.visits||0,        l:'Visitas totales',      c:'var(--o)'},
    {n:a.regs||0,          l:'Registros totales',     c:'var(--green)'},
    {n:sl.length,          l:'Vendedores',            c:'var(--blue)'},
    {n:sl.filter(s=>s.status==='active').length,   l:'Activos',   c:'var(--green)'},
    {n:sl.filter(s=>s.status==='pending').length,  l:'Pendientes',c:'var(--yellow)'},
    {n:sl.filter(s=>s.status==='inactive').length, l:'Inactivos', c:'var(--r)'},
    {n:cs.length,          l:'Tiendas',              c:'var(--purple)'},
    {n:(S.notifications||[]).filter(n=>!n.read).length, l:'Sin leer', c:'var(--r)'},
  ];
  const sg=get('dash-stats');
  if(sg) sg.innerHTML=stats.map(s=>`<div class="adm-stat"><span class="sn" style="color:${s.c};font-size:26px">${s.n}</span><div class="sl">${s.l}</div></div>`).join('');
  const rr=get('dash-recent-reg');
  if(rr) rr.innerHTML=sl.slice(-5).reverse().map(s=>`
    <div style="padding:8px 0;border-bottom:1px solid var(--bdr2);font-size:13px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:700">${esc(s.fn+' '+s.ln)}</span>
      <span style="font-size:11px;color:var(--t3)">${new Date(s.ts).toLocaleDateString('es-ES')}</span>
    </div>`).join('')||'<div style="color:var(--t3);font-size:13px;padding:8px 0">Sin registros aún</div>';
  const rn=get('dash-recent-notif');
  if(rn) rn.innerHTML=(S.notifications||[]).slice(0,5).map(n=>`
    <div style="padding:8px 0;border-bottom:1px solid var(--bdr2);font-size:12px;display:flex;gap:8px;align-items:center">
      <span>${n.icon}</span><span style="flex:1;color:${n.read?'var(--t2)':'var(--t1)'};font-weight:${n.read?400:700}">${esc(n.msg.slice(0,55))}${n.msg.length>55?'…':''}</span>
    </div>`).join('')||'<div style="color:var(--t3);font-size:13px;padding:8px 0">Sin notificaciones</div>';
}


// ══════════════════════════════════════════════
//  VENDOR REGISTRATION
// ══════════════════════════════════════════════
function openVendorModal(){
  ['vr-fn','vr-ln','vr-ph','vr-em','vr-addr','vr-sn','vr-desc'].forEach(id=>{const e=get(id);if(e)e.value='';});
  const t=get('vr-terms'); if(t) t.checked=false;
  trackVisit();
  openM('m-vendor');
}
function submitVendor(){
  const fn=(get('vr-fn')||{}).value?.trim()||'';
  const ln=(get('vr-ln')||{}).value?.trim()||'';
  const ph=(get('vr-ph')||{}).value?.trim()||'';
  const sn=(get('vr-sn')||{}).value?.trim()||'';
  if(!fn||!ln){toast('❌ Nombre y apellidos son requeridos','e');return;}
  if(!ph){toast('❌ Teléfono es requerido','e');return;}
  if(!sn){toast('❌ Nombre de la tienda es requerido','e');return;}
  if(!get('vr-terms')?.checked){toast('❌ Debes aceptar los Términos y Condiciones','e');return;}
  if(!S.sellers) S.sellers=[];
  const s={
    id:'v'+Date.now(), fn, ln, ph,
    em:(get('vr-em')||{}).value?.trim()||'',
    addr:(get('vr-addr')||{}).value?.trim()||'',
    cat:(get('vr-cat')||{}).value||'Otros',
    sn, desc:(get('vr-desc')||{}).value?.trim()||'',
    storeUrl:'', status:'pending',
    ts:new Date().toISOString()
  };
  S.sellers.push(s); saveS();
  trackReg();
  pushNotif('Nuevo vendedor registrado: '+fn+' '+ln+' — Tienda: '+sn,'🏪');
  closeM('m-vendor');
  toast('✅ Solicitud enviada. Te contactaremos pronto.','s');
}

// ══════════════════════════════════════════════
//  SELLERS TABLE
// ══════════════════════════════════════════════
const SM={
  pending: {l:'⏳ Pendiente', c:'rgba(245,158,11,.15)', t:'#fbbf24'},
  active:  {l:'✅ Activo',    c:'rgba(34,197,94,.15)',  t:'var(--green)'},
  inactive:{l:'❌ Inactivo',  c:'rgba(255,34,0,.15)',   t:'var(--r)'},
  registered:{l:'📋 Registrado',c:'rgba(255,102,0,.1)',t:'var(--blue)'},
};
function changeSellerSt(id,st){
  const s=(S.sellers||[]).find(x=>x.id===id); if(!s) return;
  s.status=st; saveS();
  const lm={active:'activado ✅',inactive:'desactivado ❌',registered:'registrado 📋',pending:'pendiente ⏳'};
  pushNotif('Vendedor '+s.fn+' '+s.ln+' '+( lm[st]||st),'📋');
  renderSellers(); renderDash(); toast('Estado actualizado','s');
}
function delSeller(id){
  if(!confirm('¿Eliminar este vendedor permanentemente?')) return;
  S.sellers=(S.sellers||[]).filter(x=>x.id!==id); saveS();
  renderSellers(); updateBadges(); toast('🗑 Vendedor eliminado');
}
function delAllSellers(){
  if(!confirm('¿Eliminar TODOS los vendedores? Esta acción no se puede deshacer.')) return;
  S.sellers=[]; saveS(); renderSellers(); updateBadges();
}
function assignUrl(id){
  const s=(S.sellers||[]).find(x=>x.id===id); if(!s) return;
  s.storeUrl=(get('sd-url')||{}).value?.trim()||'';
  saveS(); closeM('m-sell-det'); renderSellers(); toast('✅ URL asignada','s');
}

// ══════════════════════════════════════════════
//  CLIENT STORES
// ══════════════════════════════════════════════
let _storeEdit=null, _storeCatF='Todas';
function delStore(id){
  if(!confirm('¿Eliminar esta tienda?')) return;
  S.clientStores=(S.clientStores||[]).filter(x=>x.id!==id);
  saveS(); renderAdmStores(); renderPublicStores(); toast('🗑 Tienda eliminada');
}
function renderPublicStores(){
  const g=get('stores-grid'); const em=get('stores-empty');
  if(!g) return;
  const all=(S.clientStores||[]).filter(s=>s.vis==='visible');
  const max=S.promoConfig?.storesVisible||6;
  // Category tabs
  const cats=['Todas',...new Set(all.map(s=>s.cat).filter(Boolean))];
  const ct=get('store-cat-tabs');
  if(ct) ct.innerHTML=cats.map(c=>`
    <button onclick="setStoreCat('${esc(c)}')" style="padding:6px 14px;border-radius:20px;border:1px solid ${_storeCatF===c?'var(--o)':'var(--bdr)'};background:${_storeCatF===c?'rgba(255,102,0,.12)':'var(--card)'};color:${_storeCatF===c?'var(--o)':'var(--t2)'};font-family:var(--fh);font-size:12px;font-weight:700;cursor:pointer;transition:all .18s">${c}</button>`
  ).join('');
  const filtered=_storeCatF==='Todas'?all:all.filter(s=>s.cat===_storeCatF);
  const shown=filtered.slice(0,max);
  if(!shown.length){g.innerHTML=''; em?.classList.remove('hidden'); return;}
  em?.classList.add('hidden');
  g.innerHTML=shown.map(s=>`
    <div class="store-card" onclick="window.open('${esc(s.url)}','_blank')">
      ${s.img?`<img class="sc-img" src="${esc(s.img)}" alt="${esc(s.name)}" onerror="this.parentNode.querySelector('.sc-body').style.marginTop='0';this.remove()">`
             :'<div class="sc-img" style="display:flex;align-items:center;justify-content:center;font-size:42px">🏪</div>'}
      <div class="sc-body">
        <div class="sc-cat">${esc(s.cat)}</div>
        <div class="sc-name">${esc(s.name)}</div>
        <div class="sc-desc">${esc(s.desc||'')}</div>
        <a href="${esc(s.url)}" target="_blank" class="sc-link" onclick="event.stopPropagation()">Visitar Tienda →</a>
      </div>
    </div>`).join('');
}
function setStoreCat(c){ _storeCatF=c; renderPublicStores(); }

// ══════════════════════════════════════════════
//  TERMS & CONDITIONS
// ══════════════════════════════════════════════
function renderTC(){
  const el=get('tc-pub-text');
  if(el) el.textContent=S.terms?.text||'Los términos y condiciones serán publicados próximamente.';
  const lr=get('tc-pub-link');
  if(lr) lr.innerHTML=S.terms?.url?`<a href="${esc(S.terms.url)}" target="_blank" class="btn btn-ol btn-sm">📄 Ver documento completo</a>`:'';
  // Admin fields
  const ti=get('tc-text-inp'); if(ti) ti.value=S.terms?.text||'';
  const tu=get('tc-url-inp');  if(tu) tu.value=S.terms?.url||'';
}
function saveTCAdm(){
  if(!S.terms) S.terms={url:'',text:''};
  S.terms.text=(get('tc-text-inp')||{}).value?.trim()||S.terms.text;
  S.terms.url=(get('tc-url-inp')||{}).value?.trim()||'';
  saveS(); renderTC(); toast('✅ Términos y Condiciones guardados','s');
}

let _autopubTimer=null;
function startAutopub(){
  if(!S.promoConfig) return;
  S.promoConfig.autopubActive=true; saveS();
  const as=get('autopub-st');
  if(as) as.textContent='✅ Activa — cada '+( S.promoConfig.autopubInterval||60)+' min';
  const msg=S.promoConfig.autopubMsg||'¡Hola! Conoce MiTienda Pro.';
  const num=getWA();
  if(S.promoConfig.platforms?.wa && num)
    window.open('https://wa.me/'+num+'?text='+encodeURIComponent(msg),'_blank');
  if(_autopubTimer) clearInterval(_autopubTimer);
  _autopubTimer=setInterval(()=>{
    if(S.promoConfig.platforms?.wa && num)
      window.open('https://wa.me/'+num+'?text='+encodeURIComponent(msg),'_blank');
  },(S.promoConfig.autopubInterval||60)*60000);
  toast('▶ Auto-publicación activada','s');
}
function stopAutopub(){
  if(_autopubTimer){clearInterval(_autopubTimer);_autopubTimer=null;}
  if(S.promoConfig) S.promoConfig.autopubActive=false;
  saveS();
  const as=get('autopub-st'); if(as) as.textContent='⏹ Detenida';
  toast('⏹ Auto-publicación detenida');
}

// ══════════════════════════════════════════════
//  ADMIN LOGOUT WITH CONFIRM
// ══════════════════════════════════════════════
function doAdminLogout(){
  closeM('m-admin-exit');
  adminLogout();
}

function get(id) { return document.getElementById(id); }
function togglePassView() {
  const inp = get('a-pass'); const btn = get('eye-btn'); if (!inp||!btn) return;
  inp.type = inp.type==='password' ? 'text' : 'password';
  btn.textContent = inp.type==='password' ? '👁' : '🙈';
}
function setHTML(id, html) { const e = get(id); if (e) e.innerHTML = html; }
function setVal(id, val) { const e = get(id); if (e) e.value = val || ''; }
function updateStat(id, val) { const e = get(id); if (e) e.textContent = val; }
function fmt(n) { try { return Number(n).toLocaleString('es-CU'); } catch(e) { return String(n); } }
function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}



// ═══════════════════════════════════════════════════════════
//  NEW FUNCTIONS — MiTienda Pro Enhanced
// ═══════════════════════════════════════════════════════════

// ── Affiliate link ──
function openAffiliateLink() {
  const url = (S.promoConfig||{}).affiliateUrl || '';
  if (url) window.open(url, '_blank');
  else toast('⚠️ Link de afiliados no configurado. Ve a Admin → Promoción.', 'e');
}
function saveAffUrl() {
  const v = (get('pconf-aff')||{}).value?.trim()||'';
  if (!S.promoConfig) S.promoConfig = {};
  S.promoConfig.affiliateUrl = v; saveS();
  toast('✅ Link de afiliados guardado', 's');
}

// ── Promo links CRUD ──
function renderPromoLinksEditor() {
  const c = get('promo-links-editor'); if (!c) return;
  const links = (S.promoConfig||{}).promoLinks || [];
  if (!links.length) { c.innerHTML = '<p style="color:var(--t3);font-size:13px">Sin canales. Agrega el primero.</p>'; return; }
  c.innerHTML = links.map((pl, i) => `
    <div class="plink-row">
      <div>
        <label class="lbl" style="margin-bottom:4px">🏷️ Título del canal</label>
        <input type="text" class="inp" value="${esc(pl.title)}" placeholder="WhatsApp, Facebook..." 
          oninput="S.promoConfig.promoLinks[${i}].title=this.value"
          style="margin:0;width:100%">
      </div>
      <div style="display:flex;gap:6px;align-items:flex-end">
        <div style="flex:1">
          <label class="lbl" style="margin-bottom:4px">🔗 Link del sistema web</label>
          <input type="text" class="inp" value="${esc(pl.url)}" placeholder="https://..."
            oninput="S.promoConfig.promoLinks[${i}].url=this.value"
            style="margin:0;width:100%">
        </div>
        <button onclick="delPromoLink(${i})" style="background:rgba(255,34,0,.12);border:1px solid rgba(255,34,0,.3);color:var(--r);border-radius:6px;padding:9px 11px;cursor:pointer;flex-shrink:0;margin-bottom:1px">✕</button>
      </div>
      <div style="grid-column:1/-1">
        <label class="lbl" style="margin-bottom:4px">💬 Mensaje de promoción</label>
        <textarea class="inp" rows="2" placeholder="Mensaje para este canal..."
          oninput="S.promoConfig.promoLinks[${i}].msg=this.value"
          style="margin:0;width:100%;resize:vertical">${esc(pl.msg||'')}</textarea>
      </div>
    </div>`).join('');
}
function addPromoLink() {
  if (!S.promoConfig) S.promoConfig = {};
  if (!S.promoConfig.promoLinks) S.promoConfig.promoLinks = [];
  S.promoConfig.promoLinks.push({ id: 'pl'+Date.now(), title: 'Nuevo Canal', url: '', msg: '' });
  renderPromoLinksEditor();
}
function delPromoLink(i) {
  if (S.promoConfig?.promoLinks) S.promoConfig.promoLinks.splice(i, 1);
  renderPromoLinksEditor();
}

// ── savePromoConf patch ──
function savePromoConf() {
  if (!S.promoConfig) S.promoConfig = {};
  S.promoConfig.title = (get('pconf-title')||{}).value?.trim() || S.promoConfig.title || '';
  S.promoConfig.subtitle = (get('pconf-sub')||{}).value?.trim() || S.promoConfig.subtitle || '';
  saveS();
  // Update promo section titles if exist
  const pt = document.querySelector('#promocionar .sec-h');
  if (pt && S.promoConfig.title) pt.innerHTML = esc(S.promoConfig.title);
  toast('✅ Configuración de promoción guardada', 's');
}
function loadPromoConf() {
  const pc = S.promoConfig || {};
  setVal('pconf-title', pc.title || '');
  setVal('pconf-sub', pc.subtitle || '');
  setVal('pconf-aff', pc.affiliateUrl || '');
  renderPromoLinksEditor();
  updateSecUI();
}

// ── renderNotifAdm patch: with filters ──
function renderNotifAdm() {
  const c = get('notif-adm-list'); if (!c) return;
  const q    = (get('nf-q')||{}).value?.toLowerCase()||'';
  const from = (get('nf-from')||{}).value||'';
  const to   = (get('nf-to')||{}).value||'';
  const type = (get('nf-type')||{}).value||'';
  const sort = (get('nf-sort')||{}).value||'new';
  const readF= (get('nf-read')||{}).value||'';
  let list = [...(S.notifications||[])];
  if (q)    list = list.filter(n => n.msg.toLowerCase().includes(q));
  if (from) list = list.filter(n => n.ts >= from);
  if (to)   list = list.filter(n => n.ts <= to+'T23:59:59');
  if (type) list = list.filter(n => n.icon === type);
  if (readF === 'unread') list = list.filter(n => !n.read);
  if (readF === 'read')   list = list.filter(n => n.read);
  if (sort === 'old')    list.sort((a,b) => a.ts.localeCompare(b.ts));
  else if (sort === 'unread') list.sort((a,b) => (a.read?1:0) - (b.read?1:0));
  else list.sort((a,b) => b.ts.localeCompare(a.ts));
  const cnt = get('notif-count');
  if (cnt) cnt.textContent = `${list.length} notificación${list.length!==1?'es':''} encontrada${list.length!==1?'s':''}`;
  if (!list.length) { c.innerHTML = '<div style="text-align:center;padding:40px;color:var(--t3)">Sin notificaciones con esos filtros</div>'; return; }
  c.innerHTML = list.map(n => `
    <div onclick="markNotifRead('${n.id}')" style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:${n.read?'var(--card)':'rgba(255,102,0,.07)'};border:1px solid ${n.read?'var(--bdr)':'rgba(255,102,0,.3)'};border-radius:10px;margin-bottom:8px;cursor:pointer;transition:all .2s">
      <span style="font-size:22px;flex-shrink:0">${n.icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:${n.read?400:700};color:${n.read?'var(--t2)':'var(--t1)'};word-break:break-word">${esc(n.msg)}</div>
        <div style="font-size:11px;color:var(--t3);margin-top:3px">${new Date(n.ts).toLocaleString('es-ES')}</div>
      </div>
      <button onclick="event.stopPropagation();delNotif('${n.id}')" style="background:none;border:none;color:var(--t3);cursor:pointer;font-size:15px;padding:0 4px;flex-shrink:0">✕</button>
    </div>`).join('');
}
function markNotifRead(id) {
  const n = (S.notifications||[]).find(x=>x.id===id); if(n) n.read=true; saveS(); renderNotifAdm(); updateBadges();
}
function clearNotifFilters() {
  ['nf-q','nf-from','nf-to'].forEach(id => setVal(id,''));
  ['nf-type','nf-sort','nf-read'].forEach(id => { const e=get(id); if(e) e.value=''; });
  renderNotifAdm();
}

// ── TESTIMONIALS ──
let _testiIdx = 0, _testiTimer = null;
let _testiEditId = null;
function openTestiModal(id) {
  _testiEditId = id;
  get('m-testi-ttl').textContent = id ? '✏️ Editar Opinión' : '⭐ Nueva Opinión';
  if (id) {
    const t = (S.testimonials||[]).find(x=>x.id===id); if(!t) return;
    setVal('ti-name',t.name); setVal('ti-store',t.store||''); setVal('ti-text',t.text); setVal('ti-img',t.img||'');
    if (get('ti-stars')) get('ti-stars').value = t.stars || 5;
  } else { ['ti-name','ti-store','ti-text','ti-img'].forEach(id=>setVal(id,'')); }
  openM('m-testi');
}
function saveTesti() {
  const name = (get('ti-name')||{}).value?.trim()||'';
  const text = (get('ti-text')||{}).value?.trim()||'';
  if (!name || !text) { toast('❌ Nombre y opinión requeridos','e'); return; }
  if (!S.testimonials) S.testimonials = [];
  const t = { id: _testiEditId||'ti'+Date.now(), name, store:(get('ti-store')||{}).value?.trim()||'', text, img:(get('ti-img')||{}).value?.trim()||'', stars:+(get('ti-stars')||{}).value||5 };
  if (_testiEditId) {
    const i = S.testimonials.findIndex(x=>x.id===_testiEditId); if(i!==-1) S.testimonials[i]=t;
  } else S.testimonials.push(t);
  saveS(); closeM('m-testi'); renderTestiAdm(); renderTestiPub();
  toast('✅ Opinión guardada','s');
}
function delTesti(id) {
  if (!confirm('¿Eliminar esta opinión?')) return;
  S.testimonials = (S.testimonials||[]).filter(x=>x.id!==id);
  saveS(); renderTestiAdm(); renderTestiPub();
}
function renderTestiAdm() {
  const g = get('testi-adm-grid'); if (!g) return;
  const list = S.testimonials||[];
  if (!list.length) { g.innerHTML='<div style="color:var(--t3);font-size:13px;padding:16px">Sin testimonios. Agrega el primero.</div>'; return; }
  g.innerHTML = list.map(t=>`
    <div style="background:var(--card);border:1px solid var(--bdr);border-radius:var(--rc);padding:16px">
      <div style="font-weight:800;font-size:13px;margin-bottom:3px">${esc(t.name)}</div>
      <div style="font-size:11px;color:var(--o);margin-bottom:6px">${esc(t.store||'')}</div>
      <div style="font-size:12px;color:var(--t2);margin-bottom:8px;line-height:1.5">${esc((t.text||'').slice(0,90))}${(t.text||'').length>90?'…':''}</div>
      <div style="color:#ffd700;font-size:13px;margin-bottom:10px">${'⭐'.repeat(t.stars||5)}</div>
      <div style="display:flex;gap:7px">
        <button onclick="openTestiModal('${t.id}')" class="btn btn-dk btn-sm" style="flex:1">✏️ Editar</button>
        <button onclick="delTesti('${t.id}')" class="btn btn-dng btn-sm">🗑</button>
      </div>
    </div>`).join('');
}
function renderTestiPub() {
  const track = get('testi-track');
  const empty = get('testi-empty-pub');
  const ctrl  = get('testi-controls');
  if (!track) return;
  const list = S.testimonials||[];
  if (!list.length) {
    track.innerHTML=''; if(empty) empty.style.display='block'; if(ctrl) ctrl.style.display='none'; return;
  }
  if (empty) empty.style.display='none';
  if (ctrl) ctrl.style.display='flex';
  track.innerHTML = list.map(t=>`
    <div class="testi-card">
      <div class="testi-stars">${'⭐'.repeat(t.stars||5)}</div>
      <div class="testi-txt">"${esc(t.text)}"</div>
      <div class="testi-author">
        ${t.img ? `<img class="testi-ava" src="${esc(t.img)}" alt="${esc(t.name)}" onerror="this.outerHTML='<div class=testi-ava>😊</div>'">`
                : `<div class="testi-ava">😊</div>`}
        <div><div class="testi-name">${esc(t.name)}</div><div class="testi-store">${esc(t.store||'')}</div></div>
      </div>
    </div>`).join('');
  renderTestiDots();
  testiGoTo(0);
  if (_testiTimer) clearInterval(_testiTimer);
  if (list.length > 1) _testiTimer = setInterval(testiNext, 5000);
}
function renderTestiDots() {
  const c = get('testi-dots'); if(!c) return;
  const n = (S.testimonials||[]).length;
  c.innerHTML = Array.from({length:n},(_,i)=>`
    <div onclick="testiGoTo(${i})" style="width:8px;height:8px;border-radius:50%;background:${i===_testiIdx?'var(--o)':'var(--bdr)'};cursor:pointer;transition:all .22s"></div>`
  ).join('');
}
function testiGoTo(i) {
  const n = (S.testimonials||[]).length; if(!n) return;
  _testiIdx = ((i % n) + n) % n;
  const track = get('testi-track'); if(!track) return;
  const cards = track.querySelectorAll('.testi-card');
  if (!cards.length) return;
  const cw = cards[0].offsetWidth + 20;
  track.style.transform = `translateX(-${_testiIdx * cw}px)`;
  renderTestiDots();
}
function testiNext() { testiGoTo(_testiIdx + 1); }
function testiPrev() { testiGoTo(_testiIdx - 1); }

// ── Seller EDIT ──
let _sellerEditId = null;
function fillSellerUrlFromStore(url) {
  if (url) setVal('se-url', url);
}
// ── Add Edit button to sellers table ──
// Patch renderSellers to add edit button
const _origRenderSellers = window.renderSellers;
function renderSellers() {
  const tb=get('sellers-tbody'); if(!tb) return;
  const q=((get('sell-q')||{}).value||'').toLowerCase();
  const sf=(get('sell-sf')||{}).value||'';
  const list=(S.sellers||[]).filter(s=>{
    const mq=!q||(s.fn+' '+s.ln+' '+s.sn+' '+(s.em||'')).toLowerCase().includes(q);
    const ms=!sf||s.status===sf;
    return mq&&ms;
  });
  if(!list.length){
    tb.innerHTML='<tr><td colspan="5" style="text-align:center;padding:36px;color:var(--t3)">No hay vendedores con estos filtros</td></tr>';
    updateBadges(); return;
  }
  tb.innerHTML=list.map(s=>{
    const st=SM[s.status]||{l:s.status,c:'rgba(100,100,100,.12)',t:'var(--t2)'};
    return `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid var(--bdr2)"><div style="font-weight:800;font-size:13px">${esc(s.fn)} ${esc(s.ln)}</div><div style="font-size:11px;color:var(--t3)">${esc(s.cat)}</div></td>
      <td style="padding:10px 12px;border-bottom:1px solid var(--bdr2)"><div style="font-size:12px;color:var(--t2)">${esc(s.ph)}${s.em?' · '+esc(s.em):''}</div></td>
      <td style="padding:10px 12px;border-bottom:1px solid var(--bdr2)"><div style="font-weight:700;font-size:13px">${esc(s.sn)}</div>${s.storeUrl?`<a href="${esc(s.storeUrl)}" target="_blank" style="font-size:11px;color:var(--o)">Ver →</a>`:'<span style="font-size:11px;color:var(--t3)">Sin URL</span>'}</td>
      <td style="padding:10px 12px;border-bottom:1px solid var(--bdr2)"><select onchange="changeSellerSt('${s.id}',this.value)" style="background:${st.c};color:${st.t};border:none;border-radius:6px;padding:4px 8px;font-size:12px;font-weight:700;cursor:pointer;outline:none;max-width:130px">
        ${Object.entries(SM).map(([v,d])=>`<option value="${v}"${s.status===v?' selected':''}>${d.l}</option>`).join('')}
      </select></td>
      <td style="padding:10px 12px;border-bottom:1px solid var(--bdr2)"><div style="display:flex;gap:4px;flex-wrap:wrap">
        <button onclick="viewSeller('${s.id}')" title="Ver" style="background:rgba(255,102,0,.08);border:1px solid rgba(255,102,0,.25);color:var(--blue);border-radius:6px;padding:5px 8px;cursor:pointer;font-size:12px">👁</button>
        <button onclick="openSellerEdit('${s.id}')" title="Editar" style="background:rgba(255,102,0,.12);border:1px solid rgba(255,102,0,.3);color:var(--o);border-radius:6px;padding:5px 8px;cursor:pointer;font-size:12px">✏️</button>
        ${s.wa ? `<a href="https://wa.me/${(s.wa||'').replace(/\D/g,'')}" target="_blank" title="WhatsApp" style="background:rgba(37,211,102,.12);border:1px solid rgba(37,211,102,.3);color:#25d366;border-radius:6px;padding:5px 8px;font-size:12px;text-decoration:none;display:inline-flex;align-items:center">💬</a>` : ''}
        ${s.wa ? `<a href="https://wa.me/${(s.wa||'').replace(/\D/g,'')}" target="_blank" title="WhatsApp" style="background:rgba(37,211,102,.12);border:1px solid rgba(37,211,102,.3);color:#25d366;border-radius:6px;padding:5px 8px;cursor:pointer;font-size:12px;text-decoration:none;display:inline-flex;align-items:center">💬</a>` : ''}
        <button onclick="genContract('${s.id}')" title="Contrato" style="background:rgba(168,85,247,.12);border:1px solid rgba(168,85,247,.3);color:#c084fc;border-radius:6px;padding:5px 8px;cursor:pointer;font-size:12px">📄</button>
        <button onclick="delSeller('${s.id}')" title="Eliminar" style="background:rgba(255,34,0,.12);border:1px solid rgba(255,34,0,.3);color:var(--r);border-radius:6px;padding:5px 8px;cursor:pointer;font-size:12px">🗑</button>
      </div></td>
    </tr>`;
  }).join('');
  updateBadges();
}

// ── DOMContentLoaded additions ──
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    renderTestiPub();
    updateSecUI();
  }, 300);
});





/* ════════════════════════════════════════════════════════════
   NUEVAS FUNCIONES — MiTienda Pro Enhanced v4
   Bien comentadas y organizadas para fácil lectura en VSCode
════════════════════════════════════════════════════════════ */

// ────────────────────────────────────────────────
// UTILIDAD: Comprimir imagen antes de guardar
// Evita base64 largas que pesan demasiado
// ────────────────────────────────────────────────
function compressImage(file, maxW, maxH, quality, callback) {
  const canvas = document.createElement('canvas');
  const img = new Image();
  const objUrl = URL.createObjectURL(file);
  img.onload = () => {
    let w = img.width, h = img.height;
    if (w > maxW || h > maxH) {
      const ratio = Math.min(maxW / w, maxH / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(objUrl);
    callback(canvas.toDataURL('image/jpeg', quality));
  };
  img.onerror = () => { URL.revokeObjectURL(objUrl); toast('❌ Error al cargar imagen', 'e'); };
  img.src = objUrl;
}

// ────────────────────────────────────────────────
// MODAL ELEGANTE DE CONFIRMACIÓN
// Reemplaza los confirm() nativos del browser
// ────────────────────────────────────────────────
let _confirmCallback = null;
let _confirmRequired = null;

function elegantConfirm({ title = '¿Confirmar?', msg = 'Esta acción no se puede deshacer.', icon = '⚠️', okLabel = 'Confirmar', cancelLabel = 'Cancelar', requireInput = null, onConfirm = null } = {}) {
  const el = id => document.getElementById(id);
  el('m-conf-ico').textContent = icon;
  el('m-conf-title').textContent = title;
  el('m-conf-msg').innerHTML = msg;
  el('m-conf-ok').textContent = okLabel;
  el('m-conf-cancel').textContent = cancelLabel;
  _confirmCallback = onConfirm;
  _confirmRequired = requireInput;
  const wrap = el('m-conf-input-wrap');
  const inp = el('m-conf-input');
  if (requireInput && wrap && inp) {
    wrap.style.display = 'block';
    el('m-conf-input-lbl').textContent = `Escribe "${requireInput}" para confirmar:`;
    inp.placeholder = requireInput;
    inp.value = '';
  } else if (wrap) {
    wrap.style.display = 'none';
  }
  openM('m-confirm');
}

function execConfirm() {
  if (_confirmRequired) {
    const val = (document.getElementById('m-conf-input') || {}).value || '';
    if (val.trim().toUpperCase() !== _confirmRequired.toUpperCase()) {
      toast('❌ Texto de confirmación incorrecto', 'e');
      return;
    }
  }
  closeM('m-confirm');
  if (typeof _confirmCallback === 'function') _confirmCallback();
  _confirmCallback = null;
  _confirmRequired = null;
}

// ────────────────────────────────────────────────
// RESETEAR SISTEMA
// ────────────────────────────────────────────────
function resetSystem() {
  elegantConfirm({
    title: 'Resetear Sistema',
    msg: 'Eliminarás <strong>TODOS</strong> los datos: vendedores, tiendas, planes, testimonios, configuración y notificaciones.<br><br>Esta acción <strong>NO se puede deshacer</strong>.',
    icon: '🗑️',
    okLabel: 'Sí, Resetear',
    cancelLabel: 'Cancelar',
    requireInput: 'RESETEAR',
    onConfirm: () => {
      localStorage.removeItem('mtp_v2');
      toast('✅ Sistema reseteado. Recargando...', 's');
      setTimeout(() => location.reload(), 1200);
    }
  });
}

// ────────────────────────────────────────────────
// ICONO Y LOGO DEL SISTEMA
// ────────────────────────────────────────────────
function previewSiteIcon(src) {
  const img = document.getElementById('c2-icon-preview');
  const lbl = document.getElementById('c2-icon-lbl');
  if (!img) return;
  if (src) {
    img.src = src; img.style.display = 'block';
    if (lbl) lbl.textContent = 'Icono configurado';
  } else {
    img.style.display = 'none';
    if (lbl) lbl.textContent = 'Sin icono configurado';
  }
}

async function uploadSiteIcon(e) {
  const file = e.target.files[0]; if (!file) return;
  try {
    const iconUrl = await uploadRepoImage(file, 'site-icon', { maxW: 128, maxH: 128, quality: 0.9, thumbW: 64, thumbH: 64, thumbQ: 0.85 });
    S.siteIcon = iconUrl;
    const inp = document.getElementById('c2-icon-url');
    if (inp) inp.value = iconUrl;
    previewSiteIcon(iconUrl);
    saveS(); applyLogoIcon(); applyFavicon();
    toast('✅ Icono cargado', 's');
  } catch (err) {
    toast('❌ Error al subir icono: ' + (err.message || err), 'e');
  }
}

function clearSiteIcon() {
  S.siteIcon = '';
  saveS(); applyLogoIcon(); applyFavicon();
  previewSiteIcon('');
  const inp = document.getElementById('c2-icon-url');
  if (inp) inp.value = '';
  toast('Icono eliminado');
}

function saveSiteIcon() {
  const url = (document.getElementById('c2-icon-url') || {}).value?.trim() || '';
  if (url && !url.startsWith('(')) S.siteIcon = url;
  saveS(); applyLogoIcon(); applyFavicon();
  previewSiteIcon(S.siteIcon || '');
  toast('✅ Icono guardado', 's');
}

function applyLogoIcon() {
  const imgEl = document.getElementById('logo-icon-img');
  const emojiEl = document.getElementById('logo-box-emoji');
  if (!imgEl || !emojiEl) return;
  if (S.siteIcon) {
    imgEl.src = S.siteIcon;
    imgEl.style.display = 'block';
    emojiEl.style.display = 'none';
  } else {
    imgEl.style.display = 'none';
    emojiEl.style.display = 'block';
  }
}

function applyFavicon() {
  let fav = document.getElementById('site-favicon');
  if (!fav) {
    fav = document.createElement('link');
    fav.id = 'site-favicon';
    fav.rel = 'icon';
    document.head.appendChild(fav);
  }
 fav.href = S.siteIcon ? S.siteIcon + '?t=' + Date.now() : 'data:,';
}

// ────────────────────────────────────────────────
// URL DE LA TIENDA PRINCIPAL (botón parallelogram)
// ────────────────────────────────────────────────
function gotoShop() {
  const url = S.shopUrl || '';
  if (url) window.open(url, '_blank');
  else toast('⚠️ URL de tienda no configurada. Ve a Admin → Avanzado.', 'e');
}

function saveShopUrl() {
  S.shopUrl = (document.getElementById('c2-shop-url') || {}).value?.trim() || '';
  saveS(); applyShopButton();
  toast('✅ URL de tienda guardada', 's');
}

function applyShopButton() {
  const floatLbl = document.getElementById('float-shop-lbl');
  const name = (S.config && S.config.systemName) ? S.config.systemName : 'Tienda Principal';
  if (floatLbl) floatLbl.textContent = 'Ver ' + name;
  // hero-shop-lbl se mantiene fijo desde el HTML, no se sobreescribe
}

// ────────────────────────────────────────────────
// SEGURIDAD — toggle correcto que funciona
// ────────────────────────────────────────────────
function toggleSecurity() {
  if (!S.promoConfig) S.promoConfig = {};
  S.promoConfig.securityEnabled = !(S.promoConfig.securityEnabled !== false);
  saveS();
  applySecurityHandlers();
  updateSecUI();
  toast(S.promoConfig.securityEnabled
    ? '🔒 Seguridad ACTIVADA (efectiva ahora)'
    : '🔓 Seguridad DESACTIVADA (efectiva ahora)');
}

function updateSecUI() {
  const on = (S.promoConfig || {}).securityEnabled !== false;
  const tog = document.getElementById('sec-tog');
  const knob = document.getElementById('sec-knob');
  const lbl = document.getElementById('sec-lbl');
  if (tog) tog.style.background = on ? 'var(--green)' : 'var(--r)';
  if (knob) knob.style.transform = on ? 'translateX(26px)' : 'translateX(0)';
  if (lbl) {
    lbl.textContent = on ? '🔒 Seguridad ACTIVA' : '🔓 Seguridad INACTIVA';
    lbl.style.color = on ? 'var(--green)' : 'var(--r)';
  }
}

function applySecurityHandlers() {
  const on = (S.promoConfig || {}).securityEnabled !== false;
  if (on) {
    document.oncontextmenu = e => { e.preventDefault(); return false; };
    document.onselectstart = e => e.preventDefault();
  } else {
    document.oncontextmenu = null;
    document.onselectstart = null;
  }
}

// ────────────────────────────────────────────────
// AGREGAR VENDEDOR DESDE EL ADMIN
// ────────────────────────────────────────────────
function openAddSellerModal() {
  // Clear fields
  ['add-fn','add-ln','add-ph','add-wa','add-em','add-addr','add-sn','add-desc','add-url'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const status = document.getElementById('add-status');
  if (status) status.value = 'registered';
  // Populate store link dropdown
  const storeLink = document.getElementById('add-store-link');
  if (storeLink) {
    storeLink.innerHTML = '<option value="">← Tienda registrada</option>' +
      (S.clientStores || []).map(cs =>
        `<option value="${esc(cs.url || '')}">${esc(cs.name)}</option>`
      ).join('');
  }
  openM('m-add-seller');
}

function saveNewSeller() {
  const fn = (document.getElementById('add-fn') || {}).value?.trim() || '';
  const ln = (document.getElementById('add-ln') || {}).value?.trim() || '';
  const sn = (document.getElementById('add-sn') || {}).value?.trim() || '';
  if (!fn || !ln) { toast('❌ Nombre y apellidos son requeridos', 'e'); return; }
  if (!sn) { toast('❌ Nombre de la tienda es requerido', 'e'); return; }
  if (!S.sellers) S.sellers = [];
  const s = {
    id: 'v' + Date.now(),
    fn, ln,
    ph: (document.getElementById('add-ph') || {}).value?.trim() || '',
    wa: (document.getElementById('add-wa') || {}).value?.trim() || '',
    em: (document.getElementById('add-em') || {}).value?.trim() || '',
    addr: (document.getElementById('add-addr') || {}).value?.trim() || '',
    cat: (document.getElementById('add-cat') || {}).value || 'Otros',
    sn,
    desc: (document.getElementById('add-desc') || {}).value?.trim() || '',
    storeUrl: (document.getElementById('add-url') || {}).value?.trim() || '',
    status: (document.getElementById('add-status') || {}).value || 'registered',
    ts: new Date().toISOString()
  };
  S.sellers.push(s);
  saveS();
  pushNotif('Vendedor agregado: ' + fn + ' ' + ln + ' — ' + sn, '👤');
  closeM('m-add-seller');
  renderSellers();
  renderDash();
  toast('✅ Vendedor agregado correctamente', 's');
}

// ────────────────────────────────────────────────
// VINCULACIÓN TIENDA ↔ VENDEDOR
// Al seleccionar un vendedor en el modal de tienda,
// auto-rellena los datos de la tienda con sus datos
// ────────────────────────────────────────────────
function autoFillStoreFromSeller(sellerId) {
  if (!sellerId) return;
  const s = (S.sellers || []).find(x => x.id === sellerId);
  if (!s) return;
  // Auto-fill store name if empty
  const nameEl = document.getElementById('st-name');
  if (nameEl && !nameEl.value.trim()) nameEl.value = s.sn || '';
  // Auto-fill URL if empty
  const urlEl = document.getElementById('st-url');
  if (urlEl && !urlEl.value.trim() && s.storeUrl) urlEl.value = s.storeUrl;
  // Auto-fill category if empty
  const catEl = document.getElementById('st-cat');
  if (catEl && s.cat) catEl.value = s.cat;
  // Auto-fill description if empty
  const descEl = document.getElementById('st-desc');
  if (descEl && !descEl.value.trim() && s.desc) descEl.value = s.desc;
  toast('✅ Datos del vendedor cargados', 's');
}

// ────────────────────────────────────────────────
// STORES SEARCH — filtrar tiendas en el admin
// ────────────────────────────────────────────────
function clearStoreFilters() {
  setVal('st-search-q', '');
  const s1 = document.getElementById('st-search-cat'); if (s1) s1.value = '';
  const s2 = document.getElementById('st-search-vis'); if (s2) s2.value = '';
  const s3 = document.getElementById('st-search-seller'); if (s3) s3.value = '';
  renderAdmStores();
}

// Patch renderAdmStores to support search
const _origRenderAdmStores = window.renderAdmStores;
function renderAdmStores() {
  const g = document.getElementById('adm-stores-grid'); if (!g) return;
  const q = ((document.getElementById('st-search-q') || {}).value || '').toLowerCase();
  const catF = (document.getElementById('st-search-cat') || {}).value || '';
  const visF = (document.getElementById('st-search-vis') || {}).value || '';
  const sellF = (document.getElementById('st-search-seller') || {}).value || '';
  // Populate seller filter
  const sellSel = document.getElementById('st-search-seller');
  if (sellSel && sellSel.options.length <= 1) {
    (S.sellers || []).forEach(s => {
      const o = document.createElement('option');
      o.value = s.id; o.textContent = s.fn + ' ' + s.ln;
      sellSel.appendChild(o);
    });
  }
  let stores = S.clientStores || [];
  if (q) stores = stores.filter(s => (s.name + ' ' + (s.desc || '') + (s.addr || '')).toLowerCase().includes(q));
  if (catF) stores = stores.filter(s => s.cat === catF);
  if (visF) stores = stores.filter(s => s.vis === visF);
  if (sellF) stores = stores.filter(s => s.sellerId === sellF);
  if (!stores.length) {
    g.innerHTML = `<div style="color:var(--t3);font-size:14px;padding:24px;text-align:center;grid-column:1/-1">No hay tiendas${q ? ' con esos filtros' : '. Agrega la primera.'}</div>`;
    return;
  }
  g.innerHTML = stores.map(s => {
    const seller = (S.sellers || []).find(x => x.id === s.sellerId);
    return `
    <div style="background:var(--card);border:1px solid ${s.vis === 'visible' ? 'rgba(34,197,94,.35)' : 'var(--bdr)'};border-radius:var(--rc);overflow:hidden;transition:all .22s">
      ${s.img ? `<img src="${esc(s.img)}" style="width:100%;height:100px;object-fit:cover;display:block" onerror="this.style.display='none'">` : '<div style="height:60px;background:var(--bg2);display:flex;align-items:center;justify-content:center;font-size:28px">🏪</div>'}
      <div style="padding:12px">
        <div style="font-family:var(--fh);font-size:14px;font-weight:900;margin-bottom:3px">${esc(s.name)}</div>
        <div style="font-size:10px;color:var(--o);font-weight:800;text-transform:uppercase;margin-bottom:4px">${esc(s.cat)}</div>
        ${seller ? `<div style="font-size:11px;color:var(--t2);margin-bottom:3px">👤 ${esc(seller.fn + ' ' + seller.ln)}</div>` : ''}
        ${s.addr ? `<div style="font-size:11px;color:var(--t3);margin-bottom:4px">📍 ${esc(s.addr)}</div>` : ''}
        <div style="font-size:11px;color:var(--t2);margin-bottom:8px;line-height:1.5">${esc((s.desc || '').slice(0, 70))}</div>
        <span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:10px;background:${s.vis === 'visible' ? 'rgba(34,197,94,.15)' : 'rgba(100,100,100,.12)'};color:${s.vis === 'visible' ? 'var(--green)' : 'var(--t3)'}">
          ${s.vis === 'visible' ? '✅ Visible' : '🙈 Oculta'}
        </span>
        ${s.url ? `<div style="margin-top:6px"><a href="${esc(s.url)}" target="_blank" style="font-size:11px;color:var(--o);text-decoration:none">🔗 Visitar tienda →</a></div>` : ''}
        <div style="display:flex;gap:6px;margin-top:10px">
          <button onclick="openStoreModal('${s.id}')" class="btn btn-dk btn-sm" style="flex:1">✏️ Editar</button>
          <button onclick="delStore('${s.id}')" class="btn btn-dng btn-sm">🗑</button>
        </div>
      </div>
    </div>`;
  }).join('');
  const vi = document.getElementById('stores-vis-inp');
  if (vi) vi.value = S.promoConfig?.storesVisible || 6;
}

// Patch saveStore to include sellerId and addr
const _origSaveStore = window.saveStore;
function saveStore() {
  const name = (document.getElementById('st-name') || {}).value?.trim() || '';
  const url = (document.getElementById('st-url') || {}).value?.trim() || '';
  if (!name || !url) { toast('❌ Nombre y URL son requeridos', 'e'); return; }
  if (!S.clientStores) S.clientStores = [];
  const st = {
    id: _storeEdit || 'cs' + Date.now(),
    name, url,
    cat: (document.getElementById('st-cat') || {}).value || 'Otros',
    addr: (document.getElementById('st-addr') || {}).value?.trim() || '',
    desc: (document.getElementById('st-desc') || {}).value?.trim() || '',
    img: (document.getElementById('st-img') || {}).value?.trim() || '',
    vis: (document.getElementById('st-vis') || {}).value || 'visible',
    sellerId: (document.getElementById('st-seller') || {}).value || '',
  };
  if (_storeEdit) {
    const i = S.clientStores.findIndex(x => x.id === _storeEdit);
    if (i !== -1) S.clientStores[i] = st;
    toast('✅ Tienda actualizada', 's');
  } else {
    S.clientStores.push(st);
    toast('✅ Tienda agregada', 's');
  }
  saveS(); closeM('m-store'); renderAdmStores(); renderPublicStores();
}

// Patch openStoreModal to populate seller dropdown
const _origOpenStoreModal = window.openStoreModal;
_storeEdit = null;
function openStoreModal(id) {
  _storeEdit = id;
  const ttl = document.getElementById('m-store-ttl');
  if (ttl) ttl.textContent = id ? '✏️ Editar Tienda' : '🏪 Nueva Tienda';
  // Populate seller dropdown
  const selSel = document.getElementById('st-seller');
  if (selSel) {
    selSel.innerHTML = '<option value="">— Sin vincular —</option>' +
      (S.sellers || []).map(s =>
        `<option value="${s.id}">${esc(s.fn + ' ' + s.ln)} — ${esc(s.sn)}</option>`
      ).join('');
  }
  if (id) {
    const s = (S.clientStores || []).find(x => x.id === id);
    if (s) {
      setVal('st-name', s.name); setVal('st-url', s.url);
      setVal('st-desc', s.desc || ''); setVal('st-img', s.img || '');
      setVal('st-addr', s.addr || '');
      const catEl = document.getElementById('st-cat'); if (catEl) catEl.value = s.cat || 'Otros';
      const visEl = document.getElementById('st-vis'); if (visEl) visEl.value = s.vis || 'visible';
      if (selSel) selSel.value = s.sellerId || '';
    }
  } else {
    ['st-name', 'st-url', 'st-desc', 'st-img', 'st-addr'].forEach(i => setVal(i, ''));
    if (selSel) selSel.value = '';
  }
  openM('m-store');
}

// ────────────────────────────────────────────────
// VENDORS — viewSeller con WhatsApp + edit mejorado
// ────────────────────────────────────────────────
const _origViewSeller = window.viewSeller;
function viewSeller(id) {
  const s = (S.sellers || []).find(x => x.id === id); if (!s) return;
  const m = document.getElementById('m-sd-ttl');
  if (m) m.textContent = '👤 ' + s.fn + ' ' + s.ln;
  const SM2 = { pending: '⏳ Pendiente', active: '✅ Activo', inactive: '❌ Inactivo', registered: '📋 Registrado' };
  const body = document.getElementById('m-sd-body');
  if (!body) return;
  const waNum = (s.wa || '').replace(/\D/g, '');
  body.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;font-size:14px;margin-bottom:18px">
      ${[
        ['Nombre', esc(s.fn + ' ' + s.ln)],
        ['Teléfono', esc(s.ph || '—')],
        ['WhatsApp', s.wa ? `<a href="https://wa.me/${waNum}" target="_blank" style="color:var(--green);font-weight:700;text-decoration:none">💬 ${esc(s.wa)}</a>` : '—'],
        ['Email', esc(s.em || '—')],
        ['Dirección', esc(s.addr || '—')],
        ['Tienda', esc(s.sn)],
        ['Categoría', esc(s.cat)],
        ['Estado', SM2[s.status] || s.status],
        ['Registrado', new Date(s.ts).toLocaleString('es-ES')]
      ].map(([k, v]) => `<div style="color:var(--t3);font-weight:700;font-size:12px">${k}:</div><div style="color:var(--t1)">${v}</div>`).join('')}
      <div style="grid-column:1/-1;color:var(--t3);font-weight:700;font-size:12px">Descripción:</div>
      <div style="grid-column:1/-1;color:var(--t1)">${esc(s.desc || '—')}</div>
    </div>
    ${s.wa ? `<div style="margin-bottom:14px"><a href="https://wa.me/${waNum}" target="_blank" class="btn btn-ok btn-sm"><span style="font-size:16px">💬</span> Abrir WhatsApp</a></div>` : ''}
    <div>
      <label class="lbl">🔗 URL de la Tienda (admin puede asignar)</label>
      <div style="display:flex;gap:8px">
        <input type="text" class="inp" id="sd-url" value="${esc(s.storeUrl || '')}" placeholder="https://..." style="margin:0;flex:1">
        <button class="btn btn-fire btn-sm" onclick="assignUrl('${s.id}')">💾</button>
      </div>
    </div>`;
  openM('m-sell-det');
}

// Patch openSellerEdit to include WhatsApp
const _origOpenSellerEdit = window.openSellerEdit;
function openSellerEdit(id) {
  const s = (S.sellers || []).find(x => x.id === id); if (!s) return;
  _sellerEditId = id;
  setVal('se-fn', s.fn); setVal('se-ln', s.ln);
  setVal('se-ph', s.ph || ''); setVal('se-em', s.em || '');
  const seWa = document.getElementById('se-wa'); if (seWa) seWa.value = s.wa || '';
  setVal('se-addr', s.addr || ''); setVal('se-sn', s.sn);
  setVal('se-desc', s.desc || ''); setVal('se-url', s.storeUrl || '');
  const cat = document.getElementById('se-cat'); if (cat) cat.value = s.cat || 'Otros';
  // Store link
  const sel = document.getElementById('se-store-link');
  if (sel) {
    sel.innerHTML = '<option value="">— Tienda registrada —</option>' +
      (S.clientStores || []).map(cs =>
        `<option value="${esc(cs.url || '')}"${s.storeUrl === cs.url ? ' selected' : ''}>${esc(cs.name)}</option>`
      ).join('');
  }
  openM('m-seller-edit');
}

function saveSellerEdit() {
  const s = (S.sellers || []).find(x => x.id === _sellerEditId); if (!s) return;
  s.fn = (document.getElementById('se-fn') || {}).value?.trim() || s.fn;
  s.ln = (document.getElementById('se-ln') || {}).value?.trim() || s.ln;
  s.ph = (document.getElementById('se-ph') || {}).value?.trim() || '';
  s.wa = (document.getElementById('se-wa') || {}).value?.trim() || '';
  s.em = (document.getElementById('se-em') || {}).value?.trim() || '';
  s.addr = (document.getElementById('se-addr') || {}).value?.trim() || '';
  s.sn = (document.getElementById('se-sn') || {}).value?.trim() || s.sn;
  s.cat = (document.getElementById('se-cat') || {}).value || s.cat;
  s.desc = (document.getElementById('se-desc') || {}).value?.trim() || '';
  s.storeUrl = (document.getElementById('se-url') || {}).value?.trim() || '';
  saveS(); closeM('m-seller-edit'); renderSellers(); renderDash();
  toast('✅ Vendedor actualizado', 's');
}

// ────────────────────────────────────────────────
// EDITOR DE PLANTILLA DE CONTRATO
// ────────────────────────────────────────────────
function openContractEditor() {
  const ct = S.contractTemplate || {};
  setVal('ce-objeto', ct.objeto || '');
  setVal('ce-obl-prov', ct.oblProv || '');
  setVal('ce-obl-vend', ct.oblVend || '');
  setVal('ce-clausulas', ct.clausulas || '');
  setVal('ce-footer-note', ct.footerNote || '');
  openM('m-contract-editor');
}

function saveContractTemplate() {
  S.contractTemplate = {
    objeto: (document.getElementById('ce-objeto') || {}).value?.trim() || '',
    oblProv: (document.getElementById('ce-obl-prov') || {}).value?.trim() || '',
    oblVend: (document.getElementById('ce-obl-vend') || {}).value?.trim() || '',
    clausulas: (document.getElementById('ce-clausulas') || {}).value?.trim() || '',
    footerNote: (document.getElementById('ce-footer-note') || {}).value?.trim() || '',
  };
  saveS(); closeM('m-contract-editor');
  toast('✅ Plantilla de contrato guardada', 's');
}

function fillContractVar(text, s, dt) {
  return (text || '')
    .replace(/\{nombre\}/gi, s.fn + ' ' + s.ln)
    .replace(/\{tienda\}/gi, s.sn)
    .replace(/\{fecha\}/gi, dt)
    .replace(/\{url\}/gi, s.storeUrl || '—')
    .replace(/\{cat\}/gi, s.cat)
    .replace(/\{telefono\}/gi, s.ph || '—');
}

// Override genContract to use template
function genContract(id) {
  const s = (S.sellers || []).find(x => x.id === id); if (!s) return;
  const dt = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  const auth = S.config?.author || 'Edrian Cruz Down';
  const sysName = S.config?.systemName || 'MiTienda Pro';
  const ct = S.contractTemplate || {};
  const tcText = (S.terms?.text || '').replace(/\n/g, ' ');
  const num = 'CNT-' + new Date().getFullYear() + '-' + String(S.sellers.indexOf(s) + 1).padStart(4, '0');

  const objeto = ct.objeto
    ? fillContractVar(ct.objeto, s, dt)
    : `El Proveedor (<strong>${esc(sysName)} — ${esc(auth)}</strong>) se compromete a entregar al Vendedor un sistema de tienda online profesional que incluye: catálogo de productos, carrito de compras, panel administrativo, gestión de inventario, pedidos automáticos vía WhatsApp, avatar promotor y soporte técnico.`;

  const oblProvText = ct.oblProv
    ? '<li>' + fillContractVar(ct.oblProv, s, dt).split('\n').join('</li><li>') + '</li>'
    : '<li>Entregar el sistema funcionando</li><li>Brindar soporte durante el plan</li><li>Mantener confidencialidad</li><li>Notificar cambios relevantes</li>';

  const oblVendText = ct.oblVend
    ? '<li>' + fillContractVar(ct.oblVend, s, dt).split('\n').join('</li><li>') + '</li>'
    : '<li>Usar el sistema legalmente</li><li>No revender sin autorización</li><li>Realizar pagos según el plan</li><li>Mantener datos actualizados</li>';

  const extraClauses = ct.clausulas ? `<div class="section"><div class="section-hdr"><div class="ico">📌</div><h3>Cláusulas Adicionales</h3></div><div class="clause-box">${fillContractVar(ct.clausulas, s, dt)}</div></div>` : '';
  const footerNote = ct.footerNote ? `<div class="footer-note">${fillContractVar(ct.footerNote, s, dt)}</div>` : '';

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Contrato ${num}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',Arial,sans-serif;background:#fafaf8;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:800px;margin:0 auto;background:#fff;min-height:100vh}
.fire-strip{height:5px;background:linear-gradient(90deg,#ff2200,#ff6600,#ffaa00,#ff6600,#ff2200)}
.cover{background:linear-gradient(160deg,#0a0a0a,#1a0500 40%,#2a0800);padding:46px 48px 36px;color:#fff;position:relative;overflow:hidden}
.cover::before{content:'';position:absolute;top:-80px;right:-80px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,102,0,.18),transparent 70%)}
.logo-row{display:flex;align-items:center;gap:14px;margin-bottom:26px;position:relative;z-index:1}
.logo-ico{font-size:40px;filter:drop-shadow(0 0 14px rgba(255,102,0,.8))}
.logo-name{font-size:26px;font-weight:900;letter-spacing:1px}
.logo-sub{font-size:11px;color:rgba(255,255,255,.5);letter-spacing:.5px;margin-top:2px}
.contract-title{position:relative;z-index:1}
.contract-title h2{font-size:21px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:#ff8800;margin-bottom:4px}
.meta-row{display:flex;gap:14px;flex-wrap:wrap;margin-top:16px;position:relative;z-index:1}
.meta-item{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:8px 14px}
.meta-label{font-size:9px;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.7px;margin-bottom:2px}
.meta-val{font-size:13px;color:#fff;font-weight:600}
.body{padding:36px 48px}
.section{margin-bottom:28px}
.section-hdr{display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-bottom:7px;border-bottom:2px solid #f0ede8}
.section-hdr .ico{width:30px;height:30px;border-radius:7px;background:linear-gradient(135deg,#ff2200,#ff6600);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.section-hdr h3{font-size:13px;font-weight:800;color:#1a1a1a;text-transform:uppercase;letter-spacing:.5px}
.fields-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.field-item{background:#f9f7f4;border:1px solid #e8e4de;border-radius:7px;padding:10px 13px}
.field-label{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.6px;margin-bottom:2px;font-weight:600}
.field-val{font-size:13px;color:#1a1a1a;font-weight:500;word-break:break-word}
.clause-box{background:#f9f7f4;border-left:3px solid #ff6600;border-radius:0 8px 8px 0;padding:14px 16px;font-size:13px;color:#333;line-height:1.8}
.obl-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.obl-card{background:#f9f7f4;border:1px solid #e8e4de;border-radius:9px;padding:15px}
.obl-card h4{font-size:12px;font-weight:800;color:#1a1a1a;margin-bottom:8px}
.obl-card ul{list-style:none;font-size:12px;color:#555;line-height:1.9}
.obl-card ul li::before{content:'✓  ';color:#ff6600;font-weight:700}
.signs-area{background:linear-gradient(135deg,#f9f7f4,#f0ede8);border-radius:11px;padding:26px;margin-top:6px}
.signs-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.sign-box{text-align:center}
.sign-line{border-top:2px solid #ccc;padding-top:9px;margin-top:50px;font-size:12px;color:#555}
.sign-name{font-weight:700;color:#1a1a1a;font-size:13px;margin-top:2px}
.footer-bar{background:#1a1a1a;color:rgba(255,255,255,.4);text-align:center;padding:13px;font-size:11px;letter-spacing:.5px}
.footer-note{background:#fffbf5;border:1px solid #ffe8cc;padding:12px 16px;border-radius:8px;font-size:12px;color:#665533;margin-top:8px;font-style:italic}
@media print{body{background:#fff}.page{max-width:100%}}
</style></head><body>
<div class="page">
<div class="fire-strip"></div>
<div class="cover">
  <div class="logo-row"><span class="logo-ico">🔥</span><div><div class="logo-name">${esc(sysName)}</div><div class="logo-sub">Sistema de Ventas Online Profesional</div></div></div>
  <div class="contract-title"><h2>Contrato de Prestación de Servicios</h2><p style="color:rgba(255,255,255,.5);font-size:12px;margin-top:4px">Acuerdo legal entre las partes</p></div>
  <div class="meta-row">
    <div class="meta-item"><div class="meta-label">N° Contrato</div><div class="meta-val">${num}</div></div>
    <div class="meta-item"><div class="meta-label">Fecha</div><div class="meta-val">${dt}</div></div>
    <div class="meta-item"><div class="meta-label">Proveedor</div><div class="meta-val">${esc(auth)}</div></div>
    <div class="meta-item"><div class="meta-label">Estado</div><div class="meta-val" style="color:#22c55e">● Activo</div></div>
  </div>
</div>
<div class="body">
  <div class="section">
    <div class="section-hdr"><div class="ico">👤</div><h3>Datos del Vendedor</h3></div>
    <div class="fields-grid">
      <div class="field-item"><div class="field-label">Nombre</div><div class="field-val">${esc(s.fn + ' ' + s.ln)}</div></div>
      <div class="field-item"><div class="field-label">Teléfono</div><div class="field-val">${esc(s.ph || '—')}</div></div>
      <div class="field-item"><div class="field-label">WhatsApp</div><div class="field-val">${esc(s.wa || '—')}</div></div>
      <div class="field-item"><div class="field-label">Email</div><div class="field-val">${esc(s.em || '—')}</div></div>
      <div class="field-item"><div class="field-label">Dirección</div><div class="field-val">${esc(s.addr || '—')}</div></div>
      <div class="field-item"><div class="field-label">Tienda</div><div class="field-val">${esc(s.sn)}</div></div>
      <div class="field-item"><div class="field-label">Categoría</div><div class="field-val">${esc(s.cat)}</div></div>
      ${s.storeUrl ? `<div class="field-item" style="grid-column:1/-1"><div class="field-label">URL</div><div class="field-val"><a href="${esc(s.storeUrl)}" style="color:#ff6600">${esc(s.storeUrl)}</a></div></div>` : ''}
    </div>
  </div>
  <div class="section"><div class="section-hdr"><div class="ico">📋</div><h3>Objeto del Contrato</h3></div><div class="clause-box">${objeto}</div></div>
  ${extraClauses}
  <div class="section"><div class="section-hdr"><div class="ico">⚖️</div><h3>Obligaciones</h3></div>
    <div class="obl-grid">
      <div class="obl-card"><h4>🏢 El Proveedor</h4><ul>${oblProvText}</ul></div>
      <div class="obl-card"><h4>🧑‍💼 El Vendedor</h4><ul>${oblVendText}</ul></div>
    </div>
  </div>
  ${tcText ? `<div class="section"><div class="section-hdr"><div class="ico">📜</div><h3>Términos y Condiciones</h3></div><div class="clause-box">${esc(tcText)}</div></div>` : ''}
  <div class="section"><div class="section-hdr"><div class="ico">✍️</div><h3>Firmas</h3></div>
    <p style="font-size:13px;color:#555;margin-bottom:16px;line-height:1.7">Ambas partes declaran haber leído y aceptado íntegramente los términos de este contrato.</p>
    <div class="signs-area"><div class="signs-grid">
      <div class="sign-box"><div class="sign-line"><div class="sign-name">${esc(s.fn + ' ' + s.ln)}</div><div style="font-size:11px;color:#888;margin-top:2px">El Vendedor</div></div></div>
      <div class="sign-box"><div class="sign-line"><div class="sign-name">${esc(auth)}</div><div style="font-size:11px;color:#888;margin-top:2px">El Proveedor</div></div></div>
    </div></div>
    ${footerNote}
  </div>
</div>
<div class="footer-bar">🔥 ${esc(sysName)} · ${num} · © ${new Date().getFullYear()} · ${esc(auth)}</div>
</div></body></html>`;
  const w = window.open('', '_blank');
  if (!w) { toast('❌ Habilita ventanas emergentes', 'e'); return; }
  w.document.write(html); w.document.close(); w.focus();
  setTimeout(() => w.print(), 800);
  toast('📄 Contrato generado', 's');
}

// ────────────────────────────────────────────────
// EXPORTAR JSON CON NOMBRE + EXCLUIR BASE64
// ────────────────────────────────────────────────
function openExportJSONModal() {
  setVal('ej-name', 'backup_mtp_' + new Date().toISOString().slice(0, 10));
  openM('m-export-json');
}

function doExportJSON() {
  const name = ((document.getElementById('ej-name') || {}).value?.trim() || 'backup_mtp').replace(/[^a-zA-Z0-9_\-]/g, '_');
  const backup = JSON.parse(JSON.stringify(S));
  // Strip base64 images — they're huge and break servers/GitHub
  if (backup.avatar?.img?.startsWith('data:')) backup.avatar.img = '';
  if (backup.config?.ctcImg?.startsWith('data:')) backup.config.ctcImg = '';
  if (backup.siteIcon?.startsWith('data:')) backup.siteIcon = '';
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name + '.json';
  a.click();
  closeM('m-export-json');
  toast('✅ Exportado: ' + name + '.json', 's');
}

// Override old exportJSON
function exportJSON() { openExportJSONModal(); }

// ────────────────────────────────────────────────
// JSON AUTOLOAD desde URL
// ────────────────────────────────────────────────
function saveJsonUrl() {
  S.jsonAutoUrl = (document.getElementById('c2-json-url') || {}).value?.trim() || '';
  saveS();
  toast('✅ URL de JSON guardada', 's');
}

function testJsonUrl() {
  const url = (document.getElementById('c2-json-url') || {}).value?.trim() || S.jsonAutoUrl || '';
  if (!url) { toast('⚠️ No hay URL configurada', 'e'); return; }
  loadFromJsonUrl(url, true);
}

function loadFromJsonUrl(url, notify = false) {
  if (!url) return;
  fetch(url, { cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
      if (data && typeof data === 'object') {
        const fields = ['config','plans','ownerWeb','ownerApk','contacts','links','avatar','sellers','clientStores','notifications','analytics','terms','promoConfig','testimonials','siteIcon','shopUrl','jsonAutoUrl','contractTemplate'];
        fields.forEach(k => { if (data[k] !== undefined) S[k] = data[k]; });
        saveS(); renderAll();
        if (typeof renderTestiPub === 'function') renderTestiPub();
        if (notify) toast('✅ Datos cargados desde URL', 's');
      }
    })
    .catch(err => {
      if (notify) toast('❌ Error al cargar JSON: ' + (err.message || err), 'e');
    });
}

// ────────────────────────────────────────────────
// showAdmTab — override to trigger new tab actions
// ────────────────────────────────────────────────
const _origShowAdmTab = window.showAdmTab;
function showAdmTab(name, btn) {
  document.querySelectorAll('.atb').forEach(t => { t.classList.remove('show'); t.style.display = 'none'; });
  const t = document.getElementById('atb-' + name);
  if (t) { t.classList.add('show'); t.style.display = 'block'; }
  document.querySelectorAll('.anv').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  // Tab-specific actions
  if (name === 'dash') renderDash();
  if (name === 'sellers') renderSellers();
  if (name === 'stores') { renderAdmStores(); }
  if (name === 'notif') renderNotifAdm();
  if (name === 'promo') loadPromoConf();
  if (name === 'tc') renderTC();
  if (name === 'testimonials') renderTestiAdm();
  if (name === 'config2') {
    updateSecUI();
    const inp = document.getElementById('c2-shop-url'); if (inp) inp.value = S.shopUrl || '';
    const jurl = document.getElementById('c2-json-url'); if (jurl) jurl.value = S.jsonAutoUrl || '';
    const iurl = document.getElementById('c2-icon-url');
    if (iurl) iurl.value = S.siteIcon?.startsWith('data:') ? '(icono subido)' : (S.siteIcon || '');
    const iprev = document.getElementById('c2-icon-preview');
    if (iprev && S.siteIcon) { iprev.src = S.siteIcon; iprev.style.display = 'block'; }
    const ilbl = document.getElementById('c2-icon-lbl');
    if (ilbl) ilbl.textContent = S.siteIcon ? 'Icono configurado' : 'Sin icono';
  }
}

// ────────────────────────────────────────────────
// INIT — apply all settings on admin open + page load
// ────────────────────────────────────────────────
function doAdminLogin() {
  const pass = (get('a-pass') || {}).value || '';
  if (dec(pass) !== S.adminPass && pass !== S.adminPass) {
    toast('❌ Contraseña incorrecta', 'e');
    const inp = get('a-pass');
    if (inp) { inp.classList.add('shake'); setTimeout(() => inp.classList.remove('shake'), 500); }
    return;
  }
  closeM('m-alog');
  get('adm-panel').classList.remove('hidden');
  get('hdr').style.display = 'none';
  showAdmTab('dash', get('adm-panel').querySelector('.anv'));
  renderDash();
  renderPublicStores();
  updateBadges();
  // Apply new features
  applySecurityHandlers();
  updateSecUI();
  applyShopButton();
  applyLogoIcon();
}

// Run on page load (after main script)
document.addEventListener('DOMContentLoaded', () => {
  // Slight delay to let main script run first
  setTimeout(() => {
    applyLogoIcon();
    applyFavicon();
    applyShopButton();
    applySecurityHandlers();
    // Load JSON from URL if configured
    if (S.jsonAutoUrl) loadFromJsonUrl(S.jsonAutoUrl);
    // Note: auto-load from relative path disabled (causes file:// errors)
    // Configure a proper URL in Admin → Avanzado to enable JSON autoload
  }, 350);
});



// Alias for backward compatibility
function renderSellersTable() { renderSellers(); }
