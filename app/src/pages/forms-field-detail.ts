import { Component, effect, input, signal, untracked } from '@angular/core';
import type { DevframeRpcClient } from 'devframe/client';
import {
  FORMS_STYLES,
  actionMessage,
  formAction,
  formsCall,
  plain,
  type CollectedForm,
  type FormFieldNode,
} from './forms-types';

@Component({
  selector: 'app-forms-field-detail',
  template: `
    <h3>{{ node().path || '(form)' }}</h3>
    <pre class="explain">{{ text() || 'Loading…' }}</pre>
    <div class="row">
      @if (node().type === 'control' && !node().redacted) {
        <label class="sr-only" for="field-value">New value for {{ node().path }}</label>
        <input
          id="field-value"
          class="field-input"
          type="text"
          placeholder="New value (JSON or text)"
          [value]="draft()"
          (input)="draft.set($any($event.target).value)"
          (keydown.enter)="setValue()"
        />
        <button type="button" class="small" (click)="setValue()">Set</button>
      }
      <button type="button" class="small" (click)="act('focus')">Focus</button>
      <button type="button" class="small" (click)="act('mark-touched')">Touch</button>
      <button type="button" class="small" (click)="act('revalidate')">Revalidate</button>
      <button type="button" class="small" (click)="act('store-as-global')">Store as global</button>
    </div>
    <p class="status" role="status">{{ message() }}</p>
  `,
  styles: `
    ${FORMS_STYLES}
    :host {
      display: grid;
      gap: 8px;
      padding: 10px;
      border: 1px solid #3f3f46;
      border-radius: 8px;
    }
    h3 {
      margin: 0;
      color: #e4e4e7;
      font-size: 14px;
      font-family: ui-monospace, monospace;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
  `,
})
export class FormsFieldDetail {
  form = input.required<CollectedForm>();
  node = input.required<FormFieldNode>();
  version = input(0);
  rpc = input<DevframeRpcClient | null>(null);

  readonly text = signal('');
  readonly draft = signal('');
  readonly message = signal('');

  constructor() {
    effect(() => {
      const form = this.form().id;
      const path = this.node().path;
      this.version();
      const client = this.rpc();
      untracked(() => this.load(client, form, path));
    });
  }

  private async load(client: DevframeRpcClient | null, form: string, path: string) {
    const text = await formsCall<string>(client, 'forms-explain', { kind: 'field', form, path });
    if (this.form().id === form && this.node().path === path) this.text.set(plain(text));
  }

  async act(action: string) {
    const result = await formAction(this.rpc(), {
      action,
      formId: this.form().id,
      path: this.node().path,
    });
    this.message.set(
      result.expression ? `${actionMessage(result)} ${result.expression}` : actionMessage(result),
    );
  }

  async setValue() {
    const raw = this.draft();
    let value: unknown = raw;
    try {
      value = JSON.parse(raw);
    } catch {
      value = raw;
    }
    const result = await formAction(this.rpc(), {
      action: 'set-value',
      formId: this.form().id,
      path: this.node().path,
      value,
      mode: 'user',
    });
    this.message.set(actionMessage(result));
  }
}
