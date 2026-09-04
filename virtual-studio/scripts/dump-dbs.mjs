import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const token = process.env.NOTION_TOKEN;
const notion = new Client({ auth: token });

async function run() {
  const dbIds = {
    CHANGELOG: process.env.NOTION_CHANGELOG_DB_ID,
    NOTES: process.env.NOTION_NOTES_DB_ID,
    WORKFLOW: process.env.NOTION_WORKFLOW_DB_ID,
    BOOKS: process.env.NOTION_BOOKS_DB_ID,
    LAB: process.env.NOTION_LAB_DB_ID,
    PAUSE: process.env.NOTION_PAUSE_DB_ID,
    AINEWS: process.env.NOTION_AINEWS_DB_ID,
  };

  for (const [name, id] of Object.entries(dbIds)) {
    if (!id) continue;
    try {
      const db = await notion.databases.retrieve({ database_id: id });
      const title = (db.title ?? []).map((t) => t.plain_text).join("");
      console.log(`\n== ${name} (${id}) == ${title}`);
      const props = db.properties ?? {};
      for (const [k, v] of Object.entries(props)) {
        console.log(`- ${k}: ${v.type}`);
      }
    } catch (e) {
      console.error(`Error for ${name} (${id}):`, e.message);
    }
  }
}

run();
