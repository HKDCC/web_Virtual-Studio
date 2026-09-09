export interface ArenaModelItem {
  rank: number;
  name: string;
  provider: string;
  company: "Anthropic" | "Moonshot" | "Alibaba" | "Zhipu" | "OpenAI" | "Google" | "DeepSeek" | "xAI" | "Tencent" | "MiniMax" | "Meta" | "Other";
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
    name: "GPT-6 Astra (max)",
    provider: "OpenAI",
    company: "OpenAI",
    score: 1796,
    ci: "±19",
    votes: "1,810",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg",
    color: "#10A37F",
    date: "2026-09",
    highlightNote: "OpenAI 全新一代旗舰架构，WebDev 全局评测断崖式登顶。"
  },
  {
    rank: 2,
    name: "Claude Fable 5.1 (max)",
    provider: "Anthropic",
    company: "Anthropic",
    score: 1764,
    ci: "±15",
    votes: "2,570",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg",
    color: "#D97757",
    date: "2026-09",
    highlightNote: "Anthropic 新世代自适应推理旗舰，复杂系统架构与前端重构极高胜率。"
  },
  {
    rank: 3,
    name: "Claude Opus 5 (max)",
    provider: "Anthropic",
    company: "Anthropic",
    score: 1688,
    ci: "±8",
    votes: "11,396",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg",
    color: "#D97757",
    date: "2026-09",
    highlightNote: "超万票盲测验证，多文件工程协作与代码生成稳定性极强。"
  },
  {
    rank: 4,
    name: "Qwen3.8-Max (0902)",
    provider: "Alibaba",
    company: "Alibaba",
    score: 1685,
    ci: "±16",
    votes: "1,973",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg",
    color: "#FF6A00",
    date: "2026-09",
    highlightNote: "阿里九月升级版，复杂全栈组件逻辑与前端交互推演极佳。"
  },
  {
    rank: 5,
    name: "Kimi K3 (max)",
    provider: "Moonshot",
    company: "Moonshot",
    score: 1674,
    ci: "±11",
    votes: "4,546",
    license: "K3 License",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/kimi.svg",
    color: "#5046E5",
    date: "2026-09",
    highlightNote: "长上下文推理与交互式前端调试新标杆，自愈成功率拔尖。"
  },
  {
    rank: 6,
    name: "Qwen3.8-Max",
    provider: "Alibaba",
    company: "Alibaba",
    score: 1670,
    ci: "±12",
    votes: "3,218",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg",
    color: "#FF6A00",
    date: "2026-09",
    highlightNote: "商业大模型中坚力量，多轮代码调试与模块化重构表现稳健。"
  },
  {
    rank: 7,
    name: "Claude Opus 5 (high)",
    provider: "Anthropic",
    company: "Anthropic",
    score: 1661,
    ci: "±7",
    votes: "11,497",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg",
    color: "#D97757",
    date: "2026-09",
    highlightNote: "Anthropic 高算力档位，长文本代码理解与上下文召回极强。"
  },
  {
    rank: 8,
    name: "Muse Spark 1.3 (max)",
    provider: "Meta",
    company: "Meta",
    score: 1650,
    ci: "±18",
    votes: "1,344",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/meta.svg",
    color: "#0081FB",
    date: "2026-09",
    highlightNote: "Meta 全新 Agentic Coding 闭源旗舰，UI 审美与工程落地表现突出。"
  },
  {
    rank: 9,
    name: "Qwen3.8-Flash-Next",
    provider: "Alibaba",
    company: "Alibaba",
    score: 1631,
    ci: "±14",
    votes: "2,377",
    license: "Community",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg",
    color: "#FF6A00",
    date: "2026-09",
    highlightNote: "高吞吐轻量代码架构，兼顾亚秒级响应与前沿 Web 生成质量。"
  },
  {
    rank: 10,
    name: "Claude Fable 5",
    provider: "Anthropic",
    company: "Anthropic",
    score: 1628,
    ci: "±8",
    votes: "9,595",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg",
    color: "#D97757",
    date: "2026-09",
    highlightNote: "轻量高频交互利器，兼顾极高代码审美与执行准确度。"
  },
  {
    rank: 11,
    name: "Grok 4.6 (high)",
    provider: "xAI",
    company: "xAI",
    score: 1624,
    ci: "±11",
    votes: "3,727",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/grok.svg",
    color: "#1D9BF0",
    date: "2026-09",
    highlightNote: "xAI 全新推理架构，高思维链解题与复杂 AST 重构得分跃升。"
  },
  {
    rank: 12,
    name: "Hunyuan 4 (hy4-preview)",
    provider: "Tencent",
    company: "Tencent",
    score: 1623,
    ci: "±15",
    votes: "1,838",
    license: "Apache 2.0",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/tencent.svg",
    color: "#0052D9",
    date: "2026-09",
    highlightNote: "腾讯混元新一代代码预览版，前端排版与视觉还原表现优异。"
  },
  {
    rank: 13,
    name: "GPT-5.6 Sol (xhigh / codex)",
    provider: "OpenAI",
    company: "OpenAI",
    score: 1617,
    ci: "±7",
    votes: "11,344",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg",
    color: "#10A37F",
    date: "2026-09",
    highlightNote: "OpenAI 经典 Codex 架构主力，多文件工程协作与测试自愈利器。"
  },
  {
    rank: 14,
    name: "GLM-5.3-Max",
    provider: "Z.ai (智谱)",
    company: "Zhipu",
    score: 1613,
    ci: "±12",
    votes: "3,213",
    license: "MIT",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zhipu.svg",
    color: "#3B82F6",
    date: "2026-09",
    highlightNote: "智谱开源满血版，具备深度的算法级代码解析与重写能力。"
  },
  {
    rank: 15,
    name: "GLM-5.3-Flash",
    provider: "Z.ai (智谱)",
    company: "Zhipu",
    score: 1605,
    ci: "±14",
    votes: "2,259",
    license: "MIT",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zhipu.svg",
    color: "#3B82F6",
    date: "2026-09",
    highlightNote: "开源极速 Flash 模型，高并发场景下性价比与生成速度惊艳。"
  },
  {
    rank: 16,
    name: "Qwen3.8-27B",
    provider: "Alibaba",
    company: "Alibaba",
    score: 1591,
    ci: "±10",
    votes: "3,906",
    license: "Apache 2.0",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg",
    color: "#FF6A00",
    date: "2026-09",
    highlightNote: "端侧与本地部署首选尺寸，全栈前端模板与组件库支持完善。"
  },
  {
    rank: 17,
    name: "GLM-5.2-Max",
    provider: "Z.ai (智谱)",
    company: "Zhipu",
    score: 1589,
    ci: "±7",
    votes: "10,087",
    license: "MIT",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zhipu.svg",
    color: "#3B82F6",
    date: "2026-09",
    highlightNote: "经历万次验证的高稳定开源权重，Web 开发通用鲁棒性卓越。"
  },
  {
    rank: 18,
    name: "Gemini 3.7 Flash (high)",
    provider: "Google",
    company: "Google",
    score: 1587,
    ci: "±12",
    votes: "3,003",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini.svg",
    color: "#4285F4",
    date: "2026-09",
    highlightNote: "Google 百万超长上下文极速模型，全仓库代码扫描与跨文件解析。"
  },
  {
    rank: 19,
    name: "DeepSeek V4 Flash (high)",
    provider: "DeepSeek",
    company: "DeepSeek",
    score: 1582,
    ci: "±10",
    votes: "4,410",
    license: "MIT",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek.svg",
    color: "#4D6BFE",
    date: "2026-09",
    highlightNote: "国产开源代码推理标杆，低延迟与代码逻辑推导平衡极佳。"
  },
  {
    rank: 20,
    name: "Gemini 3.8 Flash (high)",
    provider: "Google",
    company: "Google",
    score: 1568,
    ci: "±11",
    votes: "3,120",
    license: "Proprietary",
    logoUrl: "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini.svg",
    color: "#4285F4",
    date: "2026-09",
    highlightNote: "Google 新一代多模态编程模型，WebDev 视觉与交互理解提升明显。"
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
  if (n.includes("meta") || n.includes("muse")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/meta.svg";
  return "/logos/antigravity.svg";
}
