"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Mock results - will be replaced with actual generated images
const mockResults = [
  {
    id: 1,
    name: "微分碎髮",
    original: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600",
    generated: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&sat=-100",
  },
  {
    id: 2,
    name: "韓系長瀏海",
    original: "https://images.unsplash.com/photo-1529139574466-a302c27524ed?w=600",
    generated: "https://images.unsplash.com/photo-1529139574466-a302c27524ed?w=600&hue=180",
  },
  {
    id: 3,
    name: "短髮精靈",
    original: "https://images.unsplash.com/photo-1595624794932-aa2fbf9c1caa?w=600",
    generated: "https://images.unsplash.com/photo-1595624794932-aa2fbf9c1caa?w=600&sat=-80",
  },
];

function BeforeAfterSlider({ original, generated }: { original: string; generated: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.min(Math.max(x, 0), 100));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square overflow-hidden rounded-xl cursor-ew-resize"
      onMouseMove={handleMouseMove}
    >
      {/* Generated (After) - Full width background */}
      <img src={generated} alt="After" className="absolute inset-0 w-full h-full object-cover" />

      {/* Original (Before) - Clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={original} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <span className="text-gray-600">↔</span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">Before</div>
      <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm">After</div>
    </div>
  );
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const hairstyleIds = searchParams.get("hairstyles")?.split(",").map(Number) || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const results = mockResults.filter((r) => hairstyleIds.includes(r.id));

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">沒有生成的結果，請重新選擇髮型</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <header className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          94StyleAI
        </h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">生成完成！</h2>
          <p className="text-gray-600">拖動滑桿比較 Before/After 效果</p>
        </div>

        {/* Main comparison */}
        <div className="mb-8">
          <BeforeAfterSlider
            original={results[activeIndex].original}
            generated={results[activeIndex].generated}
          />
          <div className="text-center mt-4">
            <h3 className="text-xl font-semibold">{results[activeIndex].name}</h3>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-4 justify-center mb-8 overflow-x-auto pb-2">
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === index ? "border-pink-500 ring-2 ring-pink-200" : "border-gray-200"
              }`}
            >
              <img src={result.generated} alt={result.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-white border-2 border-pink-300 text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-all">
            💾 下載全部
          </button>
          <button className="px-6 py-3 bg-white border-2 border-purple-300 text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-all">
            🔗 分享結果
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
            ➕ 新增髮型
          </button>
        </div>

        {/* Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          ⚠️ 照片將於 24 小時後自動刪除
        </p>
      </main>
    </div>
  );
}
