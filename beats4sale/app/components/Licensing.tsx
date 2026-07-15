'use client';

import { LICENSE_TIERS, LicenseTier } from '../lib/beats';
import { useCart } from './CartContext';

const TIER_ORDER: LicenseTier[] = ['basic', 'premium', 'exclusive'];
const PRICES = { basic: '29', premium: '79', exclusive: '299' };
const CENTS = { basic: '.99', premium: '.99', exclusive: '.99' };
const FEATURED: LicenseTier = 'premium';

export default function Licensing() {
  const { openCart } = useCart();

  const handleSelect = (tier: LicenseTier) => {
    document.getElementById('beats')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="licensing" className="py-28 px-6 bg-gradient-to-b from-transparent via-[#00b4ff]/3 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-[#00b4ff] text-xs font-bold uppercase tracking-widest mb-3">
            📋 Licensing
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-[#00b4ff] via-[#80d8ff] to-[#c0c0c0] bg-clip-text text-transparent">
              License
            </span>
          </h2>
          <p className="text-[#b0b8c8] max-w-lg mx-auto leading-relaxed">
            Flexible licensing to fit every artist — from independent releases to major label placements.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {TIER_ORDER.map((tier) => {
            const license = LICENSE_TIERS[tier];
            const isFeatured = tier === FEATURED;

            return (
              <div
                key={tier}
                className={`relative flex flex-col rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1.5 ${
                  isFeatured
                    ? 'border-[#00b4ff] bg-gradient-to-b from-[#00b4ff]/8 to-[#13131d] shadow-[0_0_60px_rgba(0,180,255,0.15)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_80px_rgba(0,180,255,0.2)]'
                    : 'border-[#00b4ff]/15 bg-[#13131d] hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]'
                }`}
              >
                {/* Popular badge */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}

                <div className="text-[#00b4ff] text-xs font-bold uppercase tracking-widest mb-3">
                  {tier === 'basic' ? 'Tier 1' : tier === 'premium' ? 'Tier 2' : 'Tier 3'}
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{license.label.split(' ')[0]}</h3>
                <p className="text-sm text-[#b0b8c8] mb-6 leading-relaxed">{license.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-0.5 mb-8">
                  <span className="text-[#b0b8c8] text-lg mt-1">$</span>
                  <span className="text-5xl font-black text-white leading-none">
                    {PRICES[tier]}
                  </span>
                  <span className="text-[#b0b8c8] text-lg">{CENTS[tier]}</span>
                </div>

                {/* Features */}
                <ul className="flex-1 flex flex-col gap-3 mb-8">
                  {license.features.map(({ text, included }) => (
                    <li key={text} className={`flex items-center gap-2.5 text-sm ${included ? 'text-[#b0b8c8]' : 'text-[#b0b8c8]/40'}`}>
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                          included
                            ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                            : 'bg-white/5 border border-white/10 text-[#b0b8c8]'
                        }`}
                      >
                        {included ? '✓' : '✕'}
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleSelect(tier)}
                  className={`w-full py-3.5 rounded-full font-bold text-sm transition-all duration-300 ${
                    isFeatured
                      ? 'bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white shadow-[0_0_30px_rgba(0,180,255,0.35)] hover:shadow-[0_0_50px_rgba(0,180,255,0.5)] hover:-translate-y-0.5'
                      : 'bg-transparent text-[#00b4ff] border-2 border-[#00b4ff]/40 hover:bg-[#00b4ff]/10 hover:border-[#00b4ff]'
                  }`}
                >
                  Get {license.label.split(' ')[0]} License
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
