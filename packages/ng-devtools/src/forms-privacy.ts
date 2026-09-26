export const REDACTED = '[redacted]';

export type RedactReason = 'key' | 'input-type' | 'autocomplete' | 'marker' | 'parent' | 'config';

const SECRET_WORDS = new Set([
  'password',
  'passwd',
  'passphrase',
  'passcode',
  'pass',
  'pwd',
  'secret',
  'token',
  'otp',
  'totp',
  'pin',
  'cvv',
  'cvc',
  'csc',
  'ssn',
  'iban',
  'card',
  'cc',
  'credential',
  'credentials',
]);

const SECRET_PAIRS = new Set([
  'apikey',
  'privatekey',
  'secretkey',
  'accesskey',
  'ccnum',
  'ccnumber',
  'securitycode',
]);

const SECRET_AUTOCOMPLETE = /password|one-time-code|cc-/i;
const MASK_MARKERS = '.sentry-mask, .rr-mask, [data-private], [data-ng-devtools="mask"]';
const UNMASK_MARKER = '[data-ng-devtools="unmask"]';
const JWT = /\beyJ[\w-]{5,}\.[\w-]{5,}\.[\w-]{5,}/g;
const BEARER = /\bBearer\s+[\w.~+/=-]+/gi;

interface PrivacyConfig {
  mask?: string[];
  unmask?: string[];
}

function config(): PrivacyConfig {
  try {
    const value = (globalThis as { __NG_DEVTOOLS_FORMS__?: unknown }).__NG_DEVTOOLS_FORMS__;
    return value && typeof value === 'object' ? (value as PrivacyConfig) : {};
  } catch {
    return {};
  }
}

export function wordsOf(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function singular(word: string): string {
  return word.length > 3 && word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word;
}

export function isSecretKey(key: string): boolean {
  const words = wordsOf(key).map(singular);
  if (words.some((word) => SECRET_WORDS.has(word))) return true;
  if (SECRET_PAIRS.has(words.join(''))) return true;
  return words.some((word, i) => i > 0 && SECRET_PAIRS.has(words[i - 1] + word));
}

function listed(list: string[] | undefined, key: string): boolean {
  return Array.isArray(list) && list.some((entry) => entry === key);
}

export function redactReason(key: string, element?: Element | null): RedactReason | null {
  const { mask, unmask } = config();
  if (listed(unmask, key)) return null;
  const unmasked = !!element && safeClosest(element, UNMASK_MARKER);
  if (listed(mask, key)) return 'config';
  if (!unmasked && isSecretKey(key)) return 'key';
  if (!element) return null;
  if (element.getAttribute('type') === 'password') return 'input-type';
  if (SECRET_AUTOCOMPLETE.test(element.getAttribute('autocomplete') ?? '')) return 'autocomplete';
  if (!unmasked && safeClosest(element, MASK_MARKERS)) return 'marker';
  if (!unmasked && safeQuery(element, 'input[type="password"]')) return 'input-type';
  return null;
}

function safeClosest(element: Element, selector: string): boolean {
  try {
    return !!element.closest(selector);
  } catch {
    return false;
  }
}

function safeQuery(element: Element, selector: string): boolean {
  try {
    return !!element.querySelector(selector);
  } catch {
    return false;
  }
}

export function redactMessage(text: string, secrets: Iterable<string> = []): string {
  let out = text.replace(JWT, REDACTED).replace(BEARER, `Bearer ${REDACTED}`);
  for (const secret of secrets) {
    if (secret.length < 3) continue;
    out = out.split(secret).join(REDACTED);
  }
  return out;
}

export class SecretSet {
  private readonly values = new Set<string>();

  add(value: unknown) {
    if (typeof value === 'string' && value.length >= 3) this.values.add(value);
    else if (typeof value === 'number' && String(value).length >= 3) this.values.add(String(value));
  }

  get size() {
    return this.values.size;
  }

  redact(text: string): string {
    return redactMessage(text, this.values);
  }
}
