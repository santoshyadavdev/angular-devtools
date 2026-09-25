import { createHostContext } from 'devframe/node';
import { describe, expect, it } from 'vitest';
import ngDevtools from '../devframe.ts';

async function boot() {
  const host = {
    mountStatic: () => {},
    resolveOrigin: () => 'http://localhost',
    getStorageDir: () => '',
  };
  const ctx = await createHostContext({ cwd: process.cwd(), mode: 'dev', host: host as never });
  await ngDevtools.setup(ctx as never);
  const push = (name: string, payload: unknown) =>
    ctx.rpc.invokeLocal(`ng-devtools:${name}` as never, ...([payload] as never));
  const call = async (tool: string, selector: string) =>
    ((await ctx.agent.invoke(`ng-devtools:${tool}`, { selector })) as { markdown: string })
      .markdown;
  return { push, call };
}

describe('agent tools', () => {
  it('say so when nothing has been reported', async () => {
    const { call } = await boot();
    // Worded after the data, not the connection: an empty tree is what both a
    // page that never connected and a page with no readable components send.
    expect(await call('highlight', 'app-root')).toMatch(/no component tree has been reported/i);
    expect(await call('inspect-signals', 'app-root')).toMatch(/no signal graph/i);
    expect(await call('inspect-providers', 'app-root')).toMatch(/no injector data/i);
  });

  it('answer from the data the page pushed', async () => {
    const { push, call } = await boot();
    await push('push-component-tree', [{ id: 'ngdt-1', selector: 'app-root' }]);
    await push('push-signal-graph', {
      nodes: [{ id: 'a', kind: 'signal', label: 'count' }],
      edges: [],
      componentSelector: 'app-root',
    });
    await push('push-injector-tree', [
      {
        injector: { id: 'i1', type: 'element', name: 'App', providerCount: 0 },
        providers: [],
        children: [],
      },
    ]);

    expect(await call('highlight', 'app-root')).toMatch(/highlight request/i);

    // The payload matters, not how it is worded around.
    const signals = await call('inspect-signals', 'app-root');
    expect(JSON.parse(signals)).toMatchObject({ nodes: [{ label: 'count' }] });

    const other = await call('inspect-signals', 'app-other');
    expect(other).toMatch(/app-other/);
    expect(other).toMatch(/app-root/);

    // The answer carries the whole injector tree, whatever it is worded like.
    const providers = await call('inspect-providers', 'app-root');
    expect(JSON.parse(providers.slice(providers.indexOf('[')))).toMatchObject([
      { injector: { name: 'App' } },
    ]);
  });
});
