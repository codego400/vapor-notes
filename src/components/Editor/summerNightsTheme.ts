import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const summerNightsEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#E8D8F0",
      backgroundColor: "#0F0A1E",
    },
    ".cm-content": {
      caretColor: "#FFD700",
      lineHeight: "1.7",
      padding: "16px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#FFD700",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      {
        backgroundColor: "rgba(255, 107, 107, 0.18)",
      },
    ".cm-panels": { backgroundColor: "#0A0716", color: "#E8D8F0" },
    ".cm-panels.cm-panels-top": { borderBottom: "1px solid #2A1E40" },
    ".cm-panels.cm-panels-bottom": { borderTop: "1px solid #2A1E40" },
    ".cm-searchMatch": {
      backgroundColor: "rgba(255, 215, 0, 0.15)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "rgba(255, 107, 107, 0.3)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(107, 91, 149, 0.1)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(255, 215, 0, 0.1)",
    },
    "&.cm-focused .cm-matchingBracket": {
      backgroundColor: "rgba(255, 215, 0, 0.3)",
    },
    ".cm-gutters": {
      backgroundColor: "#0A0716",
      color: "#3A2E55",
      border: "none",
      borderRight: "1px solid #2A1E40",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(107, 91, 149, 0.1)",
      color: "#FF6B6B",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#FF6B6B",
    },
    ".cm-tooltip": {
      border: "1px solid #2A1E40",
      backgroundColor: "#0A0716",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "rgba(255, 107, 107, 0.18)",
      },
    },
  },
  { dark: true },
);

const summerNightsHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#FF6B6B" },
  { tag: tags.operator, color: "#FFD700" },
  { tag: tags.special(tags.variableName), color: "#FF9E64" },
  { tag: tags.typeName, color: "#B8A0E0" },
  { tag: tags.atom, color: "#FF9E64" },
  { tag: tags.number, color: "#FF9E64" },
  { tag: tags.bool, color: "#FF9E64" },
  { tag: tags.string, color: "#FFD0A0" },
  { tag: tags.special(tags.string), color: "#FFD0A0" },
  { tag: tags.comment, color: "#3A2E55", fontStyle: "italic" },
  { tag: tags.variableName, color: "#E8D8F0" },
  { tag: tags.function(tags.variableName), color: "#FFD700" },
  { tag: tags.definition(tags.variableName), color: "#B8A0E0" },
  {
    tag: tags.heading,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  {
    tag: tags.heading1,
    color: "#FF6B6B",
    fontWeight: "bold",
    fontSize: "1.6em",
  },
  {
    tag: tags.heading2,
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: "1.4em",
  },
  {
    tag: tags.heading3,
    color: "#B8A0E0",
    fontWeight: "bold",
    fontSize: "1.2em",
  },
  { tag: tags.emphasis, fontStyle: "italic", color: "#FFD0A0" },
  { tag: tags.strong, fontWeight: "bold", color: "#FF9E64" },
  { tag: tags.link, color: "#FFD700", textDecoration: "underline" },
  { tag: tags.url, color: "#FFD700" },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through",
  },
  { tag: tags.meta, color: "#3A2E55" },
  { tag: tags.quote, color: "#9A88B8", fontStyle: "italic" },
  {
    tag: tags.monospace,
    color: "#FFD700",
    fontFamily: "'Share Tech Mono', monospace",
  },
  { tag: tags.processingInstruction, color: "#FF6B6B" },
  { tag: tags.contentSeparator, color: "#2A1E40" },
]);

export const summerNightsTheme = [
  summerNightsEditorTheme,
  syntaxHighlighting(summerNightsHighlightStyle),
];
