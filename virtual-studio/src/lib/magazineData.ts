import { queryDatabaseAll } from "./notion";
import { env } from "./env";
import {
  getPageTitle,
  getRichText,
  getSelect,
  getMultiSelect,
  getDate,
  getUrl,
  getNumber,
} from "./notionHelpers";
import { getTimelineEntries } from "./changelog";

export interface BookItem {
  id?: string;
  t: string;
  a: string;
  c: string;
  tags?: string[];
  coverUrl?: string | null;
  rating?: number | null;
  tagline?: string | null;
  downloadUrl?: string | null;
}

export interface LabItem {
  id?: string;
  tag: string;
  t: string;
  d: string;
  links: [string, string][];
  iconUrl?: string | null;
}

export interface FlowStep {
  role: string;
  t: string;
  d: string;
}

export interface ToolItem {
  t: string;
  s: string;
  d: string;
  url: string;
}

export interface SiteItem {
  t: string;
  url: string;
  d: string;
  r: string;
}

export interface PromptItem {
  t: string;
  body: string;
}

export interface TimelineItem {
  d: string;
  t: string;
  note: string;
}

export interface PauseItem {
  id?: string;
  d: string;
  loc: string;
  t: string;
  img: string;
}

export interface NoteItem {
  id?: string;
  d: string;
  title: string;
  cat: string;
  src?: string;
  tags?: string[];
  readTime?: number | null;
  htmlContent?: string | null;
  text: string;
}

export interface LogItem {
  id?: string;
  d: string;
  t: string;
  desc?: string;
  type?: string;
}

export const FALLBACK_SITE_DATA = {
  books: [
    { t: "On Writing Well", a: "William K. Zinsser", c: "工具", rating: 5 },
    { t: "游戏剧本怎么写：游戏编剧新手的入门指南", a: "佐佐木智广", c: "工具", rating: 4.5 },
    { t: "世界观（Worldviews）", a: "Richard DeWitt", c: "科普", rating: 5 },
    { t: "活出意义来（Man's Search for Meaning）", a: "Viktor E. Frankl", c: "文学", rating: 5 },
    { t: "所有我们看不见的光（All the Light We Cannot See）", a: "Anthony Doerr", c: "小说", rating: 4.8 },
    { t: "译道探微", a: "思果", c: "语言学", rating: 4.5 },
    { t: "打造第二大脑（Building a Second Brain）", a: "Tiago Forte", c: "设计", rating: 4.5 },
    { t: "制作进行：一本书让你彻底了解动画制作", a: "舛本和也", c: "工具", rating: 4.5 },
    { t: "金钱心理学（The Psychology of Money）", a: "Morgan Housel", c: "工具", rating: 4.8 },
    { t: "被讨厌的勇气", a: "岸见一郎 古贺史健", c: "成长", rating: 5 },
    { t: "风格的要素（The Elements of Style）", a: "William Strunk", c: "语言学", rating: 4.8 },
    { t: "克拉拉与太阳（Klara and the Sun）", a: "Kazuo Ishiguro", c: "小说", rating: 4.7 },
    { t: "四千周（Four Thousand Weeks）", a: "Oliver Burkeman", c: "成长", rating: 4.6 },
    { t: "中式英语之鉴", a: "平卡姆", c: "语言学", rating: 4.7 },
    { t: "点子就要秀出来（Show Your Work!）", a: "Austin Kleon", c: "设计", rating: 4.5 },
    { t: "原子习惯（Atomic Habits）", a: "James Clear", c: "成长", rating: 5 },
    { t: "强势谈判（Never Split the Difference）", a: "Chris Voss", c: "工具", rating: 4.8 },
    { t: "翻译研究方法概论", a: "穆雷", c: "语言学", rating: 4.5 },
  ] as BookItem[],

  lab: [
    {
      tag: "AI 实践",
      t: "SwiftMemo",
      d: "一款 MUJI 无印良品风格的桌面便签应用，专为捕捉日常碎想法而设计。",
      links: [["GitHub", "https://github.com/HKDCC/swift-memo"], ["Demo", "https://github.com/HKDCC/swift-memo/releases"]],
    },
    {
      tag: "AI 实践",
      t: "CassetteCutter",
      d: "专为解决大文件视频传输难题而设计的桌面工具。",
      links: [["查看详情", "#lab"]],
    },
    {
      tag: "Vibe Coding",
      t: "Retro Pixel Snake",
      d: "磁带未来主义 + 复古像素风贪吃蛇小游戏。Claude + Antigravity。",
      links: [["GitHub", "https://github.com/HKDCC/snake-game"], ["Demo", "https://github.com/HKDCC/snake-game/releases"]],
    },
    {
      tag: "AI 实践",
      t: "ClaudeCode 新手安装教程",
      d: "还有更简单的方法：遇到困难，直接问 AI。",
      links: [["查看详情", "#notes"]],
    },
    {
      tag: "AI 实践",
      t: "OpenClaw 新手部署教程",
      d: "同样有更简单的方法：遇到困难，直接问 AI。",
      links: [["查看详情", "#notes"]],
    },
    {
      tag: "AI 实践",
      t: "MuseTodo Pink",
      d: "粉粉的 Todolist，给待办清单一点情绪价值。",
      links: [["查看详情", "#notes"]],
    },
    {
      tag: "Vibe Coding",
      t: "Virtual Studio",
      d: "基于 Next.js + Notion 的极简主义个人网站。",
      links: [["GitHub", "https://github.com/HKDCC/web_Virtual-Studio"], ["Demo", "#"]],
    },
  ] as LabItem[],

  flow: [
    { role: "输入数据", t: "arXiv 订阅源", d: "定时推送获取最新的 AI 领域科研论文的 PDF 链接列表。" },
    { role: "外部工具", t: "Firecrawl 抓取", d: "将输入的 PDF 二进制流解析并过滤为 Markdown 纯文本。" },
    { role: "AI 模型", t: "Gemini 1.5 Pro", d: "利用 2M 超长上下文，一口气精读全文并提炼核心大纲。" },
    { role: "提示词", t: "学术翻译模板", d: "按信达雅标准，对提取出的论文大纲进行润色。" },
    { role: "AI 模型", t: "Claude 3.7 Sonnet", d: "对翻译后的大纲进行逻辑重组与学术相关性打分筛选。" },
    { role: "输出终点", t: "Notion 知识库", d: "将最终渲染的论文综述表格自动写入团队知识库。" },
  ] as FlowStep[],

  tools: [
    { t: "Claude", s: "核心", d: "近乎人类编程直觉与专业长文档的极致精度。", url: "https://claude.ai" },
    { t: "NotebookLM", s: "在用", d: "把一切资料变成精准问答库和双人对谈播客。", url: "https://notebooklm.google.com" },
    { t: "Notion", s: "核心", d: "本站的内容中枢：笔记、数据库与发布一体。", url: "https://notion.so" },
  ] as ToolItem[],

  sites: [
    { t: "pixian.ai", url: "pixian.ai", d: "抠图网站，每天免费额度，免注册登录。", r: "5.0" },
    { t: "Anna's Archive", url: "annas-archive.gl", d: "超大型电子书 / 漫画镜像库。", r: "4.7" },
    { t: "LibGen", url: "libgen.im", d: "最全英文电子书网站之一。", r: "4.5" },
    { t: "阿虚同学的储物间", url: "axutongxue.com", d: "啥资源都有一点。", r: "4.5" },
  ] as SiteItem[],

  prompts: [
    {
      t: "设计手账模板",
      body: "请把以下素材整理成一页 A5 手账风格的 HTML：\n1. 主标题用衬线字体，右上角放日期章\n2. 内容分 3 个便签块，米白纸纹背景\n3. 输出单个 html 文件，手机可读\n\n素材：{{粘贴内容}}",
    },
    {
      t: "设计读书笔记 HTML",
      body: "请将下面的读书笔记渲染为一张可分享的 HTML 卡片：\n1. 顶部书名 + 作者，中部金句引用块\n2. 底部三条「一句话收获」\n3. 配色克制，最多两种颜色\n\n笔记：{{粘贴内容}}",
    },
  ] as PromptItem[],

  timeline: [
    { d: "2026·07", t: "Gemini 3.6 Flash / 3.5 Flash-Lite", note: "降低推理成本，提高速度" },
    { d: "2026·07", t: "Qwen3.8-Max", note: "面向前沿推理和Agent竞争" },
    { d: "2026·07", t: "Kimi K3", note: "2.8T参数级开放权重模型，百万token上下文" },
    { d: "2026·07", t: "GPT-5.6正式版", note: "OpenAI新旗舰代际更新" },
    { d: "2026·07", t: "Grok 4.5", note: "强化代码、Agent、知识任务" },
    { d: "2026·06", t: "Claude Sonnet 5", note: "Claude 5系列中端主力，成本/性能平衡" },
  ] as TimelineItem[],

  pause: [
    { d: "2024·08·17", loc: "上海", t: "原神 fes 2024", img: "https://picsum.photos/seed/tl-1/640/480" },
    { d: "2023·12·29", loc: "杭州", t: "闲逛", img: "https://picsum.photos/seed/tl-2/640/480" },
    { d: "2024·03·29", loc: "上海", t: "徐汇滨江", img: "https://picsum.photos/seed/tl-3/640/480" },
    { d: "2022·07·12", loc: "萍乡", t: "武功山", img: "https://picsum.photos/seed/tl-4/640/480" },
    { d: "2023·08·11", loc: "上海", t: "原神 Fes 2023", img: "https://picsum.photos/seed/tl-5/640/480" },
    { d: "2022·02·26", loc: "上海", t: "田子坊闲逛", img: "https://picsum.photos/seed/tl-6/640/480" },
    { d: "2021·10·30", loc: "上海", t: "上理大草坪", img: "https://picsum.photos/seed/tl-7/640/480" },
    { d: "2023·04·11", loc: "上海", t: "迪士尼 TB", img: "https://picsum.photos/seed/tl-8/640/480" },
  ] as PauseItem[],

  notes: [
    {
      id: "32a4b57f-e15a-8021-aa4b-e86161596601",
      title: "【AI应用】AI 编程产品全景地图",
      cat: "信息",
      d: "2026·03·08",
      tags: ["AI", "教程"],
      readTime: 15,
      text: "一个实用的入门路径：从 GitHub Copilot 免费版开始，感受 AI 辅助编程的基本体验（零成本）。如果觉得有价值，再升级到 Cursor Pro（$20/月），体验多文件 Agent 工作流。处理大型项目时，考虑叠加 Claude Code（可与 Claude.ai Pro 共用订阅）。",
      htmlContent: "https://quaxstudio.xyz/articles/ai-coding-tools.html",
      src: "信息 · 【AI应用】AI 编程产品全景地图",
    },
    {
      id: "3294b57f-e15a-8069-ad16-c6c24a0621c6",
      title: "【AI应用】Notion+AI：第二大脑自动化搭建指南",
      cat: "思考",
      d: "2026·03·19",
      tags: ["AI", "教程"],
      readTime: 20,
      text: "用 CODE 四阶段原则，搭一套真正能用的 Notion + AI 第二大脑系统——从”为什么要这么做”，到”每一步怎么操作”。",
      htmlContent: null,
      src: "思考 · 【AI应用】Notion+AI：第二大脑自动化搭建指南",
    },
  ] as NoteItem[],

  log: [
    {
      d: "05·25",
      t: "AI日报功能下线，全球知名模型型号更迭记录、工作流节点展示上线~",
      desc: "MiniMax M2.7即将下岗，Gemini 3.5 Flash辅助功能和前端重构！",
      type: "Content",
    },
    {
      d: "03·20",
      t: "AI日报功能上线~",
      desc: "日报模块100%由MiniMaxM2.7-powered AI Agent芙宁娜大人负责！",
      type: "Content",
    },
    {
      d: "03·19",
      t: "库功能基本实现了~",
      desc: "增加了黑暗模式；修复了彩蛋触发条件！",
      type: "Feature",
    },
    {
      d: "03·18",
      t: "照片墙功能正常了~",
      desc: "折腾了几个小时后，我对AI说：我们还是用第一版吧！",
      type: "Feature",
    },
    {
      d: "03·17",
      t: "12小时网站速成，上线大吉~",
      desc: "又活了一天，很了不起了！",
      type: "Feature",
    },
  ] as LogItem[],
};

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function extractFileUrl(pageObj: { cover?: unknown; properties?: Record<string, unknown> }, propName = "Cover"): string | null {
  // 1. Check properties[propName]
  if (pageObj.properties && pageObj.properties[propName]) {
    const p = pageObj.properties[propName] as Record<string, unknown>;
    if (p.type === "files" && Array.isArray(p.files) && p.files.length > 0) {
      const f = p.files[0] as Record<string, unknown>;
      if (f.type === "file" && isObj(f.file) && typeof f.file.url === "string") {
        return f.file.url;
      }
      if (f.type === "external" && isObj(f.external) && typeof f.external.url === "string") {
        return f.external.url;
      }
    }
  }

  // 2. Check native page.cover
  if (isObj(pageObj.cover)) {
    const cov = pageObj.cover as Record<string, unknown>;
    if (cov.type === "file" && isObj(cov.file) && typeof cov.file.url === "string") {
      return cov.file.url;
    }
    if (cov.type === "external" && isObj(cov.external) && typeof cov.external.url === "string") {
      return cov.external.url;
    }
  }

  return null;
}

export async function fetchMagazineData() {
  let books = FALLBACK_SITE_DATA.books;
  let lab = FALLBACK_SITE_DATA.lab;
  const flow = FALLBACK_SITE_DATA.flow;
  let tools = FALLBACK_SITE_DATA.tools;
  let sites = FALLBACK_SITE_DATA.sites;
  let prompts = FALLBACK_SITE_DATA.prompts;
  let timeline = FALLBACK_SITE_DATA.timeline;
  let pause = FALLBACK_SITE_DATA.pause;
  let notes = FALLBACK_SITE_DATA.notes;
  let log = FALLBACK_SITE_DATA.log;

  // 1. Books
  try {
    if (env.NOTION_TOKEN && env.NOTION_BOOKS_DB_ID) {
      const res = await queryDatabaseAll({ databaseId: env.NOTION_BOOKS_DB_ID, pageSize: 50, maxPages: 4 });
      if (res.length > 0) {
        books = res.map((p) => {
          const props = p.properties as Record<string, unknown>;
          const tags = getMultiSelect(props, "Tags");
          const category = getSelect(props, "Category") || (tags.length > 0 ? tags[0] : "工具");
          const coverUrl = extractFileUrl(p, "Cover");
          const rating = getNumber(props, "MyRating");
          const tagline = getRichText(props, "Tagline");
          const downloadUrl = getUrl(props, "DownloadURL");

          return {
            id: p.id,
            t: getPageTitle(p),
            a: getRichText(props, "Author") || "未知作者",
            c: category,
            tags,
            coverUrl,
            rating,
            tagline,
            downloadUrl,
          };
        });
      }
    }
  } catch (e) {
    console.warn("Using fallback books data:", e);
  }

  // 2. Lab
  try {
    if (env.NOTION_TOKEN && env.NOTION_LAB_DB_ID) {
      const res = await queryDatabaseAll({ databaseId: env.NOTION_LAB_DB_ID, pageSize: 50, maxPages: 6 });
      if (res.length > 0) {
        lab = res.map((p) => {
          const props = p.properties as Record<string, unknown>;
          const type = (getSelect(props, "Type") ?? "").toLowerCase();
          const tag = type.includes("vibe") ? "Vibe Coding" : "AI 实践";
          const gh = getUrl(props, "GitHubURL");
          const dm = getUrl(props, "DemoURL");
          const links: [string, string][] = [];
          if (gh) links.push(["GitHub", gh]);
          if (dm) links.push(["Demo", dm]);
          links.push(["查看详情", `/p/${p.id}`]);
          return {
            id: p.id,
            tag: getRichText(props, "Badge") || tag,
            t: getPageTitle(p),
            d: getRichText(props, "Description") || "",
            links,
            iconUrl: extractFileUrl(p, "Icon"),
          };
        });
      }
    }
  } catch (e) {
    console.warn("Using fallback lab data:", e);
  }

  // 3. Workflow (Tools, Sites, Prompts)
  try {
    if (env.NOTION_TOKEN && env.NOTION_WORKFLOW_DB_ID) {
      const res = await queryDatabaseAll({ databaseId: env.NOTION_WORKFLOW_DB_ID, pageSize: 50, maxPages: 10 });
      if (res.length > 0) {
        const fetchedTools: ToolItem[] = [];
        const fetchedSites: SiteItem[] = [];
        const fetchedPrompts: PromptItem[] = [];

        res.forEach((p) => {
          const props = p.properties as Record<string, unknown>;
          const sec = (getSelect(props, "Section") ?? "").toLowerCase();
          const title = getPageTitle(p);
          const desc = getRichText(props, "Description") ?? "";
          const badge = getSelect(props, "Badge") ?? "在用";
          const siteUrl = getUrl(props, "SiteURL") ?? "#";
          const ratingRaw = props["Rating"];
          const rating =
            isObj(ratingRaw) && ratingRaw["type"] === "number" && typeof ratingRaw["number"] === "number"
              ? ratingRaw["number"].toFixed(1)
              : "5.0";
          const promptZh = getRichText(props, "PromptZH") ?? "";
          const promptEn = getRichText(props, "PromptEN") ?? "";

          if (sec.includes("tool") || sec.includes("工具")) {
            fetchedTools.push({ t: title, s: badge, d: desc, url: siteUrl });
          } else if (sec.includes("site") || sec.includes("网站") || sec.includes("websites")) {
            fetchedSites.push({ t: title, url: siteUrl.replace(/^https?:\/\//, ""), d: desc, r: rating });
          } else if (sec.includes("prompt") || sec.includes("提示")) {
            fetchedPrompts.push({ t: title, body: promptZh || promptEn || desc });
          }
        });

        if (fetchedTools.length > 0) tools = fetchedTools;
        if (fetchedSites.length > 0) sites = fetchedSites;
        if (fetchedPrompts.length > 0) prompts = fetchedPrompts;
      }
    }
  } catch (e) {
    console.warn("Using fallback workflow data:", e);
  }

  // 4. Timeline
  try {
    const entries = await getTimelineEntries();
    if (entries && entries.length > 0) {
      timeline = entries.slice(0, 10).map((entry) => ({
        d: entry.date ? entry.date.replace(/-/g, "·").slice(0, 7) : "2026",
        t: entry.name || entry.model || "模型更新",
        note: entry.highlights || entry.version || "大模型更新发布",
      }));
    }
  } catch (e) {
    console.warn("Using fallback timeline data:", e);
  }

  // 5. Pause
  try {
    if (env.NOTION_TOKEN && env.NOTION_PAUSE_DB_ID) {
      const res = await queryDatabaseAll({ databaseId: env.NOTION_PAUSE_DB_ID, pageSize: 60, maxPages: 8 });
      if (res.length > 0) {
        pause = res.map((p) => {
          const props = p.properties as Record<string, unknown>;
          const coverUrl = extractFileUrl(p, "Cover") || "https://picsum.photos/seed/" + p.id + "/640/480";
          const rawDate = getDate(props, "Date") || "2026·05";
          return {
            id: p.id,
            d: rawDate.replace(/-/g, "·"),
            loc: getRichText(props, "Location") || "世界角落",
            t: getPageTitle(p),
            img: coverUrl,
          };
        });
      }
    }
  } catch (e) {
    console.warn("Using fallback pause data:", e);
  }

  // 6. Notes
  try {
    if (env.NOTION_TOKEN && env.NOTION_NOTES_DB_ID) {
      const res = await queryDatabaseAll({
        databaseId: env.NOTION_NOTES_DB_ID,
        pageSize: 50,
        maxPages: 6,
        sorts: [{ property: "Date", direction: "descending" }],
      });
      if (res.length > 0) {
        notes = res.map((p) => {
          const props = p.properties as Record<string, unknown>;
          const rawDate = getDate(props, "Date") || "2026·03·19";
          const category = getSelect(props, "Category") || "思考";
          const tags = getMultiSelect(props, "Tags");
          const readTime = getNumber(props, "ReadTime");
          const htmlContent = getUrl(props, "HTMLContent");
          const excerpt = getRichText(props, "Excerpt") || getPageTitle(p);
          const title = getPageTitle(p);

          return {
            id: p.id,
            d: rawDate.replace(/-/g, "·"),
            title,
            cat: category,
            tags,
            readTime,
            htmlContent,
            src: `${category} · ${title}`,
            text: excerpt,
          };
        });
      }
    }
  } catch (e) {
    console.warn("Using fallback notes data:", e);
  }

  // 7. Log (Changelog)
  try {
    if (env.NOTION_TOKEN && env.NOTION_CHANGELOG_DB_ID) {
      const res = await queryDatabaseAll({
        databaseId: env.NOTION_CHANGELOG_DB_ID,
        pageSize: 80,
        maxPages: 10,
        sorts: [{ property: "Date", direction: "descending" }],
      });
      if (res.length > 0) {
        log = res.map((p) => {
          const props = p.properties as Record<string, unknown>;
          const rawDate = getDate(props, "Date") || "";
          const title = getPageTitle(p) || "";
          const desc = getRichText(props, "Description") || "";
          const type = getSelect(props, "Type") || "Feature";
          return {
            id: p.id,
            d: rawDate ? rawDate.replace(/.*-(\d\d)-(\d\d).*/, "$1·$2") : "05·25",
            t: title,
            desc: desc,
            type: type,
          };
        });
      }
    }
  } catch (e) {
    console.warn("Using fallback log data:", e);
  }

  return {
    books,
    lab,
    flow,
    tools,
    sites,
    prompts,
    timeline,
    pause,
    notes,
    log,
  };
}
