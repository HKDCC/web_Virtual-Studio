import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getMultiSelect, getPageTitle, getRichText, getSelect, getUrl, getCoverUrl, getIcon } from "@/lib/notionHelpers";
import { RetroWorkflowLayout } from "@/components/retro/RetroWorkflowLayout";

function toSection(v: string | null): "prompts" | "tools" {
  const s = (v ?? "").toLowerCase().trim();
  if (s === "prompts" || s === "prompt" || s.includes("提示") || s.includes("工作流") || s.includes("workflow")) return "prompts";
  return "tools";
}

const DEMO_WORKFLOW = `flowchart TD
    %% 样式表定义
    classDef init fill:#FFF9E6,stroke:#F2C94C,stroke-width:2px,color:#333;
    classDef action fill:#F9EBEA,stroke:#CD6155,stroke-width:2px,color:#333;
    classDef process fill:#EBF5FB,stroke:#2980B9,stroke-width:2px,color:#333;
    classDef memory fill:#EAF2F8,stroke:#27AE60,stroke-width:2px,color:#333;
    classDef check fill:#FDF2E9,stroke:#D35400,stroke-width:2px,color:#333;
    classDef output fill:#F5EEF8,stroke:#8E44AD,stroke-width:2px,color:#333;

    subgraph Phase1 ["第一阶段：前置清洗与意图对齐"]
        direction TB
        A(["PDF导入Antigravity"]) ---> Cleaning["Python 脚本正则去噪"]
        Cleaning ---> A2["脱水 Markdown 章节"]
        A2 ---> B["执行 /grill-me 拷问模式"]
        B ---> C["AI 发起几轮深度交互问答"]
        C ---> D{"锁定初始术语字典 (Glossary)<br>并确认全局文风调性"}
    end

    subgraph Phase2 ["第二阶段：人机双轨迭代与习惯固化 (核心)"]
        direction TB
        E["Gemini 3.5 Flash (初译层)<br>大上下文确保文风前后连贯"]
        E ---> Translation["输出章节初译稿"]
        Translation ---> F["DeepSeek 网页端专家模式 (审校层)<br>双引擎协作挑错与高水平润色"]
        F ---> Feedback["整理精润与调优反馈"]
        Feedback ---> G["AGENTS.md: 固化翻译习惯<br>walkthrough.md: 错题本自愈"]
        G ---> Loop["滚动翻译下一章节"]
        Loop ---> E
    end

    subgraph Phase3 ["第三阶段：算法排版与校验自愈"]
        direction TB
        H["执行自动化编译排版脚本"]
        H ---> I1["EPUB 电子书打包 (Pandoc)"]
        H ---> I2["PDF 排版导出 (Word COM 驱动)"]
        I1 ---> J{"verify.py 自动校验页数与格式"}
        I2 ---> J
        J --->|校验失败| Debug["查阅 walkthrough 错题本并修正"]
        Debug ---> H
        J --->|校验通过| K(["交付文件 (pdf, epub)"])
    end

    %% 连接三个阶段的主线
    D ===> E
    G ===>|全书翻译完成| H
    G -.->|动态微调术语| D

    %% 应用样式
    class A,A2,B,C,D init;
    class Cleaning,Translation,Feedback,Loop action;
    class E process;
    class F process;
    class G memory;
    class H,I1,I2,J,Debug check;
    class K output;
`;

export default async function RetroWorkflowPage() {
  const db = env.NOTION_WORKFLOW_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <div className="retro-chapter"><h1 style={{color: 'var(--rust)'}}>SYS_ERR: MISSING ENV VARS</h1></div>;
  let items: Array<{ id: string; properties: unknown; cover?: unknown; icon?: unknown; [key: string]: unknown }> = [];
  try {
    items = await queryDatabaseAll({ databaseId: db, pageSize: 50, maxPages: 10 });
  } catch (err) {
    console.error("[RetroWorkflowPage] Failed to fetch Notion data (network error or timeout). Falling back to local demo data.", err);
  }

  const prompts = [];
  const tools = [];

  for (const p of items) {
    const props = p.properties as unknown as Record<string, unknown>;
    const rawSec = getSelect(props, "Section") || getSelect(props, "Type") || getSelect(props, "Category");
    const section = toSection(rawSec);

    const title = getPageTitle(p as { properties: Record<string, unknown> });
    const desc = getRichText(props, "Description");
    const tags = getMultiSelect(props, "Tags");
    const url = getUrl(props, "SiteURL") || getUrl(props, "URL");
    const coverUrl = getCoverUrl(p as { cover?: unknown; properties?: Record<string, unknown> });
    const icon = getIcon(p as { icon?: unknown });

    const obj = {
      id: p.id,
      title,
      desc,
      tags,
      url,
      coverUrl,
      icon
    };

    if (section === "prompts") {
      prompts.push(obj);
    } else {
      tools.push(obj);
    }
  }

  // Inject user's demo workflow if not present in db
  const demoId = "demo-translation-workflow";
  if (!prompts.find(p => p.title === "AI 书籍本地化翻译工作流")) {
    prompts.unshift({
      id: demoId,
      title: "AI 书籍本地化翻译工作流",
      desc: DEMO_WORKFLOW,
      tags: ["Translation", "AI", "Pipeline"],
      url: null,
      coverUrl: null,
      icon: "📚"
    });
  }

  // Inject a mock DeepSeek tool to test interactivity if missing
  if (!tools.find(t => t.title && t.title.includes("DeepSeek"))) {
    tools.push({
      id: "demo-deepseek-tool",
      title: "DeepSeek 网页端专家模式",
      desc: "深度思考的 AI 模型网页端，用于双引擎审校与高水平润色。",
      tags: ["AI", "LLM", "Proofreading"],
      url: "https://chat.deepseek.com",
      coverUrl: null,
      icon: "🐳"
    });
  }

  return <RetroWorkflowLayout prompts={prompts} tools={tools} />;
}
