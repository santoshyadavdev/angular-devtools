import { connectDevframe } from "devframe/client";
//#region src/overlay.ts
let highlightEl = null;
async function initOverlay(options = {}) {
	const my = (await connectDevframe({ baseURL: options.baseURL ?? ["./", "/__ng-devtools/"] })).scope("ng-devtools");
	async function pushTree() {
		const tree = collectComponentTree();
		await my.rpc.call("push-component-tree", tree);
	}
	async function pushSignalGraph() {
		const graph = collectSignalGraph();
		if (graph) await my.rpc.call("push-signal-graph", graph);
	}
	async function pushInjectorTree() {
		const tree = collectInjectorTree();
		if (tree.length) await my.rpc.call("push-injector-tree", tree);
	}
	async function pushNgrxState() {
		const data = collectNgrxState();
		if (data) await my.rpc.call("push-ngrx-state", data);
	}
	pushTree();
	pushSignalGraph();
	pushInjectorTree();
	pushNgrxState();
	const interval = setInterval(() => {
		pushTree();
		pushSignalGraph();
		pushInjectorTree();
		pushNgrxState();
	}, 3e3);
	my.rpc.register({
		name: "highlight-in-page",
		type: "event",
		jsonSerializable: true,
		handler: (selector) => {
			clearHighlight();
			let el = null;
			try {
				el = document.querySelector(selector);
			} catch {
				return;
			}
			if (el instanceof HTMLElement) showHighlight(el);
		}
	});
	return () => {
		clearInterval(interval);
		clearHighlight();
	};
}
function findAngularElements() {
	const versionEls = Array.from(document.querySelectorAll("[ng-version]"));
	const hostEls = Array.from(document.querySelectorAll("*")).filter((el) => Array.from(el.attributes).some((a) => a.name.startsWith("_nghost")));
	return Array.from(/* @__PURE__ */ new Set([...versionEls, ...hostEls]));
}
function collectComponentTree() {
	const nodes = [];
	const allRoots = findAngularElements();
	const roots = allRoots.filter((root) => !allRoots.some((other) => other !== root && other.contains(root)));
	const ng = window.ng;
	if (ng?.getComponent) {
		if (roots.length > 0) for (const root of roots) walkAngularTree(root, nodes, ng);
		else if (typeof document !== "undefined" && document.body) walkAngularTree(document.body, nodes, ng);
	} else if (typeof document !== "undefined" && document.body) walkDom(document.body, nodes);
	return nodes;
}
function walkAngularTree(el, out, ng) {
	const component = ng.getComponent(el);
	if (component) {
		const node = {
			id: generateId(el),
			selector: el.tagName.toLowerCase(),
			tagName: el.tagName.toLowerCase(),
			children: [],
			inputs: tryGetInputs(component)
		};
		for (const child of el.children) walkAngularTree(child, node.children, ng);
		out.push(node);
	} else for (const child of el.children) walkAngularTree(child, out, ng);
}
function walkDom(el, out) {
	const tagName = el.tagName.toLowerCase();
	if (tagName.includes("-") || Array.from(el.attributes).some((a) => a.name.startsWith("_nghost"))) {
		const node = {
			id: generateId(el),
			selector: tagName,
			tagName,
			children: []
		};
		for (const child of el.children) walkDom(child, node.children);
		out.push(node);
	} else for (const child of el.children) walkDom(child, out);
}
function isSignal(val) {
	if (typeof val !== "function") return false;
	if (val.name === "signalValueFn") return true;
	return Object.getOwnPropertySymbols(val).some((s) => s.description === "SIGNAL" || s.toString().includes("SIGNAL"));
}
function tryGetInputs(component) {
	if (!component || typeof component !== "object") return void 0;
	try {
		const inputs = {};
		const comp = component;
		for (const key of Object.keys(comp)) {
			const val = comp[key];
			if (isSignal(val)) try {
				inputs[key] = serializeValue(val());
			} catch {}
			else if (typeof val !== "function") inputs[key] = serializeValue(val);
		}
		return Object.keys(inputs).length > 0 ? inputs : void 0;
	} catch {
		return;
	}
}
let idCounter = 0;
function generateId(el) {
	const existing = el.getAttribute("data-ng-devtools-id");
	if (existing) return existing;
	const id = `ngdt-${++idCounter}`;
	el.setAttribute("data-ng-devtools-id", id);
	return id;
}
function showHighlight(el) {
	clearHighlight();
	const rect = el.getBoundingClientRect();
	highlightEl = document.createElement("div");
	Object.assign(highlightEl.style, {
		position: "fixed",
		top: `${rect.top}px`,
		left: `${rect.left}px`,
		width: `${rect.width}px`,
		height: `${rect.height}px`,
		background: "rgba(104, 182, 255, 0.25)",
		border: "2px solid rgba(104, 182, 255, 0.8)",
		borderRadius: "4px",
		pointerEvents: "none",
		zIndex: "2147483647",
		transition: "all 0.15s ease"
	});
	document.body.appendChild(highlightEl);
	setTimeout(clearHighlight, 2e3);
}
function clearHighlight() {
	highlightEl?.remove();
	highlightEl = null;
}
function getNg() {
	return window.ng;
}
function collectSignalGraph() {
	if (!getNg()?.ɵgetSignalGraph) return null;
	const roots = document.querySelectorAll("[ng-version], [_nghost-ng-c]");
	for (const root of roots) {
		const graph = getSignalGraphForElement(root);
		if (graph) return graph;
	}
	return null;
}
function getSignalGraphForElement(el) {
	const ng = getNg();
	if (!ng?.ɵgetSignalGraph || !ng?.getInjector) return null;
	try {
		const injector = ng.getInjector(el);
		if (!injector) return null;
		const raw = ng.ɵgetSignalGraph(injector);
		if (!raw) return null;
		return {
			nodes: raw.nodes.map((n) => ({
				id: n.id,
				kind: n.kind ?? "unknown",
				label: n.label,
				epoch: n.epoch ?? 0,
				value: serializeValue(n.value),
				watched: n.watched ?? false
			})),
			edges: raw.edges ?? [],
			componentSelector: el.tagName.toLowerCase()
		};
	} catch {
		return null;
	}
}
function serializeValue(val) {
	if (val === void 0 || val === null) return val;
	if (typeof val === "function") return `[Function: ${val.name || "anonymous"}]`;
	if (typeof val === "symbol") return val.toString();
	if (typeof val === "bigint") return val.toString();
	if (typeof val === "object") try {
		return JSON.parse(JSON.stringify(val));
	} catch {
		return String(val);
	}
	return val;
}
function collectInjectorTree() {
	const ng = getNg();
	if (!ng?.getInjector || !ng?.ɵgetInjectorMetadata) return [];
	const roots = [];
	const visited = /* @__PURE__ */ new WeakSet();
	const componentEls = document.querySelectorAll("[ng-version], [_nghost-ng-c]");
	for (const el of componentEls) try {
		const injector = ng.getInjector(el);
		if (!injector || visited.has(injector)) continue;
		visited.add(injector);
		const node = serializeInjectorNode(ng, injector, el, visited);
		if (node) roots.push(node);
	} catch {}
	return roots;
}
function serializeInjectorNode(ng, injector, el, visited) {
	try {
		const metadata = ng.ɵgetInjectorMetadata?.(injector);
		if (!metadata) return null;
		const providers = getInjectorProvidersList(ng, injector);
		const children = [];
		for (const child of el.querySelectorAll(":scope > *")) try {
			const childInjector = ng.getInjector(child);
			if (!childInjector || visited.has(childInjector) || childInjector === injector) continue;
			visited.add(childInjector);
			const childNode = serializeInjectorNode(ng, childInjector, child, visited);
			if (childNode) children.push(childNode);
		} catch {}
		return {
			injector: {
				id: `inj-${el.tagName.toLowerCase()}-${Math.random().toString(36).slice(2, 8)}`,
				type: metadata.type ?? "unknown",
				name: metadata.type === "element" ? el.tagName.toLowerCase() : metadata.source?.toString?.() ?? "Environment",
				providerCount: providers.length
			},
			providers,
			children
		};
	} catch {
		return null;
	}
}
function getInjectorProvidersList(ng, injector) {
	if (!ng.ɵgetInjectorProviders) return [];
	try {
		return (ng.ɵgetInjectorProviders(injector) ?? []).map((p) => ({
			token: p.token?.name ?? p.token?.toString?.() ?? "unknown",
			type: inferProviderType(p),
			isViewProvider: p.isViewProvider ?? false
		}));
	} catch {
		return [];
	}
}
function inferProviderType(p) {
	if (p.useClass) return "class";
	if (p.useValue !== void 0) return "value";
	if (p.useFactory) return "factory";
	if (p.useExisting) return "existing";
	return "class";
}
const ngrxActionLog = [];
const MAX_ACTION_LOG = 50;
let reduxDevToolsSubscribed = false;
function collectNgrxState() {
	const win = window;
	if (!reduxDevToolsSubscribed) subscribeToReduxDevTools();
	const storeState = getNgrxStoreState();
	if (storeState !== void 0) return {
		state: storeState,
		actions: ngrxActionLog.slice(),
		connected: true
	};
	if (ngrxActionLog.length > 0) return {
		state: win.__NGRX_DEVTOOLS_LAST_STATE__ ?? null,
		actions: ngrxActionLog.slice(),
		connected: true
	};
	return null;
}
function getNgrxStoreState() {
	const ng = getNg();
	if (!ng?.getInjector) return void 0;
	const roots = document.querySelectorAll("[ng-version], [_nghost-ng-c]");
	for (const root of roots) try {
		const injector = ng.getInjector(root);
		if (!injector) continue;
		const allProviders = ng.ɵgetInjectorProviders?.(injector) ?? [];
		for (const p of allProviders) {
			const token = p.token;
			if (!token) continue;
			if ((token.name ?? token.toString?.() ?? "") === "Store") try {
				const store = injector.get(token);
				if (!store || typeof store.subscribe !== "function") continue;
				let snapshot;
				store.subscribe((val) => {
					snapshot = val;
				}).unsubscribe();
				if (snapshot !== void 0) return safeSerialize(snapshot);
			} catch {}
		}
	} catch {}
}
function subscribeToReduxDevTools() {
	const win = window;
	const ext = win.__REDUX_DEVTOOLS_EXTENSION__;
	if (!ext) return;
	reduxDevToolsSubscribed = true;
	const originalConnect = ext.connect?.bind(ext);
	if (originalConnect) ext.connect = function(...args) {
		const connection = originalConnect(...args);
		const originalSend = connection.send?.bind(connection);
		if (originalSend) connection.send = function(action, state) {
			captureAction(action);
			win.__NGRX_DEVTOOLS_LAST_STATE__ = safeSerialize(state);
			return originalSend(action, state);
		};
		const originalInit = connection.init?.bind(connection);
		if (originalInit) connection.init = function(state) {
			win.__NGRX_DEVTOOLS_LAST_STATE__ = safeSerialize(state);
			return originalInit(state);
		};
		return connection;
	};
	if (typeof ext.subscribe === "function") try {
		ext.subscribe((message) => {
			try {
				if (message?.type === "ACTION" || message?.type === "DISPATCH") captureAction(message.payload);
				if (message?.state) win.__NGRX_DEVTOOLS_LAST_STATE__ = safeSerialize(typeof message.state === "string" ? JSON.parse(message.state) : message.state);
			} catch {}
		});
	} catch {}
}
function captureAction(action) {
	if (!action) return;
	const entry = {
		type: action.type ?? String(action),
		payload: safeSerialize(action.payload ?? action),
		timestamp: Date.now()
	};
	ngrxActionLog.push(entry);
	if (ngrxActionLog.length > MAX_ACTION_LOG) ngrxActionLog.splice(0, ngrxActionLog.length - MAX_ACTION_LOG);
}
function safeSerialize(val) {
	if (val === void 0 || val === null) return val;
	try {
		return JSON.parse(JSON.stringify(val));
	} catch {
		return String(val);
	}
}
if (typeof document !== "undefined" && !(typeof process !== "undefined" && process.env?.["VITEST"])) {
	initOverlay().catch(console.error);
	import("./popup.mjs").then((m) => m.createDevtoolsPopup()).catch(console.error);
}
//#endregion
export { collectComponentTree, initOverlay, walkAngularTree };
