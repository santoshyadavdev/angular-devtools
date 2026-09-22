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

  it('reads the component whatever the property order', async () => {
    const routes = await routesFor(`[
      { component: HomeComponent, path: 'home' },
      { path: 'admin', children: [{ component: UsersComponent, path: 'users' }] },
    ]`)
    expect(routes.map(r => [r.path, r.component])).toEqual([
      ['home', 'HomeComponent'],
      ['admin', undefined],
      ['users', 'UsersComponent'],
    ])
  })

  it('only reads the lazy component from loadComponent', async () => {
    const routes = await routesFor(`[{
      path: 'lazy',
      loadComponent: () => import('./lazy'),
      resolve: { data: () => import('./data').then(m => m.Data) },
    }]`)
    expect(routes.map(r => r.component)).toEqual([undefined])
  })

  it('ignores braces and paths inside strings and comments', async () => {
    const routes = await routesFor(`[
      // { path: 'commented', component: Nope },
      { path: 'about', title: 'About {us}', component: AboutComponent },
    ]`)
    expect(routes.map(r => [r.path, r.component])).toEqual([['about', 'AboutComponent']])
  })

  it('reads routes that contain comments', async () => {
    const routes = await routesFor(`[
      {
        // landing page
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'shop',
        /* lazy (see [docs]) */ loadComponent: () => import('./shop').then(m => m.Shop),
      },
    ]`)
    expect(routes.map(r => [r.path, r.component])).toEqual([
      ['home', 'HomeComponent'],
      ['shop', 'Shop'],
    ])
  })

  it('does not treat nested route metadata as a route', async () => {
    const routes = await routesFor(`[
      { path: 'home', component: HomeComponent, data: { path: 'label', breadcrumb: 'Home' } },
    ]`)
    expect(routes.map(r => [r.path, r.component])).toEqual([['home', 'HomeComponent']])
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
