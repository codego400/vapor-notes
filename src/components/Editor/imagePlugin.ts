import {
  EditorView,
  ViewPlugin,
  Decoration,
  DecorationSet,
  WidgetType,
  ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { readImageBase64 } from "../../commands/tauriCommands";

// Cache: absolute path → data URL
const imageCache = new Map<string, string>();
// Track in-flight loads to avoid duplicate requests
const loading = new Set<string>();

function getMimeType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() || "png";
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/png";
  }
}

function resolveAbsolutePath(rawSrc: string): string | null {
  if (rawSrc.startsWith("http://") || rawSrc.startsWith("https://") || rawSrc.startsWith("data:")) {
    return null; // already a full URL, no resolution needed
  }
  const dir = document.documentElement.dataset.notesDir;
  if (dir) {
    return `${dir}/${rawSrc}`;
  }
  return null;
}

function resolveImageSrc(rawSrc: string): string {
  if (rawSrc.startsWith("http://") || rawSrc.startsWith("https://") || rawSrc.startsWith("data:")) {
    return rawSrc;
  }
  const absPath = resolveAbsolutePath(rawSrc);
  if (absPath && imageCache.has(absPath)) {
    return imageCache.get(absPath)!;
  }
  // Return empty string — will be loaded async
  return "";
}

class ImageWidget extends WidgetType {
  constructor(
    readonly src: string,
    readonly alt: string,
    readonly rawSrc: string,
  ) {
    super();
  }

  toDOM(view: EditorView) {
    const wrapper = document.createElement("div");
    wrapper.className = "cm-image-widget";
    const img = document.createElement("img");
    img.alt = this.alt;
    img.className = "cm-image-inline";

    if (this.src) {
      // Already have a URL (web URL, data URL, or cached)
      img.src = this.src;
      img.onerror = () => {
        wrapper.textContent = `[image not found: ${this.alt || this.rawSrc}]`;
        wrapper.className = "cm-image-error";
      };
    } else {
      // Need to load from disk via Tauri command
      const absPath = resolveAbsolutePath(this.rawSrc);
      if (absPath && !loading.has(absPath)) {
        loading.add(absPath);
        readImageBase64(absPath)
          .then((base64) => {
            const mime = getMimeType(absPath);
            const dataUrl = `data:${mime};base64,${base64}`;
            imageCache.set(absPath, dataUrl);
            loading.delete(absPath);
            // Force CodeMirror to rebuild decorations so the widget refreshes
            view.dispatch({ effects: [] });
          })
          .catch(() => {
            loading.delete(absPath);
            wrapper.textContent = `[image not found: ${this.alt || this.rawSrc}]`;
            wrapper.className = "cm-image-error";
          });
      }
      // Show nothing while loading
    }

    wrapper.appendChild(img);
    return wrapper;
  }

  eq(other: ImageWidget) {
    return this.src === other.src && this.rawSrc === other.rawSrc;
  }

  ignoreEvent() {
    return false;
  }
}

function buildImageDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const { state } = view;
  const cursorLine = state.doc.lineAt(state.selection.main.head).number;
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

  for (const { from, to } of view.visibleRanges) {
    const text = state.sliceDoc(from, to);
    let match;
    while ((match = imageRegex.exec(text)) !== null) {
      const matchFrom = from + match.index;
      const matchLine = state.doc.lineAt(matchFrom).number;

      if (matchLine === cursorLine) continue;

      const matchTo = matchFrom + match[0].length;
      const rawSrc = match[2];
      const src = resolveImageSrc(rawSrc);

      builder.add(
        matchFrom,
        matchTo,
        Decoration.replace({
          widget: new ImageWidget(src, match[1], rawSrc),
        }),
      );
    }
  }

  return builder.finish();
}

export const imagePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildImageDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = buildImageDecorations(update.view);
      }
    }
  },
  { decorations: (v) => v.decorations },
);
