'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from './CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openCart, items } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0a0f]/92 backdrop-blur-xl border-b border-[#00b4ff]/15 py-3'
            : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-3 group"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <Image
              src="/logo.png"
              alt="Beats4Sale Logo"
              width={48}
              height={48}
              className="drop-shadow-[0_0_12px_rgba(0,180,255,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(0,180,255,0.9)] group-hover:scale-105 transition-all duration-300"
              priority
            />
            <span className="font-[family-name:var(--font-outfit)] text-xl font-black bg-gradient-to-r from-white to-[#00b4ff] bg-clip-text text-transparent">
              Beats4Sale
            </span>
          </a>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {[
              { label: 'Browse Beats', id: 'beats' },
              { label: 'Licensing', id: 'licensing' },
              { label: 'About', id: 'about' },
              { label: 'Contact', id: 'contact' },
            ].map(({ label, id }) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className="text-sm font-medium text-[#b0b8c8] hover:text-white transition-colors relative group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00b4ff] rounded-full group-hover:w-full transition-all duration-300" />
                </button>
              </li>
            ))}
          </ul>

          {/* Cart button */}
          <div className="flex items-center gap-4">
            <button
              onClick={openCart}
              className="relative w-11 h-11 rounded-full flex items-center justify-center text-lg bg-[#00b4ff]/10 border border-[#00b4ff]/15 text-white hover:bg-[#00b4ff]/20 hover:border-[#00b4ff] hover:shadow-[0_0_20px_rgba(0,180,255,0.35)] transition-all duration-300"
              aria-label="Open cart"
            >
              🛒
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00b4ff] text-[#0a0a0f] text-xs font-bold flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64' : 'max-h-0'}`}
        >
          <div className="px-6 pb-4 flex flex-col gap-4 border-t border-[#00b4ff]/10 pt-4 mt-2">
            {[
              { label: 'Browse Beats', id: 'beats' },
              { label: 'Licensing', id: 'licensing' },
              { label: 'About', id: 'about' },
              { label: 'Contact', id: 'contact' },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-sm font-medium text-[#b0b8c8] hover:text-[#00b4ff] transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
