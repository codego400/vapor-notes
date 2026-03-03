import { useState, useCallback, useRef, useEffect } from "react";
import { useNotes } from "../../context/NotesContext";
import { FileTree } from "./FileTree";
import { NewNoteButton } from "./NewNoteButton";
import { LockButton } from "./LockButton";
import { ThemeModal } from "./ThemeModal";
import { SearchBar, SearchResults } from "./SearchBar";
import type { SearchBarHandle } from "./SearchBar";
import type { SearchResult } from "../../commands/tauriCommands";
import "./Sidebar.css";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { state, pickDirectory } = useNotes();
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchBarRef = useRef<SearchBarHandle>(null);

  // Cmd+Shift+F to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === "f") {
        e.preventDefault();
        searchBarRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearchResults = useCallback((results: SearchResult[] | null, query?: string) => {
    setSearchResults(results);
    setSearchQuery(query || "");
  }, []);

  if (collapsed) {
    return (
      <aside className="sidebar collapsed">
        <button
          className="sidebar-icon-btn sidebar-expand-btn"
          onClick={onToggleCollapse}
          data-tooltip="Expand"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">VAPOR NOTES</h1>
        <div className="sidebar-actions">
          <NewNoteButton />
          <button
            className="sidebar-icon-btn"
            onClick={pickDirectory}
            data-tooltip="Change folder"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h3.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 9.62 4H13.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z" />
            </svg>
          </button>
          <div className="sidebar-actions-right">
            <ThemeModal />
            <LockButton />
            <button
              className="sidebar-icon-btn"
              onClick={onToggleCollapse}
              data-tooltip="Minimize"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <SearchBar ref={searchBarRef} onResults={handleSearchResults} />
      {searchResults !== null ? (
        <SearchResults results={searchResults} query={searchQuery} />
      ) : (
        <div className="sidebar-content">
          {state.files.length === 0 && !state.isLoading ? (
            <div className="sidebar-empty">
              <p>No notes yet</p>
              <p className="sidebar-empty-hint">Create one to get started</p>
            </div>
          ) : (
            <FileTree />
          )}
        </div>
      )}
    </aside>
  );
}
