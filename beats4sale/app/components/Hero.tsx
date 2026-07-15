'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let resizeTimer: ReturnType<typeof setTimeout>;

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    setSize();

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setSize, 100);
    };
    window.addEventListener('resize', onResize);

    const drawHeartbeat = (cx: number, cy: number, h: number) => {
      ctx.beginPath();
      ctx.strokeStyle = '#00b4ff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      const pts: [number, number][] = [
        [cx - 80, cy], [cx - 40, cy], [cx - 20, cy - h],
        [cx, cy + h * 0.4], [cx + 20, cy - h * 1.2],
        [cx + 50, cy + h * 0.3], [cx + 70, cy], [cx + 120, cy],
      ];
      pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.stroke();
    };

    const draw = (ts: number) => {
      const t = ts / 1000; // seconds — smooth, frame-rate independent
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const waves = [
        { amp: 28, freq: 0.015, speed: 1.2,  alpha: 0.15, color: '#00b4ff', lw: 1.5 },
        { amp: 18, freq: 0.025, speed: 2.1,  alpha: 0.10, color: '#00b4ff', lw: 1   },
        { amp: 40, freq: 0.008, speed: 0.72, alpha: 0.08, color: '#0077aa', lw: 2   },
      ];

      waves.forEach(({ amp, freq, speed, alpha, color, lw }, i) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.globalAlpha = alpha;
        for (let x = 0; x <= w; x++) {
          const y =
            h / 2 +
            Math.sin(x * freq + t * speed + i * 2) * amp +
            Math.sin(x * freq * 2.3 + t * speed * 0.67) * (amp * 0.4);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      const spikeX = w * 0.5 + Math.sin(t * 0.5) * (w * 0.1);
      drawHeartbeat(spikeX, h / 2, 55);
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      {/* Background */}
      <div className="absolute inset-0 bg-radial-gradient" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,180,255,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 60%, rgba(0,100,180,0.08) 0%, transparent 60%), linear-gradient(180deg, #0a0a0f 0%, #0d0d1a 100%)'
      }} />

      {/* Grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,180,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00b4ff]/10 border border-[#00b4ff]/30 rounded-full px-4 py-1.5 text-[#00b4ff] text-xs font-semibold tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b4ff] animate-pulse" />
              Premium Beat Store — Est. 2024
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white mb-6">
              Elevate Your
              <span className="block bg-gradient-to-r from-[#00b4ff] via-[#80d8ff] to-[#c0c0c0] bg-clip-text text-transparent">
                Sound.
              </span>
            </h1>

            <p className="text-lg text-[#b0b8c8] leading-relaxed max-w-lg mb-10">
              Professional-grade beats crafted for artists who demand the best.
              Instant download, full licensing, worldwide distribution rights.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={() => scrollTo('beats')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white font-semibold shadow-[0_0_30px_rgba(0,180,255,0.35)] hover:shadow-[0_0_50px_rgba(0,180,255,0.5)] hover:-translate-y-0.5 transition-all duration-300"
              >
                🎵 Browse Beats
              </button>
              <button
                onClick={() => scrollTo('licensing')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-[#00b4ff] text-[#00b4ff] font-semibold hover:bg-[#00b4ff]/10 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,180,255,0.35)] transition-all duration-300"
              >
                View Licensing
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-10">
              {[
                { num: '200+', label: 'Beats Available' },
                { num: '1K+', label: 'Artists Served' },
                { num: '5⭐', label: 'Average Rating' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-white font-[family-name:var(--font-outfit)]">
                    {num}
                  </div>
                  <div className="text-xs text-[#b0b8c8]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo Visual */}
          <div className="flex items-center justify-center">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96 flex items-center justify-center">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse,rgba(0,180,255,0.25)_0%,transparent_70%)] animate-pulse" />
              {/* Rings */}
              <div className="absolute w-72 h-72 lg:w-88 lg:h-88 rounded-full border border-[#00b4ff]/20 animate-spin" style={{ animationDuration: '12s' }} />
              <div className="absolute w-[340px] h-[340px] lg:w-[420px] lg:h-[420px] rounded-full border border-dashed border-[#00b4ff]/10 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
              {/* Logo */}
              <Image
                src="/logo.png"
                alt="K Producer Logo"
                width={260}
                height={260}
                className="relative z-10 drop-shadow-[0_0_40px_rgba(0,180,255,0.7)] animate-[float_4s_ease-in-out_infinite]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Waveform Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0 right-0 h-28 w-full"
        aria-hidden="true"
      />
    </section>
  );
}
