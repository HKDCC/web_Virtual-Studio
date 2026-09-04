import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "public", "logos");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const logos = {
  "gemini.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1BA1E3"/><stop offset="50%" stop-color="#5470FF"/><stop offset="100%" stop-color="#9D5CFF"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="#1E1F22"/><path d="M50 15 C50 34.33 34.33 50 15 50 C34.33 50 50 65.67 50 85 C50 65.67 65.67 50 85 50 C65.67 50 50 34.33 50 15 Z" fill="url(#g1)"/></svg>`,
  
  "deepseek.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#0D1B2A"/><path d="M22 64 C22 40 42 22 68 22 C78 22 82 26 78 34 C72 44 58 52 48 58 C42 62 34 66 22 64 Z" fill="#4D9FFF"/><circle cx="66" cy="34" r="4" fill="#ffffff"/><path d="M38 56 C46 64 56 68 68 66 C74 65 78 70 74 74 C62 82 44 78 30 68 C25 64 32 52 38 56 Z" fill="#1D63FF"/></svg>`,
  
  "antigravity.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#161310"/><circle cx="50" cy="50" r="32" fill="none" stroke="#C2431B" stroke-width="4" stroke-dasharray="6 4"/><circle cx="50" cy="50" r="16" fill="#C2431B"/><path d="M20 50 Q50 20 80 50 Q50 80 20 50" fill="none" stroke="#F59E0B" stroke-width="3"/><circle cx="72" cy="36" r="4" fill="#F59E0B"/></svg>`,
  
  "pandoc.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#222B38"/><text x="50" y="68" font-family="monospace" font-size="52" font-weight="bold" fill="#E5533D" text-anchor="middle">P</text><rect x="22" y="76" width="56" height="5" rx="2.5" fill="#E5533D"/></svg>`,
  
  "python.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#1E293B"/><path d="M49 20 C36 20 37 25 37 25 L37 31 L50 31 L50 33 L29 33 C23 33 20 38 20 45 C20 52 24 55 24 55 L28 55 L28 49 C28 43 33 39 39 39 L51 39 C56 39 60 35 60 30 C60 23 56 20 49 20 Z" fill="#387EB8"/><circle cx="42" cy="26" r="2.5" fill="#ffffff"/><path d="M51 80 C64 80 63 75 63 75 L63 69 L50 69 L50 67 L71 67 C77 67 80 62 80 55 C80 48 76 45 76 45 L72 45 L72 51 C72 57 67 61 61 61 L49 61 C44 61 40 65 40 70 C40 77 44 80 51 80 Z" fill="#FFE052"/><circle cx="58" cy="74" r="2.5" fill="#1E293B"/></svg>`,
  
  "notion.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#FFFFFF"/><path d="M26 24 L68 20 C73 20 75 22 75 26 L74 74 C74 78 71 80 67 80 L28 80 C24 80 22 78 22 74 L23 28 C23 25 24 24 26 24 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/><path d="M34 32 L46 32 L60 62 L60 32 L68 32 L68 68 L56 68 L42 38 L42 68 L34 68 Z" fill="#000000"/></svg>`,
  
  "notebooklm.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#F0F4F9"/><path d="M30 26 C30 26 40 24 50 28 C60 24 70 26 70 26 L70 72 C70 72 60 70 50 74 C40 70 30 72 30 72 Z" fill="#FFFFFF" stroke="#1A73E8" stroke-width="4"/><line x1="50" y1="28" x2="50" y2="74" stroke="#1A73E8" stroke-width="3"/><polygon points="50,14 53,20 59,23 53,26 50,32 47,26 41,23 47,20" fill="#EA4335"/></svg>`,
  
  "claude.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#1B1715"/><g fill="#D97757"><polygon points="50,18 55,42 65,22 58,45 80,35 60,50 82,60 58,55 65,78 55,58 50,82 45,58 35,78 42,55 18,60 40,50 18,35 42,45 35,22 45,42"/></g></svg>`,
  
  "cursor.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#000000"/><polygon points="50,18 80,35 50,52 20,35" fill="#4E4E4E"/><polygon points="20,35 50,52 50,82 20,65" fill="#2B2B2B"/><polygon points="50,52 80,35 80,65 50,82" fill="#FFFFFF"/></svg>`,
  
  "threejs.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#040404"/><polygon points="50,18 82,74 18,74" fill="none" stroke="#000000" stroke-width="4"/><polygon points="50,22 78,72 22,72" fill="#FFFFFF"/><polygon points="50,42 64,68 36,68" fill="#040404"/></svg>`,
  
  "midjourney.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#0F141C"/><path d="M22 68 C35 76 65 76 78 68 C68 62 32 62 22 68 Z" fill="#FFFFFF"/><path d="M38 60 C42 45 58 30 70 25 C62 40 54 55 50 60 Z" fill="#FFFFFF"/><path d="M32 58 C35 48 45 40 52 36 C46 46 42 54 40 58 Z" fill="#FFFFFF"/></svg>`,
  
  "whisper.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#10A37F"/><circle cx="50" cy="50" r="26" fill="none" stroke="#FFFFFF" stroke-width="4"/><line x1="32" y1="50" x2="68" y2="50" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="32" x2="50" y2="68" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/><line x1="37" y1="37" x2="63" y2="63" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/></svg>`,
  
  "zlibrary.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#18453B"/><text x="50" y="68" font-family="sans-serif" font-size="50" font-weight="900" fill="#FFFFFF" text-anchor="middle">Z</text><circle cx="74" cy="30" r="6" fill="#F59E0B"/></svg>`,
  
  "qbittorrent.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#2F6798"/><text x="40" y="65" font-family="sans-serif" font-size="42" font-weight="bold" fill="#FFFFFF" text-anchor="middle">q</text><text x="64" y="65" font-family="sans-serif" font-size="42" font-weight="bold" fill="#93C5FD" text-anchor="middle">B</text></svg>`,
  
  "prompt.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#4C1D95"/><path d="M32 26 L68 26 C72 26 74 28 74 32 L74 68 C74 72 72 74 68 74 L32 74 C28 74 26 72 26 68 L26 32 C26 28 28 26 32 26 Z" fill="#6D28D9"/><polygon points="52,34 42,48 50,48 44,64 60,46 51,46" fill="#FBBF24"/></svg>`,
  
  "script.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#064E3B"/><path d="M30 36 L44 50 L30 64" fill="none" stroke="#34D399" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><line x1="48" y1="64" x2="70" y2="64" stroke="#34D399" stroke-width="6" stroke-linecap="round"/></svg>`
};

Object.entries(logos).forEach(([filename, svg]) => {
  fs.writeFileSync(path.join(outDir, filename), svg, "utf8");
});
console.log("Successfully wrote", Object.keys(logos).length, "vector logos to public/logos/");
