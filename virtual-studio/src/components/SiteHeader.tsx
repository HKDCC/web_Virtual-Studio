"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EasterEggOverlay } from "@/components/EasterEggOverlay";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const pathname = usePathname();
  const [awakened, setAwakened] = useState(false);
  const [open, setOpen] = useState(false);
  const hoverTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <Link
          className="logo"
          href="/"
          onMouseEnter={() => {
            hoverTimer.current = window.setTimeout(() => {
              setAwakened(true);
              window.setTimeout(() => setOpen(true), 400);
            }, 2000);
          }}
          onMouseLeave={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
            if (!open) setAwakened(false);
          }}
        >
          <span style={{ opacity: awakened ? 0 : 1, transition: "var(--transition)" }}>tl; // lab</span>
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: awakened ? 1 : 0,
              transition: "var(--transition)",
              fontSize: 18,
              letterSpacing: 0,
            }}
          >
            ( ˶ˆ꒳ˆ˵ )
          </span>
        </Link>

        <nav className="primary-nav">
          <Link href="/archive" data-active={isActive(pathname, "/archive")}>
            库 Archive
          </Link>
          <Link href="/lab" data-active={isActive(pathname, "/lab")}>
            实验室 Lab
          </Link>
          <Link href="/workflow" data-active={isActive(pathname, "/workflow")}>
            工作流 Workflow
          </Link>
          <Link href="/pause" data-active={isActive(pathname, "/pause")}>
            隙 Pause
          </Link>
          <Link href="/changelog" data-active={isActive(pathname, "/changelog")}>
            足迹
          </Link>
        </nav>
      </header>

      <EasterEggOverlay
        open={open}
        onClose={() => {
          setOpen(false);
          setAwakened(false);
        }}
      />
    </>
  );
}

