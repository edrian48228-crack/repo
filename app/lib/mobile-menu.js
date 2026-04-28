/* mobile-menu.js — Inyecta menú hamburguesa para Android/móvil sin tocar el diseño desktop.
 * Reutiliza .hnav-wrap y los enlaces existentes; añade botón hamburguesa y panel deslizable.
 */
(function () {
  const BREAK = 900;

  function injectStyles() {
    if (document.getElementById("mtp-mobile-menu-css")) return;
    const css = `
      .mtp-burger{display:none;background:transparent;border:1.5px solid var(--o,#ff6600);color:var(--o,#ff6600);
        width:42px;height:42px;border-radius:10px;align-items:center;justify-content:center;cursor:pointer;
        margin-left:8px;flex-shrink:0}
      .mtp-burger:hover{background:rgba(255,102,0,.1)}
      .mtp-burger svg{width:22px;height:22px}
      .mtp-mobile-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9998;opacity:0;
        pointer-events:none;transition:opacity .25s}
      .mtp-mobile-backdrop.open{opacity:1;pointer-events:auto}
      .mtp-mobile-panel{position:fixed;top:0;right:0;height:100vh;height:100dvh;width:min(86vw,340px);
        background:var(--bg2,#0e0e0e);border-left:1px solid var(--bdr,#2a2a2a);z-index:9999;
        transform:translateX(100%);transition:transform .28s ease;display:flex;flex-direction:column;
        padding:14px 14px calc(env(safe-area-inset-bottom,0px) + 28px);overflow-y:auto;
        -webkit-overflow-scrolling:touch;overscroll-behavior:contain;box-shadow:-10px 0 40px rgba(0,0,0,.5)}
      .mtp-mobile-panel.open{transform:translateX(0)}
      .mtp-mobile-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;
        padding-bottom:12px;border-bottom:1px solid var(--bdr,#2a2a2a)}
      .mtp-mobile-title{font-family:var(--fh,Nunito);font-weight:800;color:var(--o,#ff6600);font-size:15px;letter-spacing:.5px}
      .mtp-mobile-close{background:transparent;border:none;color:var(--t1,#fff);font-size:26px;cursor:pointer;
        line-height:1;padding:4px 10px;border-radius:8px}
      .mtp-mobile-close:hover{background:rgba(255,255,255,.06)}
      .mtp-mobile-panel .hnav,.mtp-mobile-panel a{display:block;padding:13px 14px;border-radius:10px;
        color:var(--t1,#fff)!important;text-decoration:none;font-family:var(--fh,Nunito);font-weight:700;
        font-size:14px;border:1px solid transparent;margin-bottom:4px;background:transparent}
      .mtp-mobile-panel .hnav:hover,.mtp-mobile-panel a:hover{background:rgba(255,102,0,.08);
        border-color:rgba(255,102,0,.3);color:var(--o,#ff6600)!important}
      .mtp-mobile-panel .hnav-free{background:linear-gradient(135deg,#ff2200,#ff6600);color:#fff!important}
      .mtp-mobile-actions{margin-top:14px;padding-top:14px;border-top:1px solid var(--bdr,#2a2a2a);
        display:flex;flex-direction:column;gap:8px}
      .mtp-mobile-actions button,.mtp-mobile-actions a{width:100%;text-align:center}
      @media (max-width:${BREAK}px){
        .mtp-burger{display:inline-flex}
        header#hdr .hnav-wrap{display:none!important}
        header#hdr .hdr-right{gap:6px}
        header#hdr .hdr-right > a,header#hdr .hdr-right > button{display:none}
        header#hdr .hdr-right .mtp-burger{display:inline-flex}
      }
      body.mtp-no-scroll{overflow:hidden}
    `;
    const el = document.createElement("style");
    el.id = "mtp-mobile-menu-css";
    el.textContent = css;
    document.head.appendChild(el);
  }

  function buildPanel() {
    if (document.getElementById("mtp-mobile-panel")) return;

    const backdrop = document.createElement("div");
    backdrop.className = "mtp-mobile-backdrop";
    backdrop.id = "mtp-mobile-backdrop";

    const panel = document.createElement("aside");
    panel.className = "mtp-mobile-panel";
    panel.id = "mtp-mobile-panel";
    panel.innerHTML = `
      <div class="mtp-mobile-head">
        <div class="mtp-mobile-title">🔥 MENÚ</div>
        <button class="mtp-mobile-close" aria-label="Cerrar">×</button>
      </div>
      <nav class="mtp-mobile-links"></nav>
      <div class="mtp-mobile-actions"></div>
    `;
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    // Clonar los enlaces del nav original
    const navLinks = document.querySelectorAll("header#hdr .hnav-wrap .hnav, header#hdr .hnav-wrap a");
    const linksHost = panel.querySelector(".mtp-mobile-links");
    navLinks.forEach((a) => {
      const c = a.cloneNode(true);
      c.addEventListener("click", close);
      linksHost.appendChild(c);
    });

    // Clonar los botones de acción del header
    const actions = document.querySelectorAll("header#hdr .hdr-right > a, header#hdr .hdr-right > button");
    const actHost = panel.querySelector(".mtp-mobile-actions");
    actions.forEach((b) => {
      if (b.classList.contains("mtp-burger")) return;
      const c = b.cloneNode(true);
      // re-bind onclick si existe (clone no copia listeners pero sí el atributo)
      c.addEventListener("click", () => setTimeout(close, 50));
      actHost.appendChild(c);
    });

    panel.querySelector(".mtp-mobile-close").addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  function open() {
    document.getElementById("mtp-mobile-panel")?.classList.add("open");
    document.getElementById("mtp-mobile-backdrop")?.classList.add("open");
    document.body.classList.add("mtp-no-scroll");
  }
  function close() {
    document.getElementById("mtp-mobile-panel")?.classList.remove("open");
    document.getElementById("mtp-mobile-backdrop")?.classList.remove("open");
    document.body.classList.remove("mtp-no-scroll");
  }

  function injectBurger() {
    const right = document.querySelector("header#hdr .hdr-right");
    if (!right || right.querySelector(".mtp-burger")) return;
    const btn = document.createElement("button");
    btn.className = "mtp-burger";
    btn.setAttribute("aria-label", "Abrir menú");
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>`;
    btn.addEventListener("click", open);
    right.appendChild(btn);
  }

  function init() {
    injectStyles();
    injectBurger();
    buildPanel();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
