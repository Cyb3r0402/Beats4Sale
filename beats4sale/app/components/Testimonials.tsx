const TESTIMONIALS = [
  {
    name: 'Lil Denzo',
    role: 'Independent Rapper, Atlanta',
    initials: 'LD',
    gradient: 'from-[#00b4ff] to-[#006ea8]',
    text: '"The beats are absolutely fire. The production quality is on par with what you\'d hear on major label projects. Midnight Frequency became my biggest record."',
  },
  {
    name: 'Nova King',
    role: 'Singer-Songwriter, NYC',
    initials: 'NK',
    gradient: 'from-[#f72585] to-[#b5179e]',
    text: '"Bought three beats and they all hit differently. The checkout was smooth, instant download, and the WAV quality was pristine. 10/10 would recommend."',
  },
  {
    name: 'Ty Wave',
    role: 'UK Rapper & Producer',
    initials: 'TW',
    gradient: 'from-[#00c853] to-[#00796b]',
    text: '"Got the exclusive rights on Steel Pulse and it opened doors I didn\'t expect. The production alone made my EP feel like a full album. Worth every penny."',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-gradient-to-b from-transparent via-[#00b4ff]/2 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-[#00b4ff] text-xs font-bold uppercase tracking-widest mb-3">💬 Reviews</div>
          <h2 className="text-4xl lg:text-5xl font-black text-white">
            What Artists{' '}
            <span className="bg-gradient-to-r from-[#00b4ff] to-[#80d8ff] bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative bg-[#13131d] border border-[#00b4ff]/15 rounded-2xl p-7 hover:border-[#00b4ff]/30 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <span className="absolute top-4 right-5 text-5xl text-[#00b4ff]/10 font-black leading-none select-none">
                "
              </span>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-[#b0b8c8] text-sm leading-relaxed mb-5">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center font-bold text-white text-sm flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-[#b0b8c8]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
