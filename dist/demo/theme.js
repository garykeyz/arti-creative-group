(() => {
  const root = document.documentElement;
  const button = document.getElementById('demo-theme');
  function apply(theme) {
    root.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    button.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
    button.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
    button.textContent = root.dataset.theme === 'dark' ? '☼' : '◐';
    document.querySelector('meta[name="theme-color"]').content = root.dataset.theme === 'dark' ? '#1c082c' : '#fff8f2';
  }
  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('arti-theme', next); } catch {}
    apply(next);
  });
  addEventListener('storage', e => { if (e.key === 'arti-theme' && (e.newValue === 'dark' || e.newValue === 'light')) apply(e.newValue); });
  apply(root.dataset.theme);
  let sent = false;
  const ready = () => {
    const app = document.getElementById('app');
    if (!sent && app && !app.querySelector('.initial')) {
      sent = true;
      if (window.parent !== window) window.parent.postMessage({type:'arti-demo-ready'}, location.origin);
      observer.disconnect();
    }
  };
  const observer = new MutationObserver(ready);
  observer.observe(document.getElementById('app'), {childList:true,subtree:true});
  ready();
})();
