import { defineRpcFunction } from 'devframe'
import * as v from 'valibot'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const RouteSchema = v.object({
  path: v.string(),
  component: v.optional(v.string()),
  hasChildren: v.boolean(),
  file: v.string(),
})

export const getRoutes = defineRpcFunction({
  name: 'get-routes',
  type: 'query',
  jsonSerializable: true,
  args: [],
  returns: v.array(RouteSchema),
  agent: {
    description:
      'List Angular routes extracted from route configuration files in the workspace. Call before suggesting navigation changes or analyzing the app structure.',
    title: 'List Angular routes',
  },
  setup: (ctx) => ({
    handler: async () => extractRoutes(ctx.cwd),
  }),
})

function extractRoutes(cwd: string) {
  const routes: { path: string; component?: string; hasChildren: boolean; file: string }[] = []
  findRouteFiles(join(cwd, 'src'), cwd, routes)
  return routes
}

function findRouteFiles(
  dir: string,
  cwd: string,
  routes: { path: string; component?: string; hasChildren: boolean; file: string }[],
) {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }

  for (const entry of entries) {
    const full = join(dir, entry)
    try {
      if (statSync(full).isDirectory()) {
        if (entry !== 'node_modules') findRouteFiles(full, cwd, routes)
        continue
      }
    } catch {
      continue
    }

    if (!entry.match(/\.routes\.ts$|routing\.module\.ts$/)) continue

    try {
      const content = readFileSync(full, 'utf-8')
      const relPath = relative(cwd, full)

      for (const body of objectLiterals(stripComments(content))) {
        const props = topLevelProps(body)
        const path = props.get('path')?.match(/^['"`]([^'"`]*)['"`]$/)?.[1]
        if (path === undefined) continue
        routes.push({
          path,
          component: routeComponent(props),
          hasChildren: props.has('children'),
          file: relPath,
        })
      }
    } catch {
      // skip unreadable files
    }
  }
}

function routeComponent(props: Map<string, string>): string | undefined {
  const eager = props.get('component')?.match(/^(\w+)/)?.[1]
  if (eager) return eager
  return props.get('loadComponent')?.match(/\.then\(\s*\(?\s*(\w+)\s*\)?\s*=>\s*\1\.(\w+)/)?.[2]
}

function objectLiterals(source: string): string[] {
  const spans: [number, number][] = []
  const open: { ch: string; at: number; inArray: boolean }[] = []
  for (let i = 0; i < source.length; i++) {
    const ch = source[i]
    if (ch === '"' || ch === "'" || ch === '`') i = skipString(source, i)
    else if ('([{'.includes(ch)) open.push({ ch, at: i, inArray: open.at(-1)?.ch === '[' })
    else if (')]}'.includes(ch)) {
      const closed = open.pop()
      if (ch === '}' && closed?.ch === '{' && closed.inArray) spans.push([closed.at, i])
    }
  }
  return spans.sort((a, b) => a[0] - b[0]).map(([start, end]) => source.slice(start + 1, end))
}

function topLevelProps(body: string): Map<string, string> {
  const props = new Map<string, string>()
  const add = (text: string) => {
    const prop = text.match(/^\s*(\w+)\s*:\s*([\s\S]*?)\s*$/)
    if (prop) props.set(prop[1], prop[2])
  }
  let depth = 0
  let start = 0
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (ch === '"' || ch === "'" || ch === '`') i = skipString(body, i)
    else if ('([{'.includes(ch)) depth++
    else if (')]}'.includes(ch)) depth--
    else if (ch === ',' && depth === 0) {
      add(body.slice(start, i))
      start = i + 1
    }
  }
  add(body.slice(start))
  return props
}

function skipString(source: string, start: number): number {
  for (let i = start + 1; i < source.length; i++) {
    if (source[i] === '\\') i++
    else if (source[i] === source[start]) return i
  }
  return source.length
}

function stripComments(source: string): string {
  let out = ''
  for (let i = 0; i < source.length; i++) {
    const ch = source[i]
    if (ch === '"' || ch === "'" || ch === '`') {
      const end = skipString(source, i)
      out += source.slice(i, end + 1)
      i = end
    }
    else if (source.startsWith('//', i)) {
      const end = source.indexOf('\n', i)
      i = (end === -1 ? source.length : end) - 1
    }
    else if (source.startsWith('/*', i)) {
      const end = source.indexOf('*/', i + 2)
      i = end === -1 ? source.length : end + 1
      out += ' '
    }
    else {
      out += ch
    }
  }
  return out
}
