# 94StyleAI Backend API

## 環境變數
```
# Firebase
FIREBASE_PROJECT_ID=94style-ai
FIREBASE_SERVICE_ACCOUNT=path-to-service-account.json

# AI API（優先順序：MiniMax > Gemini）
MINIMAX_API_KEY=your-minimax-api-key   # 文字推薦 + 圖片生成
GEMINI_API_KEY=your-gemini-api-key     # 備用文字推薦

# Port
PORT=8080
```

## AI 模型對照
| 功能 | 主要方案 | 備用方案 | 價格 |
|------|---------|---------|------|
| 髮型推薦 | MiniMax M2.5 | Gemini | ~$0.3/1M tokens |
| 圖片生成 | MiniMax image-01 | - | 0.025 元/張 |

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
