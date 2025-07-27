# Design Document

## Overview

ネットフリックスクローンは、動画コンテンツの閲覧・検索・再生機能を提供する軽量なWebアプリケーションです。フロントエンドにSolid.js、バックエンドにSupabase、ローカル開発にSQLiteを使用したシンプルな構成で実装します。

### 技術スタック

- **Frontend**: Solid.js + TypeScript + Solid UI/Kobalte
- **Backend**: Supabase (本番) / SQLite (ローカル開発)
- **Video Storage**: ローカルファイルシステム (開発) / Supabase Storage (本番)
- **Build Tool**: Vite
- **Package Manager**: npm

## Architecture

### システム構成図

```mermaid
graph TB
    subgraph "Frontend (Solid.js)"
        A[Video List Component]
        B[Video Player Component]
        C[Search Component]
        D[Admin Panel Component]
    end
    
    subgraph "Backend Services"
        E[Supabase Client]
        F[Local SQLite (Dev)]
        G[Supabase Database (Prod)]
    end
    
    subgraph "Storage"
        H[Local Files (Dev)]
        I[Supabase Storage (Prod)]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    E --> F
    E --> G
    B --> H
    B --> I
```

### アプリケーション構造

```
netflix-clone/
├── src/
│   ├── components/          # UIコンポーネント
│   │   ├── VideoList.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── SearchBar.tsx
│   │   └── AdminPanel.tsx
│   ├── pages/              # ページコンポーネント
│   │   ├── Home.tsx
│   │   ├── VideoDetail.tsx
│   │   └── Admin.tsx
│   ├── services/           # データアクセス層
│   │   ├── database.ts
│   │   └── storage.ts
│   ├── types/              # TypeScript型定義
│   │   └── video.ts
│   └── utils/              # ユーティリティ関数
│       └── config.ts
├── public/                 # 静的ファイル
│   └── videos/            # ローカル動画ファイル (開発用)
├── database/              # ローカルデータベース
│   └── sqlite.db
└── package.json
```

## Components and Interfaces

### Core Components

#### 1. VideoList Component
```typescript
interface VideoListProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}
```

**責任:**
- 動画一覧の表示
- サムネイル、タイトル、説明の表示
- 動画選択時のイベント処理

#### 2. VideoPlayer Component
```typescript
interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}
```

**責任:**
- 動画の再生・一時停止・停止
- 音量調整
- 進行状況表示
- フルスクリーン対応

#### 3. SearchBar Component
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}
```

**責任:**
- 検索クエリの入力受付
- リアルタイム検索の実行
- 検索結果のフィルタリング

#### 4. AdminPanel Component
```typescript
interface AdminPanelProps {
  onVideoAdd: (video: VideoInput) => void;
  onVideoUpdate: (id: string, video: VideoInput) => void;
  onVideoDelete: (id: string) => void;
}
```

**責任:**
- 動画の追加・編集・削除
- 動画メタデータの管理
- ファイルアップロード処理

### Service Layer

#### Database Service
```typescript
interface DatabaseService {
  getVideos(): Promise<Video[]>;
  getVideoById(id: string): Promise<Video | null>;
  searchVideos(query: string): Promise<Video[]>;
  addVideo(video: VideoInput): Promise<Video>;
  updateVideo(id: string, video: VideoInput): Promise<Video>;
  deleteVideo(id: string): Promise<void>;
}
```

#### Storage Service
```typescript
interface StorageService {
  uploadVideo(file: File): Promise<string>;
  getVideoUrl(filename: string): string;
  deleteVideo(filename: string): Promise<void>;
}
```

## Data Models

### Video Model
```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  filename: string;
  thumbnail?: string;
  duration?: number;
  uploadedAt: Date;
  updatedAt: Date;
}

interface VideoInput {
  title: string;
  description: string;
  file: File;
  thumbnail?: File;
}
```

### Database Schema

#### SQLite (ローカル開発)
```sql
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  filename TEXT NOT NULL,
  thumbnail TEXT,
  duration INTEGER,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_videos_title ON videos(title);
CREATE INDEX idx_videos_uploaded_at ON videos(uploaded_at DESC);
```

#### Supabase (本番環境)
```sql
-- Supabaseのテーブル定義
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  filename TEXT NOT NULL,
  thumbnail TEXT,
  duration INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) ポリシー
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 読み取りは全ユーザーに許可
CREATE POLICY "Videos are viewable by everyone" ON videos
  FOR SELECT USING (true);

-- 管理者のみ書き込み可能（実装時に管理者認証を追加）
CREATE POLICY "Videos are insertable by admins" ON videos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Videos are updatable by admins" ON videos
  FOR UPDATE USING (true);

CREATE POLICY "Videos are deletable by admins" ON videos
  FOR DELETE USING (true);
```

## Error Handling

### エラー分類と処理方針

#### 1. ネットワークエラー
- **発生場面**: Supabaseとの通信エラー
- **処理方針**: リトライ機能付きのエラーハンドリング
- **ユーザー体験**: 「接続に問題があります。再試行してください」

#### 2. ファイル関連エラー
- **発生場面**: 動画ファイルのアップロード・再生エラー
- **処理方針**: ファイル形式・サイズの事前チェック
- **ユーザー体験**: 「サポートされていないファイル形式です」

#### 3. データベースエラー
- **発生場面**: CRUD操作の失敗
- **処理方針**: トランザクション管理とロールバック
- **ユーザー体験**: 「操作に失敗しました。もう一度お試しください」

### エラーハンドリング実装

```typescript
// エラー型定義
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  FILE_ERROR = 'FILE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
}

// エラーハンドラー
class ErrorHandler {
  static handle(error: AppError): void {
    console.error(`[${error.type}] ${error.message}`, error.details);
    
    // ユーザー向けメッセージの表示
    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        showToast('接続に問題があります。再試行してください');
        break;
      case ErrorType.FILE_ERROR:
        showToast('ファイルの処理に失敗しました');
        break;
      default:
        showToast('エラーが発生しました');
    }
  }
}
```

## Testing Strategy

### テスト構成

#### 1. Unit Tests
- **対象**: 個別コンポーネント、サービス関数
- **ツール**: Vitest + @solidjs/testing-library
- **カバレッジ**: 80%以上を目標

#### 2. Integration Tests
- **対象**: コンポーネント間の連携、API通信
- **ツール**: Vitest + MSW (Mock Service Worker)
- **重点**: データフロー、エラーハンドリング

#### 3. E2E Tests
- **対象**: ユーザーシナリオ全体
- **ツール**: Playwright
- **シナリオ**: 動画閲覧、検索、管理機能

### テスト実装例

```typescript
// VideoList.test.tsx
import { render, screen } from '@solidjs/testing-library';
import { VideoList } from './VideoList';

describe('VideoList', () => {
  const mockVideos = [
    { id: '1', title: 'Test Video', description: 'Test Description' }
  ];

  test('renders video list correctly', () => {
    render(() => <VideoList videos={mockVideos} onVideoSelect={() => {}} />);
    expect(screen.getByText('Test Video')).toBeInTheDocument();
  });

  test('calls onVideoSelect when video is clicked', () => {
    const mockOnSelect = vi.fn();
    render(() => <VideoList videos={mockVideos} onVideoSelect={mockOnSelect} />);
    
    screen.getByText('Test Video').click();
    expect(mockOnSelect).toHaveBeenCalledWith(mockVideos[0]);
  });
});
```

### 環境別設定

#### 開発環境
- SQLiteデータベースの自動初期化
- ローカルファイルストレージ
- ホットリロード対応

#### 本番環境
- Supabaseデータベース接続
- Supabase Storageでのファイル管理
- 環境変数による設定管理

```typescript
// config.ts
interface Config {
  database: {
    type: 'sqlite' | 'supabase';
    url?: string;
    key?: string;
  };
  storage: {
    type: 'local' | 'supabase';
    basePath: string;
  };
}

export const config: Config = {
  database: {
    type: import.meta.env.PROD ? 'supabase' : 'sqlite',
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  storage: {
    type: import.meta.env.PROD ? 'supabase' : 'local',
    basePath: import.meta.env.PROD ? 'videos' : '/public/videos',
  },
};
```