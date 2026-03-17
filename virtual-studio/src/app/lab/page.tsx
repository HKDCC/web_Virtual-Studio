import Link from "next/link";
import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { findPropertyKeyByType, getMultiSelect, getPageTitle, getRichText, getSelect } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";

export default async function LabPage() {
  const db = env.NOTION_LAB_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <SetupNotice title="Lab 需要配置 NOTION_TOKEN / NOTION_LAB_DB_ID" />;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 50, maxPages: 6 });

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Lab · 输出层</p>
          <h1 className="section-title">实验室</h1>
        </div>
        <p className="section-desc">AI 实践记录与 Vibe Coding 成果。每个项目都是一次认知迭代。</p>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 48px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {items.map((p) => {
            const props = p.properties;
            const categoryKey = findPropertyKeyByType(props, "select");
            const tagsKey = findPropertyKeyByType(props, "multi_select");
            const excerptKey = findPropertyKeyByType(props, "rich_text");

            const category = categoryKey ? getSelect(props, categoryKey) : null;
            const tags = tagsKey ? getMultiSelect(props, tagsKey) : [];
            const excerpt = excerptKey ? getRichText(props, excerptKey) : null;

            return (
              <Link
                key={p.id}
                href={`/p/${p.id}`}
                style={{
                  border: "1px solid var(--bg-3)",
                  borderRadius: "var(--r-lg)",
                  padding: 20,
                  textDecoration: "none",
                  color: "inherit",
                  background: "var(--bg)",
                  transition: "var(--spring)",
                }}
              >
                {category ? (
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.08em", marginBottom: 10 }}>
                    {category}
                  </div>
                ) : null}
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{getPageTitle(p)}</div>
                {excerpt ? <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>{excerpt}</div> : null}
                {tags.length ? (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                    {tags.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: "var(--accent-pale)",
                          color: "var(--accent)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

