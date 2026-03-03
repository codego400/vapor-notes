import { useCallback, useRef, useEffect, useState } from "react";
import { confirm } from "@tauri-apps/plugin-dialog";
import { useNotes } from "../../context/NotesContext";
import type { FileEntry } from "../../commands/tauriCommands";
import "./FileItem.css";

interface FileItemProps {
  file: FileEntry;
  index: number;
  onMouseDown: (e: React.MouseEvent, index: number) => void;
  isDragging: boolean;
}

export function FileItem({ file, index, onMouseDown, isDragging }: FileItemProps) {
  const { state, selectNote, deleteNote, renameNote } = useNotes();
  const isActive = state.activeFilePath === file.path;
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayName = file.name.replace(/\.md$/, "");

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = useCallback(() => {
    if (!file.isDirectory && !isEditing) {
      selectNote(file.path);
    }
  }, [file.path, file.isDirectory, isEditing, selectNote]);

  const handleDelete = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const confirmed = await confirm(`Delete "${displayName}"?`, { title: "Delete Note", kind: "warning" });
      if (confirmed) {
        deleteNote(file.path);
      }
    },
    [file.path, displayName, deleteNote],
  );

  const handleStartEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setEditName(displayName);
      setIsEditing(true);
    },
    [displayName],
  );

  const handleRenameSubmit = useCallback(async () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== displayName) {
      await renameNote(file.path, trimmed);
    }
    setIsEditing(false);
  }, [editName, displayName, file.path, renameNote]);

  const handleRenameKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleRenameSubmit();
      } else if (e.key === "Escape") {
        setIsEditing(false);
      }
    },
    [handleRenameSubmit],
  );

  if (file.isDirectory) {
    return (
      <div className="file-item file-item--dir" data-file-index={index}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h3.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 9.62 4H13.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z" />
        </svg>
        <span>{file.name}</span>
      </div>
    );
  }

  return (
    <div
      className={`file-item ${isActive ? "file-item--active" : ""}${isDragging ? " file-item--dragging" : ""}`}
      data-file-index={index}
      onClick={handleClick}
      onMouseDown={(e) => onMouseDown(e, index)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { if (!isEditing) setShowActions(false); }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0H4zm5.5 0v3A1.5 1.5 0 0 0 11 4.5H14" />
      </svg>
      {isEditing ? (
        <input
          ref={inputRef}
          className="file-item-edit-input"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={handleRenameSubmit}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="file-item-name">{displayName}</span>
      )}
      {showActions && !isEditing && (
        <div className="file-item-actions">
          <button
            className="file-item-action-btn"
            onClick={handleStartEdit}
            title="Rename note"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </button>
          <button
            className="file-item-action-btn file-item-action-btn--delete"
            onClick={handleDelete}
            title="Delete note"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
