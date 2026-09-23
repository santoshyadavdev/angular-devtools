import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <section>
      <h1>About Us</h1>
      <p>
        Angular DevTools inspects components, signals, DI and routes in any Angular application.
      </p>
    </section>
  `,
  styles: `
    section {
      padding: 24px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 12px;
    }
  `,
})
export class About {}
