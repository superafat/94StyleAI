"""
94StyleAI Backend - FastAPI
"""
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import firebase_admin
from firebase_admin import credentials, auth, firestore
import google.generativeai as genai

app = FastAPI(title="94StyleAI API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase 初始化
try:
    cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT"))
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Firebase init warning: {e}")

# Gemini 初始化
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# ==================== Models ====================

class Preferences(BaseModel):
    gender: str
    style: str
    occasion: str
    color: str
    length: str

class RecommendationRequest(BaseModel):
    image_url: str
    preferences: Preferences

class GenerationRequest(BaseModel):
    original_image_url: str
    hairstyle_id: str

# ==================== Mock Data ====================

MOCK_HAIRSTYLES = [
    {
        "id": "1",
        "name": "法式波浪卷",
        "description": "優雅的法式波浪髮型，適合圓臉及鵝蛋臉",
        "reason": "可修飾臉部線條，增加柔和感",
        "image": "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop",
    },
    {
        "id": "2",
        "name": "韓系短髮",
        "description": "利落的韓系短髮，適合方臉及菱形臉",
        "reason": "突出五官立體感，展現時尚氣質",
        "image": "https://images.unsplash.com/photo-1595624794900-abd1d09c7083?w=400&h=500&fit=crop",
    },
    {
        "id": "3",
        "name": "空氣劉海長髮",
        "description": "清新的空氣劉海搭配長髮，適合任何臉型",
        "reason": "減齡神器，突顯青春活力",
        "image": "https://images.unsplash.com/photo-1522139137660-38fb1c5a3d3a?w=400&h=500&fit=crop",
    },
    {
        "id": "4",
        "name": "丸子頭",
        "description": "俏皮丸子頭，適合圓臉及長臉",
        "reason": "拉長臉部比例，可愛又清爽",
        "image": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=500&fit=crop",
    },
    {
        "id": "5",
        "name": "自然中分",
        "description": "自然中分長髮，展現成熟魅力",
        "reason": "適合職場女性，氣質典雅",
        "image": "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=500&fit=crop",
    },
    {
        "id": "6",
        "name": "時尚挑染",
        "description": "大膽的時尚挑染，適合追求個性的用戶",
        "reason": "走在潮流尖端，彰顯獨特風格",
        "image": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=500&fit=crop",
    },
]

# ==================== Routes ====================

@app.get("/")
async def root():
    return {"message": "94StyleAI API v1.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """取得 AI 髮型推薦"""
    
    if GEMINI_API_KEY:
        # 使用 Gemini API
        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            prompt = f"""
根據用戶的偏好，推薦適合的髮型。
偏好：
- 性別: {request.preferences.gender}
- 風格: {request.preferences.style}
- 場合: {request.preferences.occasion}
- 髮色: {request.preferences.color}
- 長度: {request.preferences.length}

請推薦 6 款髮型，格式如下：
1. [髮型名稱]: [適合臉型] - [推薦原因]
"""
            response = model.generate_content(prompt)
            # TODO: 解析 response 並回傳
        except Exception as e:
            print(f"Gemini error: {e}")
    
    # 回傳 Mock 資料
    return {
        "recommendations": MOCK_HAIRSTYLES,
        "message": "AI 推薦完成" if GEMINI_API_KEY else "Mock 推薦（請設定 GEMINI_API_KEY）"
    }

@app.post("/api/generate")
async def generate_image(request: GenerationRequest):
    """生成換髮型圖片"""
    
    # TODO: 串接 Replicate InstantID
    # 目前回傳 Mock 結果
    
    return {
        "task_id": "mock-task-123",
        "status": "completed",
        "result_image_url": request.original_image_url,  # TODO: 替换为真实生成圖片
        "message": "Mock 結果（請設定 REPLICATE_API_KEY）"
    }

@app.get("/api/tasks/{task_id}")
async def get_task_status(task_id: str):
    """查詢任務狀態"""
    return {
        "task_id": task_id,
        "status": "completed",
        "progress": 100
    }

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """上傳圖片到 Firebase Storage"""
    # TODO: 實現 Firebase Storage 上傳
    return {
        "url": f"https://storage.googleapis.com/94style-ai.appspot.com/uploads/{file.filename}",
        "message": "Mock 上傳（請設定 Firebase）"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8080"))
    uvicorn.run(app, host="0.0.0.0", port=port)
