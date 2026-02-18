import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { faceImage, referenceHairstyle, hairstyleName } = await request.json();

    if (!faceImage || !referenceHairstyle) {
      return NextResponse.json(
        { error: "Face image and reference hairstyle are required" },
        { status: 400 }
      );
    }

    // 使用 InstantID 模型进行换发型
    // 模型: https://replicate.com/zsxkib/instant-id
    const prediction = await replicate.predictions.create({
      version: "c98b2e7a196828d00955767813b81fc05c5c9b294c670c6d147d545fed4ceecf",
      input: {
        image: faceImage,
        reference_images: [referenceHairstyle],
        prompt: `A person with ${hairstyleName} hairstyle, high quality, professional photography, realistic`,
        negative_prompt: "blurry, low quality, distorted, deformed, bad anatomy, extra limbs",
        width: 1024,
        height: 1024,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        prompt_strength: 0.8,
        num_samples: 1,
      },
    });

    // 等待预测完成 - 使用 wait 方法
    let result = prediction;
    if (prediction.status === "starting" || prediction.status === "processing") {
      result = await replicate.wait(prediction) as typeof prediction;
    }

    if (result.status === "succeeded") {
      const outputUrl = result.output;
      return NextResponse.json({
        success: true,
        imageUrl: Array.isArray(outputUrl) ? outputUrl[0] : outputUrl,
        predictionId: prediction.id,
      });
    } else if (result.status === "failed") {
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 500 }
      );
    } else {
      // 返回进行中状态
      return NextResponse.json({
        success: true,
        status: result.status,
        predictionId: prediction.id,
      });
    }
  } catch (error) {
    console.error("Replicate API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 }
    );
  }
}

// GET 方法用于检查预测状态
export async function GET(request: NextRequest) {
  const predictionId = request.nextUrl.searchParams.get("predictionId");

  if (!predictionId) {
    return NextResponse.json(
      { error: "Prediction ID is required" },
      { status: 400 }
    );
  }

  try {
    const prediction = await replicate.predictions.get(predictionId);

    if (prediction.status === "succeeded") {
      const outputUrl = prediction.output;
      return NextResponse.json({
        success: true,
        status: "succeeded",
        imageUrl: Array.isArray(outputUrl) ? outputUrl[0] : outputUrl,
      });
    } else if (prediction.status === "failed") {
      return NextResponse.json(
        { success: false, status: "failed", error: "Image generation failed" },
        { status: 500 }
      );
    } else {
      return NextResponse.json({
        success: true,
        status: prediction.status,
      });
    }
  } catch (error) {
    console.error("Replicate API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to check status" },
      { status: 500 }
    );
  }
}
