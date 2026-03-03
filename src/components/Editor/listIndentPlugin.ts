import {
  EditorView,
  ViewPlugin,
  Decoration,
  type DecorationSet,
  type ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

// Matches list lines: optional whitespace, then marker (-, *, +, or 1.), then space
const listLineRegex = /^(\s*)([-*+]|\d+\.)\s/;

function buildListIndentDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const tabSize = view.state.tabSize;

  for (const { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to; ) {
      const line = view.state.doc.lineAt(pos);
      const match = line.text.match(listLineRegex);

      if (match) {
        const leadingWS = match[1];
        const marker = match[2];

        // Calculate visual column where text starts (after marker + space)
        let visualCol = 0;
        for (const ch of leadingWS) {
          if (ch === "\t") {
            visualCol += tabSize - (visualCol % tabSize);
          } else {
            visualCol += 1;
          }
        }
        visualCol += marker.length + 1; // marker + trailing space

        builder.add(
          line.from,
          line.from,
          Decoration.line({
            attributes: {
              style: `padding-left: ${visualCol}ch; text-indent: -${visualCol}ch;`,
            },
          }),
        );
      }

      pos = line.to + 1;
    }
  }

  return builder.finish();
}

export const listIndentPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildListIndentDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildListIndentDecorations(update.view);
      }
    }
  },
  { decorations: (v) => v.decorations },
);
