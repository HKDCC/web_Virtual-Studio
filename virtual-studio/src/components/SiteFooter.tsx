import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="footer-brand">© 2025 Tech-Linguist Lab · Built with Astro + Notion</span>
      <div className="footer-links">
        <Link href="/" prefetch={false}>
          GitHub
        </Link>
        <Link href="/" prefetch={false}>
          RSS
        </Link>
        <Link href="/" prefetch={false}>
          About
        </Link>
      </div>
    </footer>
  );
}

