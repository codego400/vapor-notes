import { useState, useRef, useCallback } from "react";
import { useNotes } from "../../context/NotesContext";
import "./NewNoteButton.css";

export function NewNoteButton() {
  const { createNote } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreate = useCallback(async () => {
    const trimmed = name.trim();
    if (trimmed) {
      await createNote(trimmed);
    }
    setName("");
    setIsCreating(false);
  }, [name, createNote]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCreate();
      } else if (e.key === "Escape") {
        setName("");
        setIsCreating(false);
      }
    },
    [handleCreate],
  );

  if (isCreating) {
    return (
      <input
        ref={inputRef}
        className="new-note-input"
        type="text"
        placeholder="Note name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleCreate}
        autoFocus
      />
    );
  }

  return (
    <button
      className="sidebar-icon-btn new-note-btn"
      onClick={() => setIsCreating(true)}
      data-tooltip="New note"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
      </svg>
    </button>
  );
}
