import {
  EditorView,
  ViewPlugin,
  Decoration,
  DecorationSet,
  ViewUpdate,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";

const hide = Decoration.replace({});
const underlineMark = Decoration.mark({ class: "cm-underline" });

function buildDecorations(view: EditorView): DecorationSet {
  const underlineRegex = /<u>([\s\S]*?)<\/u>/g;
  const builder = new RangeSetBuilder<Decoration>();
  const { state } = view;
  const cursorHead = state.selection.main.head;
  const cursorAnchor = state.selection.main.anchor;
  const selFrom = Math.min(cursorHead, cursorAnchor);
  const selTo = Math.max(cursorHead, cursorAnchor);
  const cursorLine = state.doc.lineAt(cursorHead).number;

  // Collect decoration ranges (hide + mark), then sort by `from` position
  const decos: { from: number; to: number; deco: typeof hide }[] = [];

  for (const { from, to } of view.visibleRanges) {
    // --- Syntax-tree-based hiding ---
    syntaxTree(state).iterate({
      from,
      to,
      enter(node) {
        // --- Heading marks (# ## ###) ---
        if (node.name === "HeaderMark") {
          const nodeLine = state.doc.lineAt(node.from).number;
          if (nodeLine !== cursorLine) {
            let hideEnd = node.to;
            if (state.sliceDoc(hideEnd, hideEnd + 1) === " ") {
              hideEnd += 1;
            }
            decos.push({ from: node.from, to: hideEnd, deco: hide });
          }
          return;
        }

        // --- Emphasis markers (* for italic, ** for bold) ---
        if (node.name === "EmphasisMark") {
          const parent = node.node.parent;
          if (parent && (parent.name === "StrongEmphasis" || parent.name === "Emphasis")) {
            if (selTo >= parent.from && selFrom <= parent.to) return;
            decos.push({ from: node.from, to: node.to, deco: hide });
          }
          return;
        }

        // --- Strikethrough markers (~~) ---
        if (node.name === "StrikethroughMark") {
          const parent = node.node.parent;
          if (parent) {
            if (selTo >= parent.from && selFrom <= parent.to) return;
            decos.push({ from: node.from, to: node.to, deco: hide });
          }
          return;
        }
      },
    });

    // --- Underline <u>...</u> tags (text-based since HTML tags aren't parsed as markdown) ---
    const text = state.sliceDoc(from, to);
    let match;
    while ((match = underlineRegex.exec(text)) !== null) {
      const matchFrom = from + match.index;
      const matchTo = matchFrom + match[0].length;
      const openEnd = matchFrom + 3; // <u>
      const closeStart = matchTo - 4; // </u>
      const cursorInRange = selTo >= matchFrom && selFrom <= matchTo;

      if (!cursorInRange) {
        // Hide <u> and </u> tags
        decos.push({ from: matchFrom, to: openEnd, deco: hide });
        decos.push({ from: closeStart, to: matchTo, deco: hide });
      }
      // Apply underline styling to the content between tags
      decos.push({ from: openEnd, to: closeStart, deco: underlineMark });
    }
  }

  // RangeSetBuilder requires sorted, non-overlapping ranges
  decos.sort((a, b) => a.from - b.from || a.to - b.to);
  for (const d of decos) {
    builder.add(d.from, d.to, d.deco);
  }

  return builder.finish();
}

export const hideMarkdownPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }
    update(update: ViewUpdate) {
      if (
        update.docChanged ||
        update.selectionSet ||
        update.viewportChanged
      ) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  { decorations: (v) => v.decorations },
);
