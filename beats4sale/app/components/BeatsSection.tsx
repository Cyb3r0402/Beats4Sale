'use client';

import { useState } from 'react';
import { BEATS, Beat } from '../lib/beats';
import BeatCard from './BeatCard';
import LicenseModal from './LicenseModal';
import MiniPlayer from './MiniPlayer';

const FILTERS = ['All', 'Trap', 'Hip-Hop', 'Drill', 'R&B', 'Pop'];

export default function BeatsSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [previewBeat, setPreviewBeat] = useState<Beat | null>(null);
  const [modalBeat, setModalBeat] = useState<Beat | null>(null);

  const filtered =
    activeFilter === 'All'
      ? BEATS
      : BEATS.filter((b) =>
          b.tags.some((t) => t.toLowerCase() === activeFilter.toLowerCase()) ||
          b.moods.some((m) => m.toLowerCase() === activeFilter.toLowerCase())
        );

  return (
    <>
      <section id="beats" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-2.5 text-[#00b4ff] text-xs font-bold uppercase tracking-widest mb-3">
                <span className="w-7 h-0.5 bg-[#00b4ff] rounded-full" />
                🎧 Catalog
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
                Browse{' '}
                <span className="bg-gradient-to-r from-[#00b4ff] via-[#80d8ff] to-[#c0c0c0] bg-clip-text text-transparent">
                  Premium
                </span>{' '}
                Beats
              </h2>
              <p className="text-[#b0b8c8] max-w-lg leading-relaxed">
                Hand-crafted instrumentals across every genre. Preview any beat before you buy.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by genre">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    activeFilter === f
                      ? 'bg-[#00b4ff]/15 border-[#00b4ff] text-[#00b4ff]'
                      : 'bg-[#13131d] border-[#00b4ff]/15 text-[#b0b8c8] hover:border-[#00b4ff]/40 hover:text-[#00b4ff]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((beat) => (
                <BeatCard
                  key={beat.id}
                  beat={beat}
                  onPreview={setPreviewBeat}
                  onAddToCart={setModalBeat}
                  isPlaying={previewBeat?.id === beat.id}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-20 text-[#b0b8c8]">
                No beats found for that genre. Try another filter!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* License Modal */}
      <LicenseModal beat={modalBeat} onClose={() => setModalBeat(null)} />

      {/* Mini Player */}
      <MiniPlayer beat={previewBeat} onClose={() => setPreviewBeat(null)} />
    </>
  );
}
