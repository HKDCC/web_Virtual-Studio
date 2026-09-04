import Link from "next/link";

export function DetailLoadError({ retryHref, backHref }: { retryHref: string; backHref: string }) {
  return (
    <div className="wrap" style={{ padding: "80px 24px", textAlign: "center" }}>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", marginBottom: "16px" }}>
        内容暂时无法加载
      </h2>
      <p style={{ color: "var(--ink-2)", marginBottom: "24px" }}>
        外部知识库响应较慢，请稍后重试，或返回归档继续浏览。
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
        <Link href={retryHref} className="version-pill" style={{ display: "inline-block", padding: "8px 18px" }}>
          重新加载
        </Link>
        <Link href={backHref} className="version-pill" style={{ display: "inline-block", padding: "8px 18px" }}>
          返回归档
        </Link>
      </div>
    </div>
  );
}
