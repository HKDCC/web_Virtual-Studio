import Link from "next/link";
import { queryDatabaseAll } from "@/lib/notion";
import { env, requireEnv } from "@/lib/env";
import { SiteFooter } from "@/components/SiteFooter";

async function safeCount(databaseIdEnv: Parameters<typeof requireEnv>[0]) {
  try {
    const id = requireEnv(databaseIdEnv);
    const pages = await queryDatabaseAll({ databaseId: id, pageSize: 50, maxPages: 2 });
    return pages.length;
  } catch {
    return null;
  }
}

async function safeCountNews() {
  try {
    if (!env.NOTION_AINEWS_DB_ID) return null;
    const pages = await queryDatabaseAll({ databaseId: env.NOTION_AINEWS_DB_ID, pageSize: 50, maxPages: 2 });
    return pages.length;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const books = await safeCount("NOTION_BOOKS_DB_ID");
  const notes = await safeCount("NOTION_NOTES_DB_ID");
  const newsCount = await safeCountNews();

  return (
    <>
      <div className="home-hero">
        <p className="home-eyebrow">Virtual Studio · v0.1</p>
        <h1 className="home-title">
          我们所有疯狂的行动，
          <br />
          最终目的或许只是<em>体验更多的奇妙</em>
        </h1>
        <p className="home-sub">
          这里记录生产力探索、自我成长、AI 实践，以及那些值得收藏的生活细节。每一个模块都是一种思维方式的入口。
        </p>
      </div>

      <div className="module-grid">
        <Link className="module-card wide" href="/archive">
          <span className="mc-tag">Archive · 输入层</span>
          <h2 className="mc-title">库</h2>
          <p className="mc-desc">
            电子书架与读书笔记。收藏是一种姿态，整理是一种思考。技术书与文学之间，存在比想象中更多的共通语法。
          </p>
          <span className="mc-count">{books ?? "—"}</span>
        </Link>

        <Link className="module-card" href="/news">
          <span className="mc-emoji">📡</span>
          <span className="mc-tag">Daily · 输入层</span>
          <h2 className="mc-title">AI 日报</h2>
          <p className="mc-desc">每日采集 AI 行业新闻，自动同步到 Notion。</p>
          <span className="mc-count">{newsCount ?? "—"}</span>
        </Link>

        <Link className="module-card" href="/lab">
          <span className="mc-emoji">⚗️</span>
          <span className="mc-tag">Lab · 输出层</span>
          <h2 className="mc-title">实验室</h2>
          <p className="mc-desc">AI 部署实践与 Vibe Coding 成果展示。</p>
        </Link>

        <Link className="module-card" href="/workflow">
          <span className="mc-emoji">⚙️</span>
          <span className="mc-tag">Workflow · 效率层</span>
          <h2 className="mc-title">工作流</h2>
          <p className="mc-desc">效率工具推荐、网站收藏、装备清单与 AI 提示词库。</p>
        </Link>

        <Link className="module-card" href="/pause">
          <span className="mc-emoji">🌿</span>
          <span className="mc-tag">Pause · 生活层</span>
          <h2 className="mc-title">隙</h2>
          <p className="mc-desc">想要一个 Happy End。</p>
        </Link>

        <Link className="module-card" href="/changelog">
          <span className="mc-emoji">📋</span>
          <span className="mc-tag">Change Log</span>
          <h2 className="mc-title">足迹</h2>
          <p className="mc-desc">这个虚拟空间的迭代记录。</p>
        </Link>

        <Link className="module-card" href="/archive?tab=notes">
          <span className="mc-emoji">🗒️</span>
          <span className="mc-tag">Notes</span>
          <h2 className="mc-title">笔记</h2>
          <p className="mc-desc">来自 Notion 数据库的文章与片段。</p>
          <span className="mc-count">{notes ?? "—"}</span>
        </Link>
      </div>

      <SiteFooter />
    </>
  );
}

