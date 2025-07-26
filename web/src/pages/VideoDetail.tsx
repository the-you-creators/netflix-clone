import { createSignal, createEffect, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import { VideoPlayer } from '@/components/VideoPlayer';
import type { Video } from '@/services/api';
import { apiService } from '@/services/api';

export const VideoDetail: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = createSignal<Video | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [showPlayer, setShowPlayer] = createSignal(false);

  const loadVideo = async () => {
    const videoId = params.id;
    if (!videoId) {
      setError('動画IDが指定されていません');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const videoData = await apiService.getVideoById(videoId);
      
      if (!videoData) {
        setError('動画が見つかりません');
      } else {
        const videoWithDates = {
          ...videoData,
          uploadedAt: new Date(videoData.uploadedAt),
          updatedAt: new Date(videoData.updatedAt),
        };
        setVideo(videoWithDates as any);
      }
    } catch (err) {
      console.error('Failed to load video:', err);
      setError('動画の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVideo = () => {
    setShowPlayer(true);
  };

  const handleBack = () => {
    navigate('/');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '不明';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}分${secs}秒`;
  };

  createEffect(() => {
    loadVideo();
  });

  return (
    <div class="video-detail-page">
      <header class="detail-header">
        <button class="back-button" onClick={handleBack}>
          ← ホームに戻る
        </button>
      </header>

      <Show when={isLoading()}>
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>動画情報を読み込んでいます...</p>
        </div>
      </Show>

      <Show when={error()}>
        <div class="error-container">
          <h2>エラー</h2>
          <p>{error()}</p>
          <button onClick={handleBack}>ホームに戻る</button>
        </div>
      </Show>

      <Show when={video() && !isLoading() && !error()}>
        <main class="detail-main">
          <div class="video-preview">
            {video()!.thumbnail ? (
              <img 
                src={`/videos/${video()!.thumbnail!}`} 
                alt={video()!.title}
                class="preview-image"
              />
            ) : (
              <div class="preview-placeholder">
                <span>{video()!.title.charAt(0)}</span>
              </div>
            )}
            <button class="play-overlay" onClick={handlePlayVideo}>
              <span class="play-icon">▶</span>
              <span>再生</span>
            </button>
          </div>

          <div class="video-info-container">
            <h1 class="video-title">{video()!.title}</h1>
            
            <div class="video-metadata">
              <span class="metadata-item">
                📅 {formatDate(new Date(video()!.uploadedAt))}
              </span>
              <span class="metadata-item">
                ⏱ {formatDuration(video()!.duration)}
              </span>
            </div>

            <div class="video-description">
              <h2>説明</h2>
              <p>{video()!.description}</p>
            </div>

            <div class="video-details">
              <h3>詳細情報</h3>
              <dl>
                <dt>ファイル名:</dt>
                <dd>{video()!.filename}</dd>
                <dt>動画ID:</dt>
                <dd>{video()!.id}</dd>
                <dt>最終更新:</dt>
                <dd>{formatDate(new Date(video()!.updatedAt))}</dd>
              </dl>
            </div>
          </div>
        </main>

        <Show when={showPlayer()}>
          <VideoPlayer 
            video={video()!} 
            onClose={() => setShowPlayer(false)}
          />
        </Show>
      </Show>
    </div>
  );
};

export const videoDetailStyles = `
  .video-detail-page {
    min-height: 100vh;
    background: #141414;
    color: white;
  }

  .detail-header {
    padding: 20px 40px;
    background: rgba(0, 0, 0, 0.7);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
  }

  .back-button {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  }

  .back-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 20px;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #e50914;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-container p,
  .error-container p {
    margin-top: 20px;
    font-size: 16px;
    color: #999;
  }

  .error-container h2 {
    color: #f85149;
    margin-bottom: 10px;
  }

  .error-container button {
    margin-top: 20px;
    padding: 10px 30px;
    background: #e50914;
    border: none;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .detail-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .video-preview {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto 40px;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
  }

  .preview-image {
    width: 100%;
    height: auto;
    display: block;
  }

  .preview-placeholder {
    width: 100%;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-size: 120px;
    font-weight: bold;
  }

  .play-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid white;
    color: white;
    padding: 20px 40px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s;
  }

  .play-overlay:hover {
    background: #e50914;
    border-color: #e50914;
    transform: translate(-50%, -50%) scale(1.1);
  }

  .play-icon {
    font-size: 24px;
  }

  .video-info-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .video-title {
    font-size: 36px;
    margin-bottom: 20px;
  }

  .video-metadata {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
    color: #999;
    font-size: 16px;
  }

  .metadata-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .video-description {
    margin-bottom: 40px;
  }

  .video-description h2 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .video-description p {
    line-height: 1.6;
    color: #ccc;
    font-size: 16px;
  }

  .video-details {
    background: rgba(255, 255, 255, 0.05);
    padding: 30px;
    border-radius: 8px;
  }

  .video-details h3 {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .video-details dl {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 15px;
  }

  .video-details dt {
    color: #999;
    font-weight: 500;
  }

  .video-details dd {
    color: #ccc;
    margin: 0;
    word-break: break-all;
  }

  @media (max-width: 768px) {
    .detail-header {
      padding: 15px 20px;
    }

    .video-title {
      font-size: 28px;
    }

    .video-metadata {
      flex-direction: column;
      gap: 10px;
    }

    .video-details dl {
      grid-template-columns: 1fr;
    }

    .video-details dt {
      margin-bottom: 5px;
    }
  }
`;