// Al instalar o actualizar la extensión, re-inyectar content.js en todas las pestañas abiertas
// Esto evita que el usuario tenga que recargar cada pestaña manualmente
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] }, async (tabs) => {
    for (const tab of tabs) {
      try {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
      } catch (e) {
        // Ignorar pestañas restringidas (chrome://, about:, pdf, etc.)
      }
    }
  });
});
