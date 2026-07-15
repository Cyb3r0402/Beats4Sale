'use client';

import { useState, useCallback } from 'react';
import { Beat, LicenseTier, LICENSE_TIERS } from '../lib/beats';
import { useCart } from './CartContext';

interface LicenseModalProps {
  beat: Beat | null;
  onClose: () => void;
}

export default function LicenseModal({ beat, onClose }: LicenseModalProps) {
  const [selected, setSelected] = useState<LicenseTier>('basic');
  const { addItem, openCart } = useCart();

  const handleAdd = useCallback(() => {
    if (!beat) return;
    addItem(beat, selected);
    onClose();
    openCart();
  }, [beat, selected, addItem, onClose, openCart]);

  if (!beat) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center transition-opacity duration-300 ${beat ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative z-10 bg-[#1a1a28] border border-[#00b4ff]/20 rounded-2xl p-8 w-full max-w-md mx-4 shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-[scale-in_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
        <h3 className="text-xl font-black text-white mb-1">Choose License</h3>
        <p className="text-sm text-[#b0b8c8] mb-6">
          Selecting license for: <strong className="text-[#00b4ff]">{beat.title}</strong>
        </p>

        <div className="flex flex-col gap-3 mb-7">
          {(Object.entries(LICENSE_TIERS) as [LicenseTier, typeof LICENSE_TIERS[LicenseTier]][]).map(
            ([tier, license]) => (
              <button
                key={tier}
                onClick={() => setSelected(tier)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selected === tier
                    ? 'border-[#00b4ff] bg-[#00b4ff]/10'
                    : 'border-[#00b4ff]/15 bg-white/3 hover:border-[#00b4ff]/40 hover:bg-[#00b4ff]/6'
                }`}
              >
                <div>
                  <div className="font-bold text-white text-sm mb-0.5">
                    {license.label}
                    {tier === 'premium' && ' ⭐'}
                    {tier === 'exclusive' && ' 💎'}
                  </div>
                  <div className="text-xs text-[#b0b8c8]">{license.description.slice(0, 55)}...</div>
                </div>
                <div className="text-lg font-black text-white ml-4 shrink-0">
                  ${license.price.toFixed(2)}
                </div>
              </button>
            )
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white font-bold shadow-[0_0_30px_rgba(0,180,255,0.35)] hover:shadow-[0_0_50px_rgba(0,180,255,0.5)] hover:-translate-y-0.5 transition-all duration-200"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
