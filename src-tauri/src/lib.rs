use serde::Serialize;
use std::path::Path;

#[derive(Debug, thiserror::Error)]
enum AppError {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error("{0}")]
    Custom(String),
}

impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

type Result<T> = std::result::Result<T, AppError>;

#[derive(Debug, Serialize, Clone)]
struct FileEntry {
    name: String,
    path: String,
    #[serde(rename = "isDirectory")]
    is_directory: bool,
}

#[derive(Debug, Serialize, Clone)]
struct SearchResult {
    #[serde(rename = "fileName")]
    file_name: String,
    #[serde(rename = "filePath")]
    file_path: String,
    #[serde(rename = "lineNumber")]
    line_number: usize,
    #[serde(rename = "lineText")]
    line_text: String,
}

#[derive(Debug, Serialize, Clone)]
struct FileInfo {
    name: String,
    #[serde(rename = "createdAt")]
    created_at: String,
    #[serde(rename = "modifiedAt")]
    modified_at: String,
    #[serde(rename = "sizeBytes")]
    size_bytes: u64,
}

#[tauri::command]
async fn get_file_info(file_path: String) -> Result<FileInfo> {
    let path = std::path::Path::new(&file_path);
    let metadata = tokio::fs::metadata(&file_path).await?;
    let name = path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_default();
    let created_at = metadata
        .created()
        .ok()
        .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
        .map(|d| {
            let secs = d.as_secs() as i64;
            let dt = chrono::DateTime::from_timestamp(secs, 0).unwrap_or_default();
            dt.to_rfc3339()
        })
        .unwrap_or_default();
    let modified_at = metadata
        .modified()
        .ok()
        .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
        .map(|d| {
            let secs = d.as_secs() as i64;
            let dt = chrono::DateTime::from_timestamp(secs, 0).unwrap_or_default();
            dt.to_rfc3339()
        })
        .unwrap_or_default();
    Ok(FileInfo {
        name,
        created_at,
        modified_at,
        size_bytes: metadata.len(),
    })
}

#[tauri::command]
async fn list_files(dir_path: String) -> Result<Vec<FileEntry>> {
    let mut entries = Vec::new();
    let mut read_dir = tokio::fs::read_dir(&dir_path).await?;
    while let Some(entry) = read_dir.next_entry().await? {
        let metadata = entry.metadata().await?;
        let name = entry.file_name().to_string_lossy().to_string();
        if name.starts_with('.') || name == "_assets" {
            continue;
        }
        let is_dir = metadata.is_dir();
        if is_dir || name.ends_with(".md") {
            entries.push(FileEntry {
                name,
                path: entry.path().to_string_lossy().to_string(),
                is_directory: is_dir,
            });
        }
    }
    entries.sort_by(|a, b| {
        b.is_directory
            .cmp(&a.is_directory)
            .then(a.name.to_lowercase().cmp(&b.name.to_lowercase()))
    });
    Ok(entries)
}

#[tauri::command]
async fn read_file(file_path: String) -> Result<String> {
    let content = tokio::fs::read_to_string(&file_path).await?;
    Ok(content)
}

#[tauri::command]
async fn write_file(file_path: String, content: String) -> Result<()> {
    tokio::fs::write(&file_path, content).await?;
    Ok(())
}

#[tauri::command]
async fn create_file(dir_path: String, file_name: String) -> Result<String> {
    let trimmed = file_name.trim().to_string();
    if trimmed.is_empty() || trimmed == ".md" {
        return Err(AppError::Custom("File name cannot be empty".into()));
    }
    let mut name = trimmed;
    if !name.ends_with(".md") {
        name.push_str(".md");
    }
    let full_path = Path::new(&dir_path).join(&name);
    if full_path.exists() {
        return Err(AppError::Custom(format!("File '{}' already exists", name)));
    }
    let title = file_name.trim_end_matches(".md");
    tokio::fs::write(&full_path, format!("# {}\n", title)).await?;
    Ok(full_path.to_string_lossy().to_string())
}

#[tauri::command]
async fn delete_file(file_path: String) -> Result<()> {
    tokio::fs::remove_file(&file_path).await?;
    Ok(())
}

#[tauri::command]
async fn rename_file(old_path: String, new_name: String) -> Result<String> {
    if new_name.contains('/') || new_name.contains('\\') || new_name.contains("..") {
        return Err(AppError::Custom("Invalid file name".into()));
    }
    let old = Path::new(&old_path);
    let parent = old
        .parent()
        .ok_or(AppError::Custom("No parent directory".into()))?;
    let mut name = new_name.clone();
    if !name.ends_with(".md") {
        name.push_str(".md");
    }
    let new_path = parent.join(&name);
    if new_path.parent() != Some(parent) {
        return Err(AppError::Custom("Invalid file name".into()));
    }
    tokio::fs::rename(&old_path, &new_path).await?;
    Ok(new_path.to_string_lossy().to_string())
}

use base64::Engine;

#[tauri::command]
async fn save_image(dir_path: String, file_name: String, data_base64: String) -> Result<String> {
    if file_name.contains('/') || file_name.contains('\\') || file_name.contains("..") {
        return Err(AppError::Custom("Invalid file name".into()));
    }
    let assets_dir = Path::new(&dir_path).join("_assets");
    tokio::fs::create_dir_all(&assets_dir).await?;
    let file_path = assets_dir.join(&file_name);
    let bytes = base64::engine::general_purpose::STANDARD
        .decode(&data_base64)
        .map_err(|e| AppError::Custom(format!("Invalid base64: {}", e)))?;
    tokio::fs::write(&file_path, bytes).await?;
    Ok(format!("_assets/{}", file_name))
}

#[tauri::command]
async fn read_image_base64(file_path: String) -> Result<String> {
    let bytes = tokio::fs::read(&file_path).await?;
    Ok(base64::engine::general_purpose::STANDARD.encode(&bytes))
}

#[tauri::command]
async fn search_files(dir_path: String, query: String) -> Result<Vec<SearchResult>> {
    let query_lower = query.to_lowercase();
    let mut results = Vec::new();
    let mut dirs = vec![std::path::PathBuf::from(&dir_path)];

    while let Some(dir) = dirs.pop() {
        let mut read_dir = tokio::fs::read_dir(&dir).await?;
        while let Some(entry) = read_dir.next_entry().await? {
            let name = entry.file_name().to_string_lossy().to_string();
            if name.starts_with('.') {
                continue;
            }
            let metadata = entry.metadata().await?;
            if metadata.is_dir() {
                dirs.push(entry.path());
            } else if name.ends_with(".md") {
                if let Ok(content) = tokio::fs::read_to_string(entry.path()).await {
                    for (i, line) in content.lines().enumerate() {
                        if line.to_lowercase().contains(&query_lower) {
                            results.push(SearchResult {
                                file_name: name.clone(),
                                file_path: entry.path().to_string_lossy().to_string(),
                                line_number: i + 1,
                                line_text: line.to_string(),
                            });
                        }
                    }
                }
            }
        }
    }

    results.sort_by(|a, b| a.file_name.to_lowercase().cmp(&b.file_name.to_lowercase())
        .then(a.line_number.cmp(&b.line_number)));
    Ok(results)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())

        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            list_files,
            read_file,
            write_file,
            create_file,
            delete_file,
            rename_file,
            save_image,
            read_image_base64,
            search_files,
            get_file_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
