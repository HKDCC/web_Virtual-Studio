export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="footer-brand">© 2026 Tech-Linguist Lab · Built with Next.js + Notion</span>
      <div className="footer-links">
        <a href="https://github.com/quaxstudio" target="_blank" rel="noopener noreferrer" prefetch={false}>
          GitHub
        </a>
        <a href="/rss.xml" prefetch={false}>
          RSS
        </a>
        <a href="/about" prefetch={false}>
          About
        </a>
      </div>
    </footer>
  );
}

