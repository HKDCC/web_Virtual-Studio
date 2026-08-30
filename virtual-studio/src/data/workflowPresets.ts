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
  }
];
