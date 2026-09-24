import { defineDevframe, defineRpcFunction } from "devframe";
import * as v from "valibot";
import { toStandardJsonSchema } from "@valibot/to-json-schema";
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
//#region src/rpc/agent-schema.ts
/**
* Attach a [Standard JSON Schema](https://standardschema.dev/) converter to a
* valibot schema.
*
* Devframe stays validator neutral: it describes an RPC `returns` schema with
* the validator's own converter, and valibot does not ship one by default.
* Without it devframe falls back to a permissive object schema and advertises
* that as the MCP `outputSchema`, so a tool returning an array fails every
* `tools/call` against the schema the server itself published.
*
* With the converter attached, an object return is described accurately, and
* an array return advertises no output schema at all, since MCP only allows an
* object there. Either way the response matches what was advertised.
*/
function describable(schema) {
	const described = {
		...schema,
		...toStandardJsonSchema(schema)
	};
	described["~standard"].jsonSchema.input({ target: "draft-2020-12" });
	return described;
}
//#endregion
//#region src/rpc/source-scan.ts
/**
* Index of the `/` that closes the regular expression starting at `start`, or
* `start` itself when this is a division rather than a literal.
*/
function skipRegex(source, start) {
	let inClass = false;
	for (let i = start + 1; i < source.length; i++) {
		const ch = source[i];
		if (ch === "\\") i++;
		else if (ch === "\n") return start;
		else if (ch === "[") inClass = true;
		else if (ch === "]") inClass = false;
		else if (ch === "/" && !inClass) return i;
	}
	return start;
}
/** Whether the `/` at `at` opens a regular expression rather than dividing. */
function startsRegex(source, at) {
	for (let i = at - 1; i >= 0; i--) {
		const ch = source[i];
		if (ch === " " || ch === "	" || ch === "\n" || ch === "\r") continue;
		return !/[\w$)\]]/.test(ch) || /(?:^|[^\w$.])(?:return|typeof|case|in|of|do|else)$/.test(source.slice(Math.max(0, i - 6), i + 1));
	}
	return true;
}
/**
* Index of the quote that closes the string starting at `start`, or `start`
* itself when there is none.
*
* Only a template literal may span lines, so a `'` or `"` left open at the end
* of its line is not a string at all. It is usually a quote inside a regular
* expression, as in `/['"]/`, and treating it as a string would blank out the
* rest of the file.
*/
function skipString(source, start) {
	const quote = source[start];
	for (let i = start + 1; i < source.length; i++) {
		const ch = source[i];
		if (ch === "\\") i++;
		else if (ch === quote) return i;
		else if (ch === "\n" && quote !== "`") return start;
	}
	return start;
}
/**
* Replace comments with whitespace, keeping every newline so line numbers and
* offsets still match the original file.
*/
function stripComments(source) {
	let out = "";
	for (let i = 0; i < source.length; i++) {
		const ch = source[i];
		if (source.startsWith("//", i)) {
			const end = source.indexOf("\n", i);
			const stop = end === -1 ? source.length : end;
			out += blank(source.slice(i, stop));
			i = stop - 1;
		} else if (source.startsWith("/*", i)) {
			const end = source.indexOf("*/", i + 2);
			if (end === -1) {
				out += ch;
				continue;
			}
			out += blank(source.slice(i, end + 2));
			i = end + 1;
		} else if (ch === "/" && startsRegex(source, i)) {
			const end = skipRegex(source, i);
			out += source.slice(i, end + 1);
			i = end;
		} else if (ch === "\"" || ch === "'" || ch === "`") {
			const end = skipString(source, i);
			if (end === i) {
				out += ch;
				continue;
			}
			out += source.slice(i, end + 1);
			i = end;
		} else out += ch;
	}
	return out;
}
/**
* Replace the contents of regular expression literals with spaces, keeping the
* delimiters and the length. A pattern is not code, so a call spelled out
* inside one, as in `/signalStore\(\)/`, must not be reported as a real
* declaration. Run it after `maskStrings`, so a `/` inside a string is gone.
*/
function maskRegexes(source) {
	let out = "";
	for (let i = 0; i < source.length; i++) {
		const ch = source[i];
		if (ch !== "/" || !startsRegex(source, i)) {
			out += ch;
			continue;
		}
		const end = skipRegex(source, i);
		if (end === i) {
			out += ch;
			continue;
		}
		out += ch + blank(source.slice(i + 1, end)) + source[end];
		i = end;
	}
	return out;
}
/**
* Replace the contents of string and template literals with spaces, keeping
* the quotes, the length and every newline. Use it before matching patterns
* that would otherwise fire on code quoted inside a template.
*/
function maskStrings(source) {
	let out = "";
	for (let i = 0; i < source.length; i++) {
		const ch = source[i];
		if (ch === "/" && startsRegex(source, i)) {
			const end = skipRegex(source, i);
			out += source.slice(i, end + 1);
			i = end;
		} else if (ch === "\"" || ch === "'" || ch === "`") {
			const end = skipString(source, i);
			if (end === i) {
				out += ch;
				continue;
			}
			out += ch + blank(source.slice(i + 1, end)) + (end < source.length ? source[end] : "");
			i = end;
		} else out += ch;
	}
	return out;
}
/**
* A reusable line lookup for one file. Scanning for newlines on every match is
* quadratic over a file; this walks it once and then binary searches.
*/
function lineCounter(source) {
	const starts = [0];
	for (let i = 0; i < source.length; i++) if (source[i] === "\n") starts.push(i + 1);
	return (index) => {
		let low = 0;
		let high = starts.length - 1;
		while (low < high) {
			const mid = low + high + 1 >> 1;
			if (starts[mid] <= index) low = mid;
			else high = mid - 1;
		}
		return low + 1;
	};
}
/** Same length as `text`, with every character but the newlines blanked out. */
function blank(text) {
	return text.replace(/[^\n]/g, " ");
}
/** A class body, with the selector of the decorator that precedes it. */
/**
* A single line type annotation between a member name and its `=`. A top level
* comma ends it, so `constructor(label: string, count = signal(0))` declares
* `count` rather than swallowing the parameter list into `label`'s annotation.
* Commas inside a generic argument list are still part of the annotation.
*/
const ANNOTATION = String.raw`(?::(?:[^=;\n,<]|=>|<[^;\n]*?>){0,120})?`;
const DECORATOR = /@(Component|Directive)\s*\(/g;
/**
* The span of every class in the file, each with the selector of the
* `@Component` or `@Directive` decorating it.
*/
function classScopes(code, source) {
	const scopes = [];
	const declaration = /\bclass\s+\w+/g;
	let previousEnd = 0;
	let match;
	while ((match = declaration.exec(code)) !== null) {
		const bodyStart = classBodyStart(code, match.index + match[0].length);
		if (bodyStart === -1) break;
		const end = matchDelimiter(code, bodyStart, "{", "}");
		scopes.push({
			start: match.index,
			end,
			...decoratorOf(code.slice(previousEnd, match.index), source.slice(previousEnd, match.index))
		});
		previousEnd = end;
		declaration.lastIndex = end;
	}
	return scopes;
}
/**
* The first `{` that opens the class body, skipping the braces a generic
* parameter list can hold, as in `class Panel<T extends { id: string }> {`.
*/
function classBodyStart(code, from) {
	let angle = 0;
	for (let i = from; i < code.length; i++) {
		const ch = code[i];
		if (ch === "/" && startsRegex(code, i)) i = skipRegex(code, i);
		else if (ch === "\"" || ch === "'" || ch === "`") i = skipString(code, i);
		else if (ch === "<") angle++;
		else if (ch === ">" && angle > 0) angle--;
		else if (ch === "{" && angle === 0) return i;
	}
	return -1;
}
/**
* The selector of the last `@Component`/`@Directive` decorator in `code`, read
* out of `source` at the same offsets. Both the decorator and the `selector`
* key are found in the masked copy, so neither a decorator nor a `selector:`
* written inside a template can be picked up, and only the value is read from
* the unmasked copy, where it survives.
*/
/**
* The `@Component` or `@Directive` that precedes a class, read once. Matching
* the decorator name with a word boundary keeps `@ComponentMeta()` from being
* taken for `@Component`, and returning its arguments here means no caller has
* to look the decorator up a second time and disagree about which one it is.
*/
function decoratorOf(code, source) {
	let open = -1;
	let kind;
	for (const match of code.matchAll(DECORATOR)) {
		open = match.index + match[0].length - 1;
		kind = match[1] === "Directive" ? "directive" : "component";
	}
	if (open === -1) return {};
	const close = matchDelimiter(code, open, "(", ")");
	const args = code.slice(open, close);
	const decoratorArgs = code.slice(open, close + 1);
	const key = /\bselector\s*:\s*['"`]/.exec(args);
	if (!key) return {
		kind,
		decoratorArgs
	};
	const quote = open + key.index + key[0].length - 1;
	return {
		component: source.slice(quote + 1, skipString(source, quote)),
		kind,
		decoratorArgs
	};
}
/** Index of the delimiter that closes the one at `open`. */
function matchDelimiter(source, open, start, end) {
	let depth = 0;
	for (let i = open; i < source.length; i++) {
		const ch = source[i];
		if (ch === "\"" || ch === "'" || ch === "`") i = skipString(source, i);
		else if (ch === "/" && i > open && startsRegex(source, i)) i = skipRegex(source, i);
		else if (ch === start) depth++;
		else if (ch === end && --depth === 0) return i;
	}
	return source.length;
}
/**
* The directories to scan for source files: every `sourceRoot` in
* `angular.json`, so a workspace with more than one project is covered, and
* `src` for a project without one. Falls back to the working directory.
*/
function sourceRoots(cwd) {
	const roots = [];
	try {
		const projects = JSON.parse(parseJsonc(readFileSync(join(cwd, "angular.json"), "utf-8")))?.projects;
		for (const project of Object.values(projects ?? {})) {
			if (!project || typeof project !== "object") continue;
			const entry = project;
			const root = entry["sourceRoot"] ?? join(String(entry["root"] ?? ""), "src");
			if (typeof root === "string" && root) roots.push(resolve(cwd, root));
		}
	} catch {}
	const declared = new Set(roots);
	roots.push(join(cwd, "src"));
	const root = realPath(cwd);
	const seen = /* @__PURE__ */ new Set();
	const realOf = /* @__PURE__ */ new Map();
	const usable = [...new Set(roots)].filter((dir) => {
		const real = realPath(dir);
		if (seen.has(real)) return false;
		const inside = relative(root, real);
		if (!inside || escapes(inside) || isAbsolute(inside)) return false;
		const refused = declared.has(dir) ? DEPENDENCY_DIRS : IGNORED_DIRS;
		if (inside.split(/[\\/]/).some((part) => refused.has(part.toLowerCase()))) return false;
		try {
			if (!statSync(real).isDirectory()) return false;
		} catch {
			return false;
		}
		seen.add(real);
		realOf.set(dir, real);
		return true;
	});
	const kept = [];
	let cover;
	const order = usable.map((dir) => ({
		dir,
		real: realOf.get(dir) ?? dir
	})).sort((a, b) => a.real + sep < b.real + sep ? -1 : a.real === b.real ? 0 : 1);
	for (const { dir, real } of order) {
		if (cover !== void 0 && !escapes(relative(cover, real))) {
			if (!relative(cover, real).split(/[\\/]/).some((part) => IGNORED_DIRS.has(part.toLowerCase()))) continue;
			kept.push(dir);
			continue;
		}
		kept.push(dir);
		cover = real;
	}
	return kept;
}
/** Directories holding third-party code, never scanned even when declared. */
const DEPENDENCY_DIRS = /* @__PURE__ */ new Set([
	"node_modules",
	".git",
	".yarn"
]);
/** Directories that never hold project source. */
const IGNORED_DIRS = /* @__PURE__ */ new Set([
	"node_modules",
	"dist",
	"build",
	"out-tsc",
	"coverage",
	"tmp",
	".angular",
	".git",
	".nx",
	".cache",
	".turbo",
	".yarn"
]);
/**
* JSONC as plain JSON: comments gone and trailing commas dropped. The commas
* are located in a masked copy, so a `,}` inside a path stays untouched.
*/
function parseJsonc(source) {
	const text = stripComments(source);
	const masked = maskStrings(text);
	const trailing = /,(\s*[}\]])/g;
	let out = "";
	let last = 0;
	let match;
	while ((match = trailing.exec(masked)) !== null) {
		out += text.slice(last, match.index);
		last = match.index + 1;
	}
	return out + text.slice(last);
}
/**
* Whether a relative path leaves its base. A plain `startsWith('..')` also
* matches a child named `..foo`, which does not.
*/
function escapes(rel) {
	return rel === ".." || rel.startsWith(".." + sep);
}
/** The path with symlinks resolved, or the path itself when it does not exist. */
function realPath(path) {
	try {
		return realpathSync(path);
	} catch {
		return path;
	}
}
//#endregion
//#region src/rpc/get-routes.ts
const RouteSchema = v.object({
	path: v.string(),
	component: v.optional(v.string()),
	hasChildren: v.boolean(),
	file: v.string()
});
const getRoutes = defineRpcFunction({
	name: "get-routes",
	type: "query",
	jsonSerializable: true,
	args: [],
	returns: describable(v.array(RouteSchema)),
	agent: {
		description: "List Angular routes extracted from route configuration files in the workspace. Call before suggesting navigation changes or analyzing the app structure.",
		title: "List Angular routes"
	},
	setup: (ctx) => ({ handler: async () => extractRoutes(ctx.cwd) })
});
function extractRoutes(cwd) {
	const routes = [];
	for (const root of sourceRoots(cwd)) findRouteFiles(root, cwd, routes);
	return routes;
}
function findRouteFiles(dir, cwd, routes) {
	let entries;
	try {
		entries = readdirSync(dir);
	} catch {
		return;
	}
	for (const entry of entries) {
		const full = join(dir, entry);
		try {
			const stats = lstatSync(full);
			if (stats.isSymbolicLink()) continue;
			if (stats.isDirectory()) {
				if (!IGNORED_DIRS.has(entry.toLowerCase())) findRouteFiles(full, cwd, routes);
				continue;
			}
		} catch {
			continue;
		}
		if (!entry.match(/\.routes\.ts$|routing\.module\.ts$/)) continue;
		try {
			const content = readFileSync(full, "utf-8");
			const relPath = relative(cwd, full);
			for (const body of objectLiterals(stripComments(content))) {
				const props = topLevelProps(body);
				const path = props.get("path")?.match(/^['"`]([^'"`]*)['"`]$/)?.[1];
				if (path === void 0) continue;
				routes.push({
					path,
					component: routeComponent(props),
					hasChildren: props.has("children") || props.has("loadChildren"),
					file: relPath
				});
			}
		} catch {}
	}
}
function routeComponent(props) {
	const eager = props.get("component")?.match(/^(\w+)/)?.[1];
	if (eager) return eager;
	return props.get("loadComponent")?.match(/\.then\(\s*\(?\s*(\w+)\s*\)?\s*=>\s*\1\.(\w+)/)?.[2];
}
const ROUTE_ARRAY = /(?:\bchildren\s*:|\b(?:provideRouter|forRoot|forChild)\s*\()\s*$/;
function objectLiterals(source) {
	const spans = [];
	const open = [];
	for (let i = 0; i < source.length; i++) {
		const ch = source[i];
		if (ch === "/" && startsRegex(source, i)) i = skipRegex(source, i);
		else if (ch === "\"" || ch === "'" || ch === "`") i = skipString(source, i);
		else if ("([{".includes(ch)) {
			const parent = open.at(-1);
			open.push({
				ch,
				at: i,
				routeArray: ch === "[" && (!parent || ROUTE_ARRAY.test(source.slice(Math.max(0, i - 64), i))),
				routeObject: ch === "{" && parent?.ch === "[" && parent.routeArray
			});
		} else if (")]}".includes(ch)) {
			const closed = open.pop();
			if (ch === "}" && closed?.routeObject) spans.push([closed.at, i]);
		}
	}
	return spans.sort((a, b) => a[0] - b[0]).map(([start, end]) => source.slice(start + 1, end));
}
function topLevelProps(body) {
	const props = /* @__PURE__ */ new Map();
	const add = (text) => {
		const prop = text.match(/^\s*(\w+)\s*:\s*([\s\S]*?)\s*$/);
		if (prop) props.set(prop[1], prop[2]);
	};
	let depth = 0;
	let start = 0;
	for (let i = 0; i < body.length; i++) {
		const ch = body[i];
		if (ch === "/" && startsRegex(body, i)) i = skipRegex(body, i);
		else if (ch === "\"" || ch === "'" || ch === "`") i = skipString(body, i);
		else if ("([{".includes(ch)) depth++;
		else if (")]}".includes(ch)) depth--;
		else if (ch === "," && depth === 0) {
			add(body.slice(start, i));
			start = i + 1;
		}
	}
	add(body.slice(start));
	return props;
}
//#endregion
//#region src/rpc/get-components.ts
const ComponentSchema = v.object({
	selector: v.string(),
	kind: v.string(),
	file: v.string(),
	inputs: v.array(v.string()),
	outputs: v.array(v.string()),
	isStandalone: v.boolean()
});
const getComponents = defineRpcFunction({
	name: "get-components",
	type: "query",
	jsonSerializable: true,
	args: [],
	returns: describable(v.array(ComponentSchema)),
	agent: {
		description: "Discover Angular components and directives by scanning source files for @Component and @Directive decorators. Returns each selector with its kind, inputs, outputs, and file path. Call this to understand the component architecture.",
		title: "List Angular components"
	},
	setup: (ctx) => ({ handler: async () => scanComponents(ctx.cwd) })
});
function scanComponents(cwd) {
	const components = [];
	for (const root of sourceRoots(cwd)) walk$3(root, cwd, components);
	return components;
}
function walk$3(dir, cwd, out) {
	let entries;
	try {
		entries = readdirSync(dir);
	} catch {
		return;
	}
	for (const entry of entries) {
		const full = join(dir, entry);
		try {
			const stats = lstatSync(full);
			if (stats.isSymbolicLink()) continue;
			if (stats.isDirectory()) {
				if (!IGNORED_DIRS.has(entry.toLowerCase())) walk$3(full, cwd, out);
				continue;
			}
		} catch {
			continue;
		}
		if (!entry.endsWith(".ts") || entry.endsWith(".spec.ts")) continue;
		try {
			out.push(...componentsIn(readFileSync(full, "utf-8"), relative(cwd, full)));
		} catch {}
	}
}
function componentsIn(content, relPath) {
	const source = stripComments(content);
	const code = maskStrings(source);
	const components = [];
	classScopes(code, source).forEach((scope) => {
		if (!scope.component) return;
		const body = code.slice(scope.start, scope.end);
		components.push({
			selector: scope.component,
			kind: scope.kind ?? "component",
			file: relPath,
			inputs: [...names(body, INPUT), ...names(body, INPUT_DECORATOR)],
			outputs: [...names(body, OUTPUT), ...names(body, OUTPUT_DECORATOR)],
			isStandalone: !/\bstandalone\s*:\s*false\b/.test(scope.decoratorArgs ?? "")
		});
	});
	return components;
}
function names(body, pattern) {
	pattern.lastIndex = 0;
	return [...body.matchAll(pattern)].map((match) => match[1]);
}
const INPUT = new RegExp(String.raw`(?<![\w$#.])(?:this\.)?(#?[$\w]+)\s*` + ANNOTATION + String.raw`=\s*(?:input|model)(?:\.required)?\s*[<(]`, "g");
const OUTPUT = new RegExp(String.raw`(?<![\w$#.])(?:this\.)?(#?[$\w]+)\s*` + ANNOTATION + String.raw`=\s*output\s*[<(]`, "g");
const MEMBER_PREFIX = String.raw`(?:(?:readonly|public|private|protected|override|declare|static|abstract|get|set|async)\s+)*`;
const INPUT_DECORATOR = new RegExp(String.raw`@Input\([^)]*\)\s+` + MEMBER_PREFIX + String.raw`([$\w]+)`, "g");
const OUTPUT_DECORATOR = new RegExp(String.raw`@Output\([^)]*\)\s+` + MEMBER_PREFIX + String.raw`([$\w]+)`, "g");
//#endregion
//#region src/rpc/build-meta.ts
const BuildMetaSchema = v.object({
	angularVersion: v.string(),
	projectName: v.string(),
	typescript: v.string(),
	ssr: v.boolean(),
	builtAt: v.number()
});
const getBuildMeta = defineRpcFunction({
	name: "build-meta",
	type: "static",
	jsonSerializable: true,
	snapshot: true,
	args: [],
	returns: describable(BuildMetaSchema),
	agent: {
		description: "Angular project metadata: framework version, TypeScript version, SSR status. Baked into static builds. Call this before suggesting dependency or config changes.",
		title: "Angular build metadata"
	},
	setup: (ctx) => ({ handler: async () => {
		const pkg = readJson(join(ctx.cwd, "package.json"));
		const angularJson = readJson(join(ctx.cwd, "angular.json"));
		const deps = {
			...pkg["dependencies"],
			...pkg["devDependencies"]
		};
		const angularVersion = (deps["@angular/core"] ?? "unknown").replace(/^\^|~/, "");
		const typescript = (deps["typescript"] ?? "unknown").replace(/^\^|~/, "");
		const defaultProject = angularJson?.["defaultProject"] ?? Object.keys(angularJson?.["projects"] ?? {})[0] ?? pkg["name"] ?? "unknown";
		const projectConfig = angularJson?.["projects"]?.[defaultProject];
		return {
			angularVersion,
			projectName: defaultProject,
			typescript,
			ssr: !!(projectConfig?.architect?.build?.options?.ssr || projectConfig?.architect?.build?.options?.server),
			builtAt: Date.now()
		};
	} })
});
function readJson(path) {
	try {
		if (!existsSync(path)) return {};
		return JSON.parse(readFileSync(path, "utf-8"));
	} catch {
		return {};
	}
}
//#endregion
//#region src/rpc/get-signals.ts
const SignalEntrySchema = v.object({
	name: v.string(),
	kind: v.string(),
	file: v.string(),
	line: v.number(),
	component: v.optional(v.string())
});
const getSignals = defineRpcFunction({
	name: "get-signals",
	type: "query",
	jsonSerializable: true,
	args: [],
	returns: describable(v.array(SignalEntrySchema)),
	agent: {
		description: "Scan source files for signal(), computed(), linkedSignal(), and effect() declarations. Returns name, kind, file, and line number. Call this to understand the reactive architecture before suggesting changes.",
		title: "List Angular signals from source"
	},
	setup: (ctx) => ({ handler: async () => scanSignals(ctx.cwd) })
});
const KINDS = {
	signal: "signal",
	computed: "computed",
	linkedSignal: "linkedSignal",
	effect: "effect",
	resource: "resource",
	input: "input (signal)",
	output: "output (signal)",
	model: "model (signal)",
	viewChild: "viewChild (signal)",
	viewChildren: "viewChildren (signal)",
	contentChild: "contentChild (signal)",
	contentChildren: "contentChildren (signal)"
};
const SIGNAL_CALL = new RegExp(String.raw`(?<![\w$#.])(?:this\.)?(#?[$\w]+)\s*` + ANNOTATION + String.raw`=\s*(${Object.keys(KINDS).join("|")})(\.required)?\s*[<(]`, "g");
function scanSignals(cwd) {
	const entries = [];
	for (const root of sourceRoots(cwd)) walk$2(root, cwd, entries);
	return entries;
}
function walk$2(dir, cwd, out) {
	let items;
	try {
		items = readdirSync(dir);
	} catch {
		return;
	}
	for (const item of items) {
		const full = join(dir, item);
		try {
			const stats = lstatSync(full);
			if (stats.isSymbolicLink()) continue;
			if (stats.isDirectory()) {
				if (!IGNORED_DIRS.has(item.toLowerCase())) walk$2(full, cwd, out);
				continue;
			}
		} catch {
			continue;
		}
		if (!item.endsWith(".ts") || item.endsWith(".spec.ts") || item.endsWith(".d.ts")) continue;
		try {
			out.push(...signalsIn(readFileSync(full, "utf-8"), relative(cwd, full)));
		} catch {}
	}
}
function signalsIn(content, relPath) {
	const source = stripComments(content);
	const code = maskStrings(source);
	const scopes = classScopes(code, source);
	const lineAt = lineCounter(code);
	const entries = [];
	SIGNAL_CALL.lastIndex = 0;
	let match;
	while ((match = SIGNAL_CALL.exec(code)) !== null) {
		const at = match.index;
		const [, name, fn, required] = match;
		entries.push({
			name,
			kind: required ? `${fn}.required (signal)` : KINDS[fn],
			file: relPath,
			line: lineAt(at),
			component: scopes.find((scope) => at >= scope.start && at < scope.end)?.component
		});
	}
	return entries;
}
//#endregion
//#region src/rpc/get-providers.ts
const ProviderEntrySchema = v.object({
	token: v.string(),
	source: v.string(),
	file: v.string(),
	line: v.number(),
	providedIn: v.optional(v.string()),
	type: v.string()
});
const getProviders = defineRpcFunction({
	name: "get-providers",
	type: "query",
	jsonSerializable: true,
	args: [],
	returns: describable(v.array(ProviderEntrySchema)),
	agent: {
		description: "Scan source files for DI providers: @Injectable services, inject() calls, and providers arrays. Returns token, file, and where it is provided. Call this to understand the DI architecture.",
		title: "List Angular DI providers from source"
	},
	setup: (ctx) => ({ handler: async () => scanProviders(ctx.cwd) })
});
const DECORATOR_KEYWORDS = /* @__PURE__ */ new Set([
	"Component",
	"NgModule",
	"Injectable",
	"Directive",
	"Pipe",
	"Service",
	"Input",
	"Output",
	"Inject",
	"Optional",
	"Self",
	"SkipSelf",
	"Host"
]);
const PROVIDE_FN_TO_TOKEN = {
	provideHttpClient: "HttpClient",
	provideRouter: "Router",
	provideAnimations: "AnimationDriver",
	provideAnimationsAsync: "AnimationDriver",
	provideClientHydration: "ClientHydration",
	provideZoneChangeDetection: "NgZone",
	provideZonelessChangeDetection: "ChangeDetection (zoneless)",
	provideExperimentalZonelessChangeDetection: "ChangeDetection (zoneless)",
	provideBrowserGlobalErrorListeners: "ErrorHandler",
	provideServiceWorker: "ServiceWorker",
	provideCheckNoChangesConfig: "CheckNoChanges",
	provideExperimentalCheckNoChanges: "CheckNoChanges",
	providePlatformInitializer: "PlatformInitializer",
	provideAppInitializer: "AppInitializer",
	provideEnvironmentInitializer: "EnvironmentInitializer"
};
function scanProviders(cwd) {
	const entries = [];
	for (const root of sourceRoots(cwd)) walk$1(root, cwd, entries);
	return entries;
}
function walk$1(dir, cwd, out) {
	let items;
	try {
		items = readdirSync(dir);
	} catch {
		return;
	}
	for (const item of items) {
		const full = join(dir, item);
		try {
			const stats = lstatSync(full);
			if (stats.isSymbolicLink()) continue;
			if (stats.isDirectory()) {
				if (!IGNORED_DIRS.has(item.toLowerCase())) walk$1(full, cwd, out);
				continue;
			}
		} catch {
			continue;
		}
		if (!item.endsWith(".ts") || item.endsWith(".spec.ts") || item.endsWith(".d.ts")) continue;
		try {
			const source = stripComments(readFileSync(full, "utf-8"));
			const code = maskRegexes(maskStrings(source));
			const relPath = relative(cwd, full);
			const lineAt = lineCounter(code);
			for (const decorator of code.matchAll(/@(Injectable|Service)\b/g)) {
				const at = decorator.index;
				let after = at + decorator[0].length;
				let args = "";
				const parenAt = code.indexOf("(", after);
				if (parenAt !== -1 && code.slice(after, parenAt).trim() === "") {
					const close = matchDelimiter(code, parenAt, "(", ")");
					args = source.slice(parenAt, close + 1);
					after = close + 1;
				}
				DECLARATION.lastIndex = skipDecorators(code, after);
				const declaration = DECLARATION.exec(code);
				if (!declaration) continue;
				const isService = decorator[1] === "Service";
				out.push({
					token: declaration[1],
					source: "class",
					file: relPath,
					line: lineAt(at),
					providedIn: /providedIn\s*:\s*(?:['"`](\w+)['"`]|([A-Za-z_$][\w$]*))/.exec(args)?.slice(1).find(Boolean) ?? (isService ? "root" : void 0),
					type: "injectable"
				});
			}
			for (const match of code.matchAll(/(?<![\w$])(?:(?:private|protected|public|readonly)\s+)*(\w+)\s*=\s*inject\s*(?:<[^>]*>)?\s*\(\s*(\w+)/g)) out.push({
				token: match[2],
				source: match[1],
				file: relPath,
				line: lineAt(match.index),
				type: "injection"
			});
			for (const match of code.matchAll(/@Inject\(\s*(\w+)\s*\)\s*(?:private|protected|public|readonly|\s)*(\w+)/g)) out.push({
				token: match[1],
				source: match[2],
				file: relPath,
				line: lineAt(match.index),
				type: "injection"
			});
			for (const match of code.matchAll(/\b(provide\w+)\s*\(/g)) {
				const fnName = match[1];
				const token = PROVIDE_FN_TO_TOKEN[fnName];
				if (token) out.push({
					token,
					source: fnName + "()",
					file: relPath,
					line: lineAt(match.index),
					providedIn: "root",
					type: "root-provider"
				});
			}
			for (const providersMatch of code.matchAll(/providers\s*:\s*\[/g)) {
				const openAt = providersMatch.index + providersMatch[0].lastIndexOf("[");
				const blockStart = openAt + 1;
				const block = code.slice(blockStart, matchDelimiter(code, openAt, "[", "]"));
				for (const tokenMatch of block.matchAll(/\b([A-Z]\w+)\b/g)) {
					const token = tokenMatch[1];
					if (DECORATOR_KEYWORDS.has(token)) continue;
					out.push({
						token,
						source: "providers array",
						file: relPath,
						line: lineAt(blockStart + tokenMatch.index),
						type: "provider"
					});
				}
			}
		} catch {}
	}
}
/**
* Past any further decorators on the same declaration. TypeScript allows more
* than one, and the sticky `DECLARATION` match would otherwise stop at the
* first of them and miss the class.
*/
function skipDecorators(code, from) {
	let at = from;
	for (;;) {
		const next = /\S/.exec(code.slice(at));
		if (!next || code[at + next.index] !== "@") return at;
		const nameEnd = at + next.index + 1 + (/^[\w$]*/.exec(code.slice(at + next.index + 1))?.[0].length ?? 0);
		const paren = /\S/.exec(code.slice(nameEnd));
		if (paren && code[nameEnd + paren.index] === "(") at = matchDelimiter(code, nameEnd + paren.index, "(", ")") + 1;
		else at = nameEnd;
	}
}
/** Sticky, so the class after a decorator is found however far it sits. */
const DECLARATION = /\s*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+(\w+)/y;
//#endregion
//#region src/rpc/get-ngrx-store.ts
const NgrxStoreEntrySchema = v.object({
	name: v.string(),
	kind: v.picklist([
		"action",
		"reducer",
		"effect",
		"selector",
		"feature",
		"store-setup",
		"signal-store",
		"signal-state",
		"signal-method"
	]),
	file: v.string(),
	line: v.number(),
	detail: v.optional(v.string())
});
const getNgrxStore = defineRpcFunction({
	name: "get-ngrx-store",
	type: "query",
	jsonSerializable: true,
	args: [],
	returns: describable(v.array(NgrxStoreEntrySchema)),
	agent: {
		description: "Scan source files for NgRx store patterns: actions, reducers, effects, selectors, features, and store setup. Returns name, kind, file, and line number. Call this to understand the NgRx state management architecture.",
		title: "List NgRx store entries from source"
	},
	setup: (ctx) => ({ handler: async () => scanNgrxStore(ctx.cwd) })
});
const NGRX_PATTERNS = [
	{
		pattern: /export\s+const\s+(\w+)\s*=\s*createAction\s*\(/g,
		kind: "action"
	},
	{
		pattern: /(\w+)\s*=\s*createActionGroup\s*\(/g,
		kind: "action"
	},
	{
		pattern: /export\s+const\s+(\w+)\s*=\s*createReducer\s*\(/g,
		kind: "reducer"
	},
	{
		pattern: /([\w$]+)\s*=\s*createEffect\s*\(/g,
		kind: "effect"
	},
	{
		pattern: /export\s+const\s+(\w+)\s*=\s*createSelector\s*\(/g,
		kind: "selector"
	},
	{
		pattern: /export\s+const\s+(\w+)\s*=\s*createFeatureSelector\s*[<(]/g,
		kind: "selector"
	},
	{
		pattern: /export\s+const\s+(\w+)\s*=\s*createFeature\s*\(/g,
		kind: "feature"
	},
	{
		pattern: /(provideStore)\s*\(/g,
		kind: "store-setup"
	},
	{
		pattern: /(provideState)\s*\(/g,
		kind: "store-setup"
	},
	{
		pattern: /(provideEffects)\s*\(/g,
		kind: "store-setup"
	},
	{
		pattern: /StoreModule\.(forRoot|forFeature)\s*\(/g,
		kind: "store-setup"
	},
	{
		pattern: /EffectsModule\.(forRoot|forFeature)\s*\(/g,
		kind: "store-setup"
	},
	{
		pattern: /(?:export\s+)?const\s+(\w+)\s*=\s*signalStore\s*\(/g,
		kind: "signal-store"
	},
	{
		pattern: /(?:export\s+)?const\s+(\w+)\s*=\s*signalState\s*[<(]/g,
		kind: "signal-state"
	},
	{
		pattern: /export\s+const\s+(\w+)\s*=\s*signalMethod\s*[<(]/g,
		kind: "signal-method"
	},
	{
		pattern: /(\w+)\s*:\s*signalMethod\s*[<(]/g,
		kind: "signal-method"
	}
];
function scanNgrxStore(cwd) {
	const entries = [];
	for (const root of sourceRoots(cwd)) walk(root, cwd, entries);
	const seen = /* @__PURE__ */ new Set();
	return entries.filter((e) => {
		const key = `${e.name}:${e.file}:${e.line}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function walk(dir, cwd, out) {
	let items;
	try {
		items = readdirSync(dir);
	} catch {
		return;
	}
	for (const item of items) {
		const full = join(dir, item);
		try {
			const stats = lstatSync(full);
			if (stats.isSymbolicLink()) continue;
			if (stats.isDirectory()) {
				if (!IGNORED_DIRS.has(item.toLowerCase())) walk(full, cwd, out);
				continue;
			}
		} catch {
			continue;
		}
		if (!item.endsWith(".ts") || item.endsWith(".spec.ts") || item.endsWith(".d.ts")) continue;
		try {
			const raw = readFileSync(full, "utf-8");
			if (!raw.includes("@ngrx/") && !raw.includes("createAction") && !raw.includes("createReducer") && !raw.includes("createEffect") && !raw.includes("createSelector") && !raw.includes("createFeature") && !raw.includes("signalStore") && !raw.includes("signalState")) continue;
			const content = maskRegexes(maskStrings(stripComments(raw)));
			const lineAt = lineCounter(content);
			const relPath = relative(cwd, full);
			for (const { pattern, kind } of NGRX_PATTERNS) {
				pattern.lastIndex = 0;
				let match;
				while ((match = pattern.exec(content)) !== null) {
					const lineNum = lineAt(match.index);
					const name = match[1];
					const displayName = kind === "store-setup" && (match[0].includes("StoreModule") || match[0].includes("EffectsModule")) ? match[0].replace(/\s*\($/, "") : name;
					out.push({
						name: displayName,
						kind,
						file: relPath,
						line: lineNum
					});
				}
			}
		} catch {}
	}
}
//#endregion
//#region package.json
var name = "@santoshyadavdev/ng-devtools";
var version = "0.0.1";
//#endregion
//#region src/devframe.ts
const clientAssets = {
	package: name,
	version,
	path: "dist/public"
};
const ngDevtools = defineDevframe({
	id: "ng-devtools",
	name: "Angular DevTools",
	version,
	packageName: name,
	description: "Inspect Angular component trees, signals, and routes at dev and build time.",
	homepage: "https://github.com/santoshyadavdev/angular-devtools",
	icon: "ph:angular-logo-duotone",
	importMetaUrl: import.meta.url,
	clientAssets,
	async setup(ctx) {
		const my = ctx.scope("ng-devtools");
		my.rpc.register(getRoutes);
		my.rpc.register(getComponents);
		my.rpc.register(getSignals);
		my.rpc.register(getProviders);
		my.rpc.register(getNgrxStore);
		my.rpc.register(getBuildMeta);
		const componentTree = await my.rpc.sharedState("component-tree", { initialValue: {
			nodes: [],
			selectedId: null,
			highlightedId: null
		} });
		await my.rpc.sharedState("routes", { initialValue: {
			routes: [],
			activeRoute: null
		} });
		const signalGraphState = await my.rpc.sharedState("signal-graph", { initialValue: {
			graph: null,
			selectedNodeId: null
		} });
		const injectorTreeState = await my.rpc.sharedState("injector-tree", { initialValue: {
			roots: [],
			selectedInjectorId: null
		} });
		const ngrxStoreState = await my.rpc.sharedState("ngrx-store", { initialValue: {
			state: null,
			actions: [],
			connected: false
		} });
		my.rpc.register({
			name: "push-component-tree",
			type: "action",
			jsonSerializable: true,
			handler: (nodes) => {
				componentTree.mutate((draft) => {
					draft.nodes = nodes;
				});
			}
		});
		my.rpc.register({
			name: "select-component",
			type: "action",
			jsonSerializable: true,
			handler: (id) => {
				componentTree.mutate((draft) => {
					draft.selectedId = id;
				});
			}
		});
		my.rpc.register({
			name: "push-signal-graph",
			type: "action",
			jsonSerializable: true,
			handler: (graph) => {
				signalGraphState.mutate((draft) => {
					draft.graph = graph;
				});
			}
		});
		my.rpc.register({
			name: "push-injector-tree",
			type: "action",
			jsonSerializable: true,
			handler: (roots) => {
				injectorTreeState.mutate((draft) => {
					draft.roots = roots;
				});
			}
		});
		my.rpc.register({
			name: "push-ngrx-state",
			type: "action",
			jsonSerializable: true,
			handler: (data) => {
				ngrxStoreState.mutate((draft) => {
					draft.state = data.state;
					draft.actions = data.actions;
					draft.connected = data.connected;
				});
			}
		});
		ctx.agent.registerResource({
			id: "ng-devtools:component-tree",
			name: "Angular Component Tree",
			description: "Component hierarchy last reported by a connected page, as JSON. Empty when no page is connected.",
			mimeType: "application/json",
			read: () => ({ text: JSON.stringify(componentTree.value(), null, 2) })
		});
		ctx.agent.registerResource({
			id: "ng-devtools:signal-graph",
			name: "Angular Signal Graph",
			description: "Live signal dependency graph: nodes (signal, computed, effect, linkedSignal) and edges (producer→consumer). Read this to understand reactive data flow.",
			mimeType: "application/json",
			read: () => ({ text: JSON.stringify(signalGraphState.value(), null, 2) })
		});
		ctx.agent.registerResource({
			id: "ng-devtools:injector-tree",
			name: "Angular Injector Tree",
			description: "DI injector hierarchy last reported by a connected page, with providers at each level. Empty when no page is connected.",
			mimeType: "application/json",
			read: () => ({ text: JSON.stringify(injectorTreeState.value(), null, 2) })
		});
		ctx.agent.registerResource({
			id: "ng-devtools:ngrx-store",
			name: "NgRx Store State",
			description: "NgRx store state and recent actions last reported by a connected page. Empty when no page is connected.",
			mimeType: "application/json",
			read: () => ({ text: JSON.stringify(ngrxStoreState.value(), null, 2) })
		});
		ctx.agent.registerTool({
			id: "ng-devtools:highlight",
			description: "Highlight a component in the running Angular app by its selector.",
			safety: "action",
			inputSchema: {
				type: "object",
				properties: { selector: {
					type: "string",
					description: "CSS selector of the component to highlight, e.g. app-root."
				} },
				required: ["selector"]
			},
			handler: async (args) => {
				if (!componentTree.value().nodes.length) return { markdown: `No component tree has been reported, so nothing was highlighted. This is what a page that has never connected reports, and also what a connected page reports when its components are not readable. Live data needs a page: connect through the MCP endpoint of the server that runs the app, with the app open in a browser. The stdio server has no page attached and only ever reports this.` };
				await ctx.rpc.invokeLocal("ng-devtools:select-component", args.selector);
				my.rpc.broadcast({
					method: "highlight-in-page",
					args: [args.selector],
					optional: true
				});
				return { markdown: `Sent a highlight request for \`${args.selector}\`. It only shows if the selector matches an element on the page.` };
			}
		});
		ctx.agent.registerTool({
			id: "ng-devtools:inspect-signals",
			description: "Get the signal graph the running page last reported: signal nodes (signal, computed, linkedSignal, effect) and their dependency edges. The page reports one graph, for its root component, so a selector that does not match it returns what is available instead.",
			safety: "read",
			inputSchema: {
				type: "object",
				properties: { selector: {
					type: "string",
					description: "CSS selector of the component to inspect, e.g. app-root."
				} },
				required: ["selector"]
			},
			handler: async (args) => {
				const graph = signalGraphState.value().graph;
				if (!graph) return { markdown: `No signal graph available. Live data needs a page: connect through the MCP endpoint of the server that runs the app, with the app open in a browser. The stdio server has no page attached and only ever reports this.` };
				const json = JSON.stringify(graph, null, 2);
				if (graph.componentSelector && graph.componentSelector !== args.selector) return { markdown: `No signal graph for \`${args.selector}\`. The live graph covers \`${graph.componentSelector}\`:\n\n${json}` };
				return { markdown: json };
			}
		});
		ctx.agent.registerTool({
			id: "ng-devtools:inspect-providers",
			description: "Get the DI injector hierarchy the running page last reported, with the providers at each level. The page reports the whole tree rather than one component, so the selector only labels the answer.",
			safety: "read",
			inputSchema: {
				type: "object",
				properties: { selector: {
					type: "string",
					description: "Optional CSS selector, e.g. app-root. It only labels the answer: the page reports the whole tree either way."
				} }
			},
			handler: async (args) => {
				const roots = injectorTreeState.value().roots;
				if (!roots.length) return { markdown: `No injector data available. Live data needs a page: connect through the MCP endpoint of the server that runs the app, with the app open in a browser. The stdio server has no page attached and only ever reports this.` };
				return { markdown: `This is the injector tree for the whole page${args.selector ? `, not filtered to \`${args.selector}\`` : ""}:\n\n${JSON.stringify(roots, null, 2)}` };
			}
		});
	}
});
//#endregion
export { ngDevtools as default };
