import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "94StyleAI - AI 換髮型模擬平台",
  description: "使用 AI 技術為您推薦最適合的髮型",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
