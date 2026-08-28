"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import mermaid from "mermaid";
import type { ItemProps } from "./RetroWorkflowLayout";
import { useRetroSound } from "@/hooks/useRetroSound";

interface MermaidChartProps {
  chart: string;
  tools: ItemProps[];
}

export function MermaidChart({ chart, tools }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = "mermaid-svg-" + useId().replace(/:/g, "");
  const [svgContent, setSvgContent] = useState<string>("");
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; tool: ItemProps | null }>({
    visible: false,
    x: 0,
    y: 0,
    tool: null
  });
  
  const { playHover, playClick } = useRetroSound();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      suppressErrorRendering: true,
      theme: "base",
      themeVariables: {
        fontFamily: "var(--font-mono)",
        primaryColor: "#f4f1ea",
        primaryTextColor: "#2c2c2c",
        primaryBorderColor: "#8b7355",
        lineColor: "#8b7355",
        secondaryColor: "#e8e4db",
        tertiaryColor: "#e8e4db"
      },
      flowchart: {
        htmlLabels: true,
        curve: "basis"
      }
    });

    const renderChart = async () => {
      try {
        // Pre-validate the chart syntactically to prevent global Mermaid errors
        const isValid = await mermaid.parse(chart);
        if (isValid) {
          const { svg } = await mermaid.render(id, chart);
          setSvgContent(svg);
        }
      } catch (err) {
        // Quietly handle invalid Mermaid user text by rendering retro fallback block
        setSvgContent(`<div style="color:var(--rust); padding: 16px; border: 1px dashed var(--rust); background: rgba(205,97,85,0.05); font-family: var(--font-mono); font-size: 13px;">
          <strong style="font-size: 16px; display: block; margin-bottom: 8px;">[ SYSTEM CORRUPTION ]</strong>
          Failed to render diagram due to syntax anomaly.<br/><br/>
          <span style="opacity: 0.7;">${String(err).substring(0, 150)}...</span>
        </div>`);
      }
    };

    renderChart();
  }, [chart, id]);

  useEffect(() => {
    if (!containerRef.current || !svgContent) return;
    
    // Inject event listeners on nodes
    const nodes = containerRef.current.querySelectorAll('.node');
    
    // Mapping function: exact or partial match of Tool name in node text
    const findTool = (text: string) => {
      if (!text) return null;
      const cleanText = text.replace(/<br>/gi, ' ').toLowerCase();
      // First exact match
      const match = tools.find(t => t.title && cleanText.includes(t.title.toLowerCase()));
      return match || null;
    };

    nodes.forEach(node => {
      const gNode = node as SVGGElement;
      const textElement = gNode.querySelector('.nodeLabel') || gNode;
      const text = textElement.textContent || "";
      const tool = findTool(text);
      
      if (tool) {
        // Apply interactive styling
        gNode.style.cursor = 'pointer';
        gNode.classList.add('mermaid-node-interactive'); // We can add hover effects in CSS
        gNode.setAttribute('data-tool-id', tool.id);
        
        // Add a subtle border glow stroke to signify interactivity
        const shape = gNode.querySelector('rect, circle, polygon, path');
        if (shape) {
          (shape as HTMLElement).style.stroke = 'var(--accent)';
          (shape as HTMLElement).style.strokeWidth = '3px';
        }

        gNode.onmouseenter = () => {
          playHover();
          const rect = gNode.getBoundingClientRect();
          setTooltip({
            visible: true,
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            tool
          });
        };
        
        gNode.onmouseleave = () => {
          setTooltip(prev => ({ ...prev, visible: false }));
        };
        
        gNode.onmousemove = (e) => {
          setTooltip(prev => ({
            ...prev,
            x: e.clientX,
            y: e.clientY - 20
          }));
        };

        gNode.onclick = () => {
          playClick();
          const targetCard = document.getElementById(`tool-card-${tool.id}`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight effect
            targetCard.classList.remove('pulse-highlight');
            void targetCard.offsetWidth; // trigger reflow
            targetCard.classList.add('pulse-highlight');
          }
        };
      }
    });

    return () => {
      nodes.forEach(node => {
        const gNode = node as SVGGElement;
        gNode.onmouseenter = null;
        gNode.onmouseleave = null;
        gNode.onmousemove = null;
        gNode.onclick = null;
      });
    };
  }, [svgContent, tools, playHover, playClick]);

  return (
    <div style={{ position: "relative" }}>
      <div 
        ref={containerRef} 
        className="mermaid-container"
        dangerouslySetInnerHTML={{ __html: svgContent }} 
        style={{ 
          background: "var(--paper)", 
          border: "2px solid var(--accent-soft)",
          padding: "24px",
          display: "flex",
          justifyContent: "center",
          overflowX: "auto"
        }}
      />
      
      {/* Interactive Tooltip */}
      {tooltip.visible && tooltip.tool && (
        <div style={{
          position: "fixed",
          top: tooltip.y,
          left: tooltip.x,
          transform: "translate(-50%, -100%)",
          background: "var(--ink)",
          color: "var(--paper-solid)",
          padding: "8px 12px",
          border: "1px solid var(--accent)",
          zIndex: 9999,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          whiteSpace: "nowrap",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.2)"
        }}>
          {tooltip.tool.icon && tooltip.tool.icon.length < 5 ? (
            <span>{tooltip.tool.icon}</span>
          ) : tooltip.tool.icon ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={tooltip.tool.icon} alt="" style={{ width: 16, height: 16, filter: 'grayscale(1) invert(1)' }} />
          ) : null}
          <span style={{ fontWeight: "bold" }}>{tooltip.tool.title}</span>
          <span style={{ color: "var(--accent)", fontSize: "10px" }}>[ CLICK TO LOCATE ]</span>
        </div>
      )}
    </div>
  );
}
