import fetch from "node-fetch";

async function run() {
  try {
    const res = await fetch("https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard/resolve/main/arena_hard_auto_leaderboard_v0.1.csv");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.text();
    console.log("CSV Header:", data.split('\n')[0]);
    console.log("CSV Row 1:", data.split('\n')[1]);
  } catch (e) {
    console.error(e);
  }
}
run();
