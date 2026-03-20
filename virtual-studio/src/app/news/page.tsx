import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getDate, getMultiSelect, getPageTitle } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";
import { NewsCard, type NewsItem } from "@/components/news/NewsCard";

export default async function NewsPage() {
  const db = env.NOTION_AINEWS_DB_ID;
  if (!env.NOTION_TOKEN || !db) {
    return <SetupNotice title="News 需要配置 NOTION_TOKEN / NOTION_AINEWS_DB_ID" />;
  }

  const items = await queryDatabaseAll({
    databaseId: db,
    pageSize: 50,
    maxPages: 6,
    sorts: [{ property: "Date", direction: "descending" }],
  });

  const newsItems: NewsItem[] = items.map((p) => {
    const props = p.properties as unknown as Record<string, unknown>;
    return {
      id: p.id,
      title: getPageTitle(p),
      date: getDate(props, "Date"),
      sources: getMultiSelect(props, "Source"),
      categories: getMultiSelect(props, "Category"),
    };
  });

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Daily · 输出层</p>
          <h1 className="section-title">AI 日报</h1>
        </div>
        <p className="section-desc">
          每日采集 AI 行业新闻，来源包括 smol.ai、TechCrunch 与 HackerNews，powered and translated by 芙宁娜（MiniMax-M2.7）
        </p>
      </div>

      <NewsCard items={newsItems} />
    </>
  );
}
