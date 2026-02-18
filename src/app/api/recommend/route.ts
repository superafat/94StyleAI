import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, preferences } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are a professional hairstyle consultant. Analyze the user's face from the provided photo and recommend 6 suitable hairstyles.

User's preferences: ${preferences || "No specific preferences"}

Please provide your response in the following JSON format:
{
  "recommendations": [
    {
      "name": "Hairstyle name",
      "description": "Brief description of the hairstyle",
      "reason": "Why this hairstyle suits the user",
      "faceShapeMatch": "Which face shape it matches best"
    }
  ]
}

Analyze the photo and provide 6 personalized hairstyle recommendations.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: imageUrl } }
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const text = response.text ?? "";
    let recommendations;

    try {
      recommendations = JSON.parse(text);
    } catch {
      // If parsing fails, try to extract JSON from the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Gemini response");
      }
    }

    return NextResponse.json({ success: true, recommendations });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
