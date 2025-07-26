# Netflix Clone

Solid.js + Express.js + TypeScriptで作成したNetflixクローンアプリケーション。  
動画の一覧表示、検索、再生、管理機能を備えた動画配信プラットフォームです。

## 🎬 機能

### 視聴者向け機能
- **動画一覧表示**: ホームページで利用可能な動画をグリッド形式で表示
- **動画検索**: リアルタイムで動画をタイトル・説明文から検索
- **動画詳細表示**: 動画の詳細情報（タイトル、説明、アップロード日時等）を表示
- **動画再生**: ブラウザ内で動画を再生（再生コントロール付き）
- **レスポンシブデザイン**: PC、タブレット、スマートフォンに対応

### 管理者向け機能
- **動画追加**: 新しい動画情報をデータベースに登録
- **動画編集**: 既存動画のタイトルや説明を編集
- **動画削除**: 不要な動画をシステムから削除
- **管理画面**: `/admin`ルートから専用管理インターフェースにアクセス

## 🏗️ アーキテクチャ

```
netflix-clone/
├── web/                    # フロントエンド (Solid.js)
│   ├── src/
│   │   ├── components/     # UIコンポーネント
│   │   │   ├── VideoList.tsx      # 動画一覧グリッド
│   │   │   ├── VideoPlayer.tsx    # 動画プレイヤー
│   │   │   ├── SearchBar.tsx      # 検索バー
│   │   │   └── AdminPanel.tsx     # 管理パネル
│   │   ├── pages/          # ページコンポーネント
│   │   │   ├── Home.tsx          # ホームページ
│   │   │   ├── VideoDetail.tsx   # 動画詳細ページ
│   │   │   └── Admin.tsx         # 管理画面
│   │   ├── services/       # APIサービス
│   │   │   └── api.ts            # APIクライアント
│   │   ├── styles/         # グローバルスタイル
│   │   ├── types/          # TypeScript型定義
│   │   └── App.tsx         # ルートコンポーネント
│   ├── public/
│   │   └── videos/         # 動画ファイル保存場所
│   └── package.json
│
├── api/                    # バックエンド (Express.js)
│   ├── src/
│   │   ├── routes/         # APIルート定義
│   │   │   └── videos.ts         # 動画関連エンドポイント
│   │   ├── services/       # ビジネスロジック
│   │   │   └── database.ts       # データベース操作
│   │   ├── config/         # 設定ファイル
│   │   │   └── database.ts       # DB初期化
│   │   ├── types/          # TypeScript型定義
│   │   └── index.ts        # エントリーポイント
│   ├── database/           # SQLiteデータベースファイル
│   └── package.json
│
└── docs/                   # プロジェクトドキュメント
    ├── requirements.md     # 要件定義書
    ├── design.md          # 設計書
    └── implementation-plan.md  # 実装計画書
```

## 🚀 セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn
- Git

### 1. リポジトリのクローン
```bash
git clone https://github.com/the-you-creators/netflix-clone.git
cd netflix-clone
```

### 2. バックエンドのセットアップと起動
```bash
cd api
npm install
npm run dev
```
バックエンドは http://localhost:3001 で起動します。

### 3. フロントエンドのセットアップと起動
新しいターミナルを開いて：
```bash
cd web
npm install
npm run dev
```
フロントエンドは http://localhost:3000 で起動します。

### 4. サンプル動画の追加（オプション）
```bash
# web/public/videos/にサンプル動画を配置後、以下のコマンドで登録
curl -X POST http://localhost:3001/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "サンプル動画",
    "description": "これはサンプル動画です",
    "filename": "sample.mp4"
  }'
```

## 📹 動画ファイルの管理

動画ファイルは `web/public/videos/` ディレクトリに配置します：
- 動画ファイル: `*.mp4`, `*.webm`, `*.mov` など
- サムネイル画像: `*-thumb.jpg` （オプション）

## 🔌 API エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/videos` | 全動画の一覧を取得 |
| GET | `/api/videos/:id` | 特定の動画の詳細を取得 |
| GET | `/api/videos/search?q=query` | 動画を検索 |
| POST | `/api/videos` | 新しい動画を追加 |
| PUT | `/api/videos/:id` | 動画情報を更新 |
| DELETE | `/api/videos/:id` | 動画を削除 |

### リクエスト/レスポンス例
```typescript
// POST /api/videos
{
  "title": "動画タイトル",
  "description": "動画の説明",
  "filename": "video.mp4",
  "thumbnail": "video-thumb.jpg" // オプション
}

// レスポンス
{
  "id": "uuid",
  "title": "動画タイトル",
  "description": "動画の説明",
  "filename": "video.mp4",
  "thumbnail": "video-thumb.jpg",
  "duration": null,
  "uploadedAt": "2025-07-26T07:00:00.000Z",
  "updatedAt": "2025-07-26T07:00:00.000Z"
}
```

## 🌐 本番環境へのデプロイ

### フロントエンド (Vercel)
1. Vercelアカウントでプロジェクトをインポート
2. ルートディレクトリを `web` に設定
3. ビルドコマンド: `npm run build`
4. 出力ディレクトリ: `dist`
5. 環境変数:
   - `VITE_API_URL`: バックエンドAPIのURL

### バックエンド (Railway/Render等)
1. プロジェクトをデプロイプラットフォームに接続
2. ルートディレクトリを `api` に設定
3. 環境変数:
   - `DATABASE_URL`: PostgreSQL接続文字列
   - `PORT`: アプリケーションポート（デフォルト: 3001）

## 🛠️ 開発コマンド

### フロントエンド
```bash
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
npm run serve  # ビルドしたアプリをプレビュー
```

### バックエンド
```bash
npm run dev    # 開発サーバー起動（nodemon使用）
npm run build  # TypeScriptをコンパイル
npm start      # プロダクションサーバー起動
```

## 🔧 環境変数

### フロントエンド (.env)
```
VITE_API_URL=http://localhost:3001/api  # APIサーバーのURL
```

### バックエンド (.env)
```
PORT=3001                               # サーバーポート
DATABASE_URL=postgresql://...           # 本番環境のDB接続文字列
```

## 📚 技術スタック

### フロントエンド
- **Framework**: Solid.js 1.9
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 7.0
- **UI Library**: Kobalte UI
- **Router**: @solidjs/router 0.16
- **Styling**: CSS (カスタムスタイル)

### バックエンド
- **Framework**: Express.js 4.21
- **Language**: TypeScript 5.7
- **Database**: SQLite (開発) / PostgreSQL (本番)
- **ORM**: なし（生SQLクエリ使用）
- **Validation**: 組み込み

## 🤝 貢献方法

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 👥 開発者

- The You Creators Team
- Co-authored by Claude AI

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/the-you-creators/netflix-clone/issues)でお知らせください。