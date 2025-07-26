import { For } from 'solid-js';
import type { Component } from 'solid-js';
import type { Video } from '@/services/api';

interface VideoListProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

export const VideoList: Component<VideoListProps> = (props) => {
  return (
    <div class="video-grid">
      <For each={props.videos}>
        {(video) => (
          <div 
            class="video-card"
            onClick={() => props.onVideoSelect(video)}
          >
            <div class="video-thumbnail">
              {video.thumbnail ? (
                <img src={`/videos/${video.thumbnail}`} alt={video.title} />
              ) : (
                <div class="placeholder-thumbnail">
                  <span>{video.title.charAt(0)}</span>
                </div>
              )}
            </div>
            <div class="video-info">
              <h3 class="video-title">{video.title}</h3>
              <p class="video-description">{video.description}</p>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export const videoListStyles = `
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  }

  .video-card {
    background: #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .video-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .video-thumbnail {
    width: 100%;
    height: 180px;
    background: #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-thumbnail {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .placeholder-thumbnail span {
    font-size: 48px;
    color: white;
    font-weight: bold;
  }

  .video-info {
    padding: 15px;
  }

  .video-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #ffffff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .video-description {
    font-size: 14px;
    color: #999;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;