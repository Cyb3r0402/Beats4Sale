import type { Metadata } from 'next';
import { Outfit, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { CartProvider } from './components/CartContext';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Beats4Sale — Premium Beats by K | Buy Hip-Hop, Trap & R&B Beats',
  description:
    'Buy premium beats online. Exclusive hip-hop, trap, drill, and R&B instrumentals. Instant delivery. Affordable licensing. Made by K — your go-to producer.',
  keywords: 'buy beats online, hip hop beats, trap beats, drill beats, R&B instrumentals, beat store, K producer',
  openGraph: {
    title: 'Beats4Sale — Premium Beats by K',
    description: 'Premium instrumentals. Instant delivery. Worldwide licensing.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#0a0a0f] text-[#b0b8c8] font-[family-name:var(--font-space-grotesk)] overflow-x-hidden">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
