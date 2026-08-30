export interface WorkflowStep {
  id: string;
  name: string;
  type: "tool" | "model" | "prompt" | "input" | "output" | "script";
  description: string;
  entityName?: string;
}

export interface WorkflowPhase {
  phaseNumber: number;
  title: string;
  summary: string;
  steps: WorkflowStep[];
}

export interface PresetWorkflow {
  id: string;
  title: string;
  tagline: string;
  category: "学术本地化" | "代码工程" | "视觉生成" | "日常效率" | "AI研究";
  badge: string;
  tags: string[];
  phases: WorkflowPhase[];
  keyEntities: string[];
  appendixNoteTitle?: string;
  appendixNoteId?: string;
}

export const WORKFLOW_PRESETS: PresetWorkflow[] = [
  {
    id: "wf-obviously-awesome",
    title: "《Obviously Awesome》全书本地化与自动排版",
    tagline: "两日交付 3.1 万字。大上下文初译、双模型专家挑错、错题本自愈排版全闭环。",
    category: "学术本地化",
    badge: "实战标杆 · 3.1万字",
    tags: ["书籍本地化", "双模型审校", "自动化排版", "自愈错题本"],
    appendixNoteTitle: "Obviously Awesome本地化项目笔记",
    appendixNoteId: "3a11d5da-bc25-80b2-8e28-e4f51fcb5e76",
    keyEntities: [
      "Antigravity",
      "Python 正则清洗脚本",
      "/grill-me 意图拷问",
      "本地化三大法则",
      "Gemini 3.5 Flash",
      "DeepSeek V4 Pro",
      "walkthrough 错题本",
      "Pandoc",
      "verify.py 校验脚本"
    ],
    phases: [
      {
        phaseNumber: 1,
        title: "第一阶段：前置清洗与意图对齐",
        summary: "PDF 文档导入工作区，正则脱水去噪，并通过深度拷问锁定全局术语表与文风基调。",
        steps: [
          {
            id: "step-1-1",
            name: "PDF 导入 Antigravity 工作区",
            type: "input",
            description: "将英文原版 PDF 放入工作区并解析为章节骨架。",
            entityName: "Antigravity"
          },
          {
            id: "step-1-2",
            name: "Python 脚本正则去噪",
            type: "script",
            description: "去除页眉页脚、扫描杂质与不规则换行，输出脱水 Markdown 章节。",
            entityName: "Python 正则清洗脚本"
          },
          {
            id: "step-1-3",
            name: "执行 /grill-me 拷问模式",
            type: "prompt",
            description: "AI 发起多轮深度交互问答，锁定《本地化三大法则》与初始术语表。",
            entityName: "/grill-me 意图拷问"
          }
        ]
      },
      {
        phaseNumber: 2,
        title: "第二阶段：人机双轨迭代与习惯固化",
        summary: "Gemini 1M 原生上下文初译 + DeepSeek MRCR 专家模式挑错，双引擎协作高水平精润。",
        steps: [
          {
            id: "step-2-1",
            name: "Gemini 3.5 Flash 初译层",
            type: "model",
            description: "利用 100 万 Token 原生上下文，全书记忆术语连贯输出初译稿。",
            entityName: "Gemini 3.5 Flash"
          },
          {
            id: "step-2-2",
            name: "DeepSeek V4 Pro 审校层",
            type: "model",
            description: "专家模式深度挑错与高水平润色，消除翻译腔，注入商业博弈质感。",
            entityName: "DeepSeek V4 Pro"
          },
          {
            id: "step-2-3",
            name: "AGENTS.md & walkthrough 固化",
            type: "prompt",
            description: "将踩坑经验与排版规则写入错题本，实现后续章节自愈迭代。",
            entityName: "walkthrough 错题本"
          }
        ]
      },
      {
        phaseNumber: 3,
        title: "第三阶段：算法排版与校验交付",
        summary: "自动化编译脚本驱动 Pandoc 与 Word COM，自动校验格式与页码并生成交付文件。",
        steps: [
          {
            id: "step-3-1",
            name: "EPUB / PDF 自动化编译排版",
            type: "tool",
            description: "调用 Pandoc 引擎打包 EPUB，并驱动 Word COM 完成高品质 PDF 排版。",
            entityName: "Pandoc"
          },
          {
            id: "step-3-2",
            name: "verify.py 自动校验",
            type: "script",
            description: "自动化脚本扫描全书缺失引用、破损图片与排版截断报错。",
            entityName: "verify.py 校验脚本"
          },
          {
            id: "step-3-3",
            name: "交付精排全译本 (PDF / EPUB)",
            type: "output",
            description: "产出达到出版级标准的精排中文电子书与项目复盘笔记。",
            entityName: "Obviously Awesome 笔记"
          }
        ]
      }
    ]
  },
  {
    id: "wf-academic-arxiv",
    title: "arXiv 前沿论文秒级综述与知识库沉淀",
    tagline: "自动化追踪前沿学术源，Firecrawl 深度脱水，2M 窗口提炼，一键沉淀团队知识库。",
    category: "学术本地化",
    badge: "自动化 · 每日订阅",
    tags: ["arXiv", "学术论文", "Firecrawl", "Notion 归档"],
    keyEntities: [
      "arXiv 订阅源",
      "Firecrawl",
      "Gemini 3.5 Flash",
      "学术翻译模板",
      "Claude 3.7 Sonnet",
      "Notion 知识库"
    ],
    phases: [
      {
        phaseNumber: 1,
        title: "第一阶段：订阅与抓取脱水",
        summary: "订阅源推送最新 PDF，Firecrawl 绕过反爬深度提取全文 Markdown。",
        steps: [
          {
            id: "step-ar-1",
            name: "arXiv 订阅源推送",
            type: "input",
            description: "定时获取 AI / CV / NLP 最新顶会论文 PDF 链接。",
            entityName: "arXiv 订阅源"
          },
          {
            id: "step-ar-2",
            name: "Firecrawl 网页/文档提取",
            type: "tool",
            description: "将复杂的双栏 PDF 转译为规范清晰的结构化纯文本。",
            entityName: "Firecrawl"
          }
        ]
      },
      {
        phaseNumber: 2,
        title: "第二阶段：长文本精读与学术润色",
        summary: "超长上下文模型一口气通读全文，提炼创新点与方法论大纲。",
        steps: [
          {
            id: "step-ar-3",
            name: "Gemini 3.5 Flash 核心大纲提炼",
            type: "model",
            description: "精读全书方法论、实验数据与消融实验结论。",
            entityName: "Gemini 3.5 Flash"
          },
          {
            id: "step-ar-4",
            name: "学术翻译与逻辑重组模板",
            type: "prompt",
            description: "按学术综述规范严谨重述公式与定理含义。",
            entityName: "学术翻译模板"
          }
        ]
      },
      {
        phaseNumber: 3,
        title: "第三阶段：相关性打分与 Notion 自动归档",
        summary: "高智能模型评估学术价值，结构化同步至个人与团队知识库看板。",
        steps: [
          {
            id: "step-ar-5",
            name: "Claude 3.7 Sonnet 价值评分",
            type: "model",
            description: "多维度评估论文创新性与工程落地可行性。",
            entityName: "Claude 3.7 Sonnet"
          },
          {
            id: "step-ar-6",
            name: "Notion 知识库自动发布",
            type: "output",
            description: "自动写入 Notion 论文数据库并触发双向关联标签。",
            entityName: "Notion 知识库"
          }
        ]
      }
    ]
  },
  {
    id: "wf-fullstack-refactor",
    title: "全栈代码重构与端到端架构自愈",
    tagline: "从架构意图拷问到全自动化单元测试，智能体闭环解决复杂技术债务。",
    category: "代码工程",
    badge: "开发主力 · 自愈闭环",
    tags: ["全栈重构", "TypeScript", "Antigravity", "Cursor", "自动化校验"],
    keyEntities: [
      "Cursor",
      "Antigravity",
      "Claude 3.7 Sonnet",
      "DeepSeek V4 Pro",
      "架构重构法则",
      "Three.js"
    ],
    phases: [
      {
        phaseNumber: 1,
        title: "第一阶段：上下文扫描与意图对齐",
        summary: "遍历项目所有代码与依赖树，定位架构瓶颈与高危依赖项。",
        steps: [
          {
            id: "step-fs-1",
            name: "代码全景扫描与 AST 分析",
            type: "input",
            description: "读取 TypeScript AST 与 Next.js 路由结构。",
            entityName: "Cursor"
          },
          {
            id: "step-fs-2",
            name: "执行 /grill-me 架构意图对齐",
            type: "prompt",
            description: "厘清模块职责边界、技术选型与性能基准指标。",
            entityName: "/grill-me 意图拷问"
          }
        ]
      },
      {
        phaseNumber: 2,
        title: "第二阶段：双引擎代码编写与类型推导",
        summary: "Claude 负责核心算法与复杂交互架构，DeepSeek 负责边界 Corner-case 挑错。",
        steps: [
          {
            id: "step-fs-3",
            name: "Claude 3.7 Sonnet 主力编码",
            type: "model",
            description: "编写高内聚低耦合的组件逻辑与 3D 渲染管线。",
            entityName: "Claude 3.7 Sonnet"
          },
          {
            id: "step-fs-4",
            name: "Three.js 3D 渲染流水线优化",
            type: "tool",
            description: "构建 60FPS 丝滑的轻量级 3D 纸墨星象仪力导向场景。",
            entityName: "Three.js"
          }
        ]
      },
      {
        phaseNumber: 3,
        title: "第三阶段：自动化编译检查与错题本固化",
        summary: "TypeScript 严格类型检查与边缘构建测试，将构建避坑指南固化至项目规范。",
        steps: [
          {
            id: "step-fs-5",
            name: "TypeScript & Next.js 严格校验",
            type: "script",
            description: "自动化运行类型检查与 Cloudflare Pages 边缘打包模拟。",
            entityName: "verify.py 校验脚本"
          },
          {
            id: "step-fs-6",
            name: "架构变更复盘与 Walkthrough 生成",
            type: "output",
            description: "自动沉淀代码重构演化日志与技术文档。",
            entityName: "walkthrough 错题本"
          }
        ]
      }
    ]
  },
  {
    id: "wf-midjourney-gen",
    title: "Midjourney 视觉创意生成与灵感画廊",
    tagline: "从概念脑暴、艺术风格尾缀调参到高质量垫图参考，打造高质感艺术画廊。",
    category: "视觉生成",
    badge: "创意美学 · 画廊归档",
    tags: ["Midjourney", "ComfyUI", "提示词工程", "色彩探索"],
    keyEntities: [
      "DeepSeek V4 Pro",
      "Claude 3.7 Sonnet",
      "Midjourney 提示词模板",
      "Firecrawl",
      "Notion 知识库"
    ],
    phases: [
      {
        phaseNumber: 1,
        title: "第一阶段：创意脑暴与语义细化",
        summary: "输入概念雏形，推理模型深度扩写画面光影、透视与情绪细节。",
        steps: [
          {
            id: "step-mj-1",
            name: "灵感主题输入",
            type: "input",
            description: "输入原始设计意向（如：纸墨星象仪、东方人文微光）。",
            entityName: "灵感提示词输入"
          },
          {
            id: "step-mj-2",
            name: "DeepSeek V4 Pro 画面细节扩写",
            type: "model",
            description: "输出符合物理光学与艺术流派规律的高精度英文描述词。",
            entityName: "DeepSeek V4 Pro"
          }
        ]
      },
      {
        phaseNumber: 2,
        title: "第二阶段：参数调优与参考图抓取",
        summary: "应用艺术风格模板，配合 Firecrawl 提取配色方案垫图。",
        steps: [
          {
            id: "step-mj-3",
            name: "Midjourney 提示词模板配置",
            type: "prompt",
            description: "注入艺术渲染参数（--ar 16:9, --stylize 250, --v 6.1）。",
            entityName: "Midjourney 提示词模板"
          },
          {
            id: "step-mj-4",
            name: "Firecrawl 配色参考抓取",
            type: "tool",
            description: "爬取艺术博物馆与调色盘参考图片 URL 作为垫图。",
            entityName: "Firecrawl"
          }
        ]
      },
      {
        phaseNumber: 3,
        title: "第三阶段：生图渲染与 Notion 画廊归档",
        summary: "调用生成接口批量出图，元数据自动同步至 Notion 视觉归档看板。",
        steps: [
          {
            id: "step-mj-5",
            name: "Claude 3.7 Sonnet 语义精修与出图",
            type: "model",
            description: "最终语义微调并分发渲染任务。",
            entityName: "Claude 3.7 Sonnet"
          },
          {
            id: "step-mj-6",
            name: "Notion 视觉画廊自动归档",
            type: "output",
            description: "将原图、种子号与双语提示词完整记录进 Notion 数据库。",
            entityName: "Notion 知识库"
          }
        ]
      }
    ]
  }
];
