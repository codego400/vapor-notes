import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const blizzardEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#D0E8F2",
      backgroundColor: "#0B1929",
    },
    ".cm-content": {
      caretColor: "#A8D8EA",
      lineHeight: "1.7",
      padding: "16px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#A8D8EA",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      {
        backgroundColor: "rgba(168, 216, 234, 0.2)",
      },
    ".cm-panels": { backgroundColor: "#081420", color: "#D0E8F2" },
    ".cm-panels.cm-panels-top": { borderBottom: "1px solid #1A3050" },
    ".cm-panels.cm-panels-bottom": { borderTop: "1px solid #1A3050" },
    ".cm-searchMatch": {
      backgroundColor: "rgba(168, 216, 234, 0.15)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "rgba(240, 248, 255, 0.25)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(168, 216, 234, 0.06)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(98, 182, 203, 0.15)",
    },
    "&.cm-focused .cm-matchingBracket": {
      backgroundColor: "rgba(168, 216, 234, 0.3)",
    },
    ".cm-gutters": {
      backgroundColor: "#081420",
      color: "#2A4A6A",
      border: "none",
      borderRight: "1px solid #1A3050",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(168, 216, 234, 0.06)",
      color: "#A8D8EA",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#62B6CB",
    },
    ".cm-tooltip": {
      border: "1px solid #1A3050",
      backgroundColor: "#081420",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "rgba(168, 216, 234, 0.2)",
      },
    },
  },
  { dark: true },
);

const blizzardHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#62B6CB" },
  { tag: tags.operator, color: "#A8D8EA" },
  { tag: tags.special(tags.variableName), color: "#F0F8FF" },
  { tag: tags.typeName, color: "#88CCE0" },
  { tag: tags.atom, color: "#F0F8FF" },
  { tag: tags.number, color: "#F0F8FF" },
  { tag: tags.bool, color: "#F0F8FF" },
  { tag: tags.string, color: "#B0E0FF" },
  { tag: tags.special(tags.string), color: "#B0E0FF" },
  { tag: tags.comment, color: "#2A4A6A", fontStyle: "italic" },
  { tag: tags.variableName, color: "#D0E8F2" },
  { tag: tags.function(tags.variableName), color: "#A8D8EA" },
  { tag: tags.definition(tags.variableName), color: "#88CCE0" },
  {
    tag: tags.heading,
    color: "#A8D8EA",
    fontWeight: "bold",
  },
  {
    tag: tags.heading1,
    color: "#F0F8FF",
    fontWeight: "bold",
    fontSize: "1.6em",
  },
  {
    tag: tags.heading2,
    color: "#A8D8EA",
    fontWeight: "bold",
    fontSize: "1.4em",
  },
  {
    tag: tags.heading3,
    color: "#62B6CB",
    fontWeight: "bold",
    fontSize: "1.2em",
  },
  { tag: tags.emphasis, fontStyle: "italic", color: "#B0E0FF" },
  { tag: tags.strong, fontWeight: "bold", color: "#F0F8FF" },
  { tag: tags.link, color: "#A8D8EA", textDecoration: "underline" },
  { tag: tags.url, color: "#A8D8EA" },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through",
  },
  { tag: tags.meta, color: "#2A4A6A" },
  { tag: tags.quote, color: "#7AACBE", fontStyle: "italic" },
  {
    tag: tags.monospace,
    color: "#A8D8EA",
    fontFamily: "'Share Tech Mono', monospace",
  },
  { tag: tags.processingInstruction, color: "#62B6CB" },
  { tag: tags.contentSeparator, color: "#1A3050" },
]);

export const blizzardTheme = [
  blizzardEditorTheme,
  syntaxHighlighting(blizzardHighlightStyle),
];
