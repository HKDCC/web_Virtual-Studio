/**
 * AI Model Changelog & Timeline reader — reads from Notion
 */

import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getPageTitle, getSelect, getDate, getRichText, getNumber } from "@/lib/notionHelpers";

export interface TimelineEntry {
  id: string;
  name: string;
  model: string;
  date: string;
  version?: string;
  highlights?: string;
  aaIntelligence?: number;
}

export const MOCK_TIMELINE: TimelineEntry[] = [
  {
    id: "timeline-2026-09-03-gpt",
    name: "GPT-6 Astra",
    model: "GPT",
    date: "2026-09-03",
    version: "GPT-6 Astra",
    highlights: "新一代全能旗舰：1.05M Context、128K 输出，定价 $10/$50（每百万输入/输出 Token）；主打 Computer Use、Coding、Research、专业工作与长程 Agent。",
    aaIntelligence: 66
  },
  {
    id: "timeline-2026-09-02-gemini-cyber",
    name: "Gemini 3.8 Flash Cyber",
    model: "Gemini",
    date: "2026-09-02",
    version: "3.8 Flash Cyber",
    highlights: "面向受信任防御方的特化网络安全版本：强化威胁建模、漏洞自动挖掘与红蓝对抗推演。"
  },
  {
    id: "timeline-2026-09-02-gemini",
    name: "Gemini 3.8 Flash",
    model: "Gemini",
    date: "2026-09-02",
    version: "3.8 Flash",
    highlights: "长程编程与 Autonomous Agents 专精：100 万 Context、64K 最大输出；限时促销价 $0.75/$3.75（每百万输入/输出 Token）。",
    aaIntelligence: 59
  },
  {
    id: "timeline-2026-09-02-qwen",
    name: "Qwen3.8-Max-0902",
    model: "Qwen",
    date: "2026-09-02",
    version: "Qwen3.8-Max-0902",
    highlights: "3.8 Max 增强快照：原生 100 万 Context；重点提升 Coding、长程 Agent、多工具协作与复杂视觉理解。"
  },
  {
    id: "timeline-2026-09-01-claude-mythos",
    name: "Claude Mythos 5.1",
    model: "Claude",
    date: "2026-09-01",
    version: "Mythos 5.1",
    highlights: "特化安全分支：与 Fable 5.1 同底模——但收紧网络访问权限并执行更严苛的安全沙箱策略。"
  },
  {
    id: "timeline-2026-09-01-claude-fable",
    name: "Claude Fable 5.1",
    model: "Claude",
    date: "2026-09-01",
    version: "Fable 5.1",
    highlights: "Claude 5.1 前沿分支：聚焦高阶复杂推理与代码任务，全面适配开放工具链与动态 Agent 工作流。",
    aaIntelligence: 66
  },
  {
    id: "timeline-2026-08-26-glm",
    name: "GLM-5.3-Flash",
    model: "GLM",
    date: "2026-08-26",
    version: "GLM-5.3-Flash (ox-alpha)",
    highlights: "匿名测试代号 \"ox-alpha\" 揭晓：320B 参数混合稀疏注意力 MoE 架构，支持 100 万 Context，MIT 协议开源商用。",
    aaIntelligence: 57
  },
  {
    name: "Qwen3.8-Flash-Next",
    model: "Qwen",
    date: "2026-08-26",
    id: "timeline-2026-08-26-qwen",
    version: "Qwen3.8-Flash-Next",
    highlights: "Qwen4 架构先行版：125B 参数（6B 激活）融合 QSA 微块稀疏注意力，原生 262k 扩展至 100 万 Context。"
  },
  {
    id: "timeline-2026-08-14-glm",
    name: "GLM-5.3",
    model: "GLM",
    date: "2026-08-14",
    version: "GLM-5.3",
    highlights: "智谱 AI 全新后训练 Scaling 旗舰：在 Terminal Bench 3.0 与复杂多智能体协同场景中实现关键突破。",
    aaIntelligence: 60
  },
  {
    id: "timeline-2026-08-13-gemini",
    name: "Gemini 3.7 Flash",
    model: "Gemini",
    date: "2026-08-13",
    version: "3.7 Flash",
    highlights: "Google 推出 Gemini 3.7 Flash：大幅提升编程 Agent 吞吐与长代码调试精度，实现生产级低时延深度推理。",
    aaIntelligence: 56
  },
  {
    id: "timeline-2026-08-13-deepseek",
    name: "DeepSeek-V4-Pro (build 0813)",
    model: "DeepSeek",
    date: "2026-08-13",
    version: "V4-Pro (0813)",
    highlights: "1.6T MoE 架构 GA 正式版：大幅跃升长程软件工程与高阶数学推理能力，同步引入峰谷动态阶梯计费。",
    aaIntelligence: 53
  },
  {
    id: "timeline-2026-08-12-grok",
    name: "Grok 4.6",
    model: "Grok",
    date: "2026-08-12",
    version: "Grok 4.6",
    highlights: "xAI 发布 Grok 4.6：新增 \"xhigh\" 极限思考档位，针对百万级上下文跨步 Agent 任务深度优化。",
    aaIntelligence: 61
  },
  {
    id: "timeline-2026-08-10-gpt",
    name: "GPT-5.6-Cyber",
    model: "GPT",
    date: "2026-08-10",
    version: "GPT-5.6-Cyber (Daybreak Red)",
    highlights: "OpenAI 首款专精网络安全防御与漏洞挖掘的特化模型：基于 Sol 架构，面向 Daybreak Red 计划受限开放。"
  },
  {
    id: "timeline-2026-08-03-qwen",
    name: "Qwen3.8-Max & Qwen3.8-27B",
    model: "Qwen",
    date: "2026-08-03",
    version: "Qwen3.8-Max / 27B",
    highlights: "阿里通义千问 3.8 旗舰：2.4T 参数 MoE 架构，27B 单卡可部署权重，强化长程 Agentic 复杂任务求解。",
    aaIntelligence: 58
  },
  {
    id: "timeline-2026-07-31-deepseek",
    name: "DeepSeek-V4-Flash (build 0731)",
    model: "DeepSeek",
    date: "2026-07-31",
    version: "V4-Flash (0731)",
    highlights: "284B 稀疏 MoE 架构（13B 激活），支持 100 万 Context，引入 DSpark 推测解码模块大幅提升推理吞吐。"
  },
  {
    id: "timeline-2026-07-24-claude",
    name: "Claude Opus 5",
    model: "Claude",
    date: "2026-07-24",
    version: "Claude Opus 5",
    highlights: "Claude 5 旗舰推理基座：支持 100 万 Context 与 128k 输出，引入会话中动态工具热插拔能力。",
    aaIntelligence: 63
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
      const aaIntelligence = getNumber(props, "AA_Intelligence") ?? undefined;

      entries.push({
        id: page.id,
        name,
        model,
        date,
        version,
        highlights,
        aaIntelligence,
      });
    }

    return entries.length > 0 ? entries : MOCK_TIMELINE;
  } catch (error) {
    console.error("Error fetching timeline entries from Notion:", error);
    return MOCK_TIMELINE;
  }
}

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

export async function getChangelogMonths(): Promise<ChangelogMonth[]> {
  return [];
}

