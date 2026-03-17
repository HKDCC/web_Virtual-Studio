import { z } from "zod";

function optionalNonEmptyString() {
  return z.preprocess((v) => {
    if (typeof v !== "string") return v;
    const trimmed = v.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }, z.string().min(1).optional());
}

const envSchema = z.object({
  NOTION_TOKEN: optionalNonEmptyString(),
  NOTION_CHANGELOG_DB_ID: optionalNonEmptyString(),
  NOTION_NOTES_DB_ID: optionalNonEmptyString(),
  NOTION_WORKFLOW_DB_ID: optionalNonEmptyString(),
  NOTION_BOOKS_DB_ID: optionalNonEmptyString(),
  NOTION_LAB_DB_ID: optionalNonEmptyString(),
  NOTION_PAUSE_DB_ID: optionalNonEmptyString(),
  REVALIDATE_TOKEN: optionalNonEmptyString(),
});

export const env = envSchema.parse({
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_CHANGELOG_DB_ID: process.env.NOTION_CHANGELOG_DB_ID,
  NOTION_NOTES_DB_ID: process.env.NOTION_NOTES_DB_ID,
  NOTION_WORKFLOW_DB_ID: process.env.NOTION_WORKFLOW_DB_ID,
  NOTION_BOOKS_DB_ID: process.env.NOTION_BOOKS_DB_ID,
  NOTION_LAB_DB_ID: process.env.NOTION_LAB_DB_ID,
  NOTION_PAUSE_DB_ID: process.env.NOTION_PAUSE_DB_ID,
  REVALIDATE_TOKEN: process.env.REVALIDATE_TOKEN,
});

export function requireEnv(name: keyof typeof env): string {
  const v = env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

