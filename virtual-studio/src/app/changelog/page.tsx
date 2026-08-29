import Link from "next/link";
import { fetchMagazineData } from "@/lib/magazineData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ChangelogPage() {
  const data = await fetchMagazineData();
  const items = Array.isArray(data?.log) ? data.log : [];

  return (
    <div className="wrap" style={{ paddingTop: "24px", paddingBottom: "80px" }}>
      <nav className="detail-breadcrumb" aria-label="面包屑导航" style={{ marginBottom: "20px" }}>
        <Link href="/" className="detail-breadcrumb-link">
          首页
        </Link>
        <span className="detail-breadcrumb-sep">/</span>
        <span className="detail-breadcrumb-current">
          <span className="detail-breadcrumb-icon">👣</span>
          06 足迹 · 迭代记录
        </span>
      </nav>

      <div className="section-header" style={{ marginBottom: "32px" }}>
        <div>
          <p className="section-eyebrow">Change Log · 06 足迹</p>
          <h1 className="section-title">这个虚拟空间的迭代记录</h1>
        </div>
        <p className="section-desc">版本变迁、功能上线与实验性架构探索的历史足迹。</p>
      </div>

      <div className="changelog-wrap">
        <p className="cl-year">{new Date().getFullYear()}</p>
        {items.map((p, idx) => {
          const title = p.t || "Update";
          const date = p.d || "—";
          const type = p.type || "Update";
          const desc = p.desc || "";

          const dot =
            (type ?? "").toLowerCase().includes("fix") || (type ?? "").toLowerCase().includes("improve")
              ? "fix"
              : (type ?? "").toLowerCase().includes("add") || (type ?? "").toLowerCase().includes("content")
                ? "add"
                : "feat";

          return (
            <Link key={p.id || idx} href={p.id ? `/p/${p.id}` : "#changelog"} className="cl-item">
              <span className="cl-date">{date.replace(/.*-(\d\d)-(\d\d).*/, "$1·$2")}</span>
              <div className={`cl-dot ${dot}`} />
              <div className="cl-content">
                <span className={`cl-tag ${dot}`}>{type}</span>
                <div className="cl-title">{title}</div>
                {desc ? <p className="cl-desc">{desc}</p> : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

