"use client";

import { useState, useMemo } from "react";
import { buildWorkflowGraph, GraphNode, RawWorkflowItem, RawNoteItem } from "@/lib/graphEngine";
import { WORKFLOW_PRESETS } from "@/data/workflowPresets";
import { ObsidianWorkflowGraph } from "./ObsidianWorkflowGraph";
import { WorkflowAccordion } from "./WorkflowAccordion";
import { ToolboxSection } from "./ToolboxSection";
import { WorkflowAppendix } from "./WorkflowAppendix";

export type WorkflowItem = RawWorkflowItem;

interface WorkflowTabsProps {
  items: RawWorkflowItem[];
  notes?: RawNoteItem[];
}

export function WorkflowTabs({ items, notes = [] }: WorkflowTabsProps) {
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Compute full bidirectional graph
  const graphData = useMemo(() => {
    return buildWorkflowGraph(items, WORKFLOW_PRESETS, notes);
  }, [items, notes]);

  const handleSelectEntityByName = (name: string) => {
    const node = graphData.nodes.find(
      (n) => n.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (node) {
      setSelectedNode(node);
    }
  };

  const handleFilterWorkflowsByEntity = (entityName: string) => {
    const matchedWf = graphData.workflows.find((w) =>
      w.keyEntities.some((k) => k.toLowerCase() === entityName.toLowerCase())
    );
    if (matchedWf) {
      setActiveWorkflowId(matchedWf.id);
    }
  };

  const handleScrollToAppendix = () => {
    const el = document.getElementById("workflow-appendix");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="workflow-root-container" style={{ width: "100%", maxWidth: "72rem", margin: "0 auto" }}>
      {/* ─── 1. Top Section: Obsidian-Style Dynamic Force Graph ─── */}
      <ObsidianWorkflowGraph
        graphData={graphData}
        activeWorkflowId={activeWorkflowId}
        selectedNodeId={selectedNode?.id || null}
        onSelectNode={setSelectedNode}
        onSelectWorkflow={setActiveWorkflowId}
      />

      {/* ─── 2. Middle Section: Scalable 2D Workflow Accordion ─── */}
      <WorkflowAccordion
        workflows={graphData.workflows}
        activeWorkflowId={activeWorkflowId}
        onSelectWorkflow={setActiveWorkflowId}
        onSelectEntityName={handleSelectEntityByName}
        onScrollToAppendix={handleScrollToAppendix}
      />

      {/* ─── 3. Toolbox & Model Centrality Ranking Section ─── */}
      <ToolboxSection
        nodes={graphData.nodes}
        onFilterWorkflowsByEntity={handleFilterWorkflowsByEntity}
      />

      {/* ─── 4. Independent Practical Notes & Appendix Section ─── */}
      <WorkflowAppendix notes={notes} />
    </div>
  );
}
