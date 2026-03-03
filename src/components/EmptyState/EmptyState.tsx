import { useState, useCallback } from "react";
import { useNotes } from "../../context/NotesContext";
import "./EmptyState.css";

export function EmptyState() {
  const { createNote } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");

  const handleCreate = useCallback(async () => {
    const trimmed = name.trim();
    if (trimmed) {
      await createNote(trimmed);
    }
    setName("");
    setIsCreating(false);
  }, [name, createNote]);

  return (
    <div className="empty-state">
      <div className="empty-state-scene">
        <svg
          width="320"
          height="200"
          viewBox="0 0 320 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sky gradient */}
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="200">
              <stop offset="0%" stopColor="var(--color-neon-pink, #F62E97)" />
              <stop offset="40%" stopColor="var(--color-hot-pink, #E93479)" />
              <stop offset="70%" stopColor="var(--color-mid-purple, #4A0E78)" />
              <stop offset="100%" stopColor="var(--color-deep-purple, #300350)" />
            </linearGradient>
            <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-sunset-orange, #F9AC53)" />
              <stop offset="100%" stopColor="var(--color-neon-pink, #F62E97)" />
            </linearGradient>
            <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-mid-purple, #4A0E78)" />
              <stop offset="100%" stopColor="var(--color-deep-purple, #300350)" />
            </linearGradient>
            <clipPath id="sunClip">
              <circle cx="160" cy="110" r="50" />
            </clipPath>
          </defs>

          {/* Sky */}
          <rect width="320" height="200" fill="url(#skyGrad)" />

          {/* Sun */}
          <circle cx="160" cy="110" r="50" fill="url(#sunGrad)" />
          {/* Sun scanlines */}
          <g clipPath="url(#sunClip)">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <rect
                key={i}
                x="100"
                y={72 + i * 10}
                width="120"
                height={3 + i * 0.5}
                fill="url(#skyGrad)"
                opacity="0.9"
              />
            ))}
          </g>

          {/* Mountains */}
          <polygon points="0,130 50,95 100,130" fill="var(--color-neon-blue, #153CB4)" opacity="0.7" />
          <polygon points="60,130 120,85 180,130" fill="var(--color-deep-purple, #300350)" opacity="0.8" />
          <polygon points="150,130 220,80 290,130" fill="var(--color-neon-blue, #153CB4)" opacity="0.6" />
          <polygon points="230,130 280,100 320,130" fill="var(--color-deep-purple, #300350)" opacity="0.7" />

          {/* Ground */}
          <rect x="0" y="130" width="320" height="70" fill="url(#groundGrad)" />

          {/* Perspective grid - horizontal lines */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const y = 135 + i * i * 1.1;
            return (
              <line
                key={`h${i}`}
                x1="0"
                y1={y}
                x2="320"
                y2={y}
                stroke="var(--color-cyan, #00D4FF)"
                strokeWidth="0.5"
                opacity={0.6 - i * 0.05}
              />
            );
          })}
          {/* Perspective grid - vertical lines radiating from center */}
          {[-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line
              key={`v${i}`}
              x1={160 + i * 4}
              y1="130"
              x2={160 + i * 30}
              y2="200"
              stroke="var(--color-cyan, #00D4FF)"
              strokeWidth="0.5"
              opacity="0.4"
            />
          ))}

          {/* Palm tree left */}
          <g transform="translate(45, 60)">
            <rect x="8" y="30" width="4" height="45" fill="var(--color-deep-purple, #300350)" />
            <path d="M10 30 Q-15 15 -20 25" stroke="var(--color-deep-purple, #300350)" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M10 30 Q-10 10 -25 15" stroke="var(--color-deep-purple, #300350)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M10 30 Q30 10 40 20" stroke="var(--color-deep-purple, #300350)" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M10 30 Q25 5 38 8" stroke="var(--color-deep-purple, #300350)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M10 30 Q5 5 10 0" stroke="var(--color-deep-purple, #300350)" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>

          {/* Palm tree right */}
          <g transform="translate(245, 55)">
            <rect x="8" y="30" width="4" height="50" fill="var(--color-deep-purple, #300350)" />
            <path d="M10 30 Q-15 15 -20 25" stroke="var(--color-deep-purple, #300350)" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M10 30 Q-10 10 -25 15" stroke="var(--color-deep-purple, #300350)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M10 30 Q30 10 40 20" stroke="var(--color-deep-purple, #300350)" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M10 30 Q25 5 38 8" stroke="var(--color-deep-purple, #300350)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M10 30 Q5 5 10 0" stroke="var(--color-deep-purple, #300350)" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </div>
      <h2 className="empty-state-title">V A P O R N O T E S</h2>
      <p className="empty-state-subtitle">
        Select a note or create a new one to begin
      </p>
      {isCreating ? (
        <div className="empty-state-input-row">
          <input
            className="empty-state-input"
            type="text"
            placeholder="Note name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              else if (e.key === "Escape") { setName(""); setIsCreating(false); }
            }}
            onBlur={handleCreate}
            autoFocus
          />
        </div>
      ) : (
        <button className="empty-state-new-btn" onClick={() => setIsCreating(true)}>
          New Note
        </button>
      )}
      <div className="empty-state-hint">
        <kbd>Cmd</kbd> + <kbd>N</kbd> to create a new note
      </div>
    </div>
  );
}
