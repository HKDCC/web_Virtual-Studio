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
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
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
            __html: `(function(){try{var s=localStorage.getItem('tl-theme')||localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);var t=d?'dark':'light';document.documentElement.setAttribute('data-theme',t);document.documentElement.dataset.theme=t;}catch(e){}})()`,
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
