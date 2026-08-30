export interface ArenaModelItem {
  rank: number;
  name: string;
  provider: string;
  company: "Anthropic" | "Moonshot" | "Alibaba" | "Zhipu" | "OpenAI" | "Google" | "DeepSeek" | "xAI" | "Tencent" | "MiniMax" | "Other";
  score: number; // Arena WebDev Elo Score
  ci: string; // e.g. "±9"
  votes?: string;
  license?: string;
  logoUrl: string;
  color: string;
  date?: string;
  highlightNote?: string;
}

export const ARENA_WEBDEV_LEADERBOARD: ArenaModelItem[] = [
  {
    rank: 1,
    name: "Claude Opus 5 (max)",
    provider: "Anthropic",
    company: "Anthropic",
    score: 1691,
    ci: "±9",
    votes: "8,116",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg",
    color: "#D97757",
    date: "2026-08",
    highlightNote: "Arena 全球 WebDev 榜首，极高代码生成与复杂前端重构能力。"
  },
  {
    rank: 2,
    name: "Kimi K3 (max)",
    provider: "Moonshot",
    company: "Moonshot",
    score: 1674,
    ci: "±11",
    votes: "6,420",
    license: "K3 License",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/kimi.svg",
    color: "#5046E5",
    date: "2026-08",
    highlightNote: "长上下文长链推理新标杆，多轮代码调试鲁棒性极佳。"
  },
  {
    rank: 3,
    name: "Qwen3.8-Max",
    provider: "Alibaba",
    company: "Alibaba",
    score: 1669,
    ci: "±13",
    votes: "5,890",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg",
    color: "#FF6A00",
    date: "2026-08",
    highlightNote: "开源/商业旗舰并举，复杂全栈组件逻辑推导表现卓越。"
  },
  {
    rank: 4,
    name: "Claude Opus 5 (high)",
    provider: "Anthropic",
    company: "Anthropic",
    score: 1663,
    ci: "±8",
    votes: "7,540",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg",
    color: "#D97757",
    date: "2026-08",
    highlightNote: "Anthropic 旗舰高算力档位，长文本代码理解与上下文召回极强。"
  },
  {
    rank: 5,
    name: "GLM-5.3-Flash",
    provider: "Z.ai (智谱)",
    company: "Zhipu",
    score: 1634,
    ci: "±18",
    votes: "4,120",
    license: "MIT",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zhipu.svg",
    color: "#3B82F6",
    date: "2026-08",
    highlightNote: "首个杀入前五的开源极速 Flash 模型，性价比与响应速度惊艳。"
  },
  {
    rank: 6,
    name: "Hunyuan 4 (hy4-preview)",
    provider: "Tencent",
    company: "Tencent",
    score: 1633,
    ci: "±17",
    votes: "3,890",
    license: "Apache 2.0",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/tencent.svg",
    color: "#0052D9",
    date: "2026-08",
    highlightNote: "腾讯混元新一代代码预览版，前端排版与视觉还原表现优异。"
  },
  {
    rank: 7,
    name: "Grok 4.6 (high)",
    provider: "xAI",
    company: "xAI",
    score: 1629,
    ci: "±17",
    votes: "4,600",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/grok.svg",
    color: "#1D9BF0",
    date: "2026-08",
    highlightNote: "xAI 全新推理架构，高思维链解题与复杂 AST 重构得分跃升。"
  },
  {
    rank: 8,
    name: "Claude Fable 5",
    provider: "Anthropic",
    company: "Anthropic",
    score: 1626,
    ci: "±8",
    votes: "6,200",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg",
    color: "#D97757",
    date: "2026-08",
    highlightNote: "轻量高频交互利器，兼顾极高代码审美与执行准确度。"
  },
  {
    rank: 9,
    name: "GPT-5.6 Sol (xhigh / codex)",
    provider: "OpenAI",
    company: "OpenAI",
    score: 1619,
    ci: "±8",
    votes: "9,450",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg",
    color: "#10A37F",
    date: "2026-08",
    highlightNote: "OpenAI 新旗舰编码架构，多文件工程协作与测试自愈主力。"
  },
  {
    rank: 10,
    name: "GLM-5.3-Max",
    provider: "Z.ai (智谱)",
    company: "Zhipu",
    score: 1599,
    ci: "±15",
    votes: "4,820",
    license: "MIT",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zhipu.svg",
    color: "#3B82F6",
    date: "2026-08",
    highlightNote: "智谱开源满血版，具备深度的算法级代码解析与重写能力。"
  },
  {
    rank: 11,
    name: "Gemini 3.7 Flash (high)",
    provider: "Google",
    company: "Google",
    score: 1587,
    ci: "±13",
    votes: "8,900",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini.svg",
    color: "#4285F4",
    date: "2026-08",
    highlightNote: "Google 百万超长上下文极速模型，全仓库代码扫描利器。"
  },
  {
    rank: 12,
    name: "DeepSeek V4 Pro (0813 max)",
    provider: "DeepSeek",
    company: "DeepSeek",
    score: 1582,
    ci: "±12",
    votes: "9,800",
    license: "MIT",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek.svg",
    color: "#4D6BFE",
    date: "2026-08",
    highlightNote: "国产开源代码推理巅峰，深度审校与边界 Corner-case 挑错首选。"
  }
];

export function getBenchmarkLogo(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("claude")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg";
  if (n.includes("kimi") || n.includes("moonshot")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/kimi.svg";
  if (n.includes("qwen") || n.includes("千问")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg";
  if (n.includes("glm") || n.includes("智谱") || n.includes("z.ai")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zhipu.svg";
  if (n.includes("gpt") || n.includes("openai") || n.includes("codex")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg";
  if (n.includes("gemini") || n.includes("google")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini.svg";
  if (n.includes("deepseek")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek.svg";
  if (n.includes("grok") || n.includes("xai")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/grok.svg";
  if (n.includes("hunyuan") || n.includes("hy4") || n.includes("tencent")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/tencent.svg";
  if (n.includes("minimax")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/minimax.svg";
  return "/logos/antigravity.svg";
}
