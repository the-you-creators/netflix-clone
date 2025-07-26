import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import { videosRouter } from './routes/videos';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// データベースの初期化
initDatabase();

// ミドルウェア
app.use(cors());
app.use(express.json());

// ルート
app.use('/api/videos', videosRouter);

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});