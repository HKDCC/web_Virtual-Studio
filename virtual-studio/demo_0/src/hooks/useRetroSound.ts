"use client";

import { useCallback, useRef } from 'react';

export function useRetroSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playHover = useCallback(() => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "square";
    // 瞬间的高频到低频衰减，模拟微小继电器的咔哒声
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.02);
    
    // 极小的音量
    gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  }, []);

  const playClick = useCallback(() => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "square";
    // Sharp electronic snap for cassette futurism
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);
    
    // Snappy envelope
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, []);

  return { playHover, playClick };
}
