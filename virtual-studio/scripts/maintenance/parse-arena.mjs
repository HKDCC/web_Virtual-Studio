import fs from "fs";
import path from "path";

const inputPath = process.argv[2] || process.env.ARENA_HTML_SOURCE;
if (!inputPath) {
  console.error("Usage: node scripts/maintenance/parse-arena.mjs <arena-html-path>");
  process.exit(1);
}

const sourcePath = path.resolve(process.cwd(), inputPath);
if (!fs.existsSync(sourcePath)) {
  console.error(`Input file not found: ${sourcePath}`);
  process.exit(1);
}

const content = fs.readFileSync(sourcePath, "utf8");

// Regex to capture: model title, provider text, and the elo score in body-sm
const re = /<span class="max-w-full truncate"[^>]*title="([^"]+)">[\s\S]*?<span class="text-text-secondary truncate text-xs">([^<]+)<\/span>[\s\S]*?<span class="body-sm">([0-9]{4})<\/span>(?:<span[^>]*>([^<]+)<\/span>)?/g;

const list = [];
let match;
while ((match = re.exec(content)) !== null) {
  list.push({
    name: match[1],
    provider: match[2],
    score: parseInt(match[3], 10),
    ci: match[4] || "",
  });
}

console.log("Total matched models:", list.length);
list.slice(0, 20).forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.score}] ${item.name} (${item.provider}) ${item.ci}`);
});
