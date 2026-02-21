"use client";
import { useState } from "react";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const isRemoteUrl = (value: string) => /^https?:\/\//i.test(value);
const toImagePayload = (value: string) => {
  if (value.startsWith("data:")) return value;
  if (isRemoteUrl(value)) return value;
  return `data:image/jpeg;base64,${value}`;
};

type Step = "landing" | "upload" | "preferences" | "recommendations" | "result";

interface Hairstyle {
  id: string;
  name: string;
  description: string;
  reason: string;
  image: string;
  color?: string;
}

interface Preferences {
  gender: string;
  style: string;
  occasion: string;
  color: string;
  length: string;
}

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({
    gender: "",
    style: "",
    occasion: "",
    color: "",
    length: "",
  });
  const [recommendations, setRecommendations] = useState<Hairstyle[]>([]);
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStep("upload");
      
      try {
        // 上傳圖片到 Firebase Storage
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadRes = await fetch(`${API_BASE}/api/upload`, {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        
        if (uploadData.url) {
          setUploadedImage(uploadData.url);
        } else {
          // Fallback 到 base64
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            setUploadedImage(base64.split(',')[1]);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error("Upload failed, using base64:", error);
        // Fallback 到 base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setUploadedImage(base64.split(',')[1]);
        };
        reader.readAsDataURL(file);
      }
      setStep("preferences");
    }
  };

  const handlePreferenceChange = (key: keyof Preferences, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleGetRecommendations = async () => {
    if (!uploadedImage) return;

    setIsLoadingRecommendations(true);
    setStep("recommendations");

    try {
      const res = await fetch(`${API_BASE}/api/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: toImagePayload(uploadedImage),
          preferences: preferences,
        }),
      });

      if (!res.ok) {
        throw new Error(`Recommendation API failed: ${res.status}`);
      }

      const data = await res.json();
      const normalizedRecommendations = (data.recommendations || []).map((item: Hairstyle & { image_url?: string }) => ({
        ...item,
        image: item.image || item.image_url || "",
      }));
      setRecommendations(normalizedRecommendations);
    } catch (error) {
      console.error("API Error:", error);
      // Fallback to mock data
      setRecommendations([
        {
          id: "1",
          name: "法式波浪卷",
          description: "優雅的法式波浪髮型",
          reason: "修飾臉部線條",
          image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop",
        },
        {
          id: "2",
          name: "韓系短髮",
          description: "利落的韓系短髮",
          reason: "突出五官立體感",
          image: "https://images.unsplash.com/photo-1595624794900-abd1d09c7083?w=400&h=500&fit=crop",
        },
        {
          id: "3",
          name: "空氣劉海長髮",
          description: "清新空氣劉海",
          reason: "減齡神器",
          image: "https://images.unsplash.com/photo-1522139137660-38fb1c5a3d3a?w=400&h=500&fit=crop",
        },
        {
          id: "4",
          name: "丸子頭",
          description: "俏皮丸子頭",
          reason: "拉長臉部比例",
          image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=500&fit=crop",
        },
        {
          id: "5",
          name: "自然中分",
          description: "自然中分長髮",
          reason: "氣質典雅",
          image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=500&fit=crop",
        },
        {
          id: "6",
          name: "時尚挑染",
          description: "時尚挑染",
          reason: "彰顯獨特風格",
          image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=500&fit=crop",
        },
      ]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleSelectHairstyle = async (hairstyle: Hairstyle) => {
    if (!uploadedImage) return;

    setSelectedHairstyle(hairstyle);
    setIsGenerating(true);

    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_image_url: uploadedImage,
          hairstyle_id: hairstyle.id,
        }),
      });

      if (!res.ok) {
        throw new Error(`Generation API failed: ${res.status}`);
      }

      const data = await res.json();
      if (data.result_image_url) {
        setSelectedHairstyle(prev => prev ? { ...prev, image: data.result_image_url } : null);
      }
      
      // 等待生成完成
      if (data.task_id) {
        // Poll for status
        for (let i = 0; i < 30; i++) {
          await new Promise(r => setTimeout(r, 1000));
          const statusRes = await fetch(`${API_BASE}/api/tasks/${data.task_id}`);
          if (!statusRes.ok) {
            continue;
          }
          const status = await statusRes.json();
          if (status.status === "completed") {
            const resultImageUrl = status.result_image_url || data.result_image_url || hairstyle.image;
            setSelectedHairstyle(prev => prev ? { ...prev, image: resultImageUrl } : null);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Generation Error:", error);
    } finally {
      setIsGenerating(false);
      setStep("result");
    }
  };

  const handleRestart = () => {
    setStep("landing");
    setUploadedImage(null);
    setSelectedHairstyle(null);
    setRecommendations([]);
    setPreferences({ gender: "", style: "", occasion: "", color: "", length: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F2EB] via-[#E8E5DD] to-[#F5F2EB]">
      {/* Decorative clouds */}
      <div className="fixed top-10 left-10 opacity-20 animate-pulse">
        <span className="text-6xl">☁️</span>
      </div>
      <div className="fixed top-32 right-20 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>
        <span className="text-4xl">☁️</span>
      </div>
      
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b-2 border-[#B8C5D6]/20">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B8C5D6] to-[#A5B3C5] flex items-center justify-center shadow-lg">
              <span className="text-xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#B8C5D6] to-[#D4B483] bg-clip-text text-transparent">
              94Style AI
            </h1>
          </div>
          <p className="text-sm text-[#C9B8A8] font-medium">看見改變後的自己 ໒꒱</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Landing Step */}
        {step === "landing" && (
          <div className="text-center py-16 px-4">
            <div className="mb-12">
              <div className="w-36 h-36 mx-auto mb-6 bg-gradient-to-br from-[#E8B4B8] to-[#D4B483] rounded-full flex items-center justify-center shadow-xl relative">
                <span className="text-7xl animate-bounce">💇‍♀️</span>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#A8D5BA] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs">✨</span>
                </div>
              </div>
              <h2 className="text-5xl font-bold text-[#4A4A4A] mb-4 tracking-tight">
                AI 智慧造型模擬
              </h2>
              <p className="text-xl text-[#8A8A8A] max-w-2xl mx-auto leading-relaxed">
                上傳照片，讓 AI 為您推薦最適合的髮型 ໒꒱˖˚
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-14 max-w-4xl mx-auto">
              <div className="clay-card p-8 w-64 hover:scale-105 transition-transform">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#B8C5D6] to-[#A5B3C5] rounded-3xl flex items-center justify-center shadow-md">
                  <span className="text-3xl">📸</span>
                </div>
                <h3 className="font-bold text-[#4A4A4A] text-lg mb-2">上傳照片</h3>
                <p className="text-sm text-[#8A8A8A]">支援手機相機拍攝</p>
              </div>
              <div className="clay-card p-8 w-64 hover:scale-105 transition-transform">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#D4B483] to-[#C9B8A8] rounded-3xl flex items-center justify-center shadow-md">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="font-bold text-[#4A4A4A] text-lg mb-2">AI 推薦</h3>
                <p className="text-sm text-[#8A8A8A]">根據臉型個人化建議</p>
              </div>
              <div className="clay-card p-8 w-64 hover:scale-105 transition-transform">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#E8B4B8] to-[#D4B483] rounded-3xl flex items-center justify-center shadow-md">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="font-bold text-[#4A4A4A] text-lg mb-2">虛擬試戴</h3>
                <p className="text-sm text-[#8A8A8A]">看見改變後的自己</p>
              </div>
            </div>

            <label className="clay-button inline-flex items-center gap-3 text-white px-10 py-5 text-lg font-bold cursor-pointer shadow-lg">
              <span>開始體驗</span>
              <span className="text-2xl">→</span>
              <input type="file" accept="image/*" capture="environment" onChange={handleUpload} className="hidden" />
            </label>
            
            <p className="mt-6 text-sm text-[#C9B8A8] font-medium">完全免費 · 無需登入 · 隱私保障 ✧˖°</p>
          </div>
        )}

        {/* Preferences Step */}
        {step === "preferences" && (
          <div className="max-w-2xl mx-auto py-8 px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#4A4A4A]">設定您的偏好 ໒꒱</h2>
            
            <div className="clay-card p-8 space-y-6">
              {/* Gender */}
              <div>
                <label className="block font-bold text-[#4A4A4A] mb-4 text-lg">性別</label>
                <div className="flex gap-3">
                  {["女性", "男性", "不限"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePreferenceChange("gender", opt)}
                      className={`flex-1 py-3 rounded-2xl border-2 transition-all font-medium ${
                        preferences.gender === opt
                          ? "border-[#B8C5D6] bg-[#B8C5D6]/20 text-[#4A4A4A] shadow-md"
                          : "border-[#E0E0E0] hover:border-[#B8C5D6] bg-white/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block font-bold text-[#4A4A4A] mb-4 text-lg">風格</label>
                <div className="grid grid-cols-2 gap-3">
                  {["自然日常", "時尚前衛", "商務正式", "個性街頭"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePreferenceChange("style", opt)}
                      className={`py-3 rounded-2xl border-2 transition-all font-medium ${
                        preferences.style === opt
                          ? "border-[#D4B483] bg-[#D4B483]/20 text-[#4A4A4A] shadow-md"
                          : "border-[#E0E0E0] hover:border-[#D4B483] bg-white/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label className="block font-bold text-[#4A4A4A] mb-4 text-lg">場合</label>
                <div className="grid grid-cols-2 gap-3">
                  {["日常通勤", "婚慶正式", "職場面試", "約會休閒"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePreferenceChange("occasion", opt)}
                      className={`py-3 rounded-2xl border-2 transition-all font-medium ${
                        preferences.occasion === opt
                          ? "border-[#C9B8A8] bg-[#C9B8A8]/20 text-[#4A4A4A] shadow-md"
                          : "border-[#E0E0E0] hover:border-[#C9B8A8] bg-white/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block font-bold text-[#4A4A4A] mb-4 text-lg">髮色</label>
                <div className="grid grid-cols-3 gap-2">
                  {["保持原色", "黑色", "棕色", "金色", "彩色"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePreferenceChange("color", opt)}
                      className={`py-3 rounded-2xl border-2 transition-all font-medium text-sm ${
                        preferences.color === opt
                          ? "border-[#E8B4B8] bg-[#E8B4B8]/20 text-[#4A4A4A] shadow-md"
                          : "border-[#E0E0E0] hover:border-[#E8B4B8] bg-white/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div>
                <label className="block font-bold text-[#4A4A4A] mb-4 text-lg">長度</label>
                <div className="flex gap-3">
                  {["短髮", "中長髮", "長髮", "不限"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePreferenceChange("length", opt)}
                      className={`flex-1 py-3 rounded-2xl border-2 transition-all font-medium ${
                        preferences.length === opt
                          ? "border-[#A8D5BA] bg-[#A8D5BA]/20 text-[#4A4A4A] shadow-md"
                          : "border-[#E0E0E0] hover:border-[#A8D5BA] bg-white/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGetRecommendations}
                disabled={!preferences.gender || !preferences.style}
                className="clay-button w-full text-white py-4 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                取得 AI 推薦 ✧
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Step */}
        {step === "recommendations" && (
          <div className="py-8 px-4">
            <div className="text-center mb-10">
              {isLoadingRecommendations ? (
                <div className="inline-flex items-center gap-2 bg-[#B8C5D6]/20 text-[#4A4A4A] px-5 py-2 rounded-full text-sm mb-4 font-medium shadow-md">
                  <span className="w-2 h-2 bg-[#B8C5D6] rounded-full animate-pulse"></span>
                  AI 分析中...
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-[#A8D5BA]/20 text-[#4A4A4A] px-5 py-2 rounded-full text-sm mb-4 font-medium shadow-md">
                  <span>✅</span> 推薦完成
                </div>
              )}
              <h2 className="text-3xl font-bold text-[#4A4A4A] mb-2">為您推薦 {recommendations.length} 款髮型</h2>
              <p className="text-[#8A8A8A]">根據您的臉型與偏好個人化推薦 ໒꒱˖˚</p>
            </div>

            {isLoadingRecommendations ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto border-4 border-[#B8C5D6]/30 border-t-[#B8C5D6] rounded-full animate-spin mb-4"></div>
                <p className="text-[#8A8A8A]">AI 正在分析您的照片...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((hairstyle) => (
                  <div
                    key={hairstyle.id}
                    className="clay-card overflow-hidden cursor-pointer group"
                    onClick={() => handleSelectHairstyle(hairstyle)}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-[#E8E5DD] to-[#F5F2EB]">
                      <Image
                        src={hairstyle.image}
                        alt={hairstyle.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-[#A8D5BA]/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white shadow-md">
                        適合您 ✧
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-[#4A4A4A]">{hairstyle.name}</h3>
                      <p className="text-[#8A8A8A] text-sm mb-3">{hairstyle.description}</p>
                      <div className="bg-gradient-to-r from-[#E8B4B8]/20 to-[#D4B483]/20 rounded-2xl p-3 border border-[#E8B4B8]/30">
                        <p className="text-xs text-[#4A4A4A]">
                          <span className="font-bold">💡 推薦原因：</span>
                          {hairstyle.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <button
                onClick={() => setStep("preferences")}
                className="text-[#C9B8A8] hover:text-[#B8C5D6] font-medium transition-colors"
              >
                ← 重新設定偏好
              </button>
            </div>
          </div>
        )}

        {/* Result Step */}
        {step === "result" && selectedHairstyle && (
          <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#A8D5BA]/20 text-[#4A4A4A] px-5 py-2 rounded-full text-sm mb-4 font-medium shadow-md">
                <span>✅</span> 生成完成！
              </div>
              <h2 className="text-3xl font-bold text-[#4A4A4A]">{selectedHairstyle.name}</h2>
            </div>

            {/* Before/After Comparison */}
            <div className="clay-card overflow-hidden mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {/* Before */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-[#E8E5DD] to-[#F5F2EB]">
                    {uploadedImage && (
                      <Image src={toImagePayload(uploadedImage)} alt="Before" fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-[#4A4A4A]/70 backdrop-blur text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                    改造前
                  </div>
                </div>
                {/* After */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-[#E8E5DD] to-[#F5F2EB]">
                    <Image
                      src={selectedHairstyle.image}
                      alt="After"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#E8B4B8] to-[#D4B483] text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                    改造後 ✨
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="clay-button flex items-center justify-center gap-2 text-white px-8 py-4 font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下載圖片
              </button>
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#E8B4B8] to-[#D4B483] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                分享到社群
              </button>
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 border-2 border-[#C9B8A8] text-[#4A4A4A] px-8 py-4 rounded-2xl hover:bg-[#C9B8A8]/10 transition-all font-bold"
              >
                重新體驗
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-[#4A4A4A]/30 backdrop-blur-md flex items-center justify-center z-50">
            <div className="clay-card p-10 text-center max-w-sm mx-4">
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-[#B8C5D6]/30 border-t-[#B8C5D6] rounded-full animate-spin"></div>
              <p className="text-xl font-bold text-[#4A4A4A] mb-2">AI 生成中...</p>
              <p className="text-sm text-[#8A8A8A]">請稍候，正在為您生成新髮型 ✧˖°</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-10 text-[#C9B8A8] text-sm border-t border-[#B8C5D6]/20 mt-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">✨</span>
          <p className="font-medium">94Style AI © 2026</p>
          <span className="text-xl">✨</span>
        </div>
        <p className="text-xs">隱私保護，照片 24 小時自動刪除 ໒꒱˖˚</p>
      </footer>
    </div>
  );
}
