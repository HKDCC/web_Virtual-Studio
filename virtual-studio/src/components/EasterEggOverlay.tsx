"use client";

export function EasterEggOverlay(props: { open: boolean; onClose: () => void }) {
  if (!props.open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={props.onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(24,24,24,0.95)",
        }}
      />
      <div
        style={{
          position: "relative",
          textAlign: "center",
          background: "transparent",
          padding: 20,
        }}
      >
        <span style={{ fontSize: 80, display: "block", marginBottom: 16 }}>( ˶ˆ꒳ˆ˵ )</span>
        <p style={{ fontFamily: "var(--serif)", fontSize: 22, color: "#f5f5f7", marginBottom: 8 }}>发现了隐藏的彩蛋</p>
        <p style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#c4a882", marginBottom: 24 }}>
          {"// 单推爱莉希雅 × 宵宫 × 流萤"}
        </p>
        <button
          type="button"
          onClick={props.onClose}
          style={{
            padding: "8px 24px",
            border: "1px solid var(--accent)",
            borderRadius: 8,
            background: "transparent",
            color: "var(--accent)",
            fontFamily: "var(--mono)",
            fontSize: 12,
            cursor: "pointer",
            transition: "var(--transition)",
          }}
        >
          继续探索 →
        </button>
      </div>
    </div>
  );
}