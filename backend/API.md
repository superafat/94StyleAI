# 94StyleAI Backend API

## 環境變數
```
FIREBASE_PROJECT_ID=94style-ai
GEMINI_API_KEY=your-gemini-api-key
REPLICATE_API_KEY=your-replicate-api-key
```

## API Endpoints

### 1. 用戶認證
- `POST /api/auth/google` - Google 登入
- `GET /api/auth/me` - 取得當前用戶

### 2. 髮型推薦
- `POST /api/recommendations` - 取得 AI 髮型推薦
  - Input: { image_url, preferences }
  - Output: { recommendations: [{ id, name, description, reason, image_url }] }

### 3. 圖片生成
- `POST /api/generate` - 生成換髮型圖片
  - Input: { original_image_url, hairstyle_id }
  - Output: { result_image_url, status }

### 4. 任務狀態
- `GET /api/tasks/{task_id}` - 查詢生成狀態

## Webhook (非同步)
- `POST /api/webhooks/generation-complete` - 圖片生成完成回調

## Firestore Collections
- `users/{uid}` - 用戶資料
- `sessions/{sessionId}` - 對話session
- `generations/{genId}` - 生成記錄
- `hairstyles/{styleId}` - 髮型資料庫
