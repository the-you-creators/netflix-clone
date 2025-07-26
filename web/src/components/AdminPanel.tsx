import { createSignal, For } from 'solid-js';
import type { Component } from 'solid-js';
import type { Video, VideoInput } from '@/services/api';
import { apiService } from '@/services/api';

interface AdminPanelProps {
  onVideoAdd?: (video: VideoInput) => void;
  onVideoUpdate?: (id: string, video: VideoInput) => void;
  onVideoDelete?: (id: string) => void;
}

export const AdminPanel: Component<AdminPanelProps> = (props) => {
  const [title, setTitle] = createSignal('');
  const [description, setDescription] = createSignal('');
  const [videoFile, setVideoFile] = createSignal<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = createSignal<File | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);
  const [message, setMessage] = createSignal('');
  const [videos, setVideos] = createSignal<Video[]>([]);
  const [editingId, setEditingId] = createSignal<string | null>(null);

  const loadVideos = async () => {
    try {
      const videoList = await apiService.getVideos();
      const videosWithDates = videoList.map(v => ({
        ...v,
        uploadedAt: new Date(v.uploadedAt),
        updatedAt: new Date(v.updatedAt),
      }));
      setVideos(videosWithDates as any);
    } catch (error) {
      console.error('Failed to load videos:', error);
      setMessage('動画の読み込みに失敗しました');
    }
  };

  const handleVideoFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      setMessage('有効な動画ファイルを選択してください');
    }
  };

  const handleThumbnailFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
    } else {
      setMessage('有効な画像ファイルを選択してください');
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!title() || !description() || !videoFile()) {
      setMessage('すべての必須フィールドを入力してください');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const videoData: VideoInput = {
        title: title(),
        description: description(),
        filename: videoFile()!.name,
        thumbnail: thumbnailFile()?.name
      };

      if (editingId()) {
        await apiService.updateVideo(editingId()!, videoData);
        if (props.onVideoUpdate) {
          props.onVideoUpdate(editingId()!, videoData);
        }
        setMessage('動画を更新しました');
        setEditingId(null);
      } else {
        // ファイルアップロードはAPIで処理される
        
        await apiService.addVideo(videoData);
        if (props.onVideoAdd) {
          props.onVideoAdd(videoData);
        }
        setMessage('動画を追加しました');
      }

      // フォームをリセット
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      
      // リストを更新
      await loadVideos();
    } catch (error) {
      console.error('Failed to save video:', error);
      setMessage('動画の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
    setTitle(video.title);
    setDescription(video.description);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この動画を削除してもよろしいですか？')) {
      return;
    }

    try {
      await apiService.deleteVideo(id);
      if (props.onVideoDelete) {
        props.onVideoDelete(id);
      }
      
      await loadVideos();
      setMessage('動画を削除しました');
    } catch (error) {
      console.error('Failed to delete video:', error);
      setMessage('動画の削除に失敗しました');
    }
  };

  // 初期読み込み
  loadVideos();

  return (
    <div class="admin-panel">
      <h2>動画管理パネル</h2>
      
      <form class="video-form" onSubmit={handleSubmit}>
        <div class="form-group">
          <label for="title">タイトル *</label>
          <input
            id="title"
            type="text"
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
            required
          />
        </div>

        <div class="form-group">
          <label for="description">説明 *</label>
          <textarea
            id="description"
            value={description()}
            onInput={(e) => setDescription(e.currentTarget.value)}
            rows="4"
            required
          />
        </div>

        <div class="form-group">
          <label for="video">動画ファイル *</label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleVideoFileChange}
            required={!editingId()}
          />
        </div>

        <div class="form-group">
          <label for="thumbnail">サムネイル画像</label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailFileChange}
          />
        </div>

        {message() && (
          <div class={`message ${message().includes('失敗') ? 'error' : 'success'}`}>
            {message()}
          </div>
        )}

        <button type="submit" disabled={isLoading()}>
          {isLoading() ? '処理中...' : editingId() ? '更新' : '追加'}
        </button>
        
        {editingId() && (
          <button type="button" onClick={() => {
            setEditingId(null);
            setTitle('');
            setDescription('');
            setVideoFile(null);
            setThumbnailFile(null);
          }}>
            キャンセル
          </button>
        )}
      </form>

      <div class="video-list">
        <h3>登録済み動画</h3>
        <For each={videos()}>
          {(video) => (
            <div class="video-item">
              <div class="video-item-info">
                <h4>{video.title}</h4>
                <p>{video.description}</p>
              </div>
              <div class="video-item-actions">
                <button onClick={() => handleEdit(video)}>編集</button>
                <button onClick={() => handleDelete(video.id)} class="delete-button">
                  削除
                </button>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export const adminPanelStyles = `
  .admin-panel {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .admin-panel h2 {
    color: white;
    margin-bottom: 30px;
  }

  .video-form {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 30px;
    margin-bottom: 40px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    color: white;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .form-group input[type="text"],
  .form-group textarea {
    width: 100%;
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: white;
    font-size: 16px;
  }

  .form-group input[type="file"] {
    color: white;
    font-size: 14px;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #e50914;
    background: rgba(255, 255, 255, 0.15);
  }

  .message {
    padding: 10px 15px;
    border-radius: 4px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .message.success {
    background: rgba(46, 160, 67, 0.2);
    color: #2ea043;
    border: 1px solid rgba(46, 160, 67, 0.3);
  }

  .message.error {
    background: rgba(248, 81, 73, 0.2);
    color: #f85149;
    border: 1px solid rgba(248, 81, 73, 0.3);
  }

  button {
    padding: 10px 20px;
    background: #e50914;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    margin-right: 10px;
  }

  button:hover:not(:disabled) {
    background: #f40612;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .video-list {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 30px;
  }

  .video-list h3 {
    color: white;
    margin-bottom: 20px;
  }

  .video-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .video-item-info h4 {
    color: white;
    margin: 0 0 5px 0;
  }

  .video-item-info p {
    color: #999;
    margin: 0;
    font-size: 14px;
  }

  .video-item-actions {
    display: flex;
    gap: 10px;
  }

  .video-item-actions button {
    padding: 5px 15px;
    font-size: 14px;
  }

  .delete-button {
    background: #dc3545;
  }

  .delete-button:hover {
    background: #c82333;
  }
`;