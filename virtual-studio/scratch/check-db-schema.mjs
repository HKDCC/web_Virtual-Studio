import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_TOKEN = process.env.NOTION_TOKEN || "";
const DB_ID = process.env.NOTION_CHANGELOG_DB_ID || "";

const notion = new Client({ auth: NOTION_TOKEN });

async function run() {
  const response = await notion.databases.query({
    database_id: DB_ID,
    page_size: 5
  });
  
  for (const page of response.results) {
    console.log(`Page ID: ${page.id}`);
    console.log("Properties keys:", Object.keys(page.properties));
    for (const [key, prop] of Object.entries(page.properties)) {
      if (prop.type === "title") {
        console.log(`- Title [${key}]:`, prop.title.map(t => t.plain_text).join(""));
      } else if (prop.type === "select") {
        console.log(`- Select [${key}]:`, prop.select ? prop.select.name : "null");
      } else if (prop.type === "date") {
        console.log(`- Date [${key}]:`, prop.date ? prop.date.start : "null");
      } else if (prop.type === "rich_text") {
        console.log(`- Rich Text [${key}]:`, prop.rich_text.map(t => t.plain_text).join(""));
      } else if (prop.type === "multi_select") {
        console.log(`- Multi-select [${key}]:`, prop.multi_select.map(x => x.name).join(", "));
      }
    }
    console.log("---");
  }
}

run().catch(console.error);
