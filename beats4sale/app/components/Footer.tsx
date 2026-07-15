import Image from 'next/image';

const LINKS = {
  Beats: ['Browse All', 'Trap Beats', 'Hip-Hop Beats', 'Drill Beats', 'R&B Beats'],
  Licensing: ['Basic License', 'Premium License', 'Exclusive Rights', 'Custom Deal'],
  Company: ['About', 'Contact', 'Terms of Service', 'Privacy Policy', 'Refund Policy'],
};

export default function Footer() {
  return (
    <footer className="bg-[#0e0e18] border-t border-[#00b4ff]/15 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Beats4Sale Logo"
              width={52}
              height={52}
              className="mb-4 drop-shadow-[0_0_10px_rgba(0,180,255,0.4)]"
            />
            <p className="text-[#b0b8c8] text-sm leading-relaxed mb-6 max-w-xs">
              Premium beats for artists who take their craft seriously. Professional quality,
              affordable pricing, instant delivery.
            </p>
            <div className="flex gap-2">
              {['📸', '🎵', '▶️', '🐦', '📱'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-[#00b4ff]/15 text-[#b0b8c8] text-sm hover:bg-[#00b4ff]/15 hover:border-[#00b4ff] hover:text-[#00b4ff] hover:-translate-y-0.5 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-black text-white text-sm mb-5">{title}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#b0b8c8] hover:text-[#00b4ff] hover:pl-1 transition-all duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#00b4ff]/30 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#b0b8c8]">
          <span>© 2024 Beats4Sale. All rights reserved. Beats by K.</span>
          <div className="flex gap-5">
            {['Terms', 'Privacy', 'Licensing FAQ'].map((l) => (
              <a key={l} href="#" className="hover:text-[#00b4ff] transition-colors duration-200">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
