import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_TOKEN = process.env.NOTION_TOKEN || "";
const DATABASE_ID = process.env.NOTION_CHANGELOG_DB_ID || "";

const notion = new Client({ auth: NOTION_TOKEN });

async function run() {
  try {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
    });

    console.log(`Successfully retrieved ${res.results.length} pages to check.`);
    
    for (const page of res.results) {
      const props = page.properties;
      let titleKey = "";
      let originalTitle = "";
      
      // Find the Title property key and value
      for (const [k, v] of Object.entries(props)) {
        if (v.type === "title") {
          titleKey = k;
          originalTitle = v.title.map(t => t.plain_text).join("") || "";
          break;
        }
      }
      
      if (!titleKey || !originalTitle) continue;
      
      // Perform title cleaning: strip trailing "发布", "全系推送", "家族首发", "推送" etc.
      // Match words like "发布", "全系推送", "家族首发", "新版本上线", "上线", "推送"
      const cleanedTitle = originalTitle
        .replace(/\s*(?:发布|全系推送|家族首发|新版本上线|上线|推送|首发)\s*$/, "")
        .trim();
        
      if (cleanedTitle !== originalTitle && cleanedTitle.length > 0) {
        console.log(`Updating page ${page.id}:`);
        console.log(`  Before: "${originalTitle}"`);
        console.log(`  After:  "${cleanedTitle}"`);
        
        // Update Notion page title
        await notion.pages.update({
          page_id: page.id,
          properties: {
            [titleKey]: {
              title: [
                {
                  text: {
                    content: cleanedTitle
                  }
                }
              ]
            }
          }
        });
      } else {
        console.log(`Skipping page (already clean): "${originalTitle}"`);
      }
    }
    console.log("\nAll pages checked and updated!");
  } catch (err) {
    console.error("Error updating database pages:", err.message || err);
  }
}

run();
