type PageProps = Record<string, unknown>;

type NotionRichText = { plain_text: string };
type TitleProp = { type: "title"; title: NotionRichText[] };
type RichTextProp = { type: "rich_text"; rich_text: NotionRichText[] };
type SelectProp = { type: "select"; select: { name: string } | null };
type MultiSelectProp = { type: "multi_select"; multi_select: { name: string }[] };
type DateProp = { type: "date"; date: { start: string } | null };
type UrlProp = { type: "url"; url: string | null };

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function firstKey(props: PageProps, type: string) {
  for (const [k, v] of Object.entries(props)) {
    if (isObj(v) && v.type === type) return k;
  }
  return null;
}

export function findPropertyKeyByType(props: PageProps, type: string): string | null {
  return firstKey(props, type);
}

export function getPageTitle(page: { properties: PageProps }): string {
  const props = page.properties;
  const titleKey = firstKey(props, "title");
  if (!titleKey) return "Untitled";
  const raw = props[titleKey];
  if (!isObj(raw) || raw.type !== "title") return "Untitled";
  const titleProp = raw as unknown as TitleProp;
  return titleProp.title.map((t) => t.plain_text).join("") || "Untitled";
}

export function getRichText(props: PageProps, key: string): string | null {
  const p = props[key];
  if (!p) return null;
  if (!isObj(p) || typeof p.type !== "string") return null;
  if (p.type === "rich_text") return (p as unknown as RichTextProp).rich_text.map((t) => t.plain_text).join("") || null;
  if (p.type === "title") return (p as unknown as TitleProp).title.map((t) => t.plain_text).join("") || null;
  return null;
}

export function getSelect(props: PageProps, key: string): string | null {
  const p = props[key];
  if (!p) return null;
  if (!isObj(p) || p.type !== "select") return null;
  return (p as unknown as SelectProp).select?.name ?? null;
  return null;
}

export function getMultiSelect(props: PageProps, key: string): string[] {
  const p = props[key];
  if (!p) return [];
  if (!isObj(p) || p.type !== "multi_select") return [];
  return (p as unknown as MultiSelectProp).multi_select.map((s) => s.name);
  return [];
}

export function getDate(props: PageProps, key: string): string | null {
  const p = props[key];
  if (!p) return null;
  if (!isObj(p) || p.type !== "date") return null;
  return (p as unknown as DateProp).date?.start ?? null;
  return null;
}

export function getUrl(props: PageProps, key: string): string | null {
  const p = props[key];
  if (!p) return null;
  if (!isObj(p) || p.type !== "url") return null;
  return (p as unknown as UrlProp).url ?? null;
  return null;
}

