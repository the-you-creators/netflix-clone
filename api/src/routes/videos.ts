import { Router } from 'express';
import { databaseService } from '../services/database';
import type { VideoInput } from '../types/video';

export const videosRouter = Router();

// 動画一覧取得
videosRouter.get('/', (req, res) => {
  try {
    const videos = databaseService.getVideos();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// 動画検索
videosRouter.get('/search', (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const videos = databaseService.searchVideos(query);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search videos' });
  }
});

// 動画詳細取得
videosRouter.get('/:id', (req, res) => {
  try {
    const video = databaseService.getVideoById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// 動画追加
videosRouter.post('/', (req, res) => {
  try {
    const videoInput: VideoInput = req.body;
    
    if (!videoInput.title || !videoInput.description || !videoInput.filename) {
      return res.status(400).json({ error: 'Title, description, and filename are required' });
    }
    
    const video = databaseService.addVideo(videoInput);
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add video' });
  }
});

// 動画更新
videosRouter.put('/:id', (req, res) => {
  try {
    const videoInput: VideoInput = req.body;
    
    if (!videoInput.title || !videoInput.description || !videoInput.filename) {
      return res.status(400).json({ error: 'Title, description, and filename are required' });
    }
    
    const video = databaseService.updateVideo(req.params.id, videoInput);
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// 動画削除
videosRouter.delete('/:id', (req, res) => {
  try {
    databaseService.deleteVideo(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});