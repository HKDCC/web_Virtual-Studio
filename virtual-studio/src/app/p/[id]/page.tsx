import { NotionBlocks } from "@/components/NotionBlocks";
import { getPageTitle } from "@/lib/notionHelpers";
import { listBlockChildrenAll, notion } from "@/lib/notion";
import Link from "next/link";
import { TableOfContentsWrapper } from "@/components/TableOfContentsWrapper";
import { BookDetailHeader } from "@/components/detail/BookDetailHeader";
import { LabDetailHeader } from "@/components/detail/LabDetailHeader";
import { PauseDetailHeader } from "@/components/detail/PauseDetailHeader";
import { NoteDetailHeader } from "@/components/detail/NoteDetailHeader";
import { DetailBreadcrumb } from "@/components/detail/DetailBreadcrumb";

type RichText = {
  plain_text: string;
};

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getHtmlContent(props: Record<string, unknown>): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const htmlProp = props["HTMLContent"] as any;
  if (!htmlProp) return null;
  // URL 类型属性
  if (htmlProp.type === "url" && htmlProp.url) {
    return htmlProp.url as string;
  }
  // rich_text 类型属性
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

export default async function NotionPageRoute(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; embed?: string }>;
}) {
  const { id } = await props.params;
  const { from, embed } = await props.searchParams;

  let page: Record<string, unknown> | null = null;
  try {
    const client = notion();
    const res = await client.pages.retrieve({ page_id: id });
    if ("properties" in res) {
      page = res as unknown as Record<string, unknown>;
    }
  } catch (e) {
    console.warn("Could not retrieve Notion page:", id, e);
  }

  if (!page) {
    return (
      <div className="wrap" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", marginBottom: "16px" }}>内容未找到或已归档</h2>
        <p style={{ color: "var(--ink-2)", marginBottom: "24px" }}>该条目可能已被移除或暂未发布。</p>
        <Link href="/" className="version-pill" style={{ display: "inline-block", padding: "8px 18px" }}>
          ← 返回首页
        </Link>
      </div>
    );
  }

  const pageWithProps = page as unknown as { properties: Record<string, unknown> };
  const title = getPageTitle(pageWithProps);
  const blocks = await listBlockChildrenAll({ blockId: id });
  const headings = extractHeadings(blocks);

  const propsRecord = pageWithProps.properties ?? {};

  // Extract Page Icon
  let pageIcon: { type: "emoji" | "image"; value: string } | null = null;
  if (isObj(page.icon)) {
    const ic = page.icon as Record<string, unknown>;
    if (ic.type === "emoji" && typeof ic.emoji === "string") pageIcon = { type: "emoji", value: ic.emoji };
    else if (ic.type === "file" && isObj(ic.file) && typeof ic.file.url === "string") pageIcon = { type: "image", value: ic.file.url };
    else if (ic.type === "external" && isObj(ic.external) && typeof ic.external.url === "string") pageIcon = { type: "image", value: ic.external.url };
  }

  // Extract Page Cover
  let pageCover: string | null = null;
  if (isObj(page.cover)) {
    const cov = page.cover as Record<string, unknown>;
    if (cov.type === "file" && isObj(cov.file) && typeof cov.file.url === "string") pageCover = cov.file.url;
    else if (cov.type === "external" && isObj(cov.external) && typeof cov.external.url === "string") pageCover = cov.external.url;
  }

  const isBook =
    Object.prototype.hasOwnProperty.call(propsRecord, "Author") ||
    Object.prototype.hasOwnProperty.call(propsRecord, "DownloadURL") ||
    Object.prototype.hasOwnProperty.call(propsRecord, "MyRating");

  const isLab =
    Object.prototype.hasOwnProperty.call(propsRecord, "GitHubURL") ||
    Object.prototype.hasOwnProperty.call(propsRecord, "DemoURL") ||
    Object.prototype.hasOwnProperty.call(propsRecord, "Badge");

  const isPause =
    Object.prototype.hasOwnProperty.call(propsRecord, "Location") ||
    (from === "pause") ||
    (Object.prototype.hasOwnProperty.call(propsRecord, "Cover") && !isBook && !isLab);

  const isNote =
    Object.prototype.hasOwnProperty.call(propsRecord, "HTMLContent") ||
    Object.prototype.hasOwnProperty.call(propsRecord, "ReadTime") ||
    Object.prototype.hasOwnProperty.call(propsRecord, "Excerpt");

  const htmlContent = getHtmlContent(propsRecord);

  if (embed === "true") {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px", position: "relative" }}>
        {htmlContent ? (
          <iframe
            src={htmlContent}
            style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
            sandbox="allow-same-origin allow-scripts"
            title={title}
          />
        ) : (
          <NotionBlocks blocks={blocks} />
        )}
      </div>
    );
  }

  return (
    <article className="detail-page-wrapper">
      {/* 1. 动态专属详情页头部 */}
      {isBook ? (
        <BookDetailHeader title={title} properties={propsRecord} pageIcon={pageIcon} />
      ) : isLab ? (
        <LabDetailHeader title={title} properties={propsRecord} pageIcon={pageIcon} />
      ) : isPause ? (
        <PauseDetailHeader title={title} properties={propsRecord} pageCover={pageCover} />
      ) : isNote ? (
        <NoteDetailHeader title={title} properties={propsRecord} htmlContent={htmlContent} pageIcon={pageIcon} />
      ) : (
        <div className="generic-detail-header-wrapper">
          <div className="generic-detail-container">
            <DetailBreadcrumb
              sectionTitle="03 归档"
              sectionHref="/archive"
              itemTitle={title}
              icon={pageIcon?.type === "emoji" ? pageIcon.value : "✦"}
            />
            <h1 className="generic-detail-title">{title}</h1>
          </div>
        </div>
      )}

      {/* 2. 详情页正文内容区 (Markdown Blocks 或 HTML 嵌入) */}
      <div className="detail-body-container">
        {htmlContent ? (
          <div className="detail-iframe-frame">
            <iframe
              src={htmlContent}
              style={{ width: "100%", height: "85vh", border: "none", display: "block", borderRadius: "8px" }}
              sandbox="allow-same-origin allow-scripts"
              title={title}
            />
          </div>
        ) : blocks.length > 0 ? (
          <div className="detail-notion-blocks-frame">
            <NotionBlocks blocks={blocks} />
          </div>
        ) : !isPause ? (
          <div className="detail-empty-note">
            <p>✦ 暂无更多正文内容</p>
          </div>
        ) : null}
      </div>

      {headings.length > 1 && <TableOfContentsWrapper headings={headings} />}
    </article>
  );
}

