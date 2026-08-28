import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getPageTitle } from "@/lib/notionHelpers";
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
      ...notes.map((p) => ({
        id: p.id,
        title: getPageTitle(p),
        type: "note" as const,
        url: `/p/${p.id}`,
      })),
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
