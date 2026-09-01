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
  const [duration, setDuration] = useState<number>(BGM_PLAYLIST[0].duration || 0);
  const [volume, setVolumeState] = useState<number>(0.6);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playMode, setPlayMode] = useState<PlayMode>("list-loop");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTrack = playlist[currentIndex] || playlist[0];

  // Preload audio files in background to eliminate initial delay
  useEffect(() => {
    if (typeof window === "undefined") return;
    const preloadAudios: HTMLAudioElement[] = [];
    playlist.forEach((track) => {
      const a = new Audio();
      a.preload = "auto";
      a.src = track.src;
      preloadAudios.push(a);
    });

    return () => {
      preloadAudios.forEach((a) => {
        a.src = "";
      });
    };
  }, [playlist]);

  // Initialize main audio element and restore preferences
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
      if (savedIndex !== null) {
        const idx = parseInt(savedIndex, 10);
        if (!isNaN(idx) && idx >= 0 && idx < BGM_PLAYLIST.length) {
          setCurrentIndex(idx);
          audio.src = BGM_PLAYLIST[idx].src;
          setDuration(BGM_PLAYLIST[idx].duration || 0);
        } else {
          audio.src = BGM_PLAYLIST[0].src;
          setDuration(BGM_PLAYLIST[0].duration || 0);
        }
      } else {
        audio.src = BGM_PLAYLIST[0].src;
        setDuration(BGM_PLAYLIST[0].duration || 0);
      }
    } catch {
      audio.src = BGM_PLAYLIST[0].src;
      setDuration(BGM_PLAYLIST[0].duration || 0);
    }

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };

    const onDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onCanPlay = () => {
      setIsLoading(false);
    };

    const onError = () => {
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
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
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
    };
  }, []);

  const clearFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  // Instant play with quick 80ms volume ramp
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();
    const targetVol = isMuted ? 0 : volume;

    try {
      if (!audio.src || !audio.src.includes(currentTrack.src)) {
        audio.src = currentTrack.src;
      }

      audio.volume = targetVol * 0.4;
      const playPromise = audio.play();
      setHasPlayedOnce(true);
      setIsPlaying(true);

      if (playPromise !== undefined) {
        await playPromise;
      }

      // Fast volume ramp (80ms total) for smooth instant start
      const steps = 4;
      const stepTime = 20;
      const volStep = (targetVol - audio.volume) / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        if (!audioRef.current) {
          clearFade();
          return;
        }
        const nextVol = Math.min(targetVol, audioRef.current.volume + volStep);
        audioRef.current.volume = nextVol;
        if (currentStep >= steps) {
          audioRef.current.volume = targetVol;
          clearFade();
        }
      }, stepTime);
    } catch (err) {
      console.warn("BGM play prevented/cancelled:", err);
      setIsPlaying(false);
    }
  }, [currentTrack.src, isMuted, volume]);

  // Smooth fast pause
  const pause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    clearFade();
    const startVol = audio.volume;
    const steps = 5;
    const stepTime = 16;
    const volStep = startVol / steps;
    let currentStep = 0;

    return new Promise<void>((resolve) => {
      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        if (!audioRef.current) {
          clearFade();
          resolve();
          return;
        }
        const nextVol = Math.max(0, startVol - volStep * currentStep);
        audioRef.current.volume = nextVol;
        if (currentStep >= steps || nextVol <= 0) {
          clearFade();
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = isMuted ? 0 : volume;
          }
          setIsPlaying(false);
          resolve();
        }
      }, stepTime);
    });
  }, [isMuted, volume]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Select track by index - instantaneous switch
  const selectTrack = useCallback(
    (index: number) => {
      if (index < 0 || index >= playlist.length) return;
      setCurrentIndex(index);
      const nextSong = playlist[index];
      setDuration(nextSong.duration || 0);

      try {
        localStorage.setItem(STORAGE_KEYS.LAST_INDEX, String(index));
      } catch {}

      const audio = audioRef.current;
      if (!audio) return;

      audio.src = nextSong.src;
      audio.currentTime = 0;
      setCurrentTime(0);

      if (isPlaying || hasPlayedOnce) {
        audio.volume = isMuted ? 0 : volume;
        audio.play().then(() => {
          setIsPlaying(true);
          setHasPlayedOnce(true);
        }).catch((err) => {
          console.warn("Auto switch play caught:", err);
        });
      }
    },
    [playlist, isPlaying, hasPlayedOnce, isMuted, volume]
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
      : (currentTrack.duration || duration || 100);

    const clamped = Math.max(0, Math.min(time, targetDuration));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, [currentTrack.duration, duration]);

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
