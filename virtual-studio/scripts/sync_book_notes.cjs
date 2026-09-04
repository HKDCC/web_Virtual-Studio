const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SHOULD_SYNC_NOTION = process.argv.includes('--sync-notion');
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DB_NOTES_ID = process.env.NOTION_NOTES_DB_ID || '3254b57fe15a809990affde8cced6794';
const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://quaxstudio.xyz').replace(/\/$/, '');

if (SHOULD_SYNC_NOTION && !NOTION_TOKEN) {
  console.error('NOTION_TOKEN missing in .env.local!');
  process.exit(1);
}

const notion = SHOULD_SYNC_NOTION ? new Client({ auth: NOTION_TOKEN }) : null;

const SOURCE_DIR = process.env.BOOK_NOTES_SOURCE_DIR || 'D:\\Books\\AI笔记';
const TARGET_DIR = path.join(__dirname, '..', 'public', 'articles');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Convert filename to clean slug
function toSlug(filename) {
  return filename
    .replace(/^【读书笔记】/, '')
    .replace(/\.html$/, '')
    .trim()
    .replace(/[\s_—–]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5\.-]/g, '')
    .toLowerCase() + '.html';
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function createLegacyRedirectHtml(slug) {
  const target = `./${encodeURI(slug)}`;
  const escapedTarget = escapeHtml(target);

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex,follow">
  <meta http-equiv="refresh" content="0;url=${escapedTarget}">
  <link rel="canonical" href="${escapedTarget}">
  <title>正在跳转…</title>
</head>
<body>
  <p>文章地址已更新，正在跳转。<a href="${escapedTarget}">如未自动跳转，请点击这里</a>。</p>
  <script>location.replace(${JSON.stringify(target)});</script>
</body>
</html>
`;
}

function extractMetadata(filepath, filename) {
  const content = fs.readFileSync(filepath, 'utf8');
  const stat = fs.statSync(filepath);
  
  // Format date from file mtime
  const mtime = stat.mtime;
  const year = mtime.getFullYear();
  const month = String(mtime.getMonth() + 1).padStart(2, '0');
  const day = String(mtime.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  // Clean title for Notion
  const cleanTitle = filename.replace(/\.html$/, '');

  // Extract <title>
  const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const docTitle = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';

  // Extract excerpt
  let excerpt = '';
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(content)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text.length > 25 && !text.includes('function') && !text.includes('{') && !text.includes('var ') && !text.includes('const ') && !text.includes('return ') && !text.includes('padding:')) {
      excerpt = text.slice(0, 200);
      break;
    }
  }
  if (!excerpt) {
    excerpt = docTitle ? `《${docTitle}》交互式读书笔记与深度知识图谱。` : `《${cleanTitle}》读书笔记精选。`;
  }

  // Tags
  const tags = ['读书笔记'];
  const lower = (filename + ' ' + content.slice(0, 3000)).toLowerCase();
  if (lower.includes('marketing') || lower.includes('营销') || lower.includes('广告') || lower.includes('positioning') || lower.includes('定位') || lower.includes('offers')) tags.push('营销');
  if (lower.includes('startup') || lower.includes('创业') || lower.includes('entrepreneurship') || lower.includes('business')) tags.push('创业');
  if (lower.includes('money') || lower.includes('finance') || lower.includes('财务') || lower.includes('投资者') || lower.includes('investor') || lower.includes('富翁') || lower.includes('rich') || lower.includes('金钱')) tags.push('财富');
  if (lower.includes('ai') || lower.includes('artificial intelligence') || lower.includes('deep learning') || lower.includes('深度学习') || lower.includes('智能')) tags.push('AI');
  if (lower.includes('thinking') || lower.includes('思考') || lower.includes('systems') || lower.includes('系统') || lower.includes('habits') || lower.includes('习惯') || lower.includes('brain') || lower.includes('大脑') || lower.includes('negotiat') || lower.includes('谈判') || lower.includes('management') || lower.includes('管理')) tags.push('思考');

  // Read time
  const wordCount = content.replace(/<[^>]+>/g, '').length;
  const readTime = Math.min(45, Math.max(10, Math.round(wordCount / 500)));

  const slug = toSlug(filename);

  return {
    filename,
    slug,
    title: cleanTitle,
    docTitle,
    excerpt,
    tags: Array.from(new Set(tags)),
    readTime,
    date: dateStr,
  };
}

async function main() {
  console.log('--- Step 1: Scanning D:\\Books\\AI笔记 ---');
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error('Directory not found:', SOURCE_DIR);
    return;
  }
  const allFiles = fs.readdirSync(SOURCE_DIR);
  const bookFiles = allFiles.filter(f => f.includes('【读书笔记】') && f.endsWith('.html'));
  console.log(`Found ${bookFiles.length} book note HTML files.`);

  console.log('--- Step 2: Generating canonical articles and compatibility redirects ---');
  const items = [];
  const legacyRedirects = [];
  for (const filename of bookFiles) {
    const srcPath = path.join(SOURCE_DIR, filename);
    const meta = extractMetadata(srcPath, filename);
    
    // Copy as clean slug
    const targetSlugPath = path.join(TARGET_DIR, meta.slug);
    fs.copyFileSync(srcPath, targetSlugPath);

    // Only preserve legacy filenames that were already published. New articles
    // are exposed through their canonical slug and do not need a second URL.
    const targetExactPath = path.join(TARGET_DIR, filename);
    if (fs.existsSync(targetExactPath)) {
      fs.writeFileSync(targetExactPath, createLegacyRedirectHtml(meta.slug), 'utf8');
      legacyRedirects.push({ filename, slug: meta.slug });
    }

    meta.url = `${SITE_ORIGIN}/articles/${meta.slug}`;
    items.push(meta);
  }
  console.log(`Generated ${items.length} canonical files and ${legacyRedirects.length} legacy redirects.`);

  for (const item of items) {
    const canonicalPath = path.join(TARGET_DIR, item.slug);
    if (!fs.existsSync(canonicalPath)) {
      throw new Error(`Missing canonical article: ${canonicalPath}`);
    }
  }

  for (const legacy of legacyRedirects) {
    const legacyPath = path.join(TARGET_DIR, legacy.filename);
    const redirectTarget = `./${encodeURI(legacy.slug)}`;
    const legacyHtml = fs.readFileSync(legacyPath, 'utf8');
    if (!legacyHtml.includes(`location.replace(${JSON.stringify(redirectTarget)})`)) {
      throw new Error(`Invalid legacy redirect: ${legacyPath}`);
    }
  }

  if (!SHOULD_SYNC_NOTION) {
    console.log('Local article generation complete. Notion sync was not requested.');
    return;
  }

  console.log('--- Step 3: Querying existing Notion DB_Notes ---');
  let existingPages = [];
  try {
    let hasMore = true;
    let startCursor = undefined;
    while (hasMore) {
      const resp = await notion.databases.query({
        database_id: DB_NOTES_ID,
        start_cursor: startCursor,
        page_size: 100,
      });
      existingPages.push(...resp.results);
      hasMore = resp.has_more;
      startCursor = resp.next_cursor;
    }
  } catch (err) {
    console.error('Error fetching DB_Notes:', err);
    return;
  }
  console.log(`Found ${existingPages.length} existing items in Notion DB_Notes.`);

  const existingMap = new Map();
  for (const p of existingPages) {
    const title = p.properties.Title?.title?.map(t => t.plain_text).join('') || '';
    existingMap.set(title.trim(), p);
    const url = p.properties.HTMLContent?.url;
    if (url) existingMap.set(url, p);
  }

  console.log('--- Step 4: Syncing to Notion DB_Notes ---');
  let createdCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const existing = existingMap.get(item.title) || existingMap.get(item.url);

    if (existing) {
      try {
        await notion.pages.update({
          page_id: existing.id,
          properties: {
            HTMLContent: { url: item.url },
            Category: { select: { name: '读书笔记' } },
            Tags: { multi_select: item.tags.map(name => ({ name })) },
            ReadTime: { number: item.readTime },
            Status: { select: { name: 'Published' } },
          },
        });
        updatedCount++;
        console.log(`[${i + 1}/${items.length}] Updated: ${item.title} -> ${item.url}`);
      } catch (err) {
        console.error(`Failed to update ${item.title}:`, err.message);
      }
    } else {
      try {
        await notion.pages.create({
          parent: { database_id: DB_NOTES_ID },
          properties: {
            Title: {
              title: [
                {
                  text: { content: item.title },
                },
              ],
            },
            Category: {
              select: { name: '读书笔记' },
            },
            Date: {
              date: { start: item.date },
            },
            Tags: {
              multi_select: item.tags.map(name => ({ name })),
            },
            Excerpt: {
              rich_text: [
                {
                  text: { content: item.excerpt },
                },
              ],
            },
            ReadTime: {
              number: item.readTime,
            },
            Status: {
              select: { name: 'Published' },
            },
            HTMLContent: {
              url: item.url,
            },
          },
        });
        createdCount++;
        console.log(`[${i + 1}/${items.length}] Created: ${item.title} -> ${item.url}`);
      } catch (err) {
        console.error(`Failed to create ${item.title}:`, err.message);
      }
    }
    // Rate limit delay
    await new Promise(r => setTimeout(r, 350));
  }

  console.log(`\n=== Sync Complete ===`);
  console.log(`Total HTML files processed: ${items.length}`);
  console.log(`Notion pages created: ${createdCount}`);
  console.log(`Notion pages updated: ${updatedCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
