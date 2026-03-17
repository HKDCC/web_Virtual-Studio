import Link from "next/link";
import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { findPropertyKeyByType, getDate, getPageTitle, getRichText } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";

export default async function PausePage() {
  const db = env.NOTION_PAUSE_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <SetupNotice title="Pause 需要配置 NOTION_TOKEN / NOTION_PAUSE_DB_ID" />;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 60, maxPages: 8 });

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Pause · 生活层</p>
          <h1 className="section-title">隙</h1>
        </div>
        <p className="section-desc">想要一个 Happy End。</p>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 48px 80px" }}>
        <div style={{ columns: 3, columnGap: 16 }}>
          {items.map((p) => {
            const props = p.properties;
            const dateKey = findPropertyKeyByType(props, "date");
            const excerptKey = findPropertyKeyByType(props, "rich_text");
            const date = dateKey ? getDate(props, dateKey) : null;
            const excerpt = excerptKey ? getRichText(props, excerptKey) : null;

            return (
              <Link
                key={p.id}
                href={`/p/${p.id}`}
                style={{
                  display: "block",
                  breakInside: "avoid",
                  marginBottom: 16,
                  borderRadius: "var(--r)",
                  border: "1px solid var(--bg-3)",
                  background: "var(--bg-2)",
                  padding: 18,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>{excerpt?.slice(0, 2) || "🌿"}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{getPageTitle(p)}</div>
                {date ? <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{date}</div> : null}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

