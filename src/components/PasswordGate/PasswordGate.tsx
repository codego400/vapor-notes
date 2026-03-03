import { useState, useCallback, useEffect, useRef, type FormEvent } from "react";
import { useNotes } from "../../context/NotesContext";
import "./PasswordGate.css";

const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 60_000;

export function PasswordGate() {
  const { verifyPassword } = useNotes();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLockedOut = lockedUntil !== null && Date.now() < lockedUntil;

  // Countdown timer
  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setError(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockedUntil]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!password.trim() || checking || isLockedOut) return;
      setChecking(true);
      setError(false);
      const ok = await verifyPassword(password);
      if (!ok) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(true);
        setPassword("");
        if (newAttempts >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
        }
      }
      setChecking(false);
    },
    [password, checking, isLockedOut, attempts, verifyPassword],
  );

  return (
    <div className="password-gate">
      <div className="password-gate-card">
        <div className="password-gate-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="password-gate-title">FOLDER LOCKED</h1>
        <p className="password-gate-subtitle">Enter password to access your notes</p>
        <form className="password-gate-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className={`password-gate-input ${error ? "password-gate-input-error" : ""}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            autoFocus
            disabled={isLockedOut}
          />
          {error && !isLockedOut && <p className="password-gate-error">Incorrect password</p>}
          {isLockedOut && (
            <p className="password-gate-error">
              Too many attempts. Try again in {countdown}s
            </p>
          )}
          <button type="submit" className="password-gate-button" disabled={checking || isLockedOut}>
            {checking ? "Verifying..." : isLockedOut ? `Locked (${countdown}s)` : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}
