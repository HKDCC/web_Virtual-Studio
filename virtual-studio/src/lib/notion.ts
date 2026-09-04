import "server-only";
import { Client } from "@notionhq/client";
import { env } from "@/lib/env";

let cachedClient: Client | null = null;
let cachedToken: string | null = null;

// Keep server-rendered detail requests from consuming the whole Worker budget
// when the Notion API is slow or temporarily unavailable.
export const NOTION_REQUEST_TIMEOUT_MS = 3500;

export function notionClient(): Client | null {
  const token = env.NOTION_TOKEN || process.env.NOTION_TOKEN;
  if (!token || token.trim().length === 0) return null;
  if (cachedClient && cachedToken === token) return cachedClient;
  cachedToken = token;
  cachedClient = new Client({ auth: token, timeoutMs: NOTION_REQUEST_TIMEOUT_MS });
  return cachedClient;
}

export function notion(): Client {
  const client = notionClient();
  if (!client) {
    throw new Error("Missing env: NOTION_TOKEN");
  }
  return client;
}

/**
 * Bound a server-side Notion operation so a slow upstream cannot exhaust the
 * hosting runtime. The Notion client also has a per-request timeout; this
 * deadline protects multi-page operations such as block pagination.
 */
export async function withNotionDeadline<T>(task: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  try {
    return await Promise.race([task, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export type NotionPage = Extract<
  Awaited<ReturnType<Client["databases"]["query"]>>["results"][number],
  { object: "page" }
> & { properties?: Record<string, unknown> };

export type NotionFullPage = NotionPage & { properties: Record<string, unknown> };

export type NotionBlock = Extract<
  Awaited<ReturnType<Client["blocks"]["children"]["list"]>>["results"][number],
  { object: "block" }
> & { type?: string; has_children?: boolean };

export type NotionFullBlock = NotionBlock & { type: string; has_children: boolean };

export async function queryDatabaseAll(params: {
  databaseId: string;
  pageSize?: number;
  filter?: Parameters<Client["databases"]["query"]>[0]["filter"];
  sorts?: Parameters<Client["databases"]["query"]>[0]["sorts"];
  maxPages?: number;
}): Promise<NotionFullPage[]> {
  try {
    const client = notionClient();
    if (!client || !params.databaseId) return [];

    const pageSize = Math.min(params.pageSize ?? 50, 100);
    const maxPages = Math.max(params.maxPages ?? 10, 1);

    const out: NotionFullPage[] = [];
    let cursor: string | undefined;

    for (let i = 0; i < maxPages; i++) {
      const res = await client.databases.query({
        database_id: params.databaseId,
        page_size: pageSize,
        start_cursor: cursor,
        filter: params.filter,
        sorts: params.sorts,
      });

      for (const r of res.results) {
        if (r.object === "page" && "properties" in r) {
          out.push(r as NotionFullPage);
        }
      }

      if (!res.has_more || !res.next_cursor) break;
      cursor = res.next_cursor;
    }

    return out;
  } catch (error) {
    console.warn(`queryDatabaseAll failed for DB ${params.databaseId}:`, error);
    return [];
  }
}

export async function listBlockChildrenAll(params: {
  blockId: string;
  pageSize?: number;
  maxPages?: number;
}): Promise<NotionFullBlock[]> {
  try {
    const client = notionClient();
    if (!client || !params.blockId) return [];

    const pageSize = Math.min(params.pageSize ?? 50, 100);
    const maxPages = Math.max(params.maxPages ?? 50, 1);

    const out: NotionFullBlock[] = [];
    let cursor: string | undefined;

    for (let i = 0; i < maxPages; i++) {
      const res = await client.blocks.children.list({
        block_id: params.blockId,
        page_size: pageSize,
        start_cursor: cursor,
      });

      for (const b of res.results) {
        if (b.object === "block" && "type" in b) {
          out.push(b as NotionFullBlock);
        }
      }

      if (!res.has_more || !res.next_cursor) break;
      cursor = res.next_cursor;
    }

    return out;
  } catch (error) {
    console.warn(`listBlockChildrenAll failed for block ${params.blockId}:`, error);
    return [];
  }
}
