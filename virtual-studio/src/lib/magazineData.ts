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
    {
        "id": "3284b57f-e15a-8035-a316-d3639de70c68",
        "t": "On Writing Well",
        "a": "William K. Zinsser",
        "c": "阅读",
        "tags": [
            "工具"
        ],
        "rating": 5,
        "tagline": null,
        "downloadUrl": "https://z-library.sk/dl/Ymj3DJ5DBd",
        "coverUrl": null
    },
    {
        "id": "3284b57f-e15a-8089-9976-e1464cca0fbb",
        "t": "游戏剧本怎么写：游戏编剧新手的入门指南",
        "a": "佐佐木智广",
        "c": "阅读",
        "tags": [
            "工具"
        ],
        "rating": 4,
        "tagline": "即使在AI时代，该书部分创作理论仍有重要参考价值",
        "downloadUrl": "https://z-library.sk/dl/aBb1mmkDj8",
        "coverUrl": null
    },
    {
        "id": "3284b57f-e15a-805d-9648-d3d04653a66f",
        "t": "世界观（Worldviews）",
        "a": "Richard DeWitt",
        "c": "阅读",
        "tags": [
            "科普"
        ],
        "rating": 4.5,
        "tagline": "科学哲学与科学史入门经典",
        "downloadUrl": "https://z-library.sk/dl/kBNA9GmDjL",
        "coverUrl": null
    },
    {
        "id": "3274b57f-e15a-80a1-af9a-df7853f45ab9",
        "t": "活出意义来（Man's search for meaning）",
        "a": "Viktor E. Frankl",
        "c": "阅读",
        "tags": [
            "文学"
        ],
        "rating": 5,
        "tagline": "无论处境如何，亦皆有自由抉择的余地",
        "downloadUrl": "https://z-library.sk/dl/RjW08zMgBG",
        "coverUrl": null
    },
    {
        "id": "3274b57f-e15a-8076-b68e-c5b8007a2e05",
        "t": "所有我们看不见的光（All the Light We Cannot See）",
        "a": "Anthony Doerr",
        "c": "阅读",
        "tags": [
            "小说"
        ],
        "rating": 5,
        "tagline": "纽约时报年度十佳小说，2015年普利策小说奖\n\n",
        "downloadUrl": "https://z-library.sk/dl/5ZKQXp8aB3",
        "coverUrl": null
    },
    {
        "id": "3274b57f-e15a-8005-97a7-de1d9a524d3d",
        "t": "译道探微",
        "a": "思果",
        "c": "阅读",
        "tags": [
            "语言学"
        ],
        "rating": 5,
        "tagline": "收录了《翻译的可学与否》、《翻译与文化》、《论书名的翻译》、《可恶的名词》、《标点符号有学问》等四十余篇文章",
        "downloadUrl": "https://z-library.sk/dl/8BQ9o1eWBb",
        "coverUrl": null
    },
    {
        "id": "3274b57f-e15a-8026-a95a-ee72f6064809",
        "t": "打造第二大脑（Building a Second Brain）",
        "a": "Tiago Forte",
        "c": "阅读",
        "tags": [
            "设计"
        ],
        "rating": 4.5,
        "tagline": "如何打造一套自己的数字知识管理系统",
        "downloadUrl": "https://z-library.sk/dl/zwXRz7r5j1",
        "coverUrl": null
    },
    {
        "id": "3274b57f-e15a-80d1-8c76-d704b146621a",
        "t": "制作进行：一本书让你彻底了解动画制作（アニメを仕事に！トリガー流アニメ制作進行読本）",
        "a": "舛本和也",
        "c": "阅读",
        "tags": [
            "工具"
        ],
        "rating": 4.5,
        "tagline": "作为动画《白箱》的知识补充",
        "downloadUrl": "https://z-library.sk/dl/YZ7mQxL1B2",
        "coverUrl": null
    },
    {
        "id": "3274b57f-e15a-80e7-b347-d470d663ccc3",
        "t": "金钱心理学（Psychology of Money）",
        "a": "Morgan Housel",
        "c": "阅读",
        "tags": [
            "工具"
        ],
        "rating": 6,
        "tagline": "18条一针见血的理财智慧",
        "downloadUrl": "https://z-library.sk/dl/2w5DydXLBv",
        "coverUrl": null
    },
    {
        "id": "3274b57f-e15a-808b-956b-d860567ac0de",
        "t": "被讨厌的勇气（嫌われる勇気）",
        "a": "岸见一郎 古贺史健",
        "c": "阅读",
        "tags": [
            "成长"
        ],
        "rating": 4,
        "tagline": "因为拥有了被讨厌的勇气，于是有了真正幸福的可能。",
        "downloadUrl": "https://z-library.sk/dl/aBk5DekxZe",
        "coverUrl": null
    },
    {
        "id": "3274b57f-e15a-8072-9999-e8ff46f60f06",
        "t": "风格的要素（The Elements of Style）",
        "a": "William Strunk, Chris Hong",
        "c": "阅读",
        "tags": [
            "语言学"
        ],
        "rating": 5,
        "tagline": "简洁即风格",
        "downloadUrl": "https://z-library.sk/dl/Ovjy8bNQZp",
        "coverUrl": null
    },
    {
        "id": "3274b57f-e15a-80be-ac85-d9fe63007880",
        "t": "克拉拉与太阳（Klara and the Sun）",
        "a": "Kazuo Ishiguro",
        "c": "阅读",
        "tags": [
            "小说"
        ],
        "rating": 4.5,
        "tagline": "'The Sun always has ways to reach us.'",
        "downloadUrl": "https://z-library.sk/dl/6B06QqNRZn",
        "coverUrl": null
    },
    {
        "id": "3274b57f-e15a-804b-a0d0-ca97ec852d15",
        "t": "四千周（Four Thousand Weeks）",
        "a": "Oliver Burkeman",
        "c": "阅读",
        "tags": [
            "成长"
        ],
        "rating": 5,
        "tagline": "直面有限的人生",
        "downloadUrl": "https://z-library.sk/dl/ABVGV0gxwz",
        "coverUrl": null
    },
    {
        "id": "3264b57f-e15a-80e4-8231-f5923536310a",
        "t": "中式英语之鉴（The Translator's Guide to Chinglish）",
        "a": "平卡姆",
        "c": "阅读",
        "tags": [
            "语言学"
        ],
        "rating": 5,
        "tagline": "北京外国语大学硕士研究生考试指定参考用书",
        "downloadUrl": "https://z-library.sk/dl/6B0eJQkOwn",
        "coverUrl": null
    },
    {
        "id": "3264b57f-e15a-809c-aa56-e4f9c1b80b9e",
        "t": "点子就要秀出来（Show Your Work!）",
        "a": "Austin Kleon",
        "c": "阅读",
        "tags": [
            "设计"
        ],
        "rating": 5,
        "tagline": "通过十条变革性的规则，教你如何做到开放、慷慨、勇敢、高产",
        "downloadUrl": "https://z-library.sk/dl/xBoObXp2B1",
        "coverUrl": null
    },
    {
        "id": "3264b57f-e15a-80e5-be3c-d8eac2f3c738",
        "t": "原子习惯（Atomic Habits）",
        "a": "James Clear",
        "c": "阅读",
        "tags": [
            "工具",
            "成长"
        ],
        "rating": 4.5,
        "tagline": "通过4大定律、56个具体案例，帮助你快速养成良好的习惯",
        "downloadUrl": "https://z-library.sk/dl/aBk57RzxZe",
        "coverUrl": null
    },
    {
        "id": "3264b57f-e15a-8004-beec-d9ac98895bb5",
        "t": "强势谈判（Never Split the Difference）",
        "a": "Chris Voss",
        "c": "阅读",
        "tags": [
            "工具"
        ],
        "rating": 5,
        "tagline": "一名前FBI国际人质危机谈判专家荣耀生涯的结晶",
        "downloadUrl": "https://z-library.sk/dl/Ww24pmR1jn",
        "coverUrl": null
    },
    {
        "id": "3254b57f-e15a-8017-ae9d-c05f20ddef6e",
        "t": "翻译研究方法概论",
        "a": "穆雷",
        "c": "阅读",
        "tags": [
            "语言学"
        ],
        "rating": 5,
        "tagline": "全国翻译硕士专业学位（MTI）系列教材",
        "downloadUrl": "https://z-library.sk/dl/EBxEGGL0wd",
        "coverUrl": null
    }
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
        "id": "3cb4b57f-e15a-8122-ac1d-e867cc14ecb8",
        "d": "2026·08·27",
        "title": "【读书笔记】Principles of Marketing_市场营销原理_Gemini 3.7 Flash",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "营销",
            "创业",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/principles-of-marketing-市场营销原理-gemini-3.7-flash.html",
        "src": "读书笔记 · 【读书笔记】Principles of Marketing_市场营销原理_Gemini 3.7 Flash",
        "text": "Principles of Marketing · 菲利普·科特勒 &amp; 加里·阿姆斯特朗 经典重塑"
    },
    {
        "id": "3cb4b57f-e15a-810d-b368-e2f729f90697",
        "d": "2026·08·27",
        "title": "【读书笔记】Getting to Yes_谈判力_现代智识风",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/getting-to-yes-谈判力-现代智识风.html",
        "src": "读书笔记 · 【读书笔记】Getting to Yes_谈判力_现代智识风",
        "text": "不妥协的共赢之道：哈佛原则谈判四基石、三大实战杀手锏与动态策略推演"
    },
    {
        "id": "3cb4b57f-e15a-8193-a603-c9b0a88d56a5",
        "d": "2026·08·27",
        "title": "【读书笔记】Getting to Yes_谈判力_GLM 5.3",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/getting-to-yes-谈判力-glm-5.3.html",
        "src": "读书笔记 · 【读书笔记】Getting to Yes_谈判力_GLM 5.3",
        "text": "谈判力GETTING TO YES · 读书笔记 卷首 目 录CONTENTS 卷首 · 开卷"
    },
    {
        "id": "3cb4b57f-e15a-81d6-98f8-cdd1decaa12d",
        "d": "2026·08·27",
        "title": "【读书笔记】Getting to Yes_谈判力_Gemini 3.7",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/getting-to-yes-谈判力-gemini-3.7.html",
        "src": "读书笔记 · 【读书笔记】Getting to Yes_谈判力_Gemini 3.7",
        "text": "不妥协的共赢之道：哈佛原则谈判四基石、三大实战杀手锏与动态策略推演"
    },
    {
        "id": "3cb4b57f-e15a-81f0-8d1e-f97ec7578661",
        "d": "2026·08·27",
        "title": "【读书笔记】Building a Second Brain_打造第二大脑_GLM 5.3 Flash",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/building-a-second-brain-打造第二大脑-glm-5.3-flash.html",
        "src": "读书笔记 · 【读书笔记】Building a Second Brain_打造第二大脑_GLM 5.3 Flash",
        "text": "NEURAL ARCHIVE · 个人知识管理经典研读 打造第二大脑 Building a Second Brain — A Proven Method to Organize Your Digital Life and Unlock Your Creative Potential"
    },
    {
        "id": "3cb4b57f-e15a-81a9-89fc-e4bf30fdbf1a",
        "d": "2026·08·27",
        "title": "【读书笔记】Atomic Habits_原子习惯_GLM 5.3 Flash",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/atomic-habits-原子习惯-glm-5.3-flash.html",
        "src": "读书笔记 · 【读书笔记】Atomic Habits_原子习惯_GLM 5.3 Flash",
        "text": "READING-NOTES.SYS // 单文件离线读本 LAT 31.2304° N — LNG 121.4737° E · 当前索引 EN/中文简体 原子习惯 Atomic&nbsp;Habits [ 细微改变带来巨大成就的实证法则 ] 美国习惯研究专家詹姆斯·克利尔（James Clear）的代表作，2018 年出版。 全书围绕一个朴素而锋利的命题展开：你不会达到目标的高度，只会跌至体系的水"
    },
    {
        "id": "3cb4b57f-e15a-81be-b521-cad89e87130e",
        "d": "2026·08·26",
        "title": "【读书笔记】Your Money or Your Life_要钱还是要生活_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "财富"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/your-money-or-your-life-要钱还是要生活-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】Your Money or Your Life_要钱还是要生活_OX Alpha",
        "text": "像劫匪拿枪指着你问出这句话时，多数人会交出钱包——因为我们爱惜生命甚于爱惜金钱。但果真如此吗？本书的全部内容，都建立在对这个反问的回答之上。"
    },
    {
        "id": "3cb4b57f-e15a-8120-8d29-d5e7e708e76a",
        "d": "2026·08·26",
        "title": "【读书笔记】The Psychology of Money_金钱心理学_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "财富",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-psychology-of-money-金钱心理学-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】The Psychology of Money_金钱心理学_OX Alpha",
        "text": "理财的成败与智商关系不大，却与行为习惯息息相关。摩根·豪泽尔用十九堂课告诉我们：财富不是冰冷的数字游戏，而是一场关于人性、耐心与自知之明的心理修行。"
    },
    {
        "id": "3cb4b57f-e15a-81ca-8186-f5c90798261d",
        "d": "2026·08·26",
        "title": "【读书笔记】Million Dollar Weekend_一个周末打造千万事业_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "创业",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/million-dollar-weekend-一个周末打造千万事业-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】Million Dollar Weekend_一个周末打造千万事业_OX Alpha",
        "text": "Million Dollar Weekend —— 如何在一个周末的 48 小时里，完成 找点子 → 验证 → 收到第一笔真金白银 的创业启动流程，并在之后一年内持续成长。 核心只有一句话：在打造业务之前先收钱。"
    },
    {
        "id": "3cb4b57f-e15a-81a0-a451-c5ebff9f21f6",
        "d": "2026·08·26",
        "title": "【读书笔记】Measure What Matters_这才是OKR_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/measure-what-matters-这才是okr-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】Measure What Matters_这才是OKR_OX Alpha",
        "text": "ATOMIC AGE READING NOTES · EST. 1999 → ORBIT 这就是 OKRMeasure What Matters Google、Bono 与盖茨基金会如何用 OKR 改造世界"
    },
    {
        "id": "3cb4b57f-e15a-81fc-bb9f-f6d78f4e9789",
        "d": "2026·08·26",
        "title": "【读书笔记】How to Get Rich_如何不靠运气致富_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "财富"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/how-to-get-rich-如何不靠运气致富-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】How to Get Rich_如何不靠运气致富_OX Alpha",
        "text": "How to Get Rich — without getting lucky"
    },
    {
        "id": "3cb4b57f-e15a-816c-8841-f8ddbacd47c8",
        "d": "2026·08·26",
        "title": "【读书笔记】Deep Learning_深度学习_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/deep-learning-深度学习-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】Deep Learning_深度学习_OX Alpha",
        "text": "在进入深度学习正题之前，作者用五章篇幅铺设了全部数学地基与机器学习的通用原理：线性代数提供语言，概率与信息论提供对不确定性的量化，数值计算提供在数字计算机上真正把算法跑起来的手段，而机器学习基础则给出贯穿全书的框架——容量、泛化、极大似然与随机梯度下降。这一部分是理解后续一切深度模型的前置电路。"
    },
    {
        "id": "3cb4b57f-e15a-81aa-bd7e-eb3298911175",
        "d": "2026·08·26",
        "title": "【读书笔记】Competing Against Luck_与运气竞争_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/competing-against-luck-与运气竞争-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】Competing Against Luck_与运气竞争_OX Alpha",
        "text": "一句话读懂这本书：用户购买产品，从来不是为了拥有产品本身，而是为了\"雇用\"它去完成一项现实生活交给他的\"任务\"（Jobs to be Done）、取得某种进步。企业若能洞察这一因果机制，就能把创新的成败从\"碰运气的赌博\"变成\"可以预测的科学\"。"
    },
    {
        "id": "3cb4b57f-e15a-8138-879f-c89cc1e617d6",
        "d": "2026·08·25",
        "title": "【读书笔记】How to Get Rich_如何不靠运气致富_Gemini 3.7 Flash",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "财富",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/how-to-get-rich-如何不靠运气致富-gemini-3.7-flash.html",
        "src": "读书笔记 · 【读书笔记】How to Get Rich_如何不靠运气致富_Gemini 3.7 Flash",
        "text": "解构硅谷教父纳瓦尔·德拉维坎特（Naval Ravikant）关于财富创造、独特知识、无许可杠杆、主理人责任与博弈论心智模型的全景认知架构。践行极致精简、标点逻辑焊接与一线商业博弈话语体系。"
    },
    {
        "id": "3cb4b57f-e15a-8147-8692-ef1c029d6147",
        "d": "2026·07·16",
        "title": "【读书笔记】Obviously Awesome_显然很棒_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "营销",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/obviously-awesome-显然很棒-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Obviously Awesome_显然很棒_GLM 5.2",
        "text": "你的产品明明很棒，但就是没人搞得懂。你觉得它一目了然，客户却满脸问号。更糟的是，他们拿你的产品去跟八竿子打不着的东西做比较。"
    },
    {
        "id": "3cb4b57f-e15a-8139-bf85-eb4c64cb2756",
        "d": "2026·07·06",
        "title": "【读书笔记】Positioning The Battle for Your Mind_定位：争夺用户心智的战争_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "营销",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/positioning-the-battle-for-your-mind-定位争夺用户心智的战争-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Positioning The Battle for Your Mind_定位：争夺用户心智的战争_GLM 5.2",
        "text": "THE BATTLE FOR YOUR MIND POSITIONING 定位：争夺用户心智的战争 作者 【美】艾·里斯 Al Ries杰克·特劳特 Jack Trout 译者 陈奇 / 顾洁 出版信息 机械工业出版社华章图文 · 2017 知识驱动 双主题架构 · 响应式16:9 终极屏幕适配 “定位的第一法则：要想赢得心智之战，不能和已经在心智中牢牢占据强有力位置的企业正面交锋。你可以从各个方"
    },
    {
        "id": "3cb4b57f-e15a-81b0-9d19-c1ba4f743615",
        "d": "2026·07·05",
        "title": "【读书笔记】Ogilvy on Advertising_奥格威谈广告_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "营销",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/ogilvy-on-advertising-奥格威谈广告-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Ogilvy on Advertising_奥格威谈广告_GLM 5.2",
        "text": "奥格威开宗明义：广告是传播信息的媒介，而非艺术或娱乐。他坚信，历经时间检验的广告准则至今依然奏效——消费者仍会为\"物有所值、带来美好、提供营养、摆脱烦恼、彰显身份\"的产品买单。"
    },
    {
        "id": "3cb4b57f-e15a-811b-baf4-c89092ffc8ca",
        "d": "2026·07·03",
        "title": "【读书笔记】Principles of Marketing_科特勒营销原理_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "营销"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/principles-of-marketing-科特勒营销原理-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Principles of Marketing_科特勒营销原理_GLM 5.2",
        "text": "由现代营销学之父 Philip Kotler 与获奖教学名师 Gary Armstrong 合著，全球营销教育世界标准。本档案在数字与社会化时代重新解构客户价值、客户参与、客户关系与客户资产的全链路逻辑。"
    },
    {
        "id": "3cb4b57f-e15a-8114-84d9-e4063a3668c2",
        "d": "2026·06·26",
        "title": "【读书笔记】$100M Offers_一亿美元报价_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "营销",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/100m-offers-一亿美元报价-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】$100M Offers_一亿美元报价_GLM 5.2",
        "text": "✕ ACQUISITION.COM · VOLUME I · 知识库 $100MOFFERS 如何打造让人「拒绝就觉得自己蠢」的报价 亚历克斯·霍莫齐（Alex Hormozi）的实战手册——从破产边缘到年入过亿，核心武器只有一个：Grand Slam Offer（大满贯报价）。本知识库以原子朋克视觉重构全书框架、模型与工具箱。"
    },
    {
        "id": "3cb4b57f-e15a-81ec-a536-e96744667d41",
        "d": "2026·06·21",
        "title": "【读书笔记】Thinking, Fast and Slow_思考，快与慢_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/thinking-fast-and-slow-思考快与慢-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Thinking, Fast and Slow_思考，快与慢_GLM 5.2",
        "text": "一座关于人类判断之脆弱与直觉之强大的原子能知识库—— 诺奖得主丹尼尔·卡尼曼用四十年实验，揭开心智的双系统引擎。"
    },
    {
        "id": "3cb4b57f-e15a-8145-9eb6-deb3acf86562",
        "d": "2026·06·21",
        "title": "【读书笔记】Thinking in Systems_系统之美_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/thinking-in-systems-系统之美-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Thinking in Systems_系统之美_GLM 5.2",
        "text": "系统之美 Thinking in Systems 导论 00封面与献辞 01系统之镜 第一部分 · 结构与行为 02系统基础 03系统动物园 第二部分 · 系统与我们 04系统为何运作良好 05系统为何令我们惊讶 06系统陷阱与机遇 第三部分 · 创造改变 07杠杆点 · 十二干预 08与系统共舞 附录 09原理与箴言汇总 系统之美 Thinking in Systems 导论 00封面与献辞 0"
    },
    {
        "id": "3cb4b57f-e15a-8120-8eea-e1cd54159b45",
        "d": "2026·06·21",
        "title": "【读书笔记】The Psychology of Money_金钱心理学_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "财富",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-psychology-of-money-金钱心理学-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】The Psychology of Money_金钱心理学_GLM 5.2",
        "text": "— 财富、人性和幸福的永恒真相 —Timeless Lessons on Wealth, Greed, and Happiness"
    },
    {
        "id": "3cb4b57f-e15a-8107-b41c-e2a8fd5822bc",
        "d": "2026·06·21",
        "title": "【读书笔记】The Lean Startup_精益创业_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "创业"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-lean-startup-精益创业-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】The Lean Startup_精益创业_GLM 5.2",
        "text": "EST.2011EDITION ATOMIC ARCHIVE / VOL.01SYSTEM STATUS: OPERATIONAL REACTOR CORE: STABLE—— DOSSIER —— A KNOWLEDGE REACTOR FOR ENTREPRENEURIAL SCIENCE THE LEANSTARTUP 精益创业 · 原子档案 创业成功不是天赋与运气的产物，而是一种可以被工程"
    },
    {
        "id": "3cb4b57f-e15a-810c-813a-f6be62396e11",
        "d": "2026·06·17",
        "title": "【读书笔记】High Output Management_高产出管理_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/high-output-management-高产出管理-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】High Output Management_高产出管理_GLM 5.2",
        "text": "格鲁夫把制造业的纪律引入管理实践，提出三大贯穿全书的核心思想。理解这三点，等于把握住《High Output Management》的脊柱。"
    },
    {
        "id": "3cb4b57f-e15a-81ef-aac9-cba827a017ba",
        "d": "2026·06·14",
        "title": "【读书笔记】Influence Science and Practice_影响力_Gemini 3.5 Flash",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/influence-science-and-practice-影响力-gemini-3.5-flash.html",
        "src": "读书笔记 · 【读书笔记】Influence Science and Practice_影响力_Gemini 3.5 Flash",
        "text": "VOLUME 01 // PSYCHOLOGY OF PERSUASION"
    },
    {
        "id": "3cb4b57f-e15a-8146-9fa2-c42f91a20af0",
        "d": "2026·05·23",
        "title": "【读书笔记】Principles of Microeconomics_微观经济学原理_Claude Sonnet 4.6 Thinking",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/principles-of-microeconomics-微观经济学原理-claude-sonnet-4.6-thinking.html",
        "src": "读书笔记 · 【读书笔记】Principles of Microeconomics_微观经济学原理_Claude Sonnet 4.6 Thinking",
        "text": "Principles of Microeconomics · Ch.1–3 · Mankiw 第8版"
    },
    {
        "id": "3cb4b57f-e15a-812d-9edc-c2cc156c1ca2",
        "d": "2026·05·13",
        "title": "【读书笔记】The Lean Startup_精益创业_Gemini 3.5 Flash",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "创业",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-lean-startup-精益创业-gemini-3.5-flash.html",
        "src": "读书笔记 · 【读书笔记】The Lean Startup_精益创业_Gemini 3.5 Flash",
        "text": "精益创业 愿景 战略 MVP 构建-测量-学习 转型 增长引擎 工具 案例研究 愿景 战略 MVP 构建-测量-学习 转型 增长引擎 工具 案例研究 读书笔记"
    },
    {
        "id": "3cb4b57f-e15a-81ca-afb7-fed9be241367",
        "d": "2026·05·12",
        "title": "【读书笔记】The Almanack of Naval Ravikant_纳瓦尔宝典_Claude Sonnet 4.6 Thinking",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-almanack-of-naval-ravikant-纳瓦尔宝典-claude-sonnet-4.6-thinking.html",
        "src": "读书笔记 · 【读书笔记】The Almanack of Naval Ravikant_纳瓦尔宝典_Claude Sonnet 4.6 Thinking",
        "text": "《naval-almanack》交互式读书笔记与深度知识图谱。"
    },
    {
        "id": "3cb4b57f-e15a-81dd-9936-dd1b92cead06",
        "d": "2026·05·12",
        "title": "【读书笔记】Influence Science and Practice_影响力_MiMo V2.5 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/influence-science-and-practice-影响力-mimo-v2.5-pro.html",
        "src": "读书笔记 · 【读书笔记】Influence Science and Practice_影响力_MiMo V2.5 Pro",
        "text": "罗伯特·西奥迪尼的《影响力》是理解人类说服与顺从行为的奠基之作。本书的核心论点简洁而深刻：人类并非完全理性的决策者，而是在进化过程中形成了一套自动化的行为反应模式（automatic behavior patterns）——这些模式在绝大多数情况下是高效且有用的\"心理捷径\"（mental shortcuts），但同时也为那些懂得触发它们的人提供了系统性的操控工具。"
    },
    {
        "id": "3cb4b57f-e15a-8157-a824-f9a2c3a49c1d",
        "d": "2026·05·10",
        "title": "【读书笔记】The Almanack of Naval Ravikant_纳瓦尔宝典_Gemini 3.1 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-almanack-of-naval-ravikant-纳瓦尔宝典-gemini-3.1-pro.html",
        "src": "读书笔记 · 【读书笔记】The Almanack of Naval Ravikant_纳瓦尔宝典_Gemini 3.1 Pro",
        "text": "The Almanack of Naval Ravikant"
    },
    {
        "id": "3cb4b57f-e15a-81c7-97bc-c95050d2c36c",
        "d": "2026·05·07",
        "title": "【读书笔记】Thinking, Fast and Slow_思考，快与慢_Gemini 3.1 Pro & DeepSeek V4 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/thinking-fast-and-slow-思考快与慢-gemini-3.1-pro--deepseek-v4-pro.html",
        "src": "读书笔记 · 【读书笔记】Thinking, Fast and Slow_思考，快与慢_Gemini 3.1 Pro & DeepSeek V4 Pro",
        "text": "诺贝尔经济学奖得主 Daniel Kahneman 用几十年的行为经济学研究揭示：我们并不像自己以为的那样理性。"
    },
    {
        "id": "3cb4b57f-e15a-8122-8ad3-d6821477e0c1",
        "d": "2026·05·04",
        "title": "【读书笔记】Atomic Habits_原子习惯_Claude Sonnet 4.6 Thinking",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/atomic-habits-原子习惯-claude-sonnet-4.6-thinking.html",
        "src": "读书笔记 · 【读书笔记】Atomic Habits_原子习惯_Claude Sonnet 4.6 Thinking",
        "text": "每件事进步 1% 看起来微不足道，但长期复利的威力惊人。习惯是自我改进的复利。"
    },
    {
        "id": "3cb4b57f-e15a-8177-89eb-c5f438c1b090",
        "d": "2026·04·15",
        "title": "【读书笔记】The Millionaire Fastlane_百万富翁快车道_MiMo V2 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "财富",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-millionaire-fastlane-百万富翁快车道-mimo-v2-pro.html",
        "src": "读书笔记 · 【读书笔记】The Millionaire Fastlane_百万富翁快车道_MiMo V2 Pro",
        "text": "缓慢致富是一场注定失败的游戏，它会将你的时间耗费在赌博中……65岁才富有，届时需要的是医生而不是兰博基尼。"
    },
    {
        "id": "3cb4b57f-e15a-81fe-aad7-e88c54966d6a",
        "d": "2026·04·12",
        "title": "【读书笔记】Principles of Corporate Finance_公司财务原理_MiMo V2 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "财富"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/principles-of-corporate-finance-公司财务原理-mimo-v2-pro.html",
        "src": "读书笔记 · 【读书笔记】Principles of Corporate Finance_公司财务原理_MiMo V2 Pro",
        "text": "复利效应：$100投资20年：5%利率 → $265.33；10%利率 → $672.75。利率的微小差异在长期会产生巨大的财富差距。"
    },
    {
        "id": "3cb4b57f-e15a-8102-bc55-ff4b034860f1",
        "d": "2026·04·12",
        "title": "【读书笔记】Measure What Matters_做最重要的事_MiMo V2 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/measure-what-matters-做最重要的事-mimo-v2-pro.html",
        "src": "读书笔记 · 【读书笔记】Measure What Matters_做最重要的事_MiMo V2 Pro",
        "text": "阅读范围: Foreword + Ch1 ~ Ch4 核心主题: OKR 的定义、起源、实践案例，以及第一大超能力\"聚焦与承诺\" 生成时间: 2026-04-12 标记系统: ★核心论点 📌关键概念 💎金句 🔗跨领域连接 ❓疑问/批判"
    },
    {
        "id": "3cb4b57f-e15a-8139-8e93-ebdddaba5276",
        "d": "2026·04·11",
        "title": "【读书笔记】The Lean Startup_精益创业_Claude Sonnet 4.6 Thinking",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "创业",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-lean-startup-精益创业-claude-sonnet-4.6-thinking.html",
        "src": "读书笔记 · 【读书笔记】The Lean Startup_精益创业_Claude Sonnet 4.6 Thinking",
        "text": "埃里克·莱斯是 IMVU 的联合创始人，该公司早年犯了几乎所有传统创业教条鼓励的错误——花大量时间秘密打磨产品、把\"客户不懂\"当借口拒绝真实反馈，最终接近失败。他从这段经历中提炼出一套方法论，并以丰田生产方式（TPS）中\"精益\"（Lean）的哲学为母体，将其移植到创业的不确定性环境中。"
    },
    {
        "id": "3cb4b57f-e15a-81d2-9640-d84cb8e6c52a",
        "d": "2026·04·11",
        "title": "【读书笔记】Principles of Marketing_市场营销原理_Gemini Deep Research",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "营销",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/principles-of-marketing-市场营销原理-gemini-deep-research.html",
        "src": "读书笔记 · 【读书笔记】Principles of Marketing_市场营销原理_Gemini Deep Research",
        "text": "Principles of Marketing — Philip Kotler & Gary Armstrong"
    },
    {
        "id": "3cb4b57f-e15a-81f0-a199-dfd2a209ebfa",
        "d": "2026·04·11",
        "title": "【读书笔记】Getting to Yes_谈判力_MiniMax M2.7",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/getting-to-yes-谈判力-minimax-m2.7.html",
        "src": "读书笔记 · 【读书笔记】Getting to Yes_谈判力_MiniMax M2.7",
        "text": "Getting to Yes: Negotiating Agreement Without Giving In"
    },
    {
        "id": "3cb4b57f-e15a-8186-a96b-ff35ddb5d447",
        "d": "2026·04·11",
        "title": "【读书笔记】Entrepreneurship_创业学_Claude Sonnet 4.6 Thinking",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "创业",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/entrepreneurship-创业学-claude-sonnet-4.6-thinking.html",
        "src": "读书笔记 · 【读书笔记】Entrepreneurship_创业学_Claude Sonnet 4.6 Thinking",
        "text": "《创业学》是杰弗里·蒂蒙斯（Jeffry A. Timmons）在20世纪80年代创立、并与斯皮内利共同持续完善的一部学术-实践融合著作，被公认为创业学领域的奠基性经典教材，在全球商学院使用超过三十年。全书的核心命题只有一个，但它极其有力：创业不是天赋异禀者的孤独冒险，而是一个可以学习、可以管理、可以系统优化的过程。"
    },
    {
        "id": "3cb4b57f-e15a-81a3-b4c7-f9cc79f78cc1",
        "d": "2026·04·11",
        "title": "【读书笔记】Entrepreneurship Choice and Strategy_创业策略选择_GLM 5 Turbo",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "创业",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/entrepreneurship-choice-and-strategy-创业策略选择-glm-5-turbo.html",
        "src": "读书笔记 · 【读书笔记】Entrepreneurship Choice and Strategy_创业策略选择_GLM 5 Turbo",
        "text": "Joshua Gans · Erin L. Scott · Scott Stern W.W. Norton & Company"
    },
    {
        "id": "3cb4b57f-e15a-8116-aad3-cd1185a2b590",
        "d": "2026·04·11",
        "title": "【读书笔记】Deep Learning_深度学习_MiniMax M2.7",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/deep-learning-深度学习-minimax-m2.7.html",
        "src": "读书笔记 · 【读书笔记】Deep Learning_深度学习_MiniMax M2.7",
        "text": "Ian Goodfellow, Yoshua Bengio, Aaron Courville 著Part I + Part II + Part III 全20章笔记"
    },
    {
        "id": "3cb4b57f-e15a-8162-aebd-e2b1613ec752",
        "d": "2026·04·11",
        "title": "【读书笔记】Competitive Strategy_竞争战略_Gemini Deep Research",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/competitive-strategy-竞争战略-gemini-deep-research.html",
        "src": "读书笔记 · 【读书笔记】Competitive Strategy_竞争战略_Gemini Deep Research",
        "text": "迈克尔·波特 (Michael E. Porter) 著。 本书自问世以来，改变了企业制定战略的方式，将经济学严密的分析方法引入了企业战略领域。这份交互笔记旨在提取其核心骨架，并通过跨学科视角进行重构。"
    },
    {
        "id": "3cb4b57f-e15a-8172-82f9-fb2a1965ef1c",
        "d": "2026·04·11",
        "title": "【读书笔记】Artificial Intelligence A Modern Approach_人工智能：一种现代的方法_Claude Sonnet 4.6 Thinking",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/artificial-intelligence-a-modern-approach-人工智能一种现代的方法-claude-sonnet-4.6-thinking.html",
        "src": "读书笔记 · 【读书笔记】Artificial Intelligence A Modern Approach_人工智能：一种现代的方法_Claude Sonnet 4.6 Thinking",
        "text": "AIMA 的开篇即挑战读者：\"人工智能\"这个词究竟意味着什么？ 作者并不给出单一答案，而是呈现了四个维度上的两两对立，形成经典的 2×2 框架。"
    },
    {
        "id": "3cb4b57f-e15a-8186-b718-db4104dde8da",
        "d": "2026·04·08",
        "title": "【读书笔记】The Art and Business of Online Writing_在线写作的艺术与商业_MiniMax M2.7",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "创业"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-art-and-business-of-online-writing-在线写作的艺术与商业-minimax-m2.7.html",
        "src": "读书笔记 · 【读书笔记】The Art and Business of Online Writing_在线写作的艺术与商业_MiniMax M2.7",
        "text": "How to Beat the Game of Capturing and Keeping Attention"
    },
    {
        "id": "3cb4b57f-e15a-813d-ac14-f35d0da3902f",
        "d": "2026·04·08",
        "title": "【读书笔记】Never Split the Difference_强势谈判_GLM 5.0",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "AI",
            "思考"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/never-split-the-difference-强势谈判-glm-5.0.html",
        "src": "读书笔记 · 【读书笔记】Never Split the Difference_强势谈判_GLM 5.0",
        "text": "Never Split the Difference：FBI谈判专家的生死博弈与日常智慧"
    },
    {
        "id": "3cb4b57f-e15a-811c-aee7-e8afbb13e4e0",
        "d": "2026·04·07",
        "title": "【读书笔记】Your Money or Your Life_要钱还是要生活_MiMo V2 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "财富",
            "AI"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/your-money-or-your-life-要钱还是要生活-mimo-v2-pro.html",
        "src": "读书笔记 · 【读书笔记】Your Money or Your Life_要钱还是要生活_MiMo V2 Pro",
        "text": "没有财务自由，也能提前退休Your Money or Your Life"
    },
    {
        "id": "3cb4b57f-e15a-8144-acbf-c78b0650afbb",
        "d": "2026·04·07",
        "title": "【读书笔记】The Intelligent Investor_聪明的投资者_MiMo V2 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "财富",
            "AI"
        ],
        "readTime": 34,
        "htmlContent": "https://quaxstudio.xyz/articles/the-intelligent-investor-聪明的投资者-mimo-v2-pro.html",
        "src": "读书笔记 · 【读书笔记】The Intelligent Investor_聪明的投资者_MiMo V2 Pro",
        "text": "有史以来最伟大的投资经典A Book of Practical Counsel"
    },
    {
        "id": "3cb4b57f-e15a-8169-8d2d-c3845a6a9f37",
        "d": "2026·04·07",
        "title": "【读书笔记】Million Dollar Weekend_一个周末打造千万事业的可能_MiniMax M2.7",
        "cat": "读书笔记",
        "tags": [
            "读书笔记"
        ],
        "readTime": 43,
        "htmlContent": "https://quaxstudio.xyz/articles/million-dollar-weekend-一个周末打造千万事业的可能-minimax-m2.7.html",
        "src": "读书笔记 · 【读书笔记】Million Dollar Weekend_一个周末打造千万事业的可能_MiniMax M2.7",
        "text": "⚡ 本书核心理念一句话：百万美元的事业不需要百万美元的启动资金、丰富的经验或完美的时机——它需要的是「创造者勇气」：有勇气立刻开始（而非想太多），有勇气开口要求（而非只是等待）。"
    },
    {
        "id": "3294b57f-e15a-8069-ad16-c6c24a0621c6",
        "d": "2026·03·19",
        "title": "【AI应用】Notion+AI：第二大脑自动化搭建指南",
        "cat": "思考",
        "tags": [
            "AI",
            "教程"
        ],
        "readTime": 20,
        "htmlContent": null,
        "src": "思考 · 【AI应用】Notion+AI：第二大脑自动化搭建指南",
        "text": "用 CODE 四阶段原则，搭一套真正能用的 Notion + AI 第二大脑系统——从”为什么要这么做”，到”每一步怎么操作”。"
    },
    {
        "id": "32a4b57f-e15a-8021-aa4b-e86161596601",
        "d": "2026·03·08",
        "title": "【AI应用】AI 编程产品全景地图",
        "cat": "信息",
        "tags": [
            "AI",
            "教程"
        ],
        "readTime": null,
        "htmlContent": "https://quaxstudio.xyz/articles/ai-coding-tools.html",
        "src": "信息 · 【AI应用】AI 编程产品全景地图",
        "text": "一个实用的入门路径： 从 GitHub Copilot 免费版 开始，感受 AI 辅助编程的基本体验（零成本）。如果觉得有价值，再升级到 Cursor Pro（$20/月），体验多文件 Agent 工作流。处理大型项目时，考虑叠加 Claude Code（可与 Claude.ai Pro 共用订阅）。"
    },
    {
        "id": "3cb4b57f-e15a-80c0-88a9-d26b5d8b4351",
        "d": "2026·03·01",
        "title": "Untitled",
        "cat": "思考",
        "tags": [],
        "readTime": null,
        "htmlContent": null,
        "src": "思考 · Untitled",
        "text": "Untitled"
    }
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
        pageSize: 100,
        maxPages: 10,
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
