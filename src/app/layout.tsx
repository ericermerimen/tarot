import type { Metadata } from 'next';
import { Cinzel, Noto_Sans_TC } from 'next/font/google';
import ThemeRegistry from '@/theme/ThemeRegistry';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-cinzel',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-tc',
});

export const metadata: Metadata = {
  title: '🐕 Mystical Dog Tarot | 神秘狗狗塔羅',
  description: 'Divine your future with cute dog-styled tarot cards. Experience mystical readings with adorable canine companions. 用可愛的狗狗塔羅牌占卜你的未來，體驗神秘的命運指引。',
  keywords: 'tarot, divination, fortune telling, dog tarot, 塔羅牌, 占卜, 算命, 狗狗塔羅',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${notoSansTC.variable}`}>
      <body>
        <ThemeRegistry>
          <ParticleBackground />
          <Navigation />
          <main className="main-content">
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
