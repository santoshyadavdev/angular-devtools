// Listen for the detection result posted from the page context
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (event.data?.type === '__NG_DEVTOOLS_ANGULAR_DETECTED__') {
    chrome.runtime.sendMessage({
      type: 'angular-detected-from-page',
      version: event.data.version,
    });
  }
});
