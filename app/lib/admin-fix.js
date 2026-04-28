/* admin-fix.js — Garantiza que las pestañas del panel admin (Planes, Contactos,
 * Links, Plan Free, Avatar, Textos, etc.) carguen sus editores con los datos
 * actuales de S al abrirlas. No toca tu HTML; sólo hookea showAdmTab.
 *
 * Causa raíz: el showAdmTab reescrito al final de tu HTML no llamaba a las
 * funciones de render por pestaña, por lo que los editores quedaban vacíos
 * aunque los datos sí estuvieran cargados en S.
 */
(function () {
  const RENDER_MAP = {
    planes:        ["renderPlanEditor"],
    free:          ["loadFreeConfig", "renderFreeFeats"],
    avatar:        ["renderAvatarEditor", "previewAvaImg"],
    contacto:      ["renderContactEditor"],
    links:         ["renderLinkEditor"],
    textos:        ["loadTextos", "loadCfgTextos"],
    seguridad:     ["loadSeguridad"],
    promo:         ["loadPromoConf", "renderPromoLinksEditor"],
    tc:            ["renderTC"],
    testimonials:  ["renderTestiAdm"],
    exportar:      ["loadExportar"],
    sellers:       ["renderSellers"],
    stores:        ["renderAdmStores"],
    notif:         ["renderNotifAdm"],
    dash:          ["renderDash"],
  };

  const TEXT_INPUTS = [
    // Pestaña Textos
    ["cfg-sname",  () => window.S?.sname],
    ["cfg-sub",    () => window.S?.sub],
    ["cfg-author", () => window.S?.author],
    // Plan Free
    ["free-desc-inp",  () => window.S?.freeDesc],
    ["free-feats-inp", () => Array.isArray(window.S?.freeFeats) ? window.S.freeFeats.join("\n") : ""],
    // Avatar
    ["ava-name-inp", () => window.S?.avatar?.name],
    ["ava-img-url",  () => window.S?.avatar?.img],
    // Propietario
    ["own-w", () => window.S?.ownerPrices?.web],
    ["own-a", () => window.S?.ownerPrices?.apk],
  ];

  function safeCall(name) {
    const fn = window[name];
    if (typeof fn === "function") {
      try { fn(); } catch (e) { console.warn("[MTP admin-fix]", name, e); }
    }
  }

  function fillTextInputs() {
    TEXT_INPUTS.forEach(([id, getter]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const v = getter();
      if (v !== undefined && v !== null && el.value === "") el.value = v;
    });
  }

  function renderTab(name) {
    const fns = RENDER_MAP[name] || [];
    fns.forEach(safeCall);
    fillTextInputs();
  }

  function wrapShowAdmTab() {
    if (typeof window.showAdmTab !== "function" || window.__mtpAdmTabWrapped) return;
    const orig = window.showAdmTab;
    window.showAdmTab = function (name, btn) {
      const r = orig.apply(this, arguments);
      try { renderTab(name); } catch (e) { console.warn("[MTP admin-fix] tab", name, e); }
      return r;
    };
    window.__mtpAdmTabWrapped = true;
  }

  function wrapAdminLogin() {
    if (typeof window.doAdminLogin !== "function" || window.__mtpAdmLoginWrapped) return;
    const orig = window.doAdminLogin;
    window.doAdminLogin = function () {
      const r = orig.apply(this, arguments);
      // Tras login, cargar todos los editores y renderizar la pestaña activa
      setTimeout(() => {
        safeCall("loadAdminUI");
        fillTextInputs();
        // Detectar la pestaña activa y rerenderizarla
        const active = document.querySelector(".atb.show");
        if (active) {
          const name = active.id.replace(/^atb-/, "");
          renderTab(name);
        } else {
          renderTab("dash");
        }
      }, 60);
      return r;
    };
    window.__mtpAdmLoginWrapped = true;
  }

  function tryWrap() {
    wrapShowAdmTab();
    wrapAdminLogin();
  }

  // Reintenta hasta que las funciones globales del HTML estén definidas
  let tries = 0;
  const id = setInterval(() => {
    tryWrap();
    if ((window.__mtpAdmTabWrapped && window.__mtpAdmLoginWrapped) || ++tries > 40) clearInterval(id);
  }, 150);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tryWrap);
  else tryWrap();
})();
