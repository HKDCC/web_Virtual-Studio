import Link from "next/link";
import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { findPropertyKeyByType, getDate, getPageTitle, getRichText, getSelect } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";

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

      <div className="changelog-wrap">
        <p className="cl-year">{new Date().getFullYear()}</p>
        {items.map((p) => {
          const props = p.properties;
          const dateKey = findPropertyKeyByType(props, "date");
          const typeKey = findPropertyKeyByType(props, "select");
          const descKey = findPropertyKeyByType(props, "rich_text");

          const date = dateKey ? getDate(props, dateKey) : null;
          const type = typeKey ? getSelect(props, typeKey) : null;
          const desc = descKey ? getRichText(props, descKey) : null;

          const dot =
            (type ?? "").toLowerCase().includes("fix") || (type ?? "").toLowerCase().includes("improve")
              ? "fix"
              : (type ?? "").toLowerCase().includes("add") || (type ?? "").toLowerCase().includes("content")
                ? "add"
                : "feat";

          return (
            <Link key={p.id} href={`/p/${p.id}`} className="cl-item">
              <span className="cl-date">{date ? date.replace(/.*-(\d\d)-(\d\d).*/, "$1·$2") : "—"}</span>
              <div className={`cl-dot ${dot}`} />
              <div className="cl-content">
                <span className={`cl-tag ${dot}`}>{type ?? "Update"}</span>
                <div className="cl-title">{getPageTitle(p)}</div>
                {desc ? <p className="cl-desc">{desc}</p> : null}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

