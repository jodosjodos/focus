// Deliberately minimal: two markers, no nesting, no markdown library.
// **bold** and ==highlight== are the only two formatting affordances Journal
// exposes, matching the "simplest one" bar — enough to feel like real
// formatting without building a rich-text editor.

export interface RichTextSegment {
  text: string;
  bold?: boolean;
  highlight?: boolean;
}

const TOKEN_RE = /\*\*(.+?)\*\*|==(.+?)==/g;

export function parseRichText(input: string): RichTextSegment[] {
  const segments: RichTextSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(input))) {
    if (match.index > lastIndex) {
      segments.push({ text: input.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ text: match[1], bold: true });
    } else if (match[2] !== undefined) {
      segments.push({ text: match[2], highlight: true });
    }
    lastIndex = TOKEN_RE.lastIndex;
  }
  if (lastIndex < input.length) {
    segments.push({ text: input.slice(lastIndex) });
  }
  return segments;
}
