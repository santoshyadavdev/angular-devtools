import { Pipe, PipeTransform } from '@angular/core';

/** Impure: the same timestamp reads differently as the clock advances, so it
 * must be declared `pure: false` to recompute on every change detection run. */
@Pipe({ name: 'appTimeAgo', pure: false })
export class TimeAgoPipe implements PipeTransform {
  transform(value: number): string {
    const seconds = Math.max(0, Math.round((Date.now() - value) / 1000));
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.round(minutes / 60)}h ago`;
  }
}
