# Netflix Clone 設計書

## 1. システムアーキテクチャ

### 1.1 全体構成
```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Backend API   │
│   (Solid.js)    │────▶│  (Express.js)   │
│   Port: 3000    │     │   Port: 3001    │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │    Database     │
                        │  SQLite (Dev)   │
                        │  Postgres (Prod)│
                        └─────────────────┘
```

### 1.2 ディレクトリ構造
```
netflix-clone/
├── web/                 # フロントエンド
│   ├── src/
│   │   ├── components/  # UIコンポーネント
│   │   ├── pages/       # ページコンポーネント
│   │   ├── services/    # APIサービス
│   │   └── types/       # TypeScript型定義
│   └── public/
│       └── videos/      # 動画ファイル
├── api/                 # バックエンド
│   ├── src/
│   │   ├── routes/      # APIルート
│   │   ├── services/    # ビジネスロジック
│   │   └── types/       # TypeScript型定義
│   └── database/        # SQLiteデータベース
└── docs/                # ドキュメント
```

## 2. データモデル

### 2.1 Videoテーブル
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
```

## 3. API設計

### 3.1 エンドポイント一覧
| メソッド | パス | 説明 |
|---------|------|------|
| GET | /api/videos | 動画一覧取得 |
| GET | /api/videos/:id | 動画詳細取得 |
| GET | /api/videos/search?q=:query | 動画検索 |
| POST | /api/videos | 動画追加 |
| PUT | /api/videos/:id | 動画更新 |
| DELETE | /api/videos/:id | 動画削除 |

### 3.2 レスポンス形式
```typescript
interface Video {
    id: string;
    title: string;
    description: string;
    filename: string;
    thumbnail?: string;
    duration?: number;
    uploadedAt: string;
    updatedAt: string;
}
```

## 4. UI設計

### 4.1 ページ構成
1. **ホームページ** (`/`)
   - 動画一覧表示
   - 検索バー
   - 管理画面へのリンク

2. **動画詳細ページ** (`/video/:id`)
   - 動画プレイヤー
   - 動画情報表示
   - 関連動画（将来実装）

3. **管理画面** (`/admin`)
   - 動画アップロードフォーム
   - 動画一覧（編集・削除機能付き）

### 4.2 コンポーネント設計
- **VideoList**: 動画一覧を表示するグリッドレイアウト
- **VideoPlayer**: 動画再生コンポーネント
- **SearchBar**: 検索入力フィールド
- **AdminPanel**: 管理機能を提供するパネル

## 5. セキュリティ設計

### 5.1 現在の実装
- CORS設定による適切なオリジン制御
- 入力値の基本的な検証

### 5.2 将来の拡張
- JWT認証の実装
- レート制限の追加
- ファイルアップロードの検証強化

## 6. デプロイメント設計

### 6.1 開発環境
- フロントエンド: Vite dev server (Port 3000)
- バックエンド: Express.js + nodemon (Port 3001)
- データベース: SQLite (ローカルファイル)

### 6.2 本番環境
- フロントエンド: Vercel
- バックエンド: Railway/Render/Heroku等
- データベース: Supabase (PostgreSQL)