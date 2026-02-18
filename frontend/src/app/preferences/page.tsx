"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const genderOptions = ["男性", "女性", "中性"];
const styleOptions = [
  { id: "casual", name: "休閒", emoji: "🏖️" },
  { id: "formal", name: "正式", emoji: "👔" },
  { id: "trendy", name: "時尚", emoji: "🔥" },
  { id: "classic", name: "經典", emoji: "✨" },
  { id: "cute", name: "可愛", emoji: "🎀" },
  { id: "cool", name: "帥氣", emoji: "😎" },
];
const occasionOptions = [
  { id: "daily", name: "日常", emoji: "🏠" },
  { id: "work", name: "工作", emoji: "💼" },
  { id: "date", name: "約會", emoji: "💕" },
  { id: "party", name: "派對", emoji: "🎉" },
  { id: "wedding", name: "婚禮", emoji: "💒" },
];
const hairColorOptions = [
  { id: "natural", name: "自然色", colors: ["#1a1a1a", "#3d2314", "#8b4513"] },
  { id: "brown", name: "棕色系", colors: ["#654321", "#8B4513", "#A0522D"] },
  { id: "blonde", name: "金色系", colors: ["#FFD700", "#F4A460", "#FAF0E6"] },
  { id: "red", name: "紅色系", colors: ["#8B0000", "#DC143C", "#FF4500"] },
  { id: "colorful", name: "彩色系", colors: ["#FF69B4", "#00CED1", "#9370DB"] },
];
const hairLengthOptions = [
  { id: "short", name: "短髮", emoji: "💇", desc: "耳下至肩上" },
  { id: "medium", name: "中長髮", emoji: "💇‍♀️", desc: "肩上至胸前" },
  { id: "long", name: "長髮", emoji: "👸", desc: "胸前以下" },
];

export default function PreferencesPage() {
  const [gender, setGender] = useState("");
  const [style, setStyle] = useState<string[]>([]);
  const [occasion, setOccasion] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [hairLength, setHairLength] = useState("");
  const router = useRouter();

  const handleStyleToggle = (id: string) => {
    setStyle((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleSubmit = () => {
    if (!gender || style.length === 0 || !occasion || !hairColor || !hairLength) {
      alert("請完成所有選項");
      return;
    }
    // TODO: Save preferences to store/API
    router.push("/recommendations");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <header className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          94StyleAI
        </h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8">設定您的偏好</h2>

        {/* Gender */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">性別</h3>
          <div className="flex gap-4 justify-center">
            {genderOptions.map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  gender === g
                    ? "bg-pink-500 text-white"
                    : "bg-white border-2 border-pink-200 text-gray-600 hover:border-pink-400"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">髮型風格（可多選）</h3>
          <div className="grid grid-cols-3 gap-3">
            {styleOptions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStyleToggle(s.id)}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  style.includes(s.id)
                    ? "bg-pink-500 text-white"
                    : "bg-white border-2 border-pink-200 text-gray-600 hover:border-pink-400"
                }`}
              >
                <span className="text-2xl block mb-1">{s.emoji}</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">使用場合</h3>
          <div className="grid grid-cols-3 gap-3">
            {occasionOptions.map((o) => (
              <button
                key={o.id}
                onClick={() => setOccasion(o.id)}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  occasion === o.id
                    ? "bg-purple-500 text-white"
                    : "bg-white border-2 border-purple-200 text-gray-600 hover:border-purple-400"
                }`}
              >
                <span className="text-2xl block mb-1">{o.emoji}</span>
                {o.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hair Color */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">髮色偏好</h3>
          <div className="grid grid-cols-3 gap-3">
            {hairColorOptions.map((c) => (
              <button
                key={c.id}
                onClick={() => setHairColor(c.id)}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  hairColor === c.id
                    ? "bg-purple-500 text-white"
                    : "bg-white border-2 border-purple-200 text-gray-600 hover:border-purple-400"
                }`}
              >
                <div className="flex gap-1 justify-center mb-2">
                  {c.colors.map((color, i) => (
                    <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                  ))}
                </div>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hair Length */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">頭髮長度</h3>
          <div className="grid grid-cols-3 gap-3">
            {hairLengthOptions.map((l) => (
              <button
                key={l.id}
                onClick={() => setHairLength(l.id)}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  hairLength === l.id
                    ? "bg-blue-500 text-white"
                    : "bg-white border-2 border-blue-200 text-gray-600 hover:border-blue-400"
                }`}
              >
                <span className="text-2xl block mb-1">{l.emoji}</span>
                {l.name}
                <p className="text-xs font-normal mt-1 opacity-75">{l.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-8 py-4 bg-gray-200 text-gray-600 rounded-full font-semibold hover:bg-gray-300 transition-all"
          >
            上一步
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            取得推薦
          </button>
        </div>
      </main>
    </div>
  );
}
