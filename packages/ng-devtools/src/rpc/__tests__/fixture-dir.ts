import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { onTestFinished } from 'vitest';

/** A temporary directory removed when the test that made it finishes. */
export function fixtureDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  // Registered per test, so a sibling running concurrently cannot remove it.
  onTestFinished(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}
