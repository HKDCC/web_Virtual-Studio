import { PresetWorkflow, WORKFLOW_PRESETS } from "@/data/workflowPresets";

export type GraphNodeType = "workflow" | "tool" | "model" | "prompt" | "website" | "script" | "note";

export interface GraphNode {
  id: string;
  name: string;
  type: GraphNodeType;
  category: string;
  description: string;
  iconUrl?: string | null;
  emoji?: string | null;
  badge?: string | null;
  siteUrl?: string | null;
  rating?: number | null;
  tags: string[];
  promptZh?: string | null;
  promptEn?: string | null;
  workflowCount: number; // 🔥 参与工作流次数
  relatedWorkflowIds: string[];
  relatedEntityNames: string[];
  linkedNoteId?: string | null;
  linkedNoteTitle?: string | null;
  
  // 3D coordinates & visuals
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
}

export interface GraphLink {
  id: string;
  source: string; // source node id
  target: string; // target node id
  workflowId?: string; // which workflow this edge belongs to
  workflowTitle?: string;
  strength?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  entityFrequencyMap: Record<string, number>;
  workflows: PresetWorkflow[];
}

export interface RawWorkflowItem {
  id: string;
  section: "tools" | "websites" | "prompts" | "models" | "agents" | string;
  title: string;
  description?: string | null;
  emoji?: string | null;
  iconUrl?: string | null;
  badge?: string | null;
  siteUrl?: string | null;
  rating?: number | null;
  tags: string[];
  promptZh?: string | null;
  promptEn?: string | null;
}

export interface RawNoteItem {
  id: string;
  title: string;
  category?: string | null;
  date?: string | null;
  excerpt?: string | null;
  tags?: string[];
  htmlContent?: string | null;
}

// Visual Palette for 4 Core Productivity Elements (Editorial Astrolabe Theme)
export const ASTROLABE_PALETTE = {
  workflow: "#C2431B", // 朱砂主星
  tool: "#2C5F8A",     // 黛蓝印章
  model: "#2D6A4F",    // 竹青翠墨
  prompt: "#8B7355",   // 赭石暖金
  website: "#4A6B82",  // 霁蓝星辰
  script: "#5C4D7D",   // 墨紫程序
  note: "#A65B32",     // 熟赭附录
};

export function buildWorkflowGraph(
  notionItems: RawWorkflowItem[] = [],
  presets: PresetWorkflow[] = WORKFLOW_PRESETS,
  notes: RawNoteItem[] = []
): GraphData {
  const nodesMap = new Map<string, GraphNode>();
  const links: GraphLink[] = [];
  const entityFrequencyMap: Record<string, number> = {};

  // 1. Calculate frequency of every entity in presets
  presets.forEach((wf) => {
    wf.keyEntities.forEach((entName) => {
      const clean = entName.toLowerCase().trim();
      entityFrequencyMap[clean] = (entityFrequencyMap[clean] || 0) + 1;
    });

    wf.phases.forEach((phase) => {
      phase.steps.forEach((step) => {
        if (step.entityName) {
          const clean = step.entityName.toLowerCase().trim();
          entityFrequencyMap[clean] = (entityFrequencyMap[clean] || 0) + 1;
        }
      });
    });
  });

  // Helper to determine node type
  function inferType(rawSection: string, name: string): GraphNodeType {
    const s = rawSection.toLowerCase();
    const n = name.toLowerCase();
    if (s.includes("model") || n.includes("claude") || n.includes("gemini") || n.includes("deepseek") || n.includes("gpt")) {
      return "model";
    }
    if (s.includes("prompt") || n.includes("提示词") || n.includes("模板") || n.includes("法则")) {
      return "prompt";
    }
    if (s.includes("website") || n.includes("网") || n.includes("arxiv")) {
      return "website";
    }
    if (s.includes("script") || n.includes("脚本") || n.includes(".py")) {
      return "script";
    }
    return "tool";
  }

  // 2. Register all Notion items into nodesMap
  notionItems.forEach((item) => {
    const cleanName = item.title.trim();
    const type = inferType(item.section, cleanName);
    const count = entityFrequencyMap[cleanName.toLowerCase()] || 0;

    const matchedWfs = presets
      .filter((w) =>
        w.keyEntities.some(
          (k) =>
            cleanName.toLowerCase().includes(k.toLowerCase()) ||
            k.toLowerCase().includes(cleanName.toLowerCase())
        )
      )
      .map((w) => w.id);

    nodesMap.set(cleanName.toLowerCase(), {
      id: item.id,
      name: cleanName,
      type,
      category: item.section,
      description: item.description || "暂无详细描述。",
      iconUrl: item.iconUrl,
      emoji: item.emoji,
      badge: item.badge,
      siteUrl: item.siteUrl,
      rating: item.rating,
      tags: item.tags,
      promptZh: item.promptZh,
      promptEn: item.promptEn,
      workflowCount: Math.max(count, matchedWfs.length),
      relatedWorkflowIds: matchedWfs,
      relatedEntityNames: [],
      x: 0,
      y: 0,
      z: 0,
      radius: Math.min(24, Math.max(10, 10 + count * 3)),
      color: ASTROLABE_PALETTE[type] || ASTROLABE_PALETTE.tool,
    });
  });

  // 3. Register Preset Workflow Hub Nodes & missing entities from presets
  presets.forEach((wf) => {
    const wfNodeId = `node-${wf.id}`;
    
    // Find matched appendix note
    const matchedNote = notes.find(
      (n) => n.id === wf.appendixNoteId || (wf.appendixNoteTitle && n.title.includes(wf.appendixNoteTitle))
    );

    // Add the Workflow Hub node itself
    nodesMap.set(wfNodeId, {
      id: wfNodeId,
      name: wf.title,
      type: "workflow",
      category: wf.category,
      description: wf.tagline,
      emoji: "🌀",
      badge: wf.badge,
      tags: wf.tags,
      workflowCount: wf.phases.reduce((acc, p) => acc + p.steps.length, 0),
      relatedWorkflowIds: [wf.id],
      relatedEntityNames: wf.keyEntities,
      linkedNoteId: matchedNote ? matchedNote.id : wf.appendixNoteId,
      linkedNoteTitle: matchedNote ? matchedNote.title : wf.appendixNoteTitle,
      x: 0,
      y: 0,
      z: 0,
      radius: 28, // Major Astrolabe Hub
      color: ASTROLABE_PALETTE.workflow,
    });

    // Make sure all keyEntities exist as nodes
    wf.keyEntities.forEach((entName) => {
      const key = entName.toLowerCase().trim();
      if (!nodesMap.has(key)) {
        let type: GraphNodeType = "tool";
        if (entName.includes("Gemini") || entName.includes("DeepSeek") || entName.includes("Claude") || entName.includes("模型")) {
          type = "model";
        } else if (entName.includes("提示词") || entName.includes("法则") || entName.includes("拷问") || entName.includes("模板") || entName.includes("错题本")) {
          type = "prompt";
        } else if (entName.includes("脚本") || entName.includes(".py")) {
          type = "script";
        }

        const count = entityFrequencyMap[key] || 1;
        nodesMap.set(key, {
          id: `entity-${key.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "-")}`,
          name: entName,
          type,
          category: type === "model" ? "AI模型" : type === "prompt" ? "提示词" : "效率工具",
          description: `在工作流《${wf.title}》中作为核心生产力要素参与协作。`,
          tags: [wf.category],
          workflowCount: count,
          relatedWorkflowIds: [wf.id],
          relatedEntityNames: [wf.title],
          x: 0,
          y: 0,
          z: 0,
          radius: Math.min(22, Math.max(9, 9 + count * 3)),
          color: ASTROLABE_PALETTE[type] || ASTROLABE_PALETTE.tool,
        });
      } else {
        const existing = nodesMap.get(key)!;
        if (!existing.relatedWorkflowIds.includes(wf.id)) {
          existing.relatedWorkflowIds.push(wf.id);
        }
        if (!existing.relatedEntityNames.includes(wf.title)) {
          existing.relatedEntityNames.push(wf.title);
        }
        existing.workflowCount = Math.max(existing.workflowCount, existing.relatedWorkflowIds.length);
        existing.radius = Math.min(24, Math.max(10, 10 + existing.workflowCount * 3));
      }
    });

    // 4. Build sequential and star links for the workflow
    // A. Link Workflow Hub to its key entities
    wf.keyEntities.forEach((entName) => {
      const targetNode = nodesMap.get(entName.toLowerCase().trim());
      if (targetNode) {
        links.push({
          id: `link-${wf.id}-${targetNode.id}`,
          source: wfNodeId,
          target: targetNode.id,
          workflowId: wf.id,
          workflowTitle: wf.title,
          strength: 1,
        });
      }
    });

    // B. Link Sequential Steps along the phases
    let previousStepEntity: string | null = null;
    wf.phases.forEach((phase) => {
      phase.steps.forEach((step) => {
        if (step.entityName) {
          const currentEntityKey = step.entityName.toLowerCase().trim();
          const currNode = nodesMap.get(currentEntityKey);
          if (previousStepEntity && currNode) {
            const prevNode = nodesMap.get(previousStepEntity);
            if (prevNode && prevNode.id !== currNode.id) {
              links.push({
                id: `seq-${wf.id}-${prevNode.id}-${currNode.id}`,
                source: prevNode.id,
                target: currNode.id,
                workflowId: wf.id,
                workflowTitle: wf.title,
                strength: 2,
              });
            }
          }
          previousStepEntity = currentEntityKey;
        }
      });
    });
  });

  const nodes = Array.from(nodesMap.values());

  // 5. Position nodes on 3D Astrolabe Spherical Shells
  const wfCount = presets.length;
  nodes.forEach((node, idx) => {
    if (node.type === "workflow") {
      // Position workflow hubs on an inner orbital ring
      const wfIndex = presets.findIndex((p) => `node-${p.id}` === node.id);
      const angle = (wfIndex / (wfCount || 1)) * Math.PI * 2;
      const radius = 180;
      node.x = Math.cos(angle) * radius;
      node.y = (wfIndex % 2 === 0 ? 30 : -30);
      node.z = Math.sin(angle) * radius;
    } else {
      // Position tools/models/prompts on outer celestial shells
      const totalNonWf = Math.max(1, nodes.length - wfCount);
      const phi = Math.acos(-1 + (2 * idx) / totalNonWf);
      const theta = Math.sqrt(totalNonWf * Math.PI) * phi;
      const baseRadius = 320 + (node.workflowCount > 1 ? -40 : 60); // higher frequency tools pulled closer
      
      node.x = baseRadius * Math.cos(theta) * Math.sin(phi);
      node.y = (baseRadius * 0.7) * Math.sin(theta) * Math.sin(phi);
      node.z = baseRadius * Math.cos(phi);
    }
  });

  return {
    nodes,
    links,
    entityFrequencyMap,
    workflows: presets,
  };
}
