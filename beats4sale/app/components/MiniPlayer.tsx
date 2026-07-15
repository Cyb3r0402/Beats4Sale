'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Beat } from '../lib/beats';

interface MiniPlayerProps {
  beat: Beat | null;
  onClose: () => void;
}

export default function MiniPlayer({ beat, onClose }: MiniPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [usingRealAudio, setUsingRealAudio] = useState(false);

  // Real audio element (for Vercel Blob URLs)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animRef = useRef<number>(0);

  // Synthetic audio (Web Audio API fallback)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(20000);
  const pausedAtRef = useRef<number>(0);

  const stopAll = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  }, []);

  // Track progress of real <audio> element
  const trackRealProgress = useCallback((audio: HTMLAudioElement) => {
    cancelAnimationFrame(animRef.current);
    const step = () => {
      if (!audio || audio.paused) return;
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      const secs = Math.floor(audio.currentTime);
      setProgress(pct);
      setCurrentTime(`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`);
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, []);

  // Simulate progress for synthetic drums
  const simulateProgress = useCallback((fromMs: number, totalMs: number) => {
    startTimeRef.current = Date.now() - fromMs;
    durationRef.current = totalMs;
    cancelAnimationFrame(animRef.current);
    const step = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / totalMs) * 100, 100);
      const secs = Math.floor(elapsed / 1000);
      setProgress(pct);
      setCurrentTime(`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`);
      if (pct < 100) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, []);

  // Synthesize kick + hihat pattern as demo
  const playDemo = useCallback((bpm: number) => {
    if (audioCtxRef.current) audioCtxRef.current.close();
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;
    const interval = 60 / bpm;
    const start = ctx.currentTime + 0.05;

    const kick = (t: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(0.001, t + 0.5);
      g.gain.setValueAtTime(0.7, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t); osc.stop(t + 0.5);
    };

    const hihat = (t: number) => {
      const size = ctx.sampleRate * 0.05;
      const buf = ctx.createBuffer(1, size, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < size; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = 8000;
      const g = ctx.createGain();
      src.connect(filter); filter.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      src.start(t);
    };

    for (let bar = 0; bar < 8; bar++) {
      for (let b = 0; b < 4; b++) {
        const t = start + (bar * 4 + b) * interval;
        if (b % 2 === 0) kick(t);
        hihat(t);
        if (b % 2 === 1) hihat(t + interval * 0.5);
      }
    }

    const totalMs = 8 * 4 * interval * 1000;
    simulateProgress(0, totalMs);
  }, [simulateProgress]);

  // Start playback whenever beat changes
  useEffect(() => {
    if (!beat) {
      stopAll();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime('0:00');
      return;
    }

    setProgress(0);
    setCurrentTime('0:00');
    pausedAtRef.current = 0;
    stopAll();

    if (beat.previewUrl) {
      // Use real audio from Vercel Blob
      setUsingRealAudio(true);
      const audio = new Audio(beat.previewUrl);
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          trackRealProgress(audio);
        })
        .catch(() => {
          // Fallback to synthetic if load fails
          setUsingRealAudio(false);
          playDemo(beat.bpm);
          setIsPlaying(true);
        });
      audio.onended = () => { setIsPlaying(false); setProgress(100); };
    } else {
      // No audio uploaded yet — use synthesized drums
      setUsingRealAudio(false);
      playDemo(beat.bpm);
      setIsPlaying(true);
    }

    return () => stopAll();
  }, [beat]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    if (usingRealAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        cancelAnimationFrame(animRef.current);
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        trackRealProgress(audioRef.current);
        setIsPlaying(true);
      }
    } else {
      if (!audioCtxRef.current) {
        if (beat) { playDemo(beat.bpm); setIsPlaying(true); }
        return;
      }
      if (isPlaying) {
        audioCtxRef.current.suspend();
        cancelAnimationFrame(animRef.current);
        pausedAtRef.current = Date.now() - startTimeRef.current;
        setIsPlaying(false);
      } else {
        audioCtxRef.current.resume();
        simulateProgress(pausedAtRef.current, durationRef.current);
        setIsPlaying(true);
      }
    }
  };

  if (!beat) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-5 px-6 py-4 rounded-2xl bg-[#0d0d1d]/95 backdrop-blur-2xl border border-[#00b4ff]/30 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(0,180,255,0.15)] transition-all duration-500 ${beat ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}
      style={{ minWidth: 'min(540px, calc(100vw - 32px))' }}
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-white text-sm truncate">{beat.title}</div>
        <div className="flex items-center gap-2 text-xs text-[#00b4ff]">
          <span>{beat.bpm} BPM · {beat.key}</span>
          {usingRealAudio ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-[10px] font-semibold">
              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
              Live Audio
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-[#00b4ff]/10 border border-[#00b4ff]/20 text-[#00b4ff]/70 text-[10px] font-semibold">
              Demo Preview
            </span>
          )}
        </div>
      </div>

      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00b4ff] to-[#006ea8] flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,180,255,0.35)] hover:shadow-[0_0_30px_rgba(0,180,255,0.5)] hover:scale-105 transition-all duration-200 text-base flex-shrink-0"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Progress bar */}
      <div className="flex items-center gap-2 flex-shrink-0" style={{ width: '180px' }}>
        <span className="text-[11px] text-[#b0b8c8] tabular-nums w-8 text-right">{currentTime}</span>
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-visible relative">
          <div
            className="h-full bg-gradient-to-r from-[#00b4ff] to-[#80d8ff] rounded-full relative transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#00b4ff] rounded-full shadow-[0_0_8px_#00b4ff]" />
          </div>
        </div>
        <span className="text-[11px] text-[#b0b8c8] tabular-nums w-8">{beat.duration}</span>
      </div>

      {/* Close */}
      <button
        onClick={() => { stopAll(); setIsPlaying(false); setProgress(0); onClose(); }}
        className="text-[#b0b8c8] hover:text-white text-sm p-1 transition-colors duration-200 flex-shrink-0"
        aria-label="Close player"
      >
        ✕
      </button>
    </div>
  );
}
