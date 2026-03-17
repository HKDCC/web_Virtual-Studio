import Link from "next/link";
import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { findPropertyKeyByType, getDate, getPageTitle, getRichText, getSelect } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";

function dotColor(type: string | null) {
  const t = (type ?? "").toLowerCase();
  if (t.includes("fix") || t.includes("improve")) return "var(--blue)";
  if (t.includes("add") || t.includes("content")) return "var(--green)";
  return "var(--accent)";
}

export default async function ChangelogPage() {
  const db = env.NOTION_CHANGELOG_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <SetupNotice title="Changelog 需要配置 NOTION_TOKEN / NOTION_CHANGELOG_DB_ID" />;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 80, maxPages: 10 });

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Change Log · 足迹</p>
          <h1 className="section-title">这个花园的生长记录</h1>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 48px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {items.map((p) => {
            const props = p.properties;
            const dateKey = findPropertyKeyByType(props, "date");
            const typeKey = findPropertyKeyByType(props, "select");
            const descKey = findPropertyKeyByType(props, "rich_text");

            const date = dateKey ? getDate(props, dateKey) : null;
            const type = typeKey ? getSelect(props, typeKey) : null;
            const desc = descKey ? getRichText(props, descKey) : null;

            return (
              <Link
                key={p.id}
                href={`/p/${p.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid var(--bg-3)",
                  borderRadius: "var(--r)",
                  padding: 18,
                  background: "var(--bg)",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: dotColor(type),
                      boxShadow: "0 0 0 2px var(--bg-3)",
                    }}
                  />
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{date ?? "—"}</div>
                  {type ? (
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent)" }}>{type}</div>
                  ) : null}
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: desc ? 6 : 0 }}>{getPageTitle(p)}</div>
                {desc ? <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>{desc}</div> : null}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

