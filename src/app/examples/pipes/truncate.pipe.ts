import { Pipe, PipeTransform } from '@angular/core';

/** Pure: the same text and limit always produce the same string. */
@Pipe({ name: 'appTruncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 40): string {
    return value.length > limit ? `${value.slice(0, limit).trimEnd()}…` : value;
  }
}
