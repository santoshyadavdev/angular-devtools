import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'ng-devtools-demo-theme';
const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
const LABEL: Record<Theme, string> = { system: 'System', light: 'Light', dark: 'Dark' };
const ICON: Record<Theme, string> = { system: '◐', light: '☀', dark: '☾' };

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      [attr.aria-label]="'Theme: ' + label() + '. Activate to switch.'"
      (click)="next()"
    >
      <span aria-hidden="true">{{ icon() }}</span>
      {{ label() }}
    </button>
  `,
  styles: `
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      /* Fixed, so cycling the label does not resize the button. */
      min-width: 96px;
      padding: 5px 12px;
      border: 1px solid var(--line-strong);
      border-radius: 6px;
      background: var(--surface);
      color: var(--muted);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
    button:hover {
      color: var(--ink);
      border-color: var(--line-strong);
    }
  `,
})
export class ThemeToggle {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>(this.restore());

  readonly label = computed(() => LABEL[this.theme()]);
  readonly icon = computed(() => ICON[this.theme()]);

  constructor() {
    effect(() => {
      const theme = this.theme();
      if (!this.isBrowser) return;
      const root = document.documentElement;
      if (theme === 'system') delete root.dataset['theme'];
      else root.dataset['theme'] = theme;
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // storage can be unavailable or full; the theme still applies
      }
    });
  }

  next() {
    this.theme.update((current) => NEXT[current]);
  }

  private restore(): Theme {
    if (!this.isBrowser) return 'system';
    try {
      // Reading storage throws outright when a browser blocks it, and this
      // runs while the root component is being constructed.
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'light' || stored === 'dark' ? stored : 'system';
    } catch {
      return 'system';
    }
  }
}
