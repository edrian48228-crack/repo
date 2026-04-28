/* admin-menu.js — Menú admin desplegable elegante para Android y Windows.
 * Reemplaza el menú lateral fijo por un botón "☰ Menú" que despliega
 * un panel con todos los tabs + botón cerrar sesión siempre visible.
 * Se inyecta automáticamente sin modificar index.html ni main.js.
 */
(function() {

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
    /* Ocultar menú original en móvil */
    @media (max-width: 768px) {
      .adm-nav { display: none !important; }
      .adm-ft  { display: none !important; }
    }

    /* Botón hamburguesa */
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
    #adm-menu-btn.visible { display: flex; }

    /* Overlay */
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

    /* Panel desplegable */
    #adm-menu-panel {
      position: fixed;
      top: 0;
      right: -320px;
      width: 300px;
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

    /* Header del panel */
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

    /* Lista de items */
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

    /* Footer con cerrar sesión */
    #adm-menu-footer {
      padding: 12px 16px 24px;
      border-top: 1px solid #2a2a2a;
      flex-shrink: 0;
    }
    #adm-menu-logout {
      width: 100%;
      padding: 13px;
      background: linear-gradient(135deg, #ff2200, #ff6600);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-family: Nunito, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      -webkit-tap-highlight-color: transparent;
    }
    #adm-menu-logout:active { filter: brightness(.9); }

    /* El modal de cerrar sesión debe quedar por encima del menú/overlay. */
    .mov { z-index: 10050 !important; }
    #adm-menu-panel:not(.open),
    #adm-menu-overlay:not(.open) { pointer-events: none !important; }
  `;

  function injectCSS() {
    if (document.getElementById('adm-menu-css')) return;
    const style = document.createElement('style');
    style.id = 'adm-menu-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function isAdminOpen() {
    const ct = document.querySelector('.adm-ct');
    if (!ct) return false;
    return ct.getBoundingClientRect().width > 0;
  }

  function openMenu() {
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

  function createMenu() {
    if (document.getElementById('adm-menu-panel')) return;

    // Botón hamburguesa
    const btn = document.createElement('button');
    btn.id = 'adm-menu-btn';
    btn.innerHTML = '☰ <span>Menú</span>';
    btn.addEventListener('click', openMenu);
    document.body.appendChild(btn);

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'adm-menu-overlay';
    overlay.addEventListener('click', closeMenu);
    document.body.appendChild(overlay);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'adm-menu-panel';
    panel.innerHTML = `
      <div id="adm-menu-header">
        <span id="adm-menu-title">⚡ Admin</span>
        <button id="adm-menu-close-btn">×</button>
      </div>
      <div id="adm-menu-list"></div>
      <div id="adm-menu-footer">
        <button id="adm-menu-logout">🚪 Cerrar sesión</button>
      </div>
    `;
    document.body.appendChild(panel);

    // Cerrar con X
    document.getElementById('adm-menu-close-btn').addEventListener('click', closeMenu);

    // Logout — abre el modal de confirmación de cerrar sesión
    document.getElementById('adm-menu-logout').addEventListener('click', () => {
      closeMenu();

      const overlay = document.getElementById('adm-menu-overlay');
      const panel = document.getElementById('adm-menu-panel');
      if (overlay) {
        overlay.classList.remove('open');
        overlay.style.pointerEvents = 'none';
      }
      if (panel) {
        panel.classList.remove('open');
        panel.style.pointerEvents = 'none';
      }

      setTimeout(() => {
        if (overlay) overlay.style.pointerEvents = '';
        if (panel) panel.style.pointerEvents = '';

        const modal = document.getElementById('m-admin-exit');
        if (!modal) {
          console.warn('[admin-menu] Modal m-admin-exit no encontrado en el DOM');
          return;
        }

        if (typeof window.openM === 'function') {
          window.openM('m-admin-exit');
        } else {
          modal.classList.remove('hidden');
        }
      }, 80);
    });

    // Items del menú
    const list = document.getElementById('adm-menu-list');
    MENU_ITEMS.forEach(item => {
      const el = document.createElement('button');
      el.className = 'adm-menu-item';
      el.dataset.tab = item.id;
      el.innerHTML = `<span class="adm-mi-icon">${item.icon}</span><span>${item.label}</span>`;
      el.addEventListener('click', () => {
        if (typeof window.showAdmTab === 'function') {
          const origBtn = document.querySelector(`.anv[onclick*="${item.id}"]`);
          window.showAdmTab(item.id, origBtn || el);
        }
        setActiveItem(item.id);
        closeMenu();
      });
      list.appendChild(el);
    });

    // Mostrar/ocultar botón hamburguesa según si admin está abierto
    const obs = new MutationObserver(() => {
      const w = document.querySelector('.adm-ct')?.getBoundingClientRect().width || 0;
      btn.classList.toggle('visible', w > 0);
      if (w === 0) closeMenu();
    });
    obs.observe(document.body, { attributes: true, childList: true, subtree: true });
  }

  // Inicializar
  injectCSS();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(createMenu, 800));
  } else {
    setTimeout(createMenu, 800);
  }

})();
