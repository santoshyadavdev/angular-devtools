// In-page floating devtools popup. Renders an iframe pointing at the devtools SPA.

let popupRoot: HTMLElement | null = null;
/** Kept so a later call returns the same handle rather than nothing. */
let handle: { toggle: () => void; destroy: () => void } | undefined;
let isOpen = false;

const STORAGE_KEY = 'ng-devtools-popup';

interface PopupState {
  x: number;
  y: number;
  width: number;
  height: number;
  docked: 'float' | 'bottom' | 'right';
  /** Where the launcher was left, so it can sit anywhere, not just a corner. */
  launcher?: { x: number; y: number };
}

const DEFAULT_STATE: PopupState = { x: 16, y: 16, width: 720, height: 480, docked: 'float' };

function loadState(): PopupState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored: unknown = raw ? JSON.parse(raw) : null;
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return { ...DEFAULT_STATE };

    // Anything in storage may be stale or hand edited, so each field is only
    // taken when it is the shape this version expects.
    const saved = stored as Partial<PopupState>;
    const point = saved.launcher;
    return {
      ...DEFAULT_STATE,
      ...(Number.isFinite(saved.x) ? { x: saved.x as number } : {}),
      ...(Number.isFinite(saved.y) ? { y: saved.y as number } : {}),
      ...(Number.isFinite(saved.width) ? { width: saved.width as number } : {}),
      ...(Number.isFinite(saved.height) ? { height: saved.height as number } : {}),
      ...(saved.docked === 'float' || saved.docked === 'bottom' || saved.docked === 'right'
        ? { docked: saved.docked }
        : {}),
      ...(point && Number.isFinite(point.x) && Number.isFinite(point.y)
        ? { launcher: { x: point.x, y: point.y } }
        : {}),
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
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
  if (popupRoot) return handle;

  const state = loadState();

  popupRoot = document.createElement('div');
  popupRoot.id = 'ng-devtools-popup-root';

  const shadow = popupRoot.attachShadow({ mode: 'open' });

  // FAB toggle button
  const fab = document.createElement('button');
  fab.setAttribute('aria-label', 'Toggle Angular DevTools');
  fab.setAttribute('aria-expanded', 'false');
  fab.title = 'Angular DevTools';
  // The Angular shield, from the wordmark on angular.dev.
  fab.innerHTML =
    `<svg width="22" height="22" viewBox="0 0 223 236" fill="currentColor" aria-hidden="true">` +
    `<path d="m222.077 39.192-8.019 125.923L137.387 0l84.69 39.192Zm-53.105 162.825-57.933 33.056` +
    `-57.934-33.056 11.783-28.556h92.301l11.783 28.556ZM111.039 62.675l30.357 73.803H80.681l30.358` +
    `-73.803ZM7.937 165.115 0 39.192 84.69 0 7.937 165.115Z"/></svg>`;

  // Panel container
  const panel = document.createElement('div');
  panel.classList.add('panel');
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Angular DevTools');

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
    btn.type = 'button';
    btn.textContent = mode === 'float' ? '⊡' : mode === 'bottom' ? '⬓' : '⬔';
    btn.title = `Dock ${mode}`;
    btn.setAttribute('aria-label', `Dock ${mode}`);
    btn.setAttribute('aria-pressed', String(state.docked === mode));
    btn.classList.add('dock-btn');
    if (state.docked === mode) btn.classList.add('active');
    btn.addEventListener('click', () => {
      state.docked = mode;
      applyDock();
      dockGroup.querySelectorAll('.dock-btn').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      saveState(state);
    });
    dockGroup.appendChild(btn);
  }

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.classList.add('close-btn');
  closeBtn.innerHTML = '✕';
  closeBtn.title = 'Close';
  closeBtn.setAttribute('aria-label', 'Close Angular DevTools');
  closeBtn.addEventListener('click', togglePanel);

  toolbar.append(title, dockGroup, closeBtn);

  // Iframe
  const iframe = document.createElement('iframe');
  iframe.classList.add('frame');
  iframe.title = 'Angular DevTools';

  panel.append(toolbar, iframe);

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .fab {
      position: fixed;
      z-index: 2147483646;
      inset: auto 16px 16px auto;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: var(--ng-devtools-accent, #7c3aed);
      color: var(--ng-devtools-accent-ink, #fff);
      cursor: pointer;
      touch-action: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      transition: transform 0.15s, background 0.15s;
    }
    .fab:hover { background: var(--ng-devtools-accent-hover, #6d28d9); transform: scale(1.08); }
    .fab.open { background: #3f3f46; }
    .fab.dragging {
      transition: none;
      cursor: grabbing;
      transform: scale(1.06);
    }
    /* The shadow root cannot inherit the page's focus styles. */
    .dock-btn:focus-visible, .close-btn:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
    /* The launcher sits on the host page, whose background is unknown, so the
       ring is drawn in both directions to stay visible either way. */
    .fab:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
      box-shadow: 0 0 0 4px #111827;
    }
    .panel {
      position: fixed;
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(8px) scale(0.98);
      transform-origin: bottom right;
      transition: opacity 160ms ease, transform 160ms ease, visibility 0s linear 160ms;
      background: #0f0f11;
      border: 1px solid #27272a;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      resize: both;
    }
    .panel.open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: none;
      transition: opacity 160ms ease, transform 160ms ease, visibility 0s;
    }
    @media (prefers-reduced-motion: reduce) {
      .panel, .panel.open, .fab { transition: none; }
    }
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
      cursor: grab;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: #18181b;
      border-bottom: 1px solid #27272a;
      user-select: none;
      min-height: 36px;
    }
    .toolbar:active { cursor: grabbing; }
    .title {
      font-family: system-ui, sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: var(--ng-devtools-title, #a78bfa);
      flex: 1;
    }
    .dock-group {
      display: flex;
      gap: 2px;
    }
    .dock-btn, .close-btn {
      border: none;
      background: transparent;
      color: #8a8a94;
      cursor: pointer;
      font-size: 14px;
      padding: 2px 6px;
      border-radius: 4px;
      line-height: 1;
    }
    .dock-btn:hover, .close-btn:hover { background: #27272a; color: #e4e4e7; }
    .dock-btn.active { color: var(--ng-devtools-title, #a78bfa); }
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
    // Clamped at both ends: dragging the toolbar off the right or bottom edge
    // would leave the panel with no reachable handle.
    const maxX = Math.max(0, window.innerWidth - panel.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - panel.offsetHeight);
    state.x = Math.min(Math.max(0, e.clientX - dragOffsetX), maxX);
    state.y = Math.min(Math.max(0, e.clientY - dragOffsetY), maxY);
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

  // Scoped to the popup's own chrome: a listener on the window would take
  // Escape away from the host application.
  const onEscape = (event: Event) => {
    if ((event as KeyboardEvent).key === 'Escape' && isOpen) togglePanel();
  };
  popupRoot.addEventListener('keydown', onEscape);

  // A key pressed inside the frame is delivered to the frame's own document
  // and never reaches the host, so Escape would not close the panel while the
  // devtools have focus. The frame is same origin, so it can be listened to.
  iframe.addEventListener('load', () => {
    try {
      iframe.contentDocument?.addEventListener('keydown', onEscape);
    } catch {
      // a cross origin frame cannot be reached, and Escape stays host only
    }
  });

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
    fab.setAttribute('aria-expanded', String(isOpen));
    panel.classList.toggle('open', isOpen);
    applyDock();
    // Closing hides the panel, so focus would fall to the body. Only take it
    // back when it was inside the popup: the host page may own it.
    if (!isOpen && popupRoot?.contains(document.activeElement)) fab.focus();
    if (isOpen && !iframe.src) {
      const base = getBaseURL();
      const origin = location.origin;
      let pageId = '';
      try {
        pageId = sessionStorage.getItem('ng-devtools-page-id') ?? '';
      } catch {
        // Storage can be blocked; the panel then shows the latest page.
      }
      iframe.src = `${origin}${base}?baseURL=${encodeURIComponent(origin + base)}&pageId=${encodeURIComponent(pageId)}`;
    }
  }

  // Dragging the launcher, so it can be left anywhere rather than only in a
  // corner. A press that does not move is a click, which still opens the panel.
  const DRAG_THRESHOLD = 4;
  const MARGIN = 8;
  let fabPointer: { id: number; offsetX: number; offsetY: number; moved: boolean } | null = null;
  let launcherAt: { x: number; y: number } | null = null;
  let suppressClick = false;

  fab.addEventListener('pointerdown', (event) => {
    // A second finger must not take over a drag that is already running.
    if (fabPointer) return;
    fabPointer = {
      id: event.pointerId,
      // Layout offsets, not the rendered box, which carries the hover scale.
      offsetX: event.clientX - fab.offsetLeft,
      offsetY: event.clientY - fab.offsetTop,
      moved: false,
    };
    try {
      fab.setPointerCapture(event.pointerId);
    } catch {
      // the pointer is already gone; the drag simply never starts
    }
  });

  fab.addEventListener('pointermove', (event) => {
    if (!fabPointer || event.pointerId !== fabPointer.id) return;
    // A mouse that comes back with no button held lost its capture somewhere.
    if (event.pointerType === 'mouse' && event.buttons === 0) {
      cancelFabDrag();
      return;
    }
    const x = event.clientX - fabPointer.offsetX;
    const y = event.clientY - fabPointer.offsetY;

    if (!fabPointer.moved) {
      if (Math.hypot(x - fab.offsetLeft, y - fab.offsetTop) < DRAG_THRESHOLD) return;
      fabPointer.moved = true;
      fab.classList.add('dragging');
    }
    placeLauncher(x, y);
  });

  function cancelFabDrag() {
    fabPointer = null;
    fab.classList.remove('dragging');
  }

  const endFabDrag = (event: PointerEvent) => {
    if (!fabPointer || event.pointerId !== fabPointer.id) return;
    const moved = fabPointer.moved;
    cancelFabDrag();
    if (!moved) return;

    // A mouse drag is followed by a click, which must not also toggle. Touch
    // sends no such click, so the flag is cleared on the next frame rather
    // than left armed to swallow a later, unrelated activation.
    suppressClick = true;
    requestAnimationFrame(() => {
      suppressClick = false;
    });

    if (launcherAt) state.launcher = launcherAt;
    saveState(state);
  };

  fab.addEventListener('pointerup', endFabDrag);
  // A cancelled drag keeps whatever position it reached, but is not saved.
  fab.addEventListener('pointercancel', cancelFabDrag);
  fab.addEventListener('lostpointercapture', cancelFabDrag);

  // Keyboard activation of a button fires `click` with no pointer events, so
  // the toggle stays on `click` rather than on `pointerup`.
  fab.addEventListener('click', () => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    togglePanel();
  });

  /** Positions the launcher, keeping it fully on screen. */
  function placeLauncher(x: number, y: number) {
    const size = fab.offsetWidth;
    const left = Math.round(Math.min(Math.max(x, MARGIN), window.innerWidth - size - MARGIN));
    const top = Math.round(Math.min(Math.max(y, MARGIN), window.innerHeight - size - MARGIN));
    fab.style.inset = `${top}px auto auto ${left}px`;
    launcherAt = { x: left, y: top };
    return launcherAt;
  }

  function applyLauncher() {
    if (!state.launcher) return;
    placeLauncher(state.launcher.x, state.launcher.y);
  }

  // Dragging is not the only way to move it: arrow keys nudge it, and a
  // double click returns it to the default corner.
  fab.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 32 : 8;
    const by: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = by[event.key];
    if (!move) return;
    event.preventDefault();
    state.launcher = placeLauncher(fab.offsetLeft + move[0], fab.offsetTop + move[1]);
    saveState(state);
  });

  fab.addEventListener('dblclick', () => {
    // The two clicks that make up a double click have already toggled the
    // panel twice, leaving it as it was; only the position resets.
    delete state.launcher;
    fab.style.inset = '';
    saveState(state);
  });

  applyLauncher();
  // Keep it reachable when the window changes size.
  window.addEventListener('resize', applyLauncher);
  // Track resize for float mode. Not every environment that has a document
  // also has ResizeObserver, so the panel still works without it.
  const resizeObserver =
    typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(() => {
          if (state.docked === 'float' && isOpen) {
            state.width = panel.offsetWidth;
            state.height = panel.offsetHeight;
            saveState(state);
          }
        });
  resizeObserver?.observe(panel);

  applyDock();

  handle = {
    toggle: togglePanel,
    destroy: () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', applyLauncher);
      resizeObserver?.disconnect();
      popupRoot?.remove();
      popupRoot = null;
      handle = undefined;
      isOpen = false;
    },
  };
  return handle;
}

// Auto-create when loaded as script
if (typeof document !== 'undefined') {
  createDevtoolsPopup();
}
