import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

const takenUsernames = ['admin', 'angular'];

const usernameAvailable: AsyncValidatorFn = (control) =>
  new Promise<ValidationErrors | null>((resolve) =>
    setTimeout(() => resolve(takenUsernames.includes(control.value) ? { taken: true } : null), 600),
  );

const passwordsMatch: ValidatorFn = (group: AbstractControl) =>
  group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true };

@Component({
  selector: 'app-reactive-form-example',
  imports: [ReactiveFormsModule],
  template: `
    <form
      class="card"
      [formGroup]="account"
      (ngSubmit)="save()"
      aria-labelledby="reactive-form-title"
    >
      <h3 id="reactive-form-title">Reactive forms</h3>

      <label>
        Username
        <input
          formControlName="username"
          required
          [attr.aria-invalid]="account.controls.username.invalid"
          [attr.aria-describedby]="
            account.controls.username.invalid ? 'reactive-username-errors' : null
          "
        />
      </label>
      <div id="reactive-username-errors">
        @if (account.controls.username.hasError('required')) {
          <p class="error">Username is required</p>
        }
        @if (account.controls.username.hasError('minlength')) {
          <p class="error">Username needs at least 3 characters</p>
        }
        @if (account.controls.username.hasError('taken')) {
          <p class="error">That username is taken</p>
        }
      </div>
      <p class="status" role="status">
        {{ account.controls.username.pending ? 'Checking availability…' : '' }}
      </p>

      <fieldset formGroupName="security">
        <legend>Password</legend>
        <label>
          Password
          <input
            type="password"
            formControlName="password"
            required
            [attr.aria-invalid]="account.controls.security.controls.password.invalid"
            [attr.aria-describedby]="
              account.controls.security.controls.password.invalid
                ? 'reactive-password-errors'
                : null
            "
          />
        </label>
        <div id="reactive-password-errors">
          @if (account.controls.security.controls.password.hasError('required')) {
            <p class="error">Password is required</p>
          }
          @if (account.controls.security.controls.password.hasError('minlength')) {
            <p class="error">Password needs at least 8 characters</p>
          }
        </div>
        <label>
          Confirm
          <input
            type="password"
            formControlName="confirm"
            [attr.aria-invalid]="account.controls.security.hasError('mismatch')"
            [attr.aria-describedby]="
              account.controls.security.hasError('mismatch') ? 'reactive-confirm-errors' : null
            "
          />
        </label>
        <div id="reactive-confirm-errors">
          @if (account.controls.security.hasError('mismatch')) {
            <p class="error">Passwords don't match</p>
          }
        </div>
      </fieldset>

      <fieldset formArrayName="phones">
        <legend>Phones</legend>
        @for (phone of account.controls.phones.controls; track $index) {
          <label>
            Phone {{ $index + 1 }}
            <input
              [formControlName]="$index"
              [attr.aria-invalid]="phone.invalid"
              [attr.aria-describedby]="phone.invalid ? 'reactive-phone-errors-' + $index : null"
            />
          </label>
          <div [id]="'reactive-phone-errors-' + $index">
            @if (phone.hasError('pattern')) {
              <p class="error">Use digits, spaces and an optional leading +</p>
            }
          </div>
        }
        <button type="button" (click)="addPhone()">Add phone</button>
      </fieldset>

      <p class="hint">
        This component also holds a <code>searchFilters</code> form that no input is bound to. The
        Forms tab still finds it.
      </p>

      <button type="submit">Save</button>
      <p class="status" role="status">{{ result() }}</p>
    </form>
  `,
  styleUrl: './forms-example.css',
})
export class ReactiveFormExample {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly account = this.fb.group({
    username: this.fb.control('angular', {
      validators: [Validators.required, Validators.minLength(3)],
      asyncValidators: [usernameAvailable],
    }),
    security: this.fb.group(
      {
        password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
        confirm: this.fb.control(''),
      },
      { validators: passwordsMatch },
    ),
    phones: this.fb.array([
      this.fb.control('+90 555 000 00 00', Validators.pattern(/^\+?[\d ]+$/)),
    ]),
  });

  protected readonly searchFilters = new FormGroup({
    query: new FormControl('', { nonNullable: true }),
    onlyActive: new FormControl(true, { nonNullable: true }),
  });

  protected addPhone() {
    this.account.controls.phones.push(this.fb.control('', Validators.pattern(/^\+?[\d ]+$/)));
  }

  protected readonly result = signal('');

  protected save() {
    this.account.markAllAsTouched();
    this.result.set(this.account.valid ? 'Saved.' : 'Fix the errors above before saving.');
  }
}
