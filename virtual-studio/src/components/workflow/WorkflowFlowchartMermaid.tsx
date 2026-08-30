"use client";

import { useEffect, useState, useRef, useId } from "react";
import mermaid from "mermaid";
import { PresetWorkflow } from "@/data/workflowPresets";

interface WorkflowFlowchartMermaidProps {
  workflow: PresetWorkflow;
  onSelectEntityName?: (name: string) => void;
}

export function WorkflowFlowchartMermaid({ workflow, onSelectEntityName }: WorkflowFlowchartMermaidProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [zoom, setZoom] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartId = useId().replace(/:/g, "_");

  const handleZoomIn = () => setZoom((z) => Math.min(1.5, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.65, z - 0.15));
  const handleReset = () => setZoom(1);

  // Generate Mermaid Syntax from Workflow
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      securityLevel: "loose",
      fontFamily: "var(--mono), -apple-system, sans-serif",
      themeVariables: {
        primaryColor: "#FFFDF9",
        primaryTextColor: "#161310",
        primaryBorderColor: "#C2431B",
        lineColor: "#8E5034",
        secondaryColor: "#F4EFE6",
        tertiaryColor: "#FFFFFF",
      },
    });

    let code = "";

    if (workflow.id === "wf-obviously-awesome") {
      // Full Complete Edition optimized for Layout, Typography & Self-Healing Loops
      code = `flowchart TD
    %% 样式表定义
    classDef init fill:#FFFBEB,stroke:#F59E0B,stroke-width:1.5px,color:#161310,rx:8px,ry:8px;
    classDef action fill:#FFF1F2,stroke:#F43F5E,stroke-width:1.5px,color:#161310,rx:8px,ry:8px;
    classDef process fill:#F0F9FF,stroke:#0284C7,stroke-width:1.5px,color:#161310,rx:8px,ry:8px;
    classDef review fill:#ECFDF5,stroke:#10B981,stroke-width:1.5px,color:#161310,rx:8px,ry:8px;
    classDef memory fill:#F5F3FF,stroke:#8B5CF6,stroke-width:1.5px,color:#161310,rx:8px,ry:8px;
    classDef check fill:#FFF7ED,stroke:#EA580C,stroke-width:1.5px,color:#161310,rx:8px,ry:8px;
    classDef output fill:#FEF2F2,stroke:#C2431B,stroke-width:2.5px,color:#161310,rx:10px,ry:10px;

    subgraph Phase1 ["阶段 01 · 前置清洗与意图对齐"]
        direction TB
        A(["PDF 导入 Antigravity 工作区"]) ---> Cleaning["Python 脚本正则去噪"]
        Cleaning ---> A2["脱水 Markdown 章节骨架"]
        A2 ---> B["执行 /grill-me 意图拷问模式"]
        B ---> C["AI 发起多轮深度交互问答"]
        C ---> D{"锁定初始术语字典 (Glossary)<br/>并确认全局文风调性"}
    end

    subgraph Phase2 ["阶段 02 · 人机双轨迭代与习惯固化 (核心)"]
        direction TB
        E["Gemini 3.5 Flash (初译层)<br/><small style='color:#555'>100万 Token 大上下文确保文风连贯</small>"]
        E ---> Translation["输出章节初译稿"]
        Translation ---> F["DeepSeek 网页端专家模式 (审校层)<br/><small style='color:#555'>双引擎协作挑错与高水平精润</small>"]
        F ---> Feedback["整理精润与调优反馈"]
        Feedback ---> G["AGENTS.md: 固化翻译习惯<br/>walkthrough.md: 错题本自愈"]
        G ---> Loop["滚动翻译下一章节"]
        Loop ---> E
    end

    subgraph Phase3 ["阶段 03 · 算法排版与校验自愈"]
        direction TB
        H["执行自动化编译排版脚本"]
        H ---> I1["EPUB 电子书打包 (Pandoc)"]
        H ---> I2["PDF 排版导出 (Word COM 驱动)"]
        I1 ---> J{"verify.py 自动校验页数与格式"}
        I2 ---> J
        J --->|校验失败| Debug["查阅 walkthrough 错题本并修正"]
        Debug ---> H
        J --->|校验通过| K(["交付精排全译本 (PDF / EPUB)"])
    end

    %% 连接三个阶段的主线
    D ===>|术语字典与文风基调锁定| E
    G ===>|全书翻译完成| H
    G -.->|动态微调术语字典| D

    %% 应用样式
    class A,A2,B,C,D init;
    class Cleaning,Translation,Feedback,Loop action;
    class E process;
    class F review;
    class G memory;
    class H,I1,I2,J,Debug check;
    class K output;
`;
    } else {
      // Generic Workflow Flowchart
      code = `flowchart TD\n`;
      workflow.phases.forEach((phase) => {
        code += `  subgraph P${phase.phaseNumber} ["阶段 0${phase.phaseNumber} · ${phase.title}"]\n`;
        phase.steps.forEach((step, sIdx) => {
          const stepNodeId = `S_${phase.phaseNumber}_${sIdx + 1}`;
          const cleanName = step.name.replace(/["']/g, "");
          const cleanDesc = step.description.replace(/["']/g, "");
          code += `    ${stepNodeId}["<b>${cleanName}</b><br/><small style='color:#666;'>${cleanDesc}</small>"]\n`;
        });
        for (let i = 0; i < phase.steps.length - 1; i++) {
          code += `    S_${phase.phaseNumber}_${i + 1} --> S_${phase.phaseNumber}_${i + 2}\n`;
        }
        code += `  end\n`;
      });

      for (let p = 0; p < workflow.phases.length - 1; p++) {
        const lastStepOfCurrent = `S_${workflow.phases[p].phaseNumber}_${workflow.phases[p].steps.length}`;
        const firstStepOfNext = `S_${workflow.phases[p + 1].phaseNumber}_1`;
        code += `  ${lastStepOfCurrent} ==> ${firstStepOfNext}\n`;
      }
      code += `  classDef default fill:#F6F2EA,stroke:#C2431B,stroke-width:1.5px,color:#161310,rx:8px,ry:8px;\n`;
    }

    const renderId = `mermaid_${chartId}_${Date.now()}`;
    mermaid
      .render(renderId, code)
      .then(({ svg }) => {
        setSvgContent(svg);
      })
      .catch((err) => {
        console.error("Failed to render Mermaid chart:", err);
      });
  }, [workflow, chartId]);

  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: "12px",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Controls Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", fontWeight: 700, color: "var(--ink)" }}>
            流程蓝图 · Mermaid Flowchart
          </span>
          <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
            全景拓扑 · 3 阶段自愈闭环
          </span>
        </div>

        {/* Zoom SVG Buttons */}
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={handleZoomIn}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="放大流程图"
            aria-label="放大流程图"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="缩小流程图"
            aria-label="缩小流程图"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="重置缩放"
            aria-label="重置缩放"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Rendered Mermaid SVG Viewport */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          overflowX: "auto",
          padding: "16px 8px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {svgContent ? (
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease-out",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div style={{ padding: "40px", color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: "12px" }}>
            正在生成 Mermaid 流程蓝图……
          </div>
        )}
      </div>

      {/* Key Entities Quick Link Pills */}
      {workflow.keyEntities && workflow.keyEntities.length > 0 && onSelectEntityName && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "8px" }}>
          <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
            关联要素快速定位:
          </span>
          {workflow.keyEntities.map((entity) => (
            <button
              key={entity}
              onClick={() => onSelectEntityName(entity)}
              style={{
                fontSize: "10px",
                fontFamily: "var(--mono)",
                color: "var(--accent)",
                fontWeight: 600,
                border: "1px solid var(--accent)",
                borderRadius: "4px",
                padding: "2px 7px",
                cursor: "pointer",
                background: "var(--accent-soft)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {entity}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
