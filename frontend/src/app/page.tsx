import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
              94StyleAI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              AI 髮型模擬，讓你找到最適合自己的髮型
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/upload"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-lg transition-all"
              >
                開始體驗
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white text-pink-600 border-2 border-pink-300 rounded-full font-semibold text-lg hover:bg-pink-50 transition-all"
              >
                查看示範
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">功能特色</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">智能上傳</h3>
              <p className="text-gray-600">支援拖曳上傳和相機拍攝</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI 推薦</h3>
              <p className="text-gray-600">根據臉型推薦最適合的髮型</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">效果逼真</h3>
              <p className="text-gray-600">Before/After 滑動對比</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">使用流程</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <span className="text-lg">上傳照片</span>
            </div>
            <span className="text-2xl text-gray-400">→</span>
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <span className="text-lg">設定偏好</span>
            </div>
            <span className="text-2xl text-gray-400">→</span>
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <span className="text-lg">AI 生成</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-white text-center">
        <p>&copy; 2026 94StyleAI. All rights reserved.</p>
      </footer>
    </main>
  );
}
