import { isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ExamplePage } from './example-page';
import { LegacyFormatModule } from './pipes/legacy-format.module';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@Component({
  selector: 'app-pipes-example',
  imports: [ExamplePage, TruncatePipe, TimeAgoPipe, LegacyFormatModule],
  template: `
    <app-example-page heading="Pipes" tab="Pipes">
      <ng-container lead>
        <code>appTruncate</code> is a pure pipe: it only recomputes when its own arguments change.
        <code>appTimeAgo</code> is declared <code>pure: false</code>, so it recomputes on every
        change detection run and can drift on its own, without a new value to react to.
        <code>appLegacyFormat</code> is declared <code>standalone: false</code>, so it can only be
        used here because <code>LegacyFormatModule</code> declares and exports it and is imported
        above instead of the pipe class itself.
      </ng-container>
      <ng-container hint>
        Edit the message, then watch "posted" advance by itself as the clock ticks.
      </ng-container>

      <textarea
        class="message"
        rows="2"
        [value]="message()"
        (input)="setMessage($event)"
        aria-label="Message, shown below truncated to 24 characters"
      ></textarea>

      <dl class="readouts">
        <dt>truncated (pure)</dt>
        <dd>{{ message() | appTruncate: 24 }}</dd>
        <dt>posted (impure)</dt>
        <dd>{{ postedAt() | appTimeAgo }}</dd>
        <dt>ticks</dt>
        <dd>{{ tick() }} <span class="hint-text">(forces the recompute above)</span></dd>
        <dt>legacy (module)</dt>
        <dd>{{ message() | appLegacyFormat | appTruncate: 24 }}</dd>
      </dl>

      <button type="button" (click)="repost()">Post again</button>
    </app-example-page>
  `,
  styles: `
    .message {
      padding: 8px 10px;
      border: 1px solid var(--line-strong);
      border-radius: 6px;
      background: var(--surface);
      color: var(--ink);
      font: inherit;
      resize: vertical;
    }
    .readouts {
      display: grid;
      grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
      gap: 4px 16px;
      margin: 0;
    }
    dt {
      color: var(--muted);
    }
    dd {
      margin: 0;
      font-variant-numeric: tabular-nums;
    }
    .hint-text {
      color: var(--muted);
      font-size: 13px;
      font-variant-numeric: normal;
    }
    button {
      justify-self: start;
      padding: 6px 12px;
      border: 1px solid var(--line-strong);
      border-radius: 6px;
      background: var(--surface);
      cursor: pointer;
    }
    :focus-visible {
      outline: 2px solid var(--brand);
      outline-offset: 2px;
    }
  `,
})
export class PipesExample {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly message = signal(
    'Angular DevTools now inspects pipes, not just components and signals.',
  );
  protected readonly postedAt = signal(Date.now());

  /** Read in the template so a change detection run happens every second,
   * without touching `postedAt` itself: that run is what gives the impure
   * pipe above a reason to recompute. */
  protected readonly tick = signal(0);

  /** Held in a field so the Signals tab lists it and so it can be destroyed
   * with the component. */
  private readonly _ticking = effect((onCleanup) => {
    if (!this.isBrowser) return;
    const id = setInterval(() => this.tick.update((value) => value + 1), 1000);
    onCleanup(() => clearInterval(id));
  });

  protected setMessage(event: Event) {
    this.message.set((event.target as HTMLTextAreaElement).value);
  }

  protected repost() {
    this.postedAt.set(Date.now());
  }
}
