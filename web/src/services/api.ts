const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Video {
  id: string;
  title: string;
  description: string;
  filename: string;
  thumbnail?: string;
  duration?: number;
  uploadedAt: string;
  updatedAt: string;
}

export interface VideoInput {
  title: string;
  description: string;
  filename: string;
  thumbnail?: string;
}

export class ApiService {
  async getVideos(): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos`);
    if (!response.ok) throw new Error('Failed to fetch videos');
    return response.json();
  }

  async getVideoById(id: string): Promise<Video | null> {
    const response = await fetch(`${API_BASE_URL}/videos/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch video');
    return response.json();
  }

  async searchVideos(query: string): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search videos');
    return response.json();
  }

  async addVideo(video: VideoInput): Promise<Video> {
    const response = await fetch(`${API_BASE_URL}/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(video),
    });
    if (!response.ok) throw new Error('Failed to add video');
    return response.json();
  }

  async updateVideo(id: string, video: VideoInput): Promise<Video> {
    const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(video),
    });
    if (!response.ok) throw new Error('Failed to update video');
    return response.json();
  }

  async deleteVideo(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete video');
  }
}

export const apiService = new ApiService();