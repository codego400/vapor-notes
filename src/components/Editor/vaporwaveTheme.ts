import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const vaporwaveEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#E8D5FF",
      backgroundColor: "#0F0225",
    },
    ".cm-content": {
      caretColor: "#00D4FF",
      lineHeight: "1.7",
      padding: "16px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#00D4FF",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      {
        backgroundColor: "rgba(233, 52, 121, 0.25)",
      },
    ".cm-panels": { backgroundColor: "#080118", color: "#E8D5FF" },
    ".cm-panels.cm-panels-top": { borderBottom: "1px solid #300350" },
    ".cm-panels.cm-panels-bottom": { borderTop: "1px solid #300350" },
    ".cm-searchMatch": {
      backgroundColor: "rgba(0, 212, 255, 0.15)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "rgba(249, 172, 83, 0.3)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(75, 0, 130, 0.15)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(0, 212, 255, 0.15)",
    },
    "&.cm-focused .cm-matchingBracket": {
      backgroundColor: "rgba(249, 172, 83, 0.4)",
    },
    ".cm-gutters": {
      backgroundColor: "#0D0221",
      color: "#6B4D8A",
      border: "none",
      borderRight: "1px solid #300350",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(75, 0, 130, 0.15)",
      color: "#F62E97",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#F62E97",
    },
    ".cm-tooltip": {
      border: "1px solid #300350",
      backgroundColor: "#080118",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: "rgba(233, 52, 121, 0.25)",
      },
    },
  },
  { dark: true },
);

const vaporwaveHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#F62E97" },
  { tag: tags.operator, color: "#00D4FF" },
  { tag: tags.special(tags.variableName), color: "#F9AC53" },
  { tag: tags.typeName, color: "#C4A1FF" },
  { tag: tags.atom, color: "#F9AC53" },
  { tag: tags.number, color: "#F9AC53" },
  { tag: tags.bool, color: "#F9AC53" },
  { tag: tags.string, color: "#FFB3D9" },
  { tag: tags.special(tags.string), color: "#FFB3D9" },
  { tag: tags.comment, color: "#6B4D8A", fontStyle: "italic" },
  { tag: tags.variableName, color: "#E8D5FF" },
  { tag: tags.function(tags.variableName), color: "#00D4FF" },
  { tag: tags.definition(tags.variableName), color: "#C4A1FF" },
  {
    tag: tags.heading,
    color: "#F62E97",
    fontWeight: "bold",
  },
  {
    tag: tags.heading1,
    color: "#F62E97",
    fontWeight: "bold",
    fontSize: "1.6em",
  },
  {
    tag: tags.heading2,
    color: "#E93479",
    fontWeight: "bold",
    fontSize: "1.4em",
  },
  {
    tag: tags.heading3,
    color: "#C4A1FF",
    fontWeight: "bold",
    fontSize: "1.2em",
  },
  { tag: tags.emphasis, fontStyle: "italic", color: "#FFB3D9" },
  { tag: tags.strong, fontWeight: "bold", color: "#F9AC53" },
  { tag: tags.link, color: "#00D4FF", textDecoration: "underline" },
  { tag: tags.url, color: "#00D4FF" },
  {
    tag: tags.strikethrough,
    textDecoration: "line-through",
  },
  { tag: tags.meta, color: "#6B4D8A" },
  { tag: tags.quote, color: "#A88DC8", fontStyle: "italic" },
  {
    tag: tags.monospace,
    color: "#00D4FF",
    fontFamily: "'Share Tech Mono', monospace",
  },
  { tag: tags.processingInstruction, color: "#F62E97" },
  { tag: tags.contentSeparator, color: "#4A0E78" },
]);

export const vaporwaveTheme = [
  vaporwaveEditorTheme,
  syntaxHighlighting(vaporwaveHighlightStyle),
];
