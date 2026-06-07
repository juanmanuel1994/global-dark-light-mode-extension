let currentTab = null;
let currentHostname = '';
let state = { globalDark: false, siteOverrides: {} };

async function init() {
  [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    const url = new URL(currentTab.url);
    currentHostname = url.hostname;
  } catch (e) {
    currentHostname = '';
  }

  document.getElementById('siteName').textContent = currentHostname || 'Esta pestaña';

  const data = await chrome.storage.sync.get(['globalDark', 'siteOverrides']);
  state.globalDark = !!data.globalDark;
  state.siteOverrides = data.siteOverrides || {};

  render();
}

function getEffectiveMode() {
  if (currentHostname && currentHostname in state.siteOverrides) {
    return state.siteOverrides[currentHostname];
  }
  return state.globalDark;
}

function render() {
  const isDark = getEffectiveMode();
  const siteOverride = state.siteOverrides[currentHostname];

  // Popup theme
  document.body.classList.toggle('light', !isDark);

  // Header icon
  document.getElementById('headerLogo').textContent = isDark ? '🌙' : '☀️';

  // Mode card — el toggle refleja el modo efectivo de esta página
  document.getElementById('modeIcon').textContent = isDark ? '🌙' : '☀️';
  document.getElementById('modeLabel').textContent = isDark ? 'Dark Mode' : 'Light Mode';
  document.getElementById('globalToggle').checked = isDark;

  const hasOverride = currentHostname && currentHostname in state.siteOverrides;
  document.getElementById('modeSub').textContent = hasOverride
    ? (isDark ? 'Force dark on this website' : 'Force light on this website')
    : (isDark ? 'Globally enabled' : 'Globally disabled');

  // Site buttons
  document.getElementById('btnAuto').classList.toggle('active', !hasOverride);
  document.getElementById('btnLight').classList.toggle('active', siteOverride === false);
  document.getElementById('btnDark').classList.toggle('active', siteOverride === true);
}

async function saveAndApply() {
  await chrome.storage.sync.set(state);
  render();

  if (!currentTab?.id) return;
  const isDark = getEffectiveMode();

  try {
    // Intentar enviar al content script existente
    await chrome.tabs.sendMessage(currentTab.id, { type: 'SET_MODE', isDark });
  } catch (e) {
    // Content script no está corriendo (pestaña abierta antes de instalar/actualizar)
    // → inyectarlo dinámicamente y luego enviar el mensaje
    try {
      await chrome.scripting.executeScript({ target: { tabId: currentTab.id }, files: ['content.js'] });
      await chrome.tabs.sendMessage(currentTab.id, { type: 'SET_MODE', isDark });
    } catch (e2) {
      // Página restringida (chrome://, pdf, etc.) — se aplica en próxima carga
    }
  }
}

// El toggle controla el override del sitio si existe, si no el modo global
document.getElementById('globalToggle').addEventListener('change', (e) => {
  const wantDark = e.target.checked;
  if (currentHostname && currentHostname in state.siteOverrides) {
    state.siteOverrides[currentHostname] = wantDark;
  } else {
    state.globalDark = wantDark;
  }
  saveAndApply();
});

document.getElementById('btnAuto').addEventListener('click', () => {
  delete state.siteOverrides[currentHostname];
  saveAndApply();
});

document.getElementById('btnLight').addEventListener('click', () => {
  state.siteOverrides[currentHostname] = false;
  saveAndApply();
});

document.getElementById('btnDark').addEventListener('click', () => {
  state.siteOverrides[currentHostname] = true;
  saveAndApply();
});

init();
