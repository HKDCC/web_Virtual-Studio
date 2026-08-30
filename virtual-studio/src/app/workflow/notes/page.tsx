import { notionClient, queryDatabaseAll, listBlockChildrenAll, NotionFullBlock } from "@/lib/notion";
import { getPageTitle, getDate, getSelect, getMultiSelect, getRichText } from "@/lib/notionHelpers";
import { env } from "@/lib/env";
import { NotionBlocks } from "@/components/NotionBlocks";
import { NotesDocViewer, NoteDocItem, NoteHeadingItem } from "./NotesDocViewer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WorkflowNotesDocPage(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await props.searchParams;
  const notesDb = env.NOTION_NOTES_DB_ID;
  const client = notionClient();

  const realNotes: NoteDocItem[] = [];

  // 1. Fetch Real Notes from Notion DB
  if (client && notesDb) {
    try {
      const items = await queryDatabaseAll({
        databaseId: notesDb,
        pageSize: 50,
        maxPages: 3,
      });

      for (const p of items) {
        const propsObj = p.properties as unknown as Record<string, unknown>;
        const title = getPageTitle(p) || "Untitled";
        const category = getSelect(propsObj, "Category") || "人工探索";
        const date = getDate(propsObj, "Date") || "";
        const tags = getMultiSelect(propsObj, "Tags");
        const excerpt = getRichText(propsObj, "Summary") || getRichText(propsObj, "Excerpt");
        const badge = getSelect(propsObj, "Badge") || (category === "人工探索" ? "实战复盘" : undefined);

        realNotes.push({
          id: p.id,
          title,
          category,
          date,
          tags,
          excerpt,
          badge,
        });
      }
    } catch (err) {
      console.error("Failed to query Notion notes database:", err);
    }
  }

  // 2. Filter for 人工探索 notes, fallback to all notes
  const explorationNotes = realNotes.filter((n) => n.category === "人工探索");
  const displayNotes = explorationNotes.length > 0 ? explorationNotes : realNotes;

  // Safe fallback if Notion DB query returned empty
  const defaultNote: NoteDocItem = {
    id: "e774b57f-e15a-83e7-b633-818781fe9a41",
    title: "AI agent如何在2天内从0到1产出出版社级别的译文？",
    date: "2026-07-19",
    category: "人工探索",
    badge: "实战复盘",
    excerpt: "全书英文原版 31,136 单词，两日内完成高品质出版级汉化与自动排版。详细拆解为什么初译选择 Gemini 3.5 Flash 100万 Token 原生大窗口、审校阶段为何引入 DeepSeek V4 Pro 专家模式挑错，以及 Agent 错题本自愈机制如何彻底替代传统表格翻译。",
    tags: ["大模型翻译", "Agent自愈", "Pandoc排版"],
  };

  const finalNotes = displayNotes.length > 0 ? displayNotes : [defaultNote];

  // Determine current active note
  const currentNote = finalNotes.find((n) => n.id === id) || finalNotes[0];

  // 3. Fetch Blocks for Active Note & Extract Headings for TOC
  let notionBlocks: NotionFullBlock[] = [];
  const headings: NoteHeadingItem[] = [];

  if (client) {
    try {
      notionBlocks = await listBlockChildrenAll({ blockId: currentNote.id });

      // Extract Headings for Table of Contents
      notionBlocks.forEach((block) => {
        if (block.type === "heading_1" || block.type === "heading_2" || block.type === "heading_3") {
          const b = block as unknown as Record<string, unknown>;
          const hObj = b[block.type] as { rich_text?: { plain_text: string }[] } | undefined;
          const text = hObj?.rich_text?.map((r) => r.plain_text).join("").trim() || "";
          if (text) {
            headings.push({
              id: block.id,
              level: block.type === "heading_1" ? 1 : block.type === "heading_2" ? 2 : 3,
              text,
            });
          }
        }
      });
    } catch (err) {
      console.error("Failed to fetch Notion blocks for note:", currentNote.id, err);
    }
  }

  return (
    <NotesDocViewer notes={finalNotes} currentNote={currentNote} headings={headings}>
      {notionBlocks.length > 0 ? (
        <NotionBlocks blocks={notionBlocks} />
      ) : (
        <div style={{ padding: "40px 0", color: "var(--ink-2)" }}>
          <p>正在同步 Notion 笔记正文，请稍候……</p>
        </div>
      )}
    </NotesDocViewer>
  );
}
