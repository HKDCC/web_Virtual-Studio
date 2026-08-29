import "server-only";
import { Client } from "@notionhq/client";
import { env } from "@/lib/env";

let cachedClient: Client | null = null;
let cachedToken: string | null = null;

export function notionClient(): Client | null {
  const token = env.NOTION_TOKEN || process.env.NOTION_TOKEN;
  if (!token || token.trim().length === 0) return null;
  if (cachedClient && cachedToken === token) return cachedClient;
  cachedToken = token;
  cachedClient = new Client({ auth: token });
  return cachedClient;
}

export function notion(): Client {
  const client = notionClient();
  if (!client) {
    throw new Error("Missing env: NOTION_TOKEN");
  }
  return client;
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
