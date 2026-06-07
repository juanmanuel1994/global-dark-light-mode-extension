// Guard contra doble inyección (cuando background.js re-inyecta en pestañas existentes)
if (!window.__darkmode_ext_injected) {
  window.__darkmode_ext_injected = true;

  const STYLE_ID = '__darkmode_ext_style__';

  function applyFilter(on) {
    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(el);
    }
    el.textContent = on
      ? 'html{filter:invert(1) hue-rotate(180deg) !important;}img,video,picture,canvas,iframe{filter:invert(1) hue-rotate(180deg) !important;}'
      : '';
  }

  // Detecta señales EXPLÍCITAS de dark mode en el HTML
  // Solo usamos atributos/clases concretas, no color de fondo (da falsos positivos)
  function isPageExplicitlyDark() {
    const html = document.documentElement;
    if (html.hasAttribute('dark')) return true;                            // YouTube
    const tokens = ['dark', 'dark-mode', 'darkMode', 'dark-theme', 'night-mode', 'theme-dark'];
    if (tokens.some(t => html.classList.contains(t))) return true;
    const theme = html.getAttribute('data-theme') ||
                  html.getAttribute('data-color-scheme') ||
                  html.getAttribute('color-scheme');
    if (theme && theme.includes('dark')) return true;
    return false;
  }

  function computeAndApply(wantDark) {
    // Solo saltar la inversión si la página ya señala explícitamente que es oscura
    const pageDark = isPageExplicitlyDark();
    applyFilter(wantDark !== pageDark);
  }

  function getHostname() {
    try { return new URL(location.href).hostname; } catch (e) { return ''; }
  }

  function resolveWantDark(data) {
    const hostname = getHostname();
    const overrides = data.siteOverrides || {};
    if (hostname && hostname in overrides) return overrides[hostname];
    return !!data.globalDark;
  }

  chrome.storage.sync.get(['globalDark', 'siteOverrides'], (data) => {
    const wantDark = resolveWantDark(data);
    computeAndApply(wantDark);
    if (document.readyState === 'loading') {
      // Re-evaluar después de que el DOM cargue (YouTube añade html[dark] vía JS)
      document.addEventListener('DOMContentLoaded', () => computeAndApply(wantDark));
    }
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SET_MODE') computeAndApply(msg.isDark);
  });
}
