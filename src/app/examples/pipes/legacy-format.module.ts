import { NgModule } from '@angular/core';
import { LegacyFormatPipe } from './legacy-format.pipe';

/** The only way to make a `standalone: false` pipe usable elsewhere: declare
 * it here and export it, then import this module rather than the pipe class. */
@NgModule({
  declarations: [LegacyFormatPipe],
  exports: [LegacyFormatPipe],
})
export class LegacyFormatModule {}
