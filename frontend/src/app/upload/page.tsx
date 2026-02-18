"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);

    // TODO: Upload to Firebase Storage and create Firestore record
    // For now, simulate upload and redirect
    setTimeout(() => {
      setUploading(false);
      router.push("/preferences");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <header className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          94StyleAI
        </h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">上傳您的照片</h2>

        <div
          className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all ${
            preview ? "border-pink-300 bg-pink-50" : "border-gray-300 hover:border-pink-300"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="max-h-96 mx-auto rounded-lg" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <div className="text-6xl mb-4">📷</div>
              <p className="text-xl text-gray-600 mb-2">點擊或拖曳上傳照片</p>
              <p className="text-sm text-gray-400">支援 JPG、PNG 格式</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              navigator.mediaDevices?.getUserMedia({ video: true }).then((stream) => {
                // TODO: Implement camera capture
                console.log("Camera stream:", stream);
              });
            }}
            className="px-6 py-3 bg-white border-2 border-pink-300 text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-all"
          >
            📷 使用相機拍攝
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!file || uploading}
            className={`px-8 py-4 rounded-full font-semibold text-lg transition-all ${
              file && !uploading
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {uploading ? "上傳中..." : "下一步"}
          </button>
        </div>
      </main>
    </div>
  );
}
