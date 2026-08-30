import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = "3254b57fe15a803cac61d97a5b1cfc4d";

const newTools = [
  {
    title: "Google Antigravity",
    section: "Tools",
    badge: "核心",
    description: "Google DeepMind Agentic AI 结对编程与智能体系统，支持自主工作区、多智能体协同与自动化执行。",
    siteUrl: "https://deepmind.google/technologies/antigravity/",
    rating: 5,
  },
  {
    title: "Gemini 3.5 Flash",
    section: "Models",
    badge: "核心",
    description: "Google 旗舰级超长上下文大模型，100 万 Token 原生大窗口，长文档召回率与初译连贯性表现卓越。",
    siteUrl: "https://aistudio.google.com/",
    rating: 5,
  },
  {
    title: "DeepSeek V4 Pro",
    section: "Models",
    badge: "在用",
    description: "DeepSeek 专家级大模型，多范围上下文检索 (MRCR) 准确率达 85%，擅长审校挑错、逻辑对齐与高阶商业润色。",
    siteUrl: "https://www.deepseek.com/",
    rating: 5,
  },
  {
    title: "Pandoc",
    section: "Tools",
    badge: "算法",
    description: "通用标记语言转换编译器，支持将 Markdown 自动化编译为出版级 Word DOCX、EPUB 与 PDF 排版。",
    siteUrl: "https://pandoc.org/",
    rating: 5,
  },
  {
    title: "Python 正则清洗脚本",
    section: "Tools",
    badge: "算法",
    description: "用于电子书与原版 PDF 文本脱水去噪的自动化处理脚本，清洗页眉页脚、扫描残渣与不规则换行。",
    siteUrl: "https://www.python.org/",
    rating: 5,
  },
  {
    title: "verify.py 校验脚本",
    section: "Tools",
    badge: "规范",
    description: "全书术语一致性、排版格式规范与错词自动回归质检脚本，确保出版级交付合规。",
    siteUrl: "https://www.python.org/",
    rating: 5,
  },
  {
    title: "/grill-me 意图拷问",
    section: "Prompts",
    badge: "规范",
    description: "通过结构化双向深度交互消除需求模糊性、锁定《本地化三大法则》与术语对齐的 Prompt 模式。",
    promptZh: "你是一位严谨的本土化主编与技术架构师。在开始翻译或重构前，向我发起多轮结构化提问（每次1-2个核心问题），彻底明确文风、核心术语表、目标受众与边界条件，直到达成绝对共识。",
    rating: 5,
  },
  {
    title: "本地化三大法则",
    section: "Prompts",
    badge: "规范",
    description: "极致精简（剪除多余助词）、用标点焊接逻辑（冒号/破折号/分号）、商业博弈与实战质感（角色化/心智动词）。",
    rating: 5,
  },
  {
    title: "walkthrough 错题本",
    section: "Prompts",
    badge: "核心",
    description: "智能体工作流自愈机制的核心载体，沉淀踩坑记录、句式重构规则与自愈反馈闭环。",
    rating: 5,
  }
];

async function run() {
  const existing = await notion.databases.query({ database_id: DB_ID });
  const existingTitles = new Set(
    existing.results.map(r => r.properties.Title?.title?.[0]?.plain_text).filter(Boolean)
  );

  console.log("Current existing titles in DB:", existingTitles.size);

  for (const tool of newTools) {
    if (existingTitles.has(tool.title)) {
      console.log(`[SKIP] Already exists: ${tool.title}`);
      continue;
    }

    const properties = {
      Title: {
        title: [{ text: { content: tool.title } }]
      },
      Section: {
        select: { name: tool.section }
      },
      Status: {
        select: { name: "Published" }
      },
      Description: {
        rich_text: [{ text: { content: tool.description } }]
      },
      Rating: {
        number: tool.rating
      }
    };

    if (tool.badge) {
      properties.Badge = { select: { name: tool.badge } };
    }
    if (tool.siteUrl) {
      properties.SiteURL = { url: tool.siteUrl };
    }
    if (tool.promptZh) {
      properties.PromptZH = { rich_text: [{ text: { content: tool.promptZh } }] };
    }

    try {
      const created = await notion.pages.create({
        parent: { database_id: DB_ID },
        properties
      });
      console.log(`[CREATED] ${tool.title} (${created.id})`);
    } catch (err) {
      console.error(`[ERROR] Failed to create ${tool.title}:`, err.message);
    }
  }

  console.log("All items successfully processed!");
}

run();
