import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getDate, getMultiSelect, getPageTitle, getRichText } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";
import { ArchiveTabs } from "@/components/archive/ArchiveTabs";

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function firstFileUrl(filesProp: unknown): string | null {
  if (!isObj(filesProp)) return null;
  const files = (filesProp as Record<string, unknown>)["files"];
  if (!Array.isArray(files) || files.length === 0) return null;
  const f = files[0];
  if (!isObj(f)) return null;
  const type = f["type"];
  if (type === "external") {
    const external = f["external"];
    if (!isObj(external)) return null;
    const url = external["url"];
    return typeof url === "string" ? url : null;
  }
  if (type === "file") {
    const file = f["file"];
    if (!isObj(file)) return null;
    const url = file["url"];
    return typeof url === "string" ? url : null;
  }
  return null;
}

export default async function ArchivePage() {
  const booksDb = env.NOTION_BOOKS_DB_ID;
  const notesDb = env.NOTION_NOTES_DB_ID;

  if (!env.NOTION_TOKEN || !booksDb || !notesDb) {
    return <SetupNotice title="Archive 需要配置 NOTION_TOKEN / NOTION_BOOKS_DB_ID / NOTION_NOTES_DB_ID" />;
  }

  const [books, notes] = await Promise.all([
    queryDatabaseAll({ databaseId: booksDb, pageSize: 50, maxPages: 4 }),
    queryDatabaseAll({ databaseId: notesDb, pageSize: 50, maxPages: 6 }),
  ]);

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Archive · 输入层</p>
          <h1 className="section-title">库</h1>
        </div>
        <p className="section-desc">收藏与阅读是认知的基础设施。这里存放所有值得二次翻阅的内容。</p>
      </div>

      <ArchiveTabs
        books={books.map((p) => {
          const props = p.properties as unknown as Record<string, unknown>;
          return {
            id: p.id,
            title: getPageTitle(p),
            author: getRichText(props, "Author"),
            tags: getMultiSelect(props, "Tags"),
            coverUrl: firstFileUrl(props["Cover"]),
          };
        })}
        notes={notes.map((p) => {
          const props = p.properties as unknown as Record<string, unknown>;
          const categoryProp = props["Category"];
          let category: string | null = null;
          if (isObj(categoryProp) && categoryProp["type"] === "select") {
            const select = categoryProp["select"];
            if (isObj(select) && typeof select["name"] === "string") category = select["name"];
          }
          return {
            id: p.id,
            title: getPageTitle(p),
            category,
            date: getDate(props, "Date"),
            excerpt: getRichText(props, "Excerpt"),
            tags: getMultiSelect(props, "Tags"),
            coverUrl: firstFileUrl(props["Cover"]),
          };
        })}
      />
    </>
  );
}

