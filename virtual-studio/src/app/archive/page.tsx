import { fetchMagazineData } from "@/lib/magazineData";
import { ArchiveTabs, ArchiveBook, ArchiveNote } from "@/components/archive/ArchiveTabs";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ArchivePage() {
  const data = await fetchMagazineData();

  const localNotes: string[] = [];
  try {
    const articlesDir = path.join(process.cwd(), "public", "articles");
    if (fs.existsSync(articlesDir)) {
      const artFiles = fs.readdirSync(articlesDir).filter(
        (f) => f.endsWith(".html") || f.endsWith(".md")
      );
      localNotes.push(...artFiles);
    }
    const notesDir = path.join(process.cwd(), "public", "notes");
    if (fs.existsSync(notesDir)) {
      const nFiles = fs.readdirSync(notesDir).filter(
        (f) => f.endsWith(".html") || f.endsWith(".md")
      );
      localNotes.push(...nFiles);
    }
  } catch (err) {
    console.error("Failed to read local notes directory:", err);
  }

  const books: ArchiveBook[] = data.books.map((b) => ({
    id: b.id || b.t,
    title: b.t,
    author: b.a,
    tags: b.tags || [b.c],
    coverUrl: b.coverUrl,
    tagline: b.tagline,
    rating: b.rating,
    downloadUrl: b.downloadUrl,
  }));

  const notes: ArchiveNote[] = data.notes.map((n) => ({
    id: n.id || n.title,
    title: n.title,
    category: n.cat,
    date: n.d,
    excerpt: n.text,
    tags: n.tags || [n.cat],
    coverUrl: null,
    htmlContent: n.htmlContent,
  }));

  return (
    <ArchiveTabs
      books={books}
      notes={notes}
      localNotes={Array.from(new Set(localNotes))}
    />
  );
}
