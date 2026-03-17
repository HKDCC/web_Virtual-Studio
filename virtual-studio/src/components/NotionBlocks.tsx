import Link from "next/link";
import type { NotionFullBlock } from "@/lib/notion";
import { listBlockChildrenAll } from "@/lib/notion";
import { NotionToggle } from "@/components/NotionToggle";

type RichText = {
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
};

function RichTextSpan({ rt }: { rt: RichText }) {
  const style: React.CSSProperties = {};
  if (rt.annotations.bold) style.fontWeight = 600;
  if (rt.annotations.italic) style.fontStyle = "italic";
  if (rt.annotations.strikethrough) style.textDecoration = "line-through";
  if (rt.annotations.underline) style.textDecoration = style.textDecoration
    ? `${style.textDecoration} underline`
    : "underline";

  if (rt.annotations.code) {
    return <code>{rt.plain_text}</code>;
  }

  if (rt.href) {
    const isInternal = rt.href.startsWith("/");
    return isInternal ? (
      <Link href={rt.href} style={style}>
        {rt.plain_text}
      </Link>
    ) : (
      <a href={rt.href} target="_blank" rel="noreferrer" style={style}>
        {rt.plain_text}
      </a>
    );
  }

  return <span style={style}>{rt.plain_text}</span>;
}

function renderRichText(arr: RichText[]) {
  return arr.map((rt, idx) => <RichTextSpan key={idx} rt={rt} />);
}

function calloutTone(color: string): "info" | "warn" | "tip" {
  // Notion color names are like "blue_background", "yellow_background", etc.
  if (color.includes("yellow") || color.includes("orange") || color.includes("red")) return "warn";
  if (color.includes("green")) return "tip";
  return "info";
}

async function RenderBlock({ block }: { block: NotionFullBlock }) {
  const type = block.type as string;
  const b = block as unknown as Record<string, unknown>;

  switch (type) {
    case "heading_1": {
      const h = b["heading_1"] as unknown as { rich_text?: RichText[] } | undefined;
      const rt = h?.rich_text ?? [];
      return <h2>{renderRichText(rt)}</h2>;
    }
    case "heading_2": {
      const h = b["heading_2"] as unknown as { rich_text?: RichText[] } | undefined;
      const rt = h?.rich_text ?? [];
      return <h2>{renderRichText(rt)}</h2>;
    }
    case "heading_3": {
      const h = b["heading_3"] as unknown as { rich_text?: RichText[] } | undefined;
      const rt = h?.rich_text ?? [];
      return <h3>{renderRichText(rt)}</h3>;
    }
    case "paragraph": {
      const p = b["paragraph"] as unknown as { rich_text?: RichText[] } | undefined;
      const rt = p?.rich_text ?? [];
      if (!rt?.length) return <p style={{ color: "var(--ink-2)" }}>&nbsp;</p>;
      return <p>{renderRichText(rt)}</p>;
    }
    case "code": {
      const c = b["code"] as unknown as { rich_text?: RichText[] } | undefined;
      const rt = c?.rich_text ?? [];
      const code = rt.map((t) => t.plain_text).join("");
      return (
        <pre>
          <code>{code}</code>
        </pre>
      );
    }
    case "divider": {
      return <hr style={{ border: "none", borderTop: "1px solid var(--bg-3)", margin: "28px 0" }} />;
    }
    case "quote": {
      const q = b["quote"] as unknown as { rich_text?: RichText[] } | undefined;
      const rt = q?.rich_text ?? [];
      return (
        <blockquote
          style={{
            borderLeft: "3px solid var(--bg-3)",
            paddingLeft: 14,
            color: "var(--ink-2)",
            margin: "18px 0",
          }}
        >
          {renderRichText(rt)}
        </blockquote>
      );
    }
    case "callout": {
      const callout = b["callout"] as unknown as {
        icon?: { type: "emoji"; emoji: string } | { type: string };
        color?: string;
        rich_text?: RichText[];
      } | undefined;
      const color = String(callout?.color ?? "default");
      const rt = callout?.rich_text ?? [];
      const tone = calloutTone(color);
      const emoji =
        callout?.icon && callout.icon.type === "emoji" && "emoji" in callout.icon
          ? callout.icon.emoji
          : "💡";
      return (
        <div className={`notion-callout ${tone}`}>
          <span className="callout-icon">{emoji}</span>
          <span className={`callout-text ${tone}`}>{renderRichText(rt)}</span>
        </div>
      );
    }
    case "toggle": {
      const t = b["toggle"] as unknown as { rich_text?: RichText[] } | undefined;
      const rt = t?.rich_text ?? [];
      const children = block.has_children
        ? await listBlockChildrenAll({ blockId: block.id })
        : [];
      return (
        <NotionToggle summary={renderRichText(rt)}>
          <NotionBlocks blocks={children} />
        </NotionToggle>
      );
    }
    case "bulleted_list_item": {
      const li = b["bulleted_list_item"] as unknown as { rich_text?: RichText[] } | undefined;
      const rt = li?.rich_text ?? [];
      return (
        <ul style={{ paddingLeft: 22, margin: "10px 0" }}>
          <li style={{ margin: "6px 0" }}>{renderRichText(rt)}</li>
        </ul>
      );
    }
    case "numbered_list_item": {
      const li = b["numbered_list_item"] as unknown as { rich_text?: RichText[] } | undefined;
      const rt = li?.rich_text ?? [];
      return (
        <ol style={{ paddingLeft: 22, margin: "10px 0" }}>
          <li style={{ margin: "6px 0" }}>{renderRichText(rt)}</li>
        </ol>
      );
    }
    default: {
      return null;
    }
  }
}

export async function NotionBlocks({ blocks }: { blocks: NotionFullBlock[] }) {
  return (
    <div className="prose">
      {await Promise.all(
        blocks.map(async (b) => (
          <div key={b.id}>{await RenderBlock({ block: b })}</div>
        )),
      )}
    </div>
  );
}

