import { useState, useCallback } from "react";
import { useTheme, FONT_OPTIONS, FONT_SIZES, type ThemeName } from "../../context/ThemeContext";
import "./ThemeModal.css";

const THEME_OPTIONS: { id: ThemeName; label: string; colors: string[] }[] = [
  {
    id: "vaporwave",
    label: "VAPORWAVE",
    colors: ["#F62E97", "#00D4FF", "#F9AC53", "#C4A1FF", "#0F0225"],
  },
  {
    id: "matrix",
    label: "MATRIX",
    colors: ["#00FF41", "#33FF33", "#88FF88", "#0d2b0d", "#000000"],
  },
  {
    id: "miami",
    label: "MIAMI VICE",
    colors: ["#F890E7", "#0BD3D3", "#FF6B6B", "#B8A9FF", "#0A0A1A"],
  },
  {
    id: "cyberpunk",
    label: "CYBERPUNK",
    colors: ["#FCEE09", "#FF003C", "#00F0FF", "#7DF9FF", "#0D0D0D"],
  },
  {
    id: "blizzard",
    label: "BLIZZARD",
    colors: ["#A8D8EA", "#62B6CB", "#F0F8FF", "#88CCE0", "#0B1929"],
  },
  {
    id: "solar",
    label: "SOLAR",
    colors: ["#FFB627", "#FF6B35", "#FFD866", "#FFCC80", "#1A1200"],
  },
  {
    id: "halloween",
    label: "HALLOWEEN",
    colors: ["#FF6600", "#8B00FF", "#39FF14", "#CC66FF", "#0A0A0A"],
  },
  {
    id: "summerNights",
    label: "SUMMER NIGHTS",
    colors: ["#FF6B6B", "#FFD700", "#FF9E64", "#B8A0E0", "#0F0A1E"],
  },
];

export function ThemeModal() {
  const { theme, setTheme, editorFont, setEditorFont, editorFontSize, setEditorFontSize } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const handleSelect = useCallback(
    (id: ThemeName) => {
      setTheme(id);
    },
    [setTheme],
  );

  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <button
        className="sidebar-icon-btn"
        onClick={() => setShowModal(true)}
        data-tooltip="Theme"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM2 8a6 6 0 0 1 6-6v12a6 6 0 0 1-6-6z" />
        </svg>
      </button>

      {showModal && (
        <div className="theme-modal-overlay">
          <div className="theme-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="theme-modal-title">FONT</h3>
            <select
              className="theme-modal-select"
              value={editorFont}
              onChange={(e) => setEditorFont(e.target.value)}
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.id} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <select
              className="theme-modal-select"
              value={editorFontSize}
              onChange={(e) => setEditorFontSize(Number(e.target.value))}
            >
              {FONT_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}px
                </option>
              ))}
            </select>

            <h3 className="theme-modal-title">THEME</h3>
            <div className="theme-modal-list">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className={`theme-modal-option ${theme === opt.id ? "theme-modal-option-active" : ""}`}
                  onClick={() => handleSelect(opt.id)}
                >
                  <span className="theme-modal-option-label">{opt.label}</span>
                  <div className="theme-modal-swatches">
                    {opt.colors.map((c, i) => (
                      <span
                        key={i}
                        className="theme-modal-swatch"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <button
              className="theme-modal-close-btn"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
