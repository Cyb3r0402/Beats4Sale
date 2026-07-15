'use client';

import Image from 'next/image';

const STATS = [
  { num: '200+', label: 'Beats Produced' },
  { num: '5+', label: 'Years Experience' },
  { num: '1K+', label: 'Artists Served' },
  { num: '10+', label: 'Genres Covered' },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-72 h-72 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-radial-gradient" style={{
                background: 'radial-gradient(ellipse, rgba(0,180,255,0.15) 0%, transparent 70%)'
              }} />
              <div
                className="absolute inset-[-20px] rounded-full border border-dashed border-[#00b4ff]/20 animate-spin"
                style={{ animationDuration: '15s' }}
              />
              <Image
                src="/logo.png"
                alt="K Producer Logo"
                width={220}
                height={220}
                className="relative z-10 drop-shadow-[0_0_30px_rgba(0,180,255,0.6)]"
              />
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-2.5 text-[#00b4ff] text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#00b4ff] rounded-full" />
              🎹 The Producer
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5">
              Crafted With{' '}
              <span className="bg-gradient-to-r from-[#00b4ff] to-[#80d8ff] bg-clip-text text-transparent">
                Passion
              </span>
            </h2>
            <p className="text-[#b0b8c8] leading-relaxed mb-4">
              Every beat in this store is hand-crafted to give your music a professional edge.
              From hard-hitting trap bangers to smooth R&B vibes — the sound is always premium,
              always intentional.
            </p>
            <p className="text-[#b0b8c8] leading-relaxed mb-8">
              With years of production experience across multiple genres, K has developed a signature
              sound that blends hard-hitting drums with melodic depth. Artists trust K&apos;s beats because
              they don&apos;t just sound good — they feel right.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {STATS.map(({ num, label }) => (
                <div
                  key={label}
                  className="bg-[#13131d] border border-[#00b4ff]/15 rounded-xl p-5 text-center hover:border-[#00b4ff]/40 hover:bg-[#00b4ff]/5 transition-all duration-300"
                >
                  <div className="text-3xl font-black text-white mb-1">
                    {num.replace('+', '')}<span className="text-[#00b4ff]">+</span>
                  </div>
                  <div className="text-xs text-[#b0b8c8]">{label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => document.getElementById('beats')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white font-semibold shadow-[0_0_30px_rgba(0,180,255,0.35)] hover:shadow-[0_0_50px_rgba(0,180,255,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              🎵 Shop All Beats
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
