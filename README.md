# 94StyleAI - AI 換髮型模擬平台

<p align="center">
  <img src="https://img.shields.io/badge/Version-0.1.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/Next.js-15-green" alt="Next.js">
  <img src="https://img.shields.io/badge/FastAPI-Python-purple" alt="FastAPI">
</p>

## 專案目標

建立 AI 換髮型模擬平台的核心 MVP，讓用戶上傳照片後，AI 推薦最適合的髮型，並生成 Before/After 對比圖。

## 技術架構

### 前端
- **Framework**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Deployment**: Vercel / Google Cloud Run

### 後端
- **Framework**: FastAPI (Python)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI Services**:
  - Google Cloud Vision API (臉部偵測)
  - MediaPipe FaceMesh (臉型分類)
  - **Google Gemini API** (髮型推薦)
  - Replicate (InstantID + SDXL 圖片生成)
- **Queue**: Google Cloud Tasks
- **Deployment**: Google Cloud Run

## 目錄結構

```
94StyleAI/
├── frontend/           # Next.js 前端
│   ├── src/
│   │   ├── app/       # App Router 頁面
│   │   │   ├── page.tsx           # 首頁
│   │   │   ├── upload/            # 照片上傳
│   │   │   ├── preferences/       # 偏好設定
│   │   │   ├── recommendations/  # AI 推薦
│   │   │   └── results/           # 生成結果
│   │   ├── components/   # React 元件
│   │   ├── lib/         # 工具函式
│   │   └── store/       # Zustand 狀態
│   └── package.json
│
├── backend/           # FastAPI 後端
│   ├── main.py        # API 主程式
│   ├── requirements.txt
│   └── ...
│
└── README.md
```

## 功能清單

### Phase 1 (Week 1-2)
- [x] 專案初始化
- [x] Landing Page
- [x] 照片上傳頁（拖曳 + 相機）
- [x] 偏好設定頁
- [x] AI 推薦結果頁
- [x] 生成結果頁（Before/After）
- [ ] Firebase Auth 整合
- [ ] Firestore 資料結構

### Phase 2 (Week 3-4)
- [ ] Google Cloud Vision API 臉部偵測
- [ ] MediaPipe 臉型分類
- [ ] Claude API 髮型推薦
- [ ] Replicate/Fal.ai 圖片生成
- [ ] 非同步任務處理
- [ ] 24hr 自動刪除

## 開發指南

### 前端開發
```bash
cd frontend
npm install
npm run dev
```

### 後端開發
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## API 端點

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload | 上傳照片 |
| POST | /api/recommend | 取得 AI 推薦 |
| POST | /api/generate | 開始生成 |
| GET | /api/generate/{task_id} | 查詢生成狀態 |
| DELETE | /api/cleanup | 清理舊照片 |

## 參考資源

- [InstantID](https://github.com/cubiq/ComfyUI_InstantID)
- [CatVTON](https://github.com/Zheng-Chong/CatVTON)
- [Replicate API](https://replicate.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

## License

MIT License
