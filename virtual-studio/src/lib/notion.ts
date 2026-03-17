import "server-only";
import { Client } from "@notionhq/client";
import { requireEnv } from "@/lib/env";

let cached: Client | null = null;

export function notion(): Client {
  if (cached) return cached;
  cached = new Client({ auth: requireEnv("NOTION_TOKEN") });
  return cached;
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
}) {
  const pageSize = Math.min(params.pageSize ?? 50, 100);
  const maxPages = Math.max(params.maxPages ?? 10, 1);

  const out: NotionFullPage[] = [];
  let cursor: string | undefined;

  for (let i = 0; i < maxPages; i++) {
    const res = await notion().databases.query({
      database_id: params.databaseId,
      page_size: pageSize,
      start_cursor: cursor,
      filter: params.filter,
      sorts: params.sorts,
    });

    for (const r of res.results) {
      if (r.object === "page") {
        // Notion typings allow PartialPageObjectResponse; we only keep pages with properties.
        if ("properties" in r) out.push(r as NotionFullPage);
      }
    }

    if (!res.has_more || !res.next_cursor) break;
    cursor = res.next_cursor;
  }

  return out;
}

export async function listBlockChildrenAll(params: {
  blockId: string;
  pageSize?: number;
  maxPages?: number;
}) {
  const pageSize = Math.min(params.pageSize ?? 50, 100);
  const maxPages = Math.max(params.maxPages ?? 50, 1);

  const out: NotionFullBlock[] = [];
  let cursor: string | undefined;

  for (let i = 0; i < maxPages; i++) {
    const res = await notion().blocks.children.list({
      block_id: params.blockId,
      page_size: pageSize,
      start_cursor: cursor,
    });

    for (const b of res.results) {
      if (b.object === "block") {
        if ("type" in b) out.push(b as NotionFullBlock);
      }
    }

    if (!res.has_more || !res.next_cursor) break;
    cursor = res.next_cursor;
  }

  return out;
}

