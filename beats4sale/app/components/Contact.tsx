'use client';

import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <div className="flex items-center gap-2.5 text-[#00b4ff] text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-7 h-0.5 bg-[#00b4ff] rounded-full" />
              📬 Get in Touch
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5">
              Let&apos;s{' '}
              <span className="bg-gradient-to-r from-[#00b4ff] to-[#80d8ff] bg-clip-text text-transparent">
                Connect
              </span>
            </h2>
            <p className="text-[#b0b8c8] leading-relaxed mb-10">
              Have questions about licensing? Want a custom beat? Looking for a collaboration?
              Reach out — we respond within 24 hours.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { icon: '📧', title: 'Email', detail: 'beats4sale@email.com' },
                { icon: '🎵', title: 'SoundCloud', detail: 'soundcloud.com/beats4sale' },
                { icon: '📸', title: 'Instagram', detail: '@beats4sale' },
                { icon: '💬', title: 'Response Time', detail: 'Within 24 hours' },
              ].map(({ icon, title, detail }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#00b4ff]/10 border border-[#00b4ff]/20 flex items-center justify-center text-xl flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">{title}</div>
                    <div className="text-sm text-[#b0b8c8]">{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#13131d] border border-[#00b4ff]/15 rounded-2xl p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                <div className="text-5xl">✅</div>
                <div className="font-black text-white text-xl">Message Sent!</div>
                <div className="text-[#b0b8c8] text-sm max-w-xs">
                  We&apos;ll get back to you within 24 hours.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-[#c0c0c0] mb-2">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Artist name"
                      required
                      className="w-full bg-white/4 border border-[#00b4ff]/15 rounded-xl px-4 py-3 text-white text-sm placeholder-[#b0b8c8]/50 outline-none focus:border-[#00b4ff] focus:bg-[#00b4ff]/5 focus:shadow-[0_0_0_3px_rgba(0,180,255,0.1)] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-[#c0c0c0] mb-2">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="w-full bg-white/4 border border-[#00b4ff]/15 rounded-xl px-4 py-3 text-white text-sm placeholder-[#b0b8c8]/50 outline-none focus:border-[#00b4ff] focus:bg-[#00b4ff]/5 focus:shadow-[0_0_0_3px_rgba(0,180,255,0.1)] transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-[#c0c0c0] mb-2">Subject</label>
                  <select
                    id="contact-subject"
                    className="w-full bg-white/4 border border-[#00b4ff]/15 rounded-xl px-4 py-3 text-[#b0b8c8] text-sm outline-none focus:border-[#00b4ff] transition-all duration-200 cursor-pointer"
                  >
                    <option value="" className="bg-[#13131d]">Select a topic...</option>
                    <option value="licensing" className="bg-[#13131d]">Licensing Question</option>
                    <option value="custom" className="bg-[#13131d]">Custom Beat Request</option>
                    <option value="collab" className="bg-[#13131d]">Collaboration</option>
                    <option value="other" className="bg-[#13131d]">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-[#c0c0c0] mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    placeholder="Tell me what you're working on..."
                    required
                    rows={5}
                    className="w-full bg-white/4 border border-[#00b4ff]/15 rounded-xl px-4 py-3 text-white text-sm placeholder-[#b0b8c8]/50 outline-none focus:border-[#00b4ff] focus:bg-[#00b4ff]/5 focus:shadow-[0_0_0_3px_rgba(0,180,255,0.1)] transition-all duration-200 resize-y"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#00b4ff] to-[#006ea8] text-white font-bold shadow-[0_0_30px_rgba(0,180,255,0.35)] hover:shadow-[0_0_50px_rgba(0,180,255,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  📩 Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
