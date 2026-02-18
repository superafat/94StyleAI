"""
94StyleAI Backend - FastAPI Application
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uuid
import os
from datetime import datetime
from google import genai

app = FastAPI(title="94StyleAI API", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Models
class UserPreferences(BaseModel):
    gender: str
    style: List[str]
    occasion: str
    hair_color: str
    hair_length: str


class HairstyleRecommendation(BaseModel):
    id: int
    name: str
    description: str
    confidence: float


class GenerationRequest(BaseModel):
    user_id: str
    photo_url: str
    preferences: UserPreferences
    hairstyle_ids: List[int]


class GenerationStatus(BaseModel):
    task_id: str
    status: str  # pending, processing, completed, failed
    progress: int  # 0-100
    results: Optional[List[dict]] = None
    error: Optional[str] = None


# In-memory storage (will be replaced with Firestore)
tasks = {}


@app.get("/")
async def root():
    return {"message": "94StyleAI API", "version": "0.1.0"}


@app.post("/api/upload")
async def upload_photo(file: UploadFile = File(...)):
    """Upload user photo to Firebase Storage"""
    # TODO: Implement Firebase Storage upload
    file_id = str(uuid.uuid4())
    return {
        "file_id": file_id,
        "url": f"https://firebasestorage.example.com/{file_id}.jpg",
        "expires_at": datetime.now().isoformat()
    }


@app.post("/api/recommend")
async def get_recommendations(request: UserPreferences):
    """Get AI-powered hairstyle recommendations using Google Gemini API"""
    
    # Initialize Gemini client
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        # Fallback to mock data if no API key
        recommendations = [
            {"id": 1, "name": "微分碎髮", "description": "輕盈的層次感，適合日常上班和約會", "confidence": 0.95},
            {"id": 2, "name": "韓系長瀏海", "description": "修飾臉型，展現成熟氣質", "confidence": 0.88},
            {"id": 3, "name": "短髮精靈", "description": "活潑可愛，凸顯五官立體感", "confidence": 0.82},
            {"id": 4, "name": "波浪捲髮", "description": "浪漫優雅，適合重要場合", "confidence": 0.78},
            {"id": 5, "name": "俐落油頭", "description": "帥氣有型，展現自信魅力", "confidence": 0.75},
            {"id": 6, "name": "空氣劉海", "description": "清新甜美，減齡神器", "confidence": 0.72},
        ]
        return {"recommendations": recommendations}
    
    client = genai.Client(api_key=gemini_api_key)
    
    # Build prompt for Gemini
    prompt = f"""Based on the following user preferences, recommend 6 suitable hairstyles in JSON format:

User Preferences:
- Gender: {request.gender}
- Style: {', '.join(request.style)}
- Occasion: {request.occasion}
- Hair Color: {request.hair_color}
- Hair Length: {request.hair_length}

Respond in JSON array format:
[{{"id": 1, "name": " hairstyle name", "description": "description", "confidence": 0.0-1.0}}]

Respond ONLY with valid JSON, no other text."""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        # Parse JSON response
        import json
        # Extract JSON from response
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        
        recommendations = json.loads(text)
        return {"recommendations": recommendations}
        
    except Exception as e:
        # Fallback on error
        recommendations = [
            {"id": 1, "name": "微分碎髮", "description": "輕盈的層次感，適合日常上班和約會", "confidence": 0.95},
            {"id": 2, "name": "韓系長瀏海", "description": "修飾臉型，展現成熟氣質", "confidence": 0.88},
            {"id": 3, "name": "短髮精靈", "description": "活潑可愛，凸顯五官立體感", "confidence": 0.82},
            {"id": 4, "name": "波浪捲髮", "description": "浪漫優雅，適合重要場合", "confidence": 0.78},
            {"id": 5, "name": "俐落油頭", "description": "帥氣有型，展現自信魅力", "confidence": 0.75},
            {"id": 6, "name": "空氣劉海", "description": "清新甜美，減齡神器", "confidence": 0.72},
        ]
        return {"recommendations": recommendations}


@app.post("/api/generate")
async def generate_hairstyles(request: GenerationRequest, background_tasks: BackgroundTasks):
    """Start hairstyle generation pipeline"""
    task_id = str(uuid.uuid4())
    
    # Initialize task
    tasks[task_id] = {
        "status": "pending",
        "progress": 0,
        "results": None,
        "error": None
    }
    
    # Start background processing
    background_tasks.add_task(process_generation, task_id, request)
    
    return {"task_id": task_id, "status": "pending"}


async def process_generation(task_id: str, request: GenerationRequest):
    """Background task for hairstyle generation pipeline"""
    try:
        tasks[task_id]["status"] = "processing"
        tasks[task_id]["progress"] = 10
        
        # Step 1: Face detection (Cloud Vision API)
        # TODO: Implement face detection
        
        tasks[task_id]["progress"] = 30
        
        # Step 2: Face mesh (MediaPipe)
        # TODO: Implement face mesh
        
        tasks[task_id]["progress"] = 50
        
        # Step 3: Generate images (Replicate/Fal.ai)
        # TODO: Implement image generation with InstantID + SDXL
        
        tasks[task_id]["progress"] = 80
        
        # Step 4: Face restoration (CodeFormer)
        # TODO: Implement face restoration
        
        # Mock results for now
        tasks[task_id]["results"] = [
            {"id": 1, "name": "微分碎髮", "url": "https://example.com/result1.jpg"},
            {"id": 2, "name": "韓系長瀏海", "url": "https://example.com/result2.jpg"},
        ]
        
        tasks[task_id]["status"] = "completed"
        tasks[task_id]["progress"] = 100
        
    except Exception as e:
        tasks[task_id]["status"] = "failed"
        tasks[task_id]["error"] = str(e)


@app.get("/api/generate/{task_id}")
async def get_generation_status(task_id: str) -> GenerationStatus:
    """Get generation task status"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks[task_id]
    return GenerationStatus(
        task_id=task_id,
        status=task["status"],
        progress=task["progress"],
        results=task.get("results"),
        error=task.get("error")
    )


@app.delete("/api/cleanup")
async def cleanup_old_photos():
    """Clean up photos older than 24 hours"""
    # TODO: Implement Firebase Storage cleanup
    return {"message": "Cleanup completed", "deleted_count": 0}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
