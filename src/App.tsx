import { useEffect, useRef, useState, useCallback } from "react";
import type { EditorView } from "@codemirror/view";
import { NotesProvider, useNotes } from "./context/NotesContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Editor } from "./components/Editor/Editor";
import { FormattingToolbar } from "./components/Editor/FormattingToolbar";
import { StatusBar } from "./components/Editor/StatusBar";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { PasswordGate } from "./components/PasswordGate/PasswordGate";

function AppContent() {
  const { state, saveNote, updateContent, pickDirectory, createNote } =
    useNotes();
  const { theme, editorFont, editorFontSize } = useTheme();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Debounced auto-save — capture path+content at schedule time
  // so a file switch before the timer fires won't save to the wrong file
  useEffect(() => {
    if (!state.isDirty || !state.activeFilePath || state.activeFileContent === null) return;
    const pathToSave = state.activeFilePath;
    const contentToSave = state.activeFileContent;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        const { writeFile } = await import("./commands/tauriCommands");
        await writeFile(pathToSave, contentToSave);
      } catch {
        // Best-effort: dirty indicator stays visible so user can retry with Cmd+S
      }
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state.isDirty, state.activeFilePath, state.activeFileContent]);

  // Keyboard shortcuts
  const handleNewNote = useCallback(() => {
    const name = window.prompt("New note name:");
    if (name?.trim()) {
      createNote(name.trim());
    }
  }, [createNote]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "s") {
        e.preventDefault();
        saveNote();
      } else if (e.metaKey && e.key === "n") {
        e.preventDefault();
        handleNewNote();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [saveNote, handleNewNote]);

  // Store notesDir on documentElement for image plugin resolution
  useEffect(() => {
    if (state.notesDir) {
      document.documentElement.dataset.notesDir = state.notesDir;
    } else {
      delete document.documentElement.dataset.notesDir;
    }
  }, [state.notesDir]);

  // First launch: no directory selected
  if (!state.notesDir) {
    return (
      <div className="app-container">
        <div className="directory-picker">
          <h1>VAPOR NOTES</h1>
          <p>Choose a folder to store your notes</p>
          <button onClick={pickDirectory}>Open Folder</button>
        </div>
      </div>
    );
  }

  // Folder is locked and not yet unlocked
  if (state.isLocked && !state.isUnlocked) {
    return (
      <div className="app-container">
        <PasswordGate />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className={`app-layout${sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(c => !c)} />
        <main className="editor-pane">
          {state.activeFilePath && state.activeFileContent !== null ? (
            <>
              <FormattingToolbar editorView={editorView} />
              <Editor
                content={state.activeFileContent}
                onChange={updateContent}
                onViewReady={setEditorView}
                themeName={theme}
                notesDir={state.notesDir}
                editorFont={editorFont}
                editorFontSize={editorFontSize}
              />
              <StatusBar content={state.activeFileContent} filePath={state.activeFilePath} />
            </>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
      {state.error && (
        <div className="error-banner" onClick={() => {}}>
          {state.error}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
