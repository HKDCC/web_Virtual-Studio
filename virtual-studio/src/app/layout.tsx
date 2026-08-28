import type { Metadata } from "next";
import "./globals.css";
import { MagazineHeader } from "@/components/magazine/MagazineHeader";
import { MagazineFooter } from "@/components/magazine/MagazineFooter";
import { RevealObserver } from "@/components/magazine/RevealObserver";
import { ThemeProvider } from "@/components/ThemeProvider";
import { fetchMagazineData } from "@/lib/magazineData";

export const metadata: Metadata = {
  title: "tl; // lab — Virtual Studio · 杂志版",
  description: "基于 Next.js + Notion 的杂志编辑式个人站（方案 C）",
  icons: {
    icon: "https://minimax-algeng-chat-tts.oss-cn-wulanchabu.aliyuncs.com/ccv2%2F2026-03-20%2FMiniMax-M2.7%2F2029533552822984939%2F38a2b695c497258d0db824a605fcd4aa353e1f4d8835ac9c1f9d0599ff5ed18f..png?Expires=1774084924&OSSAccessKeyId=LTAI5tGLnRTkBjLuYPjNcKQ8&Signature=DWJZ269NaR%2FmAIu%2Fwxp9mzHmeVg%3D",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await fetchMagazineData();

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('tl-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip" href="#main">
          跳到主要内容
        </a>
        <ThemeProvider>
          <MagazineHeader
            books={data.books}
            lab={data.lab}
            tools={data.tools}
            sites={data.sites}
            pause={data.pause}
            timeline={data.timeline}
            notes={data.notes}
            log={data.log}
          />
          <main id="main">{children}</main>
          <MagazineFooter />
          <RevealObserver />
        </ThemeProvider>
      </body>
    </html>
  );
}
