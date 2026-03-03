import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const solarEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#F5E6C8",
      backgroundColor: "#1A1200",
    },
    ".cm-content": {
      caretColor: "#FFB627",
      lineHeight: "1.7",
      padding: "16px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#FFB627",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      {
        backgroundColor: "rgba(255, 182, 39, 0.18)",
      },
    ".cm-panels": { backgroundColor: "#120D00", color: "#F5E6C8" },
    ".cm-panels.cm-panels-top": { borderBottom: "1px solid #3D2E00" },
    ".cm-panels.cm-panels-bottom": { borderTop: "1px solid #3D2E00" },
    ".cm-searchMatch": {
      backgroundColor: "rgba(255, 182, 39, 0.15)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "rgba(255, 107, 53, 0.3)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(255, 182, 39, 0.06)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(255, 182, 39, 0.12)",
    },
    "&.cm-focused .cm-matchingBracket": {
      backgroundColor: "rgba(255, 182, 39, 0.3)",
    },
    ".cm-gutters": {
      backgroundColor: "#120D00",
      color: "#5A4520",
      border: "none",
      borderRight: "1px solid #3D2E00",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(255, 182, 39, 0.06)",
      color: "#FFB627",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#FF6B35",
    },
    ".cm-tooltip": {
      border: "1px solid #3D2E00",
      backgroundColor: "#120D00",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "rgba(255, 182, 39, 0.18)",
      },
    },
  },
  { dark: true },
);

const solarHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#FF6B35" },
  { tag: tags.operator, color: "#FFB627" },
  { tag: tags.special(tags.variableName), color: "#FFD866" },
  { tag: tags.typeName, color: "#FFCC80" },
  { tag: tags.atom, color: "#FFD866" },
  { tag: tags.number, color: "#FFD866" },
  { tag: tags.bool, color: "#FFD866" },
  { tag: tags.string, color: "#FFE0A0" },
  { tag: tags.special(tags.string), color: "#FFE0A0" },
  { tag: tags.comment, color: "#5A4520", fontStyle: "italic" },
  { tag: tags.variableName, color: "#F5E6C8" },
  { tag: tags.function(tags.variableName), color: "#FFB627" },
  { tag: tags.definition(tags.variableName), color: "#FFCC80" },
  {
    tag: tags.heading,
    color: "#FFB627",
    fontWeight: "bold",
  },
  {
    tag: tags.heading1,
    color: "#FFB627",
    fontWeight: "bold",
    fontSize: "1.6em",
  },
  {
    tag: tags.heading2,
    color: "#FF6B35",
    fontWeight: "bold",
    fontSize: "1.4em",
  },
  {
    tag: tags.heading3,
    color: "#FFCC80",
    fontWeight: "bold",
    fontSize: "1.2em",
  },
  { tag: tags.emphasis, fontStyle: "italic", color: "#FFE0A0" },
  { tag: tags.strong, fontWeight: "bold", color: "#FFD866" },
  { tag: tags.link, color: "#FFB627", textDecoration: "underline" },
  { tag: tags.url, color: "#FFB627" },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through",
  },
  { tag: tags.meta, color: "#5A4520" },
  { tag: tags.quote, color: "#C8A870", fontStyle: "italic" },
  {
    tag: tags.monospace,
    color: "#FFB627",
    fontFamily: "'Share Tech Mono', monospace",
  },
  { tag: tags.processingInstruction, color: "#FF6B35" },
  { tag: tags.contentSeparator, color: "#3D2E00" },
]);

export const solarTheme = [
  solarEditorTheme,
  syntaxHighlighting(solarHighlightStyle),
];
