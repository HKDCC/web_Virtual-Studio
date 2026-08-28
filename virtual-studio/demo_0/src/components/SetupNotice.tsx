export function SetupNotice(props: { title?: string }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 48px" }}>
      <div
        style={{
          border: "1px solid var(--bg-3)",
          borderRadius: "var(--r)",
          background: "var(--bg-2)",
          padding: 20,
        }}
      >
        <div style={{ fontFamily: "var(--serif)", fontSize: 20, marginBottom: 8 }}>{props.title ?? "需要配置 Notion 环境变量"}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-2)", lineHeight: 1.9 }}>
          请在 <code>virtual-studio/.env.local</code> 中填写：
          <br />
          <code>NOTION_TOKEN</code> 和对应的 <code>NOTION_*_DB_ID</code>。
          <br />
          你可以参考 <code>virtual-studio/.env.example</code>。
        </div>
      </div>
    </div>
  );
}

