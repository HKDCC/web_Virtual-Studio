export const env = {
  get NOTION_TOKEN() {
    const v = process.env.NOTION_TOKEN?.trim();
    return v && v.length > 0 ? v : undefined;
  },
  get NOTION_CHANGELOG_DB_ID() {
    return process.env.NOTION_CHANGELOG_DB_ID?.trim() || "3254b57fe15a80fab70fcfd3f3d1f12d";
  },
  get NOTION_NOTES_DB_ID() {
    return process.env.NOTION_NOTES_DB_ID?.trim() || "3254b57fe15a809990affde8cced6794";
  },
  get NOTION_WORKFLOW_DB_ID() {
    return process.env.NOTION_WORKFLOW_DB_ID?.trim() || "3254b57fe15a803cac61d97a5b1cfc4d";
  },
  get NOTION_BOOKS_DB_ID() {
    return process.env.NOTION_BOOKS_DB_ID?.trim() || "3254b57fe15a8064901aea5bc026b087";
  },
  get NOTION_LAB_DB_ID() {
    return process.env.NOTION_LAB_DB_ID?.trim() || "3254b57fe15a801abbe4fb32bcf7fdc5";
  },
  get NOTION_PAUSE_DB_ID() {
    return process.env.NOTION_PAUSE_DB_ID?.trim() || "3264b57fe15a80879dccf1f3bfed78f1";
  },
  get NOTION_AINEWS_DB_ID() {
    return process.env.NOTION_AINEWS_DB_ID?.trim() || "3294b57fe15a80828ae4fa4138ee6bcb";
  },
  get REVALIDATE_TOKEN() {
    const v = process.env.REVALIDATE_TOKEN?.trim();
    return v && v.length > 0 ? v : undefined;
  },
};

export function requireEnv(name: keyof typeof env): string {
  const v = env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}
