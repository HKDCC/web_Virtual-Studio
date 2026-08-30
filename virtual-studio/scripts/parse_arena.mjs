import fs from "fs";

const content = fs.readFileSync("C:/Users/hkdcc/.gemini/antigravity/brain/b6a16dd1-1fca-4e31-a207-8f207e312435/.system_generated/steps/900/content.md", "utf8");

// Regex to capture: model title, provider text, and the elo score in body-sm
const re = /<span class="max-w-full truncate"[^>]*title="([^"]+)">[\s\S]*?<span class="text-text-secondary truncate text-xs">([^<]+)<\/span>[\s\S]*?<span class="body-sm">([0-9]{4})<\/span>(?:<span[^>]*>([^<]+)<\/span>)?/g;

const list = [];
let match;
while ((match = re.exec(content)) !== null) {
  list.push({
    name: match[1],
    provider: match[2],
    score: parseInt(match[3], 10),
    ci: match[4] || ""
  });
}

console.log("Total matched models:", list.length);
list.slice(0, 20).forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.score}] ${item.name} (${item.provider}) ${item.ci}`);
});
