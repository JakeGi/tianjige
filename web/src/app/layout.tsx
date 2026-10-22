import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "天机阁 · 中国传统数术推演与国学AI智解平台",
  description: "天机阁融合千年传统周易数术典籍与现代大语言模型，提供高精度四柱八字排盘、周易六爻推演、干支日历及个人性格潜能AI深度研报。观星鉴己，洞烛幽微。",
  keywords: ["天机阁", "国学", "八字排盘", "周易", "六爻", "梅花易数", "紫微斗数", "易经", "传统文化", "AI解盘", "性格分析"],
  authors: [{ name: "天机阁文化研究院" }],
};

export const viewport: Viewport = {
  themeColor: "#07090f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
