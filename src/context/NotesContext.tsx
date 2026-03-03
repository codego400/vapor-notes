import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { open } from "@tauri-apps/plugin-dialog";
import {
  listFiles,
  readFile,
  writeFile,
  createFile,
  deleteFile,
  renameFile,
  type FileEntry,
} from "../commands/tauriCommands";

// --- Password hashing helpers ---

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getLockKey(dirPath: string): string {
  return `vapornotes_lock_${btoa(dirPath)}`;
}

function getFolderPasswordHash(dirPath: string): string | null {
  return localStorage.getItem(getLockKey(dirPath));
}

function isFolderLocked(dirPath: string | null): boolean {
  if (!dirPath) return false;
  return getFolderPasswordHash(dirPath) !== null;
}

// --- File order persistence ---

function getOrderKey(dirPath: string): string {
  return `vapornotes_fileOrder_${btoa(dirPath)}`;
}

function getSavedOrder(dirPath: string): string[] {
  const raw = localStorage.getItem(getOrderKey(dirPath));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveOrder(dirPath: string, paths: string[]): void {
  localStorage.setItem(getOrderKey(dirPath), JSON.stringify(paths));
}

function applyCustomOrder(files: FileEntry[], dirPath: string): FileEntry[] {
  const dirs = files.filter((f) => f.isDirectory);
  const notes = files.filter((f) => !f.isDirectory);
  const savedPaths = getSavedOrder(dirPath);
  if (savedPaths.length === 0) return files;

  const notesByPath = new Map(notes.map((n) => [n.path, n]));
  const ordered: FileEntry[] = [];
  for (const path of savedPaths) {
    const note = notesByPath.get(path);
    if (note) {
      ordered.push(note);
      notesByPath.delete(path);
    }
  }
  const remaining = [...notesByPath.values()];
  return [...dirs, ...ordered, ...remaining];
}

// --- State ---

interface NotesState {
  notesDir: string | null;
  files: FileEntry[];
  activeFilePath: string | null;
  activeFileContent: string | null;
  isLoading: boolean;
  isDirty: boolean;
  error: string | null;
  isLocked: boolean;
  isUnlocked: boolean;
}

type NotesAction =
  | { type: "SET_NOTES_DIR"; payload: string }
  | { type: "SET_FILES"; payload: FileEntry[] }
  | { type: "SELECT_FILE"; payload: { path: string; content: string } }
  | { type: "UPDATE_CONTENT"; payload: string }
  | { type: "MARK_SAVED" }
  | { type: "DESELECT_FILE" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LOCK_STATE"; payload: { isLocked: boolean; isUnlocked: boolean } }
  | { type: "REORDER_FILES"; payload: FileEntry[] };

const savedDir = localStorage.getItem("vapornotes_dir");

const initialState: NotesState = {
  notesDir: savedDir,
  files: [],
  activeFilePath: null,
  activeFileContent: null,
  isLoading: false,
  isDirty: false,
  error: null,
  isLocked: isFolderLocked(savedDir),
  isUnlocked: false,
};

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case "SET_NOTES_DIR":
      localStorage.setItem("vapornotes_dir", action.payload);
      return {
        ...state,
        notesDir: action.payload,
        error: null,
        isLocked: isFolderLocked(action.payload),
        isUnlocked: false,
        files: [],
        activeFilePath: null,
        activeFileContent: null,
      };
    case "SET_FILES":
      return { ...state, files: action.payload, isLoading: false };
    case "SELECT_FILE":
      return {
        ...state,
        activeFilePath: action.payload.path,
        activeFileContent: action.payload.content,
        isDirty: false,
        isLoading: false,
      };
    case "UPDATE_CONTENT":
      return {
        ...state,
        activeFileContent: action.payload,
        isDirty: true,
      };
    case "MARK_SAVED":
      return { ...state, isDirty: false };
    case "DESELECT_FILE":
      return {
        ...state,
        activeFilePath: null,
        activeFileContent: null,
        isDirty: false,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_LOCK_STATE":
      return {
        ...state,
        isLocked: action.payload.isLocked,
        isUnlocked: action.payload.isUnlocked,
      };
    case "REORDER_FILES":
      return { ...state, files: action.payload };
    default:
      return state;
  }
}

interface NotesContextValue {
  state: NotesState;
  selectNote: (path: string) => Promise<void>;
  createNote: (name: string) => Promise<void>;
  saveNote: () => Promise<void>;
  deleteNote: (path: string) => Promise<void>;
  renameNote: (oldPath: string, newName: string) => Promise<void>;
  refreshFiles: () => Promise<void>;
  pickDirectory: () => Promise<void>;
  updateContent: (content: string) => void;
  verifyPassword: (password: string) => Promise<boolean>;
  setFolderPassword: (password: string) => Promise<void>;
  removeFolderPassword: (password: string) => Promise<boolean>;
  reorderFiles: (files: FileEntry[]) => void;
}

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  const refreshFiles = useCallback(async () => {
    if (!state.notesDir) return;
    try {
      const files = await listFiles(state.notesDir);
      const ordered = applyCustomOrder(files, state.notesDir);
      dispatch({ type: "SET_FILES", payload: ordered });
    } catch (e) {
      dispatch({ type: "SET_ERROR", payload: String(e) });
    }
  }, [state.notesDir]);

  const selectNote = useCallback(async (path: string) => {
    // Auto-save current note before switching
    if (state.isDirty && state.activeFilePath && state.activeFileContent !== null) {
      try {
        await writeFile(state.activeFilePath, state.activeFileContent);
      } catch { /* best-effort save */ }
    }
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const content = await readFile(path);
      dispatch({ type: "SELECT_FILE", payload: { path, content } });
    } catch (e) {
      dispatch({ type: "SET_ERROR", payload: String(e) });
    }
  }, [state.isDirty, state.activeFilePath, state.activeFileContent]);

  const saveNote = useCallback(async () => {
    if (!state.activeFilePath || state.activeFileContent === null) return;
    try {
      await writeFile(state.activeFilePath, state.activeFileContent);
      dispatch({ type: "MARK_SAVED" });
    } catch (e) {
      dispatch({ type: "SET_ERROR", payload: String(e) });
    }
  }, [state.activeFilePath, state.activeFileContent]);

  const createNote = useCallback(
    async (name: string) => {
      if (!state.notesDir) return;
      try {
        const path = await createFile(state.notesDir, name);
        await refreshFiles();
        await selectNote(path);
      } catch (e) {
        dispatch({ type: "SET_ERROR", payload: String(e) });
      }
    },
    [state.notesDir, refreshFiles, selectNote],
  );

  const deleteNoteAction = useCallback(
    async (path: string) => {
      try {
        await deleteFile(path);
        if (state.activeFilePath === path) {
          dispatch({ type: "DESELECT_FILE" });
        }
        await refreshFiles();
      } catch (e) {
        dispatch({ type: "SET_ERROR", payload: String(e) });
      }
    },
    [state.activeFilePath, refreshFiles],
  );

  const renameNoteAction = useCallback(
    async (oldPath: string, newName: string) => {
      try {
        const newPath = await renameFile(oldPath, newName);
        // Update saved file order with the new path
        if (state.notesDir) {
          const savedPaths = getSavedOrder(state.notesDir);
          if (savedPaths.length > 0) {
            const updatedPaths = savedPaths.map((p) => (p === oldPath ? newPath : p));
            saveOrder(state.notesDir, updatedPaths);
          }
        }
        if (state.activeFilePath === oldPath) {
          const content = await readFile(newPath);
          dispatch({ type: "SELECT_FILE", payload: { path: newPath, content } });
        }
        await refreshFiles();
      } catch (e) {
        dispatch({ type: "SET_ERROR", payload: String(e) });
      }
    },
    [state.activeFilePath, state.notesDir, refreshFiles],
  );

  const reorderFiles = useCallback(
    (reorderedFiles: FileEntry[]) => {
      dispatch({ type: "REORDER_FILES", payload: reorderedFiles });
      if (state.notesDir) {
        const notePaths = reorderedFiles
          .filter((f) => !f.isDirectory)
          .map((f) => f.path);
        saveOrder(state.notesDir, notePaths);
      }
    },
    [state.notesDir],
  );

  const pickDirectory = useCallback(async () => {
    try {
      const selected = await open({ directory: true, multiple: false });
      if (selected) {
        dispatch({ type: "SET_NOTES_DIR", payload: selected as string });
      }
    } catch (e) {
      dispatch({ type: "SET_ERROR", payload: String(e) });
    }
  }, []);

  const updateContent = useCallback((content: string) => {
    dispatch({ type: "UPDATE_CONTENT", payload: content });
  }, []);

  // --- Password methods ---

  const verifyPassword = useCallback(
    async (password: string): Promise<boolean> => {
      if (!state.notesDir) return false;
      const storedHash = getFolderPasswordHash(state.notesDir);
      if (!storedHash) return false;
      const inputHash = await hashPassword(password);
      if (inputHash === storedHash) {
        dispatch({ type: "SET_LOCK_STATE", payload: { isLocked: true, isUnlocked: true } });
        return true;
      }
      return false;
    },
    [state.notesDir],
  );

  const setFolderPassword = useCallback(
    async (password: string): Promise<void> => {
      if (!state.notesDir) return;
      const hash = await hashPassword(password);
      localStorage.setItem(getLockKey(state.notesDir), hash);
      dispatch({ type: "SET_LOCK_STATE", payload: { isLocked: true, isUnlocked: true } });
    },
    [state.notesDir],
  );

  const removeFolderPassword = useCallback(
    async (password: string): Promise<boolean> => {
      if (!state.notesDir) return false;
      const storedHash = getFolderPasswordHash(state.notesDir);
      if (!storedHash) return false;
      const inputHash = await hashPassword(password);
      if (inputHash === storedHash) {
        localStorage.removeItem(getLockKey(state.notesDir));
        dispatch({ type: "SET_LOCK_STATE", payload: { isLocked: false, isUnlocked: true } });
        return true;
      }
      return false;
    },
    [state.notesDir],
  );

  // Load files when notesDir changes — only if not locked or already unlocked
  useEffect(() => {
    if (state.notesDir && (!state.isLocked || state.isUnlocked)) {
      refreshFiles();
    }
  }, [state.notesDir, state.isLocked, state.isUnlocked, refreshFiles]);

  return (
    <NotesContext.Provider
      value={{
        state,
        selectNote,
        createNote,
        saveNote,
        deleteNote: deleteNoteAction,
        renameNote: renameNoteAction,
        refreshFiles,
        pickDirectory,
        updateContent,
        verifyPassword,
        setFolderPassword,
        removeFolderPassword,
        reorderFiles,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}
