import { describe, expect, it } from 'vitest';
import { formSourceIn, sourceText } from '../rpc/forms-source.ts';

const file = `import { form, required, min } from '@angular/forms/signals';

// class Signup is mentioned in a comment
export class Signup {
  model = signal({ name: '', age: 0 });
  signup = form(this.model, (p) => {
    required(p.name, { message: 'Name is required' });
    min(p.age, 13);
  });
}

export class Account {
  account = new FormGroup({
    username: new FormControl('', Validators.required),
  });
}
`;

describe('form source scan', () => {
  it('finds the form property and the rules of a Signal Forms field', () => {
    const found = formSourceIn(file, 'src/signup.ts', 'Signup', 'signup', 'name');
    expect(found?.form).toMatchObject({ file: 'src/signup.ts', line: 6 });
    expect(found?.rules.map((r) => r.line)).toEqual([7]);
    expect(sourceText(found)).toContain('Defined at src/signup.ts:6: signup = form(this.model');
  });

  it('finds reactive control declarations and ignores array indexes', () => {
    const found = formSourceIn(file, 'a.ts', 'Account', 'account', 'username');
    expect(found?.form?.line).toBe(13);
    expect(found?.rules.map((r) => r.text)).toEqual([
      "username: new FormControl('', Validators.required),",
    ]);
    expect(formSourceIn(file, 'a.ts', 'Account', 'account', '0')?.rules).toEqual([]);
    expect(formSourceIn(file, 'a.ts', 'Missing', 'x', '')).toBeNull();
  });
});
