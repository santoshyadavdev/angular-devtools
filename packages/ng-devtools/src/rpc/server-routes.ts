import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { IGNORED_DIRS, sourceRoots, stripComments } from './source-scan.ts';

export interface ServerRouteEntry {
  path: string;
  renderMode: string;
  file: string;
}

const MAX_FILES = 20;
const ENTRY =
  /\{[^{}]*?\bpath\s*:\s*(['"`])([^'"`]*)\1[^{}]*?\brenderMode\s*:\s*RenderMode\.(\w+)[^{}]*?\}/g;
const ENTRY_REVERSED =
  /\{[^{}]*?\brenderMode\s*:\s*RenderMode\.(\w+)[^{}]*?\bpath\s*:\s*(['"`])([^'"`]*)\2[^{}]*?\}/g;

export function parseServerRoutes(source: string, file: string): ServerRouteEntry[] {
  const code = stripComments(source);
  const out: ServerRouteEntry[] = [];
  const seen = new Set<string>();
  for (const match of code.matchAll(ENTRY)) {
    const key = `${match.index}`;
    seen.add(key);
    out.push({ path: match[2], renderMode: match[3], file });
  }
  for (const match of code.matchAll(ENTRY_REVERSED)) {
    if (seen.has(`${match.index}`)) continue;
    out.push({ path: match[3], renderMode: match[1], file });
  }
  return out;
}

function findFiles(dir: string, found: string[], depth: number) {
  if (depth > 8 || found.length >= MAX_FILES) return;
  let entries: string[];
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
        if (!IGNORED_DIRS.has(entry.toLowerCase())) findFiles(full, found, depth + 1);
      } else if (/\.routes\.server\.ts$/.test(entry) || entry === 'app.routes.server.ts') {
        found.push(full);
      }
    } catch {
      continue;
    }
  }
}

/**
 * The `ServerRoute[]` entries (path and render mode) declared in the
 * workspace's `*.routes.server.ts` files, read from source.
 */
export function scanServerRoutes(cwd: string): ServerRouteEntry[] {
  const files: string[] = [];
  for (const root of sourceRoots(cwd)) findFiles(root, files, 0);
  return files.flatMap((file) => {
    try {
      return parseServerRoutes(readFileSync(file, 'utf-8'), relative(cwd, file));
    } catch {
      return [];
    }
  });
}
