import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getDate, getMultiSelect, getPageTitle, getRichText, getSelect, getCoverUrl } from "@/lib/notionHelpers";
import { RetroArchiveTabs } from "@/components/retro/RetroArchiveTabs";

export default async function RetroArchivePage() {
  const booksDb = env.NOTION_BOOKS_DB_ID;
  const notesDb = env.NOTION_NOTES_DB_ID;

  if (!env.NOTION_TOKEN || !booksDb || !notesDb) {
    return (
      <div className="retro-chapter">
        <h1 style={{ color: "var(--rust)" }}>SYS_ERR: ENV VARS MISSING</h1>
      </div>
    );
  }

  const [books, notes] = await Promise.all([
    queryDatabaseAll({ databaseId: booksDb, pageSize: 50, maxPages: 4 }),
    queryDatabaseAll({ databaseId: notesDb, pageSize: 50, maxPages: 6 }),
  ]);

  const parsedBooks = books.map((p) => {
    const props = p.properties as Record<string, unknown>;
    return {
      id: p.id,
      title: getPageTitle(p),
      author: getRichText(props, "Author"),
      tags: getMultiSelect(props, "Tags"),
      coverUrl: getCoverUrl(p as { cover?: unknown; properties?: Record<string, unknown> }),
    };
  });

  const parsedNotes = notes.map((p) => {
    const props = p.properties as Record<string, unknown>;
    return {
      id: p.id,
      title: getPageTitle(p),
      category: getSelect(props, "Category"),
      date: getDate(props, "Date"),
      tags: getMultiSelect(props, "Tags"),
      coverUrl: getCoverUrl(p as { cover?: unknown; properties?: Record<string, unknown> }),
    };
  });

  return <RetroArchiveTabs books={parsedBooks} notes={parsedNotes} />;
}
