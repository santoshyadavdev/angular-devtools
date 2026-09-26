import { Pipe, PipeTransform } from '@angular/core';

/** Declared `standalone: false`: Angular requires a pipe like this to be
 * declared and exported by an `NgModule` (see `legacy-format.module.ts`),
 * then that module imported wherever the pipe is used. Listing the pipe
 * class itself in a standalone component's `imports` is not enough. */
@Pipe({ name: 'appLegacyFormat', standalone: false })
export class LegacyFormatPipe implements PipeTransform {
  transform(value: string): string {
    return value.toUpperCase();
  }
}
