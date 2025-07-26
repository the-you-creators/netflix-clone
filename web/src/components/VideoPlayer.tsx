import { createSignal, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import type { Video } from '@/services/api';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export const VideoPlayer: Component<VideoPlayerProps> = (props) => {
  let videoRef: HTMLVideoElement | undefined;
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [volume, setVolume] = createSignal(1);
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);

  const videoUrl = () => `/videos/${props.video.filename}`;

  const togglePlay = () => {
    if (!videoRef) return;
    
    if (isPlaying()) {
      videoRef.pause();
    } else {
      videoRef.play();
    }
    setIsPlaying(!isPlaying());
  };

  const handleVolumeChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);
    setVolume(newVolume);
    if (videoRef) {
      videoRef.volume = newVolume;
    }
  };

  const handleSeek = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    setCurrentTime(newTime);
    if (videoRef) {
      videoRef.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.onClose();
    } else if (e.key === ' ') {
      e.preventDefault();
      togglePlay();
    }
  };

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  document.addEventListener('keydown', handleKeyDown);

  return (
    <div class="video-player-overlay" onClick={props.onClose}>
      <div class="video-player-container" onClick={(e) => e.stopPropagation()}>
        <button class="close-button" onClick={props.onClose}>
          ✕
        </button>
        
        <video
          ref={videoRef}
          src={videoUrl()}
          class="video-element"
          onTimeUpdate={() => setCurrentTime(videoRef?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(videoRef?.duration || 0)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        <div class="video-controls">
          <button class="play-button" onClick={togglePlay}>
            {isPlaying() ? '⏸' : '▶'}
          </button>
          
          <div class="progress-container">
            <input
              type="range"
              min="0"
              max={duration()}
              value={currentTime()}
              onInput={handleSeek}
              class="progress-bar"
            />
            <span class="time-display">
              {formatTime(currentTime())} / {formatTime(duration())}
            </span>
          </div>
          
          <div class="volume-container">
            <span class="volume-icon">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume()}
              onInput={handleVolumeChange}
              class="volume-slider"
            />
          </div>
        </div>
        
        <div class="video-info">
          <h2>{props.video.title}</h2>
          <p>{props.video.description}</p>
        </div>
      </div>
    </div>
  );
};

export const videoPlayerStyles = `
  .video-player-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .video-player-container {
    background: #000;
    border-radius: 8px;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    font-size: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s;
  }

  .close-button:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .video-element {
    width: 100%;
    max-height: 60vh;
    object-fit: contain;
  }

  .video-controls {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    gap: 15px;
    background: rgba(0, 0, 0, 0.8);
  }

  .play-button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 5px 10px;
    transition: transform 0.2s;
  }

  .play-button:hover {
    transform: scale(1.1);
  }

  .progress-container {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.3);
    outline: none;
    cursor: pointer;
  }

  .progress-bar::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: #e50914;
    border-radius: 50%;
    cursor: pointer;
  }

  .time-display {
    color: white;
    font-size: 14px;
    white-space: nowrap;
  }

  .volume-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .volume-icon {
    color: white;
    font-size: 16px;
  }

  .volume-slider {
    width: 80px;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.3);
    outline: none;
    cursor: pointer;
  }

  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }

  .video-info {
    padding: 20px;
    color: white;
  }

  .video-info h2 {
    margin: 0 0 10px 0;
    font-size: 24px;
  }

  .video-info p {
    margin: 0;
    color: #ccc;
    line-height: 1.5;
  }
`;