import React from "react";

interface TagPillProps {
  tag: string;
  className?: string;
}

const AI_MODEL_REGEX = /^(GLM|Claude|Gemini|GPT|DeepSeek|MiniMax|MiMo|OX\s*Alpha|Special|现代智识风)/i;

export function getTagVariant(tag: string): "model" | "growth" | "finance" | "tech" | "mind" | "brand" | "default" {
  if (AI_MODEL_REGEX.test(tag)) {
    return "model";
  }

  const t = tag.toLowerCase();

  // Finance / Wealth / Investment
  if (t.includes("财") || t.includes("投资") || t.includes("金钱") || t.includes("价值") || t.includes("商业") || t.includes("估值") || t.includes("fire")) {
    return "finance";
  }

  // Cognition / Psychology / Philosophy / Time
  if (t.includes("心理") || t.includes("认知") || t.includes("思维") || t.includes("哲学") || t.includes("时间") || t.includes("决策") || t.includes("系统")) {
    return "mind";
  }

  // Creation / Content / Brand / Marketing
  if (t.includes("创作") || t.includes("写作") || t.includes("品牌") || t.includes("营销") || t.includes("广告") || t.includes("文案") || t.includes("作品") || t.includes("ip") || t.includes("展示")) {
    return "brand";
  }

  // Tech / AI / System / Dev
  if (t.includes("ai") || t.includes("代码") || t.includes("智能") || t.includes("算法") || t.includes("数据") || t.includes("模型") || t.includes("agent") || t.includes("深度学习")) {
    return "tech";
  }

  // Personal Growth / Habits / Workflows
  if (t.includes("成长") || t.includes("习惯") || t.includes("管理") || t.includes("生产力") || t.includes("工作流") || t.includes("okr") || t.includes("创业")) {
    return "growth";
  }

  return "default";
}

export function TagPill({ tag, className = "" }: TagPillProps) {
  const variant = getTagVariant(tag);
  const isModel = variant === "model";

  return (
    <span className={`tag-pill tag-pill-${variant} ${className}`}>
      {isModel ? <span className="tag-pill-icon">✦</span> : <span className="tag-pill-hash">#</span>}
      <span className="tag-pill-text">{tag}</span>
    </span>
  );
}
