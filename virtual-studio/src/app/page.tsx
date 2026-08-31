import Link from "next/link";
import { fetchMagazineData } from "@/lib/magazineData";
import { WorkflowSection } from "@/components/magazine/WorkflowSection";
import { ArchiveSection } from "@/components/magazine/ArchiveSection";
import { ModelEvolutionSection } from "@/components/magazine/ModelEvolutionSection";
import { PauseSection } from "@/components/magazine/PauseSection";
import { GameShelfSection } from "@/components/magazine/GameShelfSection";
import { TagPill } from "@/components/common/TagPill";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await fetchMagazineData();
  const {
    books = [],
    lab = [],
    pause = [],
    notes = [],
    log = [],
  } = data || {};

  const safeLab = Array.isArray(lab) ? lab : [];
  const safeNotes = Array.isArray(notes) ? notes : [];
  const safeLog = Array.isArray(log) ? log : [];

  return (
    <>
      {/* ═══════════ 卷首语 ═══════════ */}
      <section className="statement wrap statement-hero">
        <div className="statement-content">
          <p className="kicker">VOL.02 · 2026 — VIRTUAL STUDIO · PERSONAL MAGAZINE</p>
          <h1 className="display">
            <span className="statement-line">我们所有疯狂的行动，</span>
            <span className="statement-line">最终目的或许只是</span>
            <span className="statement-line">
              <em>体验更多的奇妙</em>。
            </span>
          </h1>
          <p className="lede">
            这里记录生产力探索、自我成长、AI 实践，以及那些值得收藏的生活细节。每一个模块，都是一种思维方式的入口。
          </p>
        </div>
        <div className="statement-logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Virtual Studio Logo"
            className="statement-logo-img"
          />
        </div>
      </section>

      {/* ═══════════ 【成果篇】 ═══════════ */}

      {/* ═══════════ 01 实验室 · Lab ═══════════ */}
      <section id="lab" className="block wrap">
        <div className="sec-head reveal">
          <p className="kicker">
            <b>01</b> / 输出层 · OUTPUT
          </p>
          <Link className="util" href="/lab" title="全部实验室项目">
            全部项目 ↗
          </Link>
        </div>
        <h2 className="sec-title reveal">实验室</h2>
        <p className="sec-lede reveal">AI 实践记录与 Vibe Coding 成果。每个项目都是一次认知迭代。</p>
        <div className="lab-list sec-body reveal" id="labGrid">
          {safeLab.map((p, i) => {
            const title = p?.t || "";
            const desc = p?.d || "";
            const tag = p?.tag || "AI 实践";
            const links = Array.isArray(p?.links) ? p.links : [];

            const localFallback =
              title.includes("WhisperX") || title.includes("Whisper") ? "/lab/whisperx_gui.mp4" :
              title.includes("MiniReader") || title.includes("Reader") ? "/lab/minireader.gif" :
              title.includes("Retro") || title.includes("Snake") ? "/lab/retro_pixel_snake.gif" :
              title.includes("MuseTodo") ? "/lab/musetodo_pink.gif" :
              title.includes("Cassette") ? "/lab/cassettecutter.jpg" :
              title.includes("SwiftMemo") ? "/lab/swiftmemo.jpg" : null;
            const imgSrc = localFallback || p?.iconUrl;

            const localAppIcon =
              title.includes("WhisperX") || title.includes("Whisper") ? { type: "image" as const, value: "/lab/icons/whisperx.png" } :
              title.includes("MiniReader") || title.includes("Reader") ? { type: "image" as const, value: "/lab/icons/minireader.png" } :
              title.includes("Cassette") || title.includes("MagicCutter") || title.includes("Cutter") ? { type: "image" as const, value: "/lab/icons/magiccutter.png" } :
              title.includes("SwiftMemo") ? { type: "image" as const, value: "/lab/icons/swiftmemo.png" } :
              title.includes("Retro") || title.includes("Snake") ? { type: "image" as const, value: "/lab/icons/snake.png" } :
              title.includes("MuseTodo") ? { type: "emoji" as const, value: "🌸" } : null;

            const appIcon = localAppIcon || p?.appIcon;

            const isReverse = i % 2 === 1;

            return (
              <article key={p?.id || i} className={`lab-row-card ${isReverse ? "is-reverse" : ""}`}>
                {imgSrc && (
                  <div className="p-card-media-wrapper">
                    {imgSrc.endsWith(".mp4") ? (
                      <video
                        src={imgSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="p-card-media-img"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={imgSrc}
                        alt={title}
                        className="p-card-media-img"
                        loading="lazy"
                      />
                    )}
                  </div>
                )}
                <div className="p-card-body">
                  <div className="lab-card-header">
                    {appIcon?.type === "image" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={appIcon.value}
                        alt=""
                        className="p-app-icon img"
                        aria-hidden="true"
                        loading="lazy"
                      />
                    )}
                    {appIcon?.type === "emoji" && (
                      <span className="p-app-icon emoji" aria-hidden="true">
                        {appIcon.value}
                      </span>
                    )}
                    <div className="lab-header-text">
                      <p className="p-tag">{tag}</p>
                      <h3>{title}</h3>
                    </div>
                  </div>
                  <p className="p-desc">{desc}</p>
                  <div className="p-links">
                    {links.map((l, li) => {
                      const linkText = l?.[0] || "链接";
                      const linkUrl = l?.[1] || "#";
                      return (
                        <a
                          key={li}
                          href={linkUrl}
                          target={linkUrl.startsWith("http") ? "_blank" : undefined}
                          rel={linkUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {linkText} ↗
                        </a>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ═══════════ 02 工作流 · Workflow ═══════════ */}
      <WorkflowSection />

      {/* ═══════════ 03 笔记 · Notes ═══════════ */}
      <section id="notes" className="block wrap">
        <div className="sec-head reveal">
          <p className="kicker">
            <b>03</b> / 片段层 · FRAGMENTS
          </p>
          <Link className="util" href="/archive?tab=notes" title="查看全部笔记">
            全部笔记 ↗
          </Link>
        </div>
        <h2 className="sec-title reveal">笔记</h2>
        <p className="sec-lede reveal">来自 Notion 数据库的文章与深度长文。</p>
        <div className="notes-grid sec-body reveal" id="notesList">
          {safeNotes.slice(0, 6).map((n, i) => {
            const noteTitle = n?.title || "无标题笔记";
            const noteDate = n?.d || "";
            const noteCat = n?.cat || "思考";
            const noteTags = Array.isArray(n?.tags) ? n.tags : [];
            const noteText = n?.text || "";

            const heroLight = n?.heroLight || (n?.id ? `/notes_heroes/${n.id}_light.png` : null);
            const heroDark = n?.heroDark || (n?.id ? `/notes_heroes/${n.id}_dark.png` : null);
            const targetUrl = n?.htmlContent || (n?.id ? `/p/${n.id}` : "#notes");
            const isExternal = Boolean(n?.htmlContent);

            return (
              <article key={n?.id || i} className="note-card">
                {heroLight && heroDark && (
                  <div className="note-card-hero-wrap">
                    {isExternal ? (
                      <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={heroLight}
                          alt={noteTitle}
                          className="note-hero-img theme-light-only"
                          loading="lazy"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={heroDark}
                          alt={noteTitle}
                          className="note-hero-img theme-dark-only"
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <Link href={targetUrl}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={heroLight}
                          alt={noteTitle}
                          className="note-hero-img theme-light-only"
                          loading="lazy"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={heroDark}
                          alt={noteTitle}
                          className="note-hero-img theme-dark-only"
                          loading="lazy"
                        />
                      </Link>
                    )}
                  </div>
                )}
                <div className="note-card-content">
                  <div className="note-card-meta">
                    <span className="note-date">{noteDate}</span>
                    <span className="note-cat">{noteCat}</span>
                    {n?.readTime ? <span className="note-readtime">{n.readTime} 分钟阅读</span> : null}
                  </div>
                  {noteTags.length > 0 && (
                    <div className="note-tags-wrap">
                      {noteTags.map((t) => (
                        <TagPill key={t} tag={t} />
                      ))}
                    </div>
                  )}
                  <h3 className="note-title">
                    {n?.htmlContent ? (
                      <a href={n.htmlContent} target="_blank" rel="noopener noreferrer">
                        {noteTitle}
                      </a>
                    ) : (
                      <Link href={n?.id ? `/p/${n.id}` : "#notes"}>
                        {noteTitle}
                      </Link>
                    )}
                  </h3>
                  <p className="note-excerpt">{noteText}</p>
                  <div className="note-links">
                    {n?.id && (
                      <Link href={`/p/${n.id}`} className="note-link-btn">
                        阅读笔记 ↗
                      </Link>
                    )}
                    {n?.htmlContent && (
                      <a
                        href={n.htmlContent}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="note-link-btn note-link-html"
                      >
                        独立排版 ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {safeNotes.length > 6 && (
          <div className="notes-more-row reveal" style={{ textAlign: "center", marginTop: "28px" }}>
            <Link
              href="/archive?tab=notes"
              className="version-pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 24px",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                background: "var(--paper-2)",
                border: "1px solid var(--line)",
                color: "var(--ink)",
                borderRadius: "6px",
                transition: "all 0.2s"
              }}
            >
              <span>查看全部 {safeNotes.length} 篇深度笔记</span>
              <span>↗</span>
            </Link>
          </div>
        )}
      </section>

      {/* ═══════════ 【输入与记录篇】 ═══════════ */}

      {/* ═══════════ 03 库 · Archive ═══════════ */}
      <ArchiveSection books={books} />

      {/* ═══════════ 04 时间线 · Timeline / 模型更迭 ═══════════ */}
      <ModelEvolutionSection />

      {/* ═══════════ 05 隙 · Pause ═══════════ */}
      <PauseSection pause={pause} />

      {/* ═══════════ 06 游戏 · Games ═══════════ */}
      <GameShelfSection />

      {/* ═══════════ 07 足迹 · Change Log ═══════════ */}
      <section id="changelog" className="block wrap">
        <div className="sec-head reveal">
          <p className="kicker">
            <b>07</b> / 日志 · LOG
          </p>
          <Link className="util" href="/changelog" title="全部足迹">
            全部足迹 ↗
          </Link>
        </div>
        <h2 className="sec-title reveal">足迹</h2>
        <p className="sec-lede reveal">这个虚拟空间的迭代记录。</p>
        <div className="log sec-body reveal" id="logList">
          {safeLog.map((l, i) => {
            const date = l?.d || "";
            const title = l?.t || "";
            const desc = l?.desc || "";
            const type = l?.type || "Feature";
            const row = (
              <div className="log-row">
                <span className="log-date">{date}</span>
                <div className="log-main">
                  <div className="log-title-row">
                    <h3 className="log-title">{title}</h3>
                    {type && (
                      <span className={`log-tag log-tag-${type.toLowerCase()}`}>{type}</span>
                    )}
                  </div>
                  {desc && <p className="log-desc">{desc}</p>}
                </div>
              </div>
            );

            if (l?.id) {
              return (
                <Link key={l.id || i} href={`/p/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {row}
                </Link>
              );
            }
            return <div key={i}>{row}</div>;
          })}
        </div>
      </section>
    </>
  );
}
