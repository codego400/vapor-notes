import { EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";

/**
 * Toggle inline markdown wrapper (e.g. ** for bold, ~~ for strikethrough).
 * If text is selected and already wrapped, unwraps. Otherwise wraps.
 * If no selection, inserts the wrapper pair with cursor in the middle.
 */
function toggleInlineMarkup(view: EditorView, marker: string): boolean {
  const { state } = view;
  const changes = state.changeByRange((range) => {
    const selected = state.sliceDoc(range.from, range.to);
    const len = marker.length;

    // Check if selection itself is already wrapped
    if (selected.startsWith(marker) && selected.endsWith(marker) && selected.length >= len * 2) {
      const unwrapped = selected.slice(len, -len);
      return {
        changes: { from: range.from, to: range.to, insert: unwrapped },
        range: EditorSelection.range(range.from, range.from + unwrapped.length),
      };
    }

    // Check if surrounding text wraps the selection
    const before = state.sliceDoc(Math.max(0, range.from - len), range.from);
    const after = state.sliceDoc(range.to, Math.min(state.doc.length, range.to + len));
    if (before === marker && after === marker) {
      return {
        changes: [
          { from: range.from - len, to: range.from, insert: "" },
          { from: range.to, to: range.to + len, insert: "" },
        ],
        range: EditorSelection.range(range.from - len, range.to - len),
      };
    }

    // No selection: insert markers and place cursor in the middle
    if (range.from === range.to) {
      const insert = marker + marker;
      return {
        changes: { from: range.from, to: range.to, insert },
        range: EditorSelection.cursor(range.from + len),
      };
    }

    // Wrap selected text
    const wrapped = marker + selected + marker;
    return {
      changes: { from: range.from, to: range.to, insert: wrapped },
      range: EditorSelection.range(range.from, range.from + wrapped.length),
    };
  });

  view.dispatch(changes, { scrollIntoView: true, userEvent: "input" });
  return true;
}

export function toggleBold(view: EditorView): boolean {
  return toggleInlineMarkup(view, "**");
}

export function toggleItalic(view: EditorView): boolean {
  return toggleInlineMarkup(view, "*");
}

export function toggleStrikethrough(view: EditorView): boolean {
  return toggleInlineMarkup(view, "~~");
}

export function toggleUnderline(view: EditorView): boolean {
  const { state } = view;
  const openTag = "<u>";
  const closeTag = "</u>";

  const changes = state.changeByRange((range) => {
    const selected = state.sliceDoc(range.from, range.to);

    // Check if selection itself is already wrapped
    if (selected.startsWith(openTag) && selected.endsWith(closeTag)) {
      const unwrapped = selected.slice(openTag.length, -closeTag.length);
      return {
        changes: { from: range.from, to: range.to, insert: unwrapped },
        range: EditorSelection.range(range.from, range.from + unwrapped.length),
      };
    }

    // Check if surrounding text wraps the selection
    const before = state.sliceDoc(Math.max(0, range.from - openTag.length), range.from);
    const after = state.sliceDoc(range.to, Math.min(state.doc.length, range.to + closeTag.length));
    if (before === openTag && after === closeTag) {
      return {
        changes: [
          { from: range.from - openTag.length, to: range.from, insert: "" },
          { from: range.to, to: range.to + closeTag.length, insert: "" },
        ],
        range: EditorSelection.range(range.from - openTag.length, range.to - openTag.length),
      };
    }

    // No selection: insert tags and place cursor in the middle
    if (range.from === range.to) {
      const insert = openTag + closeTag;
      return {
        changes: { from: range.from, to: range.to, insert },
        range: EditorSelection.cursor(range.from + openTag.length),
      };
    }

    // Wrap selected text
    const wrapped = openTag + selected + closeTag;
    return {
      changes: { from: range.from, to: range.to, insert: wrapped },
      range: EditorSelection.range(range.from, range.from + wrapped.length),
    };
  });

  view.dispatch(changes, { scrollIntoView: true, userEvent: "input" });
  return true;
}

/**
 * Set the heading level of the current line(s).
 * level 0 = body (remove heading), 1 = # Title, 2 = ## Heading, 3 = ### Subheading
 */
export function setHeadingLevel(view: EditorView, level: 0 | 1 | 2 | 3): boolean {
  const { state } = view;
  const prefix = level > 0 ? "#".repeat(level) + " " : "";
  const headingRegex = /^#{1,6}\s/;

  const changes: { from: number; to: number; insert: string }[] = [];
  const { from, to } = state.selection.main;

  // Process all lines touched by the selection
  const startLine = state.doc.lineAt(from).number;
  const endLine = state.doc.lineAt(to).number;

  for (let lineNum = startLine; lineNum <= endLine; lineNum++) {
    const line = state.doc.line(lineNum);
    const match = line.text.match(headingRegex);
    if (match) {
      changes.push({ from: line.from, to: line.from + match[0].length, insert: prefix });
    } else if (prefix) {
      changes.push({ from: line.from, to: line.from, insert: prefix });
    }
  }

  if (changes.length > 0) {
    view.dispatch({ changes, userEvent: "input" });
  }
  return true;
}

/**
 * Detect the heading level of the line at the current cursor position.
 * Returns 0 for body, 1-3 for heading levels (4-6 are clamped to 3).
 */
export function getCurrentHeadingLevel(view: EditorView): 0 | 1 | 2 | 3 {
  const { state } = view;
  const line = state.doc.lineAt(state.selection.main.head);
  const match = line.text.match(/^(#{1,6})\s/);
  if (!match) return 0;
  return Math.min(match[1].length, 3) as 1 | 2 | 3;
}
