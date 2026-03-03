import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const matrixEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#00FF41",
      backgroundColor: "#020502",
    },
    ".cm-content": {
      caretColor: "#33FF33",
      lineHeight: "1.7",
      padding: "16px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#33FF33",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      {
        backgroundColor: "rgba(0, 255, 65, 0.2)",
      },
    ".cm-panels": { backgroundColor: "#000000", color: "#00FF41" },
    ".cm-panels.cm-panels-top": { borderBottom: "1px solid #0a1a0a" },
    ".cm-panels.cm-panels-bottom": { borderTop: "1px solid #0a1a0a" },
    ".cm-searchMatch": {
      backgroundColor: "rgba(51, 255, 51, 0.15)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "rgba(136, 255, 136, 0.3)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(0, 255, 65, 0.06)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(51, 255, 51, 0.15)",
    },
    "&.cm-focused .cm-matchingBracket": {
      backgroundColor: "rgba(136, 255, 136, 0.4)",
    },
    ".cm-gutters": {
      backgroundColor: "#000000",
      color: "#1a4a1a",
      border: "none",
      borderRight: "1px solid #0a1a0a",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(0, 255, 65, 0.06)",
      color: "#00FF41",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#00FF41",
    },
    ".cm-tooltip": {
      border: "1px solid #0a1a0a",
      backgroundColor: "#000000",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "rgba(0, 255, 65, 0.2)",
      },
    },
  },
  { dark: true },
);

const matrixHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#00FF41" },
  { tag: tags.operator, color: "#33FF33" },
  { tag: tags.special(tags.variableName), color: "#88FF88" },
  { tag: tags.typeName, color: "#66FF66" },
  { tag: tags.atom, color: "#88FF88" },
  { tag: tags.number, color: "#88FF88" },
  { tag: tags.bool, color: "#88FF88" },
  { tag: tags.string, color: "#44DD44" },
  { tag: tags.special(tags.string), color: "#44DD44" },
  { tag: tags.comment, color: "#1a4a1a", fontStyle: "italic" },
  { tag: tags.variableName, color: "#00FF41" },
  { tag: tags.function(tags.variableName), color: "#33FF33" },
  { tag: tags.definition(tags.variableName), color: "#66FF66" },
  {
    tag: tags.heading,
    color: "#00FF41",
    fontWeight: "bold",
  },
  {
    tag: tags.heading1,
    color: "#00FF41",
    fontWeight: "bold",
    fontSize: "1.6em",
  },
  {
    tag: tags.heading2,
    color: "#00CC33",
    fontWeight: "bold",
    fontSize: "1.4em",
  },
  {
    tag: tags.heading3,
    color: "#66FF66",
    fontWeight: "bold",
    fontSize: "1.2em",
  },
  { tag: tags.emphasis, fontStyle: "italic", color: "#44DD44" },
  { tag: tags.strong, fontWeight: "bold", color: "#88FF88" },
  { tag: tags.link, color: "#33FF33", textDecoration: "underline" },
  { tag: tags.url, color: "#33FF33" },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through",
  },
  { tag: tags.meta, color: "#1a4a1a" },
  { tag: tags.quote, color: "#00CC33", fontStyle: "italic" },
  {
    tag: tags.monospace,
    color: "#33FF33",
    fontFamily: "'Share Tech Mono', monospace",
  },
  { tag: tags.processingInstruction, color: "#00FF41" },
  { tag: tags.contentSeparator, color: "#0d2b0d" },
]);

export const matrixTheme = [
  matrixEditorTheme,
  syntaxHighlighting(matrixHighlightStyle),
];
