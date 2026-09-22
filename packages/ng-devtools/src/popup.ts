// In-page floating devtools popup. Renders an iframe pointing at the devtools SPA.

let popupRoot: HTMLElement | null = null;
let isOpen = false;

const STORAGE_KEY = 'ng-devtools-popup';

interface PopupState {
  x: number;
  y: number;
  width: number;
  height: number;
  docked: 'float' | 'bottom' | 'right';
}

function loadState(): PopupState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { x: 16, y: 16, width: 720, height: 480, docked: 'float' };
}

function saveState(state: PopupState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function getBaseURL(): string {
  const paths = ['/__ng-devtools/', '/__devframe/', '/'];
  for (const base of paths) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', base + '__devframe/__connection.json', false);
      xhr.send();
      if (xhr.status === 200) return base;
    } catch {}
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', base + '__connection.json', false);
      xhr.send();
      if (xhr.status === 200) return base;
    } catch {}
  }
  return '/__ng-devtools/';
}

export function createDevtoolsPopup() {
  if (popupRoot) return;

  const state = loadState();

  popupRoot = document.createElement('div');
  popupRoot.id = 'ng-devtools-popup-root';

  const shadow = popupRoot.attachShadow({ mode: 'open' });

  // FAB toggle button
  const fab = document.createElement('button');
  fab.setAttribute('aria-label', 'Toggle Angular DevTools');
  fab.title = 'Angular DevTools';
  fab.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>`;

  // Panel container
  const panel = document.createElement('div');
  panel.classList.add('panel');

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.classList.add('toolbar');

  const title = document.createElement('span');
  title.classList.add('title');
  title.textContent = 'Angular DevTools';

  const dockGroup = document.createElement('div');
  dockGroup.classList.add('dock-group');
  for (const mode of ['float', 'bottom', 'right'] as const) {
    const btn = document.createElement('button');
    btn.textContent = mode === 'float' ? '⊡' : mode === 'bottom' ? '⬓' : '⬔';
    btn.title = `Dock ${mode}`;
    btn.classList.add('dock-btn');
    if (state.docked === mode) btn.classList.add('active');
    btn.addEventListener('click', () => {
      state.docked = mode;
      applyDock();
      dockGroup.querySelectorAll('.dock-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      saveState(state);
    });
    dockGroup.appendChild(btn);
  }

  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');
  closeBtn.innerHTML = '✕';
  closeBtn.title = 'Close';
  closeBtn.addEventListener('click', togglePanel);

  toolbar.append(title, dockGroup, closeBtn);

  // Iframe
  const iframe = document.createElement('iframe');
  iframe.classList.add('frame');

  panel.append(toolbar, iframe);

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .fab {
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 2147483646;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: #7c3aed;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      transition: transform 0.15s, background 0.15s;
    }
    .fab:hover { background: #6d28d9; transform: scale(1.08); }
    .fab.open { background: #3f3f46; }
    .panel {
      position: fixed;
      z-index: 2147483647;
      display: none;
      flex-direction: column;
      background: #0f0f11;
      border: 1px solid #27272a;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      resize: both;
    }
    .panel.open { display: flex; }
    .panel.dock-float {
      border-radius: 10px;
    }
    .panel.dock-bottom {
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      top: auto !important;
      width: 100% !important;
      height: 40vh !important;
      border-radius: 10px 10px 0 0;
      resize: vertical;
    }
    .panel.dock-right {
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      left: auto !important;
      width: 40vw !important;
      height: 100% !important;
      border-radius: 10px 0 0 10px;
      resize: horizontal;
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: #18181b;
      border-bottom: 1px solid #27272a;
      cursor: grab;
      user-select: none;
      min-height: 36px;
    }
    .toolbar:active { cursor: grabbing; }
    .title {
      font-family: system-ui, sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #a78bfa;
      flex: 1;
    }
    .dock-group {
      display: flex;
      gap: 2px;
    }
    .dock-btn, .close-btn {
      border: none;
      background: transparent;
      color: #71717a;
      cursor: pointer;
      font-size: 14px;
      padding: 2px 6px;
      border-radius: 4px;
      line-height: 1;
    }
    .dock-btn:hover, .close-btn:hover { background: #27272a; color: #e4e4e7; }
    .dock-btn.active { color: #a78bfa; }
    .close-btn { font-size: 13px; }
    .frame {
      flex: 1;
      border: none;
      width: 100%;
      height: 100%;
      background: #0f0f11;
    }
  `;

  fab.classList.add('fab');
  shadow.append(style, fab, panel);
  document.body.appendChild(popupRoot);

  // Drag support for floating mode
  let dragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  toolbar.addEventListener('mousedown', (e) => {
    if (state.docked !== 'float') return;
    dragging = true;
    dragOffsetX = e.clientX - panel.offsetLeft;
    dragOffsetY = e.clientY - panel.offsetTop;
    e.preventDefault();
  });

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    state.x = Math.max(0, e.clientX - dragOffsetX);
    state.y = Math.max(0, e.clientY - dragOffsetY);
    panel.style.left = state.x + 'px';
    panel.style.top = state.y + 'px';
  };

  const onMouseUp = () => {
    if (dragging) {
      dragging = false;
      saveState(state);
    }
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  function applyDock() {
    panel.className = `panel${isOpen ? ' open' : ''} dock-${state.docked}`;
    if (state.docked === 'float') {
      panel.style.left = state.x + 'px';
      panel.style.top = state.y + 'px';
      panel.style.width = state.width + 'px';
      panel.style.height = state.height + 'px';
    } else {
      panel.style.left = '';
      panel.style.top = '';
      panel.style.width = '';
      panel.style.height = '';
    }
  }

  function togglePanel() {
    isOpen = !isOpen;
    fab.classList.toggle('open', isOpen);
    panel.classList.toggle('open', isOpen);
    applyDock();
    if (isOpen && !iframe.src) {
      const base = getBaseURL();
      const origin = location.origin;
      iframe.src = `${origin}${base}?baseURL=${encodeURIComponent(origin + base)}`;
    }
  }

  fab.addEventListener('click', togglePanel);

  // Track resize for float mode
  const resizeObserver = new ResizeObserver(() => {
    if (state.docked === 'float' && isOpen) {
      state.width = panel.offsetWidth;
      state.height = panel.offsetHeight;
      saveState(state);
    }
  });
  resizeObserver.observe(panel);

  applyDock();

  return {
    toggle: togglePanel,
    destroy: () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      resizeObserver.disconnect();
      popupRoot?.remove();
      popupRoot = null;
      isOpen = false;
    },
  };
}

// Auto-create when loaded as script
if (typeof document !== 'undefined') {
  createDevtoolsPopup();
}
