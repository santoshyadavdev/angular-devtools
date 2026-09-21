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

      const pathMatches = [...content.matchAll(/path:\s*['"`]([^'"`]*)['"`]/g)]
      pathMatches.forEach((match, i) => {
        const route = content.slice(match.index, pathMatches[i + 1]?.index ?? content.length)
        routes.push({
          path: match[1],
          component: routeComponent(route),
          hasChildren: /children\s*:\s*\[/.test(route),
          file: relPath,
        })
      })
    } catch {
      // skip unreadable files
    }
  }
}

function routeComponent(route: string): string | undefined {
  const eager = route.match(/\bcomponent\s*:\s*(\w+)/)
  if (eager) return eager[1]
  const lazy = route.match(/loadComponent\s*:[\s\S]*?\.then\(\s*\(?\s*(\w+)\s*\)?\s*=>\s*\1\.(\w+)/)
  return lazy?.[2]
}
