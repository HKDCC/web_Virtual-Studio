import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getMultiSelect, getPageTitle, getRichText, getSelect, getUrl, getCoverUrl, getIcon } from "@/lib/notionHelpers";
import { RetroLabTabs } from "@/components/retro/RetroLabTabs";

export default async function RetroLabPage() {
  const db = env.NOTION_LAB_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <div className="retro-chapter"><h1 style={{color: 'var(--rust)'}}>SYS_ERR: MISSING ENV VARS</h1></div>;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 50, maxPages: 6 });

  const repos = items.map((p) => {
    const props = p.properties as Record<string, unknown>;
    const type = getSelect(props, "Type") || "Lab";
    const title = getPageTitle(p);
    const desc = getRichText(props, "Description");
    const demoUrl = getUrl(props, "DemoURL");
    const ghUrl = getUrl(props, "GitHubURL");
    const coverUrl = getCoverUrl(p as { cover?: unknown; properties?: Record<string, unknown> });
    const icon = getIcon(p as { icon?: unknown });
    
    // Attempt to parse tags if we have them, else just use empty array
    let tags: string[] = [];
    if (props["Tags"]) {
        tags = getMultiSelect(props, "Tags");
    }

    return {
      id: p.id,
      title,
      desc,
      category: type,
      url: demoUrl || ghUrl,
      tags,
      coverUrl,
      icon
    };
  });

  return <RetroLabTabs repos={repos} />;
}
