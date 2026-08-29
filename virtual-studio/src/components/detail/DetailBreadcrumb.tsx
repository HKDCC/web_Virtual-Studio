import Link from "next/link";

export function DetailBreadcrumb({
  sectionTitle,
  sectionHref,
  itemTitle,
  icon,
}: {
  sectionTitle: string;
  sectionHref: string;
  itemTitle: string;
  icon?: React.ReactNode;
}) {
  return (
    <nav className="detail-breadcrumb" aria-label="面包屑导航">
      <Link href="/" className="detail-breadcrumb-link">
        首页
      </Link>
      <span className="detail-breadcrumb-sep">/</span>
      <Link href={sectionHref} className="detail-breadcrumb-link">
        {sectionTitle}
      </Link>
      <span className="detail-breadcrumb-sep">/</span>
      <span className="detail-breadcrumb-current">
        {icon && <span className="detail-breadcrumb-icon">{icon}</span>}
        {itemTitle}
      </span>
    </nav>
  );
}
