import { useState, useEffect, useCallback, useRef } from "react";
import type { EditorView } from "@codemirror/view";
import { undo, redo } from "@codemirror/commands";
import {
  toggleBold,
  toggleItalic,
  toggleStrikethrough,
  toggleUnderline,
  setHeadingLevel,
  getCurrentHeadingLevel,
} from "./formattingCommands";
import "./FormattingToolbar.css";

interface FormattingToolbarProps {
  editorView: EditorView | null;
}

const BLOCK_STYLES = [
  { level: 1 as const, label: "Title" },
  { level: 2 as const, label: "Heading" },
  { level: 3 as const, label: "Subheading" },
  { level: 0 as const, label: "Body" },
];

export function FormattingToolbar({ editorView }: FormattingToolbarProps) {
  const [currentLevel, setCurrentLevel] = useState<0 | 1 | 2 | 3>(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update current heading level when cursor moves
  useEffect(() => {
    if (!editorView) return;

    const update = () => {
      setCurrentLevel(getCurrentHeadingLevel(editorView));
    };

    // Poll on selection changes via a DOM listener
    const handler = () => update();
    editorView.dom.addEventListener("keyup", handler);
    editorView.dom.addEventListener("mouseup", handler);
    update();

    return () => {
      editorView.dom.removeEventListener("keyup", handler);
      editorView.dom.removeEventListener("mouseup", handler);
    };
  }, [editorView]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBlockStyle = useCallback(
    (level: 0 | 1 | 2 | 3) => {
      if (!editorView) return;
      setHeadingLevel(editorView, level);
      setCurrentLevel(level);
      setDropdownOpen(false);
      editorView.focus();
    },
    [editorView],
  );

  const handleBold = useCallback(() => {
    if (!editorView) return;
    toggleBold(editorView);
    editorView.focus();
  }, [editorView]);

  const handleItalic = useCallback(() => {
    if (!editorView) return;
    toggleItalic(editorView);
    editorView.focus();
  }, [editorView]);

  const handleUnderline = useCallback(() => {
    if (!editorView) return;
    toggleUnderline(editorView);
    editorView.focus();
  }, [editorView]);

  const handleStrikethrough = useCallback(() => {
    if (!editorView) return;
    toggleStrikethrough(editorView);
    editorView.focus();
  }, [editorView]);

  const handleUndo = useCallback(() => {
    if (!editorView) return;
    undo(editorView);
    editorView.focus();
  }, [editorView]);

  const handleRedo = useCallback(() => {
    if (!editorView) return;
    redo(editorView);
    editorView.focus();
  }, [editorView]);

  const currentLabel = BLOCK_STYLES.find((s) => s.level === currentLevel)?.label ?? "Body";

  return (
    <div className="formatting-toolbar">
      <div className="toolbar-group">
        <div className="block-style-dropdown" ref={dropdownRef}>
          <button
            className="block-style-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Block style"
          >
            {currentLabel}
            <span className="dropdown-arrow">{dropdownOpen ? "\u25B4" : "\u25BE"}</span>
          </button>
          {dropdownOpen && (
            <div className="block-style-menu">
              {BLOCK_STYLES.map(({ level, label }) => (
                <button
                  key={level}
                  className={`block-style-option ${level === currentLevel ? "active" : ""}`}
                  onClick={() => handleBlockStyle(level)}
                >
                  {label}
                  <span className="block-style-shortcut">
                    {level === 0 ? "\u2318+0" : `\u2318+${level}`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="toolbar-group">
        <button
          className="toolbar-button toolbar-bold"
          onClick={handleBold}
          data-tooltip="Bold  ⌘B"
        >
          B
        </button>
        <button
          className="toolbar-button toolbar-italic"
          onClick={handleItalic}
          data-tooltip="Italic  ⌘I"
        >
          I
        </button>
        <button
          className="toolbar-button toolbar-underline"
          onClick={handleUnderline}
          data-tooltip="Underline  ⌘U"
        >
          U
        </button>
        <button
          className="toolbar-button toolbar-strikethrough"
          onClick={handleStrikethrough}
          data-tooltip="Strikethrough  ⌘X"
        >
          S
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={handleUndo}
          data-tooltip="Undo  ⌘Z"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
        <button
          className="toolbar-button"
          onClick={handleRedo}
          data-tooltip="Redo  ⌘⇧Z"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
          </svg>
        </button>
      </div>
    </div>
  );
}
