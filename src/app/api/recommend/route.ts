import { NextRequest, NextResponse } from "next/server";

// 使用後端 API
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://cch-beautifier-api-1047288460556.asia-east1.run.app";

export async function POST(request: NextRequest) {
  try {
    const { image_base64, imageUrl, image_url, preferences } = await request.json();

    // 支援 base64 或 URL（Firebase Storage URL）
    let imagePayload: string | null = null;
    if (image_base64) {
      imagePayload = `data:image/jpeg;base64,${image_base64}`;
    } else if (image_url) {
      imagePayload = image_url;
    } else if (imageUrl) {
      imagePayload = imageUrl; // Firebase Storage URL
    }

    if (!imagePayload) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // 調用後端 API
    const response = await fetch(`${BACKEND_URL}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imagePayload,
        preferences: preferences || {
          gender: "female",
          style: "casual",
          occasion: "daily",
          color: "black",
          length: "long",
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
