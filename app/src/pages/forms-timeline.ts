import { Component, computed, input, output, signal } from '@angular/core';
import { FORMS_STYLES, type FormEvent } from './forms-types';

const ORIGINS = ['all', 'user', 'code', 'devtools'] as const;

@Component({
  selector: 'app-forms-timeline',
  template: `
    <label class="record">
      <input type="checkbox" [checked]="recording()" (change)="record.emit(!recording())" />
      Record calling code, validator changes and renders per keystroke
    </label>
    <fieldset class="chips">
      <legend class="sr-only">Show changes from</legend>
      @for (origin of origins; track origin) {
        <label>
          <input
            type="radio"
            name="timeline-origin"
            [value]="origin"
            [checked]="origin === filter()"
            (change)="filter.set(origin)"
          />
          {{ origin }}
        </label>
      }
    </fieldset>
    @if (shown().length) {
      <ol class="events">
        @for (event of shown(); track event.formId + '#' + event.seq) {
          <li [attr.data-type]="event.type">
            <time>{{ time(event.timestamp) }}</time>
            <code>{{ event.path || '(form)' }}</code>
            <span class="event-type">{{ event.type }}</span>
            @if (event.outcome) {
              <span class="tag" [attr.data-tone]="event.outcome === 'ran' ? '' : 'bad'">{{
                event.outcome
              }}</span>
            }
            <span class="detail">
              @if (event.prev !== undefined) {
                <span class="muted">{{ event.prev }}</span> →
              }
              {{ event.detail }}
            </span>
            @if (event.count && event.count > 1) {
              <span class="tag">×{{ event.count }}</span>
            }
            @if (event.origin) {
              <span class="tag">{{ event.origin }}</span>
            }
            @if (event.ms !== undefined) {
              <span class="tag" [attr.data-tone]="event.ms > 1000 ? 'warn' : ''"
                >pending {{ event.ms }}ms</span
              >
            }
            @if (event.renders) {
              <span class="tag" [attr.data-tone]="event.renders > 20 ? 'warn' : ''"
                >{{ event.renders }} renders: {{ (event.rendered ?? []).join(', ') }}</span
              >
            }
            @if (event.caller) {
              <span class="caller">from {{ event.caller }}</span>
            }
          </li>
        }
      </ol>
    } @else {
      <p class="muted">No changes yet. Type into the form to see them here.</p>
    }
  `,
  styles: `
    ${FORMS_STYLES}
    :host {
      display: grid;
      gap: 8px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 0;
      padding: 0;
      border: 0;
      color: #d4d4d8;
      font-size: 13px;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .events {
      display: grid;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 13px;
    }
    .events li {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: baseline;
      color: #d4d4d8;
    }
    .events li[data-type='submit'] {
      border-left: 3px solid var(--accent);
      padding-left: 6px;
    }
    time {
      color: #a1a1aa;
      font-variant-numeric: tabular-nums;
    }
    code {
      color: #c4b5fd;
    }
    .event-type {
      color: #93c5fd;
    }
    .detail {
      overflow-wrap: anywhere;
    }
    .record {
      color: #d4d4d8;
      font-size: 13px;
    }
    .caller {
      flex-basis: 100%;
      padding-left: 16px;
      color: #a1a1aa;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      overflow-wrap: anywhere;
    }
  `,
})
export class FormsTimeline {
  events = input.required<FormEvent[]>();
  recording = input(false);
  readonly record = output<boolean>();

  readonly origins = ORIGINS;
  readonly filter = signal<(typeof ORIGINS)[number]>('all');

  readonly shown = computed(() => {
    const origin = this.filter();
    return this.events()
      .filter((e) => origin === 'all' || e.origin === origin)
      .slice(-100)
      .reverse();
  });

  time(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }
}
