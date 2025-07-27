# Implementation Plan - TDD方式（Red-Green-Refactor）

## Phase 1: プロジェクトセットアップ

- [ ] 1. プロジェクト初期化とテスト環境構築
  - Solid.jsプロジェクトの初期化とVite設定
  - Vitest、@solidjs/testing-library、MSWの導入
  - TypeScript設定とディレクトリ構造の作成
  - 基本的なルーティング設定（@solidjs/router）
  - _Requirements: 6.1, 6.3_

## Phase 2: データモデルとユーティリティ関数（TDD）

- [ ] 2.1 Video型定義のテスト駆動実装
  - **RED**: Video型のバリデーション関数のテストを作成（失敗するテスト）
  - **GREEN**: Video型定義とvalidateVideo関数を実装してテストを通す
  - **REFACTOR**: 型定義とバリデーション関数のリファクタリング
  - _Requirements: 1.2, 4.1_

- [ ] 2.2 日付フォーマット関数のTDD実装
  - **RED**: formatDate関数のテストを作成（アップロード日表示用）
  - **GREEN**: formatDate関数を実装してテストを通す
  - **REFACTOR**: 日付処理の最適化とエッジケース対応
  - _Requirements: 4.1_

- [ ] 2.3 動画ソート関数のTDD実装
  - **RED**: sortVideosByDate関数のテストを作成（最新順ソート）
  - **GREEN**: sortVideosByDate関数を実装してテストを通す
  - **REFACTOR**: ソート処理の最適化
  - _Requirements: 1.3_

## Phase 3: データベース層（TDD）

- [ ] 3.1 SQLite初期化関数のTDD実装
  - **RED**: initializeSQLiteDatabase関数のテストを作成
  - **GREEN**: SQLite初期化とスキーマ作成を実装
  - **REFACTOR**: エラーハンドリングとリソース管理の改善
  - _Requirements: 6.1_

- [ ] 3.2 Supabaseクライアント初期化のTDD実装
  - **RED**: initializeSupabaseClient関数のテストを作成
  - **GREEN**: Supabaseクライアント設定を実装
  - **REFACTOR**: 接続エラーハンドリングの改善
  - _Requirements: 6.2_

- [ ] 3.3 動画取得関数のTDD実装
  - **RED**: getVideos関数のテストを作成（SQLite版）
  - **GREEN**: SQLite用getVideos関数を実装
  - **REFACTOR**: クエリ最適化とエラーハンドリング
  - _Requirements: 1.1_

- [ ] 3.4 動画検索関数のTDD実装
  - **RED**: searchVideos関数のテストを作成
  - **GREEN**: タイトル検索機能を実装
  - **REFACTOR**: 検索アルゴリズムの最適化
  - _Requirements: 2.1, 2.2_

- [ ] 3.5 動画CRUD関数のTDD実装
  - **RED**: addVideo, updateVideo, deleteVideo関数のテストを作成
  - **GREEN**: 各CRUD操作を実装
  - **REFACTOR**: トランザクション処理とエラーハンドリング
  - _Requirements: 5.2, 5.3, 5.4_

## Phase 4: UIコンポーネント（TDD）

- [ ] 4.1 UIライブラリセットアップ
  - Solid UIまたはKobalteライブラリの導入
  - 基本的なテーマとスタイリングシステムの設定
  - _Requirements: 7.1, 7.2_

- [ ] 4.2 VideoCard コンポーネントのTDD実装
  - **RED**: VideoCardコンポーネントのレンダリングテストを作成
  - **GREEN**: VideoCardコンポーネントを実装（タイトル、サムネイル、説明表示）
  - **REFACTOR**: プロップスの型安全性とスタイリングの改善
  - _Requirements: 1.2_

- [ ] 4.3 VideoList コンポーネントのTDD実装
  - **RED**: VideoListコンポーネントのテストを作成（空配列、複数動画）
  - **GREEN**: VideoListコンポーネントを実装
  - **REFACTOR**: パフォーマンス最適化（仮想化検討）
  - _Requirements: 1.1, 1.3_

- [ ] 4.4 SearchBar コンポーネントのTDD実装
  - **RED**: SearchBarコンポーネントの入力・検索テストを作成
  - **GREEN**: SearchBarコンポーネントとデバウンス機能を実装
  - **REFACTOR**: 検索UXの改善とアクセシビリティ対応
  - _Requirements: 2.1_

- [ ] 4.5 検索結果表示のTDD実装
  - **RED**: 検索結果0件時のメッセージ表示テストを作成
  - **GREEN**: NoResultsMessageコンポーネントを実装
  - **REFACTOR**: メッセージの多言語対応準備
  - _Requirements: 2.3_

## Phase 5: 動画プレイヤー（TDD）

- [ ] 5.1 VideoPlayer基本機能のTDD実装
  - **RED**: VideoPlayerコンポーネントの基本テストを作成
  - **GREEN**: HTML5 videoタグベースのプレイヤーを実装
  - **REFACTOR**: プレイヤーの状態管理改善
  - _Requirements: 3.1_

- [ ] 5.2 プレイヤーコントロールのTDD実装
  - **RED**: 再生・一時停止・音量調整のテストを作成
  - **GREEN**: プレイヤーコントロール機能を実装
  - **REFACTOR**: コントロールUIの改善とキーボード対応
  - _Requirements: 3.2_

- [ ] 5.3 進行状況表示のTDD実装
  - **RED**: 動画進行状況表示のテストを作成
  - **GREEN**: プログレスバーとタイムスタンプを実装
  - **REFACTOR**: シーク機能の追加とUX改善
  - _Requirements: 3.3_

## Phase 6: ページコンポーネント（TDD）

- [ ] 6.1 Home ページのTDD実装
  - **RED**: Homeページの統合テストを作成
  - **GREEN**: 動画一覧と検索機能を統合したHomeページを実装
  - **REFACTOR**: レイアウトとレスポンシブデザインの改善
  - _Requirements: 1.1, 2.1_

- [ ] 6.2 VideoDetail ページのTDD実装
  - **RED**: VideoDetailページのテストを作成
  - **GREEN**: 動画詳細情報表示とプレイヤー統合を実装
  - **REFACTOR**: ページ遷移とSEO対応の改善
  - _Requirements: 4.1, 4.2, 4.3_

## Phase 7: ファイルストレージ（TDD）

- [ ] 7.1 ローカルストレージ関数のTDD実装
  - **RED**: ローカルファイル操作のテストを作成
  - **GREEN**: ローカルファイルストレージ機能を実装
  - **REFACTOR**: ファイルパス管理とエラーハンドリング改善
  - _Requirements: 6.1_

- [ ] 7.2 Supabase Storage関数のTDD実装
  - **RED**: Supabaseストレージ操作のテストを作成
  - **GREEN**: Supabase Storage機能を実装
  - **REFACTOR**: アップロード進行状況とエラー処理改善
  - _Requirements: 6.2_

## Phase 8: 管理機能（TDD）

- [ ] 8.1 ファイルアップロード関数のTDD実装
  - **RED**: ファイルアップロード処理のテストを作成
  - **GREEN**: ファイルバリデーションとアップロード機能を実装
  - **REFACTOR**: プログレス表示とエラーハンドリング改善
  - _Requirements: 5.2_

- [ ] 8.2 AdminPanel コンポーネントのTDD実装
  - **RED**: AdminPanelコンポーネントのテストを作成
  - **GREEN**: 動画管理フォームを実装
  - **REFACTOR**: フォームバリデーションとUX改善
  - _Requirements: 5.1, 5.3, 5.4_

## Phase 9: エラーハンドリング（TDD）

- [ ] 9.1 エラーハンドラークラスのTDD実装
  - **RED**: ErrorHandlerクラスのテストを作成
  - **GREEN**: エラー分類と処理ロジックを実装
  - **REFACTOR**: エラーログとユーザー通知の改善
  - _Requirements: 2.3, 5.2_

- [ ] 9.2 ネットワークエラー処理のTDD実装
  - **RED**: ネットワークエラーハンドリングのテストを作成
  - **GREEN**: リトライ機能付きエラー処理を実装
  - **REFACTOR**: オフライン対応とユーザー体験改善
  - _Requirements: 6.2_

## Phase 10: 統合とデプロイ

- [ ] 10.1 環境設定管理のTDD実装
  - **RED**: 環境別設定切り替えのテストを作成
  - **GREEN**: 開発・本番環境の設定管理を実装
  - **REFACTOR**: 設定の型安全性と検証機能追加
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 10.2 E2Eテストの実装
  - Playwrightを使用したE2Eテストシナリオの作成
  - 主要ユーザーフローのテスト自動化
  - CI/CDパイプラインでのテスト実行設定
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [ ] 10.3 本番デプロイ準備
  - ビルド最適化とバンドルサイズ削減
  - Supabaseプロジェクト設定とデプロイ
  - パフォーマンス監視とエラートラッキング設定
  - _Requirements: 6.2_

## TDD実践ガイドライン

各タスクでは以下のサイクルを厳密に守る：

1. **RED**: 失敗するテストを最初に書く
   - 期待する動作を明確に定義
   - テストが失敗することを確認

2. **GREEN**: テストを通す最小限のコードを書く
   - 複雑な実装は避け、テストを通すことに集中
   - 重複や汚いコードでも一旦OK

3. **REFACTOR**: テストを通したままコードを改善
   - 重複の除去
   - 可読性の向上
   - パフォーマンスの最適化
   - テストが通り続けることを確認