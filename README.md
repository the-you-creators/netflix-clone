# Netflix Clone

Solid.js + Express.js + TypeScriptで作成したNetflixクローンアプリケーション

## 構成

- **フロントエンド** (`/web`): Solid.js + TypeScript + Vite
- **バックエンド** (`/api`): Express.js + TypeScript + SQLite

## セットアップ

### 1. バックエンドの起動

```bash
cd api
npm install
npm run dev
```

バックエンドは http://localhost:3001 で起動します。

### 2. フロントエンドの起動

```bash
cd web
npm install
npm run dev
```

フロントエンドは http://localhost:3000 で起動します。

## 動画の配置

`web/public/videos/` ディレクトリに動画ファイルを配置してください：
- 動画ファイル: `sample1.mp4`, `sample2.mp4` など
- サムネイル画像: `sample1-thumb.jpg`, `sample2-thumb.jpg` など

## API エンドポイント

- `GET /api/videos` - 動画一覧取得
- `GET /api/videos/:id` - 動画詳細取得
- `GET /api/videos/search?q=query` - 動画検索
- `POST /api/videos` - 動画追加
- `PUT /api/videos/:id` - 動画更新
- `DELETE /api/videos/:id` - 動画削除

## 本番環境での設定

### Vercel (フロントエンド)

1. `web` ディレクトリをルートとして設定
2. 環境変数 `VITE_API_URL` にAPIのURLを設定

### PostgreSQL/Supabase (バックエンド)

1. 環境変数を設定:
   - `DATABASE_URL` - PostgreSQL接続文字列
   - `SUPABASE_URL` - SupabaseプロジェクトURL
   - `SUPABASE_ANON_KEY` - Supabase匿名キー

## 技術スタック

- **フロントエンド**: Solid.js, TypeScript, Vite, Kobalte UI
- **バックエンド**: Express.js, TypeScript, SQLite (開発), PostgreSQL/Supabase (本番)
- **スタイリング**: CSS (UIライブラリ内蔵)