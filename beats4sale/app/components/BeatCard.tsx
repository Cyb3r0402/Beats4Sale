'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Beat } from '../lib/beats';
import { useCart } from './CartContext';

interface BeatCardProps {
  beat: Beat;
  onPreview: (beat: Beat) => void;
  onAddToCart: (beat: Beat) => void;
  isPlaying: boolean;
}

export default function BeatCard({ beat, onPreview, onAddToCart, isPlaying }: BeatCardProps) {
  const { inCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const cardInCart = inCart(beat.id);

  const badgeMap = {
    hot: { label: '🔥 Hot', cls: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' },
    new: { label: '✨ New', cls: 'bg-[#00b4ff] text-[#0a0a0f]' },
    exclusive: { label: '💎 Exclusive', cls: 'bg-gradient-to-r from-slate-300 to-white text-[#0a0a0f]' },
  };

  return (
    <div className="group bg-[#13131d] border border-[#00b4ff]/15 rounded-2xl overflow-hidden flex flex-col hover:border-[#00b4ff]/40 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(0,180,255,0.1)] transition-all duration-300">
      {/* Art area */}
      <div
        className="relative h-48 flex items-center justify-center overflow-hidden cursor-pointer"
        style={{ background: `linear-gradient(135deg, ${beat.color1} 0%, ${beat.color2} 100%)` }}
        onClick={() => onPreview(beat)}
      >
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${beat.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,180,255,0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${beat.id})`} />
        </svg>

        {/* Badge */}
        {beat.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${badgeMap[beat.badge].cls}`}>
              {badgeMap[beat.badge].label}
            </span>
          </div>
        )}

        {/* Waveform bars */}
        <div className="flex items-center gap-0.5 h-14 z-10 relative">
          {beat.waveHeights.slice(0, 36).map((h, i) => (
            <div
              key={i}
              className={`w-[3px] rounded-sm transition-all duration-300 ${isPlaying ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'}`}
              style={{
                height: `${h}%`,
                background: isPlaying
                  ? `hsl(${195 + i * 2}, 100%, ${50 + (h / 100) * 30}%)`
                  : '#00b4ff',
                animation: isPlaying ? `wave-bar ${0.6 + (i % 5) * 0.12}s ease-in-out ${(i * 0.03).toFixed(2)}s infinite alternate` : 'none',
              }}
            />
          ))}
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(beat); }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00b4ff] to-[#006ea8] flex items-center justify-center text-white text-2xl shadow-[0_0_30px_rgba(0,180,255,0.5)] hover:scale-110 transition-transform duration-200"
            aria-label={`Preview ${beat.title}`}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-black text-white text-lg mb-1.5 leading-tight">{beat.title}</h3>
        <div className="flex gap-3 text-xs text-[#b0b8c8] mb-3">
          <span>🎵 {beat.bpm} BPM</span>
          <span>🎹 {beat.key}</span>
          <span>⏱ {beat.duration}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
          {beat.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-[#00b4ff]/8 border border-[#00b4ff]/20 rounded-full text-[11px] text-[#00b4ff] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#00b4ff]/10">
          <div>
            <div className="text-[10px] text-[#b0b8c8]">from</div>
            <div className="text-2xl font-black text-white leading-tight">$29.99</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 text-sm ${
                wishlisted
                  ? 'border-pink-500 text-pink-500 bg-pink-500/10'
                  : 'border-[#00b4ff]/15 text-[#b0b8c8] bg-white/5 hover:border-pink-400 hover:text-pink-400'
              }`}
              aria-label="Add to wishlist"
            >
              {wishlisted ? '♥' : '♡'}
            </button>
            <button
              onClick={() => onAddToCart(beat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                cardInCart
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white shadow-[0_0_20px_rgba(0,180,255,0.3)] hover:shadow-[0_0_30px_rgba(0,180,255,0.5)] hover:scale-105'
              }`}
              aria-label={cardInCart ? 'In cart' : 'Add to cart'}
            >
              {cardInCart ? '✓ In Cart' : '+ Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
