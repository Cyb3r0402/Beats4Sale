import Link from 'next/link';
import Image from 'next/image';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="Beats4Sale" width={80} height={80} className="drop-shadow-[0_0_20px_rgba(0,180,255,0.6)]" />
        </div>
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-black text-white mb-4">Payment Successful!</h1>
        <p className="text-[#b0b8c8] leading-relaxed mb-3">
          Your beats are ready to download. Check your email for download links and license agreements.
        </p>
        <div className="bg-[#00b4ff]/8 border border-[#00b4ff]/20 rounded-2xl p-6 mb-8 text-left">
          <p className="text-sm text-[#b0b8c8] mb-2">🔒 Your purchase is protected by Stripe&apos;s secure payment system.</p>
          <p className="text-sm text-[#b0b8c8]">📧 Download links sent to your email within minutes.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white font-bold shadow-[0_0_30px_rgba(0,180,255,0.35)] hover:shadow-[0_0_50px_rgba(0,180,255,0.5)] hover:-translate-y-0.5 transition-all duration-300"
        >
          🎵 Continue Browsing
        </Link>
      </div>
    </div>
  );
}
