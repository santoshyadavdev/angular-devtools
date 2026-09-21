import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { getRoutes } from '../get-routes.ts'

let dir: string

afterEach(() => rmSync(dir, { recursive: true, force: true }))

async function routesFor(source: string) {
  dir = mkdtempSync(join(tmpdir(), 'ng-devtools-routes-'))
  mkdirSync(join(dir, 'src'))
  writeFileSync(join(dir, 'src', 'app.routes.ts'), source)
  const { handler } = getRoutes.setup({ cwd: dir } as never)
  return handler()
}

describe('get-routes', () => {
  it('reads an eager component', async () => {
    const routes = await routesFor(`[{ path: 'about', component: AboutComponent }]`)
    expect(routes).toEqual([
      { path: 'about', component: 'AboutComponent', hasChildren: false, file: 'src/app.routes.ts' },
    ])
  })

  it('reads the export name of a lazy component', async () => {
    const routes = await routesFor(`[
      { path: '', loadComponent: () => import('./home').then(m => m.Home) },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings').then((mod) => mod.Settings),
      },
    ]`)
    expect(routes.map(r => r.component)).toEqual(['Home', 'Settings'])
  })

  it('reports no component for a lazy default export', async () => {
    const routes = await routesFor(`[{ path: '', loadComponent: () => import('./home') }]`)
    expect(routes[0].component).toBeUndefined()
  })

  it('does not take the component of the next route', async () => {
    const routes = await routesFor(`[
      { path: 'old', redirectTo: 'about', pathMatch: 'full' },
      { path: 'about', component: AboutComponent },
    ]`)
    expect(routes.map(r => r.component)).toEqual([undefined, 'AboutComponent'])
  })

  it('only flags children on the route that has them', async () => {
    const routes = await routesFor(`[
      { path: 'admin', component: Admin, children: [{ path: 'users', component: Users }] },
      { path: 'about', component: About },
    ]`)
    expect(routes.map(r => [r.path, r.hasChildren])).toEqual([
      ['admin', true],
      ['users', false],
      ['about', false],
    ])
  })
})
