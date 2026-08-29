"use client";

import { useState } from "react";

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="notion-code-block">
      <div className="notion-code-header">
        <span className="notion-code-lang">{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="notion-code-copy-btn"
          aria-label="复制代码"
        >
          {copied ? "✓ 已复制" : "复制"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
