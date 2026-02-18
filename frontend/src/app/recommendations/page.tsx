"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock AI recommendations - will be replaced with Claude API calls
const mockRecommendations = [
  {
    id: 1,
    name: "微分碎髮",
    description: "輕盈的層次感，適合日常上班和約會",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
    confidence: 95,
  },
  {
    id: 2,
    name: "韓系長瀏海",
    description: "修飾臉型，展現成熟氣質",
    image: "https://images.unsplash.com/photo-1529139574466-a302c27524ed?w=400",
    confidence: 88,
  },
  {
    id: 3,
    name: "短髮精靈",
    description: "活潑可愛，凸顯五官立體感",
    image: "https://images.unsplash.com/photo-1595624794932-aa2fbf9c1caa?w=400",
    confidence: 82,
  },
  {
    id: 4,
    name: "波浪捲髮",
    description: "浪漫優雅，適合重要場合",
    image: "https://images.unsplash.com/photo-1616091093747-9e47228805f7?w=400",
    confidence: 78,
  },
  {
    id: 5,
    name: "俐落油頭",
    description: "帥氣有型，展現自信魅力",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    confidence: 75,
  },
  {
    id: 6,
    name: "空氣劉海",
    description: "清新甜美，減齡神器",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    confidence: 72,
  },
];

export default function RecommendationsPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleGenerate = () => {
    if (selected.length === 0) {
      alert("請至少選擇一款髮型");
      return;
    }
    setGenerating(true);
    // Simulate generation - will be replaced with actual AI pipeline
    setTimeout(() => {
      setGenerating(false);
      router.push(`/results?hairstyles=${selected.join(",")}`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <header className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          94StyleAI
        </h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">AI 推薦髮型</h2>
          <p className="text-gray-600">根據您的臉型和偏好，推薦以下 6 款髮型</p>
          <p className="text-sm text-pink-500 mt-2">點擊選擇您想要生成的髮型（可多選）</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {mockRecommendations.map((hairstyle) => (
            <div
              key={hairstyle.id}
              onClick={() => toggleSelect(hairstyle.id)}
              className={`relative bg-white rounded-xl overflow-hidden shadow-md cursor-pointer transition-all hover:shadow-lg ${
                selected.includes(hairstyle.id) ? "ring-4 ring-pink-500" : ""
              }`}
            >
              <div className="aspect-square relative">
                <img
                  src={hairstyle.image}
                  alt={hairstyle.name}
                  className="w-full h-full object-cover"
                />
                {selected.includes(hairstyle.id) && (
                  <div className="absolute top-2 right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white">✓</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold">{hairstyle.name}</h3>
                <p className="text-sm text-gray-600">{hairstyle.description}</p>
                <div className="mt-2 flex items-center gap-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                      style={{ width: `${hairstyle.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{hairstyle.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-8 py-4 bg-gray-200 text-gray-600 rounded-full font-semibold hover:bg-gray-300 transition-all"
          >
            上一步
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`px-8 py-4 rounded-full font-semibold text-lg transition-all ${
              generating
                ? "bg-gray-300 text-gray-500"
                : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg"
            }`}
          >
            {generating ? "AI 生成中..." : `生成選定髮型 (${selected.length})`}
          </button>
        </div>
      </main>
    </div>
  );
}
