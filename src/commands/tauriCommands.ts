import { invoke } from "@tauri-apps/api/core";

export interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

export async function listFiles(dirPath: string): Promise<FileEntry[]> {
  return invoke("list_files", { dirPath });
}

export async function readFile(filePath: string): Promise<string> {
  return invoke("read_file", { filePath });
}

export async function writeFile(
  filePath: string,
  content: string,
): Promise<void> {
  return invoke("write_file", { filePath, content });
}

export async function createFile(
  dirPath: string,
  fileName: string,
): Promise<string> {
  return invoke("create_file", { dirPath, fileName });
}

export async function deleteFile(filePath: string): Promise<void> {
  return invoke("delete_file", { filePath });
}

export async function renameFile(
  oldPath: string,
  newName: string,
): Promise<string> {
  return invoke("rename_file", { oldPath, newName });
}

export async function saveImage(
  dirPath: string,
  fileName: string,
  dataBase64: string,
): Promise<string> {
  return invoke("save_image", { dirPath, fileName, dataBase64 });
}

export async function readImageBase64(filePath: string): Promise<string> {
  return invoke("read_image_base64", { filePath });
}

export interface FileInfo {
  name: string;
  createdAt: string;
  modifiedAt: string;
  sizeBytes: number;
}

export async function getFileInfo(filePath: string): Promise<FileInfo> {
  return invoke("get_file_info", { filePath });
}

export interface SearchResult {
  fileName: string;
  filePath: string;
  lineNumber: number;
  lineText: string;
}

export async function searchFiles(
  dirPath: string,
  query: string,
): Promise<SearchResult[]> {
  return invoke("search_files", { dirPath, query });
}
