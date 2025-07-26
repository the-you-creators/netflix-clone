import { db } from '../config/database';
import type { Video, VideoInput } from '../types/video';
import crypto from 'crypto';

export class DatabaseService {
  getVideos(): Video[] {
    const stmt = db.prepare('SELECT * FROM videos ORDER BY uploaded_at DESC');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      filename: row.filename,
      thumbnail: row.thumbnail,
      duration: row.duration,
      uploadedAt: new Date(row.uploaded_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  getVideoById(id: string): Video | null {
    const stmt = db.prepare('SELECT * FROM videos WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      filename: row.filename,
      thumbnail: row.thumbnail,
      duration: row.duration,
      uploadedAt: new Date(row.uploaded_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  searchVideos(query: string): Video[] {
    const stmt = db.prepare('SELECT * FROM videos WHERE title LIKE ? ORDER BY title');
    const rows = stmt.all(`%${query}%`) as any[];
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      filename: row.filename,
      thumbnail: row.thumbnail,
      duration: row.duration,
      uploadedAt: new Date(row.uploaded_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  addVideo(video: VideoInput): Video {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO videos (id, title, description, filename, thumbnail, uploaded_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, video.title, video.description, video.filename, video.thumbnail || null, now, now);
    
    return this.getVideoById(id)!;
  }

  updateVideo(id: string, video: VideoInput): Video {
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      UPDATE videos 
      SET title = ?, description = ?, filename = ?, thumbnail = ?, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(video.title, video.description, video.filename, video.thumbnail || null, now, id);
    
    return this.getVideoById(id)!;
  }

  deleteVideo(id: string): void {
    const stmt = db.prepare('DELETE FROM videos WHERE id = ?');
    stmt.run(id);
  }
}

export const databaseService = new DatabaseService();