import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_TOKEN = process.env.NOTION_TOKEN || "";
const DB_ID = process.env.NOTION_CHANGELOG_DB_ID || "";

const notion = new Client({ auth: NOTION_TOKEN });

async function checkMissing() {
  const response = await notion.databases.query({
    database_id: DB_ID,
  });
  
  const missing = [];
  
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
    
    // Check if MMLU is empty
    const mmlu = props.Score_MMLU?.number;
    const gpqa = props.Score_GPQA?.number;
    
    if (mmlu === null || mmlu === undefined || gpqa === null || gpqa === undefined) {
      missing.push(`${modelName} ${version}`);
    }
  }
  
  console.log(`Found ${missing.length} records with missing data.`);
  console.log("Samples:", missing.slice(0, 20));
}

checkMissing();
