import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getPageTitle, getRichText, getSelect, getUrl } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";
import Link from "next/link";

function propsOf(p: { properties: unknown }): Record<string, unknown> {
  return p.properties as Record<string, unknown>;
}

function typeOf(p: { properties: unknown }): string {
  return (getSelect(propsOf(p), "Type") ?? "").toLowerCase();
}

export default async function LabPage() {
  const db = env.NOTION_LAB_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <SetupNotice title="Lab 需要配置 NOTION_TOKEN / NOTION_LAB_DB_ID" />;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 50, maxPages: 6 });

  const ai = items.filter((p) => typeOf(p).includes("ai"));
  const vibe = items.filter((p) => typeOf(p).includes("vibe"));

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Lab · 输出层</p>
          <h1 className="section-title">实验室</h1>
        </div>
        <p className="section-desc">AI 实践记录与 Vibe Coding 成果。每个项目都是一次认知迭代。</p>
      </div>

      <div className="workflow-tabs">
        <button type="button" className="wf-tab active">
          AI 实践
        </button>
        <button type="button" className="wf-tab">
          Vibe Coding
        </button>
      </div>

      <div className="wf-panel active" id="lab-ai">
        <div className="lab-grid">
          {ai.map((p) => {
            const props = propsOf(p);
            const badge = getRichText(props, "Badge");
            const desc = getRichText(props, "Description");
            const github = getUrl(props, "GitHubURL");
            const demo = getUrl(props, "DemoURL");
            return (
              <Link key={p.id} href={`/p/${p.id}`} className="lab-card">
                <div className="lab-card-thumb blue">
                  <div className="lab-badge">{badge ?? "Lab"}</div>
                </div>
                <div className="lab-body">
                  <div className="lab-title">{getPageTitle(p)}</div>
                  {desc ? <div className="lab-desc">{desc}</div> : null}
                  <div className="lab-links">
                    {github ? (
                      <a className="lab-link github" href={github} target="_blank" rel="noreferrer">
                        GitHub →
                      </a>
                    ) : null}
                    {demo ? (
                      <a className="lab-link demo" href={demo} target="_blank" rel="noreferrer">
                        Demo
                      </a>
                    ) : (
                      <span className="lab-link demo">查看笔记</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="wf-panel" id="lab-vibe">
        <div className="lab-grid">
          {vibe.map((p) => {
            const props = propsOf(p);
            const badge = getRichText(props, "Badge");
            const desc = getRichText(props, "Description");
            const github = getUrl(props, "GitHubURL");
            const demo = getUrl(props, "DemoURL");
            return (
              <Link key={p.id} href={`/p/${p.id}`} className="lab-card">
                <div className="lab-card-thumb earth">
                  <div className="lab-badge">{badge ?? "Vibe"}</div>
                </div>
                <div className="lab-body">
                  <div className="lab-title">{getPageTitle(p)}</div>
                  {desc ? <div className="lab-desc">{desc}</div> : null}
                  <div className="lab-links">
                    {github ? (
                      <a className="lab-link github" href={github} target="_blank" rel="noreferrer">
                        GitHub →
                      </a>
                    ) : null}
                    {demo ? (
                      <a className="lab-link demo" href={demo} target="_blank" rel="noreferrer">
                        Demo
                      </a>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

