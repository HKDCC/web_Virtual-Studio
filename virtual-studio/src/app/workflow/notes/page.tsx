import Link from "next/link";
import { notionClient, listBlockChildrenAll } from "@/lib/notion";
import { getPageTitle, getDate } from "@/lib/notionHelpers";
import { NotionBlocks } from "@/components/NotionBlocks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface NoteDocItem {
  id: string;
  title: string;
  date: string;
  category: string;
  badge: string;
  isLive: boolean;
  excerpt: string;
  tags: string[];
}

const STATIC_NOTES: NoteDocItem[] = [
  {
    id: "e774b57f-e15a-83e7-b633-818781fe9a41",
    title: "AI agent如何在2天内从0到1产出出版社级别的译文？",
    date: "2026-07-19",
    category: "人工探索",
    badge: "实战复盘",
    isLive: true,
    excerpt: "全书英文原版 31,136 单词，两日内完成高品质出版级汉化与自动排版。详细拆解为什么初译选择 Gemini 3.5 Flash 100万 Token 原生大窗口、审校阶段为何引入 DeepSeek V4 Pro 专家模式挑错，以及 Agent 错题本自愈机制如何彻底替代传统表格翻译。",
    tags: ["大模型翻译", "Agent自愈", "Pandoc排版"],
  },
  {
    id: "placeholder-2",
    title: "三维力导向图谱在 Next.js 与 Cloudflare 边缘环境的渲染优化",
    date: "2026-08-15",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "探讨 WebGL 内存生命周期、动态 LOD 视锥体裁剪与 Serverless 边缘渲染的性能平衡策略。",
    tags: ["Three.js", "WebGL", "性能优化"],
  },
  {
    id: "placeholder-3",
    title: "基于 AST 与 Agent 错题本的自动化代码重构实践",
    date: "2026-08-10",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "解析大型 TypeScript 项目重构中的类型自愈、AST 语法树扫描与自动化单元回归校验方案。",
    tags: ["AST分析", "代码重构", "自动化测试"],
  },
  {
    id: "placeholder-4",
    title: "从零构建百万 Token 长上下文研读流水线",
    date: "2026-08-02",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "对比 Gemini 1M 与 Claude 3.7 在长文档结构抽取与专业术语召回率中的实战表现。",
    tags: ["长上下文", "信息抽取", "论文综述"],
  },
  {
    id: "placeholder-5",
    title: "AI 辅助技术文档排版：Pandoc 与 Word COM 自动化集成",
    date: "2026-07-28",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "探索从 Markdown 到专业出版物版式的全自动编译、样式注入与校验脚本闭环。",
    tags: ["Pandoc", "文档排版", "脚本自动化"],
  },
  {
    id: "placeholder-6",
    title: "生产力工作流的度数中心度与关联网络建模",
    date: "2026-07-22",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "如何通过图论算法量化高频工具的枢纽权重，并构建自适应工作流依赖网络。",
    tags: ["图论算法", "中心度", "网络建模"],
  },
  {
    id: "placeholder-7",
    title: "大模型意图拷问协议 /grill-me 的实战设计与推导",
    date: "2026-07-15",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "通过结构化双向对话消除需求模糊性与架构设计分歧的高效 prompt 工程范式。",
    tags: ["Prompt工程", "意图对齐", "需求分析"],
  },
  {
    id: "placeholder-8",
    title: "多模型协同纠错机制在学术本地化中的应用",
    date: "2026-07-08",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "设计双轨模型互审流水线与术语一致性校验的算法闭环，解决翻译幻觉问题。",
    tags: ["模型互审", "学术翻译", "一致性校验"],
  },
];

export default async function WorkflowNotesDocPage(props: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await props.searchParams;
  const currentId = id || STATIC_NOTES[0].id;

  // Find the selected note from the list
  const currentNote = STATIC_NOTES.find((n) => n.id === currentId) || STATIC_NOTES[0];

  // If it is a live Notion document, fetch its blocks
  let notionBlocks: Awaited<ReturnType<typeof listBlockChildrenAll>> = [];
  let liveTitle = currentNote.title;
  let liveDate = currentNote.date;

  const client = notionClient();
  if (currentNote.isLive && client) {
    try {
      const page = await client.pages.retrieve({ page_id: currentNote.id });
      if (page && "properties" in page) {
        liveTitle = getPageTitle(page) || currentNote.title;
        const propsObj = page.properties as unknown as Record<string, unknown>;
        liveDate = getDate(propsObj, "Date") || currentNote.date;
      }
      notionBlocks = await listBlockChildrenAll({ blockId: currentNote.id });
    } catch (err) {
      console.error("Failed to fetch Notion blocks for note:", currentNote.id, err);
    }
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 20px 80px" }}>
      {/* Top Breadcrumb & Back Action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink-2)", fontFamily: "var(--mono)" }}>
          <Link href="/" style={{ color: "var(--ink-2)", textDecoration: "none" }}>
            首页
          </Link>
          <span>/</span>
          <Link href="/workflow" style={{ color: "var(--ink-2)", textDecoration: "none" }}>
            工作流
          </Link>
          <span>/</span>
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>衍生笔记库</span>
        </div>

        <Link
          href="/workflow"
          style={{
            fontSize: "11.5px",
            fontFamily: "var(--mono)",
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          ← 返回工作流主页
        </Link>
      </div>

      {/* Main Feishu / Notion-Style Document Workspace (Sidebar + Reader) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "24px",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: "14px",
          overflow: "hidden",
          minHeight: "75vh",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        {/* Left Sidebar: Document Tree */}
        <aside
          style={{
            borderRight: "1px solid var(--line)",
            background: "var(--paper)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "10px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>
                DOCUMENTS
              </span>
              <span style={{ fontSize: "9.5px", fontFamily: "var(--mono)", padding: "1px 5px", borderRadius: "3px", background: "var(--line)", color: "var(--ink-2)" }}>
                分类: 人工探索
              </span>
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              衍生笔记目录
            </h3>
          </div>

          {/* Doc Item List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", maxHeight: "calc(75vh - 80px)" }}>
            {STATIC_NOTES.map((doc, idx) => {
              const isSelected = doc.id === currentNote.id;

              return (
                <Link
                  key={doc.id}
                  href={`/workflow/notes?id=${doc.id}`}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: isSelected ? "var(--card)" : "transparent",
                    border: `1px solid ${isSelected ? "var(--accent)" : "transparent"}`,
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "9px", fontFamily: "var(--mono)", color: isSelected ? "var(--accent)" : "var(--ink-3)" }}>
                      #{String(idx + 1).padStart(2, "0")} · {doc.date}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontFamily: "var(--mono)",
                        padding: "1px 5px",
                        borderRadius: "3px",
                        background: doc.isLive ? "var(--accent-soft)" : "var(--line)",
                        color: doc.isLive ? "var(--accent)" : "var(--ink-3)",
                        fontWeight: 600,
                      }}
                    >
                      {doc.badge}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "var(--ink)" : "var(--ink-2)",
                      lineHeight: 1.4,
                    }}
                  >
                    {doc.title}
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Right Reader Area */}
        <main style={{ padding: "28px 36px", overflowY: "auto", maxHeight: "82vh" }}>
          {/* Document Header */}
          <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "20px", marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", padding: "2px 8px", borderRadius: "4px", background: "var(--accent)", color: "#ffffff", fontWeight: 700 }}>
                {currentNote.category}
              </span>
              <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                {liveDate}
              </span>
              <span style={{ fontSize: "11px", color: "var(--ink-3)" }}>·</span>
              <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                Notion 知识库同步
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontFamily: "var(--serif)", fontWeight: 900, color: "var(--ink)", margin: 0, lineHeight: 1.35 }}>
              {liveTitle}
            </h1>

            <p style={{ fontSize: "13.5px", color: "var(--ink-2)", margin: "12px 0 0", lineHeight: 1.6, background: "var(--paper)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--line)" }}>
              {currentNote.excerpt}
            </p>
          </div>

          {/* Document Content Rendering */}
          {currentNote.isLive ? (
            <div>
              {notionBlocks.length > 0 ? (
                <div style={{ fontSize: "14.5px", lineHeight: 1.8, color: "var(--ink)" }}>
                  <NotionBlocks blocks={notionBlocks} />
                </div>
              ) : (
                <div style={{ padding: "30px 0", color: "var(--ink-2)" }}>
                  <p>文档正文正在同步或加载中，请稍候……</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: "20px 0" }}>
              <div
                style={{
                  background: "var(--paper)",
                  border: "1px dashed var(--line)",
                  borderRadius: "10px",
                  padding: "24px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700, marginBottom: "6px" }}>
                  DOCUMENT DRAFT · 规划中文档
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", margin: "0 0 8px" }}>
                  本文档隶属于【人工探索】分类，正在整理沉淀中
                </h3>
                <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
                  该主题的工作流实践已完成验证，详细复盘文章与架构错题本正由智能体与人工共同整理，后续将自动同步至本知识库。
                </p>
              </div>

              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {currentNote.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "11px",
                      fontFamily: "var(--mono)",
                      padding: "3px 10px",
                      borderRadius: "4px",
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      color: "var(--ink-2)",
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
