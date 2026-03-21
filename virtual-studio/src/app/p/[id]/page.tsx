import { NotionBlocks } from "@/components/NotionBlocks";
import { getPageTitle } from "@/lib/notionHelpers";
import { listBlockChildrenAll, notion } from "@/lib/notion";
import Link from "next/link";
import { BookOverviewHeader } from "@/components/BookOverviewHeader";
import { TableOfContentsWrapper } from "@/components/TableOfContentsWrapper";

type RichText = {
  plain_text: string;
};

function getHtmlContent(props: Record<string, unknown>): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const htmlProp = props["HTMLContent"] as any;
  if (!htmlProp) return null;
  if (htmlProp.type === "rich_text" && Array.isArray(htmlProp.rich_text)) {
    return htmlProp.rich_text.map((t: RichText) => t.plain_text).join("");
  }
  return null;
}

function extractHeadings(blocks: { type: string; [key: string]: unknown }[]) {
  const headings: { id: string; text: string; level: number }[] = [];

  blocks.forEach((block) => {
    const type = block.type as string;
    if (type === "heading_1" || type === "heading_2" || type === "heading_3") {
      const h = block[type] as { rich_text?: RichText[] } | undefined;
      const rt = h?.rich_text ?? [];
      const text = rt.map((r) => r.plain_text).join("");
      const level = parseInt(type.replace("heading_", ""));
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      headings.push({ id, text, level });
    }
  });

  return headings;
}

export default async function NotionPageRoute(props: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> }) {
  const { id } = await props.params;
  const { from } = await props.searchParams;

  const page = await notion().pages.retrieve({ page_id: id });
  if (page.object !== "page") {
    return <div style={{ padding: "40px 48px" }}>Not a page.</div>;
  }

  const pageWithProps = page as unknown as { properties: Record<string, unknown> };
  const title = getPageTitle(pageWithProps);
  const blocks = await listBlockChildrenAll({ blockId: id });
  const headings = extractHeadings(blocks);

  const propsRecord = pageWithProps.properties ?? {};
  const isBook = Object.prototype.hasOwnProperty.call(propsRecord, "Author") || Object.prototype.hasOwnProperty.call(propsRecord, "DownloadURL");
  const htmlContent = getHtmlContent(propsRecord);
  const backUrl = from === "news" ? "/news" : "/archive";

  return (
    <>
      {isBook ? (
        <BookOverviewHeader title={title} properties={propsRecord} />
      ) : (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 48px 0" }}>
          <div style={{ marginBottom: 20 }}>
            <Link href={backUrl} style={{ textDecoration: "none", color: "var(--ink-2)", fontSize: 13 }}>
              ← 返回
            </Link>
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 300, lineHeight: 1.3, marginBottom: 16 }}>
            {title}
          </h1>
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 48px 80px", position: "relative" }}>
        {htmlContent ? (
          <iframe
            src={htmlContent}
            style={{ width: "100%", height: "100vh", border: "none", minHeight: "80vh" }}
            sandbox="allow-same-origin"
            title={title}
          />
        ) : (
          <NotionBlocks blocks={blocks} />
        )}
      </div>

      <TableOfContentsWrapper headings={headings} />
    </>
  );
}

