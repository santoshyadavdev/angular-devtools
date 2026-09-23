import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <section>
      <h1>Welcome to Angular DevTools Demo</h1>
      <p>Counter: {{ counter() }}</p>
      <button (click)="increment()">Increment</button>
    </section>
  `,
  styles: `
    section {
      padding: 24px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 12px;
    }
    button {
      padding: 8px 16px;
      border: 1px solid var(--line-strong);
      border-radius: 6px;
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
    }
    button:hover {
      border-color: var(--brand);
      color: var(--brand);
    }
  `,
})
export class Home {
  counter = signal(0);

  increment() {
    this.counter.update((c) => c + 1);
  }
}
