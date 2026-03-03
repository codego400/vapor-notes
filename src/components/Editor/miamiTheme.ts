import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const miamiEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#F0E6FF",
      backgroundColor: "#0A0A1A",
    },
    ".cm-content": {
      caretColor: "#0BD3D3",
      lineHeight: "1.7",
      padding: "16px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#0BD3D3",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      {
        backgroundColor: "rgba(248, 144, 231, 0.2)",
      },
    ".cm-panels": { backgroundColor: "#060614", color: "#F0E6FF" },
    ".cm-panels.cm-panels-top": { borderBottom: "1px solid #0E0E24" },
    ".cm-panels.cm-panels-bottom": { borderTop: "1px solid #0E0E24" },
    ".cm-searchMatch": {
      backgroundColor: "rgba(11, 211, 211, 0.15)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "rgba(255, 107, 107, 0.3)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(11, 211, 211, 0.06)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(11, 211, 211, 0.15)",
    },
    "&.cm-focused .cm-matchingBracket": {
      backgroundColor: "rgba(255, 107, 107, 0.4)",
    },
    ".cm-gutters": {
      backgroundColor: "#060614",
      color: "#4A3A6A",
      border: "none",
      borderRight: "1px solid #0E0E24",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(11, 211, 211, 0.06)",
      color: "#F890E7",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#F890E7",
    },
    ".cm-tooltip": {
      border: "1px solid #0E0E24",
      backgroundColor: "#060614",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "rgba(248, 144, 231, 0.2)",
      },
    },
  },
  { dark: true },
);

const miamiHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#F890E7" },
  { tag: tags.operator, color: "#0BD3D3" },
  { tag: tags.special(tags.variableName), color: "#FF6B6B" },
  { tag: tags.typeName, color: "#B8A9FF" },
  { tag: tags.atom, color: "#FF6B6B" },
  { tag: tags.number, color: "#FF6B6B" },
  { tag: tags.bool, color: "#FF6B6B" },
  { tag: tags.string, color: "#FFB8F0" },
  { tag: tags.special(tags.string), color: "#FFB8F0" },
  { tag: tags.comment, color: "#4A3A6A", fontStyle: "italic" },
  { tag: tags.variableName, color: "#F0E6FF" },
  { tag: tags.function(tags.variableName), color: "#0BD3D3" },
  { tag: tags.definition(tags.variableName), color: "#B8A9FF" },
  {
    tag: tags.heading,
    color: "#F890E7",
    fontWeight: "bold",
  },
  {
    tag: tags.heading1,
    color: "#F890E7",
    fontWeight: "bold",
    fontSize: "1.6em",
  },
  {
    tag: tags.heading2,
    color: "#0BD3D3",
    fontWeight: "bold",
    fontSize: "1.4em",
  },
  {
    tag: tags.heading3,
    color: "#B8A9FF",
    fontWeight: "bold",
    fontSize: "1.2em",
  },
  { tag: tags.emphasis, fontStyle: "italic", color: "#FFB8F0" },
  { tag: tags.strong, fontWeight: "bold", color: "#FF6B6B" },
  { tag: tags.link, color: "#0BD3D3", textDecoration: "underline" },
  { tag: tags.url, color: "#0BD3D3" },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through",
  },
  { tag: tags.meta, color: "#4A3A6A" },
  { tag: tags.quote, color: "#B8A0D0", fontStyle: "italic" },
  {
    tag: tags.monospace,
    color: "#0BD3D3",
    fontFamily: "'Share Tech Mono', monospace",
  },
  { tag: tags.processingInstruction, color: "#F890E7" },
  { tag: tags.contentSeparator, color: "#1A1A3E" },
]);

export const miamiTheme = [
  miamiEditorTheme,
  syntaxHighlighting(miamiHighlightStyle),
];
