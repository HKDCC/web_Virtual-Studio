import Link from "next/link";
import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getPageTitle, getDate, getRichText, getCoverUrl } from "@/lib/notionHelpers";

export default async function RetroPausePage() {
  const db = env.NOTION_PAUSE_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <div className="retro-chapter"><h1 style={{color: 'var(--rust)'}}>SYS_ERR: MISSING ENV VARS</h1></div>;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 60, maxPages: 8 });

  return (
    <section className="retro-chapter">
      <div className="retro-chapter-header">
        <div className="retro-chapter-num">CH.05</div>
        <div>
          <h2 className="retro-chapter-title">定格 <em>Pause</em></h2>
          <div className="retro-chapter-sub">ORGANIC ENVIRONMENT CAPTURES. OFFLINE DATA.</div>
        </div>
      </div>

      <div className="retro-pause-masonry">
        {items.map((p) => {
          const props = p.properties as Record<string, unknown>;
          const title = getPageTitle(p);
          const coverUrl = getCoverUrl(p as { cover?: unknown; properties?: Record<string, unknown> });
          const date = getDate(props, "Date");
          const location = getRichText(props, "Location");

          return (
            <div key={p.id} className="retro-pause-item">
              <Link href={`/retro/p/${p.id}`} className="retro-card" style={{ display: 'block', padding: 16 }}>
                {coverUrl ? (
                  <div className="retro-img-frame" data-id={p.id.split('-')[0]}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverUrl} alt={title || "IMG_RECORD"} />
                  </div>
                ) : (
                  <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--line)', marginBottom: 12 }}>
                    NO_IMG_DATA
                  </div>
                )}
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                  <div style={{ color: 'var(--accent-2)', marginBottom: 4, fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 'bold' }}>ID: {p.id.split('-')[0]}</div>
                  {date && <div><strong>DATE:</strong> {date}</div>}
                  {location && <div><strong>LOC:</strong> {location}</div>}
                  {title && <div><strong>DESC:</strong> {title}</div>}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
