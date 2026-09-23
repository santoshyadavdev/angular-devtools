import { InjectionToken } from '@angular/core';

export interface PanelFeature {
  readonly name: string;
}

/** A plain value token, resolved from an element injector. */
export const PANEL_TITLE = new InjectionToken<string>('PANEL_TITLE');

/** A multi token, so one key holds more than one entry. */
export const PANEL_FEATURE = new InjectionToken<readonly PanelFeature[]>('PANEL_FEATURE');

export class FeatureCatalog {
  constructor(readonly features: readonly PanelFeature[]) {}

  get names(): string {
    return this.features.map((feature) => feature.name).join(', ');
  }
}
