import type { Metadata } from 'next';
import { Space_Mono, Noto_Sans_TC, Cormorant_Garamond } from 'next/font/google';
import { ColorModeProvider } from '@/theme/ColorModeContext';
import ThemeRegistry from '@/theme/ThemeRegistry';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-mono',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-display',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-tc',
});

export const metadata: Metadata = {
  title: 'Mystical Dog Tarot | 神秘狗狗塔羅',
  description: 'Divine your future with cute dog-styled tarot cards. Experience mystical readings with adorable canine companions. 用可愛的狗狗塔羅牌占卜你的未來，體驗神秘的命運指引。',
  keywords: 'tarot, divination, fortune telling, dog tarot, 塔羅牌, 占卜, 算命, 狗狗塔羅',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${cormorantGaramond.variable} ${notoSansTC.variable}`}>
      <body>
        <ColorModeProvider>
          <ThemeRegistry>
            <Navigation />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </ThemeRegistry>
        </ColorModeProvider>
      </body>
    </html>
  );
}
