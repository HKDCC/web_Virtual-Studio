"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAudioPlayer, PlayMode } from "./AudioPlayerContext";

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

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
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

  const currentSeekTime = isSeeking ? seekValue : currentTime;
  const displayProgress = duration > 0 ? (currentSeekTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true);
    setSeekValue(parseFloat(e.target.value));
  };

  const handleSeekCommit = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement;
    const time = parseFloat(target.value);
    seek(time);
    setIsSeeking(false);
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

  return (
    <div
      ref={containerRef}
      className={`tl-bgm-container ${isExpanded ? "is-expanded" : ""} ${
        isPlaying ? "is-playing" : ""
      }`}
      aria-label="背景音乐播放器"
    >
      {/* ═══════════ 展开态：毛玻璃卡片面板 ═══════════ */}
      {isExpanded && (
        <div className="tl-bgm-panel reveal-in" role="dialog" aria-label="音乐播放详情与歌单">
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

          {/* 进度条与时间 */}
          <div className="tl-bgm-progress-section">
            <div className="tl-bgm-slider-wrap">
              <div
                className="tl-bgm-slider-bar"
                style={{ width: `${Math.min(100, Math.max(0, displayProgress))}%` }}
              />
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentSeekTime}
                onChange={handleSeekChange}
                onMouseUp={handleSeekCommit}
                onTouchEnd={handleSeekCommit}
                className="tl-bgm-progress-input"
                aria-label="播放进度调节"
              />
            </div>
            <div className="tl-bgm-time-row">
              <span className="tl-bgm-time">{formatTime(currentSeekTime)}</span>
              <span className="tl-bgm-time">{formatTime(duration)}</span>
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

      {/* ═══════════ 收起态：右下角常驻胶囊挂件 ═══════════ */}
      <div
        className={`tl-bgm-dock-pill ${!hasPlayedOnce && !isPlaying ? "tl-bgm-breathe" : ""}`}
        onClick={toggleExpanded}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label="音乐播放器控制胶囊"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleExpanded();
          }
        }}
      >
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

        {/* 曲目简要文本 */}
        <div className="tl-bgm-dock-text">
          <span className="tl-bgm-dock-title">{currentTrack.title}</span>
          <span className="tl-bgm-dock-artist">BGM · tl; // lab</span>
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
      </div>
    </div>
  );
}
