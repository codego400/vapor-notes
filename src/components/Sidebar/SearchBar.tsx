import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { useNotes } from "../../context/NotesContext";
import { searchFiles, type SearchResult } from "../../commands/tauriCommands";
import "./SearchBar.css";

export interface SearchBarHandle {
  focus: () => void;
}

interface SearchBarProps {
  onResults: (results: SearchResult[] | null, query?: string) => void;
}

export const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(function SearchBar({ onResults }, ref) {
  const { state } = useNotes();
  const [query, setQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  const runSearch = useCallback(
    async (q: string) => {
      if (!q.trim() || !state.notesDir) {
        onResults(null);
        return;
      }
      try {
        const results = await searchFiles(state.notesDir, q.trim());
        onResults(results, q.trim());
      } catch {
        onResults([]);
      }
    },
    [state.notesDir, onResults],
  );

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!value.trim()) {
        onResults(null);
        return;
      }
      timerRef.current = setTimeout(() => runSearch(value), 300);
    },
    [runSearch, onResults],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onResults(null);
  }, [onResults]);

  return (
    <div className="search-bar">
      <div className="search-bar-input-wrapper">
        <svg className="search-bar-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-bar-input"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
        />
        {query && (
          <button className="search-bar-clear" onClick={handleClear}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

export function SearchResults({ results, query }: SearchResultsProps) {
  const { selectNote } = useNotes();

  if (results.length === 0) {
    return (
      <div className="search-no-results">
        <p>No matches found</p>
      </div>
    );
  }

  // Group results by file
  const grouped = new Map<string, SearchResult[]>();
  for (const r of results) {
    const existing = grouped.get(r.filePath) || [];
    existing.push(r);
    grouped.set(r.filePath, existing);
  }

  const queryLower = query.toLowerCase();

  return (
    <div className="search-results">
      {Array.from(grouped.entries()).map(([filePath, matches]) => (
        <div key={filePath} className="search-result-group">
          <div
            className="search-result-file"
            onClick={() => selectNote(filePath)}
          >
            {matches[0].fileName.replace(/\.md$/, "")}
          </div>
          {matches.map((m, i) => {
            const lineText = m.lineText.trim();
            const parts: React.ReactNode[] = [];
            const lineLower = lineText.toLowerCase();
            let cursor = 0;
            let idx = lineLower.indexOf(queryLower, cursor);
            while (idx !== -1) {
              if (idx > cursor) {
                parts.push(lineText.slice(cursor, idx));
              }
              parts.push(
                <mark key={idx} className="search-result-highlight">
                  {lineText.slice(idx, idx + query.length)}
                </mark>
              );
              cursor = idx + query.length;
              idx = lineLower.indexOf(queryLower, cursor);
            }
            if (cursor < lineText.length) {
              parts.push(lineText.slice(cursor));
            }

            return (
              <div
                key={i}
                className="search-result-line"
                onClick={() => selectNote(filePath)}
              >
                <span className="search-result-linenum">L{m.lineNumber}</span>
                <span className="search-result-text">{parts}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
