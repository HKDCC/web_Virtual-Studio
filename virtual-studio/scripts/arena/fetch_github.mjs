async function run() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/oolong-tea-2026/arena-ai-leaderboards/main/data/latest.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    console.log("Keys:", Object.keys(data));
    console.log("Categories:", Object.keys(data).slice(0, 5));
    if (data["Text"]) {
      console.log("Text first model:", data["Text"][0]);
    } else if (data["text"]) {
      console.log("text first model:", data["text"][0]);
    } else {
      console.log("First category data:", data[Object.keys(data)[0]][0]);
    }
  } catch (e) {
    console.error(e);
  }
}
run();
