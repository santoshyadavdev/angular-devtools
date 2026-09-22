// Helpers shared by the RPC functions that read information out of source
// files with regular expressions. None of them parse TypeScript; they only do
// enough lexing to keep strings and comments from being mistaken for code.

/** Index of the quote that closes the string starting at `start`. */
export function skipString(source: string, start: number): number {
  for (let i = start + 1; i < source.length; i++) {
    if (source[i] === '\\') i++;
    else if (source[i] === source[start]) return i;
  }
  return source.length;
}

/**
 * Replace comments with whitespace, keeping every newline so line numbers and
 * offsets still match the original file.
 */
export function stripComments(source: string): string {
  let out = '';
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      const end = skipString(source, i);
      out += source.slice(i, end + 1);
      i = end;
    } else if (source.startsWith('//', i)) {
      const end = source.indexOf('\n', i);
      out += ' '.repeat((end === -1 ? source.length : end) - i);
      i = (end === -1 ? source.length : end) - 1;
    } else if (source.startsWith('/*', i)) {
      const end = source.indexOf('*/', i + 2);
      const stop = end === -1 ? source.length : end + 2;
      out += blank(source.slice(i, stop));
      i = stop - 1;
    } else {
      out += ch;
    }
  }
  return out;
}

/**
 * Replace the contents of string and template literals with spaces, keeping
 * the quotes, the length and every newline. Use it before matching patterns
 * that would otherwise fire on code quoted inside a template.
 */
export function maskStrings(source: string): string {
  let out = '';
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      const end = skipString(source, i);
      out += ch + blank(source.slice(i + 1, end)) + (end < source.length ? source[end] : '');
      i = end;
    } else {
      out += ch;
    }
  }
  return out;
}

/** The 1-based line number of `index` in `source`. */
export function lineAt(source: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i++) {
    if (source[i] === '\n') line++;
  }
  return line;
}

/** Same length as `text`, with every character but the newlines blanked out. */
function blank(text: string): string {
  return text.replace(/[^\n]/g, ' ');
}
