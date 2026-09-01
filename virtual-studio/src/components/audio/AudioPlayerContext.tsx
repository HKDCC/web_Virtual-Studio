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
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.6);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playMode, setPlayMode] = useState<PlayMode>("list-loop");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTrack = playlist[currentIndex] || playlist[0];

  // Initialize audio element and saved preferences once on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    // Load saved settings
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
        } else {
          audio.src = BGM_PLAYLIST[0].src;
        }
      } else {
        audio.src = BGM_PLAYLIST[0].src;
      }
    } catch {
      audio.src = BGM_PLAYLIST[0].src;
    }

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
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

    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
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

  // Fade In Play
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();
    const targetVol = isMuted ? 0 : volume;

    try {
      if (!audio.src || !audio.src.includes(currentTrack.src)) {
        audio.src = currentTrack.src;
        audio.load();
      }
      audio.volume = 0;
      await audio.play();
      setHasPlayedOnce(true);
      setIsPlaying(true);

      // Smooth fade in over 300ms
      const steps = 15;
      const stepTime = 20;
      const volStep = targetVol / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        if (!audioRef.current) {
          clearFade();
          return;
        }
        const nextVol = Math.min(targetVol, volStep * currentStep);
        audioRef.current.volume = nextVol;
        if (currentStep >= steps) {
          audioRef.current.volume = targetVol;
          clearFade();
        }
      }, stepTime);
    } catch (err) {
      console.warn("BGM autoplay/play prevented:", err);
      setIsPlaying(false);
    }
  }, [currentTrack.src, isMuted, volume]);

  // Fade Out Pause
  const pause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    clearFade();
    const startVol = audio.volume;
    const steps = 12;
    const stepTime = 20;
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

  // Select track by index
  const selectTrack = useCallback(
    (index: number) => {
      if (index < 0 || index >= playlist.length) return;
      setCurrentIndex(index);
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_INDEX, String(index));
      } catch {}

      const nextSong = playlist[index];
      const audio = audioRef.current;
      if (!audio) return;

      audio.src = nextSong.src;
      audio.currentTime = 0;
      setCurrentTime(0);

      if (isPlaying || hasPlayedOnce) {
        audio.play().then(() => {
          setIsPlaying(true);
          setHasPlayedOnce(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    },
    [playlist, isPlaying, hasPlayedOnce]
  );

  // Next Track based on playMode
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

  // Prev Track
  const prevTrack = useCallback(() => {
    // If played more than 3 seconds, restart current track
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

  // Seek time
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(time, audio.duration || duration));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  // Set Volume
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

  // Toggle Mute
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

  // Cycle Play Mode
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
