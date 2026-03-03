import {
  EditorView,
  ViewPlugin,
  Decoration,
  type DecorationSet,
  type ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { open } from "@tauri-apps/plugin-shell";

// Markdown links: [text](url) but NOT ![text](url)
const mdLinkRegex = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;

// Raw URLs not inside markdown link parentheses
const rawUrlRegex = /https?:\/\/[^\s<>\[\]()]+/g;

function buildLinkDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const { state } = view;
  const decos: { from: number; to: number; deco: Decoration }[] = [];

  for (const { from, to } of view.visibleRanges) {
    const text = state.sliceDoc(from, to);

    // Markdown links — decorate the text portion
    let match;
    mdLinkRegex.lastIndex = 0;
    while ((match = mdLinkRegex.exec(text)) !== null) {
      const linkText = match[1];
      const url = match[2];
      const textFrom = from + match.index + 1; // after '['
      const textTo = textFrom + linkText.length; // before ']'

      decos.push({
        from: textFrom,
        to: textTo,
        deco: Decoration.mark({
          class: "cm-link",
          attributes: { "data-href": url },
        }),
      });
    }

    // Raw URLs — skip those inside markdown link parens
    rawUrlRegex.lastIndex = 0;
    while ((match = rawUrlRegex.exec(text)) !== null) {
      const url = match[0];
      const urlFrom = from + match.index;
      const urlTo = urlFrom + url.length;

      // Skip if preceded by ]( — it's part of a markdown link
      const prefix = state.sliceDoc(Math.max(0, urlFrom - 2), urlFrom);
      if (prefix.endsWith("](")) continue;

      decos.push({
        from: urlFrom,
        to: urlTo,
        deco: Decoration.mark({
          class: "cm-link",
          attributes: { "data-href": url },
        }),
      });
    }
  }

  // RangeSetBuilder requires sorted ranges
  decos.sort((a, b) => a.from - b.from || a.to - b.to);
  for (const d of decos) {
    builder.add(d.from, d.to, d.deco);
  }

  return builder.finish();
}

const linkDecorationPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildLinkDecorations(view);
    }
    update(update: ViewUpdate) {
      if (
        update.docChanged ||
        update.selectionSet ||
        update.viewportChanged
      ) {
        this.decorations = buildLinkDecorations(update.view);
      }
    }
  },
  { decorations: (v) => v.decorations },
);

const linkClickHandler = EditorView.domEventHandlers({
  click(event: MouseEvent, view: EditorView) {
    if (!event.metaKey && !event.ctrlKey) return false;

    let target = event.target as HTMLElement | null;
    while (target && target !== view.dom) {
      if (target.classList.contains("cm-link")) {
        const href = target.dataset.href;
        if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
          event.preventDefault();
          open(href).catch(() => {});
          return true;
        }
      }
      target = target.parentElement;
    }
    return false;
  },
});

const linkModKeyHandler = EditorView.domEventHandlers({
  keydown(event: KeyboardEvent, view: EditorView) {
    if (event.key === "Meta" || event.key === "Control") {
      view.dom.classList.add("cm-link-mod-held");
    }
    return false;
  },
  keyup(event: KeyboardEvent, view: EditorView) {
    if (event.key === "Meta" || event.key === "Control") {
      view.dom.classList.remove("cm-link-mod-held");
    }
    return false;
  },
  blur(_event: FocusEvent, view: EditorView) {
    view.dom.classList.remove("cm-link-mod-held");
    return false;
  },
});

export const linkPlugin = [linkDecorationPlugin, linkClickHandler, linkModKeyHandler];
