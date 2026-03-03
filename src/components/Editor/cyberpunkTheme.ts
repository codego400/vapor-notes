import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const cyberpunkEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#E0E0E0",
      backgroundColor: "#0D0D0D",
    },
    ".cm-content": {
      caretColor: "#FCEE09",
      lineHeight: "1.7",
      padding: "16px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#FCEE09",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      {
        backgroundColor: "rgba(252, 238, 9, 0.15)",
      },
    ".cm-panels": { backgroundColor: "#0A0A0A", color: "#E0E0E0" },
    ".cm-panels.cm-panels-top": { borderBottom: "1px solid #2A2A2A" },
    ".cm-panels.cm-panels-bottom": { borderTop: "1px solid #2A2A2A" },
    ".cm-searchMatch": {
      backgroundColor: "rgba(252, 238, 9, 0.15)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "rgba(255, 0, 60, 0.3)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(252, 238, 9, 0.05)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(0, 240, 255, 0.12)",
    },
    "&.cm-focused .cm-matchingBracket": {
      backgroundColor: "rgba(252, 238, 9, 0.3)",
    },
    ".cm-gutters": {
      backgroundColor: "#0A0A0A",
      color: "#3A3A3A",
      border: "none",
      borderRight: "1px solid #1A1A1A",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(252, 238, 9, 0.05)",
      color: "#FCEE09",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#FF003C",
    },
    ".cm-tooltip": {
      border: "1px solid #2A2A2A",
      backgroundColor: "#0A0A0A",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "rgba(252, 238, 9, 0.15)",
      },
    },
  },
  { dark: true },
);

const cyberpunkHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#FF003C" },
  { tag: tags.operator, color: "#00F0FF" },
  { tag: tags.special(tags.variableName), color: "#FCEE09" },
  { tag: tags.typeName, color: "#00F0FF" },
  { tag: tags.atom, color: "#FCEE09" },
  { tag: tags.number, color: "#FCEE09" },
  { tag: tags.bool, color: "#FCEE09" },
  { tag: tags.string, color: "#7DF9FF" },
  { tag: tags.special(tags.string), color: "#7DF9FF" },
  { tag: tags.comment, color: "#3A3A3A", fontStyle: "italic" },
  { tag: tags.variableName, color: "#E0E0E0" },
  { tag: tags.function(tags.variableName), color: "#00F0FF" },
  { tag: tags.definition(tags.variableName), color: "#FCEE09" },
  {
    tag: tags.heading,
    color: "#FF003C",
    fontWeight: "bold",
  },
  {
    tag: tags.heading1,
    color: "#FF003C",
    fontWeight: "bold",
    fontSize: "1.6em",
  },
  {
    tag: tags.heading2,
    color: "#FCEE09",
    fontWeight: "bold",
    fontSize: "1.4em",
  },
  {
    tag: tags.heading3,
    color: "#00F0FF",
    fontWeight: "bold",
    fontSize: "1.2em",
  },
  { tag: tags.emphasis, fontStyle: "italic", color: "#7DF9FF" },
  { tag: tags.strong, fontWeight: "bold", color: "#FCEE09" },
  { tag: tags.link, color: "#00F0FF", textDecoration: "underline" },
  { tag: tags.url, color: "#00F0FF" },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through",
  },
  { tag: tags.meta, color: "#3A3A3A" },
  { tag: tags.quote, color: "#888888", fontStyle: "italic" },
  {
    tag: tags.monospace,
    color: "#00F0FF",
    fontFamily: "'Share Tech Mono', monospace",
  },
  { tag: tags.processingInstruction, color: "#FF003C" },
  { tag: tags.contentSeparator, color: "#2A2A2A" },
]);

export const cyberpunkTheme = [
  cyberpunkEditorTheme,
  syntaxHighlighting(cyberpunkHighlightStyle),
];
