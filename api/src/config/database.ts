import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'database');
const DB_FILE = path.join(DB_PATH, 'netflix.db');

// データベースディレクトリの作成
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

export const db: Database.Database = new Database(DB_FILE);

// データベースの初期化
export function initDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      filename TEXT NOT NULL,
      thumbnail TEXT,
      duration INTEGER,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_videos_title ON videos(title);
    CREATE INDEX IF NOT EXISTS idx_videos_uploaded_at ON videos(uploaded_at DESC);
  `;
  
  db.exec(createTableQuery);
  console.log('Database initialized');
}