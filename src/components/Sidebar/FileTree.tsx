import { useState, useCallback, useRef, useEffect } from "react";
import { useNotes } from "../../context/NotesContext";
import { FileItem } from "./FileItem";
import "./FileTree.css";

export function FileTree() {
  const { state, reorderFiles } = useNotes();
  const [dragState, setDragState] = useState<{
    fromIndex: number;
    dropIndex: number | null;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRectsRef = useRef<DOMRect[]>([]);
  const dropIndexRef = useRef<number | null>(null);

  // Measure item positions when drag starts
  const measureItems = useCallback(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll("[data-file-index]");
    itemRectsRef.current = Array.from(items).map((el) =>
      el.getBoundingClientRect()
    );
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, index: number) => {
      // Only left click, skip directories
      if (e.button !== 0) return;
      if (state.files[index].isDirectory) return;

      // Don't start drag on action buttons or edit inputs
      const target = e.target as HTMLElement;
      if (
        target.closest(".file-item-actions") ||
        target.closest(".file-item-edit-input")
      )
        return;

      e.preventDefault();
      measureItems();
      setDragState({ fromIndex: index, dropIndex: null });
    },
    [state.files, measureItems]
  );

  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rects = itemRectsRef.current;
      if (rects.length === 0) return;

      // Find the first non-directory index
      const firstNoteIndex = state.files.findIndex((f) => !f.isDirectory);
      if (firstNoteIndex === -1) return;

      let dropIndex: number | null = null;

      for (let i = firstNoteIndex; i < rects.length; i++) {
        const rect = rects[i];
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          dropIndex = i;
          break;
        }
      }

      // If past all items, drop at the end
      if (dropIndex === null) {
        dropIndex = state.files.length;
      }

      // Don't show indicator at the dragged item's current position
      if (dropIndex === dragState.fromIndex || dropIndex === dragState.fromIndex + 1) {
        dropIndex = null;
      }

      dropIndexRef.current = dropIndex;
      setDragState((prev) =>
        prev ? { ...prev, dropIndex } : null
      );
    };

    const handleMouseUp = () => {
      const currentDropIndex = dropIndexRef.current;
      if (dragState && currentDropIndex !== null) {
        const fromIndex = dragState.fromIndex;
        const dropIndex = currentDropIndex;
        const files = [...state.files];
        const [moved] = files.splice(fromIndex, 1);
        const adjustedIndex =
          fromIndex < dropIndex ? dropIndex - 1 : dropIndex;
        files.splice(adjustedIndex, 0, moved);
        reorderFiles(files);
      }
      dropIndexRef.current = null;
      setDragState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, state.files, reorderFiles]);

  // Build elements with drop indicators
  const elements: React.ReactNode[] = [];
  state.files.forEach((file, index) => {
    if (dragState?.dropIndex === index) {
      elements.push(<div key={`drop-${index}`} className="drop-indicator" />);
    }
    elements.push(
      <FileItem
        key={file.path}
        file={file}
        index={index}
        onMouseDown={handleMouseDown}
        isDragging={dragState?.fromIndex === index}
      />
    );
  });
  if (dragState?.dropIndex === state.files.length) {
    elements.push(<div key="drop-end" className="drop-indicator" />);
  }

  return (
    <div
      ref={containerRef}
      className={`file-tree${dragState ? " file-tree--dragging" : ""}`}
    >
      {elements}
    </div>
  );
}
