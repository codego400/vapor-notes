import { useMemo, useState, useEffect, useCallback } from "react";
import { getFileInfo, type FileInfo } from "../../commands/tauriCommands";
import "./StatusBar.css";

interface StatusBarProps {
  content: string;
  filePath: string;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ageDays(iso: string): string {
  if (!iso) return "—";
  const created = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export function StatusBar({ content, filePath }: StatusBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const stats = useMemo(() => {
    const chars = content.length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const lines = content.split("\n").length;
    const images = (content.match(/!\[[^\]]*\]\([^)]*\)/g) || []).length;
    const mdLinks = (content.match(/(?<!!)\[[^\]]*\]\([^)]*\)/g) || []).length;
    const withoutMdLinks = content.replace(/(?<!!)\[[^\]]*\]\([^)]*\)/g, "");
    const rawUrls = (withoutMdLinks.match(/https?:\/\/[^\s<>\[\]()]+/g) || []).length;
    const links = mdLinks + rawUrls;
    return { chars, words, lines, images, links };
  }, [content]);

  const fetchInfo = useCallback(async () => {
    try {
      const info = await getFileInfo(filePath);
      setFileInfo(info);
    } catch {
      setFileInfo(null);
    }
  }, [filePath]);

  useEffect(() => {
    if (expanded) {
      fetchInfo();
    }
  }, [expanded, fetchInfo]);

  // Reset when file changes
  useEffect(() => {
    setExpanded(false);
    setFileInfo(null);
  }, [filePath]);

  const noteName = fileInfo?.name?.replace(/\.md$/, "") ?? filePath.split("/").pop()?.replace(/\.md$/, "") ?? "";

  return (
    <div className="status-bar-wrapper">
      {expanded && (
        <div className="note-info-panel">
          <div className="note-info-item">
            <span className="note-info-label">Note Name</span>
            <span className="note-info-value">{noteName}</span>
          </div>
          <div className="note-info-item">
            <span className="note-info-label">Age</span>
            <span className="note-info-value">{fileInfo ? ageDays(fileInfo.createdAt) : "—"}</span>
          </div>
          <div className="note-info-item">
            <span className="note-info-label">Created</span>
            <span className="note-info-value">{fileInfo ? formatDate(fileInfo.createdAt) : "—"}</span>
          </div>
          <div className="note-info-item">
            <span className="note-info-label">Last Edited</span>
            <span className="note-info-value">{fileInfo ? formatDate(fileInfo.modifiedAt) : "—"}</span>
          </div>
          <div className="note-info-item">
            <span className="note-info-label">Words</span>
            <span className="note-info-value">{stats.words}</span>
          </div>
          <div className="note-info-item">
            <span className="note-info-label">Characters</span>
            <span className="note-info-value">{stats.chars}</span>
          </div>
          <div className="note-info-item">
            <span className="note-info-label">Lines</span>
            <span className="note-info-value">{stats.lines}</span>
          </div>
          <div className="note-info-item">
            <span className="note-info-label">Images</span>
            <span className="note-info-value">{stats.images}</span>
          </div>
          <div className="note-info-item">
            <span className="note-info-label">Links</span>
            <span className="note-info-value">{stats.links}</span>
          </div>
        </div>
      )}
      <div className="status-bar">
        <span className="status-bar-item">{stats.words} words</span>
        <span className="status-bar-sep" />
        <span className="status-bar-item">{stats.chars} chars</span>
        <span className="status-bar-sep" />
        <span className="status-bar-item">{stats.lines} lines</span>
        <span className="status-bar-sep" />
        <button
          className={`status-bar-info-btn${expanded ? " active" : ""}`}
          onClick={() => setExpanded((v) => !v)}
        >
          Note Info
        </button>
      </div>
    </div>
  );
}
