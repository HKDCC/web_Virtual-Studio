import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Tech-Linguist Lab · Virtual Studio",
  description: "Notion-powered personal studio.",
  icons: {
    icon: "https://minimax-algeng-chat-tts.oss-cn-wulanchabu.aliyuncs.com/ccv2%2F2026-03-20%2FMiniMax-M2.7%2F2029533552822984939%2F38a2b695c497258d0db824a605fcd4aa353e1f4d8835ac9c1f9d0599ff5ed18f..png?Expires=1774084924&OSSAccessKeyId=LTAI5tGLnRTkBjLuYPjNcKQ8&Signature=DWJZ269NaR%2FmAIu%2Fwxp9mzHmeVg%3D",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider>
          <SiteHeader />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

