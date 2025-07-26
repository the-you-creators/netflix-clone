import { createSignal, createEffect, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { VideoList } from '@/components/VideoList';
import { SearchBar } from '@/components/SearchBar';
import { VideoPlayer } from '@/components/VideoPlayer';
import type { Video } from '@/services/api';
import { apiService } from '@/services/api';
import { useNavigate } from '@solidjs/router';

export const Home: Component = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = createSignal<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = createSignal<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = createSignal<Video | null>(null);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const loadVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const videoList = await apiService.getVideos();
      const videosWithDates = videoList.map(v => ({
        ...v,
        uploadedAt: new Date(v.uploadedAt),
        updatedAt: new Date(v.updatedAt),
      }));
      setVideos(videosWithDates as any);
      setFilteredVideos(videosWithDates as any);
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError('動画の読み込みに失敗しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredVideos(videos());
      return;
    }

    try {
      const searchResults = await apiService.searchVideos(query);
      const resultsWithDates = searchResults.map(v => ({
        ...v,
        uploadedAt: new Date(v.uploadedAt),
        updatedAt: new Date(v.updatedAt),
      }));
      setFilteredVideos(resultsWithDates as any);
    } catch (err) {
      console.error('Search failed:', err);
      setError('検索に失敗しました。');
    }
  };

  const handleVideoSelect = (video: Video) => {
    navigate(`/video/${video.id}`);
  };

  createEffect(() => {
    loadVideos();
  });

  return (
    <div class="home-page">
      <header class="home-header">
        <h1 class="logo">NETFLIX CLONE</h1>
        <nav class="nav-menu">
          <a href="/" class="nav-link active">ホーム</a>
          <a href="/admin" class="nav-link">管理</a>
        </nav>
      </header>

      <main class="home-main">
        <SearchBar onSearch={handleSearch} />

        <Show when={error()}>
          <div class="error-message">{error()}</div>
        </Show>

        <Show when={isLoading()}>
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>動画を読み込んでいます...</p>
          </div>
        </Show>

        <Show when={!isLoading() && !error()}>
          <Show 
            when={filteredVideos().length > 0}
            fallback={
              <div class="no-results">
                <p>
                  {searchQuery() 
                    ? `"${searchQuery()}" に一致する動画が見つかりません` 
                    : '動画がありません'}
                </p>
              </div>
            }
          >
            <VideoList 
              videos={filteredVideos()} 
              onVideoSelect={handleVideoSelect}
            />
          </Show>
        </Show>

        <Show when={selectedVideo()}>
          <VideoPlayer 
            video={selectedVideo()!} 
            onClose={() => setSelectedVideo(null)}
          />
        </Show>
      </main>
    </div>
  );
};

export const homeStyles = `
  .home-page {
    min-height: 100vh;
    background: #141414;
  }

  .home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: rgba(0, 0, 0, 0.7);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
  }

  .logo {
    color: #e50914;
    font-size: 28px;
    font-weight: bold;
    margin: 0;
    letter-spacing: -1px;
  }

  .nav-menu {
    display: flex;
    gap: 30px;
  }

  .nav-link {
    color: #999;
    text-decoration: none;
    font-size: 16px;
    transition: color 0.2s;
  }

  .nav-link:hover,
  .nav-link.active {
    color: white;
  }

  .home-main {
    padding: 20px 0;
  }

  .error-message {
    text-align: center;
    color: #f85149;
    padding: 20px;
    background: rgba(248, 81, 73, 0.1);
    border: 1px solid rgba(248, 81, 73, 0.3);
    border-radius: 8px;
    margin: 20px 40px;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
    color: white;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #e50914;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-container p {
    margin-top: 20px;
    font-size: 16px;
    color: #999;
  }

  .no-results {
    text-align: center;
    padding: 100px 20px;
    color: #999;
    font-size: 18px;
  }

  @media (max-width: 768px) {
    .home-header {
      padding: 15px 20px;
      flex-direction: column;
      gap: 15px;
    }

    .logo {
      font-size: 24px;
    }

    .nav-menu {
      gap: 20px;
    }

    .nav-link {
      font-size: 14px;
    }
  }
`;