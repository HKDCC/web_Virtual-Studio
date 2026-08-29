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

export interface AppIconInfo {
  type: "emoji" | "image";
  value: string;
}

export interface LabItem {
  id?: string;
  tag: string;
  t: string;
  d: string;
  links: [string, string][];
  iconUrl?: string | null;
  appIcon?: AppIconInfo | null;
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
      tag: "Vibe Coding",
      t: "MiniReader",
      d: "极简、无干扰的本地优先桌面阅读器，支持 TXT / EPUB / PDF，基于 IndexedDB 离线存储。",
      links: [["GitHub", "https://github.com/HKDCC/MiniReader"], ["Demo", "https://github.com/HKDCC/MiniReader/releases"]],
      iconUrl: "/lab/minireader.gif",
      appIcon: { type: "emoji", value: "📖" },
    },
    {
      tag: "AI 实践",
      t: "SwiftMemo",
      d: "一款 MUJI 无印良品风格的桌面便签应用，专为捕捉日常碎想法而设计。",
      links: [["GitHub", "https://github.com/HKDCC/swift-memo"], ["Demo", "https://github.com/HKDCC/swift-memo/releases"]],
      iconUrl: "/lab/swiftmemo.jpg",
      appIcon: { type: "emoji", value: "📝" },
    },
    {
      tag: "AI 实践",
      t: "CassetteCutter",
      d: "专为解决大文件视频传输难题而设计的桌面工具。",
      links: [["查看详情", "#lab"]],
      iconUrl: "/lab/cassettecutter.jpg",
      appIcon: { type: "emoji", value: "📼" },
    },
    {
      tag: "Vibe Coding",
      t: "Retro Pixel Snake",
      d: "磁带未来主义 + 复古像素风贪吃蛇小游戏。Claude + Antigravity。",
      links: [["GitHub", "https://github.com/HKDCC/snake-game"], ["Demo", "https://github.com/HKDCC/snake-game/releases"]],
      iconUrl: "/lab/retro_pixel_snake.gif",
      appIcon: { type: "emoji", value: "🐍" },
    },
    {
      tag: "AI 实践",
      t: "ClaudeCode 新手安装教程",
      d: "还有更简单的方法：遇到困难，直接问 AI。",
      links: [["查看详情", "#notes"]],
      appIcon: { type: "emoji", value: "🤖" },
    },
    {
      tag: "AI 实践",
      t: "OpenClaw 新手部署教程",
      d: "同样有更简单的方法：遇到困难，直接问 AI。",
      links: [["查看详情", "#notes"]],
      appIcon: { type: "emoji", value: "🐾" },
    },
    {
      tag: "AI 实践",
      t: "MuseTodo Pink",
      d: "粉粉的 Todolist，给待办清单一点情绪价值。",
      links: [["查看详情", "#notes"]],
      iconUrl: "/lab/musetodo_pink.gif",
      appIcon: { type: "emoji", value: "🌸" },
    },
    {
      tag: "Vibe Coding",
      t: "Virtual Studio",
      d: "基于 Next.js + Notion 的极简主义个人网站。",
      links: [["GitHub", "https://github.com/HKDCC/web_Virtual-Studio"], ["Demo", "#"]],
      appIcon: { type: "emoji", value: "✨" },
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
    { d: "2026·08", t: "GLM-5.3-Flash", note: "320B 混合稀疏注意力 MoE 架构，支持 100 万 Context，MIT 协议开源" },
    { d: "2026·08", t: "Qwen3.8-Flash-Next", note: "Qwen4 架构先行版，125B 参数融合 QSA 微块稀疏注意力" },
    { d: "2026·08", t: "GLM-5.3", note: "后训练 Scaling 旗舰，Terminal Bench 与多智能体协同突破" },
    { d: "2026·08", t: "Gemini 3.7 Flash", note: "Google 3.7 系列高效旗舰，专为编程 Agent 与深度推理优化" },
    { d: "2026·08", t: "DeepSeek-V4-Pro (build 0813)", note: "1.6T MoE GA 正式版，大幅提升长程工程与数学推理" },
    { d: "2026·08", t: "Grok 4.6", note: "新增 xhigh 极限思考档位，优化百万上下文 Agent 任务" },
    { d: "2026·08", t: "GPT-5.6-Cyber", note: "OpenAI 首款专精网络安全与漏洞挖掘的特化模型" },
    { d: "2026·08", t: "Qwen3.8-Max & 27B", note: "2.4T 参数 MoE 旗舰，强化长程 Agentic 复杂任务" },
    { d: "2026·07", t: "DeepSeek-V4-Flash (build 0731)", note: "284B 稀疏 MoE 架构，支持 100 万 Context 与 DSpark 推测解码" },
    { d: "2026·07", t: "Claude Opus 5", note: "Claude 5 系列旗舰基座，支持 100 万 Context 与工具热插拔" },
  ] as TimelineItem[],

  pause: [
    {
        "id": "3284b57f-e15a-804d-b6a3-f09b552c66df",
        "d": "2024·11·10",
        "loc": "上海",
        "t": "闲逛",
        "img": "/photos/photo_1_.jpeg"
    },
    {
        "id": "3284b57f-e15a-8014-9fa7-f82ee91b9201",
        "d": "2024·08·17",
        "loc": "上海",
        "t": "原神fes 2024",
        "img": "/photos/photo_2_.jpeg"
    },
    {
        "id": "3284b57f-e15a-80a5-8c76-d922f306d860",
        "d": "2024·03·29",
        "loc": "上海",
        "t": "徐汇滨江",
        "img": "/photos/photo_3_.jpeg"
    },
    {
        "id": "3284b57f-e15a-80a2-97b7-d1cb37456715",
        "d": "2024·03·24",
        "loc": "上海",
        "t": "闲逛",
        "img": "/photos/photo_4_.jpeg"
    },
    {
        "id": "3284b57f-e15a-8004-be00-e7f017406a6c",
        "d": "2023·12·30",
        "loc": "上海",
        "t": "田子坊闲逛",
        "img": "/photos/photo_5_.jpeg"
    },
    {
        "id": "3284b57f-e15a-8000-84cf-c55f190eec26",
        "d": "2023·08·11",
        "loc": "上海",
        "t": "原神Fes 2023",
        "img": "/photos/photo_6_.jpeg"
    },
    {
        "id": "3284b57f-e15a-80a3-a00e-cf771ea00cb2",
        "d": "2022·07·12",
        "loc": "萍乡",
        "t": "武功山",
        "img": "/photos/photo_7_.jpeg"
    },
    {
        "id": "3284b57f-e15a-8025-b461-cbb612f0e4b8",
        "d": "2021·10·30",
        "loc": "上海",
        "t": "上理大草坪",
        "img": "/photos/photo_8_.jpeg"
    },
    {
        "id": "3284b57f-e15a-803a-bec4-db4ace549f45",
        "d": "2023·12·29",
        "loc": "杭州",
        "t": "闲逛",
        "img": "/photos/photo_9_.jpg"
    },
    {
        "id": "3274b57f-e15a-805e-b2ae-c5a06302f164",
        "d": "2023·04·11",
        "loc": "上海",
        "t": "迪士尼TB",
        "img": "/photos/photo_10_.jpg"
    }
] as PauseItem[],

  notes: [
    {
        "id": "3cb4b57f-e15a-8122-ac1d-e867cc14ecb8",
        "d": "2026·08·27",
        "title": "【读书笔记】Principles of Marketing_市场营销原理_Gemini 3.7 Flash",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "市场营销",
            "商业战略",
            "品牌定位",
            "客户价值",
            "增长方法论"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/principles-of-marketing-市场营销原理-gemini-3.7-flash.html",
        "src": "读书笔记 · 【读书笔记】Principles of Marketing_市场营销原理_Gemini 3.7 Flash",
        "text": "现代营销战略实战全景：打通客户洞察与价值创造闭环，用精准客群细分与全渠道触点引爆增长——把品牌主张转化为消费者心智共鸣。"
    },
    {
        "id": "3cb4b57f-e15a-810d-b368-e2f729f90697",
        "d": "2026·08·27",
        "title": "【读书笔记】Getting to Yes_谈判力_GLM 5.3 Flash",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "原则谈判",
            "商业博弈",
            "沟通心理学",
            "共赢思维",
            "决策方法论"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/getting-to-yes-谈判力-现代智识风.html",
        "src": "读书笔记 · 【读书笔记】Getting to Yes_谈判力_GLM 5.3 Flash",
        "text": "哈佛经典原则谈判法：把人与事彻底剥离，着眼于深层利益而非立场争执；确立最佳替代方案BATNA，在不伤关系的前提下达成共赢破局。"
    },
    {
        "id": "3cb4b57f-e15a-81f0-8d1e-f97ec7578661",
        "d": "2026·08·27",
        "title": "【读书笔记】Building a Second Brain_打造第二大脑_GLM 5.3 Flash",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "知识管理",
            "生产力",
            "个人成长",
            "CODE法则",
            "工作流"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/building-a-second-brain-打造第二大脑-glm-5.3-flash.html",
        "src": "读书笔记 · 【读书笔记】Building a Second Brain_打造第二大脑_GLM 5.3 Flash",
        "text": "数字时代的个人知识管理系统：通过CODE四步法（抓取、组织、提炼、表达）释放大脑带宽——将散乱信息沉淀为随时调用的外挂生产力。"
    },
    {
        "id": "3cb4b57f-e15a-81a9-89fc-e4bf30fdbf1a",
        "d": "2026·08·27",
        "title": "【读书笔记】Atomic Habits_原子习惯_GLM 5.3 Flash",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "行为心理学",
            "习惯养成",
            "个人成长",
            "生产力",
            "复利效应"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/atomic-habits-原子习惯-glm-5.3-flash.html",
        "src": "读书笔记 · 【读书笔记】Atomic Habits_原子习惯_GLM 5.3 Flash",
        "text": "微小改变带来复利奇迹：系统拆解提示、渴求、反应、奖励四大行为定律——不靠虚无的意志力硬撑，靠环境设计与身份认同重塑长期飞轮。"
    },
    {
        "id": "3cb4b57f-e15a-81be-b521-cad89e87130e",
        "d": "2026·08·26",
        "title": "【读书笔记】Your Money or Your Life_要钱还是要生活_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "个人财务",
            "财务自由",
            "财富观",
            "时间主权",
            "FIRE生活"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/your-money-or-your-life-要钱还是要生活-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】Your Money or Your Life_要钱还是要生活_OX Alpha",
        "text": "金钱是你在生命能量上的明码标价：重塑金钱与时间的主权契约，计算每一笔开支消耗的真实生命，在“刚刚好”的拐点上达成终极财务自由。"
    },
    {
        "id": "3cb4b57f-e15a-8120-8d29-d5e7e708e76a",
        "d": "2026·08·26",
        "title": "【读书笔记】The Psychology of Money_金钱心理学_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "行为金融学",
            "投资心理",
            "财富认知",
            "风险管理",
            "复利思维"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-psychology-of-money-金钱心理学-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】The Psychology of Money_金钱心理学_OX Alpha",
        "text": "理财的本质是心智博弈而非数学算术：财富不在于你赚了多少，而在于你保住了多少——管理贪婪与恐惧，在意外开支足以致命的世界里优雅生存。"
    },
    {
        "id": "3cb4b57f-e15a-81ca-8186-f5c90798261d",
        "d": "2026·08·26",
        "title": "【读书笔记】Million Dollar Weekend_一个周末打造千万事业_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "极速创业",
            "需求验证",
            "冷启动",
            "商业变现",
            "行动力"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/million-dollar-weekend-一个周末打造千万事业-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】Million Dollar Weekend_一个周末打造千万事业_OX Alpha",
        "text": "AppSumo创始人诺亚·卡根的极速创业实战：48小时内从零验证付费需求，告别拖延与自我怀疑——先搞定前三个真实买家，再谈规模扩张。"
    },
    {
        "id": "3cb4b57f-e15a-81a0-a451-c5ebff9f21f6",
        "d": "2026·08·26",
        "title": "【读书笔记】Measure What Matters_这才是OKR_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "目标管理",
            "OKR",
            "团队协作",
            "企业管理",
            "战略执行"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/measure-what-matters-这才是okr-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】Measure What Matters_这才是OKR_OX Alpha",
        "text": "约翰·杜尔揭秘OKR执行法则：聚焦压倒性关键目标，用可衡量的关键结果焊接团队协作——告别低效KPI，让全员在战略方向上达成绝对共识。"
    },
    {
        "id": "3cb4b57f-e15a-81fc-bb9f-f6d78f4e9789",
        "d": "2026·08·26",
        "title": "【读书笔记】How to Get Rich_如何不靠运气致富_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "纳瓦尔",
            "专有知识",
            "杠杆效应",
            "财富自由",
            "心智模型"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/how-to-get-rich-如何不靠运气致富-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】How to Get Rich_如何不靠运气致富_OX Alpha",
        "text": "硅谷投资教父纳瓦尔的财富底层逻辑：拒绝出卖时间，通过专属知识与无许可杠杆占领价值高地——财富不是零和博弈，而是创造正和价值。"
    },
    {
        "id": "3cb4b57f-e15a-816c-8841-f8ddbacd47c8",
        "d": "2026·08·26",
        "title": "【读书笔记】Deep Learning_深度学习_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "人工智能",
            "深度学习",
            "神经网络",
            "算法架构",
            "机器学习"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/deep-learning-深度学习-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】Deep Learning_深度学习_OX Alpha",
        "text": "深度阅读笔记与知识图谱重构：系统提炼核心命题与实战方法论，在不确定性中建立结构化认知框架。"
    },
    {
        "id": "3cb4b57f-e15a-81aa-bd7e-eb3298911175",
        "d": "2026·08·26",
        "title": "【读书笔记】Competing Against Luck_与运气竞争_OX Alpha",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "待办任务JTBD",
            "产品创新",
            "用户需求",
            "破坏式创新",
            "商业洞察"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/competing-against-luck-与运气竞争-ox-alpha.html",
        "src": "读书笔记 · 【读书笔记】Competing Against Luck_与运气竞争_OX Alpha",
        "text": "克里斯坦森“用户待办任务”（Jobs to Be Done）理论：客户购买的不是产品本身，而是为了让生活取得某种进展——摸清深层动机，彻底摆脱低维同质化内卷。"
    },
    {
        "id": "3cb4b57f-e15a-8147-8692-ef1c029d6147",
        "d": "2026·07·16",
        "title": "【读书笔记】Obviously Awesome_显然很棒_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "产品定位",
            "品类创新",
            "目标客群",
            "B2B营销",
            "竞争优势"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/obviously-awesome-显然很棒-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Obviously Awesome_显然很棒_GLM 5.2",
        "text": "产品定位的核心灵魂在于“一目了然”：摸清买家脑海中的真正替代方案，用压倒性优势锁定最买账的客群，彻底跨越“从这啥玩意到非买不可”。"
    },
    {
        "id": "3cb4b57f-e15a-8139-bf85-eb4c64cb2756",
        "d": "2026·07·06",
        "title": "【读书笔记】Positioning The Battle for Your Mind_定位：争夺用户心智的战争_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "定位理论",
            "心智占领",
            "品牌战略",
            "市场营销",
            "品类策略"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/positioning-the-battle-for-your-mind-定位争夺用户心智的战争-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Positioning The Battle for Your Mind_定位：争夺用户心智的战争_GLM 5.2",
        "text": "商业竞争的终极战场不在货架，而在客户心智：与其正面硬刚行业巨头，不如抢占空位、开创新品类——成为潜在买家认知里的“第一选择”。"
    },
    {
        "id": "3cb4b57f-e15a-81b0-9d19-c1ba4f743615",
        "d": "2026·07·05",
        "title": "【读书笔记】Ogilvy on Advertising_奥格威谈广告_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "广告文案",
            "整合营销",
            "大创意",
            "品牌传播",
            "商业转化"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/ogilvy-on-advertising-奥格威谈广告-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Ogilvy on Advertising_奥格威谈广告_GLM 5.2",
        "text": "广告教皇奥格威实战箴言：广告的唯一目的就是销售，摒弃自恋的浮华噱头——靠大创意、精准文案与严密调研把潜在买家直接转化为成交客户。"
    },
    {
        "id": "3cb4b57f-e15a-811b-baf4-c89092ffc8ca",
        "d": "2026·07·03",
        "title": "【读书笔记】Principles of Marketing_科特勒营销原理_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "科特勒营销",
            "STP理论",
            "4P营销组合",
            "品牌护城河",
            "客户关系"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/principles-of-marketing-科特勒营销原理-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Principles of Marketing_科特勒营销原理_GLM 5.2",
        "text": "营销大师科特勒奠基经典：从STP定位到4P组合，以创造客户价值为唯一锚点——在激烈的商业博弈中洞穿需求本质，构建持久品牌护城河。"
    },
    {
        "id": "3cb4b57f-e15a-8114-84d9-e4063a3668c2",
        "d": "2026·06·26",
        "title": "【读书笔记】$100M Offers_一亿美元报价_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "大满贯报价",
            "定价策略",
            "价值重构",
            "高客单成交",
            "销售增长"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/100m-offers-一亿美元报价-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】$100M Offers_一亿美元报价_GLM 5.2",
        "text": "从濒临破产到年入过亿：霍莫齐的核心杀手锏只有“大满贯报价”——通过重构价值方程，打造出让目标客群“拒绝就觉得自己蠢”的压倒性交易方案。"
    },
    {
        "id": "3cb4b57f-e15a-81ec-a536-e96744667d41",
        "d": "2026·06·21",
        "title": "【读书笔记】Thinking, Fast and Slow_思考，快与慢_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "认知心理学",
            "双系统思维",
            "行为经济学",
            "决策偏差",
            "启发式直觉"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/thinking-fast-and-slow-思考快与慢-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Thinking, Fast and Slow_思考，快与慢_GLM 5.2",
        "text": "卡尼曼心智双系统引擎：快思考依靠启发式直觉应对日常，慢思考负责严密理性决策——洞穿认知偏差陷阱，建立高维度的判断校准框架。"
    },
    {
        "id": "3cb4b57f-e15a-8145-9eb6-deb3acf86562",
        "d": "2026·06·21",
        "title": "【读书笔记】Thinking in Systems_系统之美_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "系统动力学",
            "系统思维",
            "杠杆点",
            "复杂科学",
            "决策模型"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/thinking-in-systems-系统之美-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】Thinking in Systems_系统之美_GLM 5.2",
        "text": "系统动力学开山之作：跨越平铺直叙的线性因果，用存量、流量与反馈回路透视全局——在复杂系统的十二大杠杆点上精准施策、引爆变革。"
    },
    {
        "id": "3cb4b57f-e15a-8107-b41c-e2a8fd5822bc",
        "d": "2026·06·21",
        "title": "【读书笔记】The Lean Startup_精益创业_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "精益创业",
            "MVP最小可行产品",
            "敏捷迭代",
            "商业模式",
            "科学试错"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-lean-startup-精益创业-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】The Lean Startup_精益创业_GLM 5.2",
        "text": "创业不是赌徒的运气游戏，而是科学试错的工程：通过“构建-衡量-学习”极限反馈循环打造MVP，用最小成本完成商业假设的认知跃迁。"
    },
    {
        "id": "3cb4b57f-e15a-810c-813a-f6be62396e11",
        "d": "2026·06·17",
        "title": "【读书笔记】High Output Management_高产出管理_GLM 5.2",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "格鲁夫",
            "高产出管理",
            "团队效能",
            "管理杠杆",
            "组织执行力"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/high-output-management-高产出管理-glm-5.2.html",
        "src": "读书笔记 · 【读书笔记】High Output Management_高产出管理_GLM 5.2",
        "text": "格鲁夫管理哲学的硬核支柱：把制造业的严密纪律投射到心智生产中，通过高杠杆率行动撬动整个团队产出，以产出为唯一衡量标准。"
    },
    {
        "id": "3cb4b57f-e15a-8146-9fa2-c42f91a20af0",
        "d": "2026·05·23",
        "title": "【读书笔记】Principles of Microeconomics_微观经济学原理_Claude Sonnet 4.6 Thinking",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "微观经济学",
            "供求机制",
            "边际分析",
            "机会成本",
            "市场博弈"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/principles-of-microeconomics-微观经济学原理-claude-sonnet-4.6-thinking.html",
        "src": "读书笔记 · 【读书笔记】Principles of Microeconomics_微观经济学原理_Claude Sonnet 4.6 Thinking",
        "text": "曼昆微观经济学基石：机会成本、边际分析与供求均衡——用经济学理性透视人类决策与市场博弈，建立分析现实世界运行规则的底层认知框架。"
    },
    {
        "id": "3cb4b57f-e15a-81dd-9936-dd1b92cead06",
        "d": "2026·05·12",
        "title": "【读书笔记】Influence Science and Practice_影响力_MiMo V2.5 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "说服心理学",
            "行为心理学",
            "社会认同",
            "决策诱导",
            "博弈心理"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/influence-science-and-practice-影响力-mimo-v2.5-pro.html",
        "src": "读书笔记 · 【读书笔记】Influence Science and Practice_影响力_MiMo V2.5 Pro",
        "text": "人类并非纯理性决策者，而是依赖心智捷径：系统拆解互惠、承诺一致、社会认同等七大说服开关，既是商业营销利器，亦是反操控防御指南。"
    },
    {
        "id": "3cb4b57f-e15a-8157-a824-f9a2c3a49c1d",
        "d": "2026·05·10",
        "title": "【读书笔记】The Almanack of Naval Ravikant_纳瓦尔宝典_Gemini 3.1 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "纳瓦尔",
            "财富复利",
            "杠杆思维",
            "长期主义",
            "幸福哲学"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-almanack-of-naval-ravikant-纳瓦尔宝典-gemini-3.1-pro.html",
        "src": "读书笔记 · 【读书笔记】The Almanack of Naval Ravikant_纳瓦尔宝典_Gemini 3.1 Pro",
        "text": "如何不靠运气致富：用代码、媒体、资本与专长构建杠杆，做复利游戏的长期玩家；提升判断力，在无人懂其妙处的世界里洞穿财富本质。"
    },
    {
        "id": "3cb4b57f-e15a-8177-89eb-c5f438c1b090",
        "d": "2026·04·15",
        "title": "【读书笔记】The Millionaire Fastlane_百万富翁快车道_MiMo V2 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "快车道定律",
            "系统构建",
            "影响力杠杆",
            "财富自由",
            "创业思维"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-millionaire-fastlane-百万富翁快车道-mimo-v2-pro.html",
        "src": "读书笔记 · 【读书笔记】The Millionaire Fastlane_百万富翁快车道_MiMo V2 Pro",
        "text": "打破65岁退休的慢车道谎言：构建拥有自主权与可复制性的系统资产，用影响力杠杆放大价值输出——真正实现财务自由与时间主权。"
    },
    {
        "id": "3cb4b57f-e15a-8186-a96b-ff35ddb5d447",
        "d": "2026·04·11",
        "title": "【读书笔记】Entrepreneurship_创业学_Claude Sonnet 4.6 Thinking",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "蒂蒙斯模型",
            "创业学",
            "商业机会",
            "资源整合",
            "初创团队"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/entrepreneurship-创业学-claude-sonnet-4.6-thinking.html",
        "src": "读书笔记 · 【读书笔记】Entrepreneurship_创业学_Claude Sonnet 4.6 Thinking",
        "text": "蒂蒙斯创业模型经典重构：创业不是冒险盲动，而是商机、团队与资源的动态平衡演进——用严密工程化体系管理不确定性，找出破局点。"
    },
    {
        "id": "3cb4b57f-e15a-81a3-b4c7-f9cc79f78cc1",
        "d": "2026·04·11",
        "title": "【读书笔记】Entrepreneurship Choice and Strategy_创业策略选择_GLM 5 Turbo",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "创业战略",
            "竞争优势",
            "知识产权",
            "架构模式",
            "战略指南针"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/entrepreneurship-choice-and-strategy-创业策略选择-glm-5-turbo.html",
        "src": "读书笔记 · 【读书笔记】Entrepreneurship Choice and Strategy_创业策略选择_GLM 5 Turbo",
        "text": "创业战略不是拍脑袋试错，而是关键路径的选择：知识产权、破坏式创新、价值链还是架构模式？用战略指南针锁定最适合团队的竞争生态位。"
    },
    {
        "id": "3cb4b57f-e15a-8162-aebd-e2b1613ec752",
        "d": "2026·04·11",
        "title": "【读书笔记】Competitive Strategy_竞争战略_Gemini Deep Research",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "迈克尔波特",
            "五力模型",
            "三大通用战略",
            "行业分析",
            "竞争壁垒"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/competitive-strategy-竞争战略-gemini-deep-research.html",
        "src": "读书笔记 · 【读书笔记】Competitive Strategy_竞争战略_Gemini Deep Research",
        "text": "迈克尔·波特战略经典重构：五力模型透视行业利润格局，三大通用战略找出破局点——以结构性壁垒赢得不可撼动的长期竞争优势。"
    },
    {
        "id": "3cb4b57f-e15a-8172-82f9-fb2a1965ef1c",
        "d": "2026·04·11",
        "title": "【读书笔记】Artificial Intelligence A Modern Approach_人工智能：一种现代的方法_Claude Sonnet 4.6 Thinking",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "人工智能",
            "智能Agent",
            "搜索算法",
            "知识表示",
            "强化学习"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/artificial-intelligence-a-modern-approach-人工智能一种现代的方法-claude-sonnet-4.6-thinking.html",
        "src": "读书笔记 · 【读书笔记】Artificial Intelligence A Modern Approach_人工智能：一种现代的方法_Claude Sonnet 4.6 Thinking",
        "text": "AI领域圣经AIMA核心重构：从理性Agent建模到搜索、知识图谱与强化学习——以目标驱动的智能体框架为线索，统一现代AI的技术底座。"
    },
    {
        "id": "3cb4b57f-e15a-8186-b718-db4104dde8da",
        "d": "2026·04·08",
        "title": "【读书笔记】The Art and Business of Online Writing_在线写作的艺术与商业_MiniMax M2.7",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "在线写作",
            "内容商业化",
            "注意力捕获",
            "社交媒体",
            "个人IP"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/the-art-and-business-of-online-writing-在线写作的艺术与商业-minimax-m2.7.html",
        "src": "读书笔记 · 【读书笔记】The Art and Business of Online Writing_在线写作的艺术与商业_MiniMax M2.7",
        "text": "数字时代的注意力捕获指南：从大纲钩子到社交飞轮，将高密度思考转化为超级传播内容——不做自嗨型作者，靠文字资产打造个人商业闭环。"
    },
    {
        "id": "3cb4b57f-e15a-813d-ac14-f35d0da3902f",
        "d": "2026·04·08",
        "title": "【读书笔记】Never Split the Difference_强势谈判_GLM 5.0",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "FBI谈判术",
            "战术共情",
            "极限施压",
            "危机公关",
            "博弈话术"
        ],
        "readTime": 45,
        "htmlContent": "https://quaxstudio.xyz/articles/never-split-the-difference-强势谈判-glm-5.0.html",
        "src": "读书笔记 · 【读书笔记】Never Split the Difference_强势谈判_GLM 5.0",
        "text": "前FBI首席谈判专家的博弈智慧：彻底摒弃妥协式折中，运用战术共情、镜像提问与校准问题掌控谈判主导权——将死局转化为己方胜局。"
    },
    {
        "id": "3cb4b57f-e15a-8144-acbf-c78b0650afbb",
        "d": "2026·04·07",
        "title": "【读书笔记】The Intelligent Investor_聪明的投资者_MiMo V2 Pro",
        "cat": "读书笔记",
        "tags": [
            "读书笔记",
            "格雷厄姆",
            "价值投资",
            "安全边际",
            "市场先生",
            "资产配置"
        ],
        "readTime": 34,
        "htmlContent": "https://quaxstudio.xyz/articles/the-intelligent-investor-聪明的投资者-mimo-v2-pro.html",
        "src": "读书笔记 · 【读书笔记】The Intelligent Investor_聪明的投资者_MiMo V2 Pro",
        "text": "格雷厄姆价值投资圣经：在市场先生的癫狂中保持绝对清醒，坚守“安全边际”底线原则——做理性的资产配置者，而非预测波动的赌徒。"
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

function extractPageIcon(
  pageObj: { icon?: unknown; properties?: Record<string, unknown> },
  fallbackTitle = ""
): AppIconInfo | null {
  // 1. Check native page.icon (Emoji or File/External image)
  if (isObj(pageObj.icon)) {
    const ic = pageObj.icon as Record<string, unknown>;
    if (ic.type === "emoji" && typeof ic.emoji === "string" && ic.emoji) {
      return { type: "emoji", value: ic.emoji };
    }
    if (ic.type === "file" && isObj(ic.file) && typeof ic.file.url === "string" && ic.file.url) {
      return { type: "image", value: ic.file.url };
    }
    if (ic.type === "external" && isObj(ic.external) && typeof ic.external.url === "string" && ic.external.url) {
      return { type: "image", value: ic.external.url };
    }
  }

  // 2. Check property AppEmoji or Emoji or AppIcon
  if (pageObj.properties) {
    const emojiVal =
      getRichText(pageObj.properties, "AppEmoji") ||
      getSelect(pageObj.properties, "AppEmoji") ||
      getRichText(pageObj.properties, "Emoji") ||
      getSelect(pageObj.properties, "Emoji");
    if (emojiVal) {
      return { type: "emoji", value: emojiVal };
    }

    const appIconUrl = extractFileUrl(pageObj, "AppIcon") || getUrl(pageObj.properties, "AppIconURL");
    if (appIconUrl) {
      return { type: "image", value: appIconUrl };
    }
  }

  // 3. Fallback emoji based on title
  const t = fallbackTitle.toLowerCase();
  if (t.includes("reader") || t.includes("minireader")) return { type: "emoji", value: "📖" };
  if (t.includes("cassette")) return { type: "emoji", value: "📼" };
  if (t.includes("memo") || t.includes("swiftmemo")) return { type: "emoji", value: "📝" };
  if (t.includes("muse") || t.includes("todo")) return { type: "emoji", value: "🌸" };
  if (t.includes("snake") || t.includes("retro")) return { type: "emoji", value: "🐍" };

  return null;
}

interface MagazineDataPayload {
  books: BookItem[];
  lab: LabItem[];
  flow: FlowStep[];
  tools: ToolItem[];
  sites: SiteItem[];
  prompts: PromptItem[];
  timeline: TimelineItem[];
  pause: PauseItem[];
  notes: NoteItem[];
  log: LogItem[];
}

let cachedMagazineData: MagazineDataPayload | null = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60s in-memory cache for lightning-fast SSR

export async function fetchMagazineData(): Promise<MagazineDataPayload> {
  const now = Date.now();
  if (cachedMagazineData && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return cachedMagazineData;
  }

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

  const [booksRes, labRes, workflowRes, timelineRes, pauseRes, notesRes, logRes] = await Promise.allSettled([
    // 1. Books
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_BOOKS_DB_ID) return null;
      return await queryDatabaseAll({ databaseId: env.NOTION_BOOKS_DB_ID, pageSize: 50, maxPages: 2 });
    })(),
    // 2. Lab
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_LAB_DB_ID) return null;
      return await queryDatabaseAll({ databaseId: env.NOTION_LAB_DB_ID, pageSize: 50, maxPages: 2 });
    })(),
    // 3. Workflow
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_WORKFLOW_DB_ID) return null;
      return await queryDatabaseAll({ databaseId: env.NOTION_WORKFLOW_DB_ID, pageSize: 50, maxPages: 2 });
    })(),
    // 4. Timeline
    (async () => {
      return await getTimelineEntries();
    })(),
    // 5. Pause
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_PAUSE_DB_ID) return null;
      return await queryDatabaseAll({ databaseId: env.NOTION_PAUSE_DB_ID, pageSize: 50, maxPages: 2 });
    })(),
    // 6. Notes
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_NOTES_DB_ID) return null;
      return await queryDatabaseAll({
        databaseId: env.NOTION_NOTES_DB_ID,
        pageSize: 50,
        maxPages: 2,
        sorts: [{ property: "Date", direction: "descending" }],
      });
    })(),
    // 7. Log
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_CHANGELOG_DB_ID) return null;
      return await queryDatabaseAll({
        databaseId: env.NOTION_CHANGELOG_DB_ID,
        pageSize: 50,
        maxPages: 2,
        sorts: [{ property: "Date", direction: "descending" }],
      });
    })(),
  ]);

  if (booksRes.status === "fulfilled" && booksRes.value && booksRes.value.length > 0) {
    try {
      books = booksRes.value.map((p) => {
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
    } catch (e) {
      console.warn("Error parsing books:", e);
    }
  }

  if (labRes.status === "fulfilled" && labRes.value && labRes.value.length > 0) {
    try {
      lab = labRes.value.map((p) => {
        const props = p.properties as Record<string, unknown>;
        const type = (getSelect(props, "Type") ?? "").toLowerCase();
        const tag = type.includes("vibe") ? "Vibe Coding" : "AI 实践";
        const gh = getUrl(props, "GitHubURL");
        const dm = getUrl(props, "DemoURL");
        const links: [string, string][] = [];
        if (gh) links.push(["GitHub", gh]);
        if (dm) links.push(["Demo", dm]);
        const title = getPageTitle(p);
        return {
          id: p.id,
          tag: getRichText(props, "Badge") || tag,
          t: title,
          d: getRichText(props, "Description") || "",
          links,
          iconUrl: extractFileUrl(p, "Icon"),
          appIcon: extractPageIcon(p, title),
        };
      });
    } catch (e) {
      console.warn("Error parsing lab:", e);
    }
  }

  if (workflowRes.status === "fulfilled" && workflowRes.value && workflowRes.value.length > 0) {
    try {
      const fetchedTools: ToolItem[] = [];
      const fetchedSites: SiteItem[] = [];
      const fetchedPrompts: PromptItem[] = [];

      workflowRes.value.forEach((p) => {
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
    } catch (e) {
      console.warn("Error parsing workflow:", e);
    }
  }

  if (timelineRes.status === "fulfilled" && timelineRes.value && timelineRes.value.length > 0) {
    try {
      timeline = timelineRes.value.slice(0, 10).map((entry) => ({
        d: entry.date ? entry.date.replace(/-/g, "·").slice(0, 7) : "2026",
        t: entry.name || entry.model || "模型更新",
        note: entry.highlights || entry.version || "大模型更新发布",
      }));
    } catch (e) {
      console.warn("Error parsing timeline:", e);
    }
  }

  if (pauseRes.status === "fulfilled" && pauseRes.value && pauseRes.value.length > 0) {
    try {
      pause = pauseRes.value.map((p) => {
        const props = p.properties as Record<string, unknown>;
        const coverUrl = extractFileUrl(p, "Cover") || "/photos/photo_1_.jpeg";
        const rawDate = getDate(props, "Date") || "2026·05";
        return {
          id: p.id,
          d: rawDate.replace(/-/g, "·"),
          loc: getRichText(props, "Location") || "世界角落",
          t: getPageTitle(p),
          img: coverUrl,
        };
      });
    } catch (e) {
      console.warn("Error parsing pause:", e);
    }
  }

  if (notesRes.status === "fulfilled" && notesRes.value && notesRes.value.length > 0) {
    try {
      notes = notesRes.value.map((p) => {
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
    } catch (e) {
      console.warn("Error parsing notes:", e);
    }
  }

  if (logRes.status === "fulfilled" && logRes.value && logRes.value.length > 0) {
    try {
      log = logRes.value.map((p) => {
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
    } catch (e) {
      console.warn("Error parsing log:", e);
    }
  }

  const result: MagazineDataPayload = {
    books: Array.isArray(books) ? books : [],
    lab: Array.isArray(lab) ? lab : [],
    flow: Array.isArray(flow) ? flow : [],
    tools: Array.isArray(tools) ? tools : [],
    sites: Array.isArray(sites) ? sites : [],
    prompts: Array.isArray(prompts) ? prompts : [],
    timeline: Array.isArray(timeline) ? timeline : [],
    pause: Array.isArray(pause) ? pause : [],
    notes: Array.isArray(notes) ? notes : [],
    log: Array.isArray(log) ? log : [],
  };

  try {
    const cleanPayload = JSON.parse(JSON.stringify(result)) as MagazineDataPayload;
    cachedMagazineData = cleanPayload;
    lastCacheTimestamp = Date.now();
    return cleanPayload;
  } catch {
    cachedMagazineData = result;
    lastCacheTimestamp = Date.now();
    return result;
  }
}
