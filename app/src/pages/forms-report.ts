import { Component, effect, input, signal, untracked } from '@angular/core';
import type { DevframeRpcClient } from 'devframe/client';
import { FORMS_STYLES, formsCall, plain, type FormLintFinding } from './forms-types';

@Component({
  selector: 'app-forms-submit',
  template: `
    <h3>Submit</h3>
    <pre class="explain">{{ submit() || 'Loading…' }}</pre>
    <h3>Payload</h3>
    <pre class="explain">{{ payload() || 'Loading…' }}</pre>
    <div>
      <button type="button" class="small" (click)="copyFixture()">Copy test fixture</button>
      <span class="status" role="status">{{ message() }}</span>
    </div>
  `,
  styles: `
    ${FORMS_STYLES}
    :host {
      display: grid;
      gap: 8px;
    }
    h3 {
      margin: 4px 0 0;
      color: #d4d4d8;
      font-size: 13px;
    }
    .status {
      margin-left: 8px;
    }
  `,
})
export class FormsSubmit {
  formId = input.required<string>();
  version = input(0);
  rpc = input<DevframeRpcClient | null>(null);

  readonly submit = signal('');
  readonly payload = signal('');
  readonly message = signal('');

  constructor() {
    effect(() => {
      const form = this.formId();
      this.version();
      const client = this.rpc();
      untracked(async () => {
        const [submit, payload] = await Promise.all([
          formsCall<string>(client, 'forms-explain', { kind: 'submit', form }),
          formsCall<string>(client, 'forms-explain', { kind: 'payload', form }),
        ]);
        if (this.formId() !== form) return;
        this.submit.set(plain(submit));
        this.payload.set(plain(payload));
      });
    });
  }

  async copyFixture() {
    const text = await formsCall<string>(this.rpc(), 'forms-explain', {
      kind: 'fixture',
      form: this.formId(),
    });
    const code = (text ?? '').match(/```ts\n([\s\S]*?)```/)?.[1] ?? '';
    try {
      await navigator.clipboard.writeText(code);
      this.message.set('Copied.');
    } catch {
      this.message.set('Clipboard is not available here.');
    }
  }
}

@Component({
  selector: 'app-forms-lint',
  template: `
    @if (findings() === null) {
      <p class="muted">Checking…</p>
    } @else if (!findings()!.length) {
      <p class="muted">No problems found. For generic accessibility, run axe on the page.</p>
    } @else {
      <ul class="findings">
        @for (f of findings(); track $index) {
          <li>
            <span
              class="tag"
              [attr.data-tone]="
                f.severity === 'info' ? '' : f.severity === 'error' ? 'bad' : 'warn'
              "
              >{{ f.severity }}</span
            >
            <code>{{ f.rule }}</code>
            @if (f.path) {
              <span class="muted">at {{ f.path }}</span>
            }
            <div>{{ f.message }}</div>
            <div class="muted">Fix: {{ f.fix }}</div>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    ${FORMS_STYLES}
    .findings {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 13px;
      color: #e4e4e7;
    }
    .findings li {
      padding: 8px;
      border: 1px solid #27272a;
      border-radius: 6px;
    }
    code {
      color: #c4b5fd;
    }
  `,
})
export class FormsLint {
  formId = input.required<string>();
  version = input(0);
  rpc = input<DevframeRpcClient | null>(null);

  readonly findings = signal<FormLintFinding[] | null>(null);

  constructor() {
    effect(() => {
      const form = this.formId();
      this.version();
      const client = this.rpc();
      untracked(async () => {
        const found = await formsCall<FormLintFinding[]>(client, 'forms-lint', { form });
        if (this.formId() === form) this.findings.set(found ?? []);
      });
    });
  }
}
