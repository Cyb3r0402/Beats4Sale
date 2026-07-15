'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Incorrect password');
        setLoading(false);
        return;
      }

      // Redirect to admin after successful auth
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,180,255,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/logo.png"
            alt="Beats4Sale"
            width={64}
            height={64}
            className="drop-shadow-[0_0_20px_rgba(0,180,255,0.6)] mb-4"
          />
          <div className="text-white font-black text-2xl mb-1">Admin Access</div>
          <div className="text-[#b0b8c8] text-sm">Enter your password to continue</div>
        </div>

        {/* Card */}
        <div className="bg-[#13131d] border border-[#00b4ff]/20 rounded-2xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-[#c0c0c0] uppercase tracking-wide mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                required
                className="w-full bg-[#0d0d1a] border border-[#00b4ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#b0b8c8]/40 text-sm outline-none focus:border-[#00b4ff] focus:shadow-[0_0_0_3px_rgba(0,180,255,0.12)] transition-all duration-200"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white font-black text-sm shadow-[0_0_30px_rgba(0,180,255,0.3)] hover:shadow-[0_0_50px_rgba(0,180,255,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying…
                </>
              ) : (
                '🔐 Unlock Admin'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-[#b0b8c8]/40">
          🔒 Secured · Beats4Sale Admin Panel
        </div>
      </div>
    </div>
  );
}
