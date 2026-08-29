import Link from "next/link";
import { fetchMagazineData } from "@/lib/magazineData";
import { ArchiveSection } from "@/components/magazine/ArchiveSection";
import { PauseSection } from "@/components/magazine/PauseSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await fetchMagazineData();
  const { books = [], lab = [], timeline = [], pause = [], notes = [], log = [] } = data || {};

  const safeLab = Array.isArray(lab) ? lab : [];
  const safeNotes = Array.isArray(notes) ? notes : [];
  const safeTimeline = Array.isArray(timeline) ? timeline : [];
  const safeLog = Array.isArray(log) ? log : [];

  return (
    <>
      {/* ═══════════ 卷首语 ═══════════ */}
      <section className="statement wrap">
        <p className="kicker">VOL.02 · 2026 — VIRTUAL STUDIO · PERSONAL MAGAZINE</p>
        <h1 className="display">
          我们所有疯狂的行动，
          <br />
          最终目的或许只是
          <br />
          <em>体验更多的奇妙</em>。
        </h1>
        <p className="lede">
          这里记录生产力探索、自我成长、AI 实践，以及那些值得收藏的生活细节。每一个模块，都是一种思维方式的入口。
        </p>
      </section>

      {/* ═══════════ 【成果篇】 ═══════════ */}

      {/* ═══════════ 01 实验室 · Lab ═══════════ */}
      <section id="lab" className="block wrap">
        <div className="sec-head reveal">
          <p className="kicker">
            <b>01</b> / 输出层 · OUTPUT
          </p>
          <a className="util" href="/lab" title="全部实验室项目">
            全部项目 ↗
          </a>
        </div>
        <h2 className="sec-title reveal">实验室</h2>
        <p className="sec-lede reveal">AI 实践记录与 Vibe Coding 成果。每个项目都是一次认知迭代。</p>
        <div className="lab-grid sec-body reveal" id="labGrid">
          {safeLab.map((p, i) => {
            const title = p?.t || "";
            const desc = p?.d || "";
            const tag = p?.tag || "AI 实践";
            const links = Array.isArray(p?.links) ? p.links : [];

            const localFallback =
              title.includes("MiniReader") || title.includes("Reader") ? "/lab/minireader.gif" :
              title.includes("Retro") || title.includes("Snake") ? "/lab/retro_pixel_snake.gif" :
              title.includes("MuseTodo") ? "/lab/musetodo_pink.gif" :
              title.includes("Cassette") ? "/lab/cassettecutter.jpg" :
              title.includes("SwiftMemo") ? "/lab/swiftmemo.jpg" : null;
            const imgSrc = p?.iconUrl || localFallback;

            return (
              <article key={p?.id || i} className={`p-card${i === 0 ? " p-featured" : ""}`}>
                {imgSrc && (
                  <div className="p-card-media-wrapper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={title}
                      className="p-card-media-img"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (localFallback && target.src !== localFallback) {
                          target.src = localFallback;
                        }
                      }}
                    />
                  </div>
                )}
                <p className="p-tag">{tag}</p>
                <h3>{title}</h3>
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
              </article>
            );
          })}
        </div>
      </section>

      {/* ═══════════ 02 笔记 · Notes ═══════════ */}
      <section id="notes" className="block wrap">
        <div className="sec-head reveal">
          <p className="kicker">
            <b>02</b> / 片段层 · FRAGMENTS
          </p>
          <a className="util" href="/archive?tab=notes" title="查看全部笔记">
            全部笔记 ↗
          </a>
        </div>
        <h2 className="sec-title reveal">笔记</h2>
        <p className="sec-lede reveal">来自 Notion 数据库的文章与深度长文。</p>
        <div className="notes-grid sec-body reveal" id="notesList">
          {safeNotes.map((n, i) => {
            const targetUrl = n?.htmlContent || (n?.id ? `/p/${n.id}` : "#notes");
            const noteTitle = n?.title || "无标题笔记";
            const noteDate = n?.d || "";
            const noteCat = n?.cat || "思考";
            const noteTags = Array.isArray(n?.tags) ? n.tags : [];
            const noteText = n?.text || "";

            return (
              <article key={n?.id || i} className="note-card">
                <div className="note-card-meta">
                  <span className="note-date">{noteDate}</span>
                  <span className="note-cat">{noteCat}</span>
                  {noteTags.length > 0 && (
                    <span className="note-tags">
                      {noteTags.map((t) => `#${t}`).join(" ")}
                    </span>
                  )}
                  {n?.readTime ? <span className="note-readtime">{n.readTime} 分钟阅读</span> : null}
                </div>
                <h3 className="note-title">
                  <Link href={targetUrl} target={n?.htmlContent ? "_blank" : undefined}>
                    {noteTitle}
                  </Link>
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
                      独立排版版 ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ═══════════ 【输入与记录篇】 ═══════════ */}

      {/* ═══════════ 03 库 · Archive ═══════════ */}
      <ArchiveSection books={books} />

      {/* ═══════════ 04 时间线 · Timeline ═══════════ */}
      <section id="timeline" className="block wrap">
        <div className="sec-head reveal">
          <p className="kicker">
            <b>04</b> / 观测层 · OBSERVATION
          </p>
          <a className="util" href="/aievolutionlog" title="大模型迭代时间轴">
            全部更迭 ↗
          </a>
        </div>
        <h2 className="sec-title reveal">模型更迭</h2>
        <p className="sec-lede reveal">主流大语言模型迭代时间轴，高光时刻精确记录。</p>
        <div className="tl-list sec-body reveal" id="tlList">
          {safeTimeline.map((x, i) => (
            <div key={i} className="tl-row">
              <span className="tl-date">{x?.d || ""}</span>
              <div className="tl-main">
                <h3>{x?.t || ""}</h3>
                <span className="tl-note">{x?.note || ""}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 05 隙 · Pause ═══════════ */}
      <PauseSection pause={pause} />

      {/* ═══════════ 06 足迹 · Change Log ═══════════ */}
      <section id="changelog" className="block wrap">
        <div className="sec-head reveal">
          <p className="kicker">
            <b>06</b> / 日志 · LOG
          </p>
          <a className="util" href="/changelog" title="全部足迹">
            全部足迹 ↗
          </a>
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
