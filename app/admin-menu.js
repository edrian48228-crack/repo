/* admin-menu.js — Menú admin corregido.
 * - En Windows/PC NO muestra el botón hamburguesa.
 * - Elimina el botón "Cerrar sesión" Admin y su modal.
 * - Agrega "Ir a la portada" en la administración de Windows.
 * - En Android muestra el menú hamburguesa con "Ir a la portada" directo.
 */
(function() {
  'use strict';

  const PORTADA_URL = 'https://edrian48228-crack.github.io/repo/app/';
  const MOBILE_QUERY = '(max-width: 768px), (pointer: coarse)';
  const mobileMQ = window.matchMedia ? window.matchMedia(MOBILE_QUERY) : null;

  const MENU_ITEMS = [
    { id: 'dash',      icon: '📊', label: 'Dashboard' },
    { id: 'sellers',   icon: '👥', label: 'Vendedores' },
    { id: 'stores',    icon: '🏪', label: 'Tiendas' },
    { id: 'notif',     icon: '🔔', label: 'Notificaciones' },
    { id: 'planes',    icon: '💳', label: 'Planes' },
    { id: 'free',      icon: '🎁', label: 'Plan Free' },
    { id: 'avatar',    icon: '🤖', label: 'Avatar' },
    { id: 'contacto',  icon: '📞', label: 'Contacto' },
    { id: 'links',     icon: '🔗', label: 'Links' },
    { id: 'textos',    icon: '✏️', label: 'Textos' },
    { id: 'seguridad', icon: '🔑', label: 'Seguridad' },
    { id: 'promo',     icon: '📣', label: 'Promoción' },
    { id: 'config2',   icon: '⚙️', label: 'Avanzado' },
    { id: 'exportar',  icon: '📄', label: 'Exportar' },
  ];

  const CSS = `
    /* El modal viejo de cerrar sesión queda completamente apagado */
    #m-admin-exit,
    #adm-menu-logout,
    .adm-ct [onclick*="m-admin-exit"],
    .adm-ct [onclick*="doAdminLogout"],
    .adm-ct [onclick*="logout" i],
    .adm-ct [id*="logout" i],
    .adm-ct [class*="logout" i] {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    /* En Android se oculta el menú admin original y se usa hamburguesa */
    @media (max-width: 768px), (pointer: coarse) {
      .adm-nav { display: none !important; }
      .adm-ft  { display: none !important; }
    }

    /* En Windows/PC el menú hamburguesa NO debe aparecer */
    @media (min-width: 769px) and (pointer: fine) {
      #adm-menu-btn,
      #adm-menu-overlay,
      #adm-menu-panel {
        display: none !important;
      }
    }

    #adm-menu-btn {
      display: none;
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 9998;
      background: linear-gradient(135deg, #ff2200, #ff6600);
      border: none;
      border-radius: 12px;
      color: #fff;
      padding: 10px 14px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(255,102,0,.5);
      -webkit-tap-highlight-color: transparent;
      align-items: center;
      gap: 8px;
      font-family: Nunito, system-ui, sans-serif;
      font-weight: 800;
      font-size: 14px;
    }

    @media (max-width: 768px), (pointer: coarse) {
      #adm-menu-btn.visible { display: flex; }
    }

    #adm-menu-overlay {
      display: block;
      pointer-events: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.6);
      opacity: 0;
      z-index: 9998;
      transition: opacity .3s;
    }
    #adm-menu-overlay.open { pointer-events: all; opacity: 1; }

    #adm-menu-panel {
      position: fixed;
      top: 0;
      right: -320px;
      width: 300px;
      max-width: 88vw;
      height: 100%;
      background: #0e0e0e;
      border-left: 1px solid #2a2a2a;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      transition: right .3s cubic-bezier(.4,0,.2,1);
      overflow: hidden;
    }
    #adm-menu-panel.open { right: 0; }

    #adm-menu-header {
      padding: 20px 16px 16px;
      border-bottom: 1px solid #2a2a2a;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #111;
      flex-shrink: 0;
    }
    #adm-menu-title {
      font-family: Nunito, system-ui, sans-serif;
      font-weight: 800;
      font-size: 16px;
      color: #ff6600;
    }
    #adm-menu-close-btn {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      color: #fff;
      font-size: 20px;
      padding: 6px 12px;
      cursor: pointer;
      line-height: 1;
    }

    #adm-menu-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }
    .adm-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      cursor: pointer;
      color: #ccc;
      font-family: Nunito, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 700;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      transition: background .15s;
      -webkit-tap-highlight-color: transparent;
      position: relative;
    }
    .adm-menu-item:active { background: #1a1a1a; }
    .adm-menu-item.active {
      color: #ff6600;
      background: rgba(255,102,0,.08);
      border-left: 3px solid #ff6600;
    }
    .adm-menu-item .adm-mi-icon { font-size: 18px; flex-shrink: 0; }

    #adm-menu-footer {
      padding: 12px 16px 24px;
      border-top: 1px solid #2a2a2a;
      flex-shrink: 0;
    }

    #adm-menu-portada,
    .adm-portada-link {
      width: 100%;
      box-sizing: border-box;
      padding: 13px;
      background: linear-gradient(135deg, #ff2200, #ff6600) !important;
      border: none !important;
      border-radius: 10px;
      color: #fff !important;
      font-family: Nunito, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none !important;
      -webkit-tap-highlight-color: transparent;
      box-shadow: 0 4px 16px rgba(255,102,0,.35);
    }
    #adm-menu-portada:active,
    .adm-portada-link:active { filter: brightness(.9); }

    .adm-portada-desktop {
      margin-top: 10px;
      min-height: 42px;
    }

    #adm-menu-panel:not(.open),
    #adm-menu-overlay:not(.open) { pointer-events: none !important; }
  `;

  function isMobileView() {
    return mobileMQ ? mobileMQ.matches : window.innerWidth <= 768;
  }

  function goPortada() {
    window.location.href = PORTADA_URL;
  }

  function injectCSS() {
    if (document.getElementById('adm-menu-css')) return;
    const style = document.createElement('style');
    style.id = 'adm-menu-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function isLogoutElement(el) {
    if (!el || el.id === 'adm-menu-portada' || el.id === 'adm-portada-desktop') return false;

    const raw = [
      el.id,
      el.className,
      el.getAttribute && el.getAttribute('onclick'),
      el.getAttribute && el.getAttribute('aria-label'),
      el.getAttribute && el.getAttribute('title'),
      el.value,
      el.textContent,
    ].join(' ');

    const text = normalizeText(raw);

    return (
      text.includes('m-admin-exit') ||
      text.includes('doadminlogout') ||
      text.includes('adminlogout') ||
      text.includes('logout') ||
      text.includes('cerrar sesion') ||
      text.includes('cerrar session') ||
      text.includes('salir admin') ||
      text.includes('salir de admin')
    );
  }

  function removeLogoutStuff() {
    const oldModal = document.getElementById('m-admin-exit');
    if (oldModal) oldModal.remove();

    document.querySelectorAll('#adm-menu-logout, [onclick*="m-admin-exit"], [onclick*="doAdminLogout"], button, a, [role="button"], input[type="button"], input[type="submit"]').forEach(el => {
      if (isLogoutElement(el)) el.remove();
    });
  }

  function ensureDesktopPortadaButton() {
    if (document.getElementById('adm-portada-desktop')) return;

    const adminVisible = isAdminVisible();
    if (!adminVisible && !document.querySelector('.adm-ft, .adm-nav, .adm-ct')) return;

    const link = document.createElement('a');
    link.id = 'adm-portada-desktop';
    link.className = 'adm-portada-link adm-portada-desktop';
    link.href = PORTADA_URL;
    link.textContent = '🏠 Ir a la portada';
    link.setAttribute('aria-label', 'Ir a la portada');

    const footer = document.querySelector('.adm-ft');
    const nav = document.querySelector('.adm-nav');
    const adminBox = document.querySelector('.adm-ct');

    if (footer) {
      footer.appendChild(link);
    } else if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(link, nav.nextSibling);
    } else if (adminBox) {
      adminBox.appendChild(link);
    }
  }

  function openMenu() {
    if (!isMobileView()) return;
    document.getElementById('adm-menu-panel')?.classList.add('open');
    document.getElementById('adm-menu-overlay')?.classList.add('open');
  }

  function closeMenu() {
    document.getElementById('adm-menu-panel')?.classList.remove('open');
    document.getElementById('adm-menu-overlay')?.classList.remove('open');
  }

  function setActiveItem(tabId) {
    document.querySelectorAll('.adm-menu-item').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tabId);
    });
  }

  function isAdminVisible() {
    const admin = document.querySelector('.adm-ct');
    if (!admin) return false;

    const rect = admin.getBoundingClientRect();
    const style = window.getComputedStyle(admin);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    );
  }

  function createMenu() {
    if (document.getElementById('adm-menu-panel')) return;

    const btn = document.createElement('button');
    btn.id = 'adm-menu-btn';
    btn.type = 'button';
    btn.innerHTML = '☰ <span>Menú</span>';
    btn.addEventListener('click', openMenu);
    document.body.appendChild(btn);

    const overlay = document.createElement('div');
    overlay.id = 'adm-menu-overlay';
    overlay.addEventListener('click', closeMenu);
    document.body.appendChild(overlay);

    const panel = document.createElement('div');
    panel.id = 'adm-menu-panel';
    panel.innerHTML = `
      <div id="adm-menu-header">
        <span id="adm-menu-title">⚡ Admin</span>
        <button id="adm-menu-close-btn" type="button">×</button>
      </div>
      <div id="adm-menu-list"></div>
      <div id="adm-menu-footer">
        <a id="adm-menu-portada" href="${PORTADA_URL}">🏠 Ir a la portada</a>
      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('adm-menu-close-btn').addEventListener('click', closeMenu);
    document.getElementById('adm-menu-portada').addEventListener('click', function(e) {
      e.preventDefault();
      closeMenu();
      goPortada();
    });

    const list = document.getElementById('adm-menu-list');
    MENU_ITEMS.forEach(item => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'adm-menu-item';
      el.dataset.tab = item.id;
      el.innerHTML = `<span class="adm-mi-icon">${item.icon}</span><span>${item.label}</span>`;
      el.addEventListener('click', function() {
        if (typeof window.showAdmTab === 'function') {
          const origBtn = document.querySelector(`.anv[onclick*="${item.id}"]`);
          window.showAdmTab(item.id, origBtn || el);
        }
        setActiveItem(item.id);
        closeMenu();
      });
      list.appendChild(el);
    });
  }

  function syncAdminMenu() {
    removeLogoutStuff();
    ensureDesktopPortadaButton();

    const btn = document.getElementById('adm-menu-btn');
    if (!btn) return;

    const shouldShowMobileMenu = isAdminVisible() && isMobileView();
    btn.classList.toggle('visible', shouldShowMobileMenu);

    if (!shouldShowMobileMenu) closeMenu();
  }

  function protectOldLogoutFunctions() {
    const originalOpenM = window.openM;

    window.openM = function(id) {
      if (id === 'm-admin-exit') {
        goPortada();
        return false;
      }

      if (typeof originalOpenM === 'function') {
        return originalOpenM.apply(this, arguments);
      }

      return undefined;
    };

    window.doAdminLogout = function() {
      goPortada();
      return false;
    };
  }

  function installClickProtection() {
    document.addEventListener('click', function(e) {
      const portadaLink = e.target.closest && e.target.closest('#adm-menu-portada, #adm-portada-desktop, .adm-portada-link');
      if (portadaLink) {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        goPortada();
        return;
      }

      const clickable = e.target.closest && e.target.closest('button, a, [role="button"], input[type="button"], input[type="submit"]');
      if (clickable && isLogoutElement(clickable)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        clickable.remove();
        closeMenu();
        goPortada();
      }
    }, true);
  }

  function init() {
    injectCSS();
    protectOldLogoutFunctions();
    installClickProtection();
    createMenu();
    syncAdminMenu();

    const obs = new MutationObserver(syncAdminMenu);
    obs.observe(document.body, { attributes: true, childList: true, subtree: true });

    window.addEventListener('resize', syncAdminMenu);
    if (mobileMQ && typeof mobileMQ.addEventListener === 'function') {
      mobileMQ.addEventListener('change', syncAdminMenu);
    } else if (mobileMQ && typeof mobileMQ.addListener === 'function') {
      mobileMQ.addListener(syncAdminMenu);
    }

    setInterval(syncAdminMenu, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
