import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_TOKEN = process.env.NOTION_TOKEN || "";
const DB_ID = process.env.NOTION_CHANGELOG_DB_ID || "";

const notion = new Client({ auth: NOTION_TOKEN });

async function getDistinctModels() {
  let hasMore = true;
  let cursor = undefined;
  const models = new Set();
  
  while (hasMore) {
    const response = await notion.databases.query({
      database_id: DB_ID,
      start_cursor: cursor,
      page_size: 100
    });
    
    for (const page of response.results) {
      const props = page.properties;
      let modelName = "";
      if (props.Model && props.Model.type === "select" && props.Model.select) {
        modelName = props.Model.select.name;
      }
      
      let version = "";
      if (props.Version && props.Version.type === "rich_text" && props.Version.rich_text.length > 0) {
        version = props.Version.rich_text[0].plain_text;
      }
      
      if (modelName) {
        models.add(`${modelName} | ${version}`);
      }
    }
    
    hasMore = response.has_more;
    cursor = response.next_cursor;
  }
  
  console.log("Distinct Model/Version combinations in Notion:");
  Array.from(models).sort().forEach(m => console.log(m));
}

getDistinctModels();
