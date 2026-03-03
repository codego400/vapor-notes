import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const halloweenEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#E0D0C0",
      backgroundColor: "#0A0A0A",
    },
    ".cm-content": {
      caretColor: "#FF6600",
      lineHeight: "1.7",
      padding: "16px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#FF6600",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      {
        backgroundColor: "rgba(255, 102, 0, 0.18)",
      },
    ".cm-panels": { backgroundColor: "#060606", color: "#E0D0C0" },
    ".cm-panels.cm-panels-top": { borderBottom: "1px solid #2A1A2A" },
    ".cm-panels.cm-panels-bottom": { borderTop: "1px solid #2A1A2A" },
    ".cm-searchMatch": {
      backgroundColor: "rgba(255, 102, 0, 0.15)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "rgba(139, 0, 255, 0.3)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(255, 102, 0, 0.05)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(57, 255, 20, 0.1)",
    },
    "&.cm-focused .cm-matchingBracket": {
      backgroundColor: "rgba(255, 102, 0, 0.3)",
    },
    ".cm-gutters": {
      backgroundColor: "#060606",
      color: "#3A2A1A",
      border: "none",
      borderRight: "1px solid #2A1A2A",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(255, 102, 0, 0.05)",
      color: "#FF6600",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#8B00FF",
    },
    ".cm-tooltip": {
      border: "1px solid #2A1A2A",
      backgroundColor: "#060606",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "rgba(255, 102, 0, 0.18)",
      },
    },
  },
  { dark: true },
);

const halloweenHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#8B00FF" },
  { tag: tags.operator, color: "#FF6600" },
  { tag: tags.special(tags.variableName), color: "#39FF14" },
  { tag: tags.typeName, color: "#CC66FF" },
  { tag: tags.atom, color: "#39FF14" },
  { tag: tags.number, color: "#39FF14" },
  { tag: tags.bool, color: "#39FF14" },
  { tag: tags.string, color: "#FFB366" },
  { tag: tags.special(tags.string), color: "#FFB366" },
  { tag: tags.comment, color: "#3A2A1A", fontStyle: "italic" },
  { tag: tags.variableName, color: "#E0D0C0" },
  { tag: tags.function(tags.variableName), color: "#FF6600" },
  { tag: tags.definition(tags.variableName), color: "#CC66FF" },
  {
    tag: tags.heading,
    color: "#FF6600",
    fontWeight: "bold",
  },
  {
    tag: tags.heading1,
    color: "#FF6600",
    fontWeight: "bold",
    fontSize: "1.6em",
  },
  {
    tag: tags.heading2,
    color: "#8B00FF",
    fontWeight: "bold",
    fontSize: "1.4em",
  },
  {
    tag: tags.heading3,
    color: "#39FF14",
    fontWeight: "bold",
    fontSize: "1.2em",
  },
  { tag: tags.emphasis, fontStyle: "italic", color: "#FFB366" },
  { tag: tags.strong, fontWeight: "bold", color: "#FF6600" },
  { tag: tags.link, color: "#8B00FF", textDecoration: "underline" },
  { tag: tags.url, color: "#8B00FF" },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through",
  },
  { tag: tags.meta, color: "#3A2A1A" },
  { tag: tags.quote, color: "#B8886A", fontStyle: "italic" },
  {
    tag: tags.monospace,
    color: "#39FF14",
    fontFamily: "'Share Tech Mono', monospace",
  },
  { tag: tags.processingInstruction, color: "#8B00FF" },
  { tag: tags.contentSeparator, color: "#2A1A2A" },
]);

export const halloweenTheme = [
  halloweenEditorTheme,
  syntaxHighlighting(halloweenHighlightStyle),
];
