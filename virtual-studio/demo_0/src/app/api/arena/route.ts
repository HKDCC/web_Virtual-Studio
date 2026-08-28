import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'arena_data.json');
    const fileContents = await fs.readFile(dataPath, 'utf8');
    const arenaData = JSON.parse(fileContents);
    
    return NextResponse.json({
      success: true,
      source: arenaData.source || 'LMSYS Official Data',
      last_updated: arenaData.last_updated,
      data: arenaData.data
    });
  } catch (error) {
    console.error("Error reading arena_data.json:", error);
    return NextResponse.json({
      success: false,
      source: "LMSYS Official Data (Offline Fallback)",
      error: "Data file not found. Please run 'npm run sync:arena' first.",
      data: {
        models: [
          {
            name: "Claude 3.5 Sonnet",
            key: "claude",
            scores: { overall: 1270, chat: 1270, coding: 1270, longContext: 1270, science: 1270, factuality: 1270, agent: 1270 }
          }
        ],
        minElo: 1000,
        maxElo: 1300
      }
    });
  }
}
