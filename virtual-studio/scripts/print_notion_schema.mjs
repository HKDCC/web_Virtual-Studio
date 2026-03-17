import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const token = process.env.NOTION_TOKEN;
if (!token) {
  console.error("Missing NOTION_TOKEN in env.");
  process.exit(1);
}

const dbIds = {
  CHANGELOG: process.env.NOTION_CHANGELOG_DB_ID,
  NOTES: process.env.NOTION_NOTES_DB_ID,
  WORKFLOW: process.env.NOTION_WORKFLOW_DB_ID,
  BOOKS: process.env.NOTION_BOOKS_DB_ID,
  LAB: process.env.NOTION_LAB_DB_ID,
  PAUSE: process.env.NOTION_PAUSE_DB_ID,
};

const notion = new Client({ auth: token });

for (const [name, id] of Object.entries(dbIds)) {
  if (!id) {
    console.log(`\n== ${name} == (missing db id)`);
    continue;
  }
  const db = await notion.databases.retrieve({ database_id: id });
  if (db.object !== "database") {
    console.log(`\n== ${name} == (not a database)`);
    continue;
  }
  const title = (db.title ?? []).map((t) => t.plain_text).join("");
  console.log(`\n== ${name} == ${title ? `(${title})` : ""}`);
  const props = db.properties ?? {};
  for (const [k, v] of Object.entries(props)) {
    console.log(`- ${k}: ${v.type}`);
  }
}

