import { useRef, useEffect, useCallback } from "react";
import { EditorState, Prec, Compartment } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { indentWithTab } from "@codemirror/commands";
import { vaporwaveTheme } from "./vaporwaveTheme";
import { matrixTheme } from "./matrixTheme";
import { miamiTheme } from "./miamiTheme";
import { cyberpunkTheme } from "./cyberpunkTheme";
import { blizzardTheme } from "./blizzardTheme";
import { solarTheme } from "./solarTheme";
import { halloweenTheme } from "./halloweenTheme";
import { summerNightsTheme } from "./summerNightsTheme";
import { hideMarkdownPlugin } from "./hideMarkdown";
import { imagePlugin } from "./imagePlugin";
import { linkPlugin } from "./linkPlugin";
import { listIndentPlugin } from "./listIndentPlugin";
import { toggleBold, toggleItalic, toggleStrikethrough, toggleUnderline, setHeadingLevel } from "./formattingCommands";
import { saveImage } from "../../commands/tauriCommands";
import type { ThemeName } from "../../context/ThemeContext";
import "./Editor.css";

const editorThemes: Record<ThemeName, typeof vaporwaveTheme> = {
  vaporwave: vaporwaveTheme,
  matrix: matrixTheme,
  miami: miamiTheme,
  cyberpunk: cyberpunkTheme,
  blizzard: blizzardTheme,
  solar: solarTheme,
  halloween: halloweenTheme,
  summerNights: summerNightsTheme,
};

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onViewReady?: (view: EditorView) => void;
  themeName: ThemeName;
  notesDir: string | null;
  editorFont: string;
  editorFontSize: number;
}

export function Editor({ content, onChange, onViewReady, themeName, notesDir, editorFont, editorFontSize }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onViewReadyRef = useRef(onViewReady);
  onViewReadyRef.current = onViewReady;
  const notesDirRef = useRef(notesDir);
  notesDirRef.current = notesDir;
  const themeCompartmentRef = useRef(new Compartment());
  const fontCompartmentRef = useRef(new Compartment());

  const formattingKeymap = keymap.of([
    { key: "Mod-b", run: toggleBold },
    { key: "Mod-i", run: toggleItalic },
    { key: "Mod-u", run: toggleUnderline },
    { key: "Mod-x", run: toggleStrikethrough },
    { key: "Mod-1", run: (v) => setHeadingLevel(v, 1) },
    { key: "Mod-2", run: (v) => setHeadingLevel(v, 2) },
    { key: "Mod-3", run: (v) => setHeadingLevel(v, 3) },
    { key: "Mod-0", run: (v) => setHeadingLevel(v, 0) },
  ]);

  const handleImageFile = useCallback(async (file: File, view: EditorView) => {
    const dir = notesDirRef.current;
    if (!dir) return;
    const ext = file.name.split(".").pop() || "png";
    const fileName = `${Date.now()}.${ext}`;
    const buffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(buffer).reduce((s, b) => s + String.fromCharCode(b), ""),
    );
    const relativePath = await saveImage(dir, fileName, base64);
    const pos = view.state.selection.main.head;
    const insert = `![image](${relativePath})`;
    view.dispatch({ changes: { from: pos, insert } });
  }, []);

  const imageDropPaste = EditorView.domEventHandlers({
    drop(event, view) {
      const files = event.dataTransfer?.files;
      if (!files) return false;
      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/")) {
          event.preventDefault();
          handleImageFile(file, view);
          return true;
        }
      }
      return false;
    },
    paste(event, view) {
      const items = event.clipboardData?.items;
      if (!items) return false;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) handleImageFile(file, view);
          return true;
        }
      }
      return false;
    },
  });

  const createExtensions = useCallback(
    () => [
      basicSetup,
      Prec.high(formattingKeymap),
      keymap.of([indentWithTab]),
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      EditorView.lineWrapping,
      themeCompartmentRef.current.of(editorThemes[themeName]),
      fontCompartmentRef.current.of([
        EditorView.editorAttributes.of({ style: `font-size: ${editorFontSize}px` }),
        EditorView.contentAttributes.of({ style: `font-family: ${editorFont}` }),
      ]),
      hideMarkdownPlugin,
      imagePlugin,
      linkPlugin,
      listIndentPlugin,
      imageDropPaste,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChangeRef.current(update.state.doc.toString());
        }
      }),
    ],
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Mount editor once
  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: contentRef.current,
      extensions: createExtensions(),
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;
    onViewReadyRef.current?.(view);

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap CodeMirror theme when themeName changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: themeCompartmentRef.current.reconfigure(editorThemes[themeName]),
    });
  }, [themeName]);

  // Swap font when editorFont or editorFontSize changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: fontCompartmentRef.current.reconfigure([
        EditorView.editorAttributes.of({ style: `font-size: ${editorFontSize}px` }),
        EditorView.contentAttributes.of({ style: `font-family: ${editorFont}` }),
      ]),
    });
  }, [editorFont, editorFontSize]);

  // When external content changes (switching files), replace doc
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentContent = view.state.doc.toString();
    if (currentContent !== content) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: content,
        },
      });
    }
  }, [content]);

  return <div ref={editorRef} className="editor-container" />;
}
