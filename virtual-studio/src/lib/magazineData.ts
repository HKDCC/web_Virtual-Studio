import { queryDatabaseAll } from "./notion";
import { env } from "./env";
import {
  getPageTitle,
  getRichText,
  getSelect,
  getMultiSelect,
  getDate,
  getUrl,
  getNumber,
} from "./notionHelpers";
import { getTimelineEntries } from "./changelog";

import { FALLBACK_SITE_DATA } from "@/data/fallbackMagazineData";
import type {
  AppIconInfo,
  MagazineDataPayload,
  PromptItem,
  SiteItem,
  ToolItem,
} from "@/types/magazine";

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function extractFileUrl(pageObj: { cover?: unknown; properties?: Record<string, unknown> }, propName = "Cover"): string | null {
  // 1. Check properties[propName]
  if (pageObj.properties && pageObj.properties[propName]) {
    const p = pageObj.properties[propName] as Record<string, unknown>;
    if (p.type === "files" && Array.isArray(p.files) && p.files.length > 0) {
      const f = p.files[0] as Record<string, unknown>;
      if (f.type === "file" && isObj(f.file) && typeof f.file.url === "string") {
        return f.file.url;
      }
      if (f.type === "external" && isObj(f.external) && typeof f.external.url === "string") {
        return f.external.url;
      }
    }
  }

  // 2. Check native page.cover
  if (isObj(pageObj.cover)) {
    const cov = pageObj.cover as Record<string, unknown>;
    if (cov.type === "file" && isObj(cov.file) && typeof cov.file.url === "string") {
      return cov.file.url;
    }
    if (cov.type === "external" && isObj(cov.external) && typeof cov.external.url === "string") {
      return cov.external.url;
    }
  }

  return null;
}

function extractPageIcon(
  pageObj: { icon?: unknown; properties?: Record<string, unknown> },
  fallbackTitle = ""
): AppIconInfo | null {
  const t = fallbackTitle.toLowerCase();
  // 1. Fast local static icons for known project assets
  if (t.includes("whisper")) return { type: "image", value: "/lab/icons/whisperx.png" };
  if (t.includes("reader") || t.includes("minireader")) return { type: "image", value: "/lab/icons/minireader.png" };
  if (t.includes("cassette") || t.includes("magiccutter") || t.includes("cutter")) return { type: "image", value: "/lab/icons/magiccutter.png" };
  if (t.includes("memo") || t.includes("swiftmemo")) return { type: "image", value: "/lab/icons/swiftmemo.png" };
  if (t.includes("snake") || t.includes("retro")) return { type: "image", value: "/lab/icons/snake.png" };

  // 2. Check property AppIcon
  if (pageObj.properties) {
    const appIconUrl = extractFileUrl(pageObj, "AppIcon") || getUrl(pageObj.properties, "AppIconURL");
    if (appIconUrl) {
      return { type: "image", value: appIconUrl };
    }
  }

  // 3. Check native page.icon (File, External or Emoji)
  if (isObj(pageObj.icon)) {
    const ic = pageObj.icon as Record<string, unknown>;
    if (ic.type === "file" && isObj(ic.file) && typeof ic.file.url === "string" && ic.file.url) {
      return { type: "image", value: ic.file.url };
    }
    if (ic.type === "external" && isObj(ic.external) && typeof ic.external.url === "string" && ic.external.url) {
      return { type: "image", value: ic.external.url };
    }
    if (ic.type === "emoji" && typeof ic.emoji === "string" && ic.emoji) {
      return { type: "emoji", value: ic.emoji };
    }
  }

  // 4. Check property AppEmoji or Emoji
  if (pageObj.properties) {
    const emojiVal =
      getRichText(pageObj.properties, "AppEmoji") ||
      getSelect(pageObj.properties, "AppEmoji") ||
      getRichText(pageObj.properties, "Emoji") ||
      getSelect(pageObj.properties, "Emoji");
    if (emojiVal) {
      return { type: "emoji", value: emojiVal };
    }
  }
  if (t.includes("muse") || t.includes("todo")) return { type: "emoji", value: "🌸" };

  return null;
}

let cachedMagazineData: MagazineDataPayload | null = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60s in-memory cache for lightning-fast SSR

export async function fetchMagazineData(): Promise<MagazineDataPayload> {
  const now = Date.now();
  if (cachedMagazineData && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return cachedMagazineData;
  }

  let books = FALLBACK_SITE_DATA.books;
  let lab = FALLBACK_SITE_DATA.lab;
  const flow = FALLBACK_SITE_DATA.flow;
  let tools = FALLBACK_SITE_DATA.tools;
  let sites = FALLBACK_SITE_DATA.sites;
  let prompts = FALLBACK_SITE_DATA.prompts;
  let timeline = FALLBACK_SITE_DATA.timeline;
  let pause = FALLBACK_SITE_DATA.pause;
  let notes = FALLBACK_SITE_DATA.notes;
  let log = FALLBACK_SITE_DATA.log;

  const [booksRes, labRes, workflowRes, timelineRes, pauseRes, notesRes, logRes] = await Promise.allSettled([
    // 1. Books
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_BOOKS_DB_ID) return null;
      return await queryDatabaseAll({ databaseId: env.NOTION_BOOKS_DB_ID, pageSize: 50, maxPages: 2 });
    })(),
    // 2. Lab
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_LAB_DB_ID) return null;
      return await queryDatabaseAll({ databaseId: env.NOTION_LAB_DB_ID, pageSize: 50, maxPages: 2 });
    })(),
    // 3. Workflow
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_WORKFLOW_DB_ID) return null;
      return await queryDatabaseAll({ databaseId: env.NOTION_WORKFLOW_DB_ID, pageSize: 50, maxPages: 2 });
    })(),
    // 4. Timeline
    (async () => {
      return await getTimelineEntries();
    })(),
    // 5. Pause
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_PAUSE_DB_ID) return null;
      return await queryDatabaseAll({ databaseId: env.NOTION_PAUSE_DB_ID, pageSize: 50, maxPages: 2 });
    })(),
    // 6. Notes
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_NOTES_DB_ID) return null;
      return await queryDatabaseAll({
        databaseId: env.NOTION_NOTES_DB_ID,
        pageSize: 50,
        maxPages: 2,
        sorts: [{ property: "Date", direction: "descending" }],
      });
    })(),
    // 7. Log
    (async () => {
      if (!env.NOTION_TOKEN || !env.NOTION_CHANGELOG_DB_ID) return null;
      return await queryDatabaseAll({
        databaseId: env.NOTION_CHANGELOG_DB_ID,
        pageSize: 50,
        maxPages: 2,
        sorts: [{ property: "Date", direction: "descending" }],
      });
    })(),
  ]);

  if (booksRes.status === "fulfilled" && booksRes.value && booksRes.value.length > 0) {
    try {
      books = booksRes.value.map((p) => {
        const props = p.properties as Record<string, unknown>;
        const tags = getMultiSelect(props, "Tags");
        const category = getSelect(props, "Category") || (tags.length > 0 ? tags[0] : "工具");
        const coverUrl = extractFileUrl(p, "Cover");
        const rating = getNumber(props, "MyRating");
        const tagline = getRichText(props, "Tagline");
        const downloadUrl = getUrl(props, "DownloadURL");
        return {
          id: p.id,
          t: getPageTitle(p),
          a: getRichText(props, "Author") || "未知作者",
          c: category,
          tags,
          coverUrl,
          rating,
          tagline,
          downloadUrl,
        };
      });
    } catch (e) {
      console.warn("Error parsing books:", e);
    }
  }

  if (labRes.status === "fulfilled" && labRes.value && labRes.value.length > 0) {
    try {
      lab = labRes.value.map((p) => {
        const props = p.properties as Record<string, unknown>;
        const type = (getSelect(props, "Type") ?? "").toLowerCase();
        const tag = type.includes("vibe") ? "Vibe Coding" : "AI 实践";
        const gh = getUrl(props, "GitHubURL");
        const dm = getUrl(props, "DemoURL");
        const links: [string, string][] = [];
        if (gh) links.push(["GitHub", gh]);
        if (dm) links.push(["Demo", dm]);
        const title = getPageTitle(p);
        return {
          id: p.id,
          tag: getRichText(props, "Badge") || tag,
          t: title,
          d: getRichText(props, "Description") || "",
          links,
          iconUrl: extractFileUrl(p, "Media") || extractFileUrl(p, "DemoMedia") || extractFileUrl(p, "Icon"),
          appIcon: extractPageIcon(p, title),
        };
      });
    } catch (e) {
      console.warn("Error parsing lab:", e);
    }
  }

  if (workflowRes.status === "fulfilled" && workflowRes.value && workflowRes.value.length > 0) {
    try {
      const fetchedTools: ToolItem[] = [];
      const fetchedSites: SiteItem[] = [];
      const fetchedPrompts: PromptItem[] = [];

      workflowRes.value.forEach((p) => {
        const props = p.properties as Record<string, unknown>;
        const sec = (getSelect(props, "Section") ?? "").toLowerCase();
        const title = getPageTitle(p);
        const desc = getRichText(props, "Description") ?? "";
        const badge = getSelect(props, "Badge") ?? "在用";
        const siteUrl = getUrl(props, "SiteURL") ?? "#";
        const ratingRaw = props["Rating"];
        const rating =
          isObj(ratingRaw) && ratingRaw["type"] === "number" && typeof ratingRaw["number"] === "number"
            ? ratingRaw["number"].toFixed(1)
            : "5.0";
        const promptZh = getRichText(props, "PromptZH") ?? "";
        const promptEn = getRichText(props, "PromptEN") ?? "";

        if (sec.includes("tool") || sec.includes("工具")) {
          fetchedTools.push({ t: title, s: badge, d: desc, url: siteUrl });
        } else if (sec.includes("site") || sec.includes("网站") || sec.includes("websites")) {
          fetchedSites.push({ t: title, url: siteUrl.replace(/^https?:\/\//, ""), d: desc, r: rating });
        } else if (sec.includes("prompt") || sec.includes("提示")) {
          fetchedPrompts.push({ t: title, body: promptZh || promptEn || desc });
        }
      });

      if (fetchedTools.length > 0) tools = fetchedTools;
      if (fetchedSites.length > 0) sites = fetchedSites;
      if (fetchedPrompts.length > 0) prompts = fetchedPrompts;
    } catch (e) {
      console.warn("Error parsing workflow:", e);
    }
  }

  if (timelineRes.status === "fulfilled" && timelineRes.value && timelineRes.value.length > 0) {
    try {
      timeline = timelineRes.value.slice(0, 10).map((entry) => ({
        d: entry.date ? entry.date.replace(/-/g, "·").slice(0, 7) : "2026",
        t: entry.name || entry.model || "模型更新",
        note: entry.highlights || entry.version || "大模型更新发布",
      }));
    } catch (e) {
      console.warn("Error parsing timeline:", e);
    }
  }

  if (pauseRes.status === "fulfilled" && pauseRes.value && pauseRes.value.length > 0) {
    try {
      pause = pauseRes.value.map((p) => {
        const props = p.properties as Record<string, unknown>;
        const coverUrl = extractFileUrl(p, "Cover") || "/photos/photo_1_.webp";
        const rawDate = getDate(props, "Date") || "2026·05";
        return {
          id: p.id,
          d: rawDate.replace(/-/g, "·"),
          loc: getRichText(props, "Location") || "世界角落",
          t: getPageTitle(p),
          img: coverUrl,
        };
      });
    } catch (e) {
      console.warn("Error parsing pause:", e);
    }
  }

  if (notesRes.status === "fulfilled" && notesRes.value && notesRes.value.length > 0) {
    try {
      notes = notesRes.value
        .map((p) => {
          const props = p.properties as Record<string, unknown>;
          const rawDate = getDate(props, "Date") || "2026·03·19";
          const category = getSelect(props, "Category") || "读书笔记";
          const tags = getMultiSelect(props, "Tags");
          const readTime = getNumber(props, "ReadTime") || 20;
          const htmlContent = getUrl(props, "HTMLContent");
          const heroLight = p.id ? `/notes_heroes/${p.id}_light.webp` : null;
          const heroDark = p.id ? `/notes_heroes/${p.id}_dark.webp` : null;
          const excerpt = getRichText(props, "Excerpt") || getPageTitle(p);
          const title = getPageTitle(p);

          return {
            id: p.id,
            d: rawDate.replace(/-/g, "·"),
            title,
            cat: category,
            tags,
            readTime,
            htmlContent,
            heroLight,
            heroDark,
            src: `${category} · ${title}`,
            text: excerpt,
          };
        })
        .sort((a, b) => (b.d || "").localeCompare(a.d || ""));
    } catch (e) {
      console.warn("Error parsing notes:", e);
    }
  }

  if (logRes.status === "fulfilled" && logRes.value && logRes.value.length > 0) {
    try {
      log = logRes.value
        .map((p) => {
          const props = p.properties as Record<string, unknown>;
          const rawDate = getDate(props, "Date") || "";
          const title = getPageTitle(p) || "";
          const desc = getRichText(props, "Description") || "";
          const type = getSelect(props, "Type") || "Feature";
          return {
            id: p.id,
            d: rawDate ? rawDate.replace(/.*-(\d\d)-(\d\d).*/, "$1·$2") : "08·29",
            rawDate: rawDate,
            t: title,
            desc: desc,
            type: type,
          };
        })
        .sort((a, b) => (b.rawDate || "").localeCompare(a.rawDate || ""));
    } catch (e) {
      console.warn("Error parsing log:", e);
    }
  }

  const result: MagazineDataPayload = {
    books: Array.isArray(books) ? books : [],
    lab: Array.isArray(lab) ? lab : [],
    flow: Array.isArray(flow) ? flow : [],
    tools: Array.isArray(tools) ? tools : [],
    sites: Array.isArray(sites) ? sites : [],
    prompts: Array.isArray(prompts) ? prompts : [],
    timeline: Array.isArray(timeline) ? timeline : [],
    pause: Array.isArray(pause) ? pause : [],
    notes: Array.isArray(notes) ? notes : [],
    log: Array.isArray(log) ? log : [],
  };

  try {
    const cleanPayload = JSON.parse(JSON.stringify(result)) as MagazineDataPayload;
    cachedMagazineData = cleanPayload;
    lastCacheTimestamp = Date.now();
    return cleanPayload;
  } catch {
    cachedMagazineData = result;
    lastCacheTimestamp = Date.now();
    return result;
  }
}
