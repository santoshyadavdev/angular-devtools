import { computed, Directive, input, output, signal } from '@angular/core';

/** An attribute directive, so the Components tab lists more than components. */
@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.background]': 'active() ? fill() : null',
    '[style.outline]': 'active() ? "2px solid var(--brand)" : null',
    '(mouseenter)': 'toggle(true)',
    '(mouseleave)': 'toggle(false)',
    '(focusin)': 'toggle(true)',
    '(focusout)': 'toggle(false)',
  },
})
export class Highlight {
  // A bare `appHighlight` attribute sets this to '', not to the default, so
  // the empty value falls back rather than painting nothing.
  readonly tint = input('', { alias: 'appHighlight' });
  protected readonly fill = computed(() => this.tint() || 'var(--brand-soft)');
  readonly hovered = output<boolean>();

  protected readonly active = signal(false);

  protected toggle(next: boolean) {
    this.active.set(next);
    this.hovered.emit(next);
  }
}
