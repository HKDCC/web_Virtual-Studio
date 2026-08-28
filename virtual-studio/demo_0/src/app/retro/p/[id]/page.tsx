import { NotionBlocks } from "@/components/NotionBlocks";
import { getPageTitle } from "@/lib/notionHelpers";
import { listBlockChildrenAll, notion } from "@/lib/notion";
import Link from "next/link";

type RichText = {
  plain_text: string;
};

function getHtmlContent(props: Record<string, unknown>): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const htmlProp = props["HTMLContent"] as any;
  if (!htmlProp) return null;
  if (htmlProp.type === "url" && htmlProp.url) {
    return htmlProp.url as string;
  }
  if (htmlProp.type === "rich_text" && Array.isArray(htmlProp.rich_text)) {
    return htmlProp.rich_text.map((t: RichText) => t.plain_text).join("");
  }
  return null;
}

export default async function RetroNotionPageRoute(props: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string; embed?: string }> }) {
  const { id } = await props.params;
  const { from } = await props.searchParams;

  const page = await notion().pages.retrieve({ page_id: id });
  if (page.object !== "page") {
    return <div className="retro-chapter"><h1 style={{color: 'var(--rust)'}}>SYS_ERR: RECORD NOT FOUND</h1></div>;
  }

  const pageWithProps = page as unknown as { properties: Record<string, unknown> };
  const title = getPageTitle(pageWithProps);
  const blocks = await listBlockChildrenAll({ blockId: id });
  const htmlContent = getHtmlContent(pageWithProps.properties ?? {});

  const backUrl = from === "news" ? "/retro/changelog" : "/retro/archive";

  return (
    <section className="retro-chapter" style={{ minHeight: '100vh' }}>
      <div style={{ marginBottom: 48 }}>
        <Link href={backUrl} style={{ 
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em', 
          color: 'var(--muted)', textDecoration: 'none', textTransform: 'uppercase' 
        }}>
          &lt; RETURN_TO_PREV
        </Link>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h1 style={{ 
          fontFamily: 'Noto Serif SC, serif', fontSize: 'clamp(32px, 5vw, 48px)', 
          fontWeight: 900, lineHeight: 1.2, color: 'var(--ink)', marginBottom: 24 
        }}>
          {title}
        </h1>
        <div style={{ display: 'flex', gap: 24, borderTop: '1.5px solid var(--line)', paddingTop: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)' }}>RECORD_ID</div>
            <div style={{ fontFamily: 'Noto Serif SC, serif', fontWeight: 700, fontSize: 14 }}>{id.split('-')[0]}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--muted)' }}>STATUS</div>
            <div style={{ fontFamily: 'Noto Serif SC, serif', fontWeight: 700, fontSize: 14, color: 'var(--teal)' }}>DECRYPTED</div>
          </div>
        </div>
      </div>

      <div className="retro-prose" style={{ position: "relative" }}>
        {htmlContent ? (
          <iframe
            src={htmlContent}
            style={{ width: "100%", height: "80vh", border: "2px solid var(--line)", display: "block", boxShadow: "8px 8px 0 var(--line)" }}
            sandbox="allow-same-origin"
            title={title}
          />
        ) : (
          <NotionBlocks blocks={blocks} />
        )}
      </div>
    </section>
  );
}
