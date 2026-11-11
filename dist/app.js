(() => {
  'use strict';
  const root = document.documentElement;
  const menu = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#navigation');
  const themeButton = document.querySelector('#theme-toggle');
  const languageButton = document.querySelector('#language-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const contactMessage = document.querySelector('#contact-message');
  const contactLink = document.querySelector('#contact-link');
  let selectedContact = 'entertainment';
  let language = 'es';
  const messages = {
    entertainment: ['El contacto comercial de ARTI Creative Group estará disponible próximamente.', 'ARTI Creative Group’s general business contact will be available soon.'],
    guest: ['Para consultar por Guest Star Experience, visita su página de contacto.', 'To ask about Guest Star Experience, visit its contact page.'],
    software: ['El contacto comercial de ARTI Creative Group estará disponible próximamente.', 'ARTI Creative Group’s general business contact will be available soon.'],
    future: ['Compartiremos información sobre estas iniciativas cuando esté disponible.', 'We’ll share information about these initiatives when it becomes available.']
  };
  const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const closeMenu = (restoreFocus = false) => {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    updateLabels();
    if (restoreFocus) menu.focus();
  };
  function updateLabels() {
    const dark = root.dataset.theme === 'dark';
    const open = menu.getAttribute('aria-expanded') === 'true';
    themeButton.setAttribute('aria-label', language === 'es' ? (dark ? 'Activar modo claro' : 'Activar modo oscuro') : (dark ? 'Switch to light mode' : 'Switch to dark mode'));
    themeButton.setAttribute('aria-pressed', String(dark));
    menu.setAttribute('aria-label', language === 'es' ? (open ? 'Cerrar menú' : 'Abrir menú') : (open ? 'Close menu' : 'Open menu'));
    languageButton.setAttribute('aria-label', language === 'es' ? 'Switch to English' : 'Cambiar a español');
    languageButton.textContent = language === 'es' ? 'EN' : 'ES';
    nav.setAttribute('aria-label', language === 'es' ? 'Navegación principal' : 'Main navigation');
    document.querySelectorAll('a.brand').forEach(a => a.setAttribute('aria-label', language === 'es' ? 'ARTI Creative Group — inicio' : 'ARTI Creative Group — home'));
    document.querySelector('.hero-bottom a').setAttribute('aria-label', language === 'es' ? 'Explorar servicios' : 'Explore services');
  }
  function renderContact() {
    contactMessage.textContent = messages[selectedContact][language === 'es' ? 0 : 1];
    contactLink.hidden = selectedContact !== 'guest';
  }
  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'es';
    root.lang = language;
    document.querySelectorAll('[data-es][data-en]').forEach(el => { el.innerHTML = el.dataset[language]; });
    document.querySelectorAll('[data-alt-es][data-alt-en]').forEach(el => { el.alt = el.dataset[language === 'es' ? 'altEs' : 'altEn']; });
    document.title = language === 'es' ? 'ARTI Creative Group — Entretenimiento, talento y tecnología' : 'ARTI Creative Group — Entertainment, talent and technology';
    updateLabels();
    renderContact();
  }
  function setTheme(theme, persist = true) {
    root.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    themeMeta.content = root.dataset.theme === 'dark' ? '#1C082C' : '#FFF8F2';
    if (persist) savePreference('arti-theme', root.dataset.theme);
    updateLabels();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    updateLabels();
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true); });
  document.addEventListener('click', e => { if (menu.getAttribute('aria-expanded') === 'true' && !nav.contains(e.target) && !menu.contains(e.target)) closeMenu(); });
  themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  languageButton.addEventListener('click', () => { setLanguage(language === 'es' ? 'en' : 'es'); savePreference('arti-language', language); });
  document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => {
    selectedContact = button.dataset.contact;
    document.querySelectorAll('[data-contact]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderContact();
  }));
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  systemTheme.addEventListener?.('change', e => { if (!readPreference('arti-theme')) setTheme(e.matches ? 'dark' : 'light', false); });
  setLanguage(readPreference('arti-language') === 'en' ? 'en' : 'es');
  setTheme(root.dataset.theme, false);
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const nodes = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold: 0.08, rootMargin: '0px 0px -20px 0px'});
    nodes.forEach(node => observer.observe(node));
    root.classList.add('js-motion');
  }
})();
(() => {
  const frame = document.getElementById('arti-demo');
  const status = document.getElementById('demo-status');
  const expand = document.getElementById('demo-expand');
  const wrap = document.getElementById('demo-frame-wrap');
  if (!frame || !status || !expand || !wrap) return;
  let ready = false;
  function updateStatus() {
    const en = document.documentElement.lang === 'en';
    frame.title = en ? 'ARTI interactive demo' : 'Demostración interactiva de ARTI';
    expand.setAttribute('aria-label', en ? 'Expand demo' : 'Ampliar demostración');
    if (ready) return;
    status.textContent = status.dataset.error === 'true'
      ? (en ? 'The demo could not be loaded here. Use “Open in a new tab”.' : 'No se pudo cargar la demo aquí. Usa «Abrir en otra pestaña».')
      : (en ? 'Loading demo…' : 'Cargando demostración…');
  }
  addEventListener('message', e => {
    if (e.origin !== location.origin || e.source !== frame.contentWindow || e.data?.type !== 'arti-demo-ready') return;
    ready = true;
    status.hidden = true;
  });
  frame.addEventListener('load', () => {
    setTimeout(() => { if (!ready) { status.dataset.error = 'true'; updateStatus(); } }, 12000);
  });
  expand.addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await wrap.requestFullscreen(); }
    catch { window.open(frame.src, '_blank', 'noopener'); }
  });
  document.getElementById('language-toggle').addEventListener('click', updateStatus);
  addEventListener('storage', e => {
    if (e.key !== 'arti-theme' || !['dark','light'].includes(e.newValue)) return;
    document.documentElement.dataset.theme = e.newValue;
    document.querySelector('meta[name="theme-color"]').content = e.newValue === 'dark' ? '#1C082C' : '#FFF8F2';
    const button = document.getElementById('theme-toggle');
    button.setAttribute('aria-pressed', String(e.newValue === 'dark'));
    const en = document.documentElement.lang === 'en';
    button.setAttribute('aria-label', en ? (e.newValue === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : (e.newValue === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'));
  });
  updateStatus();
})();
