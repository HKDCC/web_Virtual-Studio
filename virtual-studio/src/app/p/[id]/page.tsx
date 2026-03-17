import { NotionBlocks } from "@/components/NotionBlocks";
import { getPageTitle } from "@/lib/notionHelpers";
import { listBlockChildrenAll, notion } from "@/lib/notion";
import Link from "next/link";
import { BookOverviewHeader } from "@/components/BookOverviewHeader";

export default async function NotionPageRoute(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const page = await notion().pages.retrieve({ page_id: id });
  if (page.object !== "page") {
    return <div style={{ padding: "40px 48px" }}>Not a page.</div>;
  }

  const pageWithProps = page as unknown as { properties: Record<string, unknown> };
  const title = getPageTitle(pageWithProps);
  const blocks = await listBlockChildrenAll({ blockId: id });

  const propsRecord = pageWithProps.properties ?? {};
  const isBook = Object.prototype.hasOwnProperty.call(propsRecord, "Author") || Object.prototype.hasOwnProperty.call(propsRecord, "DownloadURL");

  return (
    <>
      {isBook ? (
        <BookOverviewHeader title={title} properties={propsRecord} />
      ) : (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 48px 0" }}>
          <div style={{ marginBottom: 20 }}>
            <Link href="/archive" style={{ textDecoration: "none", color: "var(--ink-2)", fontSize: 13 }}>
              ← 返回
            </Link>
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 300, lineHeight: 1.3, marginBottom: 16 }}>
            {title}
          </h1>
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 48px 80px" }}>
        <NotionBlocks blocks={blocks} />
      </div>
    </>
  );
}

