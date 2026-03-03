# VaporNotes

A vaporwave-themed markdown note-taking desktop app built with Tauri, React, and CodeMirror.

<video src="VaporNotesDemo.mp4" width="100%"></video>

## Features

**Editor**
- Full markdown support with live syntax highlighting
- Formatting toolbar: headings, bold, italic, underline, strikethrough
- Keyboard shortcuts (Cmd+B, Cmd+I, Cmd+U, Cmd+X, Cmd+1/2/3)
- Clickable links (Cmd+click to open in browser)
- Image support via drag-and-drop or paste from clipboard
- Clean editing — markdown syntax hides when not on the active line
- Hanging indent for wrapped list items
- Undo/redo

**File Management**
- Sidebar file tree with create, rename, and delete
- Drag-and-drop reordering of notes (persists across sessions)
- Full-text search across all notes (Cmd+Shift+F)
- Auto-save when switching between notes

**Themes**
- 8 built-in themes: Vaporwave, Matrix, Miami Vice, Cyberpunk, Blizzard, Solar, Halloween, Summer Nights
- Customizable editor font and font size

**Other**
- Optional folder-level password protection
- Note info panel with word count, character count, line count, image count, link count, file size, and dates
- Collapsible sidebar

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI prerequisites](https://v2.tauri.app/start/prerequisites/)

## Development

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

The built app will be at `src-tauri/target/release/bundle/`.

## Tech Stack

- **Frontend:** React 19, TypeScript, CodeMirror 6
- **Backend:** Tauri 2, Rust
- **Styling:** CSS with custom properties for theming

## License

MIT
