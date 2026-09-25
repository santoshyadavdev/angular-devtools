import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-form-example',
  imports: [FormsModule],
  template: `
    <form
      class="card"
      #contact="ngForm"
      (ngSubmit)="send(contact.valid)"
      aria-labelledby="template-form-title"
    >
      <h3 id="template-form-title">Template-driven forms</h3>

      <label>
        Full name
        <input
          name="fullName"
          [(ngModel)]="fullName"
          required
          minlength="3"
          #name="ngModel"
          [attr.aria-invalid]="name.invalid"
          [attr.aria-describedby]="name.invalid ? 'template-name-errors' : null"
        />
      </label>
      <div id="template-name-errors">
        @if (name.hasError('required')) {
          <p class="error">Full name is required</p>
        }
        @if (name.hasError('minlength')) {
          <p class="error">Full name needs at least 3 characters</p>
        }
      </div>

      <fieldset ngModelGroup="address">
        <legend>Address</legend>
        <label>
          City
          <input
            name="city"
            [(ngModel)]="city"
            required
            #cityModel="ngModel"
            [attr.aria-invalid]="cityModel.invalid"
            [attr.aria-describedby]="cityModel.invalid ? 'template-city-errors' : null"
          />
        </label>
        <div id="template-city-errors">
          @if (cityModel.invalid) {
            <p class="error">City is required</p>
          }
        </div>
        <label>
          Postcode
          <input
            name="postcode"
            [(ngModel)]="postcode"
            pattern="[0-9]{5}"
            #postcodeModel="ngModel"
            [attr.aria-invalid]="postcodeModel.invalid"
            [attr.aria-describedby]="postcodeModel.invalid ? 'template-postcode-errors' : null"
          />
        </label>
        <div id="template-postcode-errors">
          @if (postcodeModel.invalid) {
            <p class="error">Postcode must be 5 digits</p>
          }
        </div>
      </fieldset>

      <label class="inline">
        <input type="checkbox" name="newsletter" [(ngModel)]="newsletter" />
        Send me the newsletter
      </label>

      <button type="submit">Send</button>
      <p class="status" role="status">{{ result() }}</p>
    </form>
  `,
  styleUrl: './forms-example.css',
})
export class TemplateFormExample {
  protected readonly fullName = signal('Al');
  protected readonly city = signal('');
  protected readonly postcode = signal('3400');
  protected readonly newsletter = signal(true);
  protected readonly result = signal('');

  protected send(valid: boolean | null) {
    this.result.set(valid ? 'Sent.' : 'Fix the errors above before sending.');
  }
}
