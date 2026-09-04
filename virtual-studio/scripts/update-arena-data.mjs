import fs from 'fs';
import path from 'path';

const REPO_URL = "https://raw.githubusercontent.com/oolong-tea-2026/arena-ai-leaderboards/main/data";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}: ${url}`);
  return res.json();
}

async function main() {
  try {
    console.log("Fetching latest info...");
    const latest = await fetchJson(`${REPO_URL}/latest.json`);
    const datePath = latest.path; // e.g., "2026-07-24"
    
    console.log(`Fetching category data for date: ${datePath}...`);
    const textData = await fetchJson(`${REPO_URL}/${datePath}/text.json`);
    
    // We try to fetch other axes if available
    let codeData = { models: [] }, agentData = { models: [] }, visionData = { models: [] };
    
    try { codeData = await fetchJson(`${REPO_URL}/${datePath}/code.json`); } catch { console.log("No code data"); }
    try { agentData = await fetchJson(`${REPO_URL}/${datePath}/agent.json`); } catch { console.log("No agent data"); }
    try { visionData = await fetchJson(`${REPO_URL}/${datePath}/vision.json`); } catch { console.log("No vision data"); }
    
    // Create lookup maps
    const mapByModel = (data) => {
      const map = new Map();
      if (data && data.models) {
        data.models.forEach(m => map.set(m.model, m.score));
      }
      return map;
    };
    
    const codeMap = mapByModel(codeData);
    const agentMap = mapByModel(agentData);
    const visionMap = mapByModel(visionData);
    
    console.log(`Processing ${textData.models.length} models...`);
    const models = textData.models.map(m => {
      const overall = Math.round(m.score);
      const coding = codeMap.has(m.model) ? Math.round(codeMap.get(m.model)) : overall;
      const agent = agentMap.has(m.model) ? Math.round(agentMap.get(m.model)) : overall;
      const vision = visionMap.has(m.model) ? Math.round(visionMap.get(m.model)) : overall;
      
      return {
        name: m.model,
        key: m.model.toLowerCase(),
        scores: {
          overall: overall,
          chat: overall, // fallback
          coding: coding,
          longContext: overall, // fallback
          science: vision, // mapping vision to science for now
          factuality: agent, // fallback
          agent: agent
        }
      };
    });
    
    const scores = models.map(m => m.scores.overall);
    const minElo = Math.min(...scores, 1000);
    const maxElo = Math.max(...scores, 1500);
    
    const arena_data = {
      source: "LMSYS Official Data",
      last_updated: textData.meta ? textData.meta.last_updated : new Date().toLocaleString(),
      data: {
        models: models,
        minElo,
        maxElo
      }
    };
    
    const outPath = path.join(process.cwd(), "data", "arena_data.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(arena_data, null, 2), "utf8");
    
    console.log(`Successfully generated arena_data.json with ${models.length} models.`);
  } catch (err) {
    console.error("Error updating arena data:", err);
  }
}

main();
