/**
 * AI Model Changelog reader — reads from Notion
 */

import type { IncomingMessage } from "node:http";
import type { RequestOptions } from "node:https";
import https from "node:https";
import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getPageTitle, getSelect, getDate, getRichText, getNumber } from "@/lib/notionHelpers";


const NOTION_API_KEY = env.NOTION_TOKEN || "";
const DATABASE_ID = env.NOTION_CHANGELOG_DB_ID || "";

export interface ChangelogEntry {
  id: string;
  date: string;
  model: string;
  version?: string;
  change: string;
  detail?: string;
  pricing?: string;
  url?: string;
}

export interface ChangelogMonth {
  year: number;
  month: number;
  key: string;
  title: string;
  entries: ChangelogEntry[];
}

function notionReq(
  method: string,
  endpoint: string,
  body?: object
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : "";
    const opts: RequestOptions = {
      hostname: "api.notion.com",
      port: 443,
      path: endpoint,
      method,
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
      },
    };
    const req = https.request(opts, (res: IncomingMessage) => {
      let raw = "";
      res.on("data", (c: Buffer) => (raw += c.toString()));
      res.on("end", () => {
        try {
          resolve(JSON.parse(raw));
        } catch {
          reject(new Error(raw.slice(0, 200)));
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    if (data) req.write(data);
    req.end();
  });
}

function extractTextFromRichText(
  richText: Array<{ plain_text: string; href?: string | null }>
): { text: string; href?: string } {
  const text = richText.map((t) => t.plain_text).join("");
  const href = richText.find((t) => t.href)?.href || undefined;
  return { text, href };
}

async function getChangelogMonths(): Promise<ChangelogMonth[]> {
  const res = (await notionReq("POST", `/v1/databases/${DATABASE_ID}/query`, {
    filter: {
      or: [{ property: "Source", multi_select: { contains: "AI模型更迭" } }],
    },
    sorts: [{ property: "Date", direction: "descending" }],
    page_size: 100,
  })) as {
    results?: Array<{
      id: string;
      properties: Record<string, unknown>;
    }>;
  };

  const pages = res.results || [];
  const monthMap = new Map<string, ChangelogMonth>();

  for (const page of pages) {
    const props = page.properties as Record<string, unknown>;

    let dateStr = "";
    const dateProp = props.Date as { date?: { start?: string } } | undefined;
    if (dateProp?.date?.start) {
      dateStr = dateProp.date.start;
    }

    if (!dateStr) continue;

    const datePart = dateStr.split("T")[0];
    const [yearStr, monthStr] = datePart.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const key = `${year}-${String(month).padStart(2, "0")}`;

    if (!monthMap.has(key)) {
      monthMap.set(key, {
        year,
        month,
        key,
        title: `${year}年${month}月`,
        entries: [],
      });
    }

    const monthData = monthMap.get(key)!;

    // Fetch page blocks
    const blockRes = (await notionReq(
      "GET",
      `/v1/blocks/${page.id}/children?page_size=100`
    )) as {
      results?: Array<{
        type: string;
        [key: string]: unknown;
      }>;
    };

    const blocks = blockRes.results || [];
    let currentModel = "Other";
    let currentDate = datePart;
    let currentVersion = "";
    let currentChange = "";
    let currentDetail: string[] = [];
    let currentPricing = "";

    const flushEntry = () => {
      if (currentChange) {
        monthData.entries.push({
          id: `${currentDate}-${currentModel}-${monthData.entries.length}`.replace(
            /\s/g,
            "-"
          ),
          date: currentDate,
          model: currentModel,
          version: currentVersion || undefined,
          change: currentChange.trim(),
          detail:
            currentDetail.length > 0 ? currentDetail.join(" ").trim() : undefined,
          pricing: currentPricing || undefined,
        });
      }
      currentChange = "";
      currentDetail = [];
      currentPricing = "";
      currentVersion = "";
    };

    for (const block of blocks) {
      const type = block.type as string;
      const data = block[type] as {
        rich_text?: Array<{ plain_text: string; href?: string | null }>;
      };
      const richText = data?.rich_text || [];
      const { text } = extractTextFromRichText(richText);
      const trimmed = text.trim();

      if (type === "heading_2") {
        flushEntry();
        currentModel = trimmed;
      } else if (type === "heading_3") {
        flushEntry();
        const dateMatch = trimmed.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) currentDate = dateMatch[1];
        const versionMatch = trimmed.match(/·\s*([^\n·]+)/);
        if (versionMatch) currentVersion = versionMatch[1].trim();
        const beforeDash = trimmed
          .replace(/·.+$/, "")
          .replace(/^\d{4}-\d{2}-\d{2}\s*/, "")
          .trim();
        if (beforeDash) currentChange = beforeDash;
      } else if (type === "bulleted_list_item") {
        if (
          /^\$[¥$]/.test(trimmed) ||
          trimmed.toLowerCase().includes("usd") ||
          trimmed.toLowerCase().includes("per m")
        ) {
          currentPricing = trimmed;
        } else if (currentChange) {
          currentDetail.push(trimmed);
        } else {
          currentChange = trimmed;
        }
      } else if (type === "paragraph" && trimmed) {
        if (currentChange) {
          currentDetail.push(trimmed);
        }
      }
    }

    flushEntry();
  }

  return Array.from(monthMap.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

export { getChangelogMonths };

export interface BenchmarkData {
  mmlu?: number;
  humaneval?: number;
  math?: number;
  mtbench?: number;
  gpqa?: number;
  /** Notion 字段中注明的来源文字，如论文链接或 "Official Blog" */
  source?: string;
}

export interface TimelineEntry {
  id: string;
  name: string;
  model: string;
  date: string;
  version?: string;
  highlights?: string;
  /** 该模型版本的真实跑分，从 Notion 读取；未填写时为 undefined */
  benchmarks?: BenchmarkData;
}

export const MOCK_TIMELINE: TimelineEntry[] = [
  {
    id: "timeline-1",
    name: "Mimo Code-v1.2 Release",
    model: "Mimo",
    date: "2025-03-05",
    version: "Code-v1.2",
    highlights: "Optimized for on-device mobile programming assistance with 50% faster completion speed and lower memory usage."
  },
  {
    id: "timeline-2",
    name: "Claude 3.7 Sonnet Launch",
    model: "Claude",
    date: "2025-02-24",
    version: "3.7 Sonnet",
    highlights: "First model to support hybrid reasoning, allowing users to toggle thinking mode on or off. Major improvements in coding, instruction following, and agentic workflows."
  },
  {
    id: "timeline-3",
    name: "Grok 3 Released",
    model: "Grok",
    date: "2025-02-17",
    version: "3.0",
    highlights: "Released with state-of-the-art reasoning capabilities, deep live search integration, and live access to X (Twitter) platform data."
  },
  {
    id: "timeline-4",
    name: "OpenAI o3-mini Launch",
    model: "GPT",
    date: "2025-01-31",
    version: "o3-mini",
    highlights: "A fast reasoning model designed for coding, math, and science. Supports function calling, structured outputs, and developer-adjustable reasoning effort."
  },
  {
    id: "timeline-5",
    name: "DeepSeek-R1 Reasoning Model",
    model: "DeepSeek",
    date: "2025-01-20",
    version: "R1",
    highlights: "Open-source reasoning model utilizing Reinforcement Learning (RL) with performance comparable to OpenAI's o1. Includes distilled models from Qwen and Llama."
  },
  {
    id: "timeline-6",
    name: "MiniMax abab7 Released",
    model: "MiniMax",
    date: "2025-01-15",
    version: "abab7-chat",
    highlights: "MiniMax's next-generation LLM featuring native multimodal reasoning, enhanced Chinese/English conversational logic, and long-context capabilities."
  },
  {
    id: "timeline-7",
    name: "DeepSeek-V3 Open-Source LLM",
    model: "DeepSeek",
    date: "2024-12-26",
    version: "V3",
    highlights: "Mixture-of-Experts (MoE) model with 671B parameters. State-of-the-art open-source performance at highly efficient training and inference cost."
  },
  {
    id: "timeline-8",
    name: "Gemini 2.0 Flash Announcement",
    model: "Gemini",
    date: "2024-12-11",
    version: "2.0 Flash",
    highlights: "Designed for agentic era with ultra-low latency, real-time audio/video streaming processing, and enhanced tool-use integrations."
  },
  {
    id: "timeline-9",
    name: "Mimo Chat-v1.0 Release",
    model: "Mimo",
    date: "2024-11-05",
    version: "Chat-v1.0",
    highlights: "A lightweight 3B parameter conversational model optimized for client-side web embedding, enabling offline-capable interactive chat UI."
  },
  {
    id: "timeline-10",
    name: "Kimi Explorer Launch",
    model: "Kimi",
    date: "2024-10-11",
    version: "Explorer-v1",
    highlights: "A search-oriented autonomous research assistant that can query hundreds of webpages to answer complex open-ended questions."
  },
  {
    id: "timeline-11",
    name: "Zhipu GLM-4-Plus Announcement",
    model: "GLM",
    date: "2024-08-20",
    version: "GLM-4-Plus",
    highlights: "Zhipu's flagship model update featuring significant boost in math, reasoning, code generation, and complex multi-turn alignment."
  },
  {
    id: "timeline-12",
    name: "Claude 3.5 Sonnet Release",
    model: "Claude",
    date: "2024-06-20",
    version: "3.5 Sonnet (v1)",
    highlights: "Sets industry benchmarks for graduate-level reasoning, undergraduate-level knowledge, and coding proficiency. Introduces Artifacts workspace feature."
  },
  {
    id: "timeline-13",
    name: "Gemini 1.5 Pro Release",
    model: "Gemini",
    date: "2024-05-14",
    version: "1.5 Pro",
    highlights: "Features a revolutionary native 2-million token context window, allowing users to upload hours of video, audio, or millions of lines of code."
  },
  {
    id: "timeline-14",
    name: "OpenAI GPT-4o Launch",
    model: "GPT",
    date: "2024-05-13",
    version: "GPT-4o",
    highlights: "OpenAI's flagship omni model, natively accepting and generating any combination of text, audio, and image, with twice the speed and half the cost of GPT-4 Turbo."
  },
  {
    id: "timeline-15",
    name: "Kimi Chat Upgraded to 2M Context",
    model: "Kimi",
    date: "2024-03-18",
    version: "Chat-v2M",
    highlights: "Moonshot AI upgrades Kimi Chat's context window to 2 million Chinese characters, enabling massive document uploads and long history retention."
  },
  {
    id: "timeline-16",
    name: "Zhipu GLM-4 Launch",
    model: "GLM",
    date: "2024-01-16",
    version: "GLM-4",
    highlights: "All-round performance boost close to GPT-4. Supports custom GLMs (Agents) and high-concurrency enterprise API integrations."
  }
];

function isPlaceholder(val?: string): boolean {
  if (!val) return true;
  const lower = val.toLowerCase().trim();
  return (
    lower === "" ||
    lower.includes("placeholder") ||
    lower.startsWith("your-") ||
    lower.startsWith("your_") ||
    lower === "todo"
  );
}

export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  try {
    const token = env.NOTION_TOKEN || process.env.NOTION_TOKEN;
    const dbId = env.NOTION_AINEWS_DB_ID || process.env.NOTION_AINEWS_DB_ID;

    if (!token || !dbId || isPlaceholder(token) || isPlaceholder(dbId)) {
      return MOCK_TIMELINE;
    }

    const pages = await queryDatabaseAll({
      databaseId: dbId,
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const entries: TimelineEntry[] = [];
    for (const page of pages) {
      const props = page.properties;
      const name = getPageTitle(page);
      const model = getSelect(props, "Model") || "";
      let date = getDate(props, "Date") || "";
      if (date.includes("T")) {
        date = date.split("T")[0]!;
      }
      const version = getRichText(props, "Version") || undefined;
      const highlights = getRichText(props, "Highlights") || undefined;

      // 读取 Notion 中的真实跑分字段（Number 类型）
      const mmlu      = getNumber(props, "Score_MMLU")      ?? undefined;
      const humaneval = getNumber(props, "Score_HumanEval") ?? undefined;
      const math      = getNumber(props, "Score_MATH")      ?? undefined;
      const mtbench   = getNumber(props, "Score_MTBench")   ?? undefined;
      const gpqa      = getNumber(props, "Score_GPQA")      ?? undefined;
      const source    = getRichText(props, "Benchmark_Source") ?? undefined;

      // 只有至少一个字段有值才挂载 benchmarks 对象
      const hasBenchmarks = [mmlu, humaneval, math, mtbench, gpqa].some(
        (v) => v !== undefined
      );

      entries.push({
        id: page.id,
        name,
        model,
        date,
        version,
        highlights,
        benchmarks: hasBenchmarks ? { mmlu, humaneval, math, mtbench, gpqa, source } : undefined,
      });
    }

    return entries;
  } catch (error) {
    console.error("Error fetching timeline entries from Notion:", error);
    return MOCK_TIMELINE;
  }
}

