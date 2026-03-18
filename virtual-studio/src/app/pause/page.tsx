import Link from "next/link";
import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getPageTitle } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";

export default async function PausePage() {
  const db = env.NOTION_PAUSE_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <SetupNotice title="Pause 需要配置 NOTION_TOKEN / NOTION_PAUSE_DB_ID" />;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 60, maxPages: 8 });

  const bg = ["bg-warm", "bg-cool", "bg-forest", "bg-dusk", "bg-stone", "bg-ink"] as const;
  const size = ["s", "m", "l"] as const;

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Pause · 生活层</p>
          <h1 className="section-title">隙</h1>
        </div>
        <p className="section-desc">想要一个 Happy End。</p>
      </div>

      <div className="pause-masonry">
        {items.map((p, idx) => {
          const t = getPageTitle(p);
          const emoji = t?.trim()?.slice(0, 2) || "🌿";
          const b = bg[idx % bg.length];
          const s = size[idx % size.length];
          return (
            <Link key={p.id} href={`/p/${p.id}`} className="pause-item">
              <div className={`pause-block ${s} ${b}`}>
                <div className="pause-block-inner">{emoji}</div>
                <div className="pause-overlay">
                  <div className="pause-meta">
                    <div className="pause-meta-item">
                      <span className="pause-meta-icon">✦</span>
                      <span>{t}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

