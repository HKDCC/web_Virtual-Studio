"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { Track, BGM_PLAYLIST } from "@/data/bgm";

export type PlayMode = "list-loop" | "single-loop" | "shuffle";

interface AudioPlayerContextType {
  playlist: Track[];
  currentIndex: number;
  currentTrack: Track;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;
  isExpanded: boolean;
  hasPlayedOnce: boolean;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  selectTrack: (index: number) => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  cyclePlayMode: () => void;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

const STORAGE_KEYS = {
  VOLUME: "tl-bgm-volume",
  MUTED: "tl-bgm-muted",
  PLAY_MODE: "tl-bgm-mode",
  LAST_INDEX: "tl-bgm-last-idx",
};

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [playlist] = useState<Track[]>(BGM_PLAYLIST);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(BGM_PLAYLIST[0].duration);
  const [volume, setVolumeState] = useState<number>(0.6);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playMode, setPlayMode] = useState<PlayMode>("list-loop");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextPreloadAudioRef = useRef<HTMLAudioElement | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTrack = playlist[currentIndex] || playlist[0];

  // Smart preload for next track in background
  const preloadNext = useCallback((nextIndex: number) => {
    if (typeof window === "undefined") return;
    const nextSong = playlist[nextIndex];
    if (!nextSong) return;

    if (!nextPreloadAudioRef.current) {
      nextPreloadAudioRef.current = new Audio();
      nextPreloadAudioRef.current.preload = "auto";
    }
    if (nextPreloadAudioRef.current.src !== window.location.origin + nextSong.src) {
      nextPreloadAudioRef.current.src = nextSong.src;
    }
  }, [playlist]);

  // Initialize main audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    try {
      const savedVol = localStorage.getItem(STORAGE_KEYS.VOLUME);
      if (savedVol !== null) {
        const v = parseFloat(savedVol);
        if (!isNaN(v) && v >= 0 && v <= 1) {
          setVolumeState(v);
          audio.volume = v;
        }
      } else {
        audio.volume = 0.6;
      }

      const savedMuted = localStorage.getItem(STORAGE_KEYS.MUTED);
      if (savedMuted !== null) {
        const m = savedMuted === "true";
        setIsMuted(m);
        audio.muted = m;
      }

      const savedMode = localStorage.getItem(STORAGE_KEYS.PLAY_MODE) as PlayMode;
      if (savedMode && ["list-loop", "single-loop", "shuffle"].includes(savedMode)) {
        setPlayMode(savedMode);
      }

      const savedIndex = localStorage.getItem(STORAGE_KEYS.LAST_INDEX);
      let initialIdx = 0;
      if (savedIndex !== null) {
        const idx = parseInt(savedIndex, 10);
        if (!isNaN(idx) && idx >= 0 && idx < BGM_PLAYLIST.length) {
          initialIdx = idx;
        }
      }
      setCurrentIndex(initialIdx);
      audio.src = BGM_PLAYLIST[initialIdx].src;
      setDuration(BGM_PLAYLIST[initialIdx].duration);

      // Preload next track quietly
      const nextIdx = (initialIdx + 1) % BGM_PLAYLIST.length;
      preloadNext(nextIdx);
    } catch {
      audio.src = BGM_PLAYLIST[0].src;
      setDuration(BGM_PLAYLIST[0].duration);
    }

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(Math.round(audio.duration));
      }
    };

    const onDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(Math.round(audio.duration));
      }
    };

    // Debounced loading spinner (only show if buffering takes > 350ms)
    const onWaiting = () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = setTimeout(() => {
        setIsLoading(true);
      }, 350);
    };

    const onPlaying = () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      setIsLoading(false);
      setIsPlaying(true);
    };

    const onPause = () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      setIsLoading(false);
      setIsPlaying(false);
    };

    const onCanPlay = () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      setIsLoading(false);
    };

    const onError = () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";

      if (nextPreloadAudioRef.current) {
        nextPreloadAudioRef.current.src = "";
      }
    };
  }, [preloadNext]);

  // Instant play
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!audio.src || !audio.src.includes(currentTrack.src)) {
        audio.src = currentTrack.src;
      }

      audio.volume = isMuted ? 0 : volume;
      audio.muted = isMuted;

      // Optimistic UI state
      setIsPlaying(true);
      setHasPlayedOnce(true);

      await audio.play();

      // Preload next track
      const nextIdx = (currentIndex + 1) % playlist.length;
      preloadNext(nextIdx);
    } catch (err) {
      console.warn("BGM play prevented:", err);
      setIsPlaying(false);
    }
  }, [currentTrack.src, isMuted, volume, currentIndex, playlist.length, preloadNext]);

  // Instant pause
  const pause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Instant track selection (0ms latency)
  const selectTrack = useCallback(
    (index: number) => {
      if (index < 0 || index >= playlist.length) return;
      setCurrentIndex(index);
      const nextSong = playlist[index];
      setDuration(nextSong.duration);

      try {
        localStorage.setItem(STORAGE_KEYS.LAST_INDEX, String(index));
      } catch {}

      const audio = audioRef.current;
      if (!audio) return;

      audio.src = nextSong.src;
      audio.currentTime = 0;
      setCurrentTime(0);

      // Preload the one after next
      const afterNextIdx = (index + 1) % playlist.length;
      preloadNext(afterNextIdx);

      if (isPlaying || hasPlayedOnce) {
        audio.volume = isMuted ? 0 : volume;
        audio.muted = isMuted;
        setIsPlaying(true);
        setHasPlayedOnce(true);
        audio.play().catch((err) => {
          console.warn("Audio play catch:", err);
        });
      }
    },
    [playlist, isPlaying, hasPlayedOnce, isMuted, volume, preloadNext]
  );

  const nextTrack = useCallback(() => {
    if (playMode === "shuffle") {
      if (playlist.length <= 1) return;
      let randIdx = Math.floor(Math.random() * playlist.length);
      while (randIdx === currentIndex && playlist.length > 1) {
        randIdx = Math.floor(Math.random() * playlist.length);
      }
      selectTrack(randIdx);
    } else {
      const nextIdx = (currentIndex + 1) % playlist.length;
      selectTrack(nextIdx);
    }
  }, [playMode, playlist.length, currentIndex, selectTrack]);

  const prevTrack = useCallback(() => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (playMode === "shuffle") {
      let randIdx = Math.floor(Math.random() * playlist.length);
      while (randIdx === currentIndex && playlist.length > 1) {
        randIdx = Math.floor(Math.random() * playlist.length);
      }
      selectTrack(randIdx);
    } else {
      const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
      selectTrack(prevIdx);
    }
  }, [currentTime, playMode, playlist.length, currentIndex, selectTrack]);

  // Handle Track Ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (playMode === "single-loop") {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("ended", onEnded);
    };
  }, [playMode, nextTrack]);

  // Robust seek without zero-clamping
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const targetDuration = (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0)
      ? audio.duration
      : currentTrack.duration;

    const clamped = Math.max(0, Math.min(time, targetDuration));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, [currentTrack.duration]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (isMuted && clamped > 0) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      audioRef.current.muted = false;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, String(clamped));
      localStorage.setItem(STORAGE_KEYS.MUTED, "false");
    } catch {}
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      try {
        localStorage.setItem(STORAGE_KEYS.MUTED, String(next));
      } catch {}
      return next;
    });
  }, []);

  const cyclePlayMode = useCallback(() => {
    setPlayMode((prev) => {
      let next: PlayMode = "list-loop";
      if (prev === "list-loop") next = "single-loop";
      else if (prev === "single-loop") next = "shuffle";
      else if (prev === "shuffle") next = "list-loop";

      try {
        localStorage.setItem(STORAGE_KEYS.PLAY_MODE, next);
      } catch {}
      return next;
    });
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const setExpanded = useCallback((expanded: boolean) => {
    setIsExpanded(expanded);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
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
        play,
        pause,
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
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
