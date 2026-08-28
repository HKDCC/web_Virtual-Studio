import "server-only";
import { env } from "@/lib/env";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  if (env.REVALIDATE_TOKEN) {
    const token = req.headers.get("x-revalidate-token") ?? "";
    if (token !== env.REVALIDATE_TOKEN) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const body = await req.json().catch(() => ({}));
  const path = typeof body?.path === "string" ? body.path : "/";

  revalidatePath(path);
  return Response.json({ revalidated: true, path });
}

