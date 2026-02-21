"""
94StyleAI Backend - FastAPI
"""
import os
import json
import httpx
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, AliasChoices
from typing import Optional, List, Dict, Any
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
import google.generativeai as genai
import uuid
import datetime

app = FastAPI(title="94StyleAI API")

# 簡易任務儲存（單機記憶體）
TASK_RESULTS: Dict[str, Dict[str, Any]] = {}

# CORS
cors_origins_raw = os.getenv("CORS_ORIGINS", "*")
cors_origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()] or ["*"]
allow_credentials = cors_origins != ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase 初始化
try:
    cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT"))
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    # 初始化 Storage
    bucket_name = os.getenv("FIREBASE_STORAGE_BUCKET", "style-94.firebasestorage.app")
    storage_bucket = firebase_admin.storage.bucket(bucket_name)
except Exception as e:
    print(f"Firebase init warning: {e}")
    storage_bucket = None

# Gemini 初始化
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# MiniMax 初始化
MINIMAX_API_KEY = os.getenv("MINIMAX_API_KEY")
MINIMAX_GROUP_ID = os.getenv("MINIMAX_GROUP_ID", "")

# ==================== Helper Functions ====================

async def call_minimax_text(prompt: str) -> str:
    """呼叫 MiniMax M2.5 文字生成"""
    if not MINIMAX_API_KEY:
        return None
    
    url = "https://api.minimax.chat/v1/text/chatcompletion_v2"
    headers = {
        "Authorization": f"Bearer {MINIMAX_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "MiniMax-M2.5",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=payload, timeout=30.0)
            response.raise_for_status()
            result = response.json()
            return result.get("choices", [{}])[0].get("message", {}).get("content", "")
        except Exception as e:
            print(f"MiniMax text error: {e}")
            return None

async def call_minimax_image(prompt: str, reference_image_url: str = None) -> list:
    """呼叫 MiniMax image-01 圖片生成"""
    if not MINIMAX_API_KEY:
        return []
    
    url = "https://api.minimax.io/v1/image_generation"
    headers = {
        "Authorization": f"Bearer {MINIMAX_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "image-01",
        "prompt": prompt,
        "aspect_ratio": "3:4",
        "n": 1
    }
    
    # 加入參考圖片（用於人物特徵參考）
    if reference_image_url:
        payload["subject_reference"] = [
            {
                "type": "character",
                "image_file": reference_image_url
            }
        ]
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=payload, timeout=60.0)
            response.raise_for_status()
            result = response.json()
            
            images = []
            if "data" in result:
                for item in result["data"]:
                    if "url" in item:
                        images.append(item["url"])
            return images
        except Exception as e:
            print(f"MiniMax image error: {e}")
            return []

# ==================== Models ====================

class Preferences(BaseModel):
    gender: str
    style: str
    occasion: str
    color: str
    length: str

class RecommendationRequest(BaseModel):
    image_url: str = Field(validation_alias=AliasChoices("image_url", "image", "imageUrl", "image_base64"))
    preferences: Preferences

class GenerationRequest(BaseModel):
    original_image_url: str = Field(validation_alias=AliasChoices("original_image_url", "faceImage"))
    hairstyle_id: str = Field(validation_alias=AliasChoices("hairstyle_id", "hairstyleId"))

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
    
    # 優先使用 MiniMax，其次 Gemini，最後 Mock
    ai_recommendation = None
    source = "Mock"
    
    # 嘗試 MiniMax
    if MINIMAX_API_KEY:
        try:
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
            ai_recommendation = await call_minimax_text(prompt)
            if ai_recommendation:
                source = "MiniMax M2.5"
        except Exception as e:
            print(f"MiniMax recommendation error: {e}")
    
    # 備用 Gemini
    if not ai_recommendation and GEMINI_API_KEY:
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
            ai_recommendation = response.text
            if ai_recommendation:
                source = "Gemini"
        except Exception as e:
            print(f"Gemini error: {e}")
    
    # 回傳結果
    return {
        "recommendations": MOCK_HAIRSTYLES,
        "ai_analysis": ai_recommendation,
        "message": f"AI 推薦完成（{source}）"
    }

@app.post("/api/generate")
async def generate_image(request: GenerationRequest):
    """生成換髮型圖片（使用 MiniMax image-01）"""
    
    # 取得髮型名稱
    hairstyle_name = "時尚髮型"
    for style in MOCK_HAIRSTYLES:
        if style["id"] == request.hairstyle_id:
            hairstyle_name = style["name"]
            break
    
    # 使用 MiniMax image-01 生成圖片
    if MINIMAX_API_KEY:
        try:
            prompt = f"人物肖像，{hairstyle_name}髮型，精致五官，自然光線，專業攝影"
            images = await call_minimax_image(prompt, request.original_image_url)
            
            if images:
                task_id = f"mmx-{uuid.uuid4().hex[:10]}"
                TASK_RESULTS[task_id] = {
                    "task_id": task_id,
                    "status": "completed",
                    "progress": 100,
                    "result_image_url": images[0],
                }
                return {
                    "task_id": task_id,
                    "status": "completed",
                    "result_image_url": images[0],
                    "message": "圖片生成完成（MiniMax image-01）"
                }
        except Exception as e:
            print(f"MiniMax image generation error: {e}")
    
    # 回傳 Mock 結果
    task_id = f"mock-{uuid.uuid4().hex[:10]}"
    TASK_RESULTS[task_id] = {
        "task_id": task_id,
        "status": "completed",
        "progress": 100,
        "result_image_url": request.original_image_url,
    }

    return {
        "task_id": task_id,
        "status": "completed",
        "result_image_url": request.original_image_url,
        "message": "Mock 結果（請設定 MINIMAX_API_KEY）"
    }

@app.get("/api/tasks/{task_id}")
async def get_task_status(task_id: str):
    """查詢任務狀態"""
    task = TASK_RESULTS.get(task_id)
    if task:
        return task

    return {
        "task_id": task_id,
        "status": "not_found",
        "progress": 0,
        "message": "任務不存在"
    }

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """上傳圖片到 Firebase Storage"""
    if not storage_bucket:
        # 如果沒有 Firebase，回傳 Mock
        return {
            "url": f"https://storage.googleapis.com/mock-bucket/uploads/{file.filename}",
            "message": "Mock 上傳（請設定 FIREBASE_SERVICE_ACCOUNT）"
        }
    
    try:
        # 產生唯一檔名
        file_ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}.{file_ext}"
        blob_path = f"uploads/{unique_filename}"
        
        # 讀取檔案內容
        content = await file.read()
        
        # 上传到 Firebase Storage
        blob = storage_bucket.blob(blob_path)
        blob.upload_from_string(content, content_type=file.content_type)
        
        # 設為公開
        blob.make_public()
        
        return {
            "url": blob.public_url,
            "message": "上傳成功"
        }
    except Exception as e:
        print(f"Upload error: {e}")
        return {
            "url": f"https://storage.googleapis.com/mock-bucket/uploads/{file.filename}",
            "message": f"上傳失敗，使用 Mock: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8080"))
    uvicorn.run(app, host="0.0.0.0", port=port)
