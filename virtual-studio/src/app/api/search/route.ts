import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getPageTitle, getSelect, getMultiSelect } from "@/lib/notionHelpers";
import { NextResponse } from "next/server";

export async function GET() {
  const notesDb = env.NOTION_NOTES_DB_ID;
  const booksDb = env.NOTION_BOOKS_DB_ID;

  if (!env.NOTION_TOKEN || !notesDb || !booksDb) {
    return NextResponse.json({ items: [] });
  }

  try {
    const [notes, books] = await Promise.all([
      queryDatabaseAll({ databaseId: notesDb, pageSize: 50, maxPages: 2 }),
      queryDatabaseAll({ databaseId: booksDb, pageSize: 50, maxPages: 2 }),
    ]);

    const items = [
      ...notes.map((p) => {
        const props = p.properties as unknown as Record<string, unknown>;
        const cat = getSelect(props, "Category");
        const tags = getMultiSelect(props, "Tags");
        const isExploration = cat === "人工探索" || tags.includes("人工探索");
        return {
          id: p.id,
          title: getPageTitle(p),
          type: isExploration ? ("workflow" as const) : ("note" as const),
          url: isExploration ? `/workflow/notes?id=${p.id}` : `/p/${p.id}`,
        };
      }),
      ...books.map((p) => ({
        id: p.id,
        title: getPageTitle(p),
        type: "book" as const,
        url: `/p/${p.id}`,
      })),
    ];

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
