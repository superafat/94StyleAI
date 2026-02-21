/**
 * 94StyleAI API 客户端
 * 用于前端调用后端 API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Preferences {
  gender: string;
  style: string;
  occasion: string;
  color: string;
  length: string;
}

const isRemoteUrl = (value: string) => /^https?:\/\//i.test(value);
const toImagePayload = (value: string) => {
  if (value.startsWith("data:")) return value;
  if (isRemoteUrl(value)) return value;
  return `data:image/jpeg;base64,${value}`;
};

/**
 * 获取发型推荐
 * @param imageUrl - 用户照片的 URL
 * @param preferences - 用户偏好设置
 */
export async function getHairstyleRecommendations(
  imageUrl: string,
  preferences?: Preferences
) {
  const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: toImagePayload(imageUrl),
      preferences,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get recommendations");
  }

  return response.json();
}

/**
 * 生成换发型图片
 * @param faceImage - 用户照片 URL
 * @param referenceHairstyle - 参考发型图片 URL
 * @param hairstyleName - 发型名称
 */
export async function generateHairstyleImage(
  faceImage: string,
  hairstyleId: string
) {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      original_image_url: toImagePayload(faceImage),
      hairstyle_id: hairstyleId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate image");
  }

  return response.json();
}

/**
 * 检查图片生成状态
 * @param predictionId - 预测 ID
 */
export async function checkGenerationStatus(predictionId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/tasks/${predictionId}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to check status");
  }

  return response.json();
}

/**
 * 上传图片到 Firebase Storage
 * @param file - 图片文件
 * @param path - 存储路径
 */
export async function uploadImage(file: File, path: string) {
  // 这个函数需要在客户端使用 Firebase SDK 调用
  // 这里只是占位，实际实现需要引入 firebase.ts 中的 storage
  console.log("Upload to:", path);
  return { path };
}
