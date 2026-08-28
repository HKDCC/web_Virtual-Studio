import { queryDatabaseAll } from "./notion";
import { env } from "./env";
import {
  getPageTitle,
  getRichText,
  getSelect,
  getMultiSelect,
  getDate,
  getUrl,
  findPropertyKeyByType,
} from "./notionHelpers";
import { getTimelineEntries } from "./changelog";

export interface BookItem {
  id?: string;
  t: string;
  a: string;
  c: string;
  coverUrl?: string | null;
}

export interface LabItem {
  id?: string;
  tag: string;
  t: string;
  d: string;
  links: [string, string][];
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
  src: string;
  text: string;
}

export interface LogItem {
  id?: string;
  d: string;
  t: string;
}

export interface CoverItem {
  t: string;
  layer: string;
  tag: string;
  date: string;
  d: string;
  links: [string, string][];
  img: string;
}

export const FALLBACK_SITE_DATA = {
  cover: {
    t: "Virtual Studio",
    layer: "输出层",
    tag: "VIBE CODING",
    date: "2026·05",
    d: "基于 Next.js + Notion 的极简主义个人网站——也就是你现在看到的这一本杂志。从数据层到版式，全部自己动手。",
    links: [
      ["GitHub", "https://github.com"],
      ["Demo", "#"],
      ["查看笔记", "#notes"],
    ] as [string, string][],
    img: "https://picsum.photos/seed/tlcover/1200/900",
  },

  books: [
    { t: "On Writing Well", a: "William K. Zinsser", c: "工具" },
    { t: "游戏剧本怎么写：游戏编剧新手的入门指南", a: "佐佐木智广", c: "工具" },
    { t: "世界观（Worldviews）", a: "Richard DeWitt", c: "科普" },
    { t: "活出意义来（Man's Search for Meaning）", a: "Viktor E. Frankl", c: "文学" },
    { t: "所有我们看不见的光（All the Light We Cannot See）", a: "Anthony Doerr", c: "小说" },
    { t: "译道探微", a: "思果", c: "语言学" },
    { t: "打造第二大脑（Building a Second Brain）", a: "Tiago Forte", c: "设计" },
    { t: "制作进行：一本书让你彻底了解动画制作", a: "舛本和也", c: "工具" },
    { t: "金钱心理学（The Psychology of Money）", a: "Morgan Housel", c: "工具" },
    { t: "被讨厌的勇气", a: "岸见一郎 古贺史健", c: "成长" },
    { t: "风格的要素（The Elements of Style）", a: "William Strunk", c: "语言学" },
    { t: "克拉拉与太阳（Klara and the Sun）", a: "Kazuo Ishiguro", c: "小说" },
    { t: "四千周（Four Thousand Weeks）", a: "Oliver Burkeman", c: "成长" },
    { t: "中式英语之鉴", a: "平卡姆", c: "语言学" },
    { t: "点子就要秀出来（Show Your Work!）", a: "Austin Kleon", c: "设计" },
    { t: "原子习惯（Atomic Habits）", a: "James Clear", c: "成长" },
    { t: "强势谈判（Never Split the Difference）", a: "Chris Voss", c: "工具" },
    { t: "翻译研究方法概论", a: "穆雷", c: "语言学" },
  ] as BookItem[],

  lab: [
    {
      tag: "AI 实践",
      t: "SwiftMemo",
      d: "一款 MUJI 无印良品风格的桌面便签应用，专为捕捉日常碎想法而设计。",
      links: [["GitHub", "https://github.com"], ["Demo", "#"]] as [string, string][],
    },
    {
      tag: "AI 实践",
      t: "CassetteCutter",
      d: "专为解决大文件视频传输难题而设计的桌面工具。",
      links: [["查看笔记", "#notes"]] as [string, string][],
    },
    {
      tag: "Vibe Coding",
      t: "Retro Pixel Snake",
      d: "磁带未来主义 + 复古像素风贪吃蛇小游戏。Claude + Antigravity。",
      links: [["GitHub", "https://github.com"], ["Demo", "#"]] as [string, string][],
    },
    {
      tag: "AI 实践",
      t: "ClaudeCode 新手安装教程",
      d: "还有更简单的方法：遇到困难，直接问 AI。",
      links: [["查看笔记", "#notes"]] as [string, string][],
    },
    {
      tag: "AI 实践",
      t: "OpenClaw 新手部署教程",
      d: "同样有更简单的方法：遇到困难，直接问 AI。",
      links: [["查看笔记", "#notes"]] as [string, string][],
    },
    {
      tag: "AI 实践",
      t: "MuseTodo Pink",
      d: "粉粉的 Todolist，给待办清单一点情绪价值。",
      links: [["查看笔记", "#notes"]] as [string, string][],
    },
    {
      tag: "Vibe Coding",
      t: "Virtual Studio",
      d: "基于 Next.js + Notion 的极简主义个人网站。",
      links: [["GitHub", "https://github.com"], ["Demo", "#"], ["笔记", "#notes"]] as [string, string][],
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
    { d: "2026·05", t: "Gemini 3.5 Flash", note: "辅助功能与多模态能力升级" },
    { d: "2026·04", t: "MiniMax M2.7", note: "Agent 任务规划能力强化" },
    { d: "2026·02", t: "GPT-5.2", note: "长上下文与代码能力迭代" },
    { d: "2025·11", t: "Claude 4.5 Sonnet", note: "Agent 编程工作流成熟" },
    { d: "2025·09", t: "Gemini 3.0 Pro", note: "原生多模态与 2M 上下文" },
    { d: "2025·06", t: "DeepSeek V3.2", note: "开源权重的性价比路线" },
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
    { d: "2026·03·17", src: "足迹 · 创刊", text: "12 小时网站速成，上线大吉。又活了一天，很了不起了。" },
    { d: "2026·05·25", src: "手记 · 关于本刊", text: "每一个模块都是一种思维方式的入口，而不是内容的抽屉。" },
  ] as NoteItem[],

  log: [
    { d: "05·25", t: "AI 日报功能下线，模型更迭时间轴与工作流节点展示上线。" },
    { d: "03·20", t: "AI 日报功能上线，日报模块由 AI Agent 全权负责。" },
    { d: "03·19", t: "「库」功能基本实现，黑暗模式上线。" },
    { d: "03·18", t: "照片墙功能恢复正常。" },
    { d: "03·17", t: "12 小时网站速成，本刊创刊。" },
  ] as LogItem[],
};

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function firstFileUrl(filesProp: unknown): string | null {
  if (!isObj(filesProp)) return null;
  const files = (filesProp as Record<string, unknown>)["files"];
  if (!Array.isArray(files) || files.length === 0) return null;
  const f = files[0];
  if (!isObj(f)) return null;
  const type = f["type"];
  if (type === "external") {
    const external = f["external"];
    if (!isObj(external)) return null;
    const url = external["url"];
    return typeof url === "string" ? url : null;
  }
  if (type === "file") {
    const file = f["file"];
    if (!isObj(file)) return null;
    const url = file["url"];
    return typeof url === "string" ? url : null;
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
  let cover = FALLBACK_SITE_DATA.cover;

  // 1. Books
  try {
    if (env.NOTION_TOKEN && env.NOTION_BOOKS_DB_ID) {
      const res = await queryDatabaseAll({ databaseId: env.NOTION_BOOKS_DB_ID, pageSize: 50, maxPages: 4 });
      if (res.length > 0) {
        books = res.map((p) => {
          const props = p.properties as Record<string, unknown>;
          const tags = getMultiSelect(props, "Tags");
          const category = getSelect(props, "Category") || (tags.length > 0 ? tags[0] : "工具");
          return {
            id: p.id,
            t: getPageTitle(p),
            a: getRichText(props, "Author") || "未知作者",
            c: category,
            coverUrl: firstFileUrl(props["Cover"]),
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
          const coverUrl = firstFileUrl(props["Cover"]) || "https://picsum.photos/seed/" + p.id + "/640/480";
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
      const res = await queryDatabaseAll({ databaseId: env.NOTION_NOTES_DB_ID, pageSize: 50, maxPages: 6 });
      if (res.length > 0) {
        notes = res.map((p) => {
          const props = p.properties as Record<string, unknown>;
          const rawDate = getDate(props, "Date") || "2026·05·25";
          const categoryProp = props["Category"];
          let category = "手记";
          if (isObj(categoryProp) && categoryProp["type"] === "select") {
            const select = categoryProp["select"];
            if (isObj(select) && typeof select["name"] === "string") category = select["name"];
          }
          return {
            id: p.id,
            d: rawDate.replace(/-/g, "·"),
            src: `${category} · ${getPageTitle(p)}`,
            text: getRichText(props, "Excerpt") || getPageTitle(p),
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
          const props = p.properties;
          const dateKey = findPropertyKeyByType(props, "date");
          const descKey = findPropertyKeyByType(props, "rich_text");
          const rawDate = dateKey ? getDate(props, dateKey) : null;
          const desc = descKey ? getRichText(props, descKey) : null;
          return {
            id: p.id,
            d: rawDate ? rawDate.replace(/.*-(\d\d)-(\d\d).*/, "$1·$2") : "05·25",
            t: (getPageTitle(p) ? getPageTitle(p) + "：" : "") + (desc || getPageTitle(p)),
          };
        });
      }
    }
  } catch (e) {
    console.warn("Using fallback log data:", e);
  }

  // Dynamic Cover
  if (lab.length > 0 && lab[0]) {
    cover = {
      t: lab[0].t,
      layer: "输出层",
      tag: lab[0].tag.toUpperCase(),
      date: "最新发布",
      d: lab[0].d || "极简主义个人网站与 AI 实践项目。",
      links: lab[0].links,
      img: "https://picsum.photos/seed/tlcover/1200/900",
    };
  }

  return {
    cover,
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
