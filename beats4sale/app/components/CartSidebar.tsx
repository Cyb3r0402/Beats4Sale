'use client';

import { useCart } from './CartContext';
import { LICENSE_TIERS, LicenseTier } from '../lib/beats';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateLicense, total } = useCart();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    const btn = document.getElementById('checkout-btn') as HTMLButtonElement;
    if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Checkout failed. Please try again.');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '🔒 Secure Checkout'; }
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[105] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-[110] flex flex-col bg-[#0d0d1d]/98 backdrop-blur-3xl border-l border-[#00b4ff]/20 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-400 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[#00b4ff]/15">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-white">Your Cart</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00b4ff]/15 border border-[#00b4ff]/30 text-[#00b4ff] text-xs font-bold">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-[#b0b8c8] hover:text-white hover:border-white/30 transition-all duration-200"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <div className="text-5xl opacity-30">🎵</div>
              <div className="font-bold text-white text-lg">Your cart is empty</div>
              <div className="text-sm text-[#b0b8c8]">Add some beats to get started!</div>
              <button
                onClick={() => { closeCart(); document.getElementById('beats')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-6 py-2.5 rounded-full border-2 border-[#00b4ff] text-[#00b4ff] text-sm font-bold hover:bg-[#00b4ff]/10 transition-all duration-200 mt-2"
              >
                Browse Beats
              </button>
            </div>
          ) : (
            <div className="px-4 py-4 flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-4 bg-white/3 border border-[#00b4ff]/10 rounded-xl hover:border-[#00b4ff]/20 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0d1a2a] to-[#0a0a0f] border border-[#00b4ff]/15 flex items-center justify-center text-xl flex-shrink-0">
                    🎵
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm truncate mb-1">{item.title}</div>
                    <select
                      value={item.tier}
                      onChange={(e) => updateLicense(item.id, e.target.value as LicenseTier)}
                      className="bg-white/5 border border-[#00b4ff]/15 rounded-md text-[#b0b8c8] text-xs px-2 py-1 cursor-pointer outline-none focus:border-[#00b4ff] transition-colors"
                    >
                      {(Object.entries(LICENSE_TIERS) as [LicenseTier, typeof LICENSE_TIERS[LicenseTier]][]).map(([tier, l]) => (
                        <option key={tier} value={tier} className="bg-[#13131d]">
                          {l.label} — ${l.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-black text-white text-base">${item.price.toFixed(2)}</div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#b0b8c8] hover:text-red-400 text-xs transition-colors mt-1"
                      aria-label={`Remove ${item.title}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-[#00b4ff]/15">
            <div className="flex justify-between text-sm text-[#b0b8c8] mb-2">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6 pt-3 border-t border-[#00b4ff]/10">
              <span className="font-black text-white text-lg">Total</span>
              <span className="font-black text-white text-2xl">${total.toFixed(2)}</span>
            </div>
            <button
              id="checkout-btn"
              onClick={handleCheckout}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white font-black text-base shadow-[0_0_30px_rgba(0,180,255,0.35)] hover:shadow-[0_0_50px_rgba(0,180,255,0.5)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              🔒 Secure Checkout
            </button>
            <div className="flex items-center justify-center gap-3 mt-4 text-xs text-[#b0b8c8]">
              <span>🔒 Secured by</span>
              <span className="font-bold text-[#635bff]">Stripe</span>
              <span>· SSL Encrypted</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
