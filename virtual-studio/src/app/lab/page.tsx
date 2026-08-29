import { fetchMagazineData } from "@/lib/magazineData";
import { LabTabs, type LabItem } from "@/components/lab/LabTabs";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LabPage() {
  const data = await fetchMagazineData();
  const items = Array.isArray(data?.lab) ? data.lab : [];

  const labItems: LabItem[] = items.map((p, idx) => {
    const title = p.t || "Untitled";
    const t = title.toLowerCase();
    let appIcon = p.appIcon;

    if (!appIcon) {
      if (t.includes("whisper")) appIcon = { type: "image", value: "/lab/icons/whisperx.png" };
      else if (t.includes("reader") || t.includes("minireader")) appIcon = { type: "image", value: "/lab/icons/minireader.png" };
      else if (t.includes("cassette") || t.includes("magiccutter") || t.includes("cutter")) appIcon = { type: "image", value: "/lab/icons/magiccutter.png" };
      else if (t.includes("memo") || t.includes("swiftmemo")) appIcon = { type: "image", value: "/lab/icons/swiftmemo.png" };
      else if (t.includes("snake") || t.includes("retro")) appIcon = { type: "image", value: "/lab/icons/snake.png" };
      else if (t.includes("muse")) appIcon = { type: "emoji", value: "🌸" };
    }

    const isVibe = (p.tag || "").toLowerCase().includes("vibe") || (p.d || "").toLowerCase().includes("vibe");
    const ghLink = p.links?.find(([name]) => name.toLowerCase().includes("github") || name.toLowerCase().includes("源码"))?.[1] || null;
    const demoLink = p.links?.find(([name]) => name.toLowerCase().includes("demo") || name.toLowerCase().includes("演示") || name.toLowerCase().includes("在线") || name.toLowerCase().includes("体验") || name.toLowerCase().includes("下载"))?.[1] || p.links?.[0]?.[1] || null;

    return {
      id: p.id || `lab-${idx}`,
      title,
      type: isVibe ? "vibe" : "ai",
      badge: p.tag || (isVibe ? "Vibe Coding" : "AI 原生"),
      description: p.d || "",
      github: ghLink,
      demo: demoLink,
      iconUrl: p.iconUrl || null,
      appIcon: appIcon || null,
    };
  });

  const ai = labItems.filter((p) => p.type === "ai");
  const vibe = labItems.filter((p) => p.type === "vibe");

  return (
    <div className="wrap" style={{ paddingTop: "24px", paddingBottom: "80px" }}>
      <nav className="detail-breadcrumb" aria-label="面包屑导航" style={{ marginBottom: "20px" }}>
        <Link href="/" className="detail-breadcrumb-link">
          首页
        </Link>
        <span className="detail-breadcrumb-sep">/</span>
        <span className="detail-breadcrumb-current">
          <span className="detail-breadcrumb-icon">⚗️</span>
          01 实验室 · 产品看板
        </span>
      </nav>

      <div className="section-header" style={{ marginBottom: "28px" }}>
        <div>
          <p className="section-eyebrow">LAB · 01 实验室</p>
          <h1 className="section-title">实验室 · 独立产品与工具</h1>
        </div>
        <p className="section-desc">AI 实践记录与 Vibe Coding 成果。每个项目都是一次认知迭代。</p>
      </div>

      <LabTabs ai={ai} vibe={vibe} />
    </div>
  );
}
