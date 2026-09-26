// Bridge between the Chrome DevTools panel and the inspected Angular page.
// Detects the devframe connection endpoint and loads the SPA with the correct baseURL.

const frame = document.getElementById('devtools-frame');
const status = document.getElementById('status');

const tabId = chrome.devtools.inspectedWindow.tabId;
const LOCAL_HOSTS = ['localhost', '127.0.0.1'];

// Where devframe may be mounted.
const PATHS = ['/__ng-devtools/', '/__devframe/', '/'];
const CONNECTION_FILES = ['__devframe/__connection.json', '__connection.json'];
const PROBE_TIMEOUT_MS = 1500;

let detection = 0;

// Look for a devframe connection, but only on a loopback page: nothing else
// can be connected to, so nothing else is worth probing.
function detectConnection() {
  const run = ++detection;
  chrome.devtools.inspectedWindow.eval('location.origin', (origin, error) => {
    if (run !== detection) return;
    if (error || typeof origin !== 'string') {
      loadPanel(null);
      return;
    }

    let hostname;
    try {
      hostname = new URL(origin).hostname;
    } catch {
      loadPanel(null);
      return;
    }

    if (!LOCAL_HOSTS.includes(hostname)) {
      loadPanel(null);
      return;
    }

    findConnection(origin).then((base) => {
      if (run === detection) loadPanel(base, origin);
    });
  });
}

// The first mount path that answers with a connection file, or null.
async function findConnection(origin) {
  for (const base of PATHS) {
    for (const file of CONNECTION_FILES) {
      try {
        const response = await fetch(new URL(base + file, origin), {
          credentials: 'omit',
          cache: 'no-store',
          redirect: 'error',
          signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
        });
        if (!response.ok) continue;
        await response.json();
        return base;
      } catch {
        // Not mounted here; try the next one.
      }
    }
  }
  return null;
}

function loadPanel(baseURL, origin) {
  status.classList.add('hidden');
  frame.style.display = 'block';

  // The SPA is bundled inside the extension at ui/index.html
  const panelUrl = chrome.runtime.getURL('ui/index.html');

  if (!baseURL || !origin) {
    frame.src = panelUrl;
    return;
  }
  const url = new URL(baseURL, origin);
  frame.src = LOCAL_HOSTS.includes(url.hostname)
    ? `${panelUrl}?baseURL=${encodeURIComponent(url.href)}`
    : panelUrl;
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
