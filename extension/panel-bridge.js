// Bridge between the Chrome DevTools panel and the inspected Angular page.
// Detects the devframe connection endpoint and loads the SPA with the correct baseURL.

const frame = document.getElementById('devtools-frame');
const status = document.getElementById('status');

const tabId = chrome.devtools.inspectedWindow.tabId;
const LOCAL_HOSTS = ['localhost', '127.0.0.1'];

// Try to find the devframe connection on the inspected page
function detectConnection() {
  // Try common devframe mount paths
  const paths = ['/__ng-devtools/', '/__devframe/', '/'];

  chrome.devtools.inspectedWindow.eval(
    `(function() {
      const paths = ${JSON.stringify(paths)};
      for (const base of paths) {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', base + '__devframe/__connection.json', false);
          xhr.send();
          if (xhr.status === 200) {
            return { base: base, connection: JSON.parse(xhr.responseText) };
          }
        } catch(e) {}
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', base + '__connection.json', false);
          xhr.send();
          if (xhr.status === 200) {
            return { base: base, connection: JSON.parse(xhr.responseText) };
          }
        } catch(e) {}
      }
      return null;
    })()`,
    (result, err) => {
      if (result && paths.includes(result.base)) {
        loadPanel(result.base);
      } else {
        // No live devframe found — load in standalone/static mode
        loadPanel(null);
      }
    },
  );
}

function loadPanel(baseURL) {
  status.classList.add('hidden');
  frame.style.display = 'block';

  // The SPA is bundled inside the extension at ui/index.html
  const panelUrl = chrome.runtime.getURL('ui/index.html');

  if (baseURL) {
    // Get the inspected page's origin to build the full baseURL
    chrome.devtools.inspectedWindow.eval('location.origin', (origin) => {
      const url = new URL(baseURL, origin);
      if (!LOCAL_HOSTS.includes(url.hostname)) {
        frame.src = panelUrl;
        return;
      }
      frame.src = `${panelUrl}?baseURL=${encodeURIComponent(url.href)}`;
    });
  } else {
    frame.src = panelUrl;
  }
}

// Start detection after a short delay to let the page settle
setTimeout(detectConnection, 500);

// Re-detect on navigation
chrome.devtools.network.onNavigated.addListener(() => {
  frame.style.display = 'none';
  status.classList.remove('hidden');
  status.textContent = 'Detecting Angular app…';
  setTimeout(detectConnection, 1000);
});
