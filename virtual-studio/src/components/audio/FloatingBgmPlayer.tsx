"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useAudioPlayer, PlayMode } from "./AudioPlayerContext";

type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

const CORNER_KEY = "tl-bgm-corner";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function FloatingBgmPlayer() {
  const {
    playlist,
    currentIndex,
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    playMode,
    isExpanded,
    hasPlayedOnce,
    togglePlay,
    nextTrack,
    prevTrack,
    selectTrack,
    seek,
    setVolume,
    toggleMute,
    cyclePlayMode,
    toggleExpanded,
    setExpanded,
  } = useAudioPlayer();

  const [corner, setCorner] = useState<Corner>("bottom-right");
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tilt, setTilt] = useState<number>(0);

  // Scrubber state
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);
  const scrubberTrackRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  // Drag physics tracking refs
  const dragStartRef = useRef<{ startX: number; startY: number; pillLeft: number; pillTop: number; time: number }>({
    startX: 0,
    startY: 0,
    pillLeft: 0,
    pillTop: 0,
    time: 0,
  });
  const samplesRef = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const hasMovedRef = useRef(false);

  // Restore saved corner
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CORNER_KEY) as Corner;
      if (saved && ["bottom-right", "bottom-left", "top-right", "top-left"].includes(saved)) {
        setCorner(saved);
      }
    } catch {}
  }, []);

  // Close panel on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isExpanded &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded, setExpanded]);

  // Compute corner target positions
  const getCornerCoords = useCallback((c: Corner, pillW = 200, pillH = 42) => {
    const margin = 24;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;

    switch (c) {
      case "top-left":
        return { x: margin, y: margin };
      case "top-right":
        return { x: vw - pillW - margin, y: margin };
      case "bottom-left":
        return { x: margin, y: vh - pillH - margin };
      case "bottom-right":
      default:
        return { x: vw - pillW - margin, y: vh - pillH - margin };
    }
  }, []);

  // Drag Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If clicking on the action button inside pill, let it handle directly
    if ((e.target as HTMLElement).closest(".tl-bgm-dock-action-btn")) {
      return;
    }

    if (!pillRef.current) return;
    const rect = pillRef.current.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      pillLeft: rect.left,
      pillTop: rect.top,
      time: performance.now(),
    };
    samplesRef.current = [{ x: e.clientX, y: e.clientY, time: performance.now() }];
    hasMovedRef.current = false;

    // Set active pointer capture
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current.time === 0) return;

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    const dist = Math.hypot(dx, dy);

    if (!hasMovedRef.current && dist > 5) {
      hasMovedRef.current = true;
      setIsDragging(true);
      if (isExpanded) setExpanded(false);
    }

    if (hasMovedRef.current) {
      const now = performance.now();
      const samples = samplesRef.current;
      samples.push({ x: e.clientX, y: e.clientY, time: now });
      if (samples.length > 8) samples.shift();

      // Calculate instantaneous tilt from recent horizontal speed
      const oldest = samples[0];
      const dt = now - oldest.time;
      const vx = dt > 0 ? (e.clientX - oldest.x) / dt : 0;
      const targetTilt = Math.max(-25, Math.min(25, vx * 16));
      setTilt(targetTilt);

      setDragPos({
        x: dragStartRef.current.pillLeft + dx,
        y: dragStartRef.current.pillTop + dy,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current.time === 0) return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (!hasMovedRef.current) {
      // Just a click, toggle expand
      dragStartRef.current.time = 0;
      toggleExpanded();
      return;
    }

    // Process drag release / fling physics
    const now = performance.now();
    const samples = samplesRef.current;
    let vx = 0;
    let vy = 0;

    if (samples.length >= 2) {
      const oldest = samples[0];
      const dt = now - oldest.time;
      if (dt > 10) {
        vx = (e.clientX - oldest.x) / dt; // px/ms
        vy = (e.clientY - oldest.y) / dt;
      }
    }

    const speed = Math.hypot(vx, vy);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let targetCorner: Corner = corner;

    if (speed > 0.35) {
      // Fling / Throw gesture detected!
      if (vx < 0 && vy < 0) targetCorner = "top-left";
      else if (vx >= 0 && vy < 0) targetCorner = "top-right";
      else if (vx < 0 && vy >= 0) targetCorner = "bottom-left";
      else targetCorner = "bottom-right";
    } else {
      // Snapping based on closest corner
      const currentX = dragPos.x + 36; // capsule center approx
      const currentY = dragPos.y + 16;

      const distTL = Math.hypot(currentX, currentY);
      const distTR = Math.hypot(vw - currentX, currentY);
      const distBL = Math.hypot(currentX, vh - currentY);
      const distBR = Math.hypot(vw - currentX, vh - currentY);

      const minDist = Math.min(distTL, distTR, distBL, distBR);
      if (minDist === distTL) targetCorner = "top-left";
      else if (minDist === distTR) targetCorner = "top-right";
      else if (minDist === distBL) targetCorner = "bottom-left";
      else targetCorner = "bottom-right";
    }

    // Trigger smooth flying spring animation to target corner
    const targetCoords = getCornerCoords(targetCorner, 80, 36);
    setDragPos(targetCoords);
    setTilt(0);
    setIsFlying(true);

    setTimeout(() => {
      setCorner(targetCorner);
      setIsDragging(false);
      setIsFlying(false);
      try {
        localStorage.setItem(CORNER_KEY, targetCorner);
      } catch {}
    }, 320);

    dragStartRef.current.time = 0;
    samplesRef.current = [];
  };

  // Custom Precision Scrubber Interaction
  const effectiveDuration = duration > 0 ? duration : (currentTrack.duration || 120);
  const activeTime = isScrubbing ? scrubTime : currentTime;
  const progressRatio = Math.max(0, Math.min(1, effectiveDuration > 0 ? activeTime / effectiveDuration : 0));

  const handleScrubberPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!scrubberTrackRef.current) return;
    const rect = scrubberTrackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = ratio * effectiveDuration;

    setIsScrubbing(true);
    setScrubTime(targetTime);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!scrubberTrackRef.current) return;
      const r = scrubberTrackRef.current.getBoundingClientRect();
      const newRatio = Math.max(0, Math.min(1, (moveEvent.clientX - r.left) / r.width));
      setScrubTime(newRatio * effectiveDuration);
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      if (scrubberTrackRef.current) {
        const r = scrubberTrackRef.current.getBoundingClientRect();
        const finalRatio = Math.max(0, Math.min(1, (upEvent.clientX - r.left) / r.width));
        const finalTime = finalRatio * effectiveDuration;
        seek(finalTime);
      }
      setIsScrubbing(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const getModeTitle = (mode: PlayMode) => {
    switch (mode) {
      case "list-loop":
        return "列表循环";
      case "single-loop":
        return "单曲循环";
      case "shuffle":
        return "随机播放";
    }
  };

  const isTop = corner.startsWith("top");
  const isLeft = corner.endsWith("left");

  // Dynamic floating coordinates during drag/fling
  const floatingStyle: React.CSSProperties = (isDragging || isFlying)
    ? {
        position: "fixed",
        left: `${dragPos.x}px`,
        top: `${dragPos.y}px`,
        right: "auto",
        bottom: "auto",
        transform: `rotate(${tilt}deg) scale(${isDragging ? 1.08 : 1})`,
        transition: isFlying ? "all 0.32s cubic-bezier(0.18, 0.9, 0.28, 1.15)" : "none",
        zIndex: 9999,
        cursor: "grabbing",
      }
    : {};

  return (
    <div
      ref={containerRef}
      className={`tl-bgm-container tl-corner-${corner} ${isExpanded ? "is-expanded" : ""} ${
        isPlaying ? "is-playing" : ""
      } ${isDragging ? "is-dragging" : ""} ${isFlying ? "is-flying" : ""}`}
      style={floatingStyle}
      aria-label="背景音乐播放器"
    >
      {/* ═══════════ 展开态：毛玻璃卡片面板 ═══════════ */}
      {isExpanded && !isDragging && (
        <div
          className={`tl-bgm-panel reveal-in ${isTop ? "open-down" : "open-up"} ${
            isLeft ? "align-left" : "align-right"
          }`}
          role="dialog"
          aria-label="音乐播放详情与歌单"
        >
          {/* 面板头部 */}
          <div className="tl-bgm-panel-header">
            <div className="tl-bgm-header-left">
              <span className="tl-bgm-badge-eyebrow">ORIGINAL SOUNDTRACK</span>
              <span className="tl-bgm-badge-tag">{currentTrack.tag}</span>
            </div>
            <button
              type="button"
              className="tl-bgm-close-btn"
              onClick={() => setExpanded(false)}
              aria-label="收起面板"
              title="收起 (Esc)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* 当前曲目核心展示 */}
          <div className="tl-bgm-current-hero">
            <div className={`tl-bgm-vinyl-disc ${isPlaying ? "spinning" : ""}`}>
              <div className="tl-bgm-vinyl-grooves"></div>
              <div className="tl-bgm-vinyl-center">
                <span className="tl-bgm-vinyl-label">tl;</span>
              </div>
            </div>
            <div className="tl-bgm-track-info">
              <div className="tl-bgm-track-title-row">
                <h4 className="tl-bgm-track-title">{currentTrack.title}</h4>
              </div>
              <p className="tl-bgm-track-desc">{currentTrack.description || currentTrack.artist}</p>
              <div className="tl-bgm-track-meta">
                <span className="tl-bgm-meta-artist">By {currentTrack.artist}</span>
                {currentTrack.year && <span className="tl-bgm-meta-year">· {currentTrack.year}</span>}
              </div>
            </div>
          </div>

          {/* 进度条与时间 (高精度无缝 Scrub 体验) */}
          <div className="tl-bgm-progress-section">
            <div
              ref={scrubberTrackRef}
              className="tl-bgm-slider-wrap"
              onPointerDown={handleScrubberPointerDown}
              role="slider"
              aria-label="播放进度调节"
              aria-valuemin={0}
              aria-valuemax={effectiveDuration}
              aria-valuenow={activeTime}
            >
              <div
                className="tl-bgm-slider-bar"
                style={{ width: `${(progressRatio * 100).toFixed(2)}%` }}
              />
              <div
                className="tl-bgm-slider-thumb"
                style={{ left: `${(progressRatio * 100).toFixed(2)}%` }}
              />
            </div>
            <div className="tl-bgm-time-row">
              <span className="tl-bgm-time">{formatTime(activeTime)}</span>
              <span className="tl-bgm-time">{formatTime(effectiveDuration)}</span>
            </div>
          </div>

          {/* 主控制按键区 */}
          <div className="tl-bgm-controls">
            {/* 播放模式 */}
            <button
              type="button"
              className={`tl-bgm-icon-btn ${playMode !== "list-loop" ? "active" : ""}`}
              onClick={cyclePlayMode}
              title={`当前模式：${getModeTitle(playMode)}（点击切换）`}
              aria-label={`切换播放模式，当前为${getModeTitle(playMode)}`}
            >
              {playMode === "list-loop" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9"></polyline>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                  <polyline points="7 23 3 19 7 15"></polyline>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                </svg>
              )}
              {playMode === "single-loop" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9"></polyline>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                  <polyline points="7 23 3 19 7 15"></polyline>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                  <text x="10.5" y="15" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">1</text>
                </svg>
              )}
              {playMode === "shuffle" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8"></polyline>
                  <line x1="4" y1="20" x2="21" y2="3"></line>
                  <polyline points="21 16 21 21 16 21"></polyline>
                  <line x1="15" y1="15" x2="21" y2="21"></line>
                  <line x1="4" y1="4" x2="9" y2="9"></line>
                </svg>
              )}
            </button>

            {/* 上一首 */}
            <button
              type="button"
              className="tl-bgm-icon-btn"
              onClick={prevTrack}
              title="上一首"
              aria-label="上一首"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>

            {/* 播放 / 暂停 主按键 */}
            <button
              type="button"
              className="tl-bgm-play-main-btn"
              onClick={togglePlay}
              title={isPlaying ? "暂停" : "播放"}
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isLoading ? (
                <div className="tl-bgm-spinner" />
              ) : isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                  <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
              )}
            </button>

            {/* 下一首 */}
            <button
              type="button"
              className="tl-bgm-icon-btn"
              onClick={nextTrack}
              title="下一首"
              aria-label="下一首"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>

            {/* 静音 / 音量控制 */}
            <div className="tl-bgm-volume-group">
              <button
                type="button"
                className="tl-bgm-icon-btn"
                onClick={toggleMute}
                title={isMuted ? "取消静音" : "静音"}
                aria-label={isMuted ? "取消静音" : "静音"}
              >
                {isMuted || volume === 0 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : volume < 0.5 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                )}
              </button>
              <div className="tl-bgm-vol-slider-wrap">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="tl-bgm-vol-input"
                  aria-label="音量调节"
                />
              </div>
            </div>
          </div>

          {/* 歌单列表 */}
          <div className="tl-bgm-playlist-wrap">
            <div className="tl-bgm-playlist-header">
              <span className="tl-bgm-playlist-title">原创曲目集 · PLAYLIST ({playlist.length})</span>
            </div>
            <ul className="tl-bgm-playlist-list" role="list">
              {playlist.map((track, idx) => {
                const isCurrent = idx === currentIndex;
                return (
                  <li key={track.id}>
                    <button
                      type="button"
                      className={`tl-bgm-playlist-item ${isCurrent ? "is-active" : ""}`}
                      onClick={() => selectTrack(idx)}
                    >
                      <div className="tl-bgm-item-index">
                        {isCurrent && isPlaying ? (
                          <span className="tl-bgm-mini-equalizer">
                            <span className="bar b1"></span>
                            <span className="bar b2"></span>
                            <span className="bar b3"></span>
                          </span>
                        ) : (
                          <span className="tl-bgm-num">{(idx + 1).toString().padStart(2, "0")}</span>
                        )}
                      </div>
                      <div className="tl-bgm-item-info">
                        <span className="tl-bgm-item-title">{track.title}</span>
                        <span className="tl-bgm-item-tag">{track.tag}</span>
                      </div>
                      <div className="tl-bgm-item-play-icon">
                        {isCurrent && isPlaying ? "⏸" : "▶"}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* ═══════════ 悬浮挂件 / 拖拽仿真胶囊 ═══════════ */}
      <div
        ref={pillRef}
        className={`tl-bgm-dock-pill ${!hasPlayedOnce && !isPlaying ? "tl-bgm-breathe" : ""} ${
          isDragging || isFlying ? "is-morphed" : ""
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label="音乐播放器控制胶囊，可按住拖拽至四个角落"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleExpanded();
          }
        }}
      >
        {isDragging || isFlying ? (
          /* ═══════════ 拖拽时：左黑右红 3D 仿真药丸胶囊 ═══════════ */
          <div className="tl-bgm-real-capsule">
            <div className="tl-capsule-half tl-capsule-black">
              <div className="tl-capsule-gloss"></div>
            </div>
            <div className="tl-capsule-seam"></div>
            <div className="tl-capsule-half tl-capsule-red">
              <div className="tl-capsule-gloss"></div>
            </div>
          </div>
        ) : (
          /* ═══════════ 常规态：精致播放器挂件（直接单行显示歌名） ═══════════ */
          <>
            {/* 迷你黑胶唱片 */}
            <div className={`tl-bgm-mini-vinyl ${isPlaying ? "spinning" : ""}`}>
              <div className="tl-bgm-mini-vinyl-center"></div>
            </div>

            {/* 4柱动态声波动画 */}
            <div className={`tl-bgm-bars ${isPlaying ? "is-animating" : ""}`} aria-hidden="true">
              <span className="tl-bar bar-1"></span>
              <span className="tl-bar bar-2"></span>
              <span className="tl-bar bar-3"></span>
              <span className="tl-bar bar-4"></span>
            </div>

            {/* 单行居中直显歌名 */}
            <div className="tl-bgm-dock-text">
              <span className="tl-bgm-dock-title" title={currentTrack.title}>
                {currentTrack.title}
              </span>
            </div>

            {/* 快捷 Play/Pause 按钮 */}
            <button
              type="button"
              className="tl-bgm-dock-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              title={isPlaying ? "暂停" : "播放"}
              aria-label={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                  <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
