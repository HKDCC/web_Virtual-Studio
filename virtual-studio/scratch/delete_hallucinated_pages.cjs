const { Client } = require("@notionhq/client");
require("dotenv").config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const fakeNames = [
  "Grok-4.5 Release",
  "DeepSeek-V4 & R2 Open-Source",
  "Claude 4.7 Sonnet Release",
  "Gemini 3.5 Pro Release",
  "OpenAI o5-mini & GPT-5.4",
  "Kimi K3 Autonomous Agent",
  "Qwen3.7-Max API",
  "Doubao 2.5 Pro",
  "Zhipu GLM-5 Release",
  "MiniMax M3 Audio-Text"
];

async function deleteFakePages() {
  const dbId = process.env.NOTION_AINEWS_DB_ID;
  if (!dbId) return;

  const res = await notion.databases.query({ database_id: dbId });
  for (const page of res.results) {
    const title = page.properties.Name?.title?.[0]?.plain_text || "";
    if (fakeNames.includes(title)) {
      console.log(`Archiving/deleting fake page: ${title} (id: ${page.id})`);
      await notion.pages.update({
        page_id: page.id,
        archived: true,
      });
    }
  }
  console.log("Cleaned all fake pages from Notion DB!");
}

deleteFakePages().catch(console.error);
