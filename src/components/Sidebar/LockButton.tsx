import { useState, useCallback } from "react";
import { useNotes } from "../../context/NotesContext";
import "./LockButton.css";

export function LockButton() {
  const { state, setFolderPassword, removeFolderPassword } = useNotes();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const isCurrentlyLocked = state.isLocked;

  const handleSetPassword = useCallback(async () => {
    if (!password.trim()) {
      setError("Password cannot be empty");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    await setFolderPassword(password);
    setShowModal(false);
    setPassword("");
    setConfirmPassword("");
    setError("");
  }, [password, confirmPassword, setFolderPassword]);

  const handleRemovePassword = useCallback(async () => {
    if (!password.trim()) {
      setError("Enter your current password");
      return;
    }
    const ok = await removeFolderPassword(password);
    if (ok) {
      setShowModal(false);
      setPassword("");
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  }, [password, removeFolderPassword]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setPassword("");
    setConfirmPassword("");
    setError("");
  }, []);

  return (
    <>
      <button
        className={`sidebar-icon-btn ${isCurrentlyLocked ? "lock-active" : ""}`}
        onClick={() => setShowModal(true)}
        data-tooltip={isCurrentlyLocked ? "Unlock" : "Lock"}
      >
        {isCurrentlyLocked ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        )}
      </button>

      {showModal && (
        <div className="lock-modal-overlay" onClick={handleClose}>
          <div className="lock-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="lock-modal-title">
              {isCurrentlyLocked ? "Remove Lock" : "Set Lock"}
            </h3>

            {isCurrentlyLocked ? (
              <>
                <p className="lock-modal-desc">Enter current password to remove lock</p>
                <input
                  type="password"
                  className="lock-modal-input"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Current password"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleRemovePassword()}
                />
              </>
            ) : (
              <>
                <p className="lock-modal-desc">Set a password to protect this folder</p>
                <input
                  type="password"
                  className="lock-modal-input"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="New password"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && document.getElementById("lock-confirm")?.focus()}
                />
                <input
                  id="lock-confirm"
                  type="password"
                  className="lock-modal-input"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  placeholder="Confirm password"
                  onKeyDown={(e) => e.key === "Enter" && handleSetPassword()}
                />
              </>
            )}

            {error && <p className="lock-modal-error">{error}</p>}

            <div className="lock-modal-actions">
              <button className="lock-modal-btn lock-modal-btn-cancel" onClick={handleClose}>
                Cancel
              </button>
              <button
                className="lock-modal-btn lock-modal-btn-confirm"
                onClick={isCurrentlyLocked ? handleRemovePassword : handleSetPassword}
              >
                {isCurrentlyLocked ? "Remove" : "Lock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
