"use client";
import { useState } from "react";
import Image from "next/image";

type Step = "landing" | "upload" | "preferences" | "recommendations" | "result";

interface Hairstyle {
  id: number;
  name: string;
  description: string;
  reason: string;
  image: string;
  color: string;
}

const mockHairstyles: Hairstyle[] = [
  {
    id: 1,
    name: "法式波浪卷",
    description: "優雅的法式波浪髮型，適合圓臉及鵝蛋臉",
    reason: "可修飾臉部線條，增加柔和感",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop",
    color: "#8B4513",
  },
  {
    id: 2,
    name: "韓系短髮",
    description: "利落的韓系短髮，適合方臉及菱形臉",
    reason: "突出五官立體感，展現時尚氣質",
    image: "https://images.unsplash.com/photo-1595624794900-abd1d09c7083?w=400&h=500&fit=crop",
    color: "#2C1810",
  },
  {
    id: 3,
    name: "空氣劉海長髮",
    description: "清新的空氣劉海搭配長髮，適合任何臉型",
    reason: "減齡神器，突顯青春活力",
    image: "https://images.unsplash.com/photo-1522139137660-38fb1c5a3d3a?w=400&h=500&fit=crop",
    color: "#1a1a1a",
  },
  {
    id: 4,
    name: "丸子頭",
    description: "俏皮丸子頭，適合圓臉及長臉",
    reason: "拉長臉部比例，可愛又清爽",
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=500&fit=crop",
    color: "#4A3728",
  },
  {
    id: 5,
    name: "自然中分",
    description: "自然中分長髮，展現成熟魅力",
    reason: "適合職場女性，氣質典雅",
    image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=500&fit=crop",
    color: "#3D2314",
  },
  {
    id: 6,
    name: "時尚挑染",
    description: "大膽的時尚挑染，適合追求個性的用戶",
    reason: "走在潮流尖端，彰顯獨特風格",
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=500&fit=crop",
    color: "#C41E3A",
  },
];

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [preferences, setPreferences] = useState({
    gender: "",
    style: "",
    occasion: "",
    color: "",
    length: "",
  });
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setStep("preferences");
    }
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleGetRecommendations = () => {
    setStep("recommendations");
  };

  const handleSelectHairstyle = (hairstyle: Hairstyle) => {
    setSelectedHairstyle(hairstyle);
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setStep("result");
    }, 2000);
  };

  const handleRestart = () => {
    setStep("landing");
    setUploadedImage(null);
    setSelectedHairstyle(null);
    setPreferences({ gender: "", style: "", occasion: "", color: "", length: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
            94Style AI
          </h1>
          <p className="text-sm text-gray-500">看見改變後的自己</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Landing Step */}
        {step === "landing" && (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-6xl">💇‍♀️</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                AI 智慧造型模擬
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                上傳照片，讓 AI 為您推薦最適合的髮型
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg w-64">
                <div className="text-3xl mb-2">📸</div>
                <h3 className="font-semibold text-gray-800">上傳照片</h3>
                <p className="text-sm text-gray-500">支援手機相機拍攝</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg w-64">
                <div className="text-3xl mb-2">✨</div>
                <h3 className="font-semibold text-gray-800">AI 推薦</h3>
                <p className="text-sm text-gray-500">根據臉型個人化建議</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg w-64">
                <div className="text-3xl mb-2">🎨</div>
                <h3 className="font-semibold text-gray-800">虛擬試戴</h3>
                <p className="text-sm text-gray-500">看見改變後的自己</p>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-4 rounded-full text-lg font-semibold cursor-pointer hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              <span>開始體驗</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <input type="file" accept="image/*" capture="environment" onChange={handleUpload} className="hidden" />
            </label>
            
            <p className="mt-4 text-sm text-gray-400">完全免費 · 無需登入 · 隱私保障</p>
          </div>
        )}

        {/* Upload Step */}
        {step === "upload" && (
          <div className="max-w-xl mx-auto py-12">
            <h2 className="text-2xl font-bold text-center mb-8">上傳您的照片</h2>
            <div className="border-2 border-dashed border-rose-300 rounded-2xl p-12 text-center bg-white/50">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-600 mb-4">點擊或拖曳上傳照片</p>
              <p className="text-sm text-gray-400 mb-6">支援 JPG、PNG、HEIC 格式</p>
              <label className="inline-block bg-rose-500 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-rose-600 transition">
                選擇照片
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
            <button onClick={() => setStep("landing")} className="mt-4 text-gray-500 hover:text-gray-700">
              ← 返回
            </button>
          </div>
        )}

        {/* Preferences Step */}
        {step === "preferences" && (
          <div className="max-w-2xl mx-auto py-8">
            <h2 className="text-2xl font-bold text-center mb-8">設定您的偏好</h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              {/* Gender */}
              <div>
                <label className="block font-medium text-gray-700 mb-3">性別</label>
                <div className="flex gap-3">
                  {["女性", "男性", "不限"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePreferenceChange("gender", opt)}
                      className={`flex-1 py-3 rounded-xl border-2 transition ${
                        preferences.gender === opt
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-gray-200 hover:border-rose-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block font-medium text-gray-700 mb-3">風格</label>
                <div className="grid grid-cols-2 gap-3">
                  {["自然日常", "時尚前衛", "商務正式", "個性街頭"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePreferenceChange("style", opt)}
                      className={`py-3 rounded-xl border-2 transition ${
                        preferences.style === opt
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-gray-200 hover:border-rose-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label className="block font-medium text-gray-700 mb-3">場合</label>
                <div className="grid grid-cols-2 gap-3">
                  {["日常通勤", "婚慶正式", "職場面試", "約會休閒"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePreferenceChange("occasion", opt)}
                      className={`py-3 rounded-xl border-2 transition ${
                        preferences.occasion === opt
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-gray-200 hover:border-rose-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block font-medium text-gray-700 mb-3">髮色</label>
                <div className="flex gap-3">
                  {["保持原色", "黑色", "棕色", "金色", "彩色"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePreferenceChange("color", opt)}
                      className={`flex-1 py-3 rounded-xl border-2 transition ${
                        preferences.color === opt
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-gray-200 hover:border-rose-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div>
                <label className="block font-medium text-gray-700 mb-3">長度</label>
                <div className="flex gap-3">
                  {["短髮", "中長髮", "長髮", "不限"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handlePreferenceChange("length", opt)}
                      className={`flex-1 py-3 rounded-xl border-2 transition ${
                        preferences.length === opt
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-gray-200 hover:border-rose-300"
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
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-rose-600 hover:to-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取得 AI 推薦 →
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Step */}
        {step === "recommendations" && (
          <div className="py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm mb-4">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                AI 分析中...
              </div>
              <h2 className="text-2xl font-bold">為您推薦 6 款髮型</h2>
              <p className="text-gray-500">根據您的臉型與偏好個人化推薦</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockHairstyles.map((hairstyle) => (
                <div
                  key={hairstyle.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer group"
                  onClick={() => handleSelectHairstyle(hairstyle)}
                >
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={hairstyle.image}
                      alt={hairstyle.name}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                      適合您
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2">{hairstyle.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{hairstyle.description}</p>
                    <div className="bg-rose-50 rounded-lg p-3">
                      <p className="text-xs text-rose-700">
                        <span className="font-medium">💡 推薦原因：</span>
                        {hairstyle.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => setStep("preferences")}
                className="text-gray-500 hover:text-gray-700"
              >
                ← 重新設定偏好
              </button>
            </div>
          </div>
        )}

        {/* Result Step */}
        {step === "result" && selectedHairstyle && (
          <div className="max-w-4xl mx-auto py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm mb-4">
                <span>✅</span> 生成完成！
              </div>
              <h2 className="text-2xl font-bold">{selectedHairstyle.name}</h2>
            </div>

            {/* Before/After Comparison */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="grid grid-cols-2">
                {/* Before */}
                <div className="relative">
                  <div className="aspect-square bg-gray-100">
                    {uploadedImage && (
                      <Image src={uploadedImage} alt="Before" fill className="object-cover" />
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    改造前
                  </div>
                </div>
                {/* After */}
                <div className="relative">
                  <div className="aspect-square bg-gray-100">
                    <Image
                      src={selectedHairstyle.image}
                      alt="After"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm">
                    改造後
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下載圖片
              </button>
              <button className="flex items-center justify-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-xl hover:bg-rose-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                分享到社群
              </button>
              <button
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition"
              >
                重新體驗
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
              <p className="text-lg font-medium">AI 生成中...</p>
              <p className="text-sm text-gray-500">預估剩餘 2 秒</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>94Style AI © 2026 · 隱私保護，照片 24 小時自動刪除</p>
      </footer>
    </div>
  );
}
