import Link from "next/link";
import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { findPropertyKeyByType, getDate, getPageTitle, getRichText, getSelect } from "@/lib/notionHelpers";

export default async function RetroChangelogPage() {
  const db = env.NOTION_CHANGELOG_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <div className="retro-chapter"><h1 style={{color: 'var(--rust)'}}>SYS_ERR: MISSING ENV VARS</h1></div>;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 80, maxPages: 10, sorts: [{ property: "Date", direction: "descending" }] });

  return (
    <section className="retro-chapter">
      <div className="retro-chapter-header">
        <div className="retro-chapter-num">CH.06</div>
        <div>
          <h2 className="retro-chapter-title">系统足迹 <em>Logs</em></h2>
          <div className="retro-chapter-sub">SYSTEM UPDATE HISTORY AND PATCH NOTES.</div>
        </div>
      </div>

      <div style={{ marginTop: 40, maxWidth: 680 }}>
        {items.map((p) => {
          const props = p.properties;
          const dateKey = findPropertyKeyByType(props, "date");
          const typeKey = findPropertyKeyByType(props, "select");
          const descKey = findPropertyKeyByType(props, "rich_text");

          const date = dateKey ? getDate(props, dateKey) : null;
          const type = typeKey ? getSelect(props, typeKey) : null;
          const desc = descKey ? getRichText(props, descKey) : null;

          return (
            <div key={p.id} style={{ marginBottom: 32, paddingLeft: 24, borderLeft: '2px solid var(--line)', position: 'relative' }}>
              <div style={{
                position: 'absolute', left: -7, top: 4, width: 12, height: 12, 
                background: 'var(--paper)', border: '2px solid var(--rust)', borderRadius: '50%'
              }} />
              
              <div className="retro-tl-year">{date || "UNKNOWN"} · [{type?.toUpperCase() || "UPDATE"}]</div>
              
              <Link href={`/retro/p/${p.id}`} style={{ textDecoration: 'none' }}>
                <div className="retro-tl-title" style={{ transition: 'color .2s' }}>{getPageTitle(p)}</div>
              </Link>
              
              {desc && (
                <ul className="retro-fancy-list" style={{ marginTop: 12 }}>
                  <li>{desc}</li>
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
