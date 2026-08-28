const { Client } = require("@notionhq/client");
require("dotenv").config({ path: ".env.local" });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const newFive = [
  {
    name: "Grok 4.2",
    model: "Grok",
    date: "2026-03-12",
    version: "Grok 4.2",
    highlights: "xAI 发布 Grok 4.2——增强长文本代码推理与 X 平台实时数据提取效率。",
    score_mmlu: 94.0,
    score_humaneval: 90.0,
    score_math: 81.0,
    score_mtbench: 9.6,
    score_gpqa: 65.0,
    source: "xAI Release (2026-03)"
  },
  {
    name: "Grok 4.4",
    model: "Grok",
    date: "2026-05-15",
    version: "Grok 4.4",
    highlights: "xAI 4.4 中代迭代——升级复杂逻辑推理、多工具调用与多模态合成。",
    score_mmlu: 95.8,
    score_humaneval: 92.0,
    score_math: 82.5,
    score_mtbench: 9.7,
    score_gpqa: 67.0,
    source: "xAI Release (2026-05)"
  },
  {
    name: "Kimi K2.7",
    model: "Kimi",
    date: "2026-05-12",
    version: "K2.7",
    highlights: "月之暗面发布 K2.7——升级 500 万 Context 上下文记忆与代码 Agent 工具链协同。",
    score_mmlu: 93.8,
    score_humaneval: 89.5,
    score_math: 80.0,
    score_mtbench: 9.4,
    score_gpqa: 60.5,
    source: "Moonshot AI Release (2026-05)"
  },
  {
    name: "Claude Opus 4.8",
    model: "Claude",
    date: "2026-07-12",
    version: "Claude Opus 4.8",
    highlights: "Anthropic 发布 4.8 Opus 顶配旗舰——支持极端复杂度系统级编程与多学科研究探索。",
    score_mmlu: 97.5,
    score_humaneval: 95.0,
    score_math: 87.0,
    score_mtbench: 9.9,
    score_gpqa: 72.5,
    source: "Anthropic Announcement (2026-07)"
  },
  {
    name: "Qwen3.8-Max",
    model: "Qwen",
    date: "2026-07-02",
    version: "Qwen3.8-Max",
    highlights: "阿里千问发布 Qwen3.8-Max 旗舰 API——大幅提升多语言多模态推理与长代码基准得分。",
    score_mmlu: 94.5,
    score_humaneval: 91.5,
    score_math: 82.0,
    score_mtbench: 9.5,
    score_gpqa: 61.0,
    source: "Qwen Team Release (2026-07)"
  }
];

async function insertFive() {
  const dbId = process.env.NOTION_AINEWS_DB_ID;
  if (!dbId) return;

  const existing = await notion.databases.query({ database_id: dbId });
  const existingTitles = new Set(
    existing.results.map(
      (p) => p.properties.Name?.title?.[0]?.plain_text || ""
    )
  );

  for (const entry of newFive) {
    if (existingTitles.has(entry.name)) {
      console.log(`Skipping already existing: ${entry.name}`);
      continue;
    }

    console.log(`Inserting into Notion: [${entry.date}] [${entry.model}] ${entry.name}`);
    await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: entry.name } }] },
        Model: { select: { name: entry.model } },
        Date: { date: { start: entry.date } },
        Version: { rich_text: [{ text: { content: entry.version } }] },
        Highlights: { rich_text: [{ text: { content: entry.highlights } }] },
        Score_MMLU: { number: entry.score_mmlu },
        Score_HumanEval: { number: entry.score_humaneval },
        Score_MATH: { number: entry.score_math },
        Score_MTBench: { number: entry.score_mtbench },
        Score_GPQA: { number: entry.score_gpqa },
        Benchmark_Source: { rich_text: [{ text: { content: entry.source } }] }
      }
    });
    console.log(`Added: ${entry.name}`);
  }
  console.log("Successfully inserted the 5 requested models!");
}

insertFive().catch(console.error);
