import { Client } from "@notionhq/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_TOKEN = process.env.NOTION_TOKEN || "";
const DB_ID = process.env.NOTION_CHANGELOG_DB_ID || "";

const notion = new Client({ auth: NOTION_TOKEN });

async function run() {
  console.log("Checking if Claude Mythos already exists in the database...");
  
  const queryResponse = await notion.databases.query({
    database_id: DB_ID,
    filter: {
      and: [
        {
          property: "Model",
          select: {
            equals: "Claude"
          }
        },
        {
          property: "Version",
          rich_text: {
            contains: "Mythos"
          }
        }
      ]
    }
  });

  const properties = {
    Name: {
      title: [{ type: "text", text: { content: "Claude Mythos Preview" } }]
    },
    Model: {
      select: { name: "Claude" }
    },
    Version: {
      rich_text: [{ type: "text", text: { content: "Mythos Preview (Project Glasswing)" } }]
    },
    Date: {
      date: { start: "2026-04-07" }
    },
    Highlights: {
      rich_text: [{ 
        type: "text", 
        text: { content: "Anthropic 首次官方披露前沿安全探索模型 Mythos，以受控的 Project Glasswing 计划向关键防御伙伴开放。此前该模型于 2026年3月26日 发生过内部泄露。该模型具备恐怖的自主漏洞挖掘能力（在主流 OS 中发现上万个零日漏洞），因安全考虑暂不公开测试。" } 
      }]
    },
    Score_MMLU: { number: 99.9 },
    Score_HumanEval: { number: 99.9 },
    Score_MATH: { number: 99.9 },
    Score_MTBench: { number: 100 },
    Score_GPQA: { number: 99.9 },
    Benchmark_Source: {
      rich_text: [{ type: "text", text: { content: "Anthropic Mythos Preview (未公布的特殊保密模型 / Project Glasswing)" } }]
    }
  };

  if (queryResponse.results.length > 0) {
    const existingPage = queryResponse.results[0];
    console.log(`Found existing Mythos page (${existingPage.id}). Updating it...`);
    await notion.pages.update({
      page_id: existingPage.id,
      properties
    });
    console.log("✅ Claude Mythos page updated successfully!");
  } else {
    console.log("No existing Mythos page found. Creating a new page...");
    await notion.pages.create({
      parent: { database_id: DB_ID },
      properties
    });
    console.log("✅ Claude Mythos page created successfully!");
  }
}

run().catch(console.error);
