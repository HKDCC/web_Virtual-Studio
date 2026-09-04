import { Client } from "@gradio/client";

async function run() {
  try {
    console.log("Connecting to Gradio space...");
    const app = await Client.connect("lmsys/chatbot-arena-leaderboard");
    const endpoints = app.config.dependencies.map(d => d.api_name).filter(Boolean);
    console.log("Endpoints:", endpoints);
  } catch (e) {
    console.error(e);
  }
}
run();
