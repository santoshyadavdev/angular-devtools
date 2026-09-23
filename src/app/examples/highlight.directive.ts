import { Directive, input, output, signal } from '@angular/core';

/** An attribute directive, so the Components tab lists more than components. */
@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.background]': 'active() ? tint() : null',
    '[style.outline]': 'active() ? "2px solid var(--brand)" : null',
    '(mouseenter)': 'toggle(true)',
    '(mouseleave)': 'toggle(false)',
    '(focusin)': 'toggle(true)',
    '(focusout)': 'toggle(false)',
  },
})
export class Highlight {
  readonly tint = input('var(--brand-soft)', { alias: 'appHighlight' });
  readonly hovered = output<boolean>();

  protected readonly active = signal(false);

  protected toggle(next: boolean) {
    this.active.set(next);
    this.hovered.emit(next);
  }
}
