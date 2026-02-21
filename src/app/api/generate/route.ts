import { NextRequest, NextResponse } from "next/server";

// 使用後端 API
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://cch-beautifier-api-1047288460556.asia-east1.run.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const faceImage = body.faceImage || body.original_image_url;
    const hairstyleId = body.hairstyleId || body.hairstyle_id;

    if (!faceImage || !hairstyleId) {
      return NextResponse.json(
        { error: "Face image and hairstyle ID are required" },
        { status: 400 }
      );
    }

    // 調用後端 API
    const response = await fetch(`${BACKEND_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        original_image_url: faceImage,
        hairstyle_id: hairstyleId,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get("taskId") || request.nextUrl.searchParams.get("predictionId");

  if (!taskId) {
    return NextResponse.json(
      { error: "Task ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/tasks/${taskId}`);
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Check status error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to check status" },
      { status: 500 }
    );
  }
}
